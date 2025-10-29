# Membership Expiration Notification System

## Overview

This document describes the membership expiration notification system implemented for the Zoo Database Management System. The system automatically notifies users when their annual membership is about to expire and provides a simple mechanism for tracking membership dates.

## Features

### 1. **Database Schema Enhancements**
- Added `membership_start_date` and `membership_end_date` columns to the `customers` table
- Created a new `notifications` table to store user notifications
- Notifications support three types: `info`, `warning`, and `alert`

### 2. **Automated Trigger System**
- **Stored Procedure**: `check_expiring_memberships()` checks for memberships expiring within 30 days
- **Scheduled Event**: Runs daily at midnight to automatically create notifications
- **Auto-Expiration**: Automatically sets `annual_pass` to 'no' when membership expires
- **Duplicate Prevention**: Avoids creating duplicate notifications within a 7-day window

### 3. **Backend API Endpoints**
New endpoints added at `/api/notifications`:
- `GET /api/notifications` - Get all notifications (supports `?unread=true` parameter)
- `GET /api/notifications/unread-count` - Get count of unread notifications
- `PUT /api/notifications/:id/read` - Mark a specific notification as read
- `PUT /api/notifications/mark-all-read` - Mark all notifications as read
- `DELETE /api/notifications/:id` - Delete a notification

### 4. **Frontend Components**
- **NotificationBanner**: Displays unread notifications at the top of the website
- Auto-dismissible notifications with visual styling based on type
- Direct link to membership renewal page
- Smooth slide-down animation

## Database Schema

### Modified: `customers` table
```sql
ALTER TABLE customers
ADD COLUMN membership_start_date DATE DEFAULT NULL,
ADD COLUMN membership_end_date DATE DEFAULT NULL;
```

### New: `notifications` table
```sql
CREATE TABLE notifications (
    notification_id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NOT NULL,
    message VARCHAR(500) NOT NULL,
    notification_type ENUM('info', 'warning', 'alert') DEFAULT 'info',
    is_read BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE,
    INDEX idx_customer_unread (customer_id, is_read),
    INDEX idx_created_at (created_at)
);
```

## Installation & Setup

### Step 1: Apply Database Migration

You can apply the changes in two ways:

**Option A: Run the migration script**
```bash
mysql -h nozomi.proxy.rlwy.net -P 43756 -u root -p zoo_database < database/migrations/add_membership_notifications.sql
```

**Option B: Rebuild from schema**
```bash
mysql -h nozomi.proxy.rlwy.net -P 43756 -u root -p zoo_database < database/zoo_schema.sql
```

### Step 2: Enable MySQL Event Scheduler

The trigger system requires the MySQL Event Scheduler to be enabled:

```sql
SET GLOBAL event_scheduler = ON;
```

To verify it's running:
```sql
SELECT @@event_scheduler;
-- Should return 'ON'

SHOW EVENTS LIKE 'daily_membership_check';
-- Should show the scheduled event
```

### Step 3: Install Dependencies

No new dependencies are required. The system uses existing packages.

### Step 4: Restart Backend Server

```bash
cd backend
npm run dev
```

### Step 5: Test the Frontend

```bash
cd frontend
npm run dev
```

## Testing the System

### Manual Testing

#### 1. Create a test membership that expires soon:
```sql
-- Create a membership expiring in 15 days
UPDATE customers
SET
    annual_pass = 'yes',
    membership_start_date = DATE_SUB(CURDATE(), INTERVAL 350 DAYS),
    membership_end_date = DATE_ADD(CURDATE(), INTERVAL 15 DAYS)
WHERE customer_id = 1;
```

#### 2. Manually trigger the stored procedure:
```sql
CALL check_expiring_memberships();
```

#### 3. Verify notification was created:
```sql
SELECT * FROM notifications WHERE customer_id = 1;
```

#### 4. Log in as that customer and check the website
- A notification banner should appear at the top with the expiration warning
- Click the "Renew membership →" link to go to the membership page
- Click the X button to dismiss the notification

### Testing Auto-Expiration

```sql
-- Create an already expired membership
UPDATE customers
SET
    annual_pass = 'yes',
    membership_end_date = DATE_SUB(CURDATE(), INTERVAL 1 DAY)
WHERE customer_id = 2;

-- Run the procedure
CALL check_expiring_memberships();

-- Verify annual_pass is now 'no'
SELECT customer_id, annual_pass, membership_end_date
FROM customers
WHERE customer_id = 2;
```

## How It Works

