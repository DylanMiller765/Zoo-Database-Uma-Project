-- Migration: Add Auto-Renewal Scheduled Job
-- Date: 2025-01-XX
-- Purpose: Automatically renew memberships on expiration date if auto-renewal is enabled

USE zoo_database;

-- Step 1: Create stored procedure to auto-renew memberships
DELIMITER //

CREATE PROCEDURE IF NOT EXISTS auto_renew_memberships()
BEGIN
    -- Find memberships expiring today with auto-renewal enabled
    -- and check if they have a saved payment method
    DECLARE done INT DEFAULT FALSE;
    DECLARE v_customer_id INT;
    DECLARE v_payment_method_id INT;
    DECLARE v_old_end_date DATE;
    DECLARE v_new_end_date DATE;
    DECLARE v_membership_price DECIMAL(8, 2) DEFAULT 149.00;
    
    -- Cursor to find expiring memberships with auto-renewal enabled
    DECLARE cur_memberships CURSOR FOR
        SELECT 
            c.customer_id,
            c.membership_end_date,
            pm.payment_method_id
        FROM customers c
        INNER JOIN customer_payment_methods pm ON c.customer_id = pm.customer_id
        WHERE c.annual_pass = 'yes'
        AND c.membership_auto_renew = TRUE
        AND c.membership_end_date = CURDATE()
        AND c.membership_end_date IS NOT NULL;
    
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    OPEN cur_memberships;
    
    read_loop: LOOP
        FETCH cur_memberships INTO v_customer_id, v_old_end_date, v_payment_method_id;
        
        IF done THEN
            LEAVE read_loop;
        END IF;
        
        -- Calculate new end date (1 year from old end date)
        SET v_new_end_date = DATE_ADD(v_old_end_date, INTERVAL 1 YEAR);
        
        -- Update customer membership dates
        UPDATE customers
        SET 
            membership_start_date = v_old_end_date,
            membership_end_date = v_new_end_date,
            annual_pass = 'yes'
        WHERE customer_id = v_customer_id;
        
        -- Record the auto-renewal purchase
        INSERT INTO membership_purchases 
        (customer_id, purchase_date, start_date, end_date, price, payment_method, auto_renewed, payment_method_id)
        VALUES 
        (v_customer_id, NOW(), v_old_end_date, v_new_end_date, v_membership_price, 'online', TRUE, v_payment_method_id);
        
    END LOOP;
    
    CLOSE cur_memberships;
END//

DELIMITER ;

-- Step 2: Create MySQL event to run the procedure daily at midnight
-- Note: Requires event_scheduler to be ON (SET GLOBAL event_scheduler = ON;)
CREATE EVENT IF NOT EXISTS daily_auto_renewal_check
ON SCHEDULE EVERY 1 DAY
STARTS (CURRENT_DATE + INTERVAL 1 DAY)  -- Start tomorrow at midnight
DO
    CALL auto_renew_memberships();

-- Verification queries (commented out, run manually if needed):
-- SELECT 'Auto-renewal job created successfully!' as status;
-- SHOW EVENTS LIKE 'daily_auto_renewal_check';
-- SELECT * FROM customers WHERE membership_auto_renew = TRUE AND membership_end_date = CURDATE();

