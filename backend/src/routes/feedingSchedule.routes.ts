import { Router } from 'express';
import { FeedingScheduleController } from '../controllers/feedingSchedule.controller';
import { protect, restrictTo } from '../middleware/auth.middleware';

const router = Router();

// All authenticated users can view feeding schedules
router.get('/', protect, FeedingScheduleController.getAllSchedules);
router.get('/animal/:animalId', protect, FeedingScheduleController.getSchedulesByAnimalId);
router.get('/:id', protect, FeedingScheduleController.getScheduleById);

// Keepers, veterinarians, and managers can create and update schedules
router.post('/', protect, restrictTo('keeper', 'veterinarian', 'manager'), FeedingScheduleController.createSchedule);
router.put('/:id', protect, restrictTo('keeper', 'veterinarian', 'manager'), FeedingScheduleController.updateSchedule);

// Only managers and veterinarians can delete schedules
router.delete('/:id', protect, restrictTo('manager', 'veterinarian'), FeedingScheduleController.deleteSchedule);

export default router;
