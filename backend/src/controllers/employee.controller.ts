import { Request, Response } from 'express';
import { EmployeeService } from '../services/employee.service';

export class EmployeeController {
  static async getAllEmployees(req: Request, res: Response): Promise<void> {
    try {
      const employees = await EmployeeService.getAllEmployees();
      res.status(200).json(employees);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching employees', error });
    }
  }

  static async createEmployee(req: Request, res: Response): Promise<void> {
    try {
      const newEmployee = await EmployeeService.createEmployee(req.body);
      res.status(201).json(newEmployee);
    } catch (error) {
      res.status(500).json({ message: 'Error creating employee', error });
    }
  }

  static async getEmployeeById(req: Request, res: Response): Promise<void> {
    try {
      const employee = await EmployeeService.getEmployeeById(parseInt(req.params.id));
      if (employee) {
        res.status(200).json(employee);
      } else {
        res.status(404).json({ message: 'Employee not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error fetching employee', error });
    }
  }

  static async updateEmployee(req: Request, res: Response): Promise<void> {
    try {
      const updatedEmployee = await EmployeeService.updateEmployee(parseInt(req.params.id), req.body);
      if (updatedEmployee) {
        res.status(200).json(updatedEmployee);
      } else {
        res.status(404).json({ message: 'Employee not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error updating employee', error });
    }
  }

  static async deleteEmployee(req: Request, res: Response): Promise<void> {
    try {
      await EmployeeService.deleteEmployee(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error deleting employee', error });
    }
  }
}
