import { Request, Response } from 'express';
import { AnimalService } from '../services/animal.service';

export class AnimalController {
  static async getAllAnimals(req: Request, res: Response): Promise<void> {
    try {
      const includeDeleted = req.query.includeDeleted === 'true';
      const animals = includeDeleted
        ? await AnimalService.getAllAnimalsIncludingDeleted()
        : await AnimalService.getAllAnimals();
      res.status(200).json(animals);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching animals', error });
    }
  }

  static async createAnimal(req: Request, res: Response): Promise<void> {
    try {
      console.log('🦁 Creating animal with data:', JSON.stringify(req.body, null, 2));
      const newAnimal = await AnimalService.createAnimal(req.body);
      console.log('✅ Animal created successfully:', newAnimal);
      res.status(201).json(newAnimal);
    } catch (error) {
      console.error('❌ Error creating animal:', error);
      console.error('Error details:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
      res.status(500).json({ message: 'Error creating animal', error });
    }
  }

  static async getAnimalById(req: Request, res: Response): Promise<void> {
    try {
      const animal = await AnimalService.getAnimalById(parseInt(req.params.id));
      if (animal) {
        res.status(200).json(animal);
      } else {
        res.status(404).json({ message: 'Animal not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error fetching animal', error });
    }
  }

  static async updateAnimal(req: Request, res: Response): Promise<void> {
    try {
      const updatedAnimal = await AnimalService.updateAnimal(parseInt(req.params.id), req.body);
      if (updatedAnimal) {
        res.status(200).json(updatedAnimal);
      } else {
        res.status(404).json({ message: 'Animal not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error updating animal', error });
    }
  }

  static async deleteAnimal(req: Request, res: Response): Promise<void> {
    try {
      await AnimalService.deleteAnimal(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error deleting animal', error });
    }
  }

  static async restoreAnimal(req: Request, res: Response): Promise<void> {
    try {
      const restoredAnimal = await AnimalService.restoreAnimal(parseInt(req.params.id));
      if (restoredAnimal) {
        res.status(200).json(restoredAnimal);
      } else {
        res.status(404).json({ message: 'Animal not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error restoring animal', error });
    }
  }
}
