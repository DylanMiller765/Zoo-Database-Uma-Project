# Backend API Documentation

## Overview

The backend for the Zoo Management System is a Node.js application written in TypeScript, using the Express.js framework. It provides a RESTful API for interacting with the zoo database.

## Running the Backend

1.  Navigate to the `backend` directory: `cd backend`
2.  Install dependencies: `npm install`
3.  Start the development server: `npm run dev`

The server will run on `http://localhost:5000`.

## API Base URL

All API endpoints are prefixed with `/api`. The full base URL is `http://localhost:5000/api`.

## Authentication

Most endpoints are protected and require a JSON Web Token (JWT) for authentication.

### Getting a Token

To get a token, send a `POST` request to `/api/auth/login` with the user's email and password.

**Test Users:**
You can use the test users from `database/seed_test_users.sql`. All test users have the password `password123`.
- Manager: `sarah.johnson@zoo.com`
- Keeper: `mike.chen@zoo.com`
- Veterinarian: `emily.rodriguez@zoo.com`
- Coordinator: `david.kim@zoo.com`
- Cashier: `lisa.thompson@zoo.com`

### Using the Token

To authenticate a request, include the token in the `Authorization` header with the `Bearer` scheme.

**Example:**
`Authorization: Bearer <your_jwt_token>`

## API Endpoints

### Public Endpoints

These endpoints are public and do not require authentication.

- `GET /api/attractions`: Get all attractions.
- `GET /api/attractions/:id`: Get a single attraction by ID.
- `GET /api/habitats`: Get all habitats.
- `GET /api/habitats/:id`: Get a single habitat by ID.
- `GET /api/events`: Get all upcoming events.
- `GET /api/events/:id`: Get a single event by ID.

### Protected Endpoints

These endpoints require authentication. The required roles are listed for each.

#### Auth (`/api/auth`)
- `POST /login`: Login a user.
- `POST /register`: Register a new customer.
- `GET /profile`: Get the profile of the logged-in user.
- `POST /logout`: Logout a user.

#### Animals (`/api/animals`)
- `GET /`: Get all animals (Roles: `manager`, `veterinarian`, `keeper`)
- `GET /:id`: Get a single animal by ID (Roles: `manager`, `veterinarian`, `keeper`)
- `POST /`: Create a new animal (Roles: `manager`, `veterinarian`)
- `PUT /:id`: Update an animal (Roles: `manager`, `veterinarian`)
- `DELETE /:id`: Delete an animal (Roles: `manager`, `veterinarian`)

#### Customers (`/api/customers`)
- `GET /`: Get all customers (Roles: `manager`, `coordinator`)
- `POST /`: Create a new customer (Roles: `manager`, `coordinator`)
- `GET /:id`: Get a single customer by ID (Roles: `manager`, `coordinator`)
- `PUT /:id`: Update a customer (Roles: `manager`, `coordinator`)
- `DELETE /:id`: Delete a customer (Roles: `manager`, `coordinator`)

#### Employees (`/api/employees`)
- `GET /`: Get all employees (Role: `manager`)
- `POST /`: Create a new employee (Role: `manager`)
- `GET /:id`: Get a single employee by ID (Role: `manager`)
- `PUT /:id`: Update an employee (Role: `manager`)
- `DELETE /:id`: Delete an employee (Role: `manager`)

#### Events (`/api/events`)
- `POST /`: Create a new event (Roles: `coordinator`, `manager`)
- `PUT /:id`: Update an event (Roles: `coordinator`, `manager`)

#### Attractions (`/api/attractions`)
- `POST /`: Create a new attraction (Role: `manager`)
- `PUT /:id`: Update an attraction (Role: `manager`)
- `DELETE /:id`: Delete an attraction (Role: `manager`)

#### Habitats (`/api/habitats`)
- `POST /`: Create a new habitat (Roles: `manager`, `veterinarian`)
- `PUT /:id`: Update a habitat (Roles: `manager`, `veterinarian`, `keeper`)
- `DELETE /:id`: Delete a habitat (Roles: `manager`, `veterinarian`)

#### Tickets (`/api/tickets`)
- `GET /`: Get all tickets (Role: `manager`)
- `GET /date/:date`: Get tickets by date (Role: `manager`)
- `DELETE /:id`: Refund a ticket (Role: `manager`)
- `POST /`: Process a ticket sale (Roles: `manager`, `cashier`)
- `GET /:id`: Get ticket details (Roles: `manager`, `cashier`)

#### Gift Shop Items (`/api/gift-shop-items`)
- `GET /`: Get all items (Role: `manager`)
- `GET /low-stock`: Get low stock items (Role: `manager`)
- `POST /`: Add a new item (Role: `manager`)
- `PUT /:id`: Update an item (Role: `manager`)
- `DELETE /:id`: Delete an item (Role: `manager`)
- `GET /:id`: Get item details (Roles: `manager`, `cashier`)

#### Gift Shop Sales (`/api/gift-shop-sales`)
- `GET /date/:date`: Get daily sales report (Role: `manager`)
- `DELETE /:id`: Process a gift return (Role: `manager`)
- `POST /`: Process a gift sale (Roles: `manager`, `cashier`)
- `GET /:id`: Get sale details (Roles: `manager`, `cashier`)

#### Cafe Items (`/api/cafe-items`)
- `GET /`: Get all items (Role: `manager`)
- `POST /`: Add a new item (Role: `manager`)
- `PUT /:id`: Update an item (Role: `manager`)
- `DELETE /:id`: Delete an item (Role: `manager`)
- `GET /cafe/:cafeId`: Get menu for a cafe (Roles: `manager`, `cashier`)
- `GET /:id`: Get item details (Roles: `manager`, `cashier`)

#### Cafe Sales (`/api/cafe-sales`)
- `GET /date/:date/cafe/:cafeId`: Get daily sales report for a cafe (Role: `manager`)
- `DELETE /:transactionId`: Process a cafe return (Role: `manager`)
- `POST /`: Process a cafe transaction (Roles: `manager`, `cashier`)
- `GET /:transactionId`: Get transaction details (Roles: `manager`, `cashier`)

#### Event Registrations (`/api/event-registrations`)
- `GET /`: Get all registrations (Role: `coordinator`)
- `GET /event/:eventId`: Get attendees for an event (Role: `coordinator`)
- `PUT /:id`: Update a registration (Role: `coordinator`)
- `DELETE /id`: Cancel a registration (Role: `coordinator`)
- `POST /`: Register for an event (Roles: `coordinator`, `cashier`)
- `GET /:id`: Get registration details (Roles: `coordinator`, `cashier`)
