# Zoo Management System - Comprehensive Codebase Analysis

## 1. ADMIN DASHBOARD & NAVIGATION STRUCTURE

### Frontend Admin Pages
**Location**: `/home/charles/dev/Zoo/frontend/src/app/admin/`

#### Main Navigation (Sidebar)
**File**: `/home/charles/dev/Zoo/frontend/src/components/admin/Sidebar.tsx` (Lines 36-49)

Current menu items and role-based access:
- **Dashboard** (`/admin`) - All roles
- **Animals** (`/admin/animals`) - manager, veterinarian, keeper
- **Habitats** (`/admin/habitats`) - manager, veterinarian, keeper
- **Employees** (`/admin/employees`) - manager only
- **Events** (`/admin/events`) - manager, coordinator, guide
- **Customers** (`/admin/customers`) - manager, cashier
- **Transactions** (`/admin/transactions`) - manager, cashier
- **Gift Shops** (`/admin/gift-shops`) - manager, cashier
- **Cafes** (`/admin/cafes`) - manager, cashier
- **Animal Health & Care** (`/admin/queries/animal-health-care`) - manager, keeper, veterinarian
- **Event Performance** (`/admin/queries/event-performance`) - manager, coordinator
- **Financial Report** (`/admin/queries/financial-report`) - manager, cashier

#### Admin Layout
**File**: `/home/charles/dev/Zoo/frontend/src/app/admin/layout.tsx`
- Uses Sidebar component for navigation
- Protects all routes - requires employee role
- Redirects non-employees to /login

#### Main Dashboard
**File**: `/home/charles/dev/Zoo/frontend/src/app/admin/page.tsx`
- Displays dashboard stats (animals, employees, events, habitats, visitors, revenue)
- Shows recent activity feed
- Role-specific widgets:
  - **Keepers**: Display keeper assignments with animal details
  - **Veterinarians**: Display animals under their care with health status
  - **Event Cancellation Widget**: Shows recent event cancellations triggered by database
  - Used in line 9: `EventCancellationWidget` from `@/components/admin/`

---

## 2. ZOOKEEPER ASSIGNMENTS

### Database Schema
**Location**: `/home/charles/dev/Zoo/database/zoo_schema.sql` (Lines 227-236)

```sql
CREATE TABLE `zookeeper_assignments` (
  `assignment_id` INT PRIMARY KEY AUTO_INCREMENT,
  `keeper_id` INT NOT NULL,
  `animal_id` INT NOT NULL,
  `shift` VARCHAR(50),
  FOREIGN KEY (`keeper_id`) REFERENCES `employees`(`employee_id`),
  FOREIGN KEY (`animal_id`) REFERENCES `animals`(`animal_id`),
  UNIQUE (`keeper_id`, `animal_id`)
);
```

### Backend Implementation

#### Model
**File**: `/home/charles/dev/Zoo/backend/src/models/zookeeperAssignment.model.ts`
- `findByKeeperId(keeperId)`: Gets assignments for a specific keeper with animal details
  - Includes: keeper name, animal name, species, health status, last feeding time
  - Filters out deleted animals
- `findAll()`: Gets all assignments across all keepers
  - Returns detailed view with keeper and animal information
  - Ordered by keeper last name, then animal name

#### Service
**File**: `/home/charles/dev/Zoo/backend/src/services/zookeeperAssignment.service.ts`
- `getAssignmentsByKeeperId(keeperId)`: Delegates to model
- `getAllAssignments()`: Delegates to model

#### Controller
**File**: `/home/charles/dev/Zoo/backend/src/controllers/zookeeperAssignment.controller.ts`
- `getAssignmentsByKeeperId()`: HTTP GET handler for keeper-specific assignments
- `getAllAssignments()`: HTTP GET handler for all assignments

#### Routes
**File**: `/home/charles/dev/Zoo/backend/src/routes/zookeeperAssignment.routes.ts`
- `GET /api/zookeeper-assignments` - All assignments (protected, requires keeper/vet/manager)
- `GET /api/zookeeper-assignments/keeper/:keeperId` - Assignments for specific keeper

### Frontend Implementation

