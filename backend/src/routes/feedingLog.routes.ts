import { Router } from 'express';
import { FeedingLogController } from '../controllers/feedingLog.controller';
import { protect, restrictTo } from '../middleware/auth.middleware';

const router = Router();

// Only keepers, veterinarians, and managers can view feeding logs
router.get('/', protect, restrictTo('keeper', 'veterinarian', 'manager'), FeedingLogController.getAllLogs);
router.get('/animal/:animalId', protect, restrictTo('keeper', 'veterinarian', 'manager'), FeedingLogController.getLogsByAnimalId);
router.get('/:id', protect, restrictTo('keeper', 'veterinarian', 'manager'), FeedingLogController.getLogById);

// Keepers, veterinarians, and managers can create feeding logs
router.post('/', protect, restrictTo('keeper', 'veterinarian', 'manager'), FeedingLogController.createLog);

// Keepers, veterinarians, and managers can update feeding logs
router.put('/:id', protect, restrictTo('keeper', 'veterinarian', 'manager'), FeedingLogController.updateLog);

// Only managers can delete feeding logs (permanent record keeping)
router.delete('/:id', protect, restrictTo('manager'), FeedingLogController.deleteLog);

export default router;
