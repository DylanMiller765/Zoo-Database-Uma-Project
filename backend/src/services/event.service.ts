// Service for event-related database operations

import { pool } from '../config/database';
import { Event } from '../types/event.types';

// Placeholder for get_upcoming_events
export const getUpcomingEvents = async (): Promise<Event[]> => {
  const [rows] = await pool.query('SELECT * FROM events WHERE event_date >= CURDATE() ORDER BY event_date ASC');
  return rows as Event[];
};

export const createEvent = async (eventData: Omit<Event, 'event_id'>): Promise<Event> => {
  const { name, description, event_date, start_time, end_time, location, max_participants, ticket_price, coordinator_id } = eventData;
  const [result] = await pool.query(
    'INSERT INTO events (name, description, event_date, start_time, end_time, location, max_participants, ticket_price, coordinator_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [name, description, event_date, start_time, end_time, location, max_participants, ticket_price, coordinator_id]
  );
  const insertedId = (result as any).insertId;
  const [newEvent] = await pool.query('SELECT * FROM events WHERE event_id = ?', [insertedId]);
  return (newEvent as Event[])[0];
};

export const getEventById = async (eventId: number): Promise<Event | null> => {
  const [rows] = await pool.query('SELECT * FROM events WHERE event_id = ?', [eventId]);
  const events = rows as Event[];
  return events.length > 0 ? events[0] : null;
};

export const updateEvent = async (eventId: number, eventData: Partial<Event>): Promise<Event | null> => {
  // This is a simple implementation. A more robust one would only update fields that are actually provided.
  const { name, description, event_date, start_time, end_time, location, max_participants, ticket_price } = eventData;
  await pool.query(
    'UPDATE events SET name = ?, description = ?, event_date = ?, start_time = ?, end_time = ?, location = ?, max_participants = ?, ticket_price = ? WHERE event_id = ?',
    [name, description, event_date, start_time, end_time, location, max_participants, ticket_price, eventId]
  );
  return getEventById(eventId);
};

export const deleteEvent = async (eventId: number): Promise<boolean> => {
  const [result] = await pool.query('DELETE FROM events WHERE event_id = ?', [eventId]);
  return (result as any).affectedRows > 0;
};
