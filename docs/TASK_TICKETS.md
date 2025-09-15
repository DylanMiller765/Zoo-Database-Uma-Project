# Project Task Tickets

## How to Claim a Ticket
1. Add your name next to the ticket you want to work on
2. Create a branch with format: `feature/ticket-number-description`
3. Update status when you start and complete the task

## Ticket Status Legend
- 🔴 Not Started
- 🟡 In Progress  
- 🟢 Completed
- 🔵 In Review

---

## DATABASE TEAM TICKETS

### DB-001: Install and Configure MySQL 🔴
**Assigned to:** [Name]
**Priority:** High
**Description:** Install MySQL server, create zoo_database, set up user permissions
**Deliverables:**
- MySQL installed and running
- Database created
- Access credentials documented

### DB-002: Execute Database Schema 🔴
**Assigned to:** [Name]
**Priority:** High
**Description:** Run zoo_schema.sql to create all tables
**Deliverables:**
- All tables created successfully
- Foreign key relationships verified

### DB-003: Create Sample Data 🔴
**Assigned to:** [Name]
**Priority:** Medium
**Description:** Create realistic sample data for testing (minimum 20 records per table)
**Deliverables:**
- sample_data.sql file with INSERT statements
- Data covers all use cases

### DB-004: Create Stored Procedures 🔴
**Assigned to:** [Name]
**Priority:** Medium
**Description:** Create procedures for complex queries and reports
**Deliverables:**
- Revenue calculation procedures
- Animal health report procedures
- Inventory management procedures

---

## BACKEND TEAM TICKETS

### BE-001: Set Up Express Server 🔴
**Assigned to:** [Name]
**Priority:** High
**Description:** Configure Express server with middleware
**Deliverables:**
- Server running on port 5000
- CORS configured
- Error handling middleware

### BE-002: Animal Management APIs 🔴
**Assigned to:** [Name]
**Priority:** High
**Description:** Complete CRUD operations for animals
**Deliverables:**
- GET /api/animals (with filtering)
- POST /api/animals
- PUT /api/animals/:id
- DELETE /api/animals/:id
- GET /api/animals/species (list unique species)

### BE-003: Employee Management APIs 🔴
**Assigned to:** [Name]
**Priority:** High
**Description:** Create employee endpoints
**Deliverables:**
- All CRUD operations
- Department filtering
- Schedule management

### BE-004: Ticket System APIs 🔴
**Assigned to:** [Name]
**Priority:** High
**Description:** Implement ticket booking system
**Deliverables:**
- Ticket purchase endpoint
- Availability checking
- Price calculation
- Cancellation support

### BE-005: Gift Shop APIs 🔴
**Assigned to:** [Name]
**Priority:** Medium
**Description:** Create gift shop management endpoints
**Deliverables:**
- Inventory management
- Sale processing
- Low stock alerts

### BE-006: Food Service APIs 🔴
**Assigned to:** [Name]
**Priority:** Medium
**Description:** Implement food service endpoints
**Deliverables:**
- Menu management
- Order processing
- Sales tracking

### BE-007: Authentication System 🔴
**Assigned to:** [Name]
**Priority:** Low
**Description:** Add JWT authentication
**Deliverables:**
- Login/logout endpoints
- Role-based access control
- Protected routes

---

## FRONTEND TEAM TICKETS

### FE-001: Project Setup and Routing 🔴
**Assigned to:** [Name]
**Priority:** High
**Description:** Set up React Router and basic layout
**Deliverables:**
- Navigation menu
- Route configuration
- Layout components

### FE-002: Dashboard Page 🔴
**Assigned to:** [Name]
**Priority:** High
**Description:** Create main dashboard with statistics
**Deliverables:**
- Revenue widgets
- Visitor count
- Quick actions menu
- Recent activities

