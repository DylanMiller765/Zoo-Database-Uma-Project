import { GiftShopModel, GiftShop } from '../models/giftShop.model';

export class GiftShopService {
  static async getAllGiftShops(): Promise<GiftShop[]> {
    return await GiftShopModel.findAll();
  }

  static async getAllGiftShopsIncludingDeleted(): Promise<GiftShop[]> {
    return await GiftShopModel.findAllIncludingDeleted();
  }

  static async createGiftShop(shopData: Omit<GiftShop, 'gift_shop_id'>): Promise<GiftShop> {
    return await GiftShopModel.create(shopData);
  }

  static async getGiftShopById(id: number): Promise<GiftShop | null> {
    return await GiftShopModel.findById(id);
  }

  static async updateGiftShop(id: number, updates: Partial<GiftShop>): Promise<GiftShop | null> {
    return await GiftShopModel.update(id, updates);
  }

  static async deleteGiftShop(id: number): Promise<void> {
    return await GiftShopModel.remove(id);
  }

  static async restoreGiftShop(id: number): Promise<GiftShop | null> {
    return await GiftShopModel.restore(id);
  }
}
