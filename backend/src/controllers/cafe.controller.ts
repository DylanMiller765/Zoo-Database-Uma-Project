import { Request, Response } from 'express';
import { CafeService } from '../services/cafe.service';

export class CafeController {
  static async getAllCafes(req: Request, res: Response): Promise<void> {
    try {
      const cafes = await CafeService.getAllCafes();
      res.status(200).json(cafes);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching cafes', error });
    }
  }

  static async createCafe(req: Request, res: Response): Promise<void> {
    try {
      console.log('☕ Creating cafe with data:', JSON.stringify(req.body, null, 2));
      const newCafe = await CafeService.createCafe(req.body);
      console.log('✅ Cafe created successfully:', newCafe);
      res.status(201).json(newCafe);
    } catch (error) {
      console.error('❌ Error creating cafe:', error);
      res.status(500).json({ message: 'Error creating cafe', error });
    }
  }

  static async getCafeById(req: Request, res: Response): Promise<void> {
    try {
      const cafe = await CafeService.getCafeById(parseInt(req.params.id));
      if (cafe) {
        res.status(200).json(cafe);
      } else {
        res.status(404).json({ message: 'Cafe not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error fetching cafe', error });
    }
  }

  static async updateCafe(req: Request, res: Response): Promise<void> {
    try {
      const updatedCafe = await CafeService.updateCafe(parseInt(req.params.id), req.body);
      if (updatedCafe) {
        res.status(200).json(updatedCafe);
      } else {
        res.status(404).json({ message: 'Cafe not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error updating cafe', error });
    }
  }

  static async deleteCafe(req: Request, res: Response): Promise<void> {
    try {
      await CafeService.deleteCafe(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error deleting cafe', error });
    }
  }
}
