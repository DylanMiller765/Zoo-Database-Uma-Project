# ⚙️ Zoo Management System - Setup Guide

This guide provides step-by-step instructions for setting up and running the Zoo Management System on your local machine.

## Prerequisites

- **Node.js**: v18 or newer.
- **npm**: v8 or newer (comes with Node.js).
- **Git**: For cloning the repository.
- **MySQL Client** (Optional): A tool like MySQL Workbench, DBeaver, or the `mysql` command-line client to interact with the database directly.

## 1. Clone the Repository

First, clone the project repository to your local machine:

```bash
git clone <your-repository-url>
cd Zoo-Database-Uma-Project
```

## 2. Install Dependencies

This project uses npm workspaces. You can install all dependencies for the frontend, backend, and root level with a single command from the project's root directory:

```bash
npm install
```

## 3. Configure Environment Variables

You need to set up environment variables for both the backend and frontend.

### Backend Configuration

1.  Navigate to the `backend` directory.
2.  Create a `.env` file by copying the example file:

    ```bash
    cd backend
    cp .env.example .env
    ```

3.  Open the new `backend/.env` file. The default values are pre-configured to connect to the shared Railway database and should work for local development.

    ```env
    # Server Configuration
    PORT=5000
    NODE_ENV=development

    # Database Configuration (Shared Railway Instance)
    DB_HOST=nozomi.proxy.rlwy.net
    DB_PORT=43756
    DB_USER=root
    DB_PASSWORD=tPLlbwDQnpriZFlWvJThTwkBStwJVmvc
    DB_NAME=zoo_database

    # JWT Configuration (Change for production)
    JWT_SECRET=your-super-secret-jwt-key
    JWT_EXPIRES_IN=7d

    # CORS Configuration
    CORS_ORIGIN=http://localhost:3000
    ```

### Frontend Configuration

1.  Navigate to the `frontend` directory.
2.  Create a `.env.local` file by copying the example file:

    ```bash
    cd frontend
    cp .env.local.example .env.local
    ```

3.  Open the new `frontend/.env.local` file and ensure it points to your local backend server:

    ```env
    NEXT_PUBLIC_API_URL=http://localhost:5000/api
    ```

## 4. Database Setup

The database is hosted on Railway, and the connection details are already in the backend's `.env` file. **No local database setup is required.**

You can connect to it using any MySQL client with the credentials from `backend/.env` if you need to inspect the schema or data.

To ensure the database schema is up-to-date, you can run the schema file against the database:

```bash
# Make sure you have a MySQL client installed
mysql -h nozomi.proxy.rlwy.net -P 43756 -u root -p"tPLlbwDQnpriZFlWvJThTwkBStwJVmvc" zoo_database < database/zoo_schema.sql
```

## 5. Run the Application

You can run both the frontend and backend servers concurrently with a single command from the project's root directory:

```bash
npm run dev
```

This will start:
- **Backend Server** on `http://localhost:5000`
- **Frontend Application** on `http://localhost:3000`

You can now open `http://localhost:3000` in your web browser to see the application.

### Running Services Individually

If you prefer to run the services separately:

- **To run the backend only**:
  ```bash
  npm run dev:backend
  ```
- **To run the frontend only**:
  ```bash
  npm run dev:frontend
  ```

## 6. Test Users & Login

You can log in using the pre-seeded employee and customer accounts. All default passwords are `password`.

- **Manager**: `john.smith@zoo.com`
- **Keeper**: `sarah.johnson@zoo.com`
- **Veterinarian**: `mike.chen@zoo.com`
- **Customer**: `maria.garcia@email.com`

Login at `http://localhost:3000/login`.