# 🏗️ Zoo Management System - Project Structure & Functionality

This document provides a detailed overview of the project's architecture, directory structure, database schema, and a complete breakdown of features by user role.

## 1. Architecture Overview

This is a full-stack application with a decoupled frontend and backend.

- **Backend**: A Node.js/Express.js RESTful API server written in TypeScript. It handles all business logic, database interactions, and authentication.
- **Frontend**: A Next.js (React) single-page application (SPA) that consumes the backend API. It is responsible for the user interface and all client-side interactions.
- **Database**: A single MySQL database hosted on Railway serves as the source of truth for the entire application.

---

## 2. Directory Structure

The project is organized into three main parts: `backend`, `frontend`, and `database`.

```
/
├── backend/                # Node.js + Express API
│   ├── src/
│   │   ├── config/         # Database & auth configuration
│   │   ├── controllers/    # API request handlers (the "C" in MVC)
│   │   ├── middleware/     # Express middleware (auth, roles, errors)
│   │   ├── models/         # Data models (interfaces for DB tables)
│   │   ├── routes/         # API endpoint definitions
│   │   ├── services/       # Business logic
│   │   ├── types/          # TypeScript type definitions
│   │   └── server.ts       # Application entry point
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/               # Next.js App
│   ├── src/
│   │   ├── app/            # Next.js App Router (pages and layouts)
│   │   ├── components/     # Reusable React components
│   │   ├── context/        # React context for global state (e.g., Auth)
│   │   ├── services/       # Functions for making API calls
│   │   ├── lib/            # Utility functions
│   │   └── types/          # Frontend-specific TypeScript types
│   ├── package.json
│   └── tailwind.config.ts
│
├── database/               # Database assets
│   ├── zoo_schema.sql      # The complete, canonical database schema
│   └── seed_data.sql       # SQL script for populating the DB with initial data
│
├── README.md               # Project overview and quick start
├── SETUP.md                # Detailed setup instructions
└── PROJECT_STRUCTURE.md    # This file
```

---

## 3. Database Schema

The database consists of over 20 tables that model the zoo's operations.

- **Core Entities**: `animals`, `habitats`, `attractions`, `employees`, `customers`.
- **Authentication**: `user_accounts` (stores login info), `customer_payment_methods`.
- **Operations**: `tickets`, `events`, `event_registrations`.
- **Animal Care**: `feeding_schedules`, `feeding_logs`, `zookeeper_assignments`.
- **Commerce**: `gift_shops`, `gift_shop_items`, `gift_shop_sales`, `cafes`, `cafe_items`, `cafe_sales`.
- **Notifications**: `notifications` (for membership renewals, etc.).

The canonical schema is defined in `database/zoo_schema.sql`. This file is the source of truth for all table structures, relationships, and constraints.

---

## 4. User Roles & Functionality

Access to features is controlled by a role-based system. There are two main user categories: **Customers** and **Employees**.

### Customer Functionality

Accessible through the main website (`/`).

| Feature | Description | CRUD Access |
| :--- | :--- | :--- |
| **View Content** | Browse animals, habitats, events, and attractions. | **Read-only** |
| **Authentication** | Register for a new account, log in, and log out. | **Create, Read** |
| **Profile Management** | View and update their own profile information. | **Read, Update** |
| **Ticket Purchasing** | Buy tickets for zoo admission. | **Create, Read** |
| **Event Registration** | Register for special events. | **Create, Read** |
| **Membership** | Purchase an annual pass. | **Create, Read** |
| **Payment Methods** | Save and manage a credit card for faster checkout. | **Create, Read, Delete** |
| **Auto-Renewal** | Enable or disable automatic renewal for annual passes. | **Update** |
| **Notifications** | Receive on-site notifications for expiring memberships. | **Read, Update** |

### Employee Functionality

Accessible through the Admin Dashboard (`/admin`). Roles are hierarchical, with `Manager` having the most permissions.

| Role | Key Responsibilities & Permissions |
| :--- | :--- |
| **Manager** | **Full System Access.** Can perform all CRUD operations on every entity, including employees, financial records, and system settings. Can view all analytics. |
| **Veterinarian** | **Animal Health Focus.** Full CRUD on `animals`. Can view/update `feeding_logs` and `feeding_schedules`. Read-only on most other data. |
| **Zookeeper** | **Animal Care Focus.** Can view assigned animals. Can create and update `feeding_logs` for their assigned animals. |
| **Coordinator** | **Events Focus.** Full CRUD on `events` and `event_registrations`. Can manage event attendees. |
| **Cashier** | **Sales Focus.** Can process sales for `tickets`, `gift_shop`, and `cafe`. Can register customers for events. Read-only access to relevant item/event details. |
| **Guide** | **Read-only access** to informational entities like `animals`, `habitats`, and `attractions`. |
| **Security** | Can view zoo operational data. (Further permissions can be defined). |

---

## 5. API Endpoints

The backend provides a RESTful API with endpoints corresponding to the database schema. All endpoints are prefixed with `/api`.

### Key Public Endpoints
- `GET /attractions`
- `GET /events`
- `GET /habitats`
- `POST /auth/login`
- `POST /auth/register`

### Key Protected Endpoints (Require Authentication)

- **/me**: `GET /`, `PUT /`, `GET /payment-method`, `DELETE /payment-method` (For the logged-in user)
- **/animals**: Full CRUD for Manager/Veterinarian.
- **/employees**: Full CRUD for Manager.
- **/customers**: Full CRUD for Manager/Coordinator.
- **/events**: Full CRUD for Manager/Coordinator.
- **/tickets**: `POST` for Cashier/Manager, `GET` for Manager.
- **/gift-shop-sales**: `POST` for Cashier/Manager, `GET` for Manager.
- **/cafe-sales**: `POST` for Cashier/Manager, `GET` for Manager.
- **/dashboard**: `GET /stats` (Provides aggregate data for the admin dashboard).
- **/queries**: `GET /<query-name>` (Provides data for the 5 analytics reports).
- **/notifications**: Full CRUD for a user on their own notifications.

This is a summary. The backend has over 25 route files, each defining specific endpoints for a resource. The routes in `backend/src/routes/` are the best place to see all available endpoints.