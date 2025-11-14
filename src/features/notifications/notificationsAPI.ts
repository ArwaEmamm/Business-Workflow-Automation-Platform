import axios from 'axios';
import { endpoints } from '../../api/apiEndpoints';
import type { Notification } from '../../types/notification.types';

// Get auth token from localStorage
const getAuthHeaders = () => ({
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
    'Content-Type': 'application/json',
  },
});

export const notificationsAPI = {
  // Fetch all notifications
  fetchNotifications: async (): Promise<Notification[]> => {
    const response = await axios.get(endpoints.notifications.getAll, getAuthHeaders());
    const data = response.data.data || response.data;
    // Normalize ID field: backend may return _id instead of id
    if (Array.isArray(data)) {
      return data.map((n: any) => ({ ...n, id: n.id ?? n._id }));
    }
    return data;
  },

  // Mark notification as read
  markAsRead: async (id: string): Promise<void> => {
    await axios.patch(endpoints.notifications.markRead(id), {}, getAuthHeaders());
  },

  // Mark all notifications as read
  markAllAsRead: async (): Promise<void> => {
    await axios.patch(`${endpoints.notifications.getAll}/read-all`, {}, getAuthHeaders());
  },
};
