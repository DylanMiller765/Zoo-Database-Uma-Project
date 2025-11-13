export interface FeedingLog {
  log_id: number;
  animal_id: number;
  keeper_id: number | null;
  feeding_time: string;
  food_given: string;
  quantity_given: string | null;
  notes: string | null;
}

export interface FeedingLogWithKeeper extends FeedingLog {
  keeper_name: string | null;
  animal_name: string | null;
}

export interface CreateFeedingLogInput {
  animal_id: number;
  keeper_id?: number;
  feeding_time?: string;
  food_given: string;
  quantity_given?: string;
  notes?: string;
}

export interface UpdateFeedingLogInput {
  feeding_time?: string;
  food_given?: string;
  quantity_given?: string;
  notes?: string;
}

export interface FeedingLogFilters {
  animalId?: number;
  keeperId?: number;
  startDate?: string;
  endDate?: string;
}
