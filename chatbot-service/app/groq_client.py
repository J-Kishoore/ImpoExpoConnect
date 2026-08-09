import json

from groq import Groq

from . import config
from .tools import TOOL_REGISTRY, TOOL_SCHEMAS

client = Groq(api_key=config.GROQ_API_KEY)

SYSTEM_PROMPT = """You are the ImpoExpo Assistant, a helpful chat assistant for ImpoExpoConnect, \
a B2B import/export platform where buyers browse a product catalog and request bulk orders, \
and admins manage products, stock and orders.

Rules:
- Never guess or make up a stock quantity, price, or product list. Always call a tool to get \
real data before stating any specific number or product name.
- For general questions (how to place an order, how the platform works, what happens after an \
order is submitted, etc.) answer directly and concisely from your own knowledge of the platform: \
buyers browse the catalog, request a bulk order for a product, an admin reviews and quotes it, \
the buyer uploads payment proof, and the order proceeds through fulfillment.
- Keep answers short and conversational, suitable for a small chat widget.
"""

MAX_TOOL_ROUNDS = 4


def _run_tool(name: str, arguments: dict):
    fn = TOOL_REGISTRY.get(name)
    if fn is None:
        return {"error": f"Unknown tool: {name}"}
    try:
        return fn(**arguments)
    except Exception as exc:  # tool execution failure shouldn't crash the chat
        return {"error": str(exc)}


def get_reply(message: str, history: list[dict]) -> str:
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    for turn in history[-10:]:
        role = turn.get("role")
        content = turn.get("content")
        if role in ("user", "assistant") and content:
            messages.append({"role": role, "content": content})
    messages.append({"role": "user", "content": message})

    for _ in range(MAX_TOOL_ROUNDS):
        response = client.chat.completions.create(
            model=config.GROQ_MODEL,
            messages=messages,
            tools=TOOL_SCHEMAS,
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
            result = _run_tool(tool_call.function.name, arguments)
            messages.append(
                {
                    "role": "tool",
                    "tool_call_id": tool_call.id,
                    "content": json.dumps(result),
                }
            )

    return "Sorry, I'm having trouble looking that up right now. Please try again."
