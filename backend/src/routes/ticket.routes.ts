import { Router } from 'express';
import { TicketController } from '../controllers/ticket.controller';
import { protect, restrictTo } from '../middleware/auth.middleware';

const router = Router();

// Customer routes - require authentication for ticket purchases
router.post('/', protect, TicketController.createTicket);

// Protected routes - require authentication
router.get('/', protect, restrictTo('manager'), TicketController.getAllTickets);
router.get('/date/:date', protect, restrictTo('manager'), TicketController.getTicketsByDate);
router.delete('/:id', protect, restrictTo('manager'), TicketController.deleteTicket);
router.put('/:id/restore', protect, restrictTo('manager'), TicketController.restoreTicket);
router.get('/:id', protect, restrictTo('manager', 'cashier'), TicketController.getTicketById);

export default router;
