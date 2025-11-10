import { query } from '../config/database';

export interface Animal {
  animal_id?: number;
  name: string;
  scientific_name?: string;
  species: string;
  date_of_birth?: string;
  arrival_date: string;
  gender?: 'male' | 'female' | 'unknown';
  place_of_origin?: string;
  habitat_id?: number;
  medical_notes?: string;
  health_status?: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  active_status?: 'active' | 'transferred' | 'deceased';
  endangerment_status?: 'least_concern' | 'near_threatened' | 'vulnerable' | 'endangered' | 'critically_endangered' | 'extinct_in_the_wild' | 'extinct';
  weight?: number;
  created_date?: string;
  updated_date?: string;
  deleted_at?: string | null;
}

export class AnimalModel {
  static async findAll(): Promise<Animal[]> {
    const sql = 'SELECT * FROM animals';
    return await query<Animal[]>(sql);
  }

  static async create(animal: Omit<Animal, 'animal_id'>): Promise<Animal> {
    const columns = Object.keys(animal).join(', ');
    const placeholders = Object.keys(animal).map(() => '?').join(', ');
    const values = Object.values(animal);

    const sql = `INSERT INTO animals (${columns}) VALUES (${placeholders})`;
    const result = await query<any>(sql, values);
    return { animal_id: result.insertId, ...animal };
  }

  static async findById(id: number): Promise<Animal | null> {
    const sql = 'SELECT * FROM animals WHERE animal_id = ?';
    const results = await query<Animal[]>(sql, [id]);
    return results.length > 0 ? results[0] : null;
  }

  static async update(id: number, updates: Partial<Animal>): Promise<Animal | null> {
    const setClause = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(updates), id];

    const sql = `UPDATE animals SET ${setClause} WHERE animal_id = ?`;
    await query(sql, values);
    return await this.findById(id);
  }

  static async remove(id: number): Promise<void> {
    const sql = 'DELETE FROM animals WHERE animal_id = ?';
    await query(sql, [id]);
  }
}
