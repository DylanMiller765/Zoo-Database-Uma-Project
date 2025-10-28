import { Router } from 'express';
import { GiftShopController } from '../controllers/giftShop.controller';
import { protect, restrictTo } from '../middleware/auth.middleware';

const router = Router();

router.use(protect);

router.get('/', restrictTo('manager', 'cashier'), GiftShopController.getAllGiftShops);
router.post('/', restrictTo('manager'), GiftShopController.createGiftShop);
router.get('/:id', restrictTo('manager', 'cashier'), GiftShopController.getGiftShopById);
router.put('/:id', restrictTo('manager'), GiftShopController.updateGiftShop);
router.delete('/:id', restrictTo('manager'), GiftShopController.deleteGiftShop);

export default router;
