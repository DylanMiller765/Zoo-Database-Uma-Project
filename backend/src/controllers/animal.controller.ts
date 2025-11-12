import { Request, Response } from 'express';
import { AnimalService } from '../services/animal.service';
import { Animal } from '../models/animal.model';
import { Employee } from '../models/employee.model';
import { EmployeeModel } from '../models/employee.model';
export class AnimalController {
  static async getAllAnimals(req: Request, res: Response): Promise<void> {
    try {
      const requestDeleted = req.query.include_deleted === 'true';
      if (requestDeleted) {
        console.log(req)
        console.log('Request to include deleted animals received.');
        let permitted_job_roles = ['manager', 'veterinarian'];
        const userId = (req as any).user?.account_id;
        console.log(`Authenticated user ID: ${userId}`);
        const user: Employee | null = userId ? await EmployeeModel.findById(userId) : null;
        const userRole = user?.job_role;
        console.log(`User ID: ${userId}, Role: ${userRole}`);

        // if (!permitted_job_roles.includes(userRole)) {
        //   res.status(403).json({ message: 'Forbidden: You do not have access to view deleted animals.' });
        //   return;
        // }
        const animals = await AnimalService.getAllAnimals(true);
      res.status(200).json(animals);
      }
      else {
        const animals = await AnimalService.getAllAnimals(false);
        res.status(200).json(animals);
      }
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
      let animal: Animal | null; 

      const requestDeleted = req.query.include_deleted === 'true';
      const animalId = parseInt(req.params.id);

      if (requestDeleted) {
        const permitted_job_roles = ['manager', 'veterinarian'];
        const userJobRole = (req as any).user?.job_role;
        
        if (!userJobRole || !permitted_job_roles.includes(userJobRole)) {
          res.status(403).json({ message: 'Forbidden: You do not have access to view deleted animals.' });
          return;
        }

        animal = await AnimalService.getAnimalById(animalId, true);
      }
      else {
        animal = await AnimalService.getAnimalById(animalId, false);
      }

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
}
