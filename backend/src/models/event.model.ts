import { query } from '../config/database';
import { Event } from '../types/event.types';

export class EventModel {
  static async findAll(): Promise<Event[]> {
    const sql = 'SELECT * FROM events WHERE event_date >= CURDATE() ORDER BY event_date ASC';
    return await query<Event[]>(sql);
  }

  static async create(eventData: Omit<Event, 'event_id'>): Promise<Event> {
    const { name, description, event_date, start_time, end_time, location, max_participants, ticket_price, coordinator_id } = eventData;
    const sql = 'INSERT INTO events (name, description, event_date, start_time, end_time, location, max_participants, ticket_price, coordinator_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const result = await query<any>(sql, [name, description, event_date, start_time, end_time, location, max_participants, ticket_price, coordinator_id]);
    const insertedId = result.insertId;
    return { event_id: insertedId, ...eventData };
  }

  static async findById(eventId: number): Promise<Event | null> {
    const sql = 'SELECT * FROM events WHERE event_id = ?';
    const results = await query<Event[]>(sql, [eventId]);
    return results.length > 0 ? results[0] : null;
  }

  static async update(eventId: number, eventData: Partial<Event>): Promise<Event | null> {
    const sql = 'UPDATE events SET ? WHERE event_id = ?';
    await query(sql, [eventData, eventId]);
    return await this.findById(eventId);
  }

  static async remove(eventId: number): Promise<boolean> {
    const sql = 'DELETE FROM events WHERE event_id = ?';
    const result = await query<any>(sql, [eventId]);
    return result.affectedRows > 0;
  }
}
