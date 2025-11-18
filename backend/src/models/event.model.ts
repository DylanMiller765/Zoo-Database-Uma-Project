import { query } from '../config/database';
import { Event, EventWithDetails } from '../types/event.types';
import { NotificationModel } from './notification.model';
import { RowDataPacket } from 'mysql2';

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

  static async remove(eventId: number, employeeInfo?: { employee_id: number; name: string }): Promise<boolean> {
    // Get event details before deletion (needed for notification message)
    const events = await query<(Event & RowDataPacket)[]>(
      'SELECT * FROM events WHERE event_id = ? AND deleted_at IS NULL',
      [eventId]
    );

    if (events.length === 0) {
      console.warn(`Event ${eventId} not found or already deleted`);
      return false;
    }

    const event = events[0];
    const eventName = event.name;
    const eventDate = new Date(event.event_date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const startTime = event.start_time?.toString().substring(0, 5) || '';
    const eventDateTime = `${eventDate}${startTime ? ` at ${startTime}` : ''}`;

    // Get all customers registered for this event
    const registrations = await query<(RowDataPacket & { customer_id: number })[]>(
      `SELECT DISTINCT customer_id
       FROM event_registrations
       WHERE event_id = ? AND customer_id IS NOT NULL`,
      [eventId]
    );

    // Create notification message
    const employeeName = employeeInfo?.name || 'Zoo Management';
    const cancellationMessage = `CANCELLATION: The event "${eventName}" scheduled for ${eventDateTime} has been cancelled. We sincerely apologize for any inconvenience this may cause. ${employeeName} has initiated a full refund for your registration.`;

    // Create notifications for all registered customers
    const notificationPromises = registrations.map(reg =>
      NotificationModel.create({
        customer_id: reg.customer_id,
        message: cancellationMessage,
        notification_type: 'alert',
        is_read: false
      }).catch(error => {
        console.error(`Failed to create notification for customer ${reg.customer_id}:`, error);
        // Continue with other notifications even if one fails
      })
    );

    try {
      await Promise.all(notificationPromises);
      console.log(`[Event Cancellation] Created ${registrations.length} notifications for event ${eventId}`);
    } catch (error) {
      console.error(`[Event Cancellation] Error creating notifications:`, error);
      // Don't fail the event deletion if notifications fail
    }

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
