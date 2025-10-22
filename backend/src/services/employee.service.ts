import { Employee, EmployeeModel } from '../models/employee.model';

export class EmployeeService {
  static async getAllEmployees(): Promise<Employee[]> {
    return await EmployeeModel.findAll();
  }

  static async createEmployee(employee: Omit<Employee, 'employee_id'>): Promise<Employee> {
    return await EmployeeModel.create(employee);
  }

  static async getEmployeeById(id: number): Promise<Employee | null> {
    return await EmployeeModel.findById(id);
  }

  static async updateEmployee(id: number, updates: Partial<Employee>): Promise<Employee | null> {
    return await EmployeeModel.update(id, updates);
  }

  static async deleteEmployee(id: number): Promise<void> {
    return await EmployeeModel.remove(id);
  }
}
