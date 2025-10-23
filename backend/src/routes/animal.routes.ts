import { Router } from 'express';
import { AnimalController } from '../controllers/animal.controller';
import { protect, restrictTo } from '../middleware/auth.middleware';

const router = Router();

// Protect all routes in this file
router.use(protect);

// Read access for managers, vets, and keepers
router.get('/', restrictTo('manager', 'veterinarian', 'keeper'), AnimalController.getAllAnimals);
router.get('/:id', restrictTo('manager', 'veterinarian', 'keeper'), AnimalController.getAnimalById);

// Write access for managers and vets only
router.post('/', restrictTo('manager', 'veterinarian'), AnimalController.createAnimal);
router.put('/:id', restrictTo('manager', 'veterinarian'), AnimalController.updateAnimal);
router.delete('/:id', restrictTo('manager', 'veterinarian'), AnimalController.deleteAnimal);

export default router;
