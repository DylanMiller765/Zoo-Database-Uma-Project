# Implementation Plan: Zoo Management System Refactors

## Overview
This document outlines the implementation plan for three major refactors to the Zoo Management System:

1. **Animal Assignment Management** - Allow managers to assign animals to keepers/vets
2. **Event Cancellation Policy** - Remove event restoration capability (refunds already processed)
3. **Transaction Refund Tracking** - Reflect refunds in transactions and financial reports

---

## 1. Animal Assignment Management

### Current State
- ✅ `zookeeper_assignments` table exists with keeper-to-animal relationships
- ✅ Backend has READ endpoints for assignments
- ❌ No UI for managers to create/modify assignments
- ❌ No CREATE/DELETE endpoints in backend

### Proposed Solution
Create a dedicated **"Assignments"** admin tab where managers can:
- View all keeper/vet assignments in a table
- Assign animals to keepers/veterinarians
- Remove assignments
- Filter by keeper, animal, or assignment date

### Implementation Steps

#### Backend Changes

**1. Add Assignment CRUD Endpoints** (`backend/src/controllers/zookeeperAssignment.controller.ts`)
- `POST /api/zookeeper-assignments` - Create new assignment
  - Body: `{ keeper_id, animal_id }`
  - Validation: Check keeper exists, animal exists, no duplicate
  - Only managers can create
- `DELETE /api/zookeeper-assignments/:id` - Remove assignment
  - Only managers can delete

**2. Update Routes** (`backend/src/routes/zookeeperAssignment.routes.ts`)
```typescript
router.post('/', protect, restrictTo('manager'), create);
router.delete('/:id', protect, restrictTo('manager'), remove);
```

**3. Enhance Service** (`backend/src/services/zookeeperAssignment.service.ts`)
- Add `create(keeper_id, animal_id)` method
- Add `delete(assignment_id)` method
- Add validation for duplicate assignments

#### Frontend Changes

**1. Create New Admin Page** (`frontend/src/app/admin/assignments/page.tsx`)
- Table showing: Keeper Name, Animal Name, Species, Assigned Date, Actions
- Search/filter by keeper name or animal name
- "Add Assignment" button opening modal
- "Remove" button for each row (with confirmation)

**2. Create Assignment Components**
- `frontend/src/components/admin/AssignmentForm.tsx` - Modal form with:
  - Keeper dropdown (fetch keepers + vets via employees API filtered by job_role)
  - Animal dropdown (fetch active animals)
  - Submit creates assignment
- `frontend/src/components/admin/AssignmentTable.tsx` - Reusable table component

**3. Add Service Functions** (`frontend/src/services/assignment.service.ts`)
```typescript
export const assignmentService = {
  getAll: () => apiClient.get('/zookeeper-assignments'),
  create: (keeper_id, animal_id) => apiClient.post('/zookeeper-assignments', { keeper_id, animal_id }),
  delete: (id) => apiClient.delete(`/zookeeper-assignments/${id}`)
};
```

**4. Update Sidebar Navigation** (`frontend/src/components/admin/Sidebar.tsx`)
- Add "Assignments" menu item (icon: UserCog or ClipboardList)
- Restrict to manager role only

### Database Considerations
- Existing `zookeeper_assignments` table already has unique constraint on (keeper_id, animal_id) ✅
- No schema changes needed ✅

---

## 2. Event Cancellation Policy Changes

### Current State
- ✅ Events have soft delete (`deleted_at` column)
- ✅ `event_cancellation_logs` tracks cancellations via trigger
- ✅ Frontend can restore cancelled events via `restore()` API
- ❌ Restoration should NOT be allowed (refunds already processed)

### Proposed Solution
- **Keep** soft delete functionality (managers need to see cancelled events in history)
- **Remove** restore capability from both backend and frontend
- **Keep** event cancellation logs and dashboard widget

### Implementation Steps

#### Backend Changes

**1. Remove or Disable Restore Method** (`backend/src/services/event.service.ts`)

**Option A: Remove entirely**
- Delete `restore()` method from EventService
- Remove restore route from `backend/src/routes/event.routes.ts`

**Option B: Disable with business logic** (RECOMMENDED)
```typescript
async restore(id: number): Promise<void> {
  throw new Error('Events cannot be restored once cancelled. Refunds have already been processed. Please create a new event instead.');
}
```

**Recommendation**: Option B provides better user feedback if someone tries to restore via API

**2. Update Route** (`backend/src/routes/event.routes.ts`)
- Remove `router.patch('/:id/restore', protect, restrictTo('manager', 'coordinator'), restore);`

