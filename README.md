# 🦁 Zoo Database Management System

A comprehensive full-stack web application for managing all aspects of zoo operations, built for a database management course. The system features a complete CRUD implementation for all entities, role-based access control for employees and customers, and extensive analytics capabilities.

## ✨ Core Features

### Customer-Facing Portal
- **Animal & Habitat Exploration**: Browse detailed information about the zoo's animals and their habitats.
- **Online Ticketing**: Purchase tickets for various age groups and make optional donations.
- **Event System**: View, search, and register for special zoo events.
- **Membership Services**: Purchase and manage annual passes, including auto-renewal options.
- **User Accounts**: Customers can register, log in, and manage their own profiles and saved payment methods.

### Employee & Admin Dashboard
- **Role-Based Access**: Granular permissions for 8 distinct employee roles (Manager, Keeper, Veterinarian, etc.).
- **Comprehensive Management**: Full CRUD (Create, Read, Update, Delete) capabilities for all major zoo entities including animals, employees, customers, habitats, and attractions.
- **Operational Control**: Manage day-to-day operations for gift shops, cafes, ticket sales, and event registrations.
- **Animal Care**: Specialized features for zookeeper assignments and tracking feeding schedules and logs.
- **Analytics & Reporting**: A dashboard with key statistics and a suite of custom queries for deeper insights into revenue, attendance, and more.

## 🛠️ Technology Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: MySQL (hosted on Railway)
- **Authentication**: JSON Web Tokens (JWT)

## 🚀 Quick Start

1.  **Install Dependencies**:
    ```bash
    npm install
    ```
    *(This single command installs dependencies for the root, frontend, and backend workspaces.)*

2.  **Configure Environment**: Copy the `.env.example` files in both the `frontend` and `backend` directories to `.env` / `.env.local` and fill in the required values. See the [Setup Guide](SETUP.md) for details.

3.  **Run the Application**:
    ```bash
    npm run dev
    ```
    - Frontend will be available at `http://localhost:3000`
    - Backend will be available at `http://localhost:5000`

## 📚 Documentation

For more detailed information, please refer to the following documents:

- **[SETUP.md](SETUP.md)**: A detailed, step-by-step guide to get the project environment set up and running locally.
- **[PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)**: A deep dive into the project's architecture, database schema, API endpoints, user roles, and complete feature breakdown.