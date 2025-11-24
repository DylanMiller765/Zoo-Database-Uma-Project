import { Router } from 'express';
import { CafeItemController } from '../controllers/cafeItem.controller';
import { protect, restrictTo } from '../middleware/auth.middleware';

const router = Router();

// Public menu listing (no auth required)
router.get('/public', CafeItemController.getAllItems);

// Protect all subsequent routes
router.use(protect);

// Routes for managers and cashiers (read-only for cashiers)
router.get('/', restrictTo('manager', 'cashier'), CafeItemController.getAllItems);

// Routes for managers only
router.post('/', restrictTo('manager'), CafeItemController.createItem);
router.put('/:id', restrictTo('manager'), CafeItemController.updateItem);
router.delete('/:id', restrictTo('manager'), CafeItemController.deleteItem);
router.put('/:id/restore', restrictTo('manager'), CafeItemController.restoreItem);

// Routes for sales associates (cashiers) and managers
router.get('/cafe/:cafeId', restrictTo('manager', 'cashier'), CafeItemController.getMenuForCafe);
router.get('/:id', restrictTo('manager', 'cashier'), CafeItemController.getItemById);

export default router;
