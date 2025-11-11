import { Customer, CustomerModel } from '../models/customer.model';
import { query } from '../config/database';

export class CustomerService {
  static async getAllCustomers(): Promise<Customer[]> {
    return await CustomerModel.findAll();
  }

  static async createCustomer(customerData: Omit<Customer, 'customer_id'> & { password: string }): Promise<Customer> {
    const { password, ...customer } = customerData;

    // Step 1: Create the customer
    const newCustomer = await CustomerModel.create(customer);

    // Step 2: Create user account if email and password are provided (use email as username)
    if (customer.email && password) {
      const userAccountResult = await query<any>(
        'INSERT INTO user_accounts (username, email, role, customer_id) VALUES (?, ?, ?, ?)',
        [customer.email, customer.email, 'customer', newCustomer.customer_id]
      );
      const accountId = userAccountResult.insertId;

      // Step 3: Save the password (plain text)
      await query('INSERT INTO passwords (account_id, password_hash) VALUES (?, ?)', [accountId, password]);
    }

    return newCustomer;
  }

  static async getCustomerById(id: number): Promise<Customer | null> {
    return await CustomerModel.findById(id);
  }

  static async updateCustomer(id: number, updates: Partial<Customer> & { password?: string }): Promise<Customer | null> {
    const { password, ...customerUpdates } = updates;

    // Update the customer record (without password)
    const updatedCustomer = await CustomerModel.update(id, customerUpdates);

    // If password is provided and not empty, update it in the passwords table
    if (password && password.trim() !== '' && updatedCustomer) {
      // Get the account_id for this customer
      const [account] = await query<any[]>(
        'SELECT account_id FROM user_accounts WHERE customer_id = ?',
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

    return updatedCustomer;
  }

  static async deleteCustomer(id: number): Promise<void> {
    return await CustomerModel.remove(id);
  }
}
