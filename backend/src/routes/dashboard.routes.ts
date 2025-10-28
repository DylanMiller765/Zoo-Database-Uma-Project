import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// All dashboard routes require authentication
router.use(protect);

router.get('/stats', DashboardController.getStats);
router.get('/recent-activity', DashboardController.getRecentActivity);

export default router;