#### Frontend Changes

**1. Remove Restore Button** (`frontend/src/app/admin/events/page.tsx`)
- Remove restore button from deleted events view
- Keep "View Deleted" toggle so managers can see cancellation history
- Update UI to show cancelled events as read-only

**2. Add Helpful Message**
- When viewing deleted events, show info banner:
  - "Cancelled events cannot be restored as refunds have been processed. To reschedule, create a new event."

### Database Considerations
- No schema changes needed ✅
- `event_cancellation_logs` continues to track cancellations ✅

---

## 3. Transaction Refund Tracking System

### Current State
- ❌ When events are cancelled, event_registrations still show as normal transactions
- ❌ No way to mark individual transactions as refunded
- ❌ Financial reports don't account for refunds
- ❌ Transactions page doesn't distinguish refunded transactions

### Problem Analysis
The current system has 6 transaction types:
1. **Tickets** - Admission tickets
2. **Event Registrations** - Special events (linked to events table)
3. **Gift Shop Sales** - Merchandise
4. **Cafe Sales** - Food/beverage
5. **Donations** - Cannot be refunded
6. **Memberships** - Annual passes (refund policy unclear)

**Refund Scenarios**:
- **Automatic Refunds**: When manager cancels an event → all event_registrations for that event should be refunded
- **Manual Refunds**: Manager can refund individual tickets, gift shop sales, cafe sales

### Proposed Solution: Multi-Phase Refund System

#### Phase 1: Event Registration Auto-Refunds (Highest Priority)

**Database Changes**:
```sql
ALTER TABLE event_registrations ADD COLUMN refunded_at DATETIME DEFAULT NULL;
ALTER TABLE event_registrations ADD COLUMN refund_reason VARCHAR(255) DEFAULT NULL;
```

**Backend Logic**:
- When event is soft-deleted, automatically mark all related event_registrations as refunded
- Modify `event.service.ts → deleteEvent()` to also update event_registrations:
  ```typescript
  await query('UPDATE event_registrations SET refunded_at = NOW(), refund_reason = ? WHERE event_id = ?',
    [`Event cancelled by ${employeeName}`, eventId]);
  ```

#### Phase 2: Manual Transaction Refunds

**Database Changes**:
```sql
ALTER TABLE tickets ADD COLUMN refunded_at DATETIME DEFAULT NULL;
ALTER TABLE tickets ADD COLUMN refund_reason VARCHAR(255) DEFAULT NULL;
ALTER TABLE tickets ADD COLUMN refunded_by INT DEFAULT NULL;
ALTER TABLE tickets ADD FOREIGN KEY (refunded_by) REFERENCES employees(employee_id);

ALTER TABLE gift_shop_sales_transactions ADD COLUMN refunded_at DATETIME DEFAULT NULL;
ALTER TABLE gift_shop_sales_transactions ADD COLUMN refund_reason VARCHAR(255) DEFAULT NULL;
ALTER TABLE gift_shop_sales_transactions ADD COLUMN refunded_by INT DEFAULT NULL;
ALTER TABLE gift_shop_sales_transactions ADD FOREIGN KEY (refunded_by) REFERENCES employees(employee_id);

ALTER TABLE cafe_sales ADD COLUMN refunded_at DATETIME DEFAULT NULL;
ALTER TABLE cafe_sales ADD COLUMN refund_reason VARCHAR(255) DEFAULT NULL;
ALTER TABLE cafe_sales ADD COLUMN refunded_by INT DEFAULT NULL;
ALTER TABLE cafe_sales ADD FOREIGN KEY (refunded_by) REFERENCES employees(employee_id);

-- Memberships: Add refund support (if applicable to business rules)
ALTER TABLE membership_purchases ADD COLUMN refunded_at DATETIME DEFAULT NULL;
ALTER TABLE membership_purchases ADD COLUMN refund_reason VARCHAR(255) DEFAULT NULL;
ALTER TABLE membership_purchases ADD COLUMN refunded_by INT DEFAULT NULL;
ALTER TABLE membership_purchases ADD FOREIGN KEY (refunded_by) REFERENCES employees(employee_id);
```

**Note**: Donations should NOT support refunds (charity principle)

#### Phase 3: Backend Refund Endpoints

**Create Unified Refund Controller** (`backend/src/controllers/refund.controller.ts`)
```typescript
export class RefundController {
  async refundTransaction(req: Request, res: Response) {
    const { transactionType, transactionId, reason } = req.body;
    const employeeId = req.user.employee_id;

    // Validate manager role
    // Call appropriate service method based on transactionType
    // Return success/error
  }
}
```

