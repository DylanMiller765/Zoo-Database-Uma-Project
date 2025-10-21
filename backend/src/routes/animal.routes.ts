import { Router } from 'express';
import { AnimalController } from '../controllers/animal.controller';

const router = Router();

router.get('/', AnimalController.getAllAnimals);
router.post('/', AnimalController.createAnimal);
router.get('/:id', AnimalController.getAnimalById);
router.put('/:id', AnimalController.updateAnimal);
router.delete('/:id', AnimalController.deleteAnimal);

export default router;
