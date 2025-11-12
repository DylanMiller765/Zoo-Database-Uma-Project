import { query } from '../config/database';

export interface Cafe {
  cafe_id?: number;
  name: string;
  location?: string;
  opening_time?: string;
  closing_time?: string;
  manager_id?: number;
  deleted_at?: string | null;
}

export class CafeModel {
  static async findAll(): Promise<Cafe[]> {
    const sql = 'SELECT * FROM cafes WHERE deleted_at IS NULL';
    return await query<Cafe[]>(sql);
  }

  static async findAllIncludingDeleted(): Promise<Cafe[]> {
    const sql = 'SELECT * FROM cafes';
    return await query<Cafe[]>(sql);
  }

  static async create(cafe: Omit<Cafe, 'cafe_id'>): Promise<Cafe> {
    const columns = Object.keys(cafe).join(', ');
    const placeholders = Object.keys(cafe).map(() => '?').join(', ');
    const values = Object.values(cafe);

    const sql = `INSERT INTO cafes (${columns}) VALUES (${placeholders})`;
    const result = await query<any>(sql, values);
    return { cafe_id: result.insertId, ...cafe };
  }

  static async findById(id: number): Promise<Cafe | null> {
    const sql = 'SELECT * FROM cafes WHERE cafe_id = ? AND deleted_at IS NULL';
    const results = await query<Cafe[]>(sql, [id]);
    return results.length > 0 ? results[0] : null;
  }

  static async update(id: number, updates: Partial<Cafe>): Promise<Cafe | null> {
    const setClause = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(updates), id];

    const sql = `UPDATE cafes SET ${setClause} WHERE cafe_id = ?`;
    await query(sql, values);
    return await this.findById(id);
  }

  static async remove(id: number): Promise<void> {
    const sql = 'UPDATE cafes SET deleted_at = NOW() WHERE cafe_id = ?';
    await query(sql, [id]);
  }

  static async restore(id: number): Promise<Cafe | null> {
    const sql = 'UPDATE cafes SET deleted_at = NULL WHERE cafe_id = ?';
    await query(sql, [id]);
    return await this.findById(id);
  }
}
