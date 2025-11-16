import { query } from '../config/database';
import { CafeItem } from '../types/cafeItem.types';

export class CafeItemModel {
  static async findAll(): Promise<CafeItem[]> {
    const sql = 'SELECT * FROM cafe_items WHERE deleted_at IS NULL';
    return await query<CafeItem[]>(sql);
  }

  static async findAllIncludingDeleted(): Promise<CafeItem[]> {
    const sql = 'SELECT * FROM cafe_items';
    return await query<CafeItem[]>(sql);
  }

  static async findById(id: number): Promise<CafeItem | null> {
    const sql = 'SELECT * FROM cafe_items WHERE item_id = ? AND deleted_at IS NULL';
    const results = await query<CafeItem[]>(sql, [id]);
    return results.length > 0 ? results[0] : null;
  }

  static async create(item: Omit<CafeItem, 'item_id'>): Promise<CafeItem> {
    const columns = Object.keys(item).join(', ');
    const placeholders = Object.keys(item).map(() => '?').join(', ');
    const values = Object.values(item);

    const sql = `INSERT INTO cafe_items (${columns}) VALUES (${placeholders})`;
    const result = await query<any>(sql, values);
    return { item_id: result.insertId, ...item };
  }

  static async update(id: number, updates: Partial<CafeItem>): Promise<CafeItem | null> {
    const setClause = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(updates), id];

    const sql = `UPDATE cafe_items SET ${setClause} WHERE item_id = ?`;
    await query(sql, values);
    return await this.findById(id);
  }

  static async remove(id: number): Promise<void> {
    const sql = 'UPDATE cafe_items SET deleted_at = NOW() WHERE item_id = ?';
    await query(sql, [id]);
  }

  static async findByCafe(cafeId: number): Promise<CafeItem[]> {
    const sql = 'SELECT * FROM cafe_items WHERE cafe_id = ? AND deleted_at IS NULL';
    return await query<CafeItem[]>(sql, [cafeId]);
  }

  static async restore(id: number): Promise<CafeItem | null> {
    const sql = 'UPDATE cafe_items SET deleted_at = NULL WHERE item_id = ?';
    await query(sql, [id]);
    return await this.findById(id);
  }
}
