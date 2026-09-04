import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import axiosInstance from "./axiosInstance";

const NOTIFICATION_WS_URL = "http://localhost:8085";

let stompClient: Client | null = null;

export const connectWebSocket = (
  userId: number,
  accessToken: string,
  onNotification: (notification: any) => void,
) => {
  stompClient = new Client({
    webSocketFactory: () =>
      new SockJS(`${NOTIFICATION_WS_URL}/ws?token=${accessToken}`),

    onConnect: () => {
      console.log("WebSocket connected ✅");
      //   stompClient?.subscribe(
      //     `/user/${userId}/queue/notifications`,
      //     (message) => {
      //       const notification = JSON.parse(message.body);
      //       onNotification(notification);
      //     },
      //   );

      stompClient?.subscribe(`/topic/notifications-${userId}`, (message) => {
        console.log("Received from topic:", message.body);
        const notification = JSON.parse(message.body);
        onNotification(notification);
      });
    },

    onDisconnect: () => {
      console.log("WebSocket disconnected");
    },

    onStompError: (frame) => {
      console.error("STOMP error:", frame);
    },

    reconnectDelay: 5000,
  });

  stompClient.activate();
};

export const disconnectWebSocket = () => {
  if (stompClient) {
    stompClient.deactivate();
    stompClient = null;
  }
};

export const notificationService = {
  getMyNotifications: async () => {
    const response = await axiosInstance.get("/notifications");
    return response.data;
  },

  getUnreadCount: async () => {
    const response = await axiosInstance.get("/notifications/unread/count");
    return response.data;
  },

  getUnreadNotifications: async () => {
    const response = await axiosInstance.get("/notifications/unread");
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await axiosInstance.put("/notifications/read-all");
    return response.data;
  },

  markAsRead: async (id: number) => {
    const response = await axiosInstance.put(`/notifications/${id}/read`);
    return response.data;
  },
};
