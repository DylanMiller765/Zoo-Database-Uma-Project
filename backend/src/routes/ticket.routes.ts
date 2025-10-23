import { Router } from 'express';
import { TicketController } from '../controllers/ticket.controller';
import { protect, restrictTo } from '../middleware/auth.middleware';

const router = Router();

// Protect all routes
router.use(protect);

// Routes for managers
router.get('/', restrictTo('manager'), TicketController.getAllTickets);
router.get('/date/:date', restrictTo('manager'), TicketController.getTicketsByDate);
router.delete('/:id', restrictTo('manager'), TicketController.deleteTicket);

// Routes for sales associates (cashiers) and managers
router.post('/', restrictTo('manager', 'cashier'), TicketController.createTicket);
router.get('/:id', restrictTo('manager', 'cashier'), TicketController.getTicketById);

export default router;
