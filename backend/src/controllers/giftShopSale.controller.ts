import { Request, Response } from 'express';
import { GiftShopSaleService } from '../services/giftShopSale.service';

export class GiftShopSaleController {
  static async createSale(req: Request, res: Response): Promise<void> {
    try {
      const newSale = await GiftShopSaleService.createSale(req.body);
      res.status(201).json(newSale);
    } catch (error) {
      res.status(500).json({ message: 'Error creating sale', error });
    }
  }

  static async getSaleById(req: Request, res: Response): Promise<void> {
    try {
      const sale = await GiftShopSaleService.getSaleById(parseInt(req.params.id));
      if (sale) {
        res.status(200).json(sale);
      } else {
        res.status(404).json({ message: 'Sale not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error fetching sale', error });
    }
  }

  static async getSalesByDate(req: Request, res: Response): Promise<void> {
    try {
      const sales = await GiftShopSaleService.getSalesByDate(req.params.date);
      res.status(200).json(sales);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching sales by date', error });
    }
  }

  static async returnSale(req: Request, res: Response): Promise<void> {
    try {
      await GiftShopSaleService.returnSale(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error processing return', error });
    }
  }
}
