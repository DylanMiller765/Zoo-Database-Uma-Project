import { Animal, AnimalModel } from '../models/animal.model';

export class AnimalService {
  static async getAllAnimals(): Promise<Animal[]> {
    return await AnimalModel.findAll();
  }

  static async getAllAnimalsIncludingDeleted(): Promise<Animal[]> {
    return await AnimalModel.findAllIncludingDeleted();
  }

  static async createAnimal(animal: Omit<Animal, 'animal_id'>): Promise<Animal> {
    return await AnimalModel.create(animal);
  }

  static async getAnimalById(id: number): Promise<Animal | null> {
    return await AnimalModel.findById(id);
  }

  static async updateAnimal(id: number, updates: Partial<Animal>): Promise<Animal | null> {
    return await AnimalModel.update(id, updates);
  }

  static async deleteAnimal(id: number, activeStatus?: 'transferred' | 'deceased', deletionNotes?: string): Promise<void> {
    return await AnimalModel.remove(id, activeStatus, deletionNotes);
  }

  static async restoreAnimal(id: number): Promise<Animal | null> {
    return await AnimalModel.restore(id);
  }
}
