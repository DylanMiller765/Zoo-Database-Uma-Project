import { Request, Response } from 'express';
import { AttractionService } from '../services/attraction.service';

export class AttractionController {
  static async getAllAttractions(req: Request, res: Response): Promise<void> {
    try {
      const attractions = await AttractionService.getAllAttractions();
      res.status(200).json(attractions);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching attractions', error });
    }
  }

  static async createAttraction(req: Request, res: Response): Promise<void> {
    try {
      const newAttraction = await AttractionService.createAttraction(req.body);
      res.status(201).json(newAttraction);
    } catch (error) {
      res.status(500).json({ message: 'Error creating attraction', error });
    }
  }

  static async getAttractionById(req: Request, res: Response): Promise<void> {
    try {
      const attraction = await AttractionService.getAttractionById(parseInt(req.params.id));
      if (attraction) {
        res.status(200).json(attraction);
      } else {
        res.status(404).json({ message: 'Attraction not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error fetching attraction', error });
    }
  }

  static async updateAttraction(req: Request, res: Response): Promise<void> {
    try {
      const updatedAttraction = await AttractionService.updateAttraction(parseInt(req.params.id), req.body);
      if (updatedAttraction) {
        res.status(200).json(updatedAttraction);
      } else {
        res.status(404).json({ message: 'Attraction not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error updating attraction', error });
    }
  }

  static async deleteAttraction(req: Request, res: Response): Promise<void> {
    try {
      await AttractionService.deleteAttraction(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error deleting attraction', error });
    }
  }
}
