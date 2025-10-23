import { Request, Response } from 'express';
import { CafeSaleService } from '../services/cafeSale.service';

export class CafeSaleController {
  static async createSale(req: Request, res: Response): Promise<void> {
    try {
      const newSale = await CafeSaleService.createSale(req.body);
      res.status(201).json(newSale);
    } catch (error) {
      res.status(500).json({ message: 'Error creating sale', error });
    }
  }

  static async getSaleByTransactionId(req: Request, res: Response): Promise<void> {
    try {
      const sale = await CafeSaleService.getSaleByTransactionId(req.params.transactionId);
      if (sale) {
        res.status(200).json(sale);
      } else {
        res.status(404).json({ message: 'Sale not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error fetching sale', error });
    }
  }

  static async getSalesByDateAndCafe(req: Request, res: Response): Promise<void> {
    try {
      const sales = await CafeSaleService.getSalesByDateAndCafe(req.params.date, parseInt(req.params.cafeId));
      res.status(200).json(sales);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching sales by date and cafe', error });
    }
  }

  static async returnSale(req: Request, res: Response): Promise<void> {
    try {
      await CafeSaleService.returnSale(req.params.transactionId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error processing return', error });
    }
  }
}
