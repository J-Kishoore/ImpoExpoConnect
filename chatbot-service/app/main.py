import logging

from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from . import config, conversations
from .auth import get_identity
from .groq_client import get_reply
from .owner import resolve_owner

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")

app = FastAPI(title="ImpoExpoConnect Chatbot Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=config.CORS_ORIGINS,
    allow_methods=["GET", "POST", "DELETE"],
    allow_headers=["Content-Type", "Authorization", "X-Chat-Device-Id"],
)


def _require_owner(authorization: str | None, x_chat_device_id: str | None) -> tuple[str, str]:
    owner = resolve_owner(get_identity(authorization), x_chat_device_id)
    if owner is None:
        raise HTTPException(400, "Missing Authorization token or X-Chat-Device-Id header.")
    return owner


class ChatRequest(BaseModel):
    message: str
    conversationId: str | None = None


class ChatResponse(BaseModel):
    reply: str
    conversationId: str


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/conversations")
def list_conversations_route(
    authorization: str | None = Header(default=None),
    x_chat_device_id: str | None = Header(default=None),
):
    owner_type, owner_id = _require_owner(authorization, x_chat_device_id)
    return {"conversations": conversations.list_conversations(owner_type, owner_id)}


@app.post("/conversations")
def create_conversation_route(
    authorization: str | None = Header(default=None),
    x_chat_device_id: str | None = Header(default=None),
):
    owner_type, owner_id = _require_owner(authorization, x_chat_device_id)
    return conversations.create_conversation(owner_type, owner_id)


@app.get("/conversations/{conversation_id}/messages")
def list_messages_route(
    conversation_id: str,
    authorization: str | None = Header(default=None),
    x_chat_device_id: str | None = Header(default=None),
):
    owner_type, owner_id = _require_owner(authorization, x_chat_device_id)
    if not conversations.owns_conversation(conversation_id, owner_type, owner_id):
        raise HTTPException(404, "Conversation not found.")
    return {"messages": conversations.list_messages(conversation_id)}


@app.delete("/conversations/{conversation_id}")
def delete_conversation_route(
    conversation_id: str,
    authorization: str | None = Header(default=None),
    x_chat_device_id: str | None = Header(default=None),
):
    owner_type, owner_id = _require_owner(authorization, x_chat_device_id)
    if not conversations.owns_conversation(conversation_id, owner_type, owner_id):
        raise HTTPException(404, "Conversation not found.")
    conversations.delete_conversation(conversation_id)
    return {"deleted": True}


@app.post("/chat", response_model=ChatResponse)
def chat(
    payload: ChatRequest,
    authorization: str | None = Header(default=None),
    x_chat_device_id: str | None = Header(default=None),
):
    identity = get_identity(authorization)
    owner_type, owner_id = _require_owner(authorization, x_chat_device_id)

    if payload.conversationId:
        if not conversations.owns_conversation(payload.conversationId, owner_type, owner_id):
            raise HTTPException(404, "Conversation not found.")
        conversation_id = payload.conversationId
    else:
        conversation_id = conversations.create_conversation(owner_type, owner_id)["id"]

    history = conversations.list_messages(conversation_id, limit=20)
    reply = get_reply(payload.message, history, identity)

    conversations.append_message(conversation_id, "user", payload.message)
    conversations.append_message(conversation_id, "assistant", reply)

    return ChatResponse(reply=reply, conversationId=conversation_id)
