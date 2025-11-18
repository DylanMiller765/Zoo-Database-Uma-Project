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

  static async createAssignment(req: Request, res: Response): Promise<void> {
    try {
      const { keeper_id, animal_id, shift } = req.body;

      if (!keeper_id || !animal_id) {
        res.status(400).json({ message: 'keeper_id and animal_id are required' });
        return;
      }

      const assignmentId = await ZookeeperAssignmentService.createAssignment(
        parseInt(keeper_id),
        parseInt(animal_id),
        shift
      );

      res.status(201).json({
        message: 'Assignment created successfully',
        assignment_id: assignmentId
      });
    } catch (error: any) {
      if (error.message === 'This keeper is already assigned to this animal') {
        res.status(409).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Error creating assignment', error });
      }
    }
  }

  static async deleteAssignment(req: Request, res: Response): Promise<void> {
    try {
      const assignmentId = parseInt(req.params.id);
      await ZookeeperAssignmentService.deleteAssignment(assignmentId);
      res.status(200).json({ message: 'Assignment deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting assignment', error });
    }
  }
}
