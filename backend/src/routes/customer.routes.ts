import { Router } from 'express';
import { CustomerController } from '../controllers/customer.controller';
import { protect, restrictTo } from '../middleware/auth.middleware';

const router = Router();

router.get('/', protect, restrictTo('manager', 'coordinator'), CustomerController.getAllCustomers);
router.post('/', protect, restrictTo('manager', 'coordinator'), CustomerController.createCustomer);
router.get('/:id', protect, restrictTo('manager', 'coordinator'), CustomerController.getCustomerById);
router.put('/:id', protect, restrictTo('manager', 'coordinator'), CustomerController.updateCustomer);
router.delete('/:id', protect, restrictTo('manager'), CustomerController.deleteCustomer);

export default router;
