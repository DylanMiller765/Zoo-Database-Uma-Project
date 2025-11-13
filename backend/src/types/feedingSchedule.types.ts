export interface FeedingSchedule {
  schedule_id: number;
  animal_id: number;
  food_description: string;
  frequency: string | null;
  scheduled_time: string | null;
  notes: string | null;
}

export interface CreateFeedingScheduleInput {
  animal_id: number;
  food_description: string;
  frequency?: string;
  scheduled_time?: string;
  notes?: string;
}

export interface UpdateFeedingScheduleInput {
  food_description?: string;
  frequency?: string;
  scheduled_time?: string;
  notes?: string;
}
