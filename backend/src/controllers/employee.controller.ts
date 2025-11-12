import { Request, Response } from 'express';
import { EmployeeService } from '../services/employee.service';

export class EmployeeController {
  static async getAllEmployees(req: Request, res: Response): Promise<void> {
    try {
      const includeDeleted = req.query.includeDeleted === 'true';
      const employees = includeDeleted
        ? await EmployeeService.getAllEmployeesIncludingDeleted()
        : await EmployeeService.getAllEmployees();
      res.status(200).json(employees);
    } catch (error: any) {
      console.error('Error fetching employees:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error fetching employees'
      });
    }
  }

  static async createEmployee(req: Request, res: Response): Promise<void> {
    try {
      console.log('Creating employee with data:', JSON.stringify(req.body, null, 2));
      const newEmployee = await EmployeeService.createEmployee(req.body);
      console.log('Employee created successfully:', newEmployee);
      res.status(201).json(newEmployee);
    } catch (error: any) {
      console.error('Error creating employee:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);

      // Extract user-friendly error message
      let errorMessage = 'Error creating employee';
      if (error.code === 'ER_DUP_ENTRY') {
        if (error.message.includes('email')) {
          errorMessage = 'Email address already exists';
        } else if (error.message.includes('ssn')) {
          errorMessage = 'SSN already exists';
        } else {
          errorMessage = 'Duplicate entry found';
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      res.status(500).json({
        success: false,
        message: errorMessage
      });
    }
  }

  static async getEmployeeById(req: Request, res: Response): Promise<void> {
    try {
      const employee = await EmployeeService.getEmployeeById(parseInt(req.params.id));
      if (employee) {
        res.status(200).json(employee);
      } else {
        res.status(404).json({ success: false, message: 'Employee not found' });
      }
    } catch (error: any) {
      console.error('Error fetching employee:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error fetching employee'
      });
    }
  }

  static async updateEmployee(req: Request, res: Response): Promise<void> {
    try {
      const updatedEmployee = await EmployeeService.updateEmployee(parseInt(req.params.id), req.body);
      if (updatedEmployee) {
        res.status(200).json(updatedEmployee);
      } else {
        res.status(404).json({ success: false, message: 'Employee not found' });
      }
    } catch (error: any) {
      console.error('Error updating employee:', error);

      // Extract user-friendly error message
      let errorMessage = 'Error updating employee';
      if (error.code === 'ER_DUP_ENTRY') {
        if (error.message.includes('email')) {
          errorMessage = 'Email address already exists';
        } else if (error.message.includes('ssn')) {
          errorMessage = 'SSN already exists';
        } else {
          errorMessage = 'Duplicate entry found';
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      res.status(500).json({
        success: false,
        message: errorMessage
      });
    }
  }

  static async deleteEmployee(req: Request, res: Response): Promise<void> {
    try {
      await EmployeeService.deleteEmployee(parseInt(req.params.id));
      res.status(204).send();
    } catch (error: any) {
      console.error('Error deleting employee:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error deleting employee'
      });
    }
  }

  static async restoreEmployee(req: Request, res: Response): Promise<void> {
    try {
      const restoredEmployee = await EmployeeService.restoreEmployee(parseInt(req.params.id));
      if (restoredEmployee) {
        res.status(200).json(restoredEmployee);
      } else {
        res.status(404).json({ success: false, message: 'Employee not found' });
      }
    } catch (error: any) {
      console.error('Error restoring employee:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Error restoring employee'
      });
    }
  }
}
