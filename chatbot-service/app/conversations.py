from datetime import datetime, timezone

from .firebase_client import db

CONVERSATIONS = "chatConversations"
MESSAGES = "chatMessages"

TITLE_MAX_LEN = 48


def _now():
    return datetime.now(timezone.utc).isoformat()


def _conversation_dict(doc):
    data = doc.to_dict()
    return {
        "id": doc.id,
        "title": data.get("title") or "New conversation",
        "createdAt": data.get("createdAt"),
        "updatedAt": data.get("updatedAt"),
    }


def _message_dict(doc):
    data = doc.to_dict()
    return {"id": doc.id, "role": data.get("role"), "content": data.get("content"), "createdAt": data.get("createdAt")}


def create_conversation(owner_type: str, owner_id: str):
    now = _now()
    doc_ref = db.collection(CONVERSATIONS).add(
        {"ownerType": owner_type, "ownerId": owner_id, "title": None, "createdAt": now, "updatedAt": now}
    )[1]
    return _conversation_dict(doc_ref.get())


def list_conversations(owner_type: str, owner_id: str):
    # Two equality filters, no orderBy — sort in memory, consistent with the rest of the codebase
    # (see backend/src/services/notificationService.js) which avoids composite-index requirements.
    docs = (
        db.collection(CONVERSATIONS)
        .where("ownerType", "==", owner_type)
        .where("ownerId", "==", owner_id)
        .stream()
    )
    conversations = [_conversation_dict(doc) for doc in docs]
    conversations.sort(key=lambda c: c["updatedAt"] or "", reverse=True)
    return conversations


def get_conversation(conversation_id: str):
    doc = db.collection(CONVERSATIONS).document(conversation_id).get()
    if not doc.exists:
        return None
    return {"id": doc.id, **doc.to_dict()}


def owns_conversation(conversation_id: str, owner_type: str, owner_id: str) -> bool:
    conversation = get_conversation(conversation_id)
    return conversation is not None and conversation["ownerType"] == owner_type and conversation["ownerId"] == owner_id


def list_messages(conversation_id: str, limit: int | None = None):
    docs = db.collection(MESSAGES).where("conversationId", "==", conversation_id).stream()
    messages = [_message_dict(doc) for doc in docs]
    messages.sort(key=lambda m: m["createdAt"] or "")
    return messages[-limit:] if limit else messages


def append_message(conversation_id: str, role: str, content: str):
    now = _now()
    db.collection(MESSAGES).add({"conversationId": conversation_id, "role": role, "content": content, "createdAt": now})

    conversation_ref = db.collection(CONVERSATIONS).document(conversation_id)
    patch = {"updatedAt": now}
    if role == "user":
        conversation = conversation_ref.get().to_dict() or {}
        if not conversation.get("title"):
            title = content.strip().replace("\n", " ")
            patch["title"] = title[:TITLE_MAX_LEN] + ("…" if len(title) > TITLE_MAX_LEN else "")
    conversation_ref.update(patch)


def delete_conversation(conversation_id: str):
    for doc in db.collection(MESSAGES).where("conversationId", "==", conversation_id).stream():
        doc.reference.delete()
    db.collection(CONVERSATIONS).document(conversation_id).delete()
