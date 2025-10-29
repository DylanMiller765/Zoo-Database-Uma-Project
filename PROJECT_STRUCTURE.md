# Zoo Management System - Project Structure

## Overview
This is a full-stack Zoo Management System with separate frontend (Next.js) and backend (Express) applications.

## Technology Stack

### Backend
- **Runtime:** Node.js with TypeScript
- **Framework:** Express.js
- **Database:** MySQL (Railway hosted)
- **Authentication:** JWT with bcrypt
- **Validation:** express-validator

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS with custom palette
- **UI Components:** shadcn/ui
- **State Management:** React Query
- **HTTP Client:** Axios

## Directory Structure

```
zoo-management-system/
├── backend/                    # Express API server
│   ├── src/
│   │   ├── config/             # Database & auth configuration
│   │   ├── middleware/         # Auth, role, validation, error middleware
│   │   ├── routes/             # API route definitions
│   │   ├── controllers/        # Request handlers
│   │   ├── services/           # Business logic
│   │   ├── models/             # Data models
│   │   ├── types/              # TypeScript type definitions
│   │   ├── utils/              # Utility functions
│   │   └── server.ts           # Entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── .env                    # Environment variables (not committed)
│
├── frontend/                   # Next.js application
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── app/                # Next.js App Router
│   │   │   ├── (customer)/     # Customer-facing pages
│   │   │   ├── (employee)/     # Employee dashboard
│   │   │   ├── globals.css     # Global styles
│   │   │   ├── layout.tsx      # Root layout
│   │   │   └── page.tsx        # Home page
│   │   ├── components/         # React components
│   │   │   ├── ui/             # shadcn/ui components
│   │   │   ├── common/         # Shared components
│   │   │   ├── customer/       # Customer components
│   │   │   └── employee/       # Employee components
│   │   ├── lib/                # Utilities & API client
│   │   ├── hooks/              # Custom React hooks
│   │   ├── context/            # React context providers
│   │   ├── services/           # API service functions
│   │   └── types/              # TypeScript types
│   ├── tailwind.config.ts      # Tailwind configuration with custom colors
│   ├── next.config.js          # Next.js configuration
│   ├── package.json
│   └── .env.local              # Environment variables (not committed)
│
├── database/                   # Database schema and dumps
│   ├── zoo_schema.sql          # Current schema (source of truth)
│   └── current_dump.sql        # Database snapshot
│
├── .gitignore
├── package.json                # Root package for scripts
├── CLAUDE.md                   # Claude Code guidance
├── PROJECT_STRUCTURE.md        # This file
└── README.md                   # Setup instructions
```

## Custom Color Palette

The application uses a custom Tailwind color palette:

