import { Router } from 'express';
import { CafeController } from '../controllers/cafe.controller';
import { protect, restrictTo } from '../middleware/auth.middleware';

const router = Router();

router.use(protect);

router.get('/', restrictTo('manager', 'cashier'), CafeController.getAllCafes);
router.post('/', restrictTo('manager'), CafeController.createCafe);
router.get('/:id', restrictTo('manager', 'cashier'), CafeController.getCafeById);
router.put('/:id', restrictTo('manager'), CafeController.updateCafe);
router.delete('/:id', restrictTo('manager'), CafeController.deleteCafe);

export default router;
