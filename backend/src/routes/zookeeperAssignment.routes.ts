import { Router } from 'express';
import { ZookeeperAssignmentController } from '../controllers/zookeeperAssignment.controller';
import { protect, restrictTo } from '../middleware/auth.middleware';

const router = Router();

// Only keepers, veterinarians, and managers can view assignments
router.get('/', protect, restrictTo('keeper', 'veterinarian', 'manager'), ZookeeperAssignmentController.getAllAssignments);
router.get('/keeper/:keeperId', protect, restrictTo('keeper', 'veterinarian', 'manager'), ZookeeperAssignmentController.getAssignmentsByKeeperId);

export default router;
