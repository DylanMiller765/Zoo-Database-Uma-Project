import { Request, Response } from 'express';
import { QueryService } from '../services/query.service';

export class QueryController {
  static async getAnimalsByHabitat(req: Request, res: Response): Promise<void> {
    try {
      const data = await QueryService.getAnimalsByHabitat();
      res.status(200).json(data);
    } catch (error) {
      console.error('❌ Error fetching animals by habitat:', error);
      res.status(500).json({ message: 'Error fetching animals by habitat', error });
    }
  }

  static async getEmployeeAssignments(req: Request, res: Response): Promise<void> {
    try {
      const data = await QueryService.getEmployeeAssignments();
      res.status(200).json(data);
    } catch (error) {
      console.error('❌ Error fetching employee assignments:', error);
      res.status(500).json({ message: 'Error fetching employee assignments', error });
    }
  }

  static async getRevenueAnalysis(req: Request, res: Response): Promise<void> {
    try {
      const data = await QueryService.getRevenueAnalysis();
      res.status(200).json(data);
    } catch (error) {
      console.error('❌ Error fetching revenue analysis:', error);
      res.status(500).json({ message: 'Error fetching revenue analysis', error });
    }
  }

  static async getEventAttendance(req: Request, res: Response): Promise<void> {
    try {
      const data = await QueryService.getEventAttendance();
      res.status(200).json(data);
    } catch (error) {
      console.error('❌ Error fetching event attendance:', error);
      res.status(500).json({ message: 'Error fetching event attendance', error });
    }
  }

  static async getVisitorStatistics(req: Request, res: Response): Promise<void> {
    try {
      const { startDate, endDate } = req.query;
      const data = await QueryService.getVisitorStatistics(
        startDate as string,
        endDate as string
      );
      const summary = await QueryService.getVisitorStatisticsSummary(
        startDate as string,
        endDate as string
      );
      res.status(200).json({ data, summary });
    } catch (error) {
      console.error('❌ Error fetching visitor statistics:', error);
      res.status(500).json({ message: 'Error fetching visitor statistics', error });
    }
  }
}
