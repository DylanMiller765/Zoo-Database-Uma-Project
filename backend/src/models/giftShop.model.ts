import { query } from '../config/database';

export interface GiftShop {
  gift_shop_id?: number;
  name: string;
  location?: string;
  opening_time?: string;
  closing_time?: string;
  manager_id?: number;
  deleted_at?: string | null;
}

export class GiftShopModel {
  static async findAll(): Promise<GiftShop[]> {
    const sql = 'SELECT * FROM gift_shops WHERE deleted_at IS NULL';
    return await query<GiftShop[]>(sql);
  }

  static async findAllIncludingDeleted(): Promise<GiftShop[]> {
    const sql = 'SELECT * FROM gift_shops';
    return await query<GiftShop[]>(sql);
  }

  static async create(shop: Omit<GiftShop, 'gift_shop_id'>): Promise<GiftShop> {
    const columns = Object.keys(shop).join(', ');
    const placeholders = Object.keys(shop).map(() => '?').join(', ');
    const values = Object.values(shop);

    const sql = `INSERT INTO gift_shops (${columns}) VALUES (${placeholders})`;
    const result = await query<any>(sql, values);
    return { gift_shop_id: result.insertId, ...shop };
  }

  static async findById(id: number): Promise<GiftShop | null> {
    const sql = 'SELECT * FROM gift_shops WHERE gift_shop_id = ? AND deleted_at IS NULL';
    const results = await query<GiftShop[]>(sql, [id]);
    return results.length > 0 ? results[0] : null;
  }

  static async update(id: number, updates: Partial<GiftShop>): Promise<GiftShop | null> {
    const setClause = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(updates), id];

    const sql = `UPDATE gift_shops SET ${setClause} WHERE gift_shop_id = ?`;
    await query(sql, values);
    return await this.findById(id);
  }

  static async remove(id: number): Promise<void> {
    const sql = 'UPDATE gift_shops SET deleted_at = NOW() WHERE gift_shop_id = ?';
    await query(sql, [id]);
  }

  static async restore(id: number): Promise<GiftShop | null> {
    const sql = 'UPDATE gift_shops SET deleted_at = NULL WHERE gift_shop_id = ?';
    await query(sql, [id]);
    return await this.findById(id);
  }
}
