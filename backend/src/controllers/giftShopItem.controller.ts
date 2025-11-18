import { Request, Response } from 'express';
import { GiftShopItemService } from '../services/giftShopItem.service';

export class GiftShopItemController {
  static async getAllItems(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;
      const isManager = user?.role === 'employee' && user?.job_role === 'manager';
      
      // Only managers can see deleted items
      const includeDeleted = isManager && req.query.includeDeleted === 'true';
      const items = includeDeleted
        ? await GiftShopItemService.getAllItemsIncludingDeleted()
        : await GiftShopItemService.getAllItems();
      res.status(200).json(items);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching items', error });
    }
  }

  static async createItem(req: Request, res: Response): Promise<void> {
    try {
      const newItem = await GiftShopItemService.createItem(req.body);
      res.status(201).json(newItem);
    } catch (error) {
      res.status(500).json({ message: 'Error creating item', error });
    }
  }

  static async getItemById(req: Request, res: Response): Promise<void> {
    try {
      const item = await GiftShopItemService.getItemById(parseInt(req.params.id));
      if (item) {
        res.status(200).json(item);
      } else {
        res.status(404).json({ message: 'Item not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error fetching item', error });
    }
  }

  static async updateItem(req: Request, res: Response): Promise<void> {
    try {
      const updatedItem = await GiftShopItemService.updateItem(parseInt(req.params.id), req.body);
      if (updatedItem) {
        res.status(200).json(updatedItem);
      } else {
        res.status(404).json({ message: 'Item not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error updating item', error });
    }
  }

  static async deleteItem(req: Request, res: Response): Promise<void> {
    try {
      await GiftShopItemService.deleteItem(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error deleting item', error });
    }
  }

  static async getLowStockItems(req: Request, res: Response): Promise<void> {
    try {
      const items = await GiftShopItemService.getLowStockItems();
      res.status(200).json(items);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching low stock items', error });
    }
  }

  static async restoreItem(req: Request, res: Response): Promise<void> {
    try {
      const restoredItem = await GiftShopItemService.restoreItem(parseInt(req.params.id));
      if (restoredItem) {
        res.status(200).json(restoredItem);
      } else {
        res.status(404).json({ message: 'Item not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error restoring item', error });
    }
  }

  // Stock update endpoint for cashiers (can only update quantity_in_stock)
  static async updateStock(req: Request, res: Response): Promise<void> {
    try {
      const { quantity_in_stock } = req.body;
      
      if (quantity_in_stock === undefined || quantity_in_stock === null) {
        res.status(400).json({ message: 'quantity_in_stock is required' });
        return;
      }

      if (typeof quantity_in_stock !== 'number' || quantity_in_stock < 0) {
        res.status(400).json({ message: 'quantity_in_stock must be a non-negative number' });
        return;
      }

      // Only allow updating quantity_in_stock field
      const updatedItem = await GiftShopItemService.updateItem(parseInt(req.params.id), {
        quantity_in_stock,
      });

      if (updatedItem) {
        res.status(200).json(updatedItem);
      } else {
        res.status(404).json({ message: 'Item not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error updating stock', error });
    }
  }
}
