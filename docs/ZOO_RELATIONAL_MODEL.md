# Zoo Database - Relational Model & Mini World

## Mini World Description

**UMA Zoo** is a mid-sized metropolitan zoo that operates year-round, featuring exotic animals, educational programs, dining facilities, and gift shops. The zoo manages approximately 500 animals across 150 species, employs 200 staff members, and welcomes 50,000+ visitors monthly.

## Entity Relationship Overview

```
CUSTOMERS -----> TICKETS -----> ATTRACTIONS
    |               |
    v               v
PURCHASES      VISIT_DATE
    |
    v
GIFT_SHOP <---- INVENTORY
    |
    v
FOOD_SALES <---- FOOD_SERVICES
                      |
                      v
                  EMPLOYEES
                      |
                      v
                  ANIMALS
```

## Primary Entities & Relationships

### 1. ANIMALS (Strong Entity)
**Attributes:**
- animal_id (PK)
- name, species, breed
- date_of_birth, arrival_date
- gender, habitat, diet_type
- medical_notes, status

**Relationships:**
- **CARED_FOR_BY** → Employees (M:1)
  - Many animals can be cared for by one keeper
  - Each animal has one primary keeper

### 2. EMPLOYEES (Strong Entity)
**Attributes:**
- employee_id (PK)
- first_name, last_name
- email, phone, hire_date
- job_title, department, salary

**Relationships:**
- **CARES_FOR** → Animals (1:M)
- **PROCESSES** → Sales (1:M)
- **MANAGES** → Food Services (1:1)
- **COORDINATES** → Events (1:M)

### 3. CUSTOMERS (Strong Entity)
**Attributes:**
- customer_id (PK)
- first_name, last_name
- email, phone, address
- membership_type

**Relationships:**
- **PURCHASES** → Tickets (1:M)
- **BUYS_FROM** → Gift Shop (1:M)
- **ORDERS_FROM** → Food Services (1:M)
- **REGISTERS_FOR** → Events (M:M)

### 4. TICKETS (Weak Entity)
**Depends on:** Customers
**Attributes:**
- ticket_id (PK)
- purchase_date, visit_date
- ticket_type, price
- payment_method

**Relationships:**
- **PURCHASED_BY** → Customers (M:1)
- **VALID_FOR** → Attractions (M:M)

### 5. ATTRACTIONS (Strong Entity)
**Attributes:**
- attraction_id (PK)
- name, description
- location, capacity
- opening_time, closing_time
- ticket_price

**Relationships:**
- **ACCESSED_BY** → Tickets (M:M)
- **FEATURES** → Animals (1:M)

### 6. GIFT_SHOP_ITEMS (Strong Entity)
**Attributes:**
- item_id (PK)
- name, description
- category, price, cost
- quantity_in_stock
- reorder_level

**Relationships:**
- **SOLD_IN** → Gift Shop Sales (1:M)

### 7. GIFT_SHOP_SALES (Associative Entity)
**Attributes:**
- sale_id (PK)
- sale_date, total_amount
- payment_method

**Relationships:**
- **BOUGHT_BY** → Customers (M:1)
- **CONTAINS** → Gift Shop Items (M:M)
- **PROCESSED_BY** → Employees (M:1)

### 8. FOOD_SERVICES (Strong Entity)
**Attributes:**
- service_id (PK)
- name, location, type
- opening_time, closing_time

**Relationships:**
- **MANAGED_BY** → Employees (1:1)
- **OFFERS** → Food Items (1:M)
- **GENERATES** → Food Sales (1:M)

### 9. FOOD_ITEMS (Weak Entity)
**Depends on:** Food Services
**Attributes:**
- food_item_id (PK)
- name, description
- category, price, cost
- calories, allergens

**Relationships:**
- **OFFERED_BY** → Food Services (M:1)
- **INCLUDED_IN** → Food Sales (M:M)

### 10. EVENTS (Strong Entity)
**Attributes:**
- event_id (PK)
- name, description
- event_date, start_time
- location, max_participants
- ticket_price

**Relationships:**
- **COORDINATED_BY** → Employees (M:1)
- **ATTENDED_BY** → Customers (M:M)

## Business Rules & Constraints

### Animal Management
1. Each animal MUST have exactly one primary keeper
2. A keeper can care for MANY animals (0 to many)
3. Animals can be in only ONE habitat at a time
4. Medical records are append-only (never deleted)

### Employee Rules
1. Employees can work in only ONE department
2. Managers can manage MULTIPLE services
3. Each service MUST have at least one manager
4. Salary changes require manager approval

### Customer & Sales
1. Customers can purchase MULTIPLE tickets
2. Each ticket is valid for ONE specific date
3. Membership discounts apply automatically
4. Children under 3 enter free (no ticket required)

