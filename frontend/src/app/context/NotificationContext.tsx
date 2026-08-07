import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { listNotifications, markAllNotificationsRead, markNotificationRead } from "../lib/api";
import type { AppNotification } from "../lib/api";

const POLL_INTERVAL_MS = 30000;

type NotificationContextValue = {
  notifications: AppNotification[];
  unreadCount: number;
  loading: boolean;
  refresh: () => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
};

const NotificationContext = createContext<NotificationContextValue | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { token, role } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<number | null>(null);

  const refresh = useCallback(async () => {
    if (!token || !role) return;
    try {
      const res = await listNotifications(token, 50);
      setNotifications(res.notifications);
      setUnreadCount(res.unreadCount);
    } catch {
      // degrade silently; next poll will retry
    } finally {
      setLoading(false);
    }
  }, [token, role]);

  useEffect(() => {
    setLoading(true);
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (!token || !role) return;
    timerRef.current = window.setInterval(refresh, POLL_INTERVAL_MS);
    const onFocus = () => refresh();
    window.addEventListener("focus", onFocus);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      window.removeEventListener("focus", onFocus);
    };
  }, [token, role, refresh]);

  useEffect(() => {
    if (!token) {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [token]);

  const markRead = useCallback(
    (id: string) => {
      setNotifications(prev =>
        prev.map(n => (n.id === id && !n.isRead ? { ...n, isRead: true } : n))
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
      if (token) markNotificationRead(token, id).catch(() => refresh());
    },
    [token, refresh]
  );

  const markAllRead = useCallback(() => {
    if (unreadCount === 0) return;
    setNotifications(prev => prev.map(n => (n.isRead ? n : { ...n, isRead: true })));
    setUnreadCount(0);
    if (token) markAllNotificationsRead(token).catch(() => refresh());
  }, [token, unreadCount, refresh]);

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, loading, refresh, markRead, markAllRead }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be used within a NotificationProvider");
  return ctx;
}
