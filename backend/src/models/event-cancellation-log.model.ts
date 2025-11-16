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
    // Note: MySQL doesn't always support parameterized LIMIT, so we use string interpolation
    // The limit is already validated as a number in the controller, so this is safe
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