### FE-003: Animal Management UI 🔴
**Assigned to:** [Name]
**Priority:** High
**Description:** Create animal management interface
**Deliverables:**
- Animal list with search/filter
- Add/Edit animal form
- Animal detail view
- Medical records section

### FE-004: Employee Management UI 🔴
**Assigned to:** [Name]
**Priority:** Medium
**Description:** Build employee interface
**Deliverables:**
- Employee directory
- Add/Edit forms
- Department view
- Schedule display

### FE-005: Ticket Booking UI 🔴
**Assigned to:** [Name]
**Priority:** High
**Description:** Create ticket purchase interface
**Deliverables:**
- Date selection
- Ticket type selection
- Customer information form
- Payment simulation
- Confirmation page

### FE-006: Gift Shop POS UI 🔴
**Assigned to:** [Name]
**Priority:** Medium
**Description:** Build point-of-sale interface
**Deliverables:**
- Product grid/list
- Shopping cart
- Checkout process
- Receipt display

### FE-007: Reports Dashboard 🔴
**Assigned to:** [Name]
**Priority:** Medium
**Description:** Create reporting interface
**Deliverables:**
- Revenue charts
- Visitor statistics
- Department performance
- Export functionality

### FE-008: Customer Management UI 🔴
**Assigned to:** [Name]
**Priority:** Low
**Description:** Build customer interface
**Deliverables:**
- Customer list
- Registration form
- Purchase history
- Membership management

---

## TESTING & DOCUMENTATION TICKETS

### TD-001: API Documentation 🔴
**Assigned to:** [Name]
**Priority:** High
**Description:** Document all API endpoints
**Deliverables:**
- Endpoint descriptions
- Request/response examples
- Error codes
- Postman collection

### TD-002: User Manual 🔴
**Assigned to:** [Name]
**Priority:** Medium
**Description:** Create user guide for the system
**Deliverables:**
- Feature descriptions
- Step-by-step guides
- Screenshots
- FAQ section

### TD-003: API Testing 🔴
**Assigned to:** [Name]
**Priority:** High
**Description:** Test all backend endpoints
**Deliverables:**
- Test cases document
- Postman tests
- Bug report

### TD-004: UI Testing 🔴
**Assigned to:** [Name]
**Priority:** High
**Description:** Test frontend functionality
**Deliverables:**
- Test scenarios
- Cross-browser testing
- Mobile responsiveness check
- Bug report

### TD-005: Final Presentation 🔴
**Assigned to:** [Name]
**Priority:** Low
**Description:** Prepare presentation materials
**Deliverables:**
- PowerPoint slides
- Live demo script
- Architecture diagrams

---

## INTEGRATION TICKETS

### INT-001: Frontend-Backend Connection 🔴
**Assigned to:** [Name]
**Priority:** High
**Description:** Connect React to Express APIs
**Deliverables:**
- API service layer
- Error handling
- Loading states

### INT-002: Database Seeding Script 🔴
**Assigned to:** [Name]
**Priority:** Medium
**Description:** Create script to populate database
**Deliverables:**
- Seed script
- Reset script
- Instructions

---

## Team Member Assignments

| Name | Role | Current Tickets | Completed |
|------|------|----------------|-----------|
| [Member 1] | | | |
| [Member 2] | | | |
| [Member 3] | | | |
| [Member 4] | | | |
| [Member 5] | | | |

---

## Sprint Schedule

### Sprint 1 (Week 1)
Focus: Setup and Database
- All DB tickets
- BE-001
- FE-001

### Sprint 2 (Week 2-3)
Focus: Core Backend
- BE-002 to BE-006
- Start frontend development

### Sprint 3 (Week 3-4)
Focus: Frontend Development
- All FE tickets
- Integration work

### Sprint 4 (Week 5)
Focus: Testing and Polish
- All TD tickets
- Bug fixes
- Performance optimization

### Sprint 5 (Week 6)
Focus: Documentation and Presentation
- Final testing
- Documentation completion
- Presentation preparation