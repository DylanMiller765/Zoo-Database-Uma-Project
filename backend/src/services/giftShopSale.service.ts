import { GiftShopSaleModel } from '../models/giftShopSale.model';
import { GiftShopSale } from '../types/giftShopSale.types';
import { query } from '../config/database';

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
    // Get the sale details to retrieve items and quantities
    const sale = await GiftShopSaleModel.findById(id);

    if (!sale) {
      throw new Error(`Gift shop sale #${id} not found`);
    }

    // Check if already returned
    if (sale.status === 'returned') {
      throw new Error('This sale has already been returned');
    }

    // Restore stock for each item in the sale
    for (const item of sale.items) {
      await query(
        `UPDATE gift_shop_items SET quantity_in_stock = quantity_in_stock + ? WHERE item_id = ?`,
        [item.quantity, item.item_id]
      );
    }

    // Mark sale as returned
    await GiftShopSaleModel.remove(id);
  }
}
