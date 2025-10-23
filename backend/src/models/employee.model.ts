import { query } from '../config/database';

export interface Employee {
  employee_id?: number;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  hire_date?: string;
  job_title?: string;
  department?: string;
  job_role: 'keeper' | 'manager' | 'coordinator' | 'cashier' | 'guide' | 'veterinarian' | 'maintenance' | 'security' | 'other';
  salary?: number;
  status?: 'active' | 'inactive';
  ssn: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  birthday?: string;
  employment_type: 'full_time' | 'part_time';
}

export class EmployeeModel {
  static async findAll(): Promise<Employee[]> {
    const sql = 'SELECT * FROM employees';
    return await query<Employee[]>(sql);
  }

  static async create(employee: Omit<Employee, 'employee_id'>): Promise<Employee> {
    // Filter out undefined values to avoid MySQL errors
    const cleanData = Object.fromEntries(
      Object.entries(employee).filter(([_, value]) => value !== undefined)
    );

    // Build dynamic SQL query
    const columns = Object.keys(cleanData);
    const placeholders = columns.map(() => '?').join(', ');
    const values = Object.values(cleanData);

    const sql = `INSERT INTO employees (${columns.join(', ')}) VALUES (${placeholders})`;
    const result = await query<any>(sql, values);
    return { employee_id: result.insertId, ...cleanData } as Employee;
  }

  static async findById(id: number): Promise<Employee | null> {
    const sql = 'SELECT * FROM employees WHERE employee_id = ?';
    const results = await query<Employee[]>(sql, [id]);
    return results.length > 0 ? results[0] : null;
  }

  static async update(id: number, updates: Partial<Employee>): Promise<Employee | null> {
    // Filter out undefined values to avoid MySQL errors
    const cleanData = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value !== undefined)
    );

    // Build dynamic SQL query
    const columns = Object.keys(cleanData);
    const setClause = columns.map(col => `${col} = ?`).join(', ');
    const values = [...Object.values(cleanData), id];

    const sql = `UPDATE employees SET ${setClause} WHERE employee_id = ?`;
    await query(sql, values);
    return await this.findById(id);
  }

  static async remove(id: number): Promise<void> {
    const sql = 'DELETE FROM employees WHERE employee_id = ?';
    await query(sql, [id]);
  }
}
