import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import type { ElementType } from "react";
import {
  Bell, UserPlus, ShoppingCart, FileText, CheckCircle, XCircle, Clock, AlertTriangle,
  Package, Upload, CreditCard, UserCheck, UserX, CheckCheck, ChevronRight,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Btn, Card } from "../../components/shared";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";
import type { AppNotification, NotificationType } from "../../lib/api";

const TYPE_ICON: Record<NotificationType, ElementType> = {
  buyer_registered: UserPlus,
  order_created: ShoppingCart,
  order_quoted: FileText,
  order_approved: CheckCircle,
  order_rejected: XCircle,
  order_in_progress: Clock,
  order_delayed: AlertTriangle,
  order_completed: Package,
  payment_uploaded: Upload,
  payment_approved: CreditCard,
  payment_declined: XCircle,
  account_approved: UserCheck,
  account_suspended: UserX,
};

function timeAgo(iso: string): string {
  try {
    return formatDistanceToNow(new Date(iso), { addSuffix: true });
  } catch {
    return "";
  }
}

function fullTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return "";
  }
}

export function NotificationsView() {
  const { role } = useAuth();
  const { notifications, unreadCount, markRead, markAllRead, refresh } = useNotifications();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<"all" | "unread">("all");

  useEffect(() => {
    refresh();
  }, [refresh]);

  const visible = filter === "unread" ? notifications.filter(n => !n.isRead) : notifications;
  const title = role === "buyer" ? "Notifications" : "Admin Notifications";

  const openItem = (n: AppNotification) => {
    if (!n.isRead) markRead(n.id);
    if (n.link) navigate(n.link);
  };

  return (
    <div className="space-y-5 max-w-3xl" data-testid="notifications-page">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-semibold text-foreground" style={{ fontFamily: "Fraunces, serif" }}>{title}</h2>
          <p className="text-sm text-muted-foreground">{unreadCount > 0 ? `${unreadCount} unread` : "You're all caught up."}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-card rounded-lg border border-border p-1" data-testid="notifications-filter">
            {(["all", "unread"] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${filter === f ? "bg-[#1e5c3a] text-white" : "text-muted-foreground hover:text-foreground"}`}
                data-testid={`notifications-filter-${f}`}>
                {f === "all" ? "All" : "Unread"}
              </button>
            ))}
          </div>
          <Btn variant="secondary" size="sm" onClick={markAllRead} disabled={unreadCount === 0} data-testid="notifications-page-mark-all-read-button">
            <CheckCheck size={13} /> Mark all read
          </Btn>
        </div>
      </div>

      <Card className="overflow-hidden" data-testid="notifications-list-card">
        {visible.length === 0 ? (
          <div className="p-10 text-center" data-testid="notifications-empty">
            <Bell size={28} className="mx-auto mb-3 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {filter === "unread" ? "No unread notifications." : "No notifications yet."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {visible.map(n => {
              const Icon = TYPE_ICON[n.type] || Bell;
              return (
                <button key={n.id} onClick={() => openItem(n)}
                  className={`w-full text-left px-4 py-4 flex items-start gap-4 transition-colors hover:bg-[#f6f4f0] ${n.isRead ? "" : "bg-emerald-50/40"}`} data-testid="notifications-item">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${n.isRead ? "bg-[#edeae3] text-muted-foreground" : "bg-emerald-100 text-emerald-700"}`}>
                    <Icon size={15} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className={`text-sm ${n.isRead ? "font-medium text-foreground" : "font-semibold text-foreground"}`}>{n.title}</p>
                      {!n.isRead && <span className="w-2 h-2 rounded-full bg-[#1e5c3a] flex-shrink-0" />}
                    </div>
                    <p className="text-xs text-muted-foreground leading-snug">{n.body}</p>
                    <p className="text-[10px] text-muted-foreground/70 mt-1">{fullTime(n.createdAt)} · {timeAgo(n.createdAt)}</p>
                  </div>
                  <ChevronRight size={15} className="text-muted-foreground flex-shrink-0 self-center" />
                </button>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