- **dark_spring_green** (#2c6e49): Primary actions, headers
- **sea_green** (#4c956c): Secondary elements, hover states
- **light_yellow** (#fefee3): Highlights, warnings
- **melon** (#ffc9b9): Accents, notifications
- **persian_orange** (#d68c45): Call-to-action buttons

## API Endpoints Structure

### Authentication (`/api/auth`)
- `POST /register` - Register new customer account
- `POST /login` - User login with JWT
- `GET /profile` - Get current user profile
- `PUT /profile` - Update user profile
- `POST /logout` - User logout

### Core Entity Management
- `/api/animals` - Animal CRUD with health tracking (17 routes)
- `/api/employees` - Employee management with roles (17 routes)
- `/api/customers` - Customer management (17 routes)
- `/api/habitats` - Habitat operations (17 routes)
- `/api/attractions` - Attraction management (17 routes)

### Operations & Events
- `/api/tickets` - Ticket sales and tracking (17 routes)
- `/api/events` - Event management (17 routes)
- `/api/event-registrations` - Event registration (17 routes)

### Sales & Commerce
- `/api/gift-shops` - Gift shop management (17 routes)
- `/api/gift-shop-items` - Inventory management (17 routes)
- `/api/gift-shop-sales` - Sales transactions (17 routes)
- `/api/cafes` - Cafe operations (17 routes)
- `/api/cafe-items` - Menu management (17 routes)
- `/api/cafe-sales` - Cafe sales tracking (17 routes)

### Analytics & Reporting
- `/api/dashboard` - Dashboard statistics
- `/api/queries` - 5 custom analytics queries:
  - Animals by habitat
  - Employee assignments
  - Revenue analysis
  - Event attendance
  - Visitor statistics

## Frontend Pages Structure

### Customer-Facing Pages
- `/` - Home page with hero, featured exhibits, attractions, visit info
- `/login` - Unified login page for customers and employees
- `/register` - Customer registration
- `/tickets` - Ticket booking with adult/child/senior options and donations
- `/tickets/confirmation` - Purchase confirmation page
- `/events` - Browse and search events with filtering
- `/exhibits` - Animal exhibits and habitats
- `/attractions` - Featured zoo attractions
- `/visit` - Planning information (hours, admission, location)
- `/membership` - Annual pass offerings
- `/membership/confirmation` - Membership confirmation
- `/donate` - Conservation donations
- `/customer` - Customer dashboard (profile, bookings)

### Employee/Admin Pages (Protected, `/admin/*`)
- `/admin` - Main dashboard with stats, activity feed, quick actions
- `/admin/animals` - Animal management with search and CRUD
- `/admin/employees` - Employee management with role filtering
- `/admin/events` - Event management with status tracking
- `/admin/customers` - Customer management interface
- `/admin/gift-shops` - Gift shop operations
- `/admin/cafes` - Cafe operations management
- `/admin/tickets` - Ticket sales management
- `/admin/queries/animals-by-habitat` - Analytics: Animals by habitat
- `/admin/queries/employee-assignments` - Analytics: Employee assignments
- `/admin/queries/revenue-analysis` - Analytics: Revenue breakdown
- `/admin/queries/event-attendance` - Analytics: Event attendance
- `/admin/queries/visitor-statistics` - Analytics: Visitor metrics

## Database Connection

The backend connects to a Railway-hosted MySQL database:
- **Host:** nozomi.proxy.rlwy.net
- **Port:** 43756
- **Database:** zoo_database

Connection configuration is in `backend/src/config/database.ts`.

## Frontend Components

### Admin Components (19 total)
- `EmployeeForm.tsx` - Employee creation/editing form
- `AnimalForm.tsx` - Animal data entry form
- `EventForm.tsx` - Event creation/editing form
- `CustomerForm.tsx` - Customer management form
- `CafeForm.tsx` - Cafe management form
- `GiftShopForm.tsx` - Gift shop form
- `StatsCard.tsx` - Dashboard stat card with trend indicators
- `Sidebar.tsx` - Admin navigation sidebar
- `TopBar.tsx` - Admin top navigation bar

### UI Components (shadcn/ui)
- `button.tsx`, `card.tsx`, `input.tsx`, `label.tsx`
- `table.tsx`, `select.tsx`, `badge.tsx`, `modal.tsx`, `textarea.tsx`

### Common Components
- `Header.tsx` - Page header/navigation
- `ConditionalLayout.tsx` - Layout switcher based on user role

## Frontend Services (11 total)

Located in `frontend/src/services/`:
1. `auth.service.ts` - Login, logout, profile operations
2. `animal.service.ts` - Animal data operations
3. `employee.service.ts` - Employee management API calls
4. `customer.service.ts` - Customer management
5. `event.service.ts` - Event CRUD operations
6. `attractions.service.ts` - Attraction data fetching
7. `ticket.service.ts` - Ticket purchase operations
8. `cafe.service.ts` - Cafe operations
9. `giftShop.service.ts` - Gift shop data
10. `dashboard.service.ts` - Dashboard stats endpoint
11. `query.service.ts` - Complex query results

## Authentication & Authorization

### Role-Based Access Control (8 Employee Roles + 1 Customer Role)

**Employee Roles:**
- **Manager:** Full system access, can manage all entities
- **Keeper:** Animal care, feeding logs, can be assigned to animals
- **Veterinarian:** Animal health, medical records, can create/update animals
- **Coordinator:** Event management and attendee tracking
- **Cashier:** Ticket and sales operations (gift shop, cafe, tickets)
- **Guide:** Read-only access to animals and attractions
- **Maintenance:** Habitat and facility maintenance
- **Security:** Incident reporting

**Customer Role:**
- Ticket purchasing, event registration, profile management

### Implementation
- **Backend:** JWT-based authentication with `protect` and `restrictTo(role1, role2, ...)` middleware
- **Frontend:** AuthContext provides `hasRole()` for conditional rendering and protected routes
- **Note:** Password hashing is not currently implemented (passwords stored in plain text - **SECURITY ISSUE**)

## Development Workflow

1. **Backend:** TypeScript → compiled to `dist/` → run with Node.js
2. **Frontend:** Next.js dev server with hot reload
3. **Database:** Direct connection to Railway MySQL instance

## Implementation Status

### ✅ Fully Implemented
1. **Backend Services:** All 17 services implemented for complete CRUD operations
2. **Backend Controllers:** All 17 controllers implemented with validation
3. **Backend Routes:** All routes wired up with role-based access control
4. **Frontend Pages:** All 20+ customer and admin pages created
5. **Frontend Components:** 19+ components built (forms, UI, common)
6. **Frontend Services:** All 11 API service modules implemented
7. **Authentication:** Complete JWT auth system with protected routes and AuthContext
8. **Database Schema:** 20 tables with proper relationships and constraints
9. **Analytics:** 5 custom query reports for advanced analytics

### 🚧 Known Issues & Future Enhancements
1. **File Uploads:** Animal photo uploads not implemented
2. **Notifications:** Email notification system
3. **Reports:** PDF export functionality
4. **Charts:** Data visualization/graphs for analytics
