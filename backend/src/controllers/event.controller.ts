// Controller to handle event-related HTTP requests

import { Request, Response } from 'express';
import * as eventService from '../services/event.service';

// Placeholder for get_upcoming_events
export const getUpcomingEvents = async (req: Request, res: Response) => {
  try {
    const events = await eventService.getUpcomingEvents();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching upcoming events', error });
  }
};

export const createEvent = async (req: Request, res: Response) => {
  try {
    console.log('📅 Creating event with data:', JSON.stringify(req.body, null, 2));
    const newEvent = await eventService.createEvent(req.body);
    console.log('✅ Event created successfully:', newEvent);
    res.status(201).json(newEvent);
  } catch (error) {
    console.error('❌ Error creating event:', error);
    res.status(500).json({ message: 'Error creating event', error });
  }
};

export const getEventById = async (req: Request, res: Response) => {
  try {
    const eventId = parseInt(req.params.id, 10);
    const event = await eventService.getEventById(eventId);
    if (event) {
      res.json(event);
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching event', error });
  }
};

export const updateEvent = async (req: Request, res: Response) => {
  try {
    const eventId = parseInt(req.params.id, 10);
    const updatedEvent = await eventService.updateEvent(eventId, req.body);
    if (updatedEvent) {
      res.json(updatedEvent);
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating event', error });
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const eventId = parseInt(req.params.id, 10);
    const success = await eventService.deleteEvent(eventId);
    if (success) {
      res.status(204).send(); // No Content
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting event', error });
  }
};