### Inventory Management
1. Items below reorder_level trigger automatic alerts
2. Each sale MUST reference existing inventory
3. Returns allowed within 30 days with receipt
4. Perishable food items tracked separately

### Financial Constraints
1. All sales MUST have payment method
2. Daily revenue calculated at closing time
3. Refunds require manager authorization
4. Gift cards have 2-year expiration

## Cardinality Specifications

| Relationship | Cardinality | Participation |
|-------------|-------------|---------------|
| Employee CARES_FOR Animal | 1:M | Partial:Total |
| Customer PURCHASES Ticket | 1:M | Partial:Partial |
| Customer BUYS Gift_Item | M:M | Partial:Partial |
| Ticket ADMITS_TO Attraction | M:M | Total:Partial |
| Employee MANAGES Food_Service | 1:1 | Partial:Total |
| Food_Service OFFERS Food_Item | 1:M | Total:Total |
| Customer REGISTERS Event | M:M | Partial:Partial |
| Animal LIVES_IN Habitat | M:1 | Total:Total |

## Functional Dependencies

### Animals Table
- animal_id → {name, species, breed, date_of_birth, keeper_id}
- keeper_id → {employee_first_name, employee_last_name}

### Tickets Table
- ticket_id → {customer_id, purchase_date, visit_date, price}
- customer_id → {customer_name, email, membership_type}
- membership_type → discount_percentage

### Sales Tables
- sale_id → {customer_id, sale_date, total_amount, employee_id}
- item_id → {item_name, price, category}
- (sale_id, item_id) → quantity

## Normalization Level

All tables are in **3NF** (Third Normal Form):
- No repeating groups (1NF ✓)
- No partial dependencies (2NF ✓)
- No transitive dependencies (3NF ✓)

## Sample Queries & Operations

### Revenue Calculation
```sql
-- Daily revenue from all sources
SELECT 
    DATE(t.purchase_date) as date,
    SUM(t.price) as ticket_revenue,
    (SELECT SUM(total_amount) 
     FROM gift_shop_sales 
     WHERE DATE(sale_date) = DATE(t.purchase_date)) as gift_revenue,
    (SELECT SUM(total_amount) 
     FROM food_sales 
     WHERE DATE(sale_date) = DATE(t.purchase_date)) as food_revenue
FROM tickets t
GROUP BY DATE(t.purchase_date);
```

### Animal-Keeper Assignment
```sql
-- Find all animals and their keepers
SELECT 
    a.name as animal_name,
    a.species,
    e.first_name + ' ' + e.last_name as keeper_name,
    e.department
FROM animals a
JOIN employees e ON a.keeper_id = e.employee_id
WHERE a.status = 'active';
```

### Inventory Alert
```sql
-- Items needing reorder
SELECT 
    item_id,
    name,
    quantity_in_stock,
    reorder_level
FROM gift_shop_items
WHERE quantity_in_stock <= reorder_level;
```

## Transaction Examples

### Ticket Purchase Transaction
1. BEGIN TRANSACTION
2. Insert customer record (if new)
3. Create ticket record
4. Update daily sales counter
5. Process payment
6. Generate confirmation
7. COMMIT

### Animal Transfer Transaction
1. BEGIN TRANSACTION
2. Update animal status to 'transferred'
3. Create transfer record
4. Update habitat availability
5. Notify new keeper
6. Update medical records
7. COMMIT

## Referential Integrity Actions

| Foreign Key | ON DELETE | ON UPDATE |
|------------|-----------|-----------|
| animal.keeper_id | SET NULL | CASCADE |
| ticket.customer_id | RESTRICT | CASCADE |
| gift_shop_sale.customer_id | SET NULL | CASCADE |
| gift_shop_sale.employee_id | RESTRICT | CASCADE |
| food_sale.customer_id | SET NULL | CASCADE |
| event_registration.event_id | CASCADE | CASCADE |

## Performance Optimization

### Indexes Created
- ticket.visit_date (frequent date queries)
- animal.species (species reports)
- customer.email (login/lookup)
- gift_shop_sales.sale_date (daily reports)
- food_sales.sale_date (revenue tracking)

### Views for Reporting
- daily_revenue_summary
- animal_health_status
- employee_schedule
- inventory_status
- customer_visit_history

## Security Considerations

### Access Levels
1. **Public** - View attractions, events, prices
2. **Customer** - Purchase tickets, view own history
3. **Employee** - Process sales, update inventory
4. **Keeper** - Update animal records
5. **Manager** - All operations, reports, refunds
6. **Admin** - Database maintenance, user management

### Sensitive Data
- Employee salaries (encrypted)
- Customer payment info (not stored, tokenized)
- Medical records (audit trail required)
- Financial reports (role-based access)