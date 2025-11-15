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

// Routes for sales associates (cashiers), coordinators, and managers
router.post('/', restrictTo('coordinator', 'cashier', 'manager'), EventRegistrationController.createRegistration);
router.get('/:id', restrictTo('coordinator', 'cashier', 'manager'), EventRegistrationController.getRegistrationById);

// DELETE functionality removed - transactions are final and cannot be deleted/cancelled

export default router;
