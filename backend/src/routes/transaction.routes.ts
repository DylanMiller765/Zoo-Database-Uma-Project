import { Router } from 'express';
import { TransactionController } from '../controllers/transaction.controller';
import { protect, restrictTo } from '../middleware/auth.middleware';

const router = Router();

router.get(
  '/',
  protect,
  restrictTo('manager', 'cashier'),
  TransactionController.getAll
);

export default router;
