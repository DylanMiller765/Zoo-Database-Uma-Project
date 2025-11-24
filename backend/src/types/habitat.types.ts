export interface Habitat {
  habitat_id: number;
  habitat_name: string;
  attraction_id: number;
  size: string;
  environment_type: string;
  animal_capacity: number;
  cleaning_schedule: string;
  last_maintenance: string;
  image_url?: string;
  status: 'active' | 'maintenance' | 'renovation' | 'closed';
  created_date: string;
  deleted_at?: string | null;
}

export interface HabitatWithDetails extends Habitat {
  attraction_name: string | null;
}
