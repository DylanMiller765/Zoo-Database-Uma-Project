// Controller to handle event-related HTTP requests

import { Request, Response } from 'express';
import * as eventService from '../services/event.service';

// Placeholder for get_upcoming_events
export const getUpcomingEvents = async (req: Request, res: Response) => {
  try {
    const includeDeleted = req.query.includeDeleted === 'true';
    const events = includeDeleted
      ? await eventService.getAllEventsIncludingDeleted()
      : await eventService.getUpcomingEvents();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching upcoming events', error });
  }
};

export const createEvent = async (req: Request, res: Response) => {
  try {
    console.log('📅 Creating event with data:', JSON.stringify(req.body, null, 2));

    // Add the authenticated user's account_id as the coordinator_id
    const eventData = {
      ...req.body,
      created_by: (req as any).user?.account_id
    };

    const newEvent = await eventService.createEvent(eventData);
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
    const user = (req as any).user;

    // Pass employee info to track who cancelled the event
    const employeeInfo = user?.employee_id ? {
      employee_id: user.employee_id,
      name: `${user.first_name} ${user.last_name}`.trim()
    } : undefined;

    const success = await eventService.deleteEvent(eventId, employeeInfo);
    if (success) {
      res.status(204).send(); // No Content
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting event', error });
  }
};
