// User and Auth Types
export interface User {
  account_id: number;
  email: string;
  role: 'employee' | 'customer';
  first_name: string;
  last_name: string;
  job_role?: string;
  customer_id?: number;
  employee_id?: number;
}

export type UserRole =
  | 'keeper'
  | 'manager'
  | 'coordinator'
  | 'cashier'
  | 'guide'
  | 'veterinarian'
  | 'maintenance'
  | 'security'
  | 'other';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
}

// Employee Types
export interface Employee {
  employee_id: number;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  ssn: string;
  job_role: UserRole;
  employment_type: 'full_time' | 'part_time';
  salary?: number;
  status: 'active' | 'inactive';
  hire_date?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  birthday?: string;
  deleted_at?: string | null;
}

export interface CreateEmployeeData extends Omit<Employee, 'employee_id'> {
  password: string;
}

// Animal Types
export interface Animal {
  animal_id: number;
  name: string;
  scientific_name?: string;
  species: string;
  date_of_birth?: string;
  arrival_date: string;
  gender?: 'male' | 'female' | 'unknown';
  place_of_origin?: string;
  habitat_id?: number;
  habitat_name?: string | null;
  medical_notes?: string;
  health_status?: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  active_status?: 'active' | 'transferred' | 'deceased';
  endangerment_status?: 'least_concern' | 'near_threatened' | 'vulnerable' | 'endangered' | 'critically_endangered' | 'extinct_in_the_wild' | 'extinct';
  weight?: number;
  created_date?: string;
  updated_date?: string;
  deleted_at?: string | null;
}

export interface CreateAnimalData extends Omit<Animal, 'animal_id' | 'created_date' | 'updated_date'> {}

// Event Types
export interface Event {
  event_id: number;
  event_name: string;
  description?: string;
  event_date: string;
  start_time: string;
  end_time: string;
  location?: string;
  max_capacity?: number;
  ticket_price?: number;
  status?: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  created_by?: number;
  coordinator_id?: number;
  coordinator_name?: string | null;
  current_registrations?: number;
  created_at?: string;
  deleted_at?: string | null;
}

export interface CreateEventData extends Omit<Event, 'event_id' | 'current_registrations' | 'created_at'> {
  status?: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
}

// Customer Types
export interface Customer {
  customer_id: number;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  annual_pass?: 'yes' | 'no';
  registration_date?: string;
  deleted_at?: string | null;
}

export interface CreateCustomerData extends Omit<Customer, 'customer_id'> {
  password: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Dashboard Stats Types
export interface DashboardStats {
  totalAnimals: number;
  totalEmployees: number;
  upcomingEvents: number;
  activeHabitats: number;
  todaysVisitors: number;
}

// Ticket Types
export interface Ticket {
  ticket_id: number;
  customer_id?: number;
  purchase_date: string;
  visit_date: string;
  ticket_type: 'adult' | 'child' | 'senior' | 'student';
  price: number;
  payment_method?: 'cash' | 'credit' | 'debit';
}

export interface CreateTicketData extends Omit<Ticket, 'ticket_id' | 'purchase_date'> {}

// Cafe Types
export interface Cafe {
  cafe_id: number;
  name: string;
  location?: string;
  opening_time?: string;
  closing_time?: string;
  manager_id?: number;
}

export interface CreateCafeData extends Omit<Cafe, 'cafe_id'> {}

// Gift Shop Types
export interface GiftShop {
  gift_shop_id: number;
  name: string;
  location?: string;
  opening_time?: string;
  closing_time?: string;
  manager_id?: number;
}

export interface CreateGiftShopData extends Omit<GiftShop, 'gift_shop_id'> {}

// Attraction Types
export interface Attraction {
  attraction_id: number; // Primary key from DB
  name: string; // Required field
  location?: string | null; // Optional string field
  human_capacity?: number | null; // Optional number field, corresponds to `capacity` in DB
  opening_time?: string | null; // Optional time string (e.g., "09:00:00")
  closing_time?: string | null; // Optional time string (e.g., "18:00:00")
  status?: 'open' | 'closed' | 'maintenance' | null; // Optional status enum
  // Optional: Add description if needed, even though it's missing in backend/src/types/attraction.types.ts
  description?: string | null;
}

// Optional: Define a type for creating/updating attractions (without the ID)
export interface AttractionData extends Omit<Attraction, 'attraction_id'> {}

// Habitat Types
export interface Habitat {
  habitat_id: number;
  habitat_name: string;
  attraction_id: number;
  attraction_name?: string | null;
  size: string;
  environment_type: string;
  animal_capacity: number;
  cleaning_schedule: string;
  last_maintenance: string;
  status: 'active' | 'maintenance' | 'renovation' | 'closed';
  created_date: string;
  deleted_at?: string | null;
}

export interface CreateHabitatData extends Omit<Habitat, 'habitat_id' | 'created_date'> {}

// Gift Shop Item Types
export interface GiftShopItem {
  item_id: number;
  gift_shop_id: number;
  name: string;
  description: string;
  category: string;
  // MySQL DECIMAL may come back as string; accept both
  price: number | string;
  cost: number | string;
  quantity_in_stock: number;
  supplier: string;
  deleted_at?: string | null;
}

export interface CreateGiftShopItemData extends Omit<GiftShopItem, 'item_id'> {}

// Cafe Item Types
export interface CafeItem {
  item_id: number;
  cafe_id: number;
  name: string;
  description: string;
  category: string;
  price: number | string;
  deleted_at?: string | null;
}

export interface CreateCafeItemData extends Omit<CafeItem, 'item_id'> {}

// Feeding Schedule Types
export interface FeedingSchedule {
  schedule_id: number;
  animal_id: number;
  food_description: string;
  frequency?: string | null;
  scheduled_time?: string | null;
  notes?: string | null;
}

export interface CreateFeedingScheduleData extends Omit<FeedingSchedule, 'schedule_id'> {}

export interface UpdateFeedingScheduleData extends Partial<Omit<FeedingSchedule, 'schedule_id' | 'animal_id'>> {}

// Feeding Log Types
export interface FeedingLog {
  log_id: number;
  animal_id: number;
  keeper_id?: number | null;
  feeding_time: string;
  food_given: string;
  quantity_given?: string | null;
  notes?: string | null;
}

export interface FeedingLogWithKeeper extends FeedingLog {
  keeper_name?: string | null;
  animal_name?: string | null;
}

export interface CreateFeedingLogData extends Omit<FeedingLog, 'log_id'> {}

export interface UpdateFeedingLogData extends Partial<Omit<FeedingLog, 'log_id' | 'animal_id'>> {}

export interface FeedingLogFilters {
  animalId?: number;
  keeperId?: number;
  startDate?: string;
  endDate?: string;
}

// Zookeeper Assignment Types
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