import { CafeItemModel } from '../models/cafeItem.model';
import { CafeItem } from '../types/cafeItem.types';

export class CafeItemService {
  static async getAllItems(): Promise<CafeItem[]> {
    return await CafeItemModel.findAll();
  }

  static async createItem(item: Omit<CafeItem, 'item_id'>): Promise<CafeItem> {
    return await CafeItemModel.create(item);
  }

  static async getItemById(id: number): Promise<CafeItem | null> {
    return await CafeItemModel.findById(id);
  }

  static async updateItem(id: number, updates: Partial<CafeItem>): Promise<CafeItem | null> {
    return await CafeItemModel.update(id, updates);
  }

  static async deleteItem(id: number): Promise<void> {
    return await CafeItemModel.remove(id);
  }

  static async getMenuForCafe(cafeId: number): Promise<CafeItem[]> {
    return await CafeItemModel.findByCafe(cafeId);
  }
}
