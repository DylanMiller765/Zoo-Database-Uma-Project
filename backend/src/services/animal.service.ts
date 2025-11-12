import { Animal, AnimalModel } from '../models/animal.model';

export class AnimalService {
  static async getAllAnimals(include_deleted: boolean = false): Promise<Animal[]> {
    return await AnimalModel.findAll(include_deleted);
  }

  static async createAnimal(animal: Omit<Animal, 'animal_id'>): Promise<Animal> {
    return await AnimalModel.create(animal);
  }

  static async getAnimalById(id: number, include_deleted: boolean = false): Promise<Animal | null> {
    return await AnimalModel.findById(id, include_deleted);
  }

  static async updateAnimal(id: number, updates: Partial<Animal>): Promise<Animal | null> {
    return await AnimalModel.update(id, updates);
  }

  static async deleteAnimal(id: number): Promise<void> {
    return await AnimalModel.remove(id);
  }
}
