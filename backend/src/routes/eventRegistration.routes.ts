import { Router } from 'express';
import { EventRegistrationController } from '../controllers/eventRegistration.controller';
import { protect, restrictTo } from '../middleware/auth.middleware';

const router = Router();

// Protect all routes
router.use(protect);

// Routes for event coordinators
router.get('/', restrictTo('coordinator'), EventRegistrationController.getAllRegistrations);
router.get('/event/:eventId', restrictTo('coordinator'), EventRegistrationController.getAttendeesForEvent);
router.put('/:id', restrictTo('coordinator'), EventRegistrationController.updateRegistration);
router.delete('/:id', restrictTo('coordinator'), EventRegistrationController.cancelRegistration);

// Routes for sales associates (cashiers) and event coordinators
router.post('/', restrictTo('coordinator', 'cashier'), EventRegistrationController.createRegistration);
router.get('/:id', restrictTo('coordinator', 'cashier'), EventRegistrationController.getRegistrationById);

export default router;
