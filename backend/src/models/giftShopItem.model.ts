import { query } from '../config/database';
import { GiftShopItem } from '../types/giftShopItem.types';

export class GiftShopItemModel {
  static async findAll(): Promise<GiftShopItem[]> {
    const sql = 'SELECT * FROM gift_shop_items';
    return await query<GiftShopItem[]>(sql);
  }

  static async findById(id: number): Promise<GiftShopItem | null> {
    const sql = 'SELECT * FROM gift_shop_items WHERE item_id = ?';
    const results = await query<GiftShopItem[]>(sql, [id]);
    return results.length > 0 ? results[0] : null;
  }

  static async create(item: Omit<GiftShopItem, 'item_id'>): Promise<GiftShopItem> {
    const sql = 'INSERT INTO gift_shop_items SET ?';
    const result = await query<any>(sql, [item]);
    return { item_id: result.insertId, ...item };
  }

  static async update(id: number, updates: Partial<GiftShopItem>): Promise<GiftShopItem | null> {
    const sql = 'UPDATE gift_shop_items SET ? WHERE item_id = ?';
    await query(sql, [updates, id]);
    return await this.findById(id);
  }

  static async remove(id: number): Promise<void> {
    const sql = 'DELETE FROM gift_shop_items WHERE item_id = ?';
    await query(sql, [id]);
  }

  static async findLowStock(limit: number = 10): Promise<GiftShopItem[]> {
    const sql = 'SELECT * FROM gift_shop_items WHERE quantity_in_stock < ?';
    return await query<GiftShopItem[]>(sql, [limit]);
  }
}
