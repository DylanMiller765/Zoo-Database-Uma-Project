import { Request, Response } from 'express';
import { FeedingLogService } from '../services/feedingLog.service';
import { FeedingLogFilters } from '../types/feedingLog.types';

export class FeedingLogController {
  static async getAllLogs(req: Request, res: Response): Promise<void> {
    try {
      const filters: FeedingLogFilters = {
        animalId: req.query.animalId ? parseInt(req.query.animalId as string) : undefined,
        keeperId: req.query.keeperId ? parseInt(req.query.keeperId as string) : undefined,
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string
      };

      const logs = await FeedingLogService.getAllLogs(filters);
      res.status(200).json(logs);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching feeding logs', error });
    }
  }

  static async getLogsByAnimalId(req: Request, res: Response): Promise<void> {
    try {
      const animalId = parseInt(req.params.animalId);
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const logs = await FeedingLogService.getLogsByAnimalId(animalId, limit);
      res.status(200).json(logs);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching feeding logs', error });
    }
  }

  static async getLogById(req: Request, res: Response): Promise<void> {
    try {
      const log = await FeedingLogService.getLogById(parseInt(req.params.id));
      if (log) {
        res.status(200).json(log);
      } else {
        res.status(404).json({ message: 'Feeding log not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error fetching feeding log', error });
    }
  }

  static async createLog(req: Request, res: Response): Promise<void> {
    try {
      const newLog = await FeedingLogService.createLog(req.body);
      res.status(201).json(newLog);
    } catch (error: any) {
      console.error('❌ Error creating feeding log:', error);

      // Check for foreign key constraint error
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        res.status(400).json({
          message: 'Invalid animal ID or keeper ID. Please check your input.',
          error: error.sqlMessage
        });
      } else {
        res.status(500).json({
          message: 'Error creating feeding log',
          error: error.sqlMessage || error.message
        });
      }
    }
  }

  static async updateLog(req: Request, res: Response): Promise<void> {
    try {
      const updatedLog = await FeedingLogService.updateLog(
        parseInt(req.params.id),
        req.body
      );
      if (updatedLog) {
        res.status(200).json(updatedLog);
      } else {
        res.status(404).json({ message: 'Feeding log not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error updating feeding log', error });
    }
  }

  static async deleteLog(req: Request, res: Response): Promise<void> {
    try {
      await FeedingLogService.deleteLog(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error deleting feeding log', error });
    }
  }
}
