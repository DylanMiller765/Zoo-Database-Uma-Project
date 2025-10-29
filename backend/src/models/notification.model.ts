import { query } from '../config/database';

export interface Notification {
  notification_id?: number;
  customer_id: number;
  message: string;
  notification_type?: 'info' | 'warning' | 'alert';
  is_read?: boolean;
  created_at?: string;
}

export class NotificationModel {
  static async findByCustomerId(customerId: number, unreadOnly: boolean = false): Promise<Notification[]> {
    let sql = 'SELECT * FROM notifications WHERE customer_id = ?';
    const params: any[] = [customerId];

    if (unreadOnly) {
      sql += ' AND is_read = FALSE';
    }

    sql += ' ORDER BY created_at DESC';

    console.log('[NOTIFICATIONS DB] Executing query:', sql);
    console.log('[NOTIFICATIONS DB] Parameters:', params);

    const results = await query<Notification[]>(sql, params);
    console.log('[NOTIFICATIONS DB] Query returned', results.length, 'rows');

    return results;
  }

  static async markAsRead(notificationId: number): Promise<void> {
    const sql = 'UPDATE notifications SET is_read = TRUE WHERE notification_id = ?';
    await query(sql, [notificationId]);
  }

  static async markAllAsReadForCustomer(customerId: number): Promise<void> {
    const sql = 'UPDATE notifications SET is_read = TRUE WHERE customer_id = ? AND is_read = FALSE';
    await query(sql, [customerId]);
  }

  static async create(notification: Omit<Notification, 'notification_id' | 'created_at'>): Promise<Notification> {
    const columns = Object.keys(notification).join(', ');
    const placeholders = Object.keys(notification).map(() => '?').join(', ');
    const values = Object.values(notification);

    const sql = `INSERT INTO notifications (${columns}) VALUES (${placeholders})`;
    const result = await query<any>(sql, values);
    return { notification_id: result.insertId, ...notification };
  }

  static async delete(notificationId: number): Promise<void> {
    const sql = 'DELETE FROM notifications WHERE notification_id = ?';
    await query(sql, [notificationId]);
  }

  static async getUnreadCount(customerId: number): Promise<number> {
    const sql = 'SELECT COUNT(*) as count FROM notifications WHERE customer_id = ? AND is_read = FALSE';
    const results = await query<any[]>(sql, [customerId]);
    return results[0]?.count || 0;
  }
}
