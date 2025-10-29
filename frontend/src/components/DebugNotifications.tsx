'use client';

import { useEffect, useState } from 'react';
import { notificationService } from '@/services/notification.service';

export default function DebugNotifications() {
  const [debug, setDebug] = useState<any>({});

  useEffect(() => {
    const checkNotifications = async () => {
      const token = localStorage.getItem('token');

      const debugInfo: any = {
        hasToken: !!token,
        token: token ? `${token.substring(0, 20)}...` : 'none',
        timestamp: new Date().toISOString(),
      };

      if (token) {
        try {
          const notifications = await notificationService.getNotifications(true);
          debugInfo.notificationsCount = notifications.length;
          debugInfo.notifications = notifications;
          debugInfo.status = 'success';
        } catch (error: any) {
          debugInfo.status = 'error';
          debugInfo.error = error.message;
          debugInfo.errorDetails = error.response?.data || error.toString();
        }
      }

      setDebug(debugInfo);
      console.log('🐛 Debug Info:', debugInfo);
    };

    checkNotifications();
  }, []);

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs max-w-md z-50 shadow-xl">
      <div className="font-bold mb-2">🐛 Notification Debug</div>
      <pre className="overflow-auto max-h-96">
        {JSON.stringify(debug, null, 2)}
      </pre>
    </div>
  );
}
