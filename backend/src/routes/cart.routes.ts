import { Router } from 'express';
import { CartController } from '../controllers/cart.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// All cart routes require authentication
router.use(protect);

// Get cart
router.get('/', CartController.getCart);

// Get cart item count
router.get('/count', CartController.getItemCount);

// Add item to cart
router.post('/items', CartController.addItem);

// Update cart item
router.put('/items/:cart_item_id', CartController.updateItem);

// Remove item from cart
router.delete('/items/:cart_item_id', CartController.removeItem);

// Clear cart
router.delete('/', CartController.clearCart);

export default router;
