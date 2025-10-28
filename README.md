# 🦁 Zoo Database Management System

> A comprehensive full-stack zoo management system with Next.js frontend and Express backend

## 📌 Project Overview

A comprehensive full-stack web application for managing all aspects of zoo operations. The system features a complete CRUD implementation for all entities, role-based access control, and extensive analytics capabilities.

### Customer Portal Features
- 🐾 Browse animals and habitats with detailed information
- 🎟️ Purchase tickets online (adult, child, senior pricing)
- 📅 View, search, and register for events
- 👤 Customer account management with profile updates
- 🎁 Annual membership/pass purchasing
- 💚 Conservation donation system
- 📱 Responsive mobile-friendly design

### Employee Dashboard Features
- 📊 Real-time dashboard with key metrics and activity feed
- 🔐 JWT-based authentication with role-based access control (8 roles)
- 🐘 Complete animal management (CRUD, health tracking, medical notes)
- 👥 Employee management (CRUD, salary tracking, role assignments)
- 👤 Customer management with annual pass tracking
- 🏡 Habitat management with capacity and maintenance tracking
- 🎪 Attraction and event management
- 🛍️ Gift shop operations (shops, items, sales, inventory)
- ☕ Cafe operations (cafes, menus, sales)
- 🎫 Ticket sales and tracking interface
- 📈 Advanced analytics and custom query reports
- 🦁 Keeper-to-animal assignment system
- 🍽️ Feeding schedule and log tracking

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

### Schema Tables (20 tables)
- **Core Entities:** animals, habitats, attractions, employees, customers
- **Operations:** tickets, events, event_registrations, feeding_logs, feeding_schedules
- **Staff Management:** zookeeper_assignments
- **Sales:** gift_shops, gift_shop_items, gift_shop_sales_transactions, gift_shop_sale_items, cafes, cafe_items, cafe_sales
- **Authentication:** user_accounts, passwords
- **Analytics:** Complex queries for revenue, attendance, and statistics

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
- `POST /api/auth/register` - Register new customer account
- `POST /api/auth/login` - Login (returns JWT token)
- `GET /api/auth/profile` - Get authenticated user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/logout` - Logout

**Core Entities:**
- `/api/animals` - Complete animal CRUD with health tracking
- `/api/employees` - Employee management with role assignments
- `/api/customers` - Customer management with annual pass tracking
- `/api/habitats` - Habitat operations with capacity management
- `/api/attractions` - Attraction management

**Operations:**
- `/api/tickets` - Ticket sales and tracking
- `/api/events` - Event management with status tracking
- `/api/event-registrations` - Event registration and attendance

**Sales & Commerce:**
- `/api/gift-shops` - Gift shop management
- `/api/gift-shop-items` - Gift shop inventory
- `/api/gift-shop-sales` - Gift shop sales transactions
- `/api/cafes` - Cafe management
- `/api/cafe-items` - Cafe menu management
- `/api/cafe-sales` - Cafe sales tracking

**Analytics:**
- `/api/dashboard` - Dashboard statistics
- `/api/queries` - Advanced analytics endpoints (5 custom queries)

For detailed API documentation, see [BACKEND_API_DOCS.md](BACKEND_API_DOCS.md)

## 🎯 Project Status

### ✅ Completed Features
- [x] Complete project architecture with TypeScript
- [x] Backend foundation (config, middleware, utils)
- [x] Frontend setup with Next.js 14 App Router
- [x] Tailwind configuration with custom zoo color palette
- [x] Database connection to Railway MySQL
- [x] JWT-based authentication system
- [x] Complete user registration and login system
- [x] Role-based access control (8 employee roles + customer role)
- [x] All backend services (17 services implemented)
- [x] All backend controllers (17 controllers)
- [x] Complete CRUD operations for all entities
- [x] Employee dashboard with real-time statistics
- [x] Customer portal pages (tickets, events, memberships)
- [x] Animal management interface
- [x] Employee management interface
- [x] Customer management interface
- [x] Event management with status tracking
- [x] Ticket purchasing system with multiple ticket types
- [x] Event registration and attendance tracking
- [x] Gift shop operations (shops, items, sales, inventory)
- [x] Cafe operations (cafes, menus, sales)
- [x] Habitat and attraction management
- [x] Advanced analytics with 5 custom query reports
- [x] Form components for all entities
- [x] Search and filtering on major pages
- [x] Reusable UI components with shadcn/ui
- [x] Complete TypeScript type system
- [x] API client with Axios interceptors

### 🚧 Known Limitations / Future Enhancements
- [ ] File uploads for animal photos (would require schema change)
- [ ] Email notification system (perhaps just a push notification on the website if they're logged in)
- [ ] Payment gateway integration
- [ ] PDF report generation (probably unncessary)
- [ ] Data visualization charts/graphs (maybe for finiance report)
- [ ] Advanced filtering options
- [ ] Mobile app version (probably unncessary)
- [ ] Audit log tracking

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