#### Service
**File**: `/home/charles/dev/Zoo/frontend/src/services/zookeeperAssignment.service.ts`
- `getByKeeperId(keeperId)`: Fetch assignments for logged-in keeper
- `getAll()`: Fetch all assignments

#### Usage on Animals Page
**File**: `/home/charles/dev/Zoo/frontend/src/app/admin/animals/page.tsx` (Lines 59-61, 102-110)
- Loads keeper assignments on mount if user is a keeper
- Stores animal IDs assigned to keeper in `myAnimalIds` state
- Used to visually distinguish assigned animals on the table

#### Usage on Dashboard
**File**: `/home/charles/dev/Zoo/frontend/src/app/admin/page.tsx` (Lines 51-52, 84-94)
- Keeper dashboard displays `KeeperAssignment[]` in sidebar widget
- Service call: `dashboardService.getKeeperAssignments()`

---

## 3. ANIMAL MANAGEMENT

### Database Schema
**Location**: `/home/charles/dev/Zoo/database/zoo_schema.sql` (Lines 143-163)

Key fields:
- `animal_id`, `name`, `scientific_name`, `species`
- `date_of_birth`, `arrival_date`, `gender`, `place_of_origin`
- `habitat_id` (FK to habitats)
- `medical_notes`, `health_status` (enum: excellent/good/fair/poor/critical)
- `active_status` (enum: active/transferred/deceased)
- `endangerment_status` (enum: least_concern to extinct)
- `weight`, `deleted_at` (soft delete)

### Backend Implementation

#### Model
**File**: `/home/charles/dev/Zoo/backend/src/models/animal.model.ts`
- `findAll()`: Gets active animals with habitat info (LEFT JOIN)
- `findAllIncludingDeleted()`: Gets all animals including soft-deleted ones
- `create()`: Creates new animal record
- `findById()`: Gets single animal (not deleted)
- `update()`: Updates animal fields
- `remove()`: Soft delete (sets deleted_at)
- `restore()`: Un-soft-deletes animal

#### Service
**File**: `/home/charles/dev/Zoo/backend/src/services/animal.service.ts`
- Wraps all model methods (CRUD operations)

#### Controller
**File**: `/home/charles/dev/Zoo/backend/src/controllers/animal.controller.ts`
- Implements HTTP handlers for CRUD endpoints

#### Routes
**File**: `/home/charles/dev/Zoo/backend/src/routes/animal.routes.ts`
- Protected routes with role restrictions (manager/vet/keeper)

### Frontend Implementation

#### Service
**File**: `/home/charles/dev/Zoo/frontend/src/services/animal.service.ts`
- `getAll(includeDeleted)`: Fetch animals
- CRUD operations for create/update/delete/restore

#### Animals Page
**File**: `/home/charles/dev/Zoo/frontend/src/app/admin/animals/page.tsx`

Features:
- Lists all animals in table view
- Search by name/species
- Filter by health status
- Sort by name/date/status
- Soft delete support with restore option
- Role-based visibility:
  - Keepers: Shows only animals assigned to them (via zookeeper_assignments)
  - Vets: Can see health notes and status
- Add/Edit/Delete modals
- Detail modal for viewing full animal info

**Key Components**:
- `AnimalForm` - Add/edit modal
- `AnimalDetailModal` - View details
- `ShowDeletedToggle` - Toggle deleted animals view
- `RestoreConfirmationModal` - Confirm restore

---

## 4. EVENT CANCELLATION IMPLEMENTATION

### Database Schema & Triggers
**Location**: `/home/charles/dev/Zoo/database/zoo_schema.sql`

#### Events Table (Lines 86-100)
```sql
CREATE TABLE `events` (
  `event_id`, `name`, `description`,
  `event_date`, `start_time`, `end_time`, `location`,
  `max_participants`, `ticket_price`,
  `coordinator_id` (FK to employees),
  `created_at`, `deleted_at` (soft delete)
);
```

#### Event Cancellation Logs Table (Lines not shown in schema, but referenced in models)
- `log_id`, `event_id`, `event_name`, `event_date`
- `cancelled_at`, `cancelled_by`
- `total_registrations`, `customers_notified`, `refunds_needed`
- Populated by database trigger `trg_event_cancellation_notification`

### Backend Implementation

