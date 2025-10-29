import { Request, Response } from 'express';
import { DashboardService } from '../services/dashboard.service';

export class DashboardController {
  static async getStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await DashboardService.getStats();
      res.status(200).json(stats);
    } catch (error) {
      console.error('❌ Error fetching dashboard stats:', error);
      res.status(500).json({ message: 'Error fetching dashboard stats', error });
    }
  }

  static async getRecentActivity(req: Request, res: Response): Promise<void> {
    try {
      const activities = await DashboardService.getRecentActivity();
      res.status(200).json(activities);
    } catch (error) {
      console.error('❌ Error fetching recent activity:', error);
      res.status(500).json({ message: 'Error fetching recent activity', error });
    }
  }
}
