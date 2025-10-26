import { Router } from 'express';
import { QueryController } from '../controllers/query.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// All query routes require authentication
router.use(protect);

router.get('/animals-by-habitat', QueryController.getAnimalsByHabitat);
router.get('/employee-assignments', QueryController.getEmployeeAssignments);
router.get('/revenue-analysis', QueryController.getRevenueAnalysis);
router.get('/event-attendance', QueryController.getEventAttendance);
router.get('/visitor-statistics', QueryController.getVisitorStatistics);

export default router;
