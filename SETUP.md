# Zoo Management System - Setup Instructions

## Prerequisites

- **Node.js** v18+ installed
- **npm** or **yarn** package manager
- **MySQL Client** (optional, for direct database access)
- **Git** installed

## Initial Setup

### 1. Clone and Install Dependencies

```bash
# From the root directory
npm run install:all
```

This will install dependencies for:
- Root workspace
- Backend server
- Frontend application

### 2. Configure Environment Variables

#### Backend Configuration

Create `backend/.env` file:

```bash
cd backend
cp .env.example .env
```

The `.env` file should contain:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration (Railway)
DB_HOST=nozomi.proxy.rlwy.net
DB_PORT=43756
DB_USER=root
DB_PASSWORD=tPLlbwDQnpriZFlWvJThTwkBStwJVmvc
DB_NAME=zoo_database

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

**Important:** Change `JWT_SECRET` to a secure random string in production.

#### Frontend Configuration

Create `frontend/.env.local` file:

```bash
cd frontend
cp .env.local.example .env.local
```

The `.env.local` file should contain:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 3. Verify Database Connection

The database is already hosted on Railway. To verify:

```bash
cd backend
npm run dev
```

You should see:
```
✅ Database connected successfully
✅ Server running on port 5000
```

## Running the Application

### Development Mode (Both Frontend and Backend)

From the root directory:

```bash
npm run dev
```

This runs:
- **Backend:** http://localhost:5000
- **Frontend:** http://localhost:3000

### Run Backend Only

```bash
npm run dev:backend
```

The backend API will be available at `http://localhost:5000`.

Test the health endpoint:
```bash
curl http://localhost:5000/health
```

### Run Frontend Only

```bash
npm run dev:frontend
```

The Next.js app will be available at `http://localhost:3000`.

## Available Scripts

### Root Level
- `npm run dev` - Run both frontend and backend concurrently
- `npm run dev:backend` - Run backend only
- `npm run dev:frontend` - Run frontend only
- `npm run build` - Build both applications for production
- `npm run install:all` - Install all dependencies
- `npm run clean` - Remove all node_modules and build artifacts

### Backend (`cd backend`)
- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run compiled production server
- `npm run lint` - Run ESLint

### Frontend (`cd frontend`)
- `npm run dev` - Start Next.js development server
- `npm run build` - Build for production
- `npm start` - Run production server
- `npm run lint` - Run Next.js linter

## Testing the Setup

### 1. Test Backend Health Check

```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "success": true,
  "message": "Zoo Management API is running",
  "timestamp": "2025-01-XX..."
}
```

### 2. Test Frontend

Open browser to http://localhost:3000

You should see the ZooVerse 12 landing page with:
- Hero section with welcome message
- "Get Tickets" and explore buttons
- Stats cards (100+ Species, 8 Habitats, 50,000+ Visitors)
- Featured exhibits section
- Attractions section (Gift Shop, Cafe, Play Zone)
- Plan your visit information (Hours, Admission, Location, Memberships)
- Conservation donation call-to-action

### 3. Test Database Connection

The backend automatically tests the database connection on startup. Check the console for:

```
✅ Database connected successfully
```

## Database Access

### Using MySQL CLI

```bash
mysql -h nozomi.proxy.rlwy.net -P 43756 -u root -p zoo_database
```

Password: `tPLlbwDQnpriZFlWvJThTwkBStwJVmvc`

### Verify Tables

```sql
USE zoo_database;
SHOW TABLES;
```

Expected tables:
- animals, attractions, cafe_items, cafe_sales, cafes
- customers, employees, event_registrations, events
- feeding_logs, feeding_schedules, gift_shop_items
- gift_shop_sale_items, gift_shop_sales_transactions
- gift_shops, habitats, tickets, user_accounts, zookeeper_assignments

## ⚠️ Security Warning

**CRITICAL SECURITY ISSUE:** This application currently stores passwords in **plain text** in the database. This is a major security vulnerability and should be fixed before any production use.

**Required Fix:**
1. Implement bcrypt password hashing in the authentication service
2. Hash passwords before storing in the database
3. Never log or display passwords
4. Update all existing passwords to hashed versions

See `backend/src/config/auth.ts` and `backend/src/services/auth.service.ts` for implementation.

## Common Issues

### Port Already in Use

If port 5000 or 3000 is already in use:

**Backend:** Change `PORT` in `backend/.env`

**Frontend:** Run with custom port:
```bash
cd frontend
PORT=3001 npm run dev
```

Update `CORS_ORIGIN` in `backend/.env` accordingly.

### Database Connection Failed

1. Check internet connection (Railway is cloud-hosted)
2. Verify credentials in `backend/.env`
3. Check firewall settings

### Module Not Found Errors

```bash
npm run install:all
```

### TypeScript Errors

```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run build
```

## Testing the Application

### Test User Credentials

The system comes with test users (see `database/seed_test_users.sql` if available):

**Default Test Credentials:**
- Manager: `manager@zoo.com` / `password123`
- Keeper: `keeper@zoo.com` / `password123`
- Veterinarian: `vet@zoo.com` / `password123`
- Coordinator: `coordinator@zoo.com` / `password123`
- Cashier: `cashier@zoo.com` / `password123`

**Note:** These are example credentials. Check your actual database for valid test users.

### Key Features to Test

1. **Authentication:**
   - Login at `/login`
   - Employees redirect to `/admin` dashboard
   - Customers redirect to `/customer` dashboard
   - Role-based access control

2. **Customer Portal:**
   - Browse animals at `/exhibits`
   - Purchase tickets at `/tickets`
   - View and register for events at `/events`
   - Buy memberships at `/membership`

3. **Employee Dashboard:**
   - View dashboard stats at `/admin`
   - Manage animals at `/admin/animals`
   - Manage employees at `/admin/employees`
   - Manage events at `/admin/events`
   - View analytics at `/admin/queries/*`

4. **CRUD Operations:**
   - Create, read, update, delete animals
   - Create, read, update, delete employees
   - Create, read, update, delete events
   - Process ticket sales
   - Process event registrations

## Next Steps

1. **Explore the Codebase:**
   - Backend services: `backend/src/services/`
   - Backend routes: `backend/src/routes/`
   - Frontend pages: `frontend/src/app/`
   - Frontend components: `frontend/src/components/`

2. **Read Documentation:**
   - [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) - Complete architecture
   - [BACKEND_API_DOCS.md](BACKEND_API_DOCS.md) - API reference
   - [README.md](README.md) - Project overview

3. **Current System Status:**
   - ✅ All backend services implemented (17 services)
   - ✅ All frontend pages created (20+ pages)
   - ✅ Authentication and authorization working
   - ✅ CRUD operations for all entities
   - ✅ Dashboard and analytics
   - ⚠️ **CRITICAL:** Password hashing not implemented (plain text)

## Production Deployment

### Backend

1. Set `NODE_ENV=production` in environment variables
2. Update `JWT_SECRET` to a secure random string
3. Configure production database connection
4. Build and deploy:
   ```bash
   cd backend
   npm run build
   npm start
   ```

### Frontend

1. Update `NEXT_PUBLIC_API_URL` to production API URL
2. Build and deploy:
   ```bash
   cd frontend
   npm run build
   npm start
   ```

## Support

For issues or questions:
1. Check `CLAUDE.md` for architecture guidance
2. Review `PROJECT_STRUCTURE.md` for file organization
3. Inspect console logs for error messages
4. Verify environment variables are correct
