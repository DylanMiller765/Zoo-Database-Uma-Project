import { GiftShopItemModel } from '../models/giftShopItem.model';
import { GiftShopItem } from '../types/giftShopItem.types';

export class GiftShopItemService {
  static async getAllItems(): Promise<GiftShopItem[]> {
    return await GiftShopItemModel.findAll();
  }

  static async getAllItemsIncludingDeleted(): Promise<GiftShopItem[]> {
    return await GiftShopItemModel.findAllIncludingDeleted();
  }

  static async createItem(item: Omit<GiftShopItem, 'item_id'>): Promise<GiftShopItem> {
    return await GiftShopItemModel.create(item);
  }

  static async getItemById(id: number): Promise<GiftShopItem | null> {
    return await GiftShopItemModel.findById(id);
  }

  static async updateItem(id: number, updates: Partial<GiftShopItem>): Promise<GiftShopItem | null> {
    return await GiftShopItemModel.update(id, updates);
  }

  static async deleteItem(id: number): Promise<void> {
    return await GiftShopItemModel.remove(id);
  }

  static async getLowStockItems(): Promise<GiftShopItem[]> {
    return await GiftShopItemModel.findLowStock();
  }

  static async restoreItem(id: number): Promise<GiftShopItem | null> {
    return await GiftShopItemModel.restore(id);
  }
}
