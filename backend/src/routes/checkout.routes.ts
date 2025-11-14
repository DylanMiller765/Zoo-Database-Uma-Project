import { Router } from 'express';
import { CheckoutController } from '../controllers/checkout.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// All checkout routes require authentication
router.use(protect);

// Process checkout
router.post('/', CheckoutController.processCheckout);

export default router;
