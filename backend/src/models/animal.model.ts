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
  image_url?: string;
  created_date?: string;
  updated_date?: string;
  deleted_at?: string | null;
}

export interface AnimalWithDetails extends Animal {
  habitat_name?: string | null;
}

export class AnimalModel {
  static async findAll(): Promise<AnimalWithDetails[]> {
    const sql = `
      SELECT a.*, h.habitat_name
      FROM animals a
      LEFT JOIN habitats h ON a.habitat_id = h.habitat_id
      WHERE a.deleted_at IS NULL
    `;
    return await query<AnimalWithDetails[]>(sql);
  }

  static async findAllIncludingDeleted(): Promise<AnimalWithDetails[]> {
    const sql = `
      SELECT a.*, h.habitat_name
      FROM animals a
      LEFT JOIN habitats h ON a.habitat_id = h.habitat_id
    `;
    return await query<AnimalWithDetails[]>(sql);
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
    const sql = 'SELECT * FROM animals WHERE animal_id = ? AND deleted_at IS NULL';
    const results = await query<Animal[]>(sql, [id]);
    return results.length > 0 ? results[0] : null;
  }

  static async update(id: number, updates: Partial<Animal>): Promise<Animal | null> {
    // Filter out undefined values and empty strings for optional fields (except image_url which can be empty to clear)
    const filteredUpdates = Object.entries(updates).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        // Allow empty string for image_url to clear the image
        if (key === 'image_url' || value !== '') {
          acc[key] = value;
        }
      }
      return acc;
    }, {} as Record<string, any>);

    if (Object.keys(filteredUpdates).length === 0) {
      return await this.findById(id);
    }

    const setClause = Object.keys(filteredUpdates).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(filteredUpdates), id];

    const sql = `UPDATE animals SET ${setClause} WHERE animal_id = ?`;
    await query(sql, values);
    return await this.findById(id);
  }

  static async remove(id: number, activeStatus?: 'transferred' | 'deceased'): Promise<void> {
    if (activeStatus && ['transferred', 'deceased'].includes(activeStatus)) {
      const sql = 'UPDATE animals SET active_status = ?, deleted_at = NOW() WHERE animal_id = ?';
      await query(sql, [activeStatus, id]);
    } else {
      const sql = 'UPDATE animals SET deleted_at = NOW() WHERE animal_id = ?';
      await query(sql, [id]);
    }
  }

  static async restore(id: number): Promise<Animal | null> {
    const sql = 'UPDATE animals SET deleted_at = NULL WHERE animal_id = ?';
    await query(sql, [id]);
    return await this.findById(id);
  }
}
