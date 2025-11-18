import { Request, Response } from 'express';
import { NotificationService } from '../services/notification.service';
import { AuthUser } from '../types/user.types';
import { UserRole } from '../types/role.types';

interface AuthRequest extends Request {
  user?: AuthUser;
}

export class NotificationController {

  // Define the allowed roles helper list (reused in methods below)
  private static readonly allowedEmployeeRoles = [
    UserRole.EMPLOYEE,
    UserRole.KEEPER,
    UserRole.MANAGER,
    UserRole.COORDINATOR,
    UserRole.CASHIER,
    UserRole.GUIDE,
    UserRole.VETERINARIAN,
    UserRole.MAINTENANCE,
    UserRole.SECURITY,
    UserRole.OTHER,
  ];

  // Get notifications for the authenticated user
  static async getNotifications(req: AuthRequest, res: Response): Promise<void> {
    console.log('Requester role', req.user?.role);
    if (req.user?.role === UserRole.CUSTOMER) {
      try {
        const customerId = req.user?.customer_id;
        console.log('[NOTIFICATIONS] getNotifications called for customer:', customerId);

        if (!customerId) {
          console.log('[NOTIFICATIONS] No customer_id found in request');
          res.status(403).json({ message: 'Customer authentication required' });
          return;
        }

        const unreadOnly = req.query.unread === 'true';
        const notifications = await NotificationService.getNotifications(customerId, unreadOnly);
        
        res.status(200).json(notifications);
      } catch (error) {
        console.error('[NOTIFICATIONS] Error fetching notifications:', error);
        res.status(500).json({ message: 'Error fetching notifications', error });
      }
    } else if (req.user?.role && NotificationController.allowedEmployeeRoles.includes(req.user.role)) {
      try {
        const employeeId = req.user?.employee_id;
        console.log('[NOTIFICATIONS] getNotifications called for employee:', employeeId);

        if (!employeeId) {
          console.log('[NOTIFICATIONS] No employee_id found in request');
          res.status(403).json({ message: 'Employee authentication required' });
          return;
        }

        const unreadOnly = req.query.unread === 'true';
        const notifications = await NotificationService.getNotificationsForEmployee(employeeId, unreadOnly);
        
        res.status(200).json(notifications);
      } catch (error) {
        console.error('[NOTIFICATIONS] Error fetching notifications:', error);
        res.status(500).json({ message: 'Error fetching notifications', error });
      }
    } else {
      res.status(403).json({ message: 'Access denied' });
    }
  }

  // Get unread notification count
  static async getUnreadCount(req: AuthRequest, res: Response): Promise<void> {
    if (req.user?.role === UserRole.CUSTOMER) {
      try {
        const customerId = req.user?.customer_id;
        console.log('[NOTIFICATIONS] getUnreadCount called for customer:', customerId);

        if (!customerId) {
          res.status(403).json({ message: 'Customer authentication required' });
          return;
        }

        const count = await NotificationService.getUnreadCount(customerId);
        res.status(200).json({ count });
      } catch (error) {
        console.error('[NOTIFICATIONS] Error fetching unread count:', error);
        res.status(500).json({ message: 'Error fetching unread count', error });
      }
    } else if (req.user?.role && NotificationController.allowedEmployeeRoles.includes(req.user.role)) {
      try {
        const employeeId = req.user?.employee_id;
        console.log('[NOTIFICATIONS] getUnreadCount called for employee:', employeeId);

        if (!employeeId) {
          res.status(403).json({ message: 'Employee authentication required' });
          return;
        }

        // Pretending this service method exists
        const count = await NotificationService.getUnreadCountForEmployee(employeeId);
        res.status(200).json({ count });
      } catch (error) {
        console.error('[NOTIFICATIONS] Error fetching unread count:', error);
        res.status(500).json({ message: 'Error fetching unread count', error });
      }
    } else {
      res.status(403).json({ message: 'Access denied' });
    }
  }

  // Mark a specific notification as read
  // Note: Since this relies on notificationId, logic is often shared, 
  // but we ensure the user is authenticated as either type.
  static async markAsRead(req: AuthRequest, res: Response): Promise<void> {
    const isCustomer = req.user?.role === UserRole.CUSTOMER;
    const isEmployee = req.user?.role && NotificationController.allowedEmployeeRoles.includes(req.user.role);

    if (isCustomer || isEmployee) {
      try {
        const notificationId = parseInt(req.params.id);
        // Assuming generic service method, or you can branch if service differs
        await NotificationService.markAsRead(notificationId); 
        res.status(200).json({ message: 'Notification marked as read' });
      } catch (error) {
        res.status(500).json({ message: 'Error marking notification as read', error });
      }
    } else {
      res.status(403).json({ message: 'Authentication required' });
    }
  }

  // Mark all notifications as read
  static async markAllAsRead(req: AuthRequest, res: Response): Promise<void> {
    if (req.user?.role === UserRole.CUSTOMER) {
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
    } else if (req.user?.role && NotificationController.allowedEmployeeRoles.includes(req.user.role)) {
      try {
        const employeeId = req.user?.employee_id;
        if (!employeeId) {
          res.status(403).json({ message: 'Employee authentication required' });
          return;
        }

        // Pretending this service method exists
        await NotificationService.markAllAsReadForEmployee(employeeId);
        res.status(200).json({ message: 'All notifications marked as read' });
      } catch (error) {
        res.status(500).json({ message: 'Error marking all notifications as read', error });
      }
    } else {
      res.status(403).json({ message: 'Access denied' });
    }
  }

  // Delete a notification
  static async deleteNotification(req: AuthRequest, res: Response): Promise<void> {
    const isCustomer = req.user?.role === UserRole.CUSTOMER;
    const isEmployee = req.user?.role && NotificationController.allowedEmployeeRoles.includes(req.user.role);

    if (isCustomer || isEmployee) {
      try {
        const notificationId = parseInt(req.params.id);
        await NotificationService.deleteNotification(notificationId);
        res.status(204).send();
      } catch (error) {
        res.status(500).json({ message: 'Error deleting notification', error });
      }
    } else {
      res.status(403).json({ message: 'Authentication required' });
    }
  }

  // Delete by type
  static async deleteByType(req: AuthRequest, res: Response): Promise<void> {
    if (req.user?.role === UserRole.CUSTOMER) {
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
    } else if (req.user?.role && NotificationController.allowedEmployeeRoles.includes(req.user.role)) {
      try {
        const employeeId = req.user?.employee_id;
        if (!employeeId) {
          res.status(403).json({ message: 'Employee authentication required' });
          return;
        }
        const type = req.params.type;
        // Pretending this service method exists
        await NotificationService.deleteByEmployeeIdAndType(employeeId, type);
        res.status(204).send();
      } catch (error) {
        res.status(500).json({ message: 'Error deleting notification by type', error });
      }
    } else {
      res.status(403).json({ message: 'Access denied' });
    }
  }
}