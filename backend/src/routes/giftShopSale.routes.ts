import { Router } from 'express';
import { GiftShopSaleController } from '../controllers/giftShopSale.controller';
import { protect, restrictTo } from '../middleware/auth.middleware';

const router = Router();

// Protect all routes
router.use(protect);

// Routes for managers
router.get('/date/:date', restrictTo('manager'), GiftShopSaleController.getSalesByDate);

// Routes for sales associates (cashiers) and managers
router.post('/', restrictTo('manager', 'cashier'), GiftShopSaleController.createSale);
router.get('/:id', restrictTo('manager', 'cashier'), GiftShopSaleController.getSaleById);

// DELETE/RETURN functionality removed - transactions are final and cannot be deleted or returned

export default router;
