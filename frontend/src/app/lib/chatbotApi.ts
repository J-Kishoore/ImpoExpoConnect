import { getChatDeviceId } from "./chatDeviceId";

const CHATBOT_API_URL = import.meta.env.VITE_CHATBOT_API_URL || "http://localhost:8000";

export type Conversation = { id: string; title: string; createdAt: string; updatedAt: string };
export type ChatMessageRecord = { id: string; role: "user" | "assistant"; content: string; createdAt: string };

function ownerHeaders(token?: string | null): HeadersInit {
  return token ? { Authorization: `Bearer ${token}` } : { "X-Chat-Device-Id": getChatDeviceId() };
}

async function request<T>(path: string, options: RequestInit, token?: string | null): Promise<T> {
  const res = await fetch(`${CHATBOT_API_URL}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...ownerHeaders(token), ...options.headers },
  });
  if (!res.ok) throw new Error("Chatbot service request failed");
  return res.json();
}

export function listConversations(token?: string | null) {
  return request<{ conversations: Conversation[] }>("/conversations", { method: "GET" }, token);
}

export function createConversation(token?: string | null) {
  return request<Conversation>("/conversations", { method: "POST" }, token);
}

export function getConversationMessages(conversationId: string, token?: string | null) {
  return request<{ messages: ChatMessageRecord[] }>(`/conversations/${conversationId}/messages`, { method: "GET" }, token);
}

export function deleteConversation(conversationId: string, token?: string | null) {
  return request<{ deleted: true }>(`/conversations/${conversationId}`, { method: "DELETE" }, token);
}

export function sendChatMessage(message: string, conversationId: string | null, token?: string | null) {
  return request<{ reply: string; conversationId: string }>(
    "/chat",
    { method: "POST", body: JSON.stringify({ message, conversationId }) },
    token
  );
}
