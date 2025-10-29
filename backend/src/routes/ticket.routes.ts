import { Router } from 'express';
import { TicketController } from '../controllers/ticket.controller';
import { protect, restrictTo, optionalAuth } from '../middleware/auth.middleware';

const router = Router();

// Public/Customer routes - allow ticket purchases for everyone (guest checkout + logged in customers)
router.post('/', optionalAuth, TicketController.createTicket);

// Protected routes - require authentication
router.get('/', protect, restrictTo('manager'), TicketController.getAllTickets);
router.get('/date/:date', protect, restrictTo('manager'), TicketController.getTicketsByDate);
router.delete('/:id', protect, restrictTo('manager'), TicketController.deleteTicket);
router.get('/:id', protect, restrictTo('manager', 'cashier'), TicketController.getTicketById);

export default router;
