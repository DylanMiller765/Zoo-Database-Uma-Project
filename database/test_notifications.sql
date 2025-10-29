-- Test Script for Membership Notification System
-- Run this script to test the notification trigger functionality

USE zoo_database;

-- ==========================
-- Step 1: View Current Memberships
-- ==========================
SELECT 'Current Active Memberships:' as status;
SELECT
    customer_id,
    CONCAT(first_name, ' ', last_name) as customer_name,
    email,
    annual_pass,
    membership_start_date,
    membership_end_date,
    CASE
        WHEN membership_end_date IS NULL THEN 'No expiration set'
        WHEN DATEDIFF(membership_end_date, CURDATE()) < 0 THEN 'EXPIRED'
        WHEN DATEDIFF(membership_end_date, CURDATE()) BETWEEN 0 AND 30 THEN CONCAT('Expires in ', DATEDIFF(membership_end_date, CURDATE()), ' days')
        ELSE CONCAT('Expires in ', DATEDIFF(membership_end_date, CURDATE()), ' days')
    END as status
FROM customers
WHERE annual_pass = 'yes';

-- ==========================
-- Step 2: Create Test Customers with Various Expiration Scenarios
-- ==========================
SELECT '\nCreating test membership scenarios...' as status;

-- Scenario 1: Membership expiring in 15 days (should trigger warning)
UPDATE customers
SET
    annual_pass = 'yes',
    membership_start_date = DATE_SUB(CURDATE(), INTERVAL 350 DAYS),
    membership_end_date = DATE_ADD(CURDATE(), INTERVAL 15 DAYS)
WHERE customer_id = 1
LIMIT 1;

-- Scenario 2: Membership expiring in 5 days (should trigger warning)
UPDATE customers
SET
    annual_pass = 'yes',
    membership_start_date = DATE_SUB(CURDATE(), INTERVAL 360 DAYS),
    membership_end_date = DATE_ADD(CURDATE(), INTERVAL 5 DAYS)
WHERE customer_id = 2
LIMIT 1;

-- Scenario 3: Membership already expired (should auto-expire)
UPDATE customers
SET
    annual_pass = 'yes',
    membership_start_date = DATE_SUB(CURDATE(), INTERVAL 366 DAYS),
    membership_end_date = DATE_SUB(CURDATE(), INTERVAL 1 DAY)
WHERE customer_id = 3
LIMIT 1;

-- Scenario 4: Membership expiring in 60 days (should NOT trigger warning yet)
UPDATE customers
SET
    annual_pass = 'yes',
    membership_start_date = DATE_SUB(CURDATE(), INTERVAL 305 DAYS),
    membership_end_date = DATE_ADD(CURDATE(), INTERVAL 60 DAYS)
WHERE customer_id = 4
LIMIT 1;

-- ==========================
-- Step 3: Run the stored procedure manually
-- ==========================
SELECT '\nRunning check_expiring_memberships procedure...' as status;
CALL check_expiring_memberships();

-- ==========================
-- Step 4: View results
-- ==========================
SELECT '\nCustomers after procedure ran:' as status;
SELECT
    customer_id,
    CONCAT(first_name, ' ', last_name) as customer_name,
    annual_pass,
    membership_end_date,
    DATEDIFF(membership_end_date, CURDATE()) as days_until_expiration
FROM customers
WHERE customer_id IN (1, 2, 3, 4)
ORDER BY customer_id;

SELECT '\nNotifications created:' as status;
SELECT
    n.notification_id,
    n.customer_id,
    CONCAT(c.first_name, ' ', c.last_name) as customer_name,
    n.message,
    n.notification_type,
    n.is_read,
    n.created_at
FROM notifications n
JOIN customers c ON n.customer_id = c.customer_id
WHERE n.customer_id IN (1, 2, 3, 4)
ORDER BY n.created_at DESC;

-- ==========================
-- Step 5: Check Event Scheduler Status
-- ==========================
SELECT '\nEvent Scheduler Status:' as status;
SELECT @@event_scheduler as event_scheduler_status;

SELECT '\nScheduled Events:' as status;
SHOW EVENTS LIKE 'daily_membership_check';

-- ==========================
-- Expected Results:
-- ==========================
/*
Expected outcomes:
1. Customer 1: annual_pass = 'yes', notification created (expires in 15 days)
2. Customer 2: annual_pass = 'yes', notification created (expires in 5 days)
3. Customer 3: annual_pass = 'no' (auto-expired), no notification
4. Customer 4: annual_pass = 'yes', no notification yet (expires in 60 days)

The notifications table should have 2 new entries for customers 1 and 2.
*/

-- ==========================
-- Cleanup (Optional - uncomment to reset test data)
-- ==========================
-- DELETE FROM notifications WHERE customer_id IN (1, 2, 3, 4);
-- UPDATE customers SET annual_pass = 'no', membership_start_date = NULL, membership_end_date = NULL WHERE customer_id IN (1, 2, 3, 4);
