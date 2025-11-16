import { EventModel } from '../models/event.model';
import { Event } from '../types/event.types';

// Transform database event to frontend format
const transformEvent = (dbEvent: any): any => {
  return {
    event_id: dbEvent.event_id,
    event_name: dbEvent.name,
    description: dbEvent.description,
    event_date: dbEvent.event_date,
    start_time: dbEvent.start_time,
    end_time: dbEvent.end_time,
    location: dbEvent.location,
    max_capacity: dbEvent.max_participants,
    ticket_price: dbEvent.ticket_price ? parseFloat(dbEvent.ticket_price) : null,
    status: 'scheduled', // Default status since DB doesn't have this field
    created_by: dbEvent.coordinator_id,
    coordinator_name: dbEvent.coordinator_name,
    deleted_at: dbEvent.deleted_at || null,  // Include deleted_at for soft delete detection
  };
};

// Transform frontend event to database format
const transformToDb = (frontendEvent: any): any => {
  const dbEvent: any = {
    name: frontendEvent.event_name || frontendEvent.name,
    description: frontendEvent.description,
    event_date: frontendEvent.event_date,
    start_time: frontendEvent.start_time,
    end_time: frontendEvent.end_time,
    location: frontendEvent.location,
    max_participants: frontendEvent.max_capacity || frontendEvent.max_participants,
    ticket_price: frontendEvent.ticket_price !== undefined ? frontendEvent.ticket_price : null,
    coordinator_id: frontendEvent.created_by || frontendEvent.coordinator_id,
  };

  // Remove undefined fields
  Object.keys(dbEvent).forEach(key => dbEvent[key] === undefined && delete dbEvent[key]);
  return dbEvent;
};

export const getUpcomingEvents = async (): Promise<any[]> => {
  const events = await EventModel.findAll();
  return events.map(transformEvent);
};

export const getAllEventsIncludingDeleted = async (): Promise<any[]> => {
  const events = await EventModel.findAllIncludingDeleted();
  return events.map(transformEvent);
};

export const createEvent = async (eventData: any): Promise<any> => {
  const dbEvent = transformToDb(eventData);
  const created = await EventModel.create(dbEvent);
  return transformEvent(created);
};

export const getEventById = async (eventId: number): Promise<any | null> => {
  const event = await EventModel.findById(eventId);
  return event ? transformEvent(event) : null;
};

export const updateEvent = async (eventId: number, eventData: any): Promise<any | null> => {
  const dbEvent = transformToDb(eventData);
  const updated = await EventModel.update(eventId, dbEvent);
  return updated ? transformEvent(updated) : null;
};

export const deleteEvent = async (eventId: number, employeeInfo?: { employee_id: number; name: string }): Promise<boolean> => {
  return await EventModel.remove(eventId, employeeInfo);
};

export const restoreEvent = async (eventId: number): Promise<any | null> => {
  const restored = await EventModel.restore(eventId);
  return restored ? transformEvent(restored) : null;
};