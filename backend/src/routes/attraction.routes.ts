import { Router } from 'express';
import { AttractionController } from '../controllers/attraction.controller';
import { protect, restrictTo } from '../middleware/auth.middleware';

const router = Router();

// General public can view attractions
router.get('/', AttractionController.getAllAttractions);
router.get('/:id', AttractionController.getAttractionById);

// Only managers can create, update, or delete attractions
router.post('/', protect, restrictTo('manager'), AttractionController.createAttraction);
router.put('/:id', protect, restrictTo('manager'), AttractionController.updateAttraction);
router.delete('/:id', protect, restrictTo('manager'), AttractionController.deleteAttraction);

export default router;
