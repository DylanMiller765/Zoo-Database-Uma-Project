import { query } from '../config/database';

export interface Customer {
  customer_id?: number;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  annual_pass?: 'yes' | 'no';
  registration_date?: string;
}

export class CustomerModel {
  static async findAll(): Promise<Customer[]> {
    const sql = 'SELECT * FROM customers';
    return await query<Customer[]>(sql);
  }

  static async create(customer: Omit<Customer, 'customer_id'>): Promise<Customer> {
    const columns = Object.keys(customer).join(', ');
    const placeholders = Object.keys(customer).map(() => '?').join(', ');
    const values = Object.values(customer);

    const sql = `INSERT INTO customers (${columns}) VALUES (${placeholders})`;
    const result = await query<any>(sql, values);
    return { customer_id: result.insertId, ...customer };
  }

  static async findById(id: number): Promise<Customer | null> {
    const sql = 'SELECT * FROM customers WHERE customer_id = ?';
    const results = await query<Customer[]>(sql, [id]);
    return results.length > 0 ? results[0] : null;
  }

  static async update(id: number, updates: Partial<Customer>): Promise<Customer | null> {
    const setClause = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(updates), id];

    const sql = `UPDATE customers SET ${setClause} WHERE customer_id = ?`;
    await query(sql, values);
    return await this.findById(id);
  }

  static async remove(id: number): Promise<void> {
    const sql = 'DELETE FROM customers WHERE customer_id = ?';
    await query(sql, [id]);
  }
}