#### Model
**File**: `/home/charles/dev/Zoo/backend/src/models/event-cancellation-log.model.ts`
- `findAll(limit)`: Gets recent cancellation logs ordered by date
- `findById(logId)`: Gets specific log
- `findByEventId(eventId)`: Gets cancellation logs for specific event
- `getStatistics()`: Returns summary stats (total cancellations, customers affected, refunds needed, recent 24h)

#### Service
**File**: `/home/charles/dev/Zoo/backend/src/services/event-cancellation-log.service.ts`
- `getRecentCancellations(limit)`: Fetches recent logs from model
- `getCancellationById(logId)`: Gets single log
- `getCancellationsByEventId(eventId)`: Gets logs for event
- `getStatistics()`: Aggregates cancellation statistics

#### Event Service (Cancellation Integration)
**File**: `/home/charles/dev/Zoo/backend/src/services/event.service.ts` (Lines 69-71)
- `deleteEvent()` accepts optional `employeeInfo` parameter
  - Passes to model to trigger cancellation log creation
  - Database trigger captures: employee name, time, affected customers

#### Routes & Controllers
**File**: `/home/charles/dev/Zoo/backend/src/routes/event-cancellation-log.routes.ts`
- `GET /api/event-cancellations` - Get recent cancellations (manager/coordinator)

**File**: `/home/charles/dev/Zoo/backend/src/controllers/event-cancellation-log.controller.ts`
- `getRecentCancellations()` - Handler

**File**: `/home/charles/dev/Zoo/backend/src/routes/event.routes.ts` (Lines 39-46)
- `DELETE /api/events/:id` - Delete event (coordinator/manager)
  - Passes employee info for audit trail

### Frontend Implementation

#### Event Cancellation Widget
**File**: `/home/charles/dev/Zoo/frontend/src/components/admin/EventCancellationWidget.tsx`
- Displays on admin dashboard
- Shows recent event cancellations with:
  - Event name, original date
  - Customers notified count
  - Refunds needed amount
  - Total registrations affected
  - Cancelled by (employee name)
  - Time ago formatted display
- Fetches data: `GET /api/event-cancellations?limit=5`
- Demonstrates database trigger integration with UI

#### Events Page
**File**: `/home/charles/dev/Zoo/frontend/src/app/admin/events/page.tsx`
- Delete event handler (lines 125-136)
- Soft delete with restore option
- Shows deleted events when toggle enabled

---

## 5. TRANSACTION TRACKING & DISPLAY

### Database Tables
**Location**: `/home/charles/dev/Zoo/database/zoo_schema.sql`

Transactions aggregated from multiple sources:
1. **Tickets** (Lines 165-176): `ticket_id`, `purchase_date`, `price`, `payment_method`
2. **Event Registrations** (Lines 214-225): `registration_id`, `registration_date`, `total_amount`, `payment_status`
3. **Gift Shop Sales** (Lines 263-286): `gift_shop_sales_transactions` + `gift_shop_sale_items`
4. **Cafe Sales** (Lines 288-303): `cafe_sales` with `line_total`, `sale_timestamp`
5. **Donations** (Not fully shown): Donation table with `donation_date`, `amount`
6. **Membership Purchases** (Lines 178-188): `membership_purchases` with `purchase_date`, `price`, `auto_renewed`

### Backend Implementation

#### Transaction Service
**File**: `/home/charles/dev/Zoo/backend/src/services/transaction.service.ts`
- `getAll()`: Aggregates all transaction types
  - `getDonations()`: SQL query joining donations + customers
  - `getEventRegistrations()`: Query event_registrations (non-deleted only)
  - `getGiftShopSales()`: Query gift_shop_sales_transactions with customer/employee info
  - `getCafeSales()`: Groups cafe_sales by transaction_id with SUM(line_total)
  - `getTicketSales()`: Query tickets with customer info
- Combines all sources and sorts by date (newest first)
- Returns `UnifiedTransaction[]` type

#### Transaction Controller
**File**: `/home/charles/dev/Zoo/backend/src/controllers/transaction.controller.ts`
- `getAll()`: Simple handler delegating to service

#### Routes
**File**: `/home/charles/dev/Zoo/backend/src/routes/transaction.routes.ts`
- `GET /api/transactions` - Protected (manager/cashier only)

### Frontend Implementation

