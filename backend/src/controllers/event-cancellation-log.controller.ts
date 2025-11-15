/**
 * Event Cancellation Log Controller
 *
 * Handles HTTP requests for event cancellation logs.
 */

import { Request, Response } from 'express';
import { EventCancellationLogService } from '../services/event-cancellation-log.service';

export class EventCancellationLogController {
  /**
   * GET /api/event-cancellations
   * Get recent event cancellation logs
   */
  static async getRecentCancellations(req: Request, res: Response): Promise<void> {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;

      // Validate limit parameter
      if (isNaN(limit) || limit < 1 || limit > 100) {
        res.status(400).json({ message: 'Invalid limit parameter. Must be between 1 and 100.' });
        return;
      }

      console.log('[EventCancellationLog] Fetching recent cancellations, limit:', limit);
      const logs = await EventCancellationLogService.getRecentCancellations(limit);
      console.log('[EventCancellationLog] Found logs:', logs.length);

      res.status(200).json(logs);
    } catch (error) {
      console.error('[EventCancellationLog] Error fetching event cancellation logs:', error);
      res.status(500).json({ message: 'Failed to fetch event cancellation logs' });
    }
  }

  /**
   * GET /api/event-cancellations/:id
   * Get a specific cancellation log by ID
   */
  static async getCancellationById(req: Request, res: Response): Promise<void> {
    try {
      const logId = parseInt(req.params.id, 10);

      if (isNaN(logId)) {
        res.status(400).json({ message: 'Invalid log ID' });
        return;
      }

      const log = await EventCancellationLogService.getCancellationById(logId);

      if (!log) {
        res.status(404).json({ message: 'Cancellation log not found' });
        return;
      }

      res.status(200).json(log);
    } catch (error) {
      console.error('Error fetching cancellation log:', error);
      res.status(500).json({ message: 'Failed to fetch cancellation log' });
    }
  }

  /**
   * GET /api/event-cancellations/event/:eventId
   * Get cancellation logs for a specific event
   */
  static async getCancellationsByEventId(req: Request, res: Response): Promise<void> {
    try {
      const eventId = parseInt(req.params.eventId, 10);

      if (isNaN(eventId)) {
        res.status(400).json({ message: 'Invalid event ID' });
        return;
      }

      const logs = await EventCancellationLogService.getCancellationsByEventId(eventId);

      res.status(200).json(logs);
    } catch (error) {
      console.error('Error fetching cancellation logs for event:', error);
      res.status(500).json({ message: 'Failed to fetch cancellation logs for event' });
    }
  }

  /**
   * GET /api/event-cancellations/stats
   * Get cancellation statistics
   */
  static async getStatistics(req: Request, res: Response): Promise<void> {
    try {
      const stats = await EventCancellationLogService.getStatistics();

      res.status(200).json(stats);
    } catch (error) {
      console.error('Error fetching cancellation statistics:', error);
      res.status(500).json({ message: 'Failed to fetch cancellation statistics' });
    }
  }
}
