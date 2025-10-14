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

export type EmployeeRole = Exclude<UserRole, UserRole.CUSTOMER>;

export interface RolePermissions {
  [key: string]: string[];
}

export const PERMISSIONS: RolePermissions = {
  [UserRole.MANAGER]: ['*'], // Full access
  [UserRole.KEEPER]: [
    'animals:read',
    'animals:update',
    'feeding_logs:*',
    'habitats:read',
    'zookeeper_assignments:read'
  ],
  [UserRole.VETERINARIAN]: [
    'animals:*',
    'habitats:read',
    'feeding_logs:read',
    'medical:*'
  ],
  [UserRole.COORDINATOR]: [
    'events:*',
    'event_registrations:*',
    'customers:read'
  ],
  [UserRole.CASHIER]: [
    'tickets:*',
    'gift_shop_sales:*',
    'cafe_sales:*',
    'customers:read'
  ],
  [UserRole.GUIDE]: [
    'animals:read',
    'habitats:read',
    'attractions:read',
    'events:read'
  ],
  [UserRole.MAINTENANCE]: [
    'habitats:read',
    'habitats:update',
    'attractions:read',
    'attractions:update'
  ],
  [UserRole.SECURITY]: [
    'dashboard:read',
    'incidents:*'
  ],
  [UserRole.OTHER]: [
    'dashboard:read'
  ],
  [UserRole.CUSTOMER]: [
    'tickets:create',
    'events:read',
    'event_registrations:create',
    'animals:read',
    'profile:update'
  ]
};
