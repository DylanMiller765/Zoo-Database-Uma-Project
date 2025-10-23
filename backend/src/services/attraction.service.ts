import { AttractionModel } from '../models/attraction.model';
import { Attraction } from '../types/attraction.types';

export class AttractionService {
  static async getAllAttractions(): Promise<Attraction[]> {
    return await AttractionModel.findAll();
  }

  static async createAttraction(attraction: Omit<Attraction, 'attraction_id'>): Promise<Attraction> {
    return await AttractionModel.create(attraction);
  }

  static async getAttractionById(id: number): Promise<Attraction | null> {
    return await AttractionModel.findById(id);
  }

  static async updateAttraction(id: number, updates: Partial<Attraction>): Promise<Attraction | null> {
    return await AttractionModel.update(id, updates);
  }

  static async deleteAttraction(id: number): Promise<void> {
    return await AttractionModel.remove(id);
  }
}
