import { Router } from 'express';
import { DonationController } from '../controllers/donation.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// All donation routes require authentication
router.use(protect);

// Create donation
router.post('/', DonationController.createDonation);

// Get customer donations
router.get('/', DonationController.getCustomerDonations);

// Get customer donation total
router.get('/total', DonationController.getCustomerTotal);

export default router;
