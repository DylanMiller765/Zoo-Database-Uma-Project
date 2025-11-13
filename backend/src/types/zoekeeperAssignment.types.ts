export interface ZookeeperAssignment {
  assignment_id: number;
  keeper_id: number;
  animal_id: number;
  shift: string | null;
}

export interface ZookeeperAssignmentWithDetails extends ZookeeperAssignment {
  keeper_name: string;
  animal_name: string;
  animal_species: string;
  animal_health_status: string | null;
  last_fed_time: string | null;
}
