import { Request, Response } from 'express';
import { NotificationService } from '../services/notification.service';
import { AuthUser } from '../types/user.types';

interface AuthRequest extends Request {
  user?: AuthUser;
}

export class NotificationController {
  // Get notifications for the authenticated customer
  static async getNotifications(req: AuthRequest, res: Response): Promise<void> {
    try {
      const customerId = req.user?.customer_id;
      console.log('[NOTIFICATIONS] getNotifications called for customer:', customerId);

      if (!customerId) {
        console.log('[NOTIFICATIONS] No customer_id found in request');
        res.status(403).json({ message: 'Customer authentication required' });
        return;
      }

      const unreadOnly = req.query.unread === 'true';
      console.log('[NOTIFICATIONS] Fetching notifications - unreadOnly:', unreadOnly);

      const notifications = await NotificationService.getNotifications(customerId, unreadOnly);
      console.log('[NOTIFICATIONS] Found', notifications.length, 'notifications for customer', customerId);
      console.log('[NOTIFICATIONS] Notifications:', JSON.stringify(notifications, null, 2));

      res.status(200).json(notifications);
    } catch (error) {
      console.error('[NOTIFICATIONS] Error fetching notifications:', error);
      res.status(500).json({ message: 'Error fetching notifications', error });
    }
  }

  // Get unread notification count
  static async getUnreadCount(req: AuthRequest, res: Response): Promise<void> {
    try {
      const customerId = req.user?.customer_id;
      console.log('[NOTIFICATIONS] getUnreadCount called for customer:', customerId);

      if (!customerId) {
        console.log('[NOTIFICATIONS] No customer_id found in request');
        res.status(403).json({ message: 'Customer authentication required' });
        return;
      }

      const count = await NotificationService.getUnreadCount(customerId);
      console.log('[NOTIFICATIONS] Unread count for customer', customerId, ':', count);

      res.status(200).json({ count });
    } catch (error) {
      console.error('[NOTIFICATIONS] Error fetching unread count:', error);
      res.status(500).json({ message: 'Error fetching unread count', error });
    }
  }

  // Mark a specific notification as read
  static async markAsRead(req: AuthRequest, res: Response): Promise<void> {
    try {
      const notificationId = parseInt(req.params.id);
      await NotificationService.markAsRead(notificationId);
      res.status(200).json({ message: 'Notification marked as read' });
    } catch (error) {
      res.status(500).json({ message: 'Error marking notification as read', error });
    }
  }

  // Mark all notifications as read for the authenticated customer
  static async markAllAsRead(req: AuthRequest, res: Response): Promise<void> {
    try {
      const customerId = req.user?.customer_id;
      if (!customerId) {
        res.status(403).json({ message: 'Customer authentication required' });
        return;
      }

      await NotificationService.markAllAsRead(customerId);
      res.status(200).json({ message: 'All notifications marked as read' });
    } catch (error) {
      res.status(500).json({ message: 'Error marking all notifications as read', error });
    }
  }

  // Delete a notification
  static async deleteNotification(req: AuthRequest, res: Response): Promise<void> {
    try {
      const notificationId = parseInt(req.params.id);
      await NotificationService.deleteNotification(notificationId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error deleting notification', error });
    }
  }

  static async deleteByType(req: AuthRequest, res: Response): Promise<void> {
    try {
      const customerId = req.user?.customer_id;
      if (!customerId) {
        res.status(403).json({ message: 'Customer authentication required' });
        return;
      }
      const type = req.params.type;
      await NotificationService.deleteByCustomerIdAndType(customerId, type);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error deleting notification by type', error });
    }
  }
}
