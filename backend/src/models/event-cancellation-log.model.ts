/**
 * Event Cancellation Log Model
 *
 * Handles database queries for the event_cancellation_logs table.
 * This table is populated by the trg_event_cancellation_notification trigger.
 */

import { query } from '../config/database';
import { RowDataPacket } from 'mysql2';

export interface EventCancellationLog extends RowDataPacket {
  log_id: number;
  event_id: number;
  event_name: string;
  event_date: string;
  cancelled_at: string;
  cancelled_by: string;
  total_registrations: number;
  customers_notified: number;
  refunds_needed: number;
}

export class EventCancellationLogModel {
  /**
   * Get all event cancellation logs, ordered by most recent first
   */
  static async findAll(limit: number = 10): Promise<EventCancellationLog[]> {
    // Note: Since event_cancellation_logs table may not exist, we query directly from events
    // and event_registrations to construct the cancellation data
    try {
      const logs = await query<any[]>(
        `SELECT
          ROW_NUMBER() OVER (ORDER BY e.deleted_at DESC) as log_id,
          e.event_id,
          e.name as event_name,
          e.event_date,
          e.deleted_at as cancelled_at,
          'System' as cancelled_by,
          COUNT(er.registration_id) as total_registrations,
          COUNT(CASE WHEN er.refunded_at IS NOT NULL THEN 1 END) as customers_notified,
          COALESCE(SUM(CASE WHEN er.refunded_at IS NOT NULL THEN er.total_amount ELSE 0 END), 0) as refunds_needed
        FROM events e
        LEFT JOIN event_registrations er ON e.event_id = er.event_id AND er.deleted_at IS NULL
        WHERE e.deleted_at IS NOT NULL
        GROUP BY e.event_id, e.name, e.event_date, e.deleted_at
        ORDER BY e.deleted_at DESC
        LIMIT ${limit}`
      );

      return logs as EventCancellationLog[];
    } catch (error) {
      // If query fails, try the original table name for backwards compatibility
      console.error('Error querying from events table, falling back to event_cancellation_logs table:', error);
      try {
        const logs = await query<EventCancellationLog[]>(
          `SELECT
            log_id,
            event_id,
            event_name,
            event_date,
            cancelled_at,
            cancelled_by,
            total_registrations,
            customers_notified,
            refunds_needed
          FROM event_cancellation_logs
          ORDER BY cancelled_at DESC
          LIMIT ${limit}`
        );
        return logs;
      } catch (fallbackError) {
        // If both fail, return empty array
        console.error('Both event_cancellation_logs queries failed:', fallbackError);
        return [];
      }
    }
  }

  /**
   * Get a specific cancellation log by ID
   */
  static async findById(logId: number): Promise<EventCancellationLog | null> {
    const logs = await query<EventCancellationLog[]>(
      `SELECT
        log_id,
        event_id,
        event_name,
        event_date,
        cancelled_at,
        cancelled_by,
        total_registrations,
        customers_notified,
        refunds_needed
      FROM event_cancellation_logs
      WHERE log_id = ?`,
      [logId]
    );

    return logs[0] || null;
  }

  /**
   * Get cancellation logs for a specific event
   */
  static async findByEventId(eventId: number): Promise<EventCancellationLog[]> {
    const logs = await query<EventCancellationLog[]>(
      `SELECT
        log_id,
        event_id,
        event_name,
        event_date,
        cancelled_at,
        cancelled_by,
        total_registrations,
        customers_notified,
        refunds_needed
      FROM event_cancellation_logs
      WHERE event_id = ?
      ORDER BY cancelled_at DESC`,
      [eventId]
    );

    return logs;
  }

  /**
   * Get cancellation statistics (summary)
   */
  static async getStatistics(): Promise<{
    total_cancellations: number;
    total_customers_affected: number;
    total_refunds_needed: number;
    recent_cancellations_24h: number;
  }> {
    const result = await query<RowDataPacket[]>(
      `SELECT
        COUNT(*) as total_cancellations,
        COALESCE(SUM(customers_notified), 0) as total_customers_affected,
        COALESCE(SUM(refunds_needed), 0) as total_refunds_needed,
        COALESCE(SUM(CASE WHEN cancelled_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR) THEN 1 ELSE 0 END), 0) as recent_cancellations_24h
      FROM event_cancellation_logs`
    );

    return result[0] as any;
  }
}
