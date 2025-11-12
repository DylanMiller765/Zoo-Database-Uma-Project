import { Router } from 'express';
import { AnimalController } from '../controllers/animal.controller';
import { protect, restrictTo, optionalAuth } from '../middleware/auth.middleware';

const router = Router();

// Public read access - no authentication required
router.get('/', optionalAuth, AnimalController.getAllAnimals);
router.get('/:id', optionalAuth, AnimalController.getAnimalById);

// Protected write access - managers and vets only
router.post('/', protect, restrictTo('manager', 'veterinarian'), AnimalController.createAnimal);
router.put('/:id', protect, restrictTo('manager', 'veterinarian'), AnimalController.updateAnimal);
router.delete('/:id', protect, restrictTo('manager', 'veterinarian'), AnimalController.deleteAnimal);

export default router;