**Routes** (`backend/src/routes/refund.routes.ts`)
```typescript
router.post('/refund', protect, restrictTo('manager'), refundTransaction);
```

**Service Methods** (Add to respective services):
- `ticket.service.ts → refundTicket(ticketId, reason, employeeId)`
- `giftShop.service.ts → refundSale(transactionId, reason, employeeId)`
- `cafe.service.ts → refundSale(saleId, reason, employeeId)`
- `event.service.ts → refundRegistration(registrationId, reason, employeeId)` (for manual refunds)

#### Phase 4: Update Transaction Service

**Modify** `backend/src/services/transaction.service.ts`:

1. **Add refund fields to UnifiedTransaction type** (`backend/src/types/transaction.types.ts`):
```typescript
export interface UnifiedTransaction {
  // existing fields...
  refunded_at?: Date;
  refund_reason?: string;
  refunded_by?: string; // employee name
}
```

2. **Update each transaction getter to include refund data**:
```typescript
// Example for tickets
private static async getTickets(startDate?: string, endDate?: string): Promise<UnifiedTransaction[]> {
  const query = `
    SELECT
      t.ticket_id as transaction_id,
      t.purchase_date as date,
      t.price as total,
      c.first_name as customer_first_name,
      c.last_name as customer_last_name,
      e.first_name as employee_first_name,
      e.last_name as employee_last_name,
      t.refunded_at,
      t.refund_reason,
      re.first_name as refunded_by_first_name,
      re.last_name as refunded_by_last_name,
      'Ticket' as type
    FROM tickets t
    LEFT JOIN customers c ON t.customer_id = c.customer_id
    LEFT JOIN employees e ON t.sold_by = e.employee_id
    LEFT JOIN employees re ON t.refunded_by = re.employee_id
    WHERE 1=1
      ${startDate ? 'AND t.purchase_date >= ?' : ''}
      ${endDate ? 'AND t.purchase_date <= ?' : ''}
  `;
  // ... execute and map
}
```

3. **Repeat for all transaction types** (event_registrations, gift_shop, cafe, memberships)

#### Phase 5: Frontend Transaction Page Updates

**Update** `frontend/src/app/admin/transactions/page.tsx`:

1. **Visual Distinction for Refunded Transactions**:
```typescript
<TableRow className={transaction.refunded_at ? 'bg-red-50 opacity-75' : ''}>
  <TableCell>
    {transaction.type}
    {transaction.refunded_at && (
      <Badge variant="destructive" className="ml-2">REFUNDED</Badge>
    )}
  </TableCell>
  {/* ... other cells ... */}
  <TableCell className={transaction.refunded_at ? 'line-through' : ''}>
    ${transaction.total}
  </TableCell>
</TableRow>
```

2. **Add Refund Action**:
```typescript
{!transaction.refunded_at && transaction.type !== 'Donation' && (
  <Button
    variant="destructive"
    size="sm"
    onClick={() => handleRefund(transaction)}
  >
    Refund
  </Button>
)}
```

3. **Refund Modal Component** (`frontend/src/components/admin/RefundTransactionModal.tsx`):
- Input field for refund reason
- Confirmation dialog
- Calls refund API endpoint

4. **Add Filter for Refunded Transactions**:
- "Show Refunded" toggle
- Filter dropdown: "All" | "Active Only" | "Refunded Only"

#### Phase 6: Financial Report Updates

**Update** `backend/src/services/query.service.ts`:

**For each revenue method, modify queries to:**

1. **Calculate gross revenue** (total before refunds)
2. **Calculate refunds** (sum of refunded transactions)
3. **Calculate net revenue** (gross - refunds)

**Example for Ticket Revenue** (modify lines 220-260):
```typescript
static async getTicketRevenue(startDate?: string, endDate?: string) {
  // Existing query for gross revenue...

  // NEW: Add refund calculation
  const refundQuery = `
    SELECT
      COALESCE(SUM(price), 0) as total_refunds,
      COUNT(*) as refund_count
    FROM tickets
    WHERE refunded_at IS NOT NULL
      ${startDate ? 'AND purchase_date >= ?' : ''}
      ${endDate ? 'AND purchase_date <= ?' : ''}
  `;

  const [refundResults] = await query<any[]>(refundQuery, params);

  return {
    gross_revenue: ticketResults[0].total,
    refunds: refundResults[0].total_refunds,
    net_revenue: ticketResults[0].total - refundResults[0].total_refunds,
    transactions: ticketResults[0].transaction_count,
    refund_count: refundResults[0].refund_count,
    byType: [...],
    byPaymentMethod: [...]
  };
}
```

