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
    console.log('[NOTIFICATIONS API] Calling GET /notifications with unreadOnly:', unreadOnly);
    const response = await apiClient.get('/notifications', {
      params: { unread: unreadOnly },
    });
    console.log('[NOTIFICATIONS API] Response:', response.data);
    return response.data;
  },

  // Get count of unread notifications
  getUnreadCount: async (): Promise<number> => {
    console.log('[NOTIFICATIONS API] Calling GET /notifications/unread-count');
    const response = await apiClient.get('/notifications/unread-count');
    console.log('[NOTIFICATIONS API] Unread count:', response.data.count);
    return response.data.count;
  },

  // Mark a specific notification as read
  markAsRead: async (notificationId: number): Promise<void> => {
    console.log('[NOTIFICATIONS API] Marking notification as read:', notificationId);
    await apiClient.put(`/notifications/${notificationId}/read`);
    console.log('[NOTIFICATIONS API] Notification marked as read:', notificationId);
  },

  // Mark all notifications as read
  markAllAsRead: async (): Promise<void> => {
    console.log('[NOTIFICATIONS API] Marking all notifications as read');
    await apiClient.put('/notifications/mark-all-read');
    console.log('[NOTIFICATIONS API] All notifications marked as read');
  },

  // Delete a notification
  deleteNotification: async (notificationId: number): Promise<void> => {
    console.log('[NOTIFICATIONS API] Deleting notification:', notificationId);
    await apiClient.delete(`/notifications/${notificationId}`);
    console.log('[NOTIFICATIONS API] Notification deleted:', notificationId);
  },
};
