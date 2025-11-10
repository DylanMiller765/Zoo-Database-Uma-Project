import { query } from '../config/database';
import { Habitat } from '../types/habitat.types';

export class HabitatModel {
  static async findAll(): Promise<Habitat[]> {
    const sql = 'SELECT * FROM habitats WHERE deleted_at IS NULL';
    return await query<Habitat[]>(sql);
  }

  static async findById(id: number): Promise<Habitat | null> {
    const sql = 'SELECT * FROM habitats WHERE habitat_id = ? AND deleted_at IS NULL';
    const results = await query<Habitat[]>(sql, [id]);
    return results.length > 0 ? results[0] : null;
  }

  static async create(habitat: Omit<Habitat, 'habitat_id'>): Promise<Habitat> {
    // Build column names and values dynamically
    const columns = Object.keys(habitat).join(', ');
    const placeholders = Object.keys(habitat).map(() => '?').join(', ');
    const values = Object.values(habitat);

    const sql = `INSERT INTO habitats (${columns}) VALUES (${placeholders})`;
    const result = await query<any>(sql, values);
    return { habitat_id: result.insertId, ...habitat };
  }

  static async update(id: number, updates: Partial<Habitat>): Promise<Habitat | null> {
    // Remove read-only fields that shouldn't be updated
    const { habitat_id, created_date, ...updateFields } = updates as any;

    // Build SET clause dynamically to avoid issues with SET ?
    const setClause = Object.keys(updateFields)
      .map(key => `${key} = ?`)
      .join(', ');

    if (setClause.length === 0) {
      return await this.findById(id);
    }

    const values = Object.values(updateFields);
    const sql = `UPDATE habitats SET ${setClause} WHERE habitat_id = ?`;
    await query(sql, [...values, id]);
    return await this.findById(id);
  }

  static async remove(id: number): Promise<void> {
    const sql = 'UPDATE habitats SET deleted_at = NOW() WHERE habitat_id = ?';
    await query(sql, [id]);
  }
}
