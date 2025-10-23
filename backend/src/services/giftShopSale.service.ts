import { GiftShopSaleModel } from '../models/giftShopSale.model';
import { GiftShopSale } from '../types/giftShopSale.types';

export class GiftShopSaleService {
  static async createSale(sale: Omit<GiftShopSale, 'transaction_id' | 'total_amount'>): Promise<GiftShopSale> {
    const total_amount = sale.items.reduce((sum, item) => sum + item.quantity * item.unit_price, 0);
    const newSale = { ...sale, total_amount };
    return await GiftShopSaleModel.create(newSale);
  }

  static async getSaleById(id: number): Promise<GiftShopSale | null> {
    return await GiftShopSaleModel.findById(id);
  }

  static async getSalesByDate(date: string): Promise<GiftShopSale[]> {
    return await GiftShopSaleModel.findByDate(date);
  }

  static async returnSale(id: number): Promise<void> {
    // This should also handle restocking items.
    return await GiftShopSaleModel.remove(id);
  }
}
