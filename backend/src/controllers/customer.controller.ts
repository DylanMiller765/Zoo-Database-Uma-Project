import { Request, Response } from 'express';
import { CustomerService } from '../services/customer.service';

export class CustomerController {
  static async getAllCustomers(req: Request, res: Response): Promise<void> {
    try {
      const customers = await CustomerService.getAllCustomers();
      res.status(200).json(customers);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching customers', error });
    }
  }

  static async createCustomer(req: Request, res: Response): Promise<void> {
    try {
      console.log('👤 Creating customer with data:', JSON.stringify(req.body, null, 2));

      // Validate that email and password are provided
      if (!req.body.email) {
        res.status(400).json({ message: 'Email is required' });
        return;
      }

      if (!req.body.password) {
        res.status(400).json({ message: 'Password is required' });
        return;
      }

      const newCustomer = await CustomerService.createCustomer(req.body);
      console.log('✅ Customer created successfully:', newCustomer);
      res.status(201).json(newCustomer);
    } catch (error) {
      console.error('❌ Error creating customer:', error);
      res.status(500).json({ message: 'Error creating customer', error });
    }
  }

  static async getCustomerById(req: Request, res: Response): Promise<void> {
    try {
      const customer = await CustomerService.getCustomerById(parseInt(req.params.id));
      if (customer) {
        res.status(200).json(customer);
      } else {
        res.status(404).json({ message: 'Customer not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error fetching customer', error });
    }
  }

  static async updateCustomer(req: Request, res: Response): Promise<void> {
    try {
      const updatedCustomer = await CustomerService.updateCustomer(parseInt(req.params.id), req.body);
      if (updatedCustomer) {
        res.status(200).json(updatedCustomer);
      } else {
        res.status(404).json({ message: 'Customer not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error updating customer', error });
    }
  }

  static async deleteCustomer(req: Request, res: Response): Promise<void> {
    try {
      await CustomerService.deleteCustomer(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error deleting customer', error });
    }
  }
}
