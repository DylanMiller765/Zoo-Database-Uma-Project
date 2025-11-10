import { query } from '../config/database';
import { Attraction } from '../types/attraction.types';

export class AttractionModel {
  static async findAll(): Promise<Attraction[]> {
    const sql = 'SELECT * FROM attractions WHERE deleted_at IS NULL';
    return await query<Attraction[]>(sql);
  }

  static async findById(id: number): Promise<Attraction | null> {
    const sql = 'SELECT * FROM attractions WHERE attraction_id = ? AND deleted_at IS NULL';
    const results = await query<Attraction[]>(sql, [id]);
    return results.length > 0 ? results[0] : null;
  }

  static async create(attraction: Omit<Attraction, 'attraction_id'>): Promise<Attraction> {
    const sql = 'INSERT INTO attractions SET ?';
    const result = await query<any>(sql, [attraction]);
    return { attraction_id: result.insertId, ...attraction };
  }

  static async update(id: number, updates: Partial<Attraction>): Promise<Attraction | null> {
    const sql = 'UPDATE attractions SET ? WHERE attraction_id = ?';
    await query(sql, [updates, id]);
    return await this.findById(id);
  }

  static async remove(id: number): Promise<void> {
    const sql = 'UPDATE attractions SET deleted_at = NOW() WHERE attraction_id = ?';
    await query(sql, [id]);
  }
}
