-- Debug script for notifications
-- Run this to check Maria's account and notifications

-- 1. Check Maria's customer record
SELECT 'Maria Customer Record:' as info;
SELECT
    customer_id,
    first_name,
    last_name,
    email,
    annual_pass,
    membership_start_date,
    membership_end_date,
    DATEDIFF(membership_end_date, CURDATE()) as days_until_expiry
FROM customers
WHERE customer_id = 2;

-- 2. Check Maria's user account
SELECT 'Maria User Account:' as info;
SELECT
    account_id,
    username,
    email,
    role,
    customer_id
FROM user_accounts
WHERE customer_id = 2;

-- 3. Check existing notifications for Maria
SELECT 'Existing Notifications:' as info;
SELECT * FROM notifications WHERE customer_id = 2;

-- 4. Create a notification for Maria if none exists
SELECT 'Creating notification for Maria...' as info;
CALL check_expiring_memberships();

-- 5. Verify notification was created
SELECT 'Notifications after procedure:' as info;
SELECT * FROM notifications WHERE customer_id = 2;

-- 6. If you want to manually create a test notification (uncomment if needed):
-- INSERT INTO notifications (customer_id, message, notification_type, is_read)
-- VALUES (2, 'TEST: Your membership expires soon!', 'warning', FALSE);