2. **Repeat for all revenue sources**:
- Event Revenue
- Gift Shop Revenue
- Cafe Revenue
- Membership Revenue

3. **Update Master Financial Report** (lines 445-512):
```typescript
const summary = {
  gross_revenue: totalGross,
  total_refunds: totalRefunds,
  net_revenue: totalGross - totalRefunds,
  transaction_count: totalTransactions,
  refund_count: totalRefundCount,
  // ...
};
```

#### Phase 7: Frontend Financial Report Updates

**Update** `frontend/src/app/admin/queries/financial-report/page.tsx`:

1. **Summary Card Enhancement**:
```typescript
<Card>
  <CardHeader>Financial Summary</CardHeader>
  <CardContent>
    <div className="space-y-2">
      <div className="flex justify-between">
        <span>Gross Revenue:</span>
        <span className="font-semibold">${report.summary.gross_revenue}</span>
      </div>
      <div className="flex justify-between text-red-600">
        <span>Total Refunds:</span>
        <span className="font-semibold">-${report.summary.total_refunds}</span>
      </div>
      <Separator />
      <div className="flex justify-between text-lg font-bold">
        <span>Net Revenue:</span>
        <span className="text-green-600">${report.summary.net_revenue}</span>
      </div>
    </div>
  </CardContent>
</Card>
```

2. **Update Revenue Section Components**:

Each section component (TicketRevenueSection, EventRevenueSection, etc.) should display:
- Gross revenue
- Refunds (in red)
- Net revenue (highlighted)

**Example** (`frontend/src/components/reports/TicketRevenueSection.tsx`):
```typescript
export function TicketRevenueSection({ data }) {
  return (
    <Card>
      <CardHeader>Ticket Revenue</CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-600">Gross Revenue</p>
            <p className="text-2xl font-semibold">${data.gross_revenue}</p>
          </div>
          <div>
            <p className="text-sm text-red-600">Refunds</p>
            <p className="text-2xl font-semibold text-red-600">-${data.refunds}</p>
            <p className="text-xs text-gray-500">{data.refund_count} refunds</p>
          </div>
          <div>
            <p className="text-sm text-green-600">Net Revenue</p>
            <p className="text-2xl font-semibold text-green-600">${data.net_revenue}</p>
          </div>
        </div>
        {/* Existing breakdown tables... */}
      </CardContent>
    </Card>
  );
}
```

---

## Implementation Order & Priority

### High Priority (Do First)
1. ✅ **Animal Assignment Management** - Straightforward, no breaking changes
2. ✅ **Event Cancellation Policy** - Simple removal of restore feature

### Medium Priority
3. ✅ **Event Registration Auto-Refunds** - Critical for business logic

### Lower Priority (Can be phased)
4. ⏳ **Manual Transaction Refunds** - Nice to have, can iterate
5. ⏳ **Financial Report Refund Display** - Depends on refund tracking

---

## Potential Issues & Considerations

### 1. Historical Data
**Question**: What about existing cancelled events?
- **Answer**: Run migration script to mark all event_registrations for deleted events as refunded retroactively

### 2. Partial Refunds
**Question**: What if only some attendees of an event need refunds?
- **Answer**: Current plan supports this via manual refund of individual event_registrations

### 3. Membership Refunds
**Question**: Should annual passes be refundable?
- **Answer**: Business decision needed. If yes, add refund columns. If no, exclude from refund UI.
- **Recommendation**: Memberships should have a grace period (e.g., 7 days) for refunds

### 4. Gift Shop Returns
**Question**: Existing `return_amount` in gift shop - is this different from refunds?
- **Answer**: Likely tracking product returns (inventory). Refunds are transaction-level. Keep both.

### 5. Refund Permissions
**Question**: Who can issue refunds?
- **Answer**: Currently set to managers only. Could also allow coordinators for event refunds, cashiers for ticket/gift shop refunds.

### 6. Accounting Integration
**Question**: Do refunds need to be exported for accounting?
- **Answer**: Consider adding a refund report endpoint: `GET /api/reports/refunds?startDate&endDate`

---

## Database Migration Scripts

