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
- `POST /register` - Register new user
- `POST /login` - User login
- `GET /profile` - Get current user profile
- `POST /logout` - User logout

### Future Endpoints (To be implemented)
- `/api/animals` - Animal management
- `/api/employees` - Employee management
- `/api/customers` - Customer management
- `/api/tickets` - Ticket sales
- `/api/events` - Event management
- `/api/habitats` - Habitat management
- `/api/gift-shops` - Gift shop operations
- `/api/cafes` - Cafe operations
- `/api/feeding-logs` - Animal feeding tracking
- `/api/dashboard` - Dashboard metrics
- `/api/reports` - Revenue and analytics reports

## Route Groups (Next.js)

### Customer Portal `(customer)`
Public and customer account pages with customer navigation.

### Employee Dashboard `(employee)`
Protected employee-only pages with sidebar navigation and role-based access control.

## Database Connection

The backend connects to a Railway-hosted MySQL database:
- **Host:** nozomi.proxy.rlwy.net
- **Port:** 43756
- **Database:** zoo_database

Connection configuration is in `backend/src/config/database.ts`.

## Role-Based Access Control

The system implements role-based permissions:
- **Manager:** Full access
- **Keeper:** Animal care, feeding logs
- **Veterinarian:** Animal health, medical records
- **Coordinator:** Event management
- **Cashier:** Sales operations
- **Customer:** Ticket purchase, account management

Permissions are defined in `backend/src/types/role.types.ts` and enforced via middleware.

## Development Workflow

1. **Backend:** TypeScript → compiled to `dist/` → run with Node.js
2. **Frontend:** Next.js dev server with hot reload
3. **Database:** Direct connection to Railway MySQL instance

## Next Steps

To complete the project, implement:

1. **Backend Services:** Create service files for all entities (animals, employees, etc.)
2. **Backend Controllers:** Add controllers for all endpoints
3. **Backend Routes:** Wire up routes for all resources
4. **Frontend Pages:** Create all customer and employee pages
5. **Frontend Components:** Build reusable UI components
6. **Frontend Hooks:** Add custom hooks for data fetching
7. **Authentication:** Implement protected routes and auth context
8. **Testing:** Add unit and integration tests
9. **Documentation:** API documentation and user guides
