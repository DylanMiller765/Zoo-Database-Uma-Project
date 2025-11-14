import { Request, Response } from 'express';
import { TransactionService } from '../services/transaction.service';

export class TransactionController {
  static async getAll(req: Request, res: Response) {
    try {
      const transactions = await TransactionService.getAll();
      res.json(transactions);
    } catch (error) {
      console.error('Failed to get all transactions', error);
      res.status(500).json({ message: 'Failed to get all transactions' });
    }
  }
}
