import { ZookeeperAssignmentModel } from '../models/zookeeperAssignment.model';
import { ZookeeperAssignmentWithDetails } from '../types/zoekeeperAssignment.types';

export class ZookeeperAssignmentService {
  static async getAssignmentsByKeeperId(keeperId: number): Promise<ZookeeperAssignmentWithDetails[]> {
    return await ZookeeperAssignmentModel.findByKeeperId(keeperId);
  }

  static async getAllAssignments(): Promise<ZookeeperAssignmentWithDetails[]> {
    return await ZookeeperAssignmentModel.findAll();
  }

  static async createAssignment(keeperId: number, animalId: number, shift?: string): Promise<number> {
    // Check for duplicate assignment
    const isDuplicate = await ZookeeperAssignmentModel.checkDuplicateAssignment(keeperId, animalId);
    if (isDuplicate) {
      throw new Error('This keeper is already assigned to this animal');
    }

    return await ZookeeperAssignmentModel.create(keeperId, animalId, shift);
  }

  static async deleteAssignment(assignmentId: number): Promise<void> {
    return await ZookeeperAssignmentModel.remove(assignmentId);
  }
}
