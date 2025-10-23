import { CafeSaleModel } from '../models/cafeSale.model';
import { CafeSale } from '../types/cafeSale.types';

export class CafeSaleService {
  static async createSale(sale: Omit<CafeSale, 'sale_id' | 'transaction_id'>): Promise<CafeSale> {
    return await CafeSaleModel.create(sale);
  }

  static async getSaleByTransactionId(transactionId: string): Promise<CafeSale | null> {
    return await CafeSaleModel.findByTransactionId(transactionId);
  }

  static async getSalesByDateAndCafe(date: string, cafeId: number): Promise<any[]> {
    return await CafeSaleModel.findByDateAndCafe(date, cafeId);
  }

  static async returnSale(transactionId: string): Promise<void> {
    return await CafeSaleModel.remove(transactionId);
  }
}
