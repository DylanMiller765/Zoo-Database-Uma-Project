import { Request, Response } from 'express';
import { CafeItemService } from '../services/cafeItem.service';

export class CafeItemController {
  static async getAllItems(req: Request, res: Response): Promise<void> {
    try {
      const items = await CafeItemService.getAllItems();
      res.status(200).json(items);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching items', error });
    }
  }

  static async createItem(req: Request, res: Response): Promise<void> {
    try {
      const newItem = await CafeItemService.createItem(req.body);
      res.status(201).json(newItem);
    } catch (error) {
      res.status(500).json({ message: 'Error creating item', error });
    }
  }

  static async getItemById(req: Request, res: Response): Promise<void> {
    try {
      const item = await CafeItemService.getItemById(parseInt(req.params.id));
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
      const updatedItem = await CafeItemService.updateItem(parseInt(req.params.id), req.body);
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
      await CafeItemService.deleteItem(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error deleting item', error });
    }
  }

  static async getMenuForCafe(req: Request, res: Response): Promise<void> {
    try {
      const items = await CafeItemService.getMenuForCafe(parseInt(req.params.cafeId));
      res.status(200).json(items);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching menu', error });
    }
  }
}
