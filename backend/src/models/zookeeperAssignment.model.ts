import { query } from '../config/database';
import { ZookeeperAssignment, ZookeeperAssignmentWithDetails } from '../types/zoekeeperAssignment.types';

export class ZookeeperAssignmentModel {
  static async findByKeeperId(keeperId: number): Promise<ZookeeperAssignmentWithDetails[]> {
    const sql = `
      SELECT
        za.*,
        CONCAT(e.first_name, ' ', e.last_name) as keeper_name,
        a.name as animal_name,
        a.species as animal_species,
        a.health_status as animal_health_status,
        (SELECT MAX(fl.feeding_time)
         FROM feeding_logs fl
         WHERE fl.animal_id = za.animal_id
        ) as last_fed_time
      FROM zookeeper_assignments za
      LEFT JOIN employees e ON za.keeper_id = e.employee_id
      LEFT JOIN animals a ON za.animal_id = a.animal_id
      WHERE za.keeper_id = ? AND a.deleted_at IS NULL
      ORDER BY a.name
    `;
    return await query<ZookeeperAssignmentWithDetails[]>(sql, [keeperId]);
  }

  static async findAll(): Promise<ZookeeperAssignmentWithDetails[]> {
    const sql = `
      SELECT
        za.*,
        CONCAT(e.first_name, ' ', e.last_name) as keeper_name,
        a.name as animal_name,
        a.species as animal_species,
        a.health_status as animal_health_status,
        (SELECT MAX(fl.feeding_time)
         FROM feeding_logs fl
         WHERE fl.animal_id = za.animal_id
        ) as last_fed_time
      FROM zookeeper_assignments za
      LEFT JOIN employees e ON za.keeper_id = e.employee_id
      LEFT JOIN animals a ON za.animal_id = a.animal_id
      WHERE a.deleted_at IS NULL
      ORDER BY e.last_name, a.name
    `;
    return await query<ZookeeperAssignmentWithDetails[]>(sql);
  }

  static async create(keeperId: number, animalId: number, shift?: string): Promise<number> {
    const sql = `
      INSERT INTO zookeeper_assignments (keeper_id, animal_id, shift)
      VALUES (?, ?, ?)
    `;
    const result = await query<any>(sql, [keeperId, animalId, shift || null]);
    return result.insertId;
  }

  static async remove(assignmentId: number): Promise<void> {
    const sql = 'DELETE FROM zookeeper_assignments WHERE assignment_id = ?';
    await query(sql, [assignmentId]);
  }

  static async checkDuplicateAssignment(keeperId: number, animalId: number): Promise<boolean> {
    const sql = `
      SELECT COUNT(*) as count
      FROM zookeeper_assignments
      WHERE keeper_id = ? AND animal_id = ?
    `;
    const result = await query<any[]>(sql, [keeperId, animalId]);
    return result[0].count > 0;
  }
}
