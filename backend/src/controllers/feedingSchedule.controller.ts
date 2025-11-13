import { Request, Response } from 'express';
import { FeedingScheduleService } from '../services/feedingSchedule.service';

export class FeedingScheduleController {
  static async getAllSchedules(req: Request, res: Response): Promise<void> {
    try {
      const schedules = await FeedingScheduleService.getAllSchedules();
      res.status(200).json(schedules);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching feeding schedules', error });
    }
  }

  static async getSchedulesByAnimalId(req: Request, res: Response): Promise<void> {
    try {
      const animalId = parseInt(req.params.animalId);
      const schedules = await FeedingScheduleService.getSchedulesByAnimalId(animalId);
      res.status(200).json(schedules);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching feeding schedules', error });
    }
  }

  static async getScheduleById(req: Request, res: Response): Promise<void> {
    try {
      const schedule = await FeedingScheduleService.getScheduleById(parseInt(req.params.id));
      if (schedule) {
        res.status(200).json(schedule);
      } else {
        res.status(404).json({ message: 'Feeding schedule not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error fetching feeding schedule', error });
    }
  }

  static async createSchedule(req: Request, res: Response): Promise<void> {
    try {
      const newSchedule = await FeedingScheduleService.createSchedule(req.body);
      res.status(201).json(newSchedule);
    } catch (error: any) {
      console.error('❌ Error creating feeding schedule:', error);

      // Check for foreign key constraint error
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        res.status(400).json({
          message: 'Invalid animal ID. The selected animal does not exist.',
          error: error.sqlMessage
        });
      } else {
        res.status(500).json({
          message: 'Error creating feeding schedule',
          error: error.sqlMessage || error.message
        });
      }
    }
  }

  static async updateSchedule(req: Request, res: Response): Promise<void> {
    try {
      const updatedSchedule = await FeedingScheduleService.updateSchedule(
        parseInt(req.params.id),
        req.body
      );
      if (updatedSchedule) {
        res.status(200).json(updatedSchedule);
      } else {
        res.status(404).json({ message: 'Feeding schedule not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error updating feeding schedule', error });
    }
  }

  static async deleteSchedule(req: Request, res: Response): Promise<void> {
    try {
      await FeedingScheduleService.deleteSchedule(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error deleting feeding schedule', error });
    }
  }
}
