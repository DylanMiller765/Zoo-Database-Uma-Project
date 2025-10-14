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

You should see the Zoo landing page with:
- Welcome message
- "Explore Animals" button
- "Buy Tickets" button
- "Login" button
- Stats cards (156 Animals, 8 Habitats, Daily Events)

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

## Next Steps

1. **Explore the Codebase:**
   - Backend: `backend/src/`
   - Frontend: `frontend/src/`

2. **Read Documentation:**
   - `CLAUDE.md` - Claude Code guidance
   - `PROJECT_STRUCTURE.md` - Detailed project structure
   - `README.md` - Project overview

3. **Start Development:**
   - Implement remaining backend services
   - Create frontend pages and components
   - Add authentication flows
   - Build dashboard features

4. **Test Features:**
   - User registration/login
   - Employee dashboard
   - Customer portal
   - Role-based access control

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
