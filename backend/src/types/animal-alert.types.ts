import { Animal } from "../models/animal.model";
import { Habitat } from "./habitat.types";

export interface AnimalAlert {
  animal_alert_id?: number;
  alert_reason: 'health_status' | 'active_status';
  alert_value: string;
  created_at?: string;
  processed_at?: string | null;
  animal_id: number;
  veterinarian_emails?: string[];
  medical_notes?: string;
  animal?: Animal | null;
  habitat?: Habitat | null;
}