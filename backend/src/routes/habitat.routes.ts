import { Router } from 'express';
import { HabitatController } from '../controllers/habitat.controller';
import { protect, restrictTo } from '../middleware/auth.middleware';

const router = Router();

// All authenticated users can view habitats
router.get('/', HabitatController.getAllHabitats);
router.get('/:id', HabitatController.getHabitatById);

// Restricted access for modification
router.post('/', protect, restrictTo('manager', 'veterinarian'), HabitatController.createHabitat);
router.put('/:id', protect, restrictTo('manager', 'veterinarian', 'keeper'), HabitatController.updateHabitat);
router.delete('/:id', protect, restrictTo('manager', 'veterinarian'), HabitatController.deleteHabitat);
router.put('/:id/restore', protect, restrictTo('manager'), HabitatController.restoreHabitat);

export default router;
