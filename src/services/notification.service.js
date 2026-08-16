//src/services/notification.service.js

import apiClient from "../api/apiClient";
import { ENDPOINTS } from "../api/endpoints";

export const notificationService = {
  getMyNotifications: async ({ skip = 0, limit = 20 } = {}) => {
    const response = await apiClient.get(ENDPOINTS.notifications.list, {
      params: { skip, limit },
    });

    return response.data;
  },

  markAsRead: async (notificationId) => {
    const response = await apiClient.patch(
      ENDPOINTS.notifications.markAsRead(notificationId)
    );

    return response.data;
  },

  markAllAsRead: async () => {
    const response = await apiClient.patch(ENDPOINTS.notifications.readAll);

    return response.data;
  },
};
