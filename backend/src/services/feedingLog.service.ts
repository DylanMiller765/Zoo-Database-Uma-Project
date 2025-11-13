import { FeedingLogModel } from '../models/feedingLog.model';
import { FeedingLog, FeedingLogWithKeeper, CreateFeedingLogInput, UpdateFeedingLogInput, FeedingLogFilters } from '../types/feedingLog.types';

export class FeedingLogService {
  static async getAllLogs(filters?: FeedingLogFilters): Promise<FeedingLogWithKeeper[]> {
    return await FeedingLogModel.findAll(filters);
  }

  static async getLogsByAnimalId(animalId: number, limit?: number): Promise<FeedingLogWithKeeper[]> {
    return await FeedingLogModel.findByAnimalId(animalId, limit);
  }

  static async getLogById(id: number): Promise<FeedingLogWithKeeper | null> {
    return await FeedingLogModel.findById(id);
  }

  static async createLog(log: CreateFeedingLogInput): Promise<FeedingLog> {
    return await FeedingLogModel.create(log);
  }

  static async updateLog(id: number, updates: UpdateFeedingLogInput): Promise<FeedingLogWithKeeper | null> {
    return await FeedingLogModel.update(id, updates);
  }

  static async deleteLog(id: number): Promise<void> {
    return await FeedingLogModel.delete(id);
  }
}
