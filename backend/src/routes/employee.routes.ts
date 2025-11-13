import { Router } from 'express';
import { EmployeeController } from '../controllers/employee.controller';
import { protect, restrictTo } from '../middleware/auth.middleware';

const router = Router();

// Protect all routes in this file and restrict to managers
router.use(protect, restrictTo('manager'));

router.route('/').get(EmployeeController.getAllEmployees).post(EmployeeController.createEmployee);

router
  .route('/:id')
  .get(EmployeeController.getEmployeeById)
  .put(EmployeeController.updateEmployee)
  .delete(EmployeeController.deleteEmployee);

router.put('/:id/restore', EmployeeController.restoreEmployee);

export default router;
