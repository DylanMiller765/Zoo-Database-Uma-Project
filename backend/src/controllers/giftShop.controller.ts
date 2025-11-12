import { Request, Response } from 'express';
import { GiftShopService } from '../services/giftShop.service';

export class GiftShopController {
  static async getAllGiftShops(req: Request, res: Response): Promise<void> {
    try {
      const includeDeleted = req.query.includeDeleted === 'true';
      const shops = includeDeleted
        ? await GiftShopService.getAllGiftShopsIncludingDeleted()
        : await GiftShopService.getAllGiftShops();
      res.status(200).json(shops);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching gift shops', error });
    }
  }

  static async createGiftShop(req: Request, res: Response): Promise<void> {
    try {
      console.log('🎁 Creating gift shop with data:', JSON.stringify(req.body, null, 2));
      const newShop = await GiftShopService.createGiftShop(req.body);
      console.log('✅ Gift shop created successfully:', newShop);
      res.status(201).json(newShop);
    } catch (error) {
      console.error('❌ Error creating gift shop:', error);
      res.status(500).json({ message: 'Error creating gift shop', error });
    }
  }

  static async getGiftShopById(req: Request, res: Response): Promise<void> {
    try {
      const shop = await GiftShopService.getGiftShopById(parseInt(req.params.id));
      if (shop) {
        res.status(200).json(shop);
      } else {
        res.status(404).json({ message: 'Gift shop not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error fetching gift shop', error });
    }
  }

  static async updateGiftShop(req: Request, res: Response): Promise<void> {
    try {
      const updatedShop = await GiftShopService.updateGiftShop(parseInt(req.params.id), req.body);
      if (updatedShop) {
        res.status(200).json(updatedShop);
      } else {
        res.status(404).json({ message: 'Gift shop not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error updating gift shop', error });
    }
  }

  static async deleteGiftShop(req: Request, res: Response): Promise<void> {
    try {
      await GiftShopService.deleteGiftShop(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error deleting gift shop', error });
    }
  }

  static async restoreGiftShop(req: Request, res: Response): Promise<void> {
    try {
      const restoredShop = await GiftShopService.restoreGiftShop(parseInt(req.params.id));
      if (restoredShop) {
        res.status(200).json(restoredShop);
      } else {
        res.status(404).json({ message: 'Gift shop not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error restoring gift shop', error });
    }
  }
}
