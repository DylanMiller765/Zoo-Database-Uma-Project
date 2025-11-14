import { Notification, NotificationModel } from '../models/notification.model';

export class NotificationService {
  static async getNotifications(customerId: number, unreadOnly: boolean = false): Promise<Notification[]> {
    return await NotificationModel.findByCustomerId(customerId, unreadOnly);
  }

  static async markAsRead(notificationId: number): Promise<void> {
    return await NotificationModel.markAsRead(notificationId);
  }

  static async markAllAsRead(customerId: number): Promise<void> {
    return await NotificationModel.markAllAsReadForCustomer(customerId);
  }

  static async createNotification(notification: Omit<Notification, 'notification_id' | 'created_at'>): Promise<Notification> {
    return await NotificationModel.create(notification);
  }

  static async deleteNotification(notificationId: number): Promise<void> {
    return await NotificationModel.delete(notificationId);
  }

  static async deleteByCustomerIdAndType(customerId: number, type: string): Promise<void> {
    return await NotificationModel.deleteByCustomerIdAndType(customerId, type);
  }

  static async getUnreadCount(customerId: number): Promise<number> {
    return await NotificationModel.getUnreadCount(customerId);
  }
}
