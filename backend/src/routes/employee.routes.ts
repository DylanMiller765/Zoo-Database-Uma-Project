import { Router } from 'express';
import { EmployeeController } from '../controllers/employee.controller';

const router = Router();

router.get('/', EmployeeController.getAllEmployees);
router.post('/', EmployeeController.createEmployee);
router.get('/:id', EmployeeController.getEmployeeById);
router.put('/:id', EmployeeController.updateEmployee);
router.delete('/:id', EmployeeController.deleteEmployee);

export default router;
