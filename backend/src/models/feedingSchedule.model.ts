import { query } from '../config/database';
import { FeedingSchedule, CreateFeedingScheduleInput, UpdateFeedingScheduleInput } from '../types/feedingSchedule.types';

export class FeedingScheduleModel {
  static async findAll(): Promise<FeedingSchedule[]> {
    const sql = 'SELECT * FROM feeding_schedules ORDER BY animal_id, scheduled_time';
    return await query<FeedingSchedule[]>(sql);
  }

  static async findByAnimalId(animalId: number): Promise<FeedingSchedule[]> {
    const sql = 'SELECT * FROM feeding_schedules WHERE animal_id = ? ORDER BY scheduled_time';
    return await query<FeedingSchedule[]>(sql, [animalId]);
  }

  static async findById(id: number): Promise<FeedingSchedule | null> {
    const sql = 'SELECT * FROM feeding_schedules WHERE schedule_id = ?';
    const results = await query<FeedingSchedule[]>(sql, [id]);
    return results.length > 0 ? results[0] : null;
  }

  static async create(schedule: CreateFeedingScheduleInput): Promise<FeedingSchedule> {
    const columns = Object.keys(schedule).join(', ');
    const placeholders = Object.keys(schedule).map(() => '?').join(', ');
    const values = Object.values(schedule);

    const sql = `INSERT INTO feeding_schedules (${columns}) VALUES (${placeholders})`;
    const result = await query<any>(sql, values);
    return { schedule_id: result.insertId, ...schedule } as FeedingSchedule;
  }

  static async update(id: number, updates: UpdateFeedingScheduleInput): Promise<FeedingSchedule | null> {
    const setClause = Object.keys(updates)
      .map(key => `${key} = ?`)
      .join(', ');

    if (setClause.length === 0) {
      return await this.findById(id);
    }

    const values = Object.values(updates);
    const sql = `UPDATE feeding_schedules SET ${setClause} WHERE schedule_id = ?`;
    await query(sql, [...values, id]);
    return await this.findById(id);
  }

  static async delete(id: number): Promise<void> {
    const sql = 'DELETE FROM feeding_schedules WHERE schedule_id = ?';
    await query(sql, [id]);
  }
}
