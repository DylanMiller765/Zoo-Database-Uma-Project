import { Customer, CustomerModel } from '../models/customer.model';
import { query } from '../config/database';

interface CreateCustomerData extends Omit<Customer, 'customer_id'> {
  password: string;
}

export class CustomerService {
  static async getAllCustomers(): Promise<Customer[]> {
    return await CustomerModel.findAll();
  }

  static async createCustomer(data: CreateCustomerData): Promise<Customer> {
    const { password, ...customerData } = data;

    // Step 1: Create customer record
    const newCustomer = await CustomerModel.create(customerData);

    if (!newCustomer.customer_id) {
      throw new Error('Failed to create customer');
    }

    // Step 2: Create user account (email is now required)
    const userAccountResult = await query<any>(
      'INSERT INTO user_accounts (email, role, customer_id) VALUES (?, ?, ?)',
      [newCustomer.email, 'customer', newCustomer.customer_id]
    );

    const accountId = userAccountResult.insertId;

    // Step 3: Create password record (plain text for student project)
    await query(
      'INSERT INTO passwords (account_id, password_hash) VALUES (?, ?)',
      [accountId, password]
    );

    return newCustomer;
  }

  static async getCustomerById(id: number): Promise<Customer | null> {
    return await CustomerModel.findById(id);
  }

  static async updateCustomer(id: number, updates: Partial<Customer>): Promise<Customer | null> {
    return await CustomerModel.update(id, updates);
  }

  static async deleteCustomer(id: number): Promise<void> {
    return await CustomerModel.remove(id);
  }
}
