import { FeedingScheduleModel } from '../models/feedingSchedule.model';
import { FeedingSchedule, CreateFeedingScheduleInput, UpdateFeedingScheduleInput } from '../types/feedingSchedule.types';

export class FeedingScheduleService {
  static async getAllSchedules(): Promise<FeedingSchedule[]> {
    return await FeedingScheduleModel.findAll();
  }

  static async getSchedulesByAnimalId(animalId: number): Promise<FeedingSchedule[]> {
    return await FeedingScheduleModel.findByAnimalId(animalId);
  }

  static async getScheduleById(id: number): Promise<FeedingSchedule | null> {
    return await FeedingScheduleModel.findById(id);
  }

  static async createSchedule(schedule: CreateFeedingScheduleInput): Promise<FeedingSchedule> {
    return await FeedingScheduleModel.create(schedule);
  }

  static async updateSchedule(id: number, updates: UpdateFeedingScheduleInput): Promise<FeedingSchedule | null> {
    return await FeedingScheduleModel.update(id, updates);
  }

  static async deleteSchedule(id: number): Promise<void> {
    return await FeedingScheduleModel.delete(id);
  }
}
