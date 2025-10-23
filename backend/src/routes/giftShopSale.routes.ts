import { Router } from 'express';
import { GiftShopSaleController } from '../controllers/giftShopSale.controller';
import { protect, restrictTo } from '../middleware/auth.middleware';

const router = Router();

// Protect all routes
router.use(protect);

// Routes for managers
router.get('/date/:date', restrictTo('manager'), GiftShopSaleController.getSalesByDate);
router.delete('/:id', restrictTo('manager'), GiftShopSaleController.returnSale);

// Routes for sales associates (cashiers) and managers
router.post('/', restrictTo('manager', 'cashier'), GiftShopSaleController.createSale);
router.get('/:id', restrictTo('manager', 'cashier'), GiftShopSaleController.getSaleById);

export default router;
