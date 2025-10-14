export enum UserRole {
  KEEPER = 'keeper',
  MANAGER = 'manager',
  COORDINATOR = 'coordinator',
  CASHIER = 'cashier',
  GUIDE = 'guide',
  VETERINARIAN = 'veterinarian',
  MAINTENANCE = 'maintenance',
  SECURITY = 'security',
  OTHER = 'other',
  CUSTOMER = 'customer'
}

export interface User {
  account_id: number;
  username: string;
  email: string;
  role: 'employee' | 'customer';
  employee_id?: number;
  customer_id?: number;
  created_at: Date;
  updated_at: Date;
}

export interface Employee {
  employee_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  hire_date?: Date;
  job_title?: string;
  department?: string;
  job_role: UserRole;
  salary?: number;
  status: 'active' | 'inactive';
  ssn: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  birthday?: Date;
  employment_type: 'full_time' | 'part_time';
}

export interface Customer {
  customer_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  annual_pass: 'yes' | 'no';
  registration_date?: Date;
}
