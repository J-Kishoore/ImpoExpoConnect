import { useState } from "react";
import { MessageCircle, X, Send, Paperclip } from "lucide-react";
import { chatMessages } from "../../data";

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState(chatMessages);
  const [input, setInput] = useState("");

  const send = () => {
    if (!input.trim()) return;
    const userMsg = { id: msgs.length + 1, from: "user", text: input, time: "Now" };
    const botMsg = { id: msgs.length + 2, from: "assistant", text: "Thank you for your query. Our team will follow up shortly, or you can place a bulk order request directly from the catalog.", time: "Now" };
    setMsgs([...msgs, userMsg, botMsg]);
    setInput("");
  };

  return (
    <div className="fixed bottom-6 left-6 z-40">
      {open && (
        <div className="mb-3 w-80 bg-card rounded-xl border border-border shadow-2xl flex flex-col overflow-hidden" style={{ height: 420 }}>
          <div className="bg-[#1a2e1f] px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center">
                <MessageCircle size={14} className="text-white" />
              </div>
              <div>
                <p className="text-white text-sm font-medium">ImpoExpo Assistant</p>
                <p className="text-emerald-300 text-xs">Online</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/60 hover:text-white"><X size={16} /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-[#f6f4f0]">
            {msgs.map(m => (
              <div key={m.id} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${m.from === "user" ? "bg-[#1e5c3a] text-white rounded-br-sm" : "bg-white text-[#1c1917] border border-border rounded-bl-sm"}`}>
                  {m.text}
                  <p className={`text-xs mt-1 ${m.from === "user" ? "text-emerald-200" : "text-muted-foreground"}`}>{m.time}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="p-2 border-t border-border bg-white flex items-center gap-2">
            <button className="p-1.5 text-muted-foreground hover:text-foreground"><Paperclip size={15} /></button>
            <input
              value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()}
              className="flex-1 text-sm bg-transparent outline-none placeholder:text-muted-foreground"
              placeholder="Type a message..."
            />
            <button onClick={send} className="p-1.5 bg-[#1e5c3a] text-white rounded-lg hover:bg-[#174d30]"><Send size={14} /></button>
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        className="w-12 h-12 rounded-full bg-[#1e5c3a] text-white shadow-lg flex items-center justify-center hover:bg-[#174d30] transition-all"
      >
        {open ? <X size={20} /> : <MessageCircle size={20} />}
      </button>
    </div>
  );
}
