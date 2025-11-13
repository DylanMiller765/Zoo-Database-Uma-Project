import { Router } from 'express';
import { QueryController } from '../controllers/query.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// All query routes require authentication
router.use(protect);

// New 3-Report System
router.get('/animal-health-care', QueryController.getAnimalHealthAndCare);
router.get('/event-performance', QueryController.getEventPerformance);
router.get('/financial-report', QueryController.getFinancialReport);

export default router;