#### Transaction Type Definition
**File**: `/home/charles/dev/Zoo/frontend/src/types/transaction.types.ts`
```typescript
interface UnifiedTransaction {
  id: string;  // prefixed like "donation-123", "event-456"
  type: 'Ticket' | 'Event' | 'Gift Shop' | 'Cafe' | 'Donation';
  date: string;
  total: number;
  customerName: string;
  employeeName?: string;
  details: { [key: string]: any };
}
```

#### Transaction Service
**File**: `/home/charles/dev/Zoo/frontend/src/services/transaction.service.ts`
- `getAll()`: Fetches from `/api/transactions`

#### Transactions Page
**File**: `/home/charles/dev/Zoo/frontend/src/app/admin/transactions/page.tsx`
- Lists all transactions in table format
- Search by customer/employee name or transaction ID
- Filter by transaction type (Ticket/Event/Gift Shop/Cafe/Donation)
- Sort by date (newest first) or total amount
- Modal for adding new transactions (TransactionForm component)
- Status badge for payment status (if applicable)

---

## 6. FINANCIAL REPORTS

### Query Reports Overview
**Location**: `/home/charles/dev/Zoo/frontend/src/app/admin/queries/`

Three main report pages:
1. **Animal Health & Care** (`animal-health-care/page.tsx`)
2. **Event Performance** (`event-performance/page.tsx`)
3. **Financial Report** (`financial-report/page.tsx`)

### Financial Report Implementation

#### Backend Query Service
**File**: `/home/charles/dev/Zoo/backend/src/services/query.service.ts`

**Report Methods** (all support date range filters):

1. **`getTicketRevenue(startDate?, endDate?, includeReturns?)`** (Lines 220-260)
   - Query 1: Revenue by ticket type (adult/child/senior/student)
   - Query 2: Revenue by payment method
   - Returns: `{ total, transactions, byType[], byPaymentMethod[] }`

2. **`getEventRevenue(startDate?, endDate?, includeCanceled?)`** (Lines 266-302)
   - Groups by event with registration metrics
   - Returns: `{ total, registrations, participants, byEvent[] }`

3. **`getGiftShopRevenue(startDate?, endDate?, includeReturns?)`** (Lines 308-353)
   - Query 1: Revenue by shop location
   - Query 2: Revenue by payment method
   - Returns: `{ total, transactions, returns, byShop[], byPaymentMethod[] }`

4. **`getCafeRevenue(startDate?, endDate?, includeReturns?)`** (Lines 359-392)
   - Groups cafe_sales by cafe with transaction counts
   - Tracks returns
   - Returns: `{ total, transactions, lineItems, returns, byCafe[] }`

5. **`getMembershipRevenue(startDate?, endDate?)`** (Lines 398-439)
   - Segments by purchase type (Manual vs Auto-Renewal)
   - Groups by payment method
   - Returns: `{ total, memberships, manualPurchases, autoRenewals, byType[], byPaymentMethod[] }`

6. **`getFinancialReport(params)`** (Lines 445-512)
   - **Main aggregate method**
   - Selectable sources: ticket, event, gift_shop, cafe, membership
   - Combines all selected sources into unified report
   - Calculates summary metrics:
     - `totalRevenue`: Sum across all sources
     - `totalTransactions`: Count of transactions
     - `dateRange`: {start, end, isAllTime}
     - `sources`: Array with breakdown by source
     - `largestRevenueSource`: Identifies top revenue generator
   - Returns structured report object

#### Frontend Financial Report Page
**File**: `/home/charles/dev/Zoo/frontend/src/app/admin/queries/financial-report/page.tsx`

**UI Structure**:
1. **Parameters Card** (Lines 166-243)
   - Date Range Picker: Optional (for all-time reporting)
   - Revenue Sources: Multi-select (Ticket/Event/Gift Shop/Cafe/Membership)
   - Group By: Dropdown (Daily/Weekly/Monthly)
   - Include Returns: Checkbox
   - Generate/Clear buttons

2. **Summary Section** (Lines 255-331)
   - Total Revenue prominently displayed
   - Breakdown by source with percentages
   - Transaction count
   - Report period info

