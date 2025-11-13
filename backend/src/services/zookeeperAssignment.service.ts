import { ZookeeperAssignmentModel } from '../models/zookeeperAssignment.model';
import { ZookeeperAssignmentWithDetails } from '../types/zoekeeperAssignment.types';

export class ZookeeperAssignmentService {
  static async getAssignmentsByKeeperId(keeperId: number): Promise<ZookeeperAssignmentWithDetails[]> {
    return await ZookeeperAssignmentModel.findByKeeperId(keeperId);
  }

  static async getAllAssignments(): Promise<ZookeeperAssignmentWithDetails[]> {
    return await ZookeeperAssignmentModel.findAll();
  }
}
