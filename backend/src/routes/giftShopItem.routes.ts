import { Router } from 'express';
import { GiftShopItemController } from '../controllers/giftShopItem.controller';
import { protect, restrictTo } from '../middleware/auth.middleware';

const router = Router();

// Public read-only listing (no auth needed)
router.get('/public', GiftShopItemController.getAllItems);

// Protect all subsequent routes
router.use(protect);

// Routes for managers
router.get('/', restrictTo('manager'), GiftShopItemController.getAllItems);
router.get('/low-stock', restrictTo('manager'), GiftShopItemController.getLowStockItems);
router.post('/', restrictTo('manager'), GiftShopItemController.createItem);
router.put('/:id', restrictTo('manager'), GiftShopItemController.updateItem);
router.delete('/:id', restrictTo('manager'), GiftShopItemController.deleteItem);

// Routes for sales associates (cashiers) and managers
router.get('/:id', restrictTo('manager', 'cashier'), GiftShopItemController.getItemById);

export default router;