3. **Detail Sections** (Lines 334-354)
   - Conditional rendering of:
     - `TicketRevenueSection` - By type and payment method
     - `EventRevenueSection` - By event
     - `GiftShopRevenueSection` - By shop location
     - `CafeRevenueSection` - By cafe
     - `MembershipRevenueSection` - By renewal type

#### Report Components
**Location**: `/home/charles/dev/Zoo/frontend/src/components/reports/`

Individual revenue section components:
- `TicketRevenueSection.tsx` - Shows ticket type breakdown
- `EventRevenueSection.tsx` - Shows events with registration counts
- `GiftShopRevenueSection.tsx` - Shows shop locations
- `CafeRevenueSection.tsx` - Shows cafe sales
- `MembershipRevenueSection.tsx` - Shows manual vs auto-renewal
- `DateRangePicker.tsx` - Date selection with quick select buttons
- `GenerateReportButton.tsx` - Report generation controls
- `ReportEmptyState.tsx` - Empty state placeholder

#### Query Service (Frontend)
**File**: `/home/charles/dev/Zoo/frontend/src/services/query.service.ts`
- `getFinancialReport(params)`: Calls `/queries/financial-report` endpoint
- URL parameters: startDate, endDate, sources (comma-separated), grouping, includeReturns

#### Backend Financial Report Route
**File**: `/home/charles/dev/Zoo/backend/src/routes/query.routes.ts`
- `GET /api/queries/financial-report` - Protected (manager/cashier)

#### Backend Controller
**File**: `/home/charles/dev/Zoo/backend/src/controllers/query.controller.ts` (Lines 87-124)
- `getFinancialReport()`: 
  - Parses query parameters
  - Handles optional date range (dates can be empty for all-time)
  - Passes to QueryService
  - Returns structured report

### Other Query Reports

#### Animal Health & Care Report
**File**: `/home/charles/dev/Zoo/backend/src/services/query.service.ts` (Lines 34-145)
- Joins habitats, animals, zookeeper_assignments, feeding_schedules, feeding_logs
- Includes metrics:
  - Keeper assignments with shift info
  - Feeding schedule and frequency
  - Recent feeding activity (last 30 days)
  - Last feeding time
  - Last food given
- Filters by habitat status, health status, endangerment
- Frontend page: `/admin/queries/animal-health-care/page.tsx`

#### Event Performance Report
**File**: `/home/charles/dev/Zoo/backend/src/services/query.service.ts` (Lines 147-214)
- Joins events with event_registrations
- Metrics:
  - Total registered participants
  - Total revenue from registrations
  - Capacity percentage utilization
  - Coordinator name
- Filters by date range, event status (upcoming/past), includes canceled option
- Frontend page: `/admin/queries/event-performance/page.tsx`

---

## SUMMARY OF KEY DATABASE RELATIONSHIPS

```
employees (1) ──── (*) zookeeper_assignments ──── (*) animals
                         └─ Keeper care assignments

employees (1) ──── (*) events
                  └─ Event coordination

animals (1) ──── (*) zookeeper_assignments
           ├──── (*) feeding_schedules
           ├──── (*) feeding_logs
           └──── (*) animals_alert_queue

events (1) ──── (*) event_registrations ──── (*) customers
            └─ Event attendance

gift_shops (1) ──── (*) gift_shop_sales_transactions ──── (*) gift_shop_sale_items
cafes (1) ──── (*) cafe_sales
customers (1) ──── (*) tickets
           ├──── (*) donations
           ├──── (*) event_registrations
           ├──── (*) membership_purchases
           └──── (*) customer_payment_methods
```

---

## CURRENT BRANCH CHANGES (features7)

Modified files from prod branch:
- `backend/package-lock.json` - Dependency updates
- `backend/src/controllers/query.controller.ts` - Event Performance report parameter validation removed
- `backend/src/services/query.service.ts` - Query refinements
- `frontend/src/app/admin/queries/animal-health-care/page.tsx` - Report UI updates
- `frontend/src/app/admin/queries/event-performance/page.tsx` - Report UI updates
- `frontend/src/app/admin/queries/financial-report/page.tsx` - Report UI updates
- `frontend/src/components/reports/DateRangePicker.tsx` - Date picker enhancements
- `frontend/src/components/reports/ReportEmptyState.tsx` - Empty state styling updates

