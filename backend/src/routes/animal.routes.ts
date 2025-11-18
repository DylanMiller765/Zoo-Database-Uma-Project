import { Router } from 'express';
import { AnimalController } from '../controllers/animal.controller';
import { protect, restrictTo } from '../middleware/auth.middleware';

const router = Router();

// Public read access - no authentication required
router.get('/', AnimalController.getAllAnimals);
router.get('/:id', AnimalController.getAnimalById);

// Protected write access - managers, vets, and keepers
router.post('/', protect, restrictTo('manager', 'veterinarian', 'keeper'), AnimalController.createAnimal);
router.put('/:id', protect, restrictTo('manager', 'veterinarian', 'keeper'), AnimalController.updateAnimal);
router.delete('/:id', protect, restrictTo('manager', 'veterinarian'), AnimalController.deleteAnimal);

// Manager-only restore access
router.put('/:id/restore', protect, restrictTo('manager'), AnimalController.restoreAnimal);

export default router;
