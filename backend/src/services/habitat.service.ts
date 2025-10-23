import { HabitatModel } from '../models/habitat.model';
import { Habitat } from '../types/habitat.types';

export class HabitatService {
  static async getAllHabitats(): Promise<Habitat[]> {
    return await HabitatModel.findAll();
  }

  static async createHabitat(habitat: Omit<Habitat, 'habitat_id'>): Promise<Habitat> {
    return await HabitatModel.create(habitat);
  }

  static async getHabitatById(id: number): Promise<Habitat | null> {
    return await HabitatModel.findById(id);
  }

  static async updateHabitat(id: number, updates: Partial<Habitat>): Promise<Habitat | null> {
    return await HabitatModel.update(id, updates);
  }

  static async deleteHabitat(id: number): Promise<void> {
    return await HabitatModel.remove(id);
  }
}
