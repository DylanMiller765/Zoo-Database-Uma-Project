-- Migration: Add Membership Expiration Tracking and Notification System
-- Date: 2025-10-28
-- Purpose: Add membership start/end dates and create a notification system with trigger

USE zoo_database;

-- Step 1: Add membership tracking fields to customers table
ALTER TABLE customers
ADD COLUMN membership_start_date DATE DEFAULT NULL AFTER annual_pass,
ADD COLUMN membership_end_date DATE DEFAULT NULL AFTER membership_start_date;

-- Step 2: Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
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

-- Step 3: Create a stored procedure to check for expiring memberships
DELIMITER //

CREATE PROCEDURE check_expiring_memberships()
BEGIN
    -- Insert notifications for memberships expiring in 30 days or less
    INSERT INTO notifications (customer_id, message, notification_type, created_at)
    SELECT
        c.customer_id,
        CONCAT('Your membership expires on ', DATE_FORMAT(c.membership_end_date, '%M %d, %Y'),
               '. Renew now to continue enjoying member benefits!') as message,
        'warning' as notification_type,
        NOW() as created_at
    FROM customers c
    WHERE c.annual_pass = 'yes'
    AND c.membership_end_date IS NOT NULL
    AND DATEDIFF(c.membership_end_date, CURDATE()) BETWEEN 1 AND 30
    AND NOT EXISTS (
        -- Avoid duplicate notifications for the same expiration date
        SELECT 1 FROM notifications n
        WHERE n.customer_id = c.customer_id
        AND n.message LIKE CONCAT('%', DATE_FORMAT(c.membership_end_date, '%M %d, %Y'), '%')
        AND DATE(n.created_at) >= DATE_ADD(CURDATE(), INTERVAL -7 DAY)
    );

    -- Mark memberships as expired if the end date has passed
    UPDATE customers
    SET annual_pass = 'no'
    WHERE annual_pass = 'yes'
    AND membership_end_date IS NOT NULL
    AND membership_end_date < CURDATE();
END//

DELIMITER ;

-- Step 4: Create an event to run the check daily (MySQL Event Scheduler)
-- Note: Requires event_scheduler to be ON (SET GLOBAL event_scheduler = ON;)
CREATE EVENT IF NOT EXISTS daily_membership_check
ON SCHEDULE EVERY 1 DAY
STARTS CURRENT_DATE + INTERVAL 1 DAY  -- Start tomorrow at midnight
DO
    CALL check_expiring_memberships();

-- Step 5: For demonstration, update existing annual pass holders with dates
-- This gives them a 1-year membership from today
UPDATE customers
SET
    membership_start_date = CURDATE(),
    membership_end_date = DATE_ADD(CURDATE(), INTERVAL 1 YEAR)
WHERE annual_pass = 'yes'
AND membership_end_date IS NULL;

-- Verification queries (commented out, run manually if needed):
-- SELECT * FROM customers WHERE annual_pass = 'yes';
-- SELECT * FROM notifications ORDER BY created_at DESC;
-- SHOW EVENTS LIKE 'daily_membership_check';
-- SELECT @@event_scheduler;
