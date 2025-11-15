'use client';

import { useState, useEffect, useCallback } from 'react';
import { notificationService, Notification } from '@/services/notification.service';
import { X } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function NotificationBanner() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  const fetchNotifications = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('[NOTIFICATIONS FRONTEND] Token exists:', !!token);

      if (!token) {
        console.log('[NOTIFICATIONS FRONTEND] No token found, skipping notification fetch');
        setLoading(false);
        return;
      }

      console.log('[NOTIFICATIONS FRONTEND] Fetching unread notifications...');
      // Fetch only unread notifications
      const unreadNotifications = await notificationService.getNotifications(true);
      console.log('[NOTIFICATIONS FRONTEND] Received', unreadNotifications.length, 'unread notifications');
      console.log('[NOTIFICATIONS FRONTEND] Notifications:', unreadNotifications);
      setNotifications(unreadNotifications);
    } catch (error) {
      console.error('[NOTIFICATIONS FRONTEND] Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on mount and when pathname changes
  useEffect(() => {
    console.log('[NOTIFICATIONS FRONTEND] Component mounted or pathname changed:', pathname);
    fetchNotifications();
  }, [pathname, fetchNotifications]);

  // Poll every 30 seconds
  useEffect(() => {
    console.log('[NOTIFICATIONS FRONTEND] Setting up 30-second polling interval');
    const intervalId = setInterval(() => {
      console.log('[NOTIFICATIONS FRONTEND] 30-second poll triggered');
      fetchNotifications();
    }, 30000);

    return () => {
      console.log('[NOTIFICATIONS FRONTEND] Cleaning up polling interval');
      clearInterval(intervalId);
    };
  }, [fetchNotifications]);

  const dismissNotification = async (notificationId: number) => {
    try {
      console.log('[NOTIFICATIONS FRONTEND] Dismissing notification:', notificationId);
      // Mark as read in database
      await notificationService.markAsRead(notificationId);
      // Remove from local state immediately for better UX
      setNotifications(notifications.filter(n => n.notification_id !== notificationId));
      console.log('[NOTIFICATIONS FRONTEND] Notification dismissed successfully');
    } catch (error) {
      console.error('[NOTIFICATIONS FRONTEND] Error dismissing notification:', error);
    }
  };

  if (loading || notifications.length === 0) {
    return null;
  }

  return (
    <div className="sticky top-0 z-40 space-y-2 bg-white">
      <div className="mx-auto max-w-[90rem] 2xl:max-w-[120rem] px-6 sm:px-8 lg:px-12 xl:px-16 pt-4">
      {notifications.map((notification) => {
        const bgColor =
          notification.notification_type === 'alert'
            ? 'bg-red-100 border-red-300'
            : notification.notification_type === 'warning'
            ? 'bg-yellow-100 border-yellow-300'
            : 'bg-blue-100 border-blue-300';

        const textColor =
          notification.notification_type === 'alert'
            ? 'text-red-900'
            : notification.notification_type === 'warning'
            ? 'text-yellow-900'
            : 'text-blue-900';

        const icon =
          notification.notification_type === 'alert'
            ? '🚨'
            : notification.notification_type === 'warning'
            ? '⚠️'
            : 'ℹ️';

        return (
          <div
            key={notification.notification_id}
            className={`${bgColor} ${textColor} border-2 rounded-xl shadow-lg p-4 flex items-start gap-3 animate-slide-down`}
          >
            <span className="text-2xl flex-shrink-0">{icon}</span>
            <div className="flex-1">
              <p className="font-medium text-sm">{notification.message}</p>
              {notification.notification_type === 'warning' && (
                <a
                  href="/membership"
                  className="text-xs underline font-semibold mt-1 inline-block hover:opacity-80"
                >
                  Renew membership →
                </a>
              )}
            </div>
            <button
              onClick={() => dismissNotification(notification.notification_id)}
              className="flex-shrink-0 hover:opacity-70 transition-opacity"
              aria-label="Dismiss notification"
            >
              <X size={20} />
            </button>
          </div>
        );
      })}
      </div>
    </div>
  );
}
