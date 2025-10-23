import { query } from '../config/database';
import { EventRegistration } from '../types/eventRegistration.types';

export class EventRegistrationModel {
  static async findAll(): Promise<EventRegistration[]> {
    const sql = 'SELECT * FROM event_registrations';
    return await query<EventRegistration[]>(sql);
  }

  static async findById(id: number): Promise<EventRegistration | null> {
    const sql = 'SELECT * FROM event_registrations WHERE registration_id = ?';
    const results = await query<EventRegistration[]>(sql, [id]);
    return results.length > 0 ? results[0] : null;
  }

  static async create(registration: Omit<EventRegistration, 'registration_id'>): Promise<EventRegistration> {
    const sql = 'INSERT INTO event_registrations SET ?';
    const result = await query<any>(sql, [registration]);
    return { registration_id: result.insertId, ...registration };
  }

  static async update(id: number, updates: Partial<EventRegistration>): Promise<EventRegistration | null> {
    const sql = 'UPDATE event_registrations SET ? WHERE registration_id = ?';
    await query(sql, [updates, id]);
    return await this.findById(id);
  }

  static async remove(id: number): Promise<void> {
    const sql = 'DELETE FROM event_registrations WHERE registration_id = ?';
    await query(sql, [id]);
  }

  static async findByEvent(eventId: number): Promise<EventRegistration[]> {
    const sql = 'SELECT * FROM event_registrations WHERE event_id = ?';
    return await query<EventRegistration[]>(sql, [eventId]);
  }
}
