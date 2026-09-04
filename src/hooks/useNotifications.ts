import { useEffect, useState } from "react";
import {
  connectWebSocket,
  disconnectWebSocket,
} from "../services/notificationService";
import { notificationService } from "../services/notificationService";
import { useAppSelector } from "../store/hook";

export interface Notification {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: string;
  read: boolean;
  data: string;
  createdAt: string;
}

export function useNotifications() {
  const { user, accessToken } = useAppSelector((state) => state.auth);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user || !accessToken) return;

    console.log("Connecting WebSocket for userId:", user.id);

    // Fetch existing notifications
    notificationService.getMyNotifications().then((data) => {
      setNotifications(data);
      const unread = data.filter((n: Notification) => !n.read).length;
      setUnreadCount(unread);
    });

    // Connect WebSocket
    connectWebSocket(
      Number(user.id),
      accessToken,
      (newNotification: Notification) => {
        console.log("New notification received:", newNotification);
        setNotifications((prev) => [newNotification, ...prev]);
        setUnreadCount((prev) => prev + 1);
      },
    );

    return () => {
      disconnectWebSocket();
    };
  }, [user, accessToken]);

  const markAllAsRead = async () => {
    await notificationService.markAllAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const markAsRead = async (id: number) => {
    await notificationService.markAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  return { notifications, unreadCount, markAllAsRead, markAsRead };
}
