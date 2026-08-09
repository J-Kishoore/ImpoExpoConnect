import json
import logging

from groq import Groq

from . import config, tools
from .auth import Identity

logger = logging.getLogger("chatbot")

client = Groq(api_key=config.GROQ_API_KEY)

BASE_SYSTEM_PROMPT = """You are the ImpoExpo Assistant, a helpful chat assistant for ImpoExpoConnect, \
a B2B import/export platform where buyers browse a product catalog and request bulk orders, \
and admins manage products, orders and buyer accounts.

Rules:
- Never guess or make up a product price, order status, or business metric. Always call a tool to get \
real data before stating any specific number, status, or name.
- Only use the tools you have been given for this conversation — if someone asks about something outside \
your current tools (e.g. an anonymous visitor asking about order status or revenue), politely explain they \
need to log in as a buyer or admin to see that, rather than guessing or refusing abruptly.
- For general questions (how to place an order, how the platform works, what happens after an order is \
submitted, etc.) answer directly and concisely from your own knowledge of the platform: buyers browse the \
catalog, request a bulk order for a product, an admin reviews and quotes it, the buyer uploads payment \
proof, and the order proceeds through fulfillment.
- Keep answers short and conversational, suitable for a small chat widget.
"""

MAX_TOOL_ROUNDS = 4


def _system_prompt(identity: Identity | None) -> str:
    if identity is None:
        who = "The current visitor is not logged in (anonymous). You may only discuss the product catalog and general platform questions."
    elif identity.role == "buyer":
        who = f"The current user is a logged-in buyer (email: {identity.email}). You may discuss the catalog, general questions, and this buyer's own orders/account — never another buyer's data."
    else:
        who = f"The current user is a logged-in admin (email: {identity.email}). You may discuss the catalog, general questions, and platform-wide business metrics, orders and buyer accounts."
    return BASE_SYSTEM_PROMPT + "\n" + who


def _build_tools(identity: Identity | None):
    schemas = list(tools.PUBLIC_TOOL_SCHEMAS)
    registry = dict(tools.PUBLIC_TOOL_REGISTRY)

    if identity is not None and identity.role == "buyer":
        schemas += tools.BUYER_TOOL_SCHEMAS
        uid = identity.uid
        registry["list_my_orders"] = lambda: tools.list_my_orders(uid)
        registry["get_order_status"] = lambda order_code: tools.get_order_status(uid, order_code)
        registry["get_my_account_status"] = lambda: tools.get_my_account_status(uid)

    if identity is not None and identity.role == "admin":
        schemas += tools.ADMIN_TOOL_SCHEMAS
        registry.update(tools.ADMIN_TOOL_REGISTRY)

    return schemas, registry


def _run_tool(registry: dict, name: str, arguments: dict):
    fn = registry.get(name)
    if fn is None:
        logger.warning("Model requested unknown/unauthorized tool: %s", name)
        return {"error": f"Unknown or unauthorized tool: {name}"}
    try:
        result = fn(**arguments)
        logger.info("tool %s(%s) -> %s", name, arguments, result)
        return result
    except Exception as exc:  # tool execution failure shouldn't crash the chat
        logger.exception("tool %s(%s) raised an exception", name, arguments)
        return {"error": str(exc)}


def get_reply(message: str, history: list[dict], identity: Identity | None = None) -> str:
    tool_schemas, tool_registry = _build_tools(identity)

    messages = [{"role": "system", "content": _system_prompt(identity)}]
    for turn in history[-10:]:
        role = turn.get("role")
        content = turn.get("content")
        if role in ("user", "assistant") and content:
            messages.append({"role": role, "content": content})
    messages.append({"role": "user", "content": message})

    for round_num in range(MAX_TOOL_ROUNDS):
        response = client.chat.completions.create(
            model=config.GROQ_MODEL,
            messages=messages,
            tools=tool_schemas,
            tool_choice="auto",
        )
        choice = response.choices[0].message

        if not choice.tool_calls:
            return choice.content or "Sorry, I couldn't come up with a reply."

        messages.append(
            {
                "role": "assistant",
                "content": choice.content,
                "tool_calls": [
                    {
                        "id": tc.id,
                        "type": "function",
                        "function": {"name": tc.function.name, "arguments": tc.function.arguments},
                    }
                    for tc in choice.tool_calls
                ],
            }
        )

        for tool_call in choice.tool_calls:
            arguments = json.loads(tool_call.function.arguments or "{}")
            result = _run_tool(tool_registry, tool_call.function.name, arguments)
            messages.append(
                {
                    "role": "tool",
                    "tool_call_id": tool_call.id,
                    "content": json.dumps(result),
                }
            )

        logger.info("round %s/%s used tool(s), asking again", round_num + 1, MAX_TOOL_ROUNDS)

    logger.warning("hit MAX_TOOL_ROUNDS (%s) without a final answer, forcing a text-only reply", MAX_TOOL_ROUNDS)
    response = client.chat.completions.create(model=config.GROQ_MODEL, messages=messages, tool_choice="none")
    content = response.choices[0].message.content
    return content or "Sorry, I'm having trouble looking that up right now. Please try again."
