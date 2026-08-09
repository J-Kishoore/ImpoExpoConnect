import { useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";
import { MessageCircle, X, Send, Paperclip, History, Plus, ArrowLeft, Trash2 } from "lucide-react";
import {
  sendChatMessage,
  listConversations,
  createConversation,
  getConversationMessages,
  deleteConversation,
  type Conversation,
  type ChatMessageRecord,
} from "../../lib/chatbotApi";
import { useAuth } from "../../context/AuthContext";

function formatTime(iso: string) {
  return new Date(iso).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

let localIdCounter = 0;
function localMessage(role: "user" | "assistant", content: string): ChatMessageRecord {
  localIdCounter += 1;
  return { id: `local-${localIdCounter}`, role, content, createdAt: new Date().toISOString() };
}

export function ChatWidget() {
  const { token } = useAuth();
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<"chat" | "list">("chat");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [msgs, setMsgs] = useState<ChatMessageRecord[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && view === "chat") messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, sending, loadingMessages, view, open]);

  useEffect(() => {
    let cancelled = false;
    setActiveConversationId(null);
    setMsgs([]);
    listConversations(token)
      .then(({ conversations: list }) => {
        if (cancelled) return;
        setConversations(list);
        if (list.length > 0) loadConversation(list[0].id);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const loadConversation = (id: string) => {
    setActiveConversationId(id);
    setLoadingMessages(true);
    setView("chat");
    getConversationMessages(id, token)
      .then(({ messages }) => setMsgs(messages))
      .catch(() => setMsgs([]))
      .finally(() => setLoadingMessages(false));
  };

  const startNewConversation = async () => {
    try {
      const conversation = await createConversation(token);
      setConversations(current => [conversation, ...current]);
      setActiveConversationId(conversation.id);
      setMsgs([]);
      setView("chat");
    } catch {
      // If creation fails, sending a message will still auto-create one server-side.
      setActiveConversationId(null);
      setMsgs([]);
      setView("chat");
    }
  };

  const removeConversation = async (id: string, e: MouseEvent) => {
    e.stopPropagation();
    setConversations(current => current.filter(c => c.id !== id));
    if (id === activeConversationId) {
      setActiveConversationId(null);
      setMsgs([]);
    }
    try {
      await deleteConversation(id, token);
    } catch {
      // best-effort — the row is already removed locally
    }
  };

  const send = async () => {
    if (!input.trim() || sending) return;
    const text = input;
    setMsgs(current => [...current, localMessage("user", text)]);
    setInput("");
    setSending(true);
    try {
      const { reply, conversationId } = await sendChatMessage(text, activeConversationId, token);
      setMsgs(current => [...current, localMessage("assistant", reply)]);
      if (conversationId !== activeConversationId) {
        setActiveConversationId(conversationId);
        setConversations(current => [
          { id: conversationId, title: text.slice(0, 48), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          ...current,
        ]);
      } else {
        setConversations(current => {
          const match = current.find(c => c.id === conversationId);
          if (!match) return current;
          return [{ ...match, updatedAt: new Date().toISOString() }, ...current.filter(c => c.id !== conversationId)];
        });
      }
    } catch {
      setMsgs(current => [
        ...current,
        localMessage("assistant", "Sorry, I'm having trouble connecting right now. Please try again shortly."),
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-40" data-testid="chat-widget">
      {open && (
        <div className="mb-3 w-80 bg-card rounded-xl border border-border shadow-2xl flex flex-col overflow-hidden" style={{ height: 420 }} data-testid="chat-widget-window">
          <div className="bg-[#1a2e1f] px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center">
                <MessageCircle size={14} className="text-white" />
              </div>
              <div>
                <p className="text-white text-sm font-medium">ImpoExpo Assistant</p>
                <p className="text-emerald-300 text-xs">{view === "list" ? "Your conversations" : "Online"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {view === "chat" ? (
                <button onClick={() => setView("list")} className="text-white/60 hover:text-white" data-testid="chat-widget-history-button" aria-label="Conversation history"><History size={16} /></button>
              ) : (
                <button onClick={() => setView("chat")} className="text-white/60 hover:text-white" data-testid="chat-widget-back-button" aria-label="Back to chat"><ArrowLeft size={16} /></button>
              )}
              <button onClick={startNewConversation} className="text-white/60 hover:text-white" data-testid="chat-widget-new-button" aria-label="New conversation"><Plus size={16} /></button>
              <button onClick={() => setOpen(false)} className="text-white/60 hover:text-white" data-testid="chat-widget-close-button" aria-label="Close chat"><X size={16} /></button>
            </div>
          </div>

          {view === "list" ? (
            <div className="flex-1 overflow-y-auto p-2 space-y-1 bg-[#f6f4f0]" data-testid="chat-widget-conversation-list">
              {conversations.length === 0 && (
                <p className="text-sm text-muted-foreground text-center mt-6">No conversations yet.</p>
              )}
              {conversations.map(c => (
                <div
                  key={c.id}
                  className={`w-full rounded-lg px-3 py-2 text-sm bg-white border border-border hover:bg-emerald-50 flex items-center justify-between gap-2 ${c.id === activeConversationId ? "ring-1 ring-emerald-500" : ""}`}
                >
                  <button onClick={() => loadConversation(c.id)} className="min-w-0 flex-1 text-left" data-testid="chat-widget-conversation-item">
                    <span className="block truncate text-[#1c1917]">{c.title}</span>
                    <span className="block text-xs text-muted-foreground">{formatTime(c.updatedAt)}</span>
                  </button>
                  <button onClick={e => removeConversation(c.id, e)} className="text-muted-foreground hover:text-red-600 shrink-0" aria-label="Delete conversation"><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-[#f6f4f0]">
              {msgs.length === 0 && !loadingMessages && (
                <p className="text-sm text-muted-foreground text-center mt-6">
                  Ask me about products, pricing{token ? ", or your orders" : ""}!
                </p>
              )}
              {msgs.map(m => (
                <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${m.role === "user" ? "bg-[#1e5c3a] text-white rounded-br-sm" : "bg-white text-[#1c1917] border border-border rounded-bl-sm"}`}>
                    {m.content}
                    <p className={`text-xs mt-1 ${m.role === "user" ? "text-emerald-200" : "text-muted-foreground"}`}>{formatTime(m.createdAt)}</p>
                  </div>
                </div>
              ))}
              {(sending || loadingMessages) && (
                <div className="flex justify-start" data-testid="chat-widget-typing">
                  <div className="max-w-[80%] rounded-xl px-3 py-2 text-sm bg-white text-muted-foreground border border-border rounded-bl-sm">
                    {loadingMessages ? "Loading..." : "Typing..."}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}

          <div className="p-2 border-t border-border bg-white flex items-center gap-2">
            <button className="p-1.5 text-muted-foreground hover:text-foreground" data-testid="chat-widget-attach-button" aria-label="Attach file"><Paperclip size={15} /></button>
            <input
              value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()}
              className="flex-1 text-sm bg-transparent outline-none placeholder:text-muted-foreground"
              placeholder="Type a message..." name="chatMessage" data-testid="chat-widget-input"
            />
            <button onClick={send} className="p-1.5 bg-[#1e5c3a] text-white rounded-lg hover:bg-[#174d30]" data-testid="chat-widget-send-button" aria-label="Send message"><Send size={14} /></button>
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        className="w-12 h-12 rounded-full bg-[#1e5c3a] text-white shadow-lg flex items-center justify-center hover:bg-[#174d30] transition-all" data-testid="chat-widget-toggle-button" aria-label={open ? "Close chat" : "Open chat"}
      >
        {open ? <X size={20} /> : <MessageCircle size={20} />}
      </button>
    </div>
  );
}
