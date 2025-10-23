import { EventRegistrationModel } from '../models/eventRegistration.model';
import { EventRegistration } from '../types/eventRegistration.types';

export class EventRegistrationService {
  static async getAllRegistrations(): Promise<EventRegistration[]> {
    return await EventRegistrationModel.findAll();
  }

  static async createRegistration(registration: Omit<EventRegistration, 'registration_id'>): Promise<EventRegistration> {
    return await EventRegistrationModel.create(registration);
  }

  static async getRegistrationById(id: number): Promise<EventRegistration | null> {
    return await EventRegistrationModel.findById(id);
  }

  static async updateRegistration(id: number, updates: Partial<EventRegistration>): Promise<EventRegistration | null> {
    return await EventRegistrationModel.update(id, updates);
  }

  static async cancelRegistration(id: number): Promise<void> {
    return await EventRegistrationModel.remove(id);
  }

  static async getAttendeesForEvent(eventId: number): Promise<EventRegistration[]> {
    return await EventRegistrationModel.findByEvent(eventId);
  }
}
