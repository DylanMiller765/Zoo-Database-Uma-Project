# 🦁 Zoo Database Management System

> A comprehensive full-stack zoo management system with Next.js frontend and Express backend

## 📌 Project Overview

A modern web application for managing all aspects of zoo operations, featuring:

### Customer Portal
- 🐾 Browse animals and habitats
- 🎟️ Purchase tickets online
- 📅 View and register for events
- 👤 Customer account management
- 📱 Responsive mobile-friendly design

### Employee Dashboard
- 📊 Real-time dashboard with metrics
- 🔐 Role-based access control
- 🐘 Animal management (health, feeding, assignments)
- 👥 Employee and customer management
- 🛍️ Gift shop and cafe operations
- 📈 Revenue reports and analytics
- 🎫 Ticket sales interface

## 🚀 Technology Stack

### Frontend
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** with custom color palette
- **shadcn/ui** component library
- **React Query** for data fetching
- **Axios** for API communication

### Backend
- **Express.js** with TypeScript
- **MySQL** database (Railway hosted)
- **JWT** authentication
- **bcrypt** password hashing
- **express-validator** input validation

## 🎨 Custom Color Palette

- **Dark Spring Green** (#2c6e49) - Primary actions
- **Sea Green** (#4c956c) - Secondary elements
- **Light Yellow** (#fefee3) - Highlights
- **Melon** (#ffc9b9) - Accents
- **Persian Orange** (#d68c45) - Call-to-actions

## ⚡ Quick Start

### Prerequisites
- Node.js v18+
- npm or yarn

### Installation

1. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

2. **Configure environment variables:**
   ```bash
   # Backend
   cd backend
   cp .env.example .env
   # Edit .env with your configuration

   # Frontend
   cd ../frontend
   cp .env.local.example .env.local
   # Edit .env.local with your API URL
   ```

3. **Run development servers:**
   ```bash
   # From root directory - runs both frontend and backend
   npm run dev
   ```

   - **Frontend:** http://localhost:3000
   - **Backend:** http://localhost:5000

## 📁 Project Structure

```
zoo-management-system/
├── backend/              # Express API server
│   ├── src/
│   │   ├── config/       # Database & auth configuration
│   │   ├── middleware/   # Auth, role, validation
│   │   ├── routes/       # API endpoints
│   │   ├── controllers/  # Request handlers
│   │   ├── services/     # Business logic
│   │   └── server.ts     # Entry point
│   └── package.json
│
├── frontend/             # Next.js application
│   ├── src/
│   │   ├── app/          # Pages (App Router)
│   │   │   ├── (customer)/   # Customer pages
│   │   │   └── (employee)/   # Employee dashboard
│   │   ├── components/   # React components
│   │   ├── services/     # API services
│   │   └── lib/          # Utilities
│   └── package.json
│
└── database/             # Schema and seeds
    ├── zoo_schema.sql    # Current schema
    └── current_dump.sql  # Database snapshot
```

## 🔧 Available Scripts

### Root Level
```bash
npm run dev              # Run both frontend and backend
npm run dev:backend      # Run backend only
npm run dev:frontend     # Run frontend only
npm run build            # Build both for production
npm run install:all      # Install all dependencies
```

### Backend
```bash
cd backend
npm run dev              # Development with hot reload
npm run build            # Compile TypeScript
npm start                # Run production server
```

### Frontend
```bash
cd frontend
npm run dev              # Development server
npm run build            # Build for production
npm start                # Run production build
```

## 🗄️ Database

### Railway MySQL Connection
```bash
Host: nozomi.proxy.rlwy.net
Port: 43756
Database: zoo_database
```

### Schema Tables
- **Core:** animals, habitats, employees, customers
- **Operations:** tickets, events, feeding_logs
- **Sales:** gift_shop_sales, cafe_sales
- **Authentication:** user_accounts
- **Analytics:** daily_revenue_summary (view)

### Applying Schema
```bash
mysql -h nozomi.proxy.rlwy.net -P 43756 -u root -p zoo_database < database/zoo_schema.sql
```

### Exporting Database
```bash
mysqldump -h nozomi.proxy.rlwy.net -P 43756 -u root -p zoo_database > export.sql
```

## 🔐 Authentication & Roles

The system implements JWT-based authentication with role-based access control:

### Employee Roles
- **Manager** - Full system access
- **Keeper** - Animal care and feeding
- **Veterinarian** - Medical records and health
- **Coordinator** - Event management
- **Cashier** - Sales operations
- **Guide** - Read-only access
- **Maintenance** - Habitat and facilities
- **Security** - Incident reports

### Customer Role
- Ticket purchasing
- Event registration
- Account management

## 📚 Documentation

- **[SETUP.md](SETUP.md)** - Detailed setup instructions
- **[PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)** - Complete project architecture
- **[CLAUDE.md](CLAUDE.md)** - Development guidelines

## 🛠️ Development

### Adding a New Feature

1. **Backend:**
   - Create service in `backend/src/services/`
   - Create controller in `backend/src/controllers/`
   - Add routes in `backend/src/routes/`
   - Wire up in `backend/src/server.ts`

2. **Frontend:**
   - Create service in `frontend/src/services/`
   - Add page in `frontend/src/app/`
   - Build components in `frontend/src/components/`
   - Add types in `frontend/src/types/`

### API Endpoints

**Authentication:**
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get profile

**Coming Soon:**
- `/api/animals` - Animal management
- `/api/employees` - Employee CRUD
- `/api/tickets` - Ticket sales
- `/api/events` - Event management
- `/api/dashboard` - Dashboard metrics
- `/api/reports` - Analytics

## 🎯 Project Status

### ✅ Completed
- [x] Project scaffolding
- [x] Backend foundation (config, middleware, utils)
- [x] Authentication system (JWT, bcrypt)
- [x] Frontend setup with Next.js 14
- [x] Tailwind configuration with custom palette
- [x] API client and auth service
- [x] Database connection to Railway
- [x] Type definitions for TypeScript

### 🚧 In Progress / Next Steps
- [ ] Complete backend services (animals, employees, etc.)
- [ ] Create all frontend pages
- [ ] Build reusable UI components
- [ ] Implement employee dashboard
- [ ] Create customer portal
- [ ] Add data visualization (charts)
- [ ] Build report generation
- [ ] Add form validation
- [ ] Implement file uploads (animal photos)
- [ ] Add search and filtering

## 👥 Team Workflow

1. **Schema Changes:** Update `database/zoo_schema.sql`
2. **Testing:** Test on Railway shared database
3. **Development:** Work on feature branches
4. **Documentation:** Keep CLAUDE.md updated
5. **Deployment:** Export final database dump

## 🐛 Troubleshooting

**Port Conflicts:**
- Backend uses port 5000
- Frontend uses port 3000
- Change in respective `.env` files

**Database Connection:**
- Requires internet connection
- Check Railway service status
- Verify credentials in backend/.env

**Module Not Found:**
```bash
npm run install:all
```

**TypeScript Errors:**
```bash
cd backend && npm run build
cd frontend && npm run build
```

## 📝 License

This project is for educational purposes.

## 🤝 Contributors

Team Project for Database Management Course

---

**For detailed setup instructions, see [SETUP.md](SETUP.md)**

**For project architecture, see [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)**
