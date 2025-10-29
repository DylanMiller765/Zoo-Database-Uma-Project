-- ========================================================================
-- SIMPLE SETUP SCRIPT - Run this in MySQL Workbench
-- ========================================================================
-- This script sets up the notification system without complex date functions
-- that might cause compatibility issues. Run this AFTER zoo_schema.sql
-- ========================================================================

USE zoo_database;

-- ========================================================================
-- STEP 1: Give Maria Garcia a membership expiring in 20 days
-- ========================================================================
-- Using simple date arithmetic that works in all MySQL versions

UPDATE customers
SET
    membership_start_date = '2024-01-01',
    membership_end_date = DATE_ADD(NOW(), INTERVAL 20 DAY)
WHERE customer_id = 2;

SELECT 'Maria Garcia updated with expiring membership' as status;

-- ========================================================================
-- STEP 2: Verify the update
-- ========================================================================
SELECT
    customer_id,
    first_name,
    last_name,
    annual_pass,
    membership_start_date,
    membership_end_date,
    DATEDIFF(membership_end_date, CURDATE()) as days_remaining
FROM customers
WHERE customer_id = 2;

-- ========================================================================
-- STEP 3: Check if procedure exists
-- ========================================================================
SELECT 'Checking if stored procedure exists...' as status;

SELECT
    ROUTINE_NAME,
    ROUTINE_TYPE
FROM information_schema.ROUTINES
WHERE ROUTINE_SCHEMA = 'zoo_database'
AND ROUTINE_NAME = 'check_expiring_memberships';

-- ========================================================================
-- STEP 4: Manually create the procedure if it doesn't exist
-- ========================================================================
-- Note: If you get an error here, the procedure might already exist
-- In that case, skip to STEP 5

DROP PROCEDURE IF EXISTS check_expiring_memberships;

DELIMITER $$

CREATE PROCEDURE check_expiring_memberships()
BEGIN
    -- Insert notifications for memberships expiring in 30 days or less
    INSERT INTO notifications (customer_id, message, notification_type, created_at)
    SELECT
        c.customer_id,
        CONCAT('Your membership expires on ', DATE_FORMAT(c.membership_end_date, '%M %d, %Y'),
               '. Renew now to continue enjoying member benefits!'),
        'warning',
        NOW()
    FROM customers c
    WHERE c.annual_pass = 'yes'
    AND c.membership_end_date IS NOT NULL
    AND DATEDIFF(c.membership_end_date, CURDATE()) BETWEEN 1 AND 30
    AND NOT EXISTS (
        SELECT 1 FROM notifications n
        WHERE n.customer_id = c.customer_id
        AND n.message LIKE CONCAT('%', DATE_FORMAT(c.membership_end_date, '%M %d, %Y'), '%')
        AND DATEDIFF(CURDATE(), DATE(n.created_at)) <= 7
    );

    -- Mark expired memberships
    UPDATE customers
    SET annual_pass = 'no'
    WHERE annual_pass = 'yes'
    AND membership_end_date IS NOT NULL
    AND membership_end_date < CURDATE();
END$$

DELIMITER ;

SELECT 'Stored procedure created successfully!' as status;

-- ========================================================================
-- STEP 5: Run the procedure
-- ========================================================================
-- Temporarily disable safe update mode to allow the procedure to run
SET SQL_SAFE_UPDATES = 0;

CALL check_expiring_memberships();

-- Re-enable safe update mode
SET SQL_SAFE_UPDATES = 1;

SELECT 'Procedure executed!' as status;

-- ========================================================================
-- STEP 6: Check for notifications
-- ========================================================================
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
ORDER BY n.created_at DESC;

-- ========================================================================
-- SUCCESS MESSAGE
-- ========================================================================
SELECT '========================================' as '';
SELECT 'SETUP COMPLETE!' as '';
SELECT 'You should see a notification for Maria Garcia above' as '';
SELECT '========================================' as '';
SELECT '' as '';
SELECT 'Next steps:' as '';
SELECT '1. Start your backend: npm run dev:backend' as '';
SELECT '2. Start your frontend: npm run dev:frontend' as '';
SELECT '3. Login as maria.garcia@email.com / password' as '';
SELECT '4. You should see a notification banner!' as '';
