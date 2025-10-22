import { Customer, CustomerModel } from '../models/customer.model';

export class CustomerService {
  static async getAllCustomers(): Promise<Customer[]> {
    return await CustomerModel.findAll();
  }

  static async createCustomer(customer: Omit<Customer, 'customer_id'>): Promise<Customer> {
    return await CustomerModel.create(customer);
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
