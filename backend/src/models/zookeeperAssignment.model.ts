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
}
