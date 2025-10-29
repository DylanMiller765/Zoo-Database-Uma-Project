import apiClient from '@/lib/api';

export interface Notification {
  notification_id: number;
  customer_id: number;
  message: string;
  notification_type: 'info' | 'warning' | 'alert';
  is_read: boolean;
  created_at: string;
}

export const notificationService = {
  // Get all notifications (or unread only)
  getNotifications: async (unreadOnly: boolean = false): Promise<Notification[]> => {
    const response = await apiClient.get('/notifications', {
      params: { unread: unreadOnly },
    });
    return response.data;
  },

  // Get count of unread notifications
  getUnreadCount: async (): Promise<number> => {
    const response = await apiClient.get('/notifications/unread-count');
    return response.data.count;
  },

  // Mark a specific notification as read
  markAsRead: async (notificationId: number): Promise<void> => {
    await apiClient.put(`/notifications/${notificationId}/read`);
  },

  // Mark all notifications as read
  markAllAsRead: async (): Promise<void> => {
    await apiClient.put('/notifications/mark-all-read');
  },

  // Delete a notification
  deleteNotification: async (notificationId: number): Promise<void> => {
    await apiClient.delete(`/notifications/${notificationId}`);
  },
};
