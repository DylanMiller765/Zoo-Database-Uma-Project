import { query } from '../config/database';
import { GiftShopItem } from '../types/giftShopItem.types';

export class GiftShopItemModel {
  static async findAll(): Promise<GiftShopItem[]> {
    try {
      const sql = 'SELECT * FROM gift_shop_items WHERE deleted_at IS NULL';
      return await query<GiftShopItem[]>(sql);
    } catch (error: any) {
      // If deleted_at column doesn't exist, fall back to fetching all items
      if (error.code === 'ER_BAD_FIELD_ERROR' && error.message.includes('deleted_at')) {
        const sql = 'SELECT * FROM gift_shop_items';
        return await query<GiftShopItem[]>(sql);
      }
      throw error;
    }
  }

  static async findAllIncludingDeleted(): Promise<GiftShopItem[]> {
    const sql = 'SELECT * FROM gift_shop_items';
    return await query<GiftShopItem[]>(sql);
  }

  static async findById(id: number): Promise<GiftShopItem | null> {
    try {
      const sql = 'SELECT * FROM gift_shop_items WHERE item_id = ? AND deleted_at IS NULL';
      const results = await query<GiftShopItem[]>(sql, [id]);
      return results.length > 0 ? results[0] : null;
    } catch (error: any) {
      // If deleted_at column doesn't exist, fall back to simple ID lookup
      if (error.code === 'ER_BAD_FIELD_ERROR' && error.message.includes('deleted_at')) {
        const sql = 'SELECT * FROM gift_shop_items WHERE item_id = ?';
        const results = await query<GiftShopItem[]>(sql, [id]);
        return results.length > 0 ? results[0] : null;
      }
      throw error;
    }
  }

  static async create(item: Omit<GiftShopItem, 'item_id'>): Promise<GiftShopItem> {
    const columns = Object.keys(item).join(', ');
    const placeholders = Object.keys(item).map(() => '?').join(', ');
    const values = Object.values(item);

    const sql = `INSERT INTO gift_shop_items (${columns}) VALUES (${placeholders})`;
    const result = await query<any>(sql, values);
    return { item_id: result.insertId, ...item };
  }

  static async update(id: number, updates: Partial<GiftShopItem>): Promise<GiftShopItem | null> {
    const setClause = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(updates), id];

    const sql = `UPDATE gift_shop_items SET ${setClause} WHERE item_id = ?`;
    await query(sql, values);
    return await this.findById(id);
  }

  static async remove(id: number): Promise<void> {
    try {
      const sql = 'UPDATE gift_shop_items SET deleted_at = NOW() WHERE item_id = ?';
      await query(sql, [id]);
    } catch (error: any) {
      // If deleted_at column doesn't exist, silently ignore (soft deletes not supported)
      if (error.code === 'ER_BAD_FIELD_ERROR' && error.message.includes('deleted_at')) {
        console.warn('Warning: Could not soft delete item, deleted_at column does not exist');
      } else {
        throw error;
      }
    }
  }

  static async findLowStock(limit: number = 10): Promise<GiftShopItem[]> {
    try {
      const sql = 'SELECT * FROM gift_shop_items WHERE quantity_in_stock < ? AND deleted_at IS NULL';
      return await query<GiftShopItem[]>(sql, [limit]);
    } catch (error: any) {
      // If deleted_at column doesn't exist, fall back to simple low stock query
      if (error.code === 'ER_BAD_FIELD_ERROR' && error.message.includes('deleted_at')) {
        const sql = 'SELECT * FROM gift_shop_items WHERE quantity_in_stock < ?';
        return await query<GiftShopItem[]>(sql, [limit]);
      }
      throw error;
    }
  }

  static async restore(id: number): Promise<GiftShopItem | null> {
    try {
      const sql = 'UPDATE gift_shop_items SET deleted_at = NULL WHERE item_id = ?';
      await query(sql, [id]);
    } catch (error: any) {
      // If deleted_at column doesn't exist, silently ignore (soft deletes not supported)
      if (error.code === 'ER_BAD_FIELD_ERROR' && error.message.includes('deleted_at')) {
        console.warn('Warning: Could not restore item, deleted_at column does not exist');
      } else {
        throw error;
      }
    }
    return await this.findById(id);
  }
}
