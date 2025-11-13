import { Request, Response } from 'express';
import { ZookeeperAssignmentService } from '../services/zookeeperAssignment.service';

export class ZookeeperAssignmentController {
  static async getAssignmentsByKeeperId(req: Request, res: Response): Promise<void> {
    try {
      const keeperId = parseInt(req.params.keeperId);
      const assignments = await ZookeeperAssignmentService.getAssignmentsByKeeperId(keeperId);
      res.status(200).json(assignments);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching keeper assignments', error });
    }
  }

  static async getAllAssignments(req: Request, res: Response): Promise<void> {
    try {
      const assignments = await ZookeeperAssignmentService.getAllAssignments();
      res.status(200).json(assignments);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching assignments', error });
    }
  }
}
