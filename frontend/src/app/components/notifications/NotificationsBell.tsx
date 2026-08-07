import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Bell, CheckCheck, ChevronRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";
import { pathFromView } from "../../lib/routes";

const MAX_PREVIEW = 8;

function timeAgo(iso: string): string {
  try {
    return formatDistanceToNow(new Date(iso), { addSuffix: true });
  } catch {
    return "";
  }
}

export function NotificationsBell() {
  const { role } = useAuth();
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const openItem = (n: { id: string; link: string | null }) => {
    markRead(n.id);
    setOpen(false);
    if (n.link) navigate(n.link);
  };

  const viewAllPath = role === "buyer" ? pathFromView("buyer-notifications") : pathFromView("admin-notifications");
  const preview = notifications.slice(0, MAX_PREVIEW);

  return (
    <div ref={wrapRef} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="relative p-2 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
        title="Notifications"
      >
        <Bell size={17} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-[#c47f2e] text-white text-[10px] font-semibold flex items-center justify-center">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-card border border-border rounded-xl shadow-lg z-30 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <p className="text-sm font-semibold text-foreground">Notifications</p>
            <div className="flex items-center gap-2">
              <button
                onClick={markAllRead}
                disabled={unreadCount === 0}
                className="text-xs text-[#1e5c3a] font-medium hover:underline disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <CheckCheck size={13} /> Mark all read
              </button>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-border">
            {preview.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-muted-foreground">You're all caught up.</p>
            ) : (
              preview.map(n => (
                <button
                  key={n.id}
                  onClick={() => openItem(n)}
                  className={`w-full text-left px-4 py-3 flex gap-3 transition-colors hover:bg-[#f6f4f0] ${n.isRead ? "" : "bg-emerald-50/40"}`}
                >
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.isRead ? "bg-transparent" : "bg-[#1e5c3a]"}`} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">{n.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">{n.body}</p>
                    <p className="text-[10px] text-muted-foreground/70 mt-0.5">{timeAgo(n.createdAt)}</p>
                  </div>
                  <ChevronRight size={14} className="text-muted-foreground flex-shrink-0 self-center" />
                </button>
              ))
            )}
          </div>

          <button
            onClick={() => { setOpen(false); navigate(viewAllPath); }}
            className="w-full px-4 py-2.5 border-t border-border text-center text-xs text-[#1e5c3a] font-medium hover:bg-[#f6f4f0] transition-colors"
          >
            View all notifications
          </button>
        </div>
      )}
    </div>
  );
}
