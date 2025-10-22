import { EventModel } from '../models/event.model';
import { Event } from '../types/event.types';

export const getUpcomingEvents = async (): Promise<Event[]> => {
  return await EventModel.findAll();
};

export const createEvent = async (eventData: Omit<Event, 'event_id'>): Promise<Event> => {
  return await EventModel.create(eventData);
};

export const getEventById = async (eventId: number): Promise<Event | null> => {
  return await EventModel.findById(eventId);
};

export const updateEvent = async (eventId: number, eventData: Partial<Event>): Promise<Event | null> => {
  return await EventModel.update(eventId, eventData);
};

export const deleteEvent = async (eventId: number): Promise<boolean> => {
  return await EventModel.remove(eventId);
};