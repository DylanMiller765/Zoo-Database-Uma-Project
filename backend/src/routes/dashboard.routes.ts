import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';
import { protect, restrictTo } from '../middleware/auth.middleware';

const router = Router();

// All dashboard routes require authentication
router.use(protect);

router.get('/stats', DashboardController.getStats);
router.get('/recent-activity', DashboardController.getRecentActivity);
router.get('/keeper-assignments', restrictTo('keeper'), DashboardController.getKeeperAssignments);
router.get('/veterinarian-animals', restrictTo('veterinarian'), DashboardController.getVeterinarianAnimals);

export default router;