### The Trigger Flow

1. **Daily Check (Midnight)**
   - MySQL Event Scheduler runs `daily_membership_check` event
   - Event calls the `check_expiring_memberships()` stored procedure

2. **Procedure Logic**
   - Finds all customers with `annual_pass = 'yes'`
   - Checks if `membership_end_date` is between 1-30 days from now
   - Creates a notification if one doesn't already exist (within 7 days)
   - Also marks expired memberships (`annual_pass = 'no'`)

3. **Frontend Display**
   - `NotificationBanner` component fetches unread notifications on mount
   - Displays them at the top of the page with appropriate styling
   - Users can dismiss notifications, which marks them as read

### Notification Types

- **warning** (⚠️): Used for membership expiration warnings (yellow background)
- **info** (ℹ️): For general informational messages (blue background)
- **alert** (🚨): For urgent/critical messages (red background)

## Extending Memberships

Currently, the system doesn't have an automated renewal system. To extend a membership:

### Option 1: Manual Update (Admin)
```sql
UPDATE customers
SET
    membership_start_date = CURDATE(),
    membership_end_date = DATE_ADD(CURDATE(), INTERVAL 1 YEAR),
    annual_pass = 'yes'
WHERE customer_id = <customer_id>;
```

### Option 2: Future Enhancement
In a production system, you would:
1. Add a "Renew Membership" button on the membership page
2. Integrate with a payment processor
3. Upon successful payment, update the `membership_end_date` field
4. Send a confirmation notification

## Files Modified/Created

### Backend
- `database/zoo_schema.sql` - Updated schema with new tables and trigger
- `database/migrations/add_membership_notifications.sql` - Migration file
- `backend/src/models/customer.model.ts` - Added new fields
- `backend/src/models/notification.model.ts` - NEW
- `backend/src/services/notification.service.ts` - NEW
- `backend/src/controllers/notification.controller.ts` - NEW
- `backend/src/routes/notification.routes.ts` - NEW
- `backend/src/server.ts` - Registered notification routes

### Frontend
- `frontend/src/services/notification.service.ts` - NEW
- `frontend/src/components/NotificationBanner.tsx` - NEW
- `frontend/src/app/layout.tsx` - Added NotificationBanner
- `frontend/src/app/globals.css` - Added animation styles

## Database Queries for Monitoring

### Check all active memberships
```sql
SELECT
    customer_id,
    CONCAT(first_name, ' ', last_name) as name,
    membership_start_date,
    membership_end_date,
    DATEDIFF(membership_end_date, CURDATE()) as days_remaining
FROM customers
WHERE annual_pass = 'yes'
ORDER BY membership_end_date;
```

### View all notifications
```sql
SELECT
    n.notification_id,
    CONCAT(c.first_name, ' ', c.last_name) as customer_name,
    n.message,
    n.notification_type,
    n.is_read,
    n.created_at
FROM notifications n
JOIN customers c ON n.customer_id = c.customer_id
ORDER BY n.created_at DESC;
```

### Check event scheduler status
```sql
SELECT @@event_scheduler;
SHOW EVENTS;
```

## Troubleshooting

### Notifications not appearing?

1. **Check if event scheduler is ON**
   ```sql
   SELECT @@event_scheduler;
   ```

2. **Manually run the procedure**
   ```sql
   CALL check_expiring_memberships();
   ```

3. **Check for errors in MySQL logs**

4. **Verify customer has token and is logged in** (frontend requirement)

### Event not running?

- Ensure `event_scheduler` is enabled globally
- Check that the event exists: `SHOW EVENTS;`
- Verify Railway MySQL has permissions for events
- Check MySQL error logs

## Future Enhancements

1. **Auto-Renewal System**
   - Payment integration (Stripe, PayPal)
   - Opt-in auto-renewal checkbox
   - Email notifications (in addition to website)

2. **Email Notifications**
   - Send email when membership is expiring
   - Confirmation emails for renewals

3. **Admin Dashboard**
   - View expiring memberships
   - Send custom notifications
   - Bulk renewal processing

4. **Grace Period**
   - Allow 7-day grace period after expiration
   - Soft delete vs hard delete of membership status

## Notes

- This is a **simple trigger system** suitable for a student project
- The stored procedure runs once daily - notifications appear the next day after a membership enters the 30-day window
- For production use, consider adding email notifications and a more robust payment system
- The system prevents duplicate notifications within 7 days to avoid spam

## Questions?

Contact the development team or refer to the main README.md for general setup instructions.
