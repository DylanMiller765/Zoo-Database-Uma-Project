import { Router } from 'express';
import { DonationController } from '../controllers/donation.controller';
import { protect, restrictTo } from '../middleware/auth.middleware';

const router = Router();

// All donation routes require authentication
router.use(protect);

// Admin route to create donation for any customer
router.post('/admin', restrictTo('manager', 'cashier'), DonationController.createDonationAdmin);

// Create donation (customer only)
router.post('/', DonationController.createDonation);

// Get customer donations
router.get('/', DonationController.getCustomerDonations);

// Get customer donation total
router.get('/total', DonationController.getCustomerTotal);

export default router;
