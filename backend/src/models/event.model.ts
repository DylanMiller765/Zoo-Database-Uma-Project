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
    const { name, description, event_date, start_time, end_time, location, max_participants, ticket_price, image_url, coordinator_id } = eventData;
    const sql = 'INSERT INTO events (name, description, event_date, start_time, end_time, location, max_participants, ticket_price, image_url, coordinator_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const result = await query<any>(sql, [name, description, event_date, start_time, end_time, location, max_participants, ticket_price, image_url || null, coordinator_id]);
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

  static async remove(eventId: number, employeeInfo?: { employee_id: number; name: string }): Promise<boolean> {
    // Set session variable for trigger to read (who cancelled the event)
    if (employeeInfo) {
      await query('SET @cancelled_by_employee_id = ?, @cancelled_by_employee_name = ?', [
        employeeInfo.employee_id,
        employeeInfo.name
      ]);
    }

    const sql = 'UPDATE events SET deleted_at = NOW() WHERE event_id = ?';
    const result = await query<any>(sql, [eventId]);

    // Automatically refund all event registrations for this cancelled event
    // Wrapped in try-catch since refunded_at and refund_reason may not exist in all database versions
    if (result.affectedRows > 0) {
      try {
        const employeeName = employeeInfo?.name || 'System';
        const refundSql = `
          UPDATE event_registrations
          SET refunded_at = NOW(),
              refund_reason = ?
          WHERE event_id = ?
            AND refunded_at IS NULL
        `;
        await query(refundSql, [`Event cancelled by ${employeeName}`, eventId]);
      } catch (error) {
        // If refund columns don't exist, continue anyway - event is already deleted
        console.error('Warning: Could not update refund information for event registrations:', error);
      }
    }

    // Clear session variables
    if (employeeInfo) {
      await query('SET @cancelled_by_employee_id = NULL, @cancelled_by_employee_name = NULL');
    }

    return result.affectedRows > 0;
  }

  static async restore(eventId: number): Promise<Event | null> {
    const sql = 'UPDATE events SET deleted_at = NULL WHERE event_id = ?';
    await query(sql, [eventId]);
    return await this.findById(eventId);
  }
}