### Script 1: Add Refund Columns
```sql
-- Event Registrations (auto-refunded on event cancellation)
ALTER TABLE event_registrations
  ADD COLUMN refunded_at DATETIME DEFAULT NULL,
  ADD COLUMN refund_reason VARCHAR(255) DEFAULT NULL;

-- Tickets (manual refunds)
ALTER TABLE tickets
  ADD COLUMN refunded_at DATETIME DEFAULT NULL,
  ADD COLUMN refund_reason VARCHAR(255) DEFAULT NULL,
  ADD COLUMN refunded_by INT DEFAULT NULL,
  ADD FOREIGN KEY (refunded_by) REFERENCES employees(employee_id);

-- Gift Shop Sales (manual refunds)
ALTER TABLE gift_shop_sales_transactions
  ADD COLUMN refunded_at DATETIME DEFAULT NULL,
  ADD COLUMN refund_reason VARCHAR(255) DEFAULT NULL,
  ADD COLUMN refunded_by INT DEFAULT NULL,
  ADD FOREIGN KEY (refunded_by) REFERENCES employees(employee_id);

-- Cafe Sales (manual refunds)
ALTER TABLE cafe_sales
  ADD COLUMN refunded_at DATETIME DEFAULT NULL,
  ADD COLUMN refund_reason VARCHAR(255) DEFAULT NULL,
  ADD COLUMN refunded_by INT DEFAULT NULL,
  ADD FOREIGN KEY (refunded_by) REFERENCES employees(employee_id);

-- Memberships (optional - business decision)
ALTER TABLE membership_purchases
  ADD COLUMN refunded_at DATETIME DEFAULT NULL,
  ADD COLUMN refund_reason VARCHAR(255) DEFAULT NULL,
  ADD COLUMN refunded_by INT DEFAULT NULL,
  ADD FOREIGN KEY (refunded_by) REFERENCES employees(employee_id);
```

### Script 2: Retroactive Event Refunds
```sql
-- Mark all event_registrations for deleted events as refunded
UPDATE event_registrations er
JOIN events e ON er.event_id = e.event_id
SET
  er.refunded_at = e.deleted_at,
  er.refund_reason = 'Event cancelled'
WHERE e.deleted_at IS NOT NULL
  AND er.refunded_at IS NULL;
```

---

## Testing Checklist

### Animal Assignments
- [ ] Manager can view all assignments
- [ ] Manager can create new assignment (keeper + vet)
- [ ] Duplicate assignments are prevented
- [ ] Manager can delete assignment
- [ ] Non-managers cannot access assignments page
- [ ] Assignments appear on keeper/vet dashboards

### Event Cancellation
- [ ] Manager can cancel event (soft delete)
- [ ] Restore button is removed from UI
- [ ] API restore endpoint is disabled/removed
- [ ] Cancelled events visible in "View Deleted" mode
- [ ] Event cancellation logs are created
- [ ] Dashboard widget shows cancelled events

### Transaction Refunds
- [ ] Cancelling event auto-refunds all registrations
- [ ] Refunded event registrations show on transactions page with red background
- [ ] Manager can manually refund ticket
- [ ] Manager can manually refund gift shop sale
- [ ] Manager can manually refund cafe sale
- [ ] Donations cannot be refunded
- [ ] Refund reason is required
- [ ] Refund is recorded with employee who issued it
- [ ] Financial reports show gross/refund/net breakdown
- [ ] Historical cancelled events marked as refunded

---

## Questions for Clarification

1. **Membership Refunds**: Should annual passes be refundable? If yes, what's the policy (time limit, partial refund)?

2. **Refund Permissions**: Should roles other than managers be able to issue refunds?
   - Coordinators for event refunds?
   - Cashiers for ticket/gift shop refunds?

3. **Partial Event Refunds**: If an event is cancelled but some attendees already attended (e.g., multi-day event), how should this be handled?

4. **Refund Reporting**: Do you need a dedicated refund report separate from financial reports?

5. **Customer Notifications**: Should customers be notified when they receive refunds? (Email integration?)

---

## Summary

This implementation plan addresses all three requirements:

1. ✅ **Animal Assignments**: New admin tab with full CRUD for manager-controlled assignments
2. ✅ **Event Restoration**: Removed, with clear messaging to create new events instead
3. ✅ **Transaction Refunds**: Comprehensive system with:
   - Auto-refunds when events cancelled
   - Manual refund capability for tickets, gift shop, cafe
   - Visual distinction on transactions page
   - Financial reports showing gross/refund/net revenue

The plan is designed to be implemented incrementally, with high-priority changes first. All changes maintain data integrity and provide audit trails via employee tracking and refund reasons.
