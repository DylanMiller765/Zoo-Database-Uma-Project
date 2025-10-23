import { Router } from 'express';
import { CafeSaleController } from '../controllers/cafeSale.controller';
import { protect, restrictTo } from '../middleware/auth.middleware';

const router = Router();

// Protect all routes
router.use(protect);

// Routes for managers
router.get('/date/:date/cafe/:cafeId', restrictTo('manager'), CafeSaleController.getSalesByDateAndCafe);
router.delete('/:transactionId', restrictTo('manager'), CafeSaleController.returnSale);

// Routes for sales associates (cashiers) and managers
router.post('/', restrictTo('manager', 'cashier'), CafeSaleController.createSale);
router.get('/:transactionId', restrictTo('manager', 'cashier'), CafeSaleController.getSaleByTransactionId);

export default router;
