/**
 * Event Cancellation Log Routes
 *
 * Defines API endpoints for event cancellation logs.
 * These logs are populated by the trg_event_cancellation_notification database trigger.
 */

import { Router } from 'express';
import { EventCancellationLogController } from '../controllers/event-cancellation-log.controller';
import { protect, restrictTo } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication and manager/coordinator role
router.use(protect);
router.use(restrictTo('manager', 'coordinator'));

/**
 * GET /api/event-cancellations
 * Get recent event cancellation logs
 * Query params:
 *   - limit: number (optional, default: 10, max: 100)
 */
router.get('/', EventCancellationLogController.getRecentCancellations);

/**
 * GET /api/event-cancellations/stats
 * Get cancellation statistics
 */
router.get('/stats', EventCancellationLogController.getStatistics);

/**
 * GET /api/event-cancellations/event/:eventId
 * Get cancellation logs for a specific event
 */
router.get('/event/:eventId', EventCancellationLogController.getCancellationsByEventId);

/**
 * GET /api/event-cancellations/:id
 * Get a specific cancellation log by ID
 */
router.get('/:id', EventCancellationLogController.getCancellationById);

export default router;
