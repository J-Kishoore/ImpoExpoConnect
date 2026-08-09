const CHATBOT_API_URL = import.meta.env.VITE_CHATBOT_API_URL || "http://localhost:8000";

export type ChatTurn = { role: "user" | "assistant"; content: string };

export async function sendChatMessage(message: string, history: ChatTurn[]): Promise<{ reply: string }> {
  const res = await fetch(`${CHATBOT_API_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, history }),
  });
  if (!res.ok) throw new Error("Chatbot service request failed");
  return res.json();
}
