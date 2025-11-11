import { query } from '../config/database';
import { CafeItem } from '../types/cafeItem.types';

export class CafeItemModel {
  static async findAll(): Promise<CafeItem[]> {
    const sql = 'SELECT * FROM cafe_items WHERE deleted_at IS NULL';
    return await query<CafeItem[]>(sql);
  }

  static async findById(id: number): Promise<CafeItem | null> {
    const sql = 'SELECT * FROM cafe_items WHERE item_id = ? AND deleted_at IS NULL';
    const results = await query<CafeItem[]>(sql, [id]);
    return results.length > 0 ? results[0] : null;
  }

  static async create(item: Omit<CafeItem, 'item_id'>): Promise<CafeItem> {
    const sql = 'INSERT INTO cafe_items SET ?';
    const result = await query<any>(sql, [item]);
    return { item_id: result.insertId, ...item };
  }

  static async update(id: number, updates: Partial<CafeItem>): Promise<CafeItem | null> {
    const sql = 'UPDATE cafe_items SET ? WHERE item_id = ?';
    await query(sql, [updates, id]);
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
}
