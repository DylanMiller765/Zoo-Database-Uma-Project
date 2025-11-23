# Zoo Database Management System

A web-based database system for managing zoo operations including animals, staff, customers, ticket sales, events, and facilities. Built with Next.js, Express, and MySQL.

## Setup

### Prerequisites
- Node.js (v18+)
- npm (v8+)
- Git

### Installation

1. Clone the repo:
```bash
git clone <your-repository-url>
cd Zoo-Database-Uma-Project
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:

**Backend** (`backend/.env`):
```bash
cd backend
cp .env.example .env
```
The default values connect to the shared Railway database and work out of the box.

**Frontend** (`frontend/.env.local`):
```bash
cd frontend
cp .env.local.example .env.local
```
Make sure it points to `http://localhost:5000/api`

4. Run the application by starting both servers in separate terminals:

Open a terminal in the `backend` folder:
```bash
npm run dev
```

Open another terminal in the `frontend` folder:
```bash
npm run dev
```

This starts:
- Backend: http://localhost:5000
- Frontend: http://localhost:3000

### Test Accounts

All passwords are `password`:
- **Manager**: sarah.johnson@zoo.com
- **Keeper**: mike.chen@zoo.com
- **Veterinarian**: emily.rodriguez@zoo.com
- **Customer**: maria.garcia@email.com

### Database

The database is hosted on Railway. No local setup needed. To apply schema changes:

```bash
mysql -h nozomi.proxy.rlwy.net -P 43756 -u root -p"tPLlbwDQnpriZFlWvJThTwkBStwJVmvc" zoo_database < database/zoo_schema.sql
```
