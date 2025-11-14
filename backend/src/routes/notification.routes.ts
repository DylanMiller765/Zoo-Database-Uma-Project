import { Router } from 'express';
import { NotificationController } from '../controllers/notification.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// All notification routes require authentication
router.use(protect);

// GET /api/notifications - Get all notifications (or unread only with ?unread=true)
router.get('/', NotificationController.getNotifications);

// GET /api/notifications/unread-count - Get count of unread notifications
router.get('/unread-count', NotificationController.getUnreadCount);

// PUT /api/notifications/:id/read - Mark specific notification as read
router.put('/:id/read', NotificationController.markAsRead);

// PUT /api/notifications/mark-all-read - Mark all notifications as read
router.put('/mark-all-read', NotificationController.markAllAsRead);

// DELETE /api/notifications/:id - Delete a notification
router.delete('/:id', NotificationController.deleteNotification);

// DELETE /api/notifications/by-type/:type - Delete notifications by type
router.delete('/by-type/:type', NotificationController.deleteByType);

export default router;
