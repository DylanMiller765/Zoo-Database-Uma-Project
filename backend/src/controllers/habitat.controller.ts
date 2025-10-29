import { Request, Response } from 'express';
import { HabitatService } from '../services/habitat.service';

export class HabitatController {
  static async getAllHabitats(req: Request, res: Response): Promise<void> {
    try {
      const habitats = await HabitatService.getAllHabitats();
      res.status(200).json(habitats);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching habitats', error });
    }
  }

  static async createHabitat(req: Request, res: Response): Promise<void> {
    try {
      const newHabitat = await HabitatService.createHabitat(req.body);
      res.status(201).json(newHabitat);
    } catch (error: any) {
      console.error('❌ Error creating habitat:', error);

      // Check for foreign key constraint error
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        res.status(400).json({
          message: 'Invalid attraction ID. The selected attraction does not exist.',
          error: error.sqlMessage
        });
      } else {
        res.status(500).json({
          message: 'Error creating habitat',
          error: error.sqlMessage || error.message
        });
      }
    }
  }

  static async getHabitatById(req: Request, res: Response): Promise<void> {
    try {
      const habitat = await HabitatService.getHabitatById(parseInt(req.params.id));
      if (habitat) {
        res.status(200).json(habitat);
      } else {
        res.status(404).json({ message: 'Habitat not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error fetching habitat', error });
    }
  }

  static async updateHabitat(req: Request, res: Response): Promise<void> {
    try {
      const updatedHabitat = await HabitatService.updateHabitat(parseInt(req.params.id), req.body);
      if (updatedHabitat) {
        res.status(200).json(updatedHabitat);
      } else {
        res.status(404).json({ message: 'Habitat not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error updating habitat', error });
    }
  }

  static async deleteHabitat(req: Request, res: Response): Promise<void> {
    try {
      await HabitatService.deleteHabitat(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error deleting habitat', error });
    }
  }
}
