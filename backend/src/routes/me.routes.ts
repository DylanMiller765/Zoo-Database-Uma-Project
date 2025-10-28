import { Router } from 'express';
import MeController from '../controllers/me.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// All routes require auth; customer self-service only needs to be authenticated.
router.use(protect);

router.get('/summary', MeController.summary);
router.get('/tickets', MeController.tickets);
router.get('/event-registrations', MeController.registrations);
router.get('/visits', MeController.visits);
router.get('/membership', MeController.membership);

export default router;
