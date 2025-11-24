import { Employee, EmployeeModel } from '../models/employee.model';
import { query } from '../config/database';

export class EmployeeService {
  static async getAllEmployees(): Promise<Employee[]> {
    return await EmployeeModel.findAll();
  }

  static async getAllEmployeesIncludingDeleted(): Promise<Employee[]> {
    return await EmployeeModel.findAllIncludingDeleted();
  }

  static async createEmployee(employeeData: Omit<Employee, 'employee_id'> & { password: string }): Promise<Employee> {
    const { password, ...employee } = employeeData;

    // Validate required fields for user account creation
    if (!employee.email) {
      throw new Error('Email is required for creating an employee');
    }
    if (!password) {
      throw new Error('Password is required for creating an employee');
    }

    // Step 1: Create the employee
    const newEmployee = await EmployeeModel.create(employee);

    // Step 2: Create user account (use email as username)
    const userAccountResult = await query<any>(
      'INSERT INTO user_accounts (username, email, role, employee_id) VALUES (?, ?, ?, ?)',
      [employee.email, employee.email, 'employee', newEmployee.employee_id]
    );
    const accountId = userAccountResult.insertId;

    // Step 3: Save the password (plain text)
    await query('INSERT INTO passwords (account_id, password_hash) VALUES (?, ?)', [accountId, password]);

    return newEmployee;
  }

  static async getEmployeeById(id: number): Promise<Employee | null> {
    return await EmployeeModel.findById(id);
  }

  static async updateEmployee(id: number, updates: Partial<Employee> & { password?: string }): Promise<Employee | null> {
    const { password, ...employeeUpdates } = updates;

    // Update the employee record (without password)
    const updatedEmployee = await EmployeeModel.update(id, employeeUpdates);

    // If password is provided and not empty, update it in the passwords table
    if (password && password.trim() !== '' && updatedEmployee) {
      // Get the account_id for this employee
      const [account] = await query<any[]>(
        'SELECT account_id FROM user_accounts WHERE employee_id = ?',
        [id]
      );

      if (account) {
        // Update the password
        await query(
          'UPDATE passwords SET password_hash = ? WHERE account_id = ?',
          [password, account.account_id]
        );
      }
    }

    return updatedEmployee;
  }

  static async deleteEmployee(id: number): Promise<void> {
    // Check if this employee is a zookeeper before deleting
    const employee = await EmployeeModel.findById(id);
    
    // If the employee is a zookeeper, delete all their assignments
    // This makes the animals unassigned instead of keeping assignments to a deleted keeper
    if (employee && employee.job_role === 'keeper') {
      await query('DELETE FROM zookeeper_assignments WHERE keeper_id = ?', [id]);
    }
    
    return await EmployeeModel.remove(id);
  }

  static async restoreEmployee(id: number): Promise<Employee | null> {
    return await EmployeeModel.restore(id);
  }
}
