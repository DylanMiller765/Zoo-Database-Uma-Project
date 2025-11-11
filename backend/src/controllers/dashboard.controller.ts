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
      const user = (req as any).user;
      const userRole = user?.job_role;
      const activities = await DashboardService.getRecentActivity(userRole);
      res.status(200).json(activities);
    } catch (error) {
      console.error('❌ Error fetching recent activity:', error);
      res.status(500).json({ message: 'Error fetching recent activity', error });
    }
  }

  static async getKeeperAssignments(req: Request, res: Response): Promise<void> {
    try {
      const user = (req as any).user;
      const employeeId = user?.employee_id;

      if (!employeeId) {
        res.status(400).json({ message: 'Employee ID not found' });
        return;
      }

      const assignments = await DashboardService.getKeeperAssignments(employeeId);
      res.status(200).json(assignments);
    } catch (error) {
      console.error('❌ Error fetching keeper assignments:', error);
      res.status(500).json({ message: 'Error fetching keeper assignments', error });
    }
  }

  static async getVeterinarianAnimals(req: Request, res: Response): Promise<void> {
    try {
      const animals = await DashboardService.getVeterinarianAnimals();
      res.status(200).json(animals);
    } catch (error) {
      console.error('❌ Error fetching veterinarian animals:', error);
      res.status(500).json({ message: 'Error fetching veterinarian animals', error });
    }
  }
}
