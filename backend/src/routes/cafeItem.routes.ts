import { Router } from 'express';
import { CafeItemController } from '../controllers/cafeItem.controller';
import { protect, restrictTo } from '../middleware/auth.middleware';

const router = Router();

// Public menu listing (no auth required)
router.get('/public', CafeItemController.getAllItems);

// Protect all subsequent routes
router.use(protect);

// Routes for managers
router.get('/', restrictTo('manager'), CafeItemController.getAllItems);
router.post('/', restrictTo('manager'), CafeItemController.createItem);
router.put('/:id', restrictTo('manager'), CafeItemController.updateItem);
router.delete('/:id', restrictTo('manager'), CafeItemController.deleteItem);
router.put('/:id/restore', restrictTo('manager'), CafeItemController.restoreItem);

// Routes for sales associates (cashiers) and managers
router.get('/cafe/:cafeId', restrictTo('manager', 'cashier'), CafeItemController.getMenuForCafe);
router.get('/:id', restrictTo('manager', 'cashier'), CafeItemController.getItemById);
router.put('/:id/stock', restrictTo('manager', 'cashier'), CafeItemController.updateStock);

export default router;
