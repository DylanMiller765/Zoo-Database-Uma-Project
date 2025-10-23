import { Request, Response } from 'express';
import { EventRegistrationService } from '../services/eventRegistration.service';

export class EventRegistrationController {
  static async getAllRegistrations(req: Request, res: Response): Promise<void> {
    try {
      const registrations = await EventRegistrationService.getAllRegistrations();
      res.status(200).json(registrations);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching registrations', error });
    }
  }

  static async createRegistration(req: Request, res: Response): Promise<void> {
    try {
      const newRegistration = await EventRegistrationService.createRegistration(req.body);
      res.status(201).json(newRegistration);
    } catch (error) {
      res.status(500).json({ message: 'Error creating registration', error });
    }
  }

  static async getRegistrationById(req: Request, res: Response): Promise<void> {
    try {
      const registration = await EventRegistrationService.getRegistrationById(parseInt(req.params.id));
      if (registration) {
        res.status(200).json(registration);
      } else {
        res.status(404).json({ message: 'Registration not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error fetching registration', error });
    }
  }

  static async updateRegistration(req: Request, res: Response): Promise<void> {
    try {
      const updatedRegistration = await EventRegistrationService.updateRegistration(parseInt(req.params.id), req.body);
      if (updatedRegistration) {
        res.status(200).json(updatedRegistration);
      } else {
        res.status(404).json({ message: 'Registration not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error updating registration', error });
    }
  }

  static async cancelRegistration(req: Request, res: Response): Promise<void> {
    try {
      await EventRegistrationService.cancelRegistration(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error canceling registration', error });
    }
  }

  static async getAttendeesForEvent(req: Request, res: Response): Promise<void> {
    try {
      const attendees = await EventRegistrationService.getAttendeesForEvent(parseInt(req.params.eventId));
      res.status(200).json(attendees);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching attendees', error });
    }
  }
}
