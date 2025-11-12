import { CafeModel, Cafe } from '../models/cafe.model';

export class CafeService {
  static async getAllCafes(): Promise<Cafe[]> {
    return await CafeModel.findAll();
  }

  static async getAllCafesIncludingDeleted(): Promise<Cafe[]> {
    return await CafeModel.findAllIncludingDeleted();
  }

  static async createCafe(cafeData: Omit<Cafe, 'cafe_id'>): Promise<Cafe> {
    return await CafeModel.create(cafeData);
  }

  static async getCafeById(id: number): Promise<Cafe | null> {
    return await CafeModel.findById(id);
  }

  static async updateCafe(id: number, updates: Partial<Cafe>): Promise<Cafe | null> {
    return await CafeModel.update(id, updates);
  }

  static async deleteCafe(id: number): Promise<void> {
    return await CafeModel.remove(id);
  }

  static async restoreCafe(id: number): Promise<Cafe | null> {
    return await CafeModel.restore(id);
  }
}
