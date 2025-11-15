/**
 * Event Cancellation Log Service
 *
 * Business logic for event cancellation logs.
 * This service reads data populated by database triggers.
 */

import { EventCancellationLogModel, EventCancellationLog } from '../models/event-cancellation-log.model';

export class EventCancellationLogService {
  /**
   * Get recent event cancellation logs
   */
  static async getRecentCancellations(limit: number = 10): Promise<EventCancellationLog[]> {
    return await EventCancellationLogModel.findAll(limit);
  }

  /**
   * Get cancellation log by ID
   */
  static async getCancellationById(logId: number): Promise<EventCancellationLog | null> {
    return await EventCancellationLogModel.findById(logId);
  }

  /**
   * Get cancellation logs for a specific event
   */
  static async getCancellationsByEventId(eventId: number): Promise<EventCancellationLog[]> {
    return await EventCancellationLogModel.findByEventId(eventId);
  }

  /**
   * Get cancellation statistics
   */
  static async getStatistics(): Promise<{
    total_cancellations: number;
    total_customers_affected: number;
    total_refunds_needed: number;
    recent_cancellations_24h: number;
  }> {
    return await EventCancellationLogModel.getStatistics();
  }
}
