// Routes for event-related endpoints

import { Router } from 'express';
import * as eventController from '../controllers/event.controller';
import { protect, restrictTo } from '../middleware/auth.middleware';

const router = Router();

// @route   GET /api/events
// @desc    Get all upcoming events
// @access  Public
router.get('/', eventController.getUpcomingEvents);

// @route   POST /api/events
// @desc    Create a new event
// @access  Private (Event Coordinator, General Manager)
router.post(
  '/',
  protect,
  restrictTo('coordinator', 'manager'),
  eventController.createEvent
);

// @route   GET /api/events/:id
// @desc    Get a single event by ID
// @access  Public
router.get('/:id', eventController.getEventById);

// @route   PUT /api/events/:id
// @desc    Update an event
// @access  Private (Event Coordinator, General Manager)
router.put(
  '/:id',
  protect,
  restrictTo('coordinator', 'manager'),
  eventController.updateEvent
);

// @route   DELETE /api/events/:id
// @desc    Delete an event
// @access  Private (Event Coordinator, General Manager)
router.delete(
  '/:id',
  protect,
  restrictTo('coordinator', 'manager'),
  eventController.deleteEvent
);

export default router;
