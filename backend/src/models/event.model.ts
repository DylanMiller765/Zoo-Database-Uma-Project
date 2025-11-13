import { query } from '../config/database';
import { Event, EventWithDetails } from '../types/event.types';

export class EventModel {
  static async findAll(): Promise<EventWithDetails[]> {
    const sql = `
      SELECT e.*, CONCAT(emp.first_name, ' ', emp.last_name) as coordinator_name
      FROM events e
      LEFT JOIN employees emp ON e.coordinator_id = emp.employee_id
      WHERE e.deleted_at IS NULL
      ORDER BY e.event_date DESC
    `;
    return await query<EventWithDetails[]>(sql);
  }

  static async findAllIncludingDeleted(): Promise<EventWithDetails[]> {
    const sql = `
      SELECT e.*, CONCAT(emp.first_name, ' ', emp.last_name) as coordinator_name
      FROM events e
      LEFT JOIN employees emp ON e.coordinator_id = emp.employee_id
      ORDER BY e.event_date DESC
    `;
    return await query<EventWithDetails[]>(sql);
  }

  static async create(eventData: Omit<Event, 'event_id'>): Promise<Event> {
    const { name, description, event_date, start_time, end_time, location, max_participants, ticket_price, coordinator_id } = eventData;
    const sql = 'INSERT INTO events (name, description, event_date, start_time, end_time, location, max_participants, ticket_price, coordinator_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const result = await query<any>(sql, [name, description, event_date, start_time, end_time, location, max_participants, ticket_price, coordinator_id]);
    const insertedId = result.insertId;
    return { event_id: insertedId, ...eventData };
  }

  static async findById(eventId: number): Promise<Event | null> {
    const sql = 'SELECT * FROM events WHERE event_id = ? AND deleted_at IS NULL'; // Edited line
    const results = await query<Event[]>(sql, [eventId]);
    return results.length > 0 ? results[0] : null;
  }

  static async update(eventId: number, eventData: Partial<Event>): Promise<Event | null> {
    const setClause = Object.keys(eventData).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(eventData), eventId];

    const sql = `UPDATE events SET ${setClause} WHERE event_id = ?`;
    await query(sql, values);
    return await this.findById(eventId);
  }

  static async remove(eventId: number): Promise<boolean> {
    const sql = 'UPDATE events SET deleted_at = NOW() WHERE event_id = ?';
    const result = await query<any>(sql, [eventId]);
    return result.affectedRows > 0;
  }

  static async restore(eventId: number): Promise<Event | null> {
    const sql = 'UPDATE events SET deleted_at = NULL WHERE event_id = ?';
    await query(sql, [eventId]);
    return await this.findById(eventId);
  }
}
