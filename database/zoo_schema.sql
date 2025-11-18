-- Zoo Database Schema
-- Team Project Database Design

-- Use Railway's default database so it shows up in the dashboard
USE railway;

-- This script is designed to be rerunnable. It will drop the existing database to ensure a clean start.
DROP DATABASE IF EXISTS zoo_database;
CREATE DATABASE zoo_database;
USE zoo_database;


CREATE TABLE `employees` (
    `employee_id` INT PRIMARY KEY AUTO_INCREMENT,
    `first_name` VARCHAR(50) NOT NULL,
    `last_name` VARCHAR(50) NOT NULL,
    `email` VARCHAR(100) UNIQUE,
    `phone` VARCHAR(20),
    `ssn` CHAR(11) UNIQUE NOT NULL,
    `job_role` ENUM('keeper', 'manager', 'coordinator', 'cashier', 'guide', 'veterinarian', 'maintenance', 'security', 'other') NOT NULL,
    `employment_type` ENUM('full_time', 'part_time') NOT NULL DEFAULT 'full_time',
    `salary` DECIMAL(10, 2),
    `status` ENUM('active', 'inactive') DEFAULT 'active',
    `hire_date` DATE,
    `address` VARCHAR(255),
    `city` VARCHAR(50),
    `state` VARCHAR(50),
    `zip_code` VARCHAR(10),
    `gender` ENUM('male', 'female', 'other', 'prefer_not_to_say'),
    `birthday` DATE,
    `deleted_at` DATETIME DEFAULT NULL,
    CONSTRAINT `chk_salary` CHECK ((`employment_type` = 'full_time' AND `salary` IS NOT NULL) OR (`employment_type` = 'part_time' AND `salary` IS NULL))
);

CREATE TABLE `customers` (
    `customer_id` INT PRIMARY KEY AUTO_INCREMENT,
    `first_name` VARCHAR(50) NOT NULL,
    `last_name` VARCHAR(50) NOT NULL,
    `email` VARCHAR(100) UNIQUE,
    `phone` VARCHAR(20),
    `address` VARCHAR(200),
    `city` VARCHAR(50),
    `state` VARCHAR(50),
    `zip_code` VARCHAR(10),
    `annual_pass` ENUM('yes', 'no') DEFAULT 'no',
    `membership_start_date` DATE DEFAULT NULL,
    `membership_end_date` DATE DEFAULT NULL,
    `registration_date` DATE,
    `deleted_at` DATETIME DEFAULT NULL,
    INDEX `idx_customer_email` (`email`)
);

CREATE TABLE `attractions` (
    `attraction_id` INT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `location` VARCHAR(100),
    `human_capacity` INT,
    `opening_time` TIME,
    `closing_time` TIME,
    `status` ENUM('open', 'closed', 'maintenance') DEFAULT 'open',
    `deleted_at` DATETIME DEFAULT NULL
);

CREATE TABLE `gift_shops` (
    `gift_shop_id` INT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `location` VARCHAR(100),
    `opening_time` TIME,
    `closing_time` TIME,
    `manager_id` INT,
    `deleted_at` DATETIME DEFAULT NULL,
    FOREIGN KEY (`manager_id`) REFERENCES `employees`(`employee_id`) ON DELETE SET NULL
);

CREATE TABLE `cafes` (
    `cafe_id` INT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `location` VARCHAR(100),
    `opening_time` TIME,
    `closing_time` TIME,
    `manager_id` INT,
    `deleted_at` DATETIME DEFAULT NULL,
    FOREIGN KEY (`manager_id`) REFERENCES `employees`(`employee_id`) ON DELETE SET NULL
);

CREATE TABLE `events` (
    `event_id` INT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT,
    `event_date` DATE,
    `start_time` TIME,
    `end_time` TIME,
    `location` VARCHAR(100),
    `max_participants` INT,
    `ticket_price` DECIMAL(8, 2),
    `coordinator_id` INT,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `deleted_at` DATETIME DEFAULT NULL,
    FOREIGN KEY (`coordinator_id`) REFERENCES `employees`(`employee_id`) ON DELETE SET NULL
);

-- Entities with one level of dependency
CREATE TABLE `user_accounts` (
    `account_id` INT PRIMARY KEY AUTO_INCREMENT,
    `username` VARCHAR(80) UNIQUE NOT NULL,
    `email` VARCHAR(100) UNIQUE,
    `role` ENUM('employee', 'customer') NOT NULL,
    `employee_id` INT UNIQUE,
    `customer_id` INT UNIQUE,
    `last_login_at` DATETIME,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `chk_user_owner` CHECK ((`employee_id` IS NOT NULL AND `customer_id` IS NULL) OR (`employee_id` IS NULL AND `customer_id` IS NOT NULL)),
    FOREIGN KEY (`employee_id`) REFERENCES `employees`(`employee_id`) ON DELETE CASCADE,
    FOREIGN KEY (`customer_id`) REFERENCES `customers`(`customer_id`) ON DELETE CASCADE
);

-- NEW: Passwords table for user authentication
CREATE TABLE `passwords` (
    `password_id` INT PRIMARY KEY AUTO_INCREMENT,
    `account_id` INT NOT NULL UNIQUE,
    `password_hash` VARCHAR(255) NOT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`account_id`) REFERENCES `user_accounts`(`account_id`) ON DELETE CASCADE
);

CREATE TABLE `habitats` (
    `habitat_id` INT PRIMARY KEY AUTO_INCREMENT,
    `habitat_name` VARCHAR(100) NOT NULL,
    `attraction_id` INT,
    `size` VARCHAR(50),
    `environment_type` VARCHAR(50),
    `animal_capacity` INT DEFAULT 10,
    `cleaning_schedule` VARCHAR(100),
    `last_maintenance` DATE,
    `status` ENUM('active', 'maintenance', 'renovation', 'closed') DEFAULT 'active',
    `created_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `deleted_at` DATETIME DEFAULT NULL,
    FOREIGN KEY (`attraction_id`) REFERENCES `attractions`(`attraction_id`) ON DELETE SET NULL
);

CREATE TABLE `animals` (
    `animal_id` INT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `scientific_name` VARCHAR(100),
    `species` VARCHAR(100) NOT NULL,
    `date_of_birth` DATE,
    `arrival_date` DATE NOT NULL,
    `gender` ENUM('male', 'female', 'unknown'),
    `place_of_origin` VARCHAR(100),
    `habitat_id` INT,
    `medical_notes` TEXT,
    `health_status` ENUM('excellent', 'good', 'fair', 'poor', 'critical') DEFAULT 'good',
    `active_status` ENUM('active', 'transferred', 'deceased') DEFAULT 'active',
    `endangerment_status` ENUM('least_concern', 'near_threatened', 'vulnerable', 'endangered', 'critically_endangered', 'extinct_in_the_wild', 'extinct') DEFAULT 'least_concern',
    `weight` DECIMAL(8, 2),
    `created_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_date` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `deleted_at` DATETIME DEFAULT NULL,
    FOREIGN KEY (`habitat_id`) REFERENCES `habitats`(`habitat_id`) ON DELETE SET NULL,
    INDEX `idx_animal_species` (`species`)
);

CREATE TABLE `tickets` (
    `ticket_id` INT PRIMARY KEY AUTO_INCREMENT,
    `customer_id` INT,
    `purchase_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `visit_date` DATE,
    `ticket_type` ENUM('adult', 'child', 'senior', 'student') NOT NULL,
    `price` DECIMAL(8, 2) NOT NULL,
    `payment_method` ENUM('cash', 'credit', 'debit'), -- NOTE: payment_method is not currently displayed in financial reports and is kept for historical tracking
    `sold_by` INT,
    `deleted_at` DATETIME DEFAULT NULL,
    FOREIGN KEY (`customer_id`) REFERENCES `customers`(`customer_id`) ON DELETE SET NULL,
    FOREIGN KEY (`sold_by`) REFERENCES `employees`(`employee_id`) ON DELETE SET NULL,
    INDEX `idx_ticket_date` (`visit_date`)
);

CREATE TABLE `donations` (
    `donation_id` INT PRIMARY KEY AUTO_INCREMENT,
    `customer_id` INT,
    `amount` DECIMAL(10, 2) NOT NULL,
    `donation_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `message` TEXT,
    `donation_type` ENUM('general', 'conservation', 'research', 'animal_care') DEFAULT 'general', -- NOTE: donation_type is not currently used in the application and is kept for future expansion
    `payment_method` ENUM('cash', 'credit', 'debit'), -- NOTE: payment_method is not currently displayed in the UI and is kept for historical tracking purposes
    `deleted_at` DATETIME DEFAULT NULL,
    FOREIGN KEY (`customer_id`) REFERENCES `customers`(`customer_id`) ON DELETE SET NULL
);

CREATE TABLE `membership_purchases` (
    `purchase_id` INT PRIMARY KEY AUTO_INCREMENT,
    `customer_id` INT NOT NULL,
    `purchase_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `start_date` DATE NOT NULL,
    `end_date` DATE NOT NULL,
    `price` DECIMAL(8, 2) NOT NULL,
    `payment_method` ENUM('cash', 'credit', 'debit'), -- NOTE: payment_method is not currently displayed in financial reports and is kept for historical tracking
    FOREIGN KEY (`customer_id`) REFERENCES `customers`(`customer_id`) ON DELETE CASCADE,
    INDEX `idx_customer_purchases` (`customer_id`, `purchase_date`)
);

CREATE TABLE `gift_shop_items` (
    `item_id` INT PRIMARY KEY AUTO_INCREMENT,
    `gift_shop_id` INT NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT,
    `category` VARCHAR(50),
    `price` DECIMAL(8, 2) NOT NULL,
    `cost` DECIMAL(8, 2),
    `quantity_in_stock` INT DEFAULT 0,
    `supplier` VARCHAR(100),
    FOREIGN KEY (`gift_shop_id`) REFERENCES `gift_shops`(`gift_shop_id`) ON DELETE CASCADE
);

CREATE TABLE `cafe_items` (
    `item_id` INT PRIMARY KEY AUTO_INCREMENT,
    `cafe_id` INT NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT,
    `category` VARCHAR(50),
    `price` DECIMAL(8, 2) NOT NULL,
    `is_available` BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (`cafe_id`) REFERENCES `cafes`(`cafe_id`) ON DELETE CASCADE
);

CREATE TABLE `event_registrations` (
    `registration_id` INT PRIMARY KEY AUTO_INCREMENT,
    `event_id` INT NOT NULL,
    `customer_id` INT,
    `registration_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `number_of_participants` INT DEFAULT 1,
    `total_amount` DECIMAL(10, 2),
    `payment_status` ENUM('pending', 'paid', 'cancelled') DEFAULT 'pending',
    `refunded_at` DATETIME DEFAULT NULL,
    `refund_reason` VARCHAR(255) DEFAULT NULL,
    `deleted_at` DATETIME DEFAULT NULL,
    FOREIGN KEY (`event_id`) REFERENCES `events`(`event_id`) ON DELETE CASCADE,
    FOREIGN KEY (`customer_id`) REFERENCES `customers`(`customer_id`) ON DELETE SET NULL
);

-- NEW: Models the many-to-many relationship between keepers and animals
CREATE TABLE `zookeeper_assignments` (
    `assignment_id` INT PRIMARY KEY AUTO_INCREMENT,
    `keeper_id` INT NOT NULL,
    `animal_id` INT NOT NULL,
    `shift` VARCHAR(50),
    FOREIGN KEY (`keeper_id`) REFERENCES `employees`(`employee_id`) ON DELETE CASCADE,
    FOREIGN KEY (`animal_id`) REFERENCES `animals`(`animal_id`) ON DELETE CASCADE,
    UNIQUE (`keeper_id`, `animal_id`)
);

-- NEW: Defines the standard diet for an animal
CREATE TABLE `feeding_schedules` (
    `schedule_id` INT PRIMARY KEY AUTO_INCREMENT,
    `animal_id` INT NOT NULL,
    `food_description` VARCHAR(255) NOT NULL,
    `frequency` VARCHAR(100),
    `scheduled_time` TIME,
    `notes` TEXT,
    FOREIGN KEY (`animal_id`) REFERENCES `animals`(`animal_id`) ON DELETE CASCADE
);

-- NEW: A log of every feeding event
CREATE TABLE `feeding_logs` (
    `log_id` INT PRIMARY KEY AUTO_INCREMENT,
    `animal_id` INT NOT NULL,
    `keeper_id` INT,
    `feeding_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `food_given` VARCHAR(255) NOT NULL,
    `quantity_given` VARCHAR(50),
    `notes` TEXT,
    FOREIGN KEY (`animal_id`) REFERENCES `animals`(`animal_id`) ON DELETE CASCADE,
    FOREIGN KEY (`keeper_id`) REFERENCES `employees`(`employee_id`) ON DELETE SET NULL
);

-- REVISED: Parent table for a single gift shop transaction
CREATE TABLE `gift_shop_sales_transactions` (
    `transaction_id` INT PRIMARY KEY AUTO_INCREMENT,
    `gift_shop_id` INT NOT NULL,
    `customer_id` INT,
    `employee_id` INT,
    `sale_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `total_amount` DECIMAL(10, 2) NOT NULL,
    `payment_method` ENUM('cash', 'credit', 'debit'), -- NOTE: payment_method is not currently displayed in financial reports and is kept for historical tracking
    `status` ENUM('completed', 'returned') DEFAULT 'completed',
    FOREIGN KEY (`gift_shop_id`) REFERENCES `gift_shops`(`gift_shop_id`),
    FOREIGN KEY (`customer_id`) REFERENCES `customers`(`customer_id`) ON DELETE SET NULL,
    FOREIGN KEY (`employee_id`) REFERENCES `employees`(`employee_id`) ON DELETE SET NULL
);

-- REVISED: Linking table for items within a gift shop transaction
CREATE TABLE `gift_shop_sale_items` (
    `sale_item_id` INT PRIMARY KEY AUTO_INCREMENT,
    `transaction_id` INT NOT NULL,
    `item_id` INT NOT NULL,
    `quantity` INT NOT NULL,
    `unit_price` DECIMAL(8,2) NOT NULL,
    FOREIGN KEY (`transaction_id`) REFERENCES `gift_shop_sales_transactions`(`transaction_id`) ON DELETE CASCADE,
    FOREIGN KEY (`item_id`) REFERENCES `gift_shop_items`(`item_id`) ON DELETE RESTRICT
);

CREATE TABLE `cafe_sales` (
    `sale_id` INT PRIMARY KEY AUTO_INCREMENT,
    `cafe_id` INT NOT NULL,
    `transaction_id` VARCHAR(255) NOT NULL,
    `customer_id` INT,
    `employee_id` INT,
    `item_id` INT NOT NULL,
    `quantity` INT NOT NULL,
    `line_total` DECIMAL(10, 2) NOT NULL,
    `sale_timestamp` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `status` ENUM('completed', 'returned') DEFAULT 'completed',
    FOREIGN KEY (`cafe_id`) REFERENCES `cafes`(`cafe_id`),
    FOREIGN KEY (`customer_id`) REFERENCES `customers`(`customer_id`) ON DELETE SET NULL,
    FOREIGN KEY (`employee_id`) REFERENCES `employees`(`employee_id`) ON DELETE SET NULL,
    FOREIGN KEY (`item_id`) REFERENCES `cafe_items`(`item_id`)
);

-- Notifications table for user alerts (e.g., membership expiration warnings)
CREATE TABLE `notifications` (
    `notification_id` INT PRIMARY KEY AUTO_INCREMENT,
    `customer_id` INT NOT NULL,
    `message` VARCHAR(500) NOT NULL,
    `notification_type` ENUM('info', 'warning', 'alert') DEFAULT 'info',
    `is_read` BOOLEAN DEFAULT FALSE,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`customer_id`) REFERENCES `customers`(`customer_id`) ON DELETE CASCADE,
    INDEX `idx_customer_unread` (`customer_id`, `is_read`),
    INDEX `idx_created_at` (`created_at`)
);
ALTER TABLE notifications
    MODIFY COLUMN customer_id INT NULL;

ALTER TABLE notifications
    ADD COLUMN employee_id INT NULL AFTER customer_id;

CREATE TABLE `animals_alert_queue` (
    `animal_alert_id` INT PRIMARY KEY AUTO_INCREMENT,
    `alert_reason` ENUM('health_status','active_status') NOT NULL,
    `alert_value` VARCHAR(50),
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `processed_at` DATETIME DEFAULT NULL,
    `animal_id` INT NOT NULL,
    FOREIGN KEY (`animal_id`) REFERENCES `animals`(`animal_id`) ON DELETE CASCADE,
    INDEX `idx_processed_at` (`processed_at`)
);

-- Trigger to create animal alert queue
-- On each update, check each animal's health
-- if it falls below a certain threshold, create an alert in the queue
/*
On update to the animal table
creat variable named health_threshold
Check each animal row and determine if it's < health_threshold
If it is below health_threshold, create row in animlas_alert table with the animal_id, concatenate a message to send to zookeepers. Set the created at and the animal id.

*/

DELIMITER //

CREATE TRIGGER alert_animal_health_and_active_status_upon_threshold
AFTER UPDATE ON animals
FOR EACH ROW
BEGIN
    -- Declarations
    DECLARE existing_alert_id INT;
    DECLARE done INT DEFAULT FALSE;
    DECLARE vet_id INT;
    
    -- Cursor to find all vets
    DECLARE vet_cursor CURSOR FOR 
        SELECT employee_id FROM employees WHERE job_role = 'veterinarian';
        
    -- Handler: Sets done=TRUE when cursor finishes OR when any SELECT finds nothing
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    -- HEALTH STATUS
    IF NEW.health_status IN ('poor', 'critical') AND NEW.health_status != OLD.health_status THEN
        
        SET existing_alert_id = NULL;

        -- If this finds no rows, the HANDLER fires and sets done = TRUE
        SELECT alert.animal_alert_id INTO existing_alert_id
        FROM animals_alert_queue alert
        WHERE alert.animal_id = NEW.animal_id
          AND alert.alert_reason = 'health_status'
          AND alert.processed_at IS NULL
        LIMIT 1;

        IF existing_alert_id IS NULL THEN
            INSERT INTO animals_alert_queue(alert_reason, alert_value, animal_id)
            VALUES ('health_status', NEW.health_status, NEW.animal_id);
        ELSE
            UPDATE animals_alert_queue
            SET 
                alert_value = NEW.health_status,
                created_at = NOW()
            WHERE animal_alert_id = existing_alert_id;
        END IF;
    
        -- We must reset this because the SELECT INTO above might have tripped it to TRUE
        SET done = FALSE; 

        OPEN vet_cursor;
        read_loop: LOOP
            FETCH vet_cursor INTO vet_id;
            
            IF done THEN
                LEAVE read_loop;
            END IF;

            INSERT INTO notifications (employee_id, message, notification_type, created_at)
            VALUES (
                vet_id,
                CONCAT('Alert: Animal "', NEW.name, ' health status is now "', NEW.health_status, '". Immediate attention required.'),
                'alert',
                NOW()
            );
        END LOOP;
        CLOSE vet_cursor;

    END IF;

    --  ACTIVE STATUS
    IF NEW.active_status = 'deceased' AND NEW.active_status != OLD.active_status THEN

        SET existing_alert_id = NULL;

        -- It is okay if this triggers the handler here, as there is no cursor loop following it
        SELECT alert.animal_alert_id INTO existing_alert_id
        FROM animals_alert_queue alert
        WHERE alert.animal_id = NEW.animal_id
          AND alert.alert_reason = 'active_status'
          AND alert.processed_at IS NULL
        LIMIT 1;

        IF existing_alert_id IS NULL THEN
            INSERT INTO animals_alert_queue(alert_reason, alert_value, animal_id)
            VALUES ('active_status', NEW.active_status, NEW.animal_id);
        ELSE
            UPDATE animals_alert_queue
            SET created_at = NOW()
            WHERE animal_alert_id = existing_alert_id;
        END IF;

    END IF;

END;
//

DELIMITER ;
-- Indexes for soft delete columns (performance optimization)
CREATE INDEX `idx_employees_deleted` ON `employees`(`deleted_at`);
CREATE INDEX `idx_customers_deleted` ON `customers`(`deleted_at`);
CREATE INDEX `idx_animals_deleted` ON `animals`(`deleted_at`);
CREATE INDEX `idx_habitats_deleted` ON `habitats`(`deleted_at`);
CREATE INDEX `idx_events_deleted` ON `events`(`deleted_at`);
CREATE INDEX `idx_gift_shops_deleted` ON `gift_shops`(`deleted_at`);
CREATE INDEX `idx_cafes_deleted` ON `cafes`(`deleted_at`);
CREATE INDEX `idx_tickets_deleted` ON `tickets`(`deleted_at`);

-- Trigger to create expiring membership notifications
-- Business Rule: Customers with memberships expiring within 30 days should receive a warning notification
-- This enforces the semantic constraint that customers must be notified before their membership expires
DELIMITER //
CREATE TRIGGER trg_membership_expiration_notification
AFTER UPDATE ON customers
FOR EACH ROW
BEGIN
    -- Only proceed if this is a membership-related update
    IF NEW.annual_pass = 'yes' AND NEW.membership_end_date IS NOT NULL THEN
        -- Check if membership is expiring within 30 days
        IF DATEDIFF(NEW.membership_end_date, CURDATE()) BETWEEN 1 AND 30 THEN
            -- Only create notification if one doesn't already exist for this expiration date
            IF NOT EXISTS (
                SELECT 1 FROM notifications n
                WHERE n.customer_id = NEW.customer_id
                AND n.message LIKE CONCAT('%', DATE_FORMAT(NEW.membership_end_date, '%M %d, %Y'), '%')
                AND DATE(n.created_at) >= DATE_ADD(CURDATE(), INTERVAL -7 DAY)
            ) THEN
                INSERT INTO notifications (customer_id, message, notification_type, created_at)
                VALUES (
                    NEW.customer_id,
                    CONCAT('Your membership expires on ', DATE_FORMAT(NEW.membership_end_date, '%M %d, %Y'),
                           '. Renew now to continue enjoying member benefits!'),
                    'warning',
                    NOW()
                );
            END IF;
        END IF;
    END IF;

    -- Automatically expire memberships that have passed their end date
    -- Business Rule: Expired memberships should automatically have annual_pass set to 'no'
    IF NEW.annual_pass = 'yes' AND NEW.membership_end_date IS NOT NULL THEN
        IF NEW.membership_end_date < CURDATE() THEN
            -- This will trigger another UPDATE, but the trigger won't recurse
            -- because the condition NEW.annual_pass = 'yes' will be false on the next iteration
            UPDATE customers
            SET annual_pass = 'no'
            WHERE customer_id = NEW.customer_id;
        END IF;
    END IF;
END//
DELIMITER ;

-- Start of merged migration: Add Auto-Renewal and Payment Methods Support
-- Migration: Add Auto-Renewal and Payment Methods Support
-- Date: 2025-01-XX
-- Purpose: Add auto-renewal toggle, payment method storage, and link to membership purchases


-- Step 1: Add auto-renewal flag to customers table
ALTER TABLE customers
ADD COLUMN membership_auto_renew BOOLEAN DEFAULT FALSE 
AFTER membership_end_date;

-- Step 2: Create customer_payment_methods table (one card per customer)
CREATE TABLE IF NOT EXISTS `customer_payment_methods` (
    `payment_method_id` INT PRIMARY KEY AUTO_INCREMENT,
    `customer_id` INT NOT NULL UNIQUE,  -- UNIQUE ensures one card per customer
    `card_number` VARCHAR(19) NOT NULL,
    `cardholder_name` VARCHAR(100) NOT NULL,
    `expiry_month` TINYINT NOT NULL,  -- 1-12
    `expiry_year` SMALLINT NOT NULL,  -- e.g., 2025, 2026
    `cvv` VARCHAR(4),
    `billing_address` VARCHAR(200),
    `billing_city` VARCHAR(50),
    `billing_state` VARCHAR(50),
    `billing_zip` VARCHAR(10),
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`customer_id`) REFERENCES `customers`(`customer_id`) ON DELETE CASCADE,
    INDEX `idx_customer_payment` (`customer_id`)
);

-- Step 3: Update membership_purchases table to track auto-renewal and payment method
ALTER TABLE membership_purchases
ADD COLUMN `auto_renewed` BOOLEAN DEFAULT FALSE 
AFTER `payment_method`,
ADD COLUMN `payment_method_id` INT NULL 
AFTER `auto_renewed`,
ADD FOREIGN KEY (`payment_method_id`) REFERENCES `customer_payment_methods`(`payment_method_id`) ON DELETE SET NULL;

-- Verification queries (commented out, run manually if needed):
-- SELECT 'Migration completed successfully!' as status;
-- SELECT * FROM customers WHERE membership_auto_renew IS NOT NULL LIMIT 1;
-- SELECT * FROM customer_payment_methods LIMIT 1;
-- DESCRIBE membership_purchases;

-- End of merged migration: Add Auto-Renewal and Payment Methods Support

-- Start of merged migration: Add Auto-Renewal Scheduled Job
-- Migration: Add Auto-Renewal Scheduled Job
-- Date: 2025-01-XX
-- Purpose: Automatically renew memberships on expiration date if auto-renewal is enabled


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
        (v_customer_id, NOW(), v_old_end_date, v_new_end_date, v_membership_price, 'credit', TRUE, v_payment_method_id);
        
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

-- =======================================
-- TRIGGER: Event Cancellation
-- =======================================
-- When an event is cancelled (deleted_at is set), automatically:
-- 1. Create notifications for all registered customers
-- 2. Mark all event registrations as refunded

DELIMITER //

CREATE TRIGGER trigger_event_cancellation
AFTER UPDATE ON events
FOR EACH ROW
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE customer_id_var INT;
    DECLARE event_name_var VARCHAR(100);
    DECLARE event_date_var DATE;
    DECLARE event_time_var TIME;
    DECLARE formatted_datetime VARCHAR(100);
    DECLARE cancellation_message VARCHAR(500);

    -- Cursor to fetch all distinct customers registered for this event
    DECLARE customer_cursor CURSOR FOR
        SELECT DISTINCT er.customer_id
        FROM event_registrations er
        WHERE er.event_id = NEW.event_id
          AND er.customer_id IS NOT NULL;

    -- Handler: Sets done=TRUE when cursor finishes
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    -- Only proceed if event was just cancelled (deleted_at changed from NULL to NOT NULL)
    IF OLD.deleted_at IS NULL AND NEW.deleted_at IS NOT NULL THEN

        -- Prepare event information for notification message
        SET event_name_var = NEW.name;
        SET event_date_var = NEW.event_date;
        SET event_time_var = NEW.start_time;

        -- Format datetime string for the message
        SET formatted_datetime = DATE_FORMAT(event_date_var, '%M %d, %Y');
        IF event_time_var IS NOT NULL THEN
            SET formatted_datetime = CONCAT(formatted_datetime, ' at ', DATE_FORMAT(event_time_var, '%h:%i %p'));
        END IF;

        -- Create cancellation message
        SET cancellation_message = CONCAT(
            'CANCELLATION: The event "', event_name_var, '" scheduled for ', formatted_datetime,
            ' has been cancelled. We sincerely apologize for any inconvenience this may cause. ',
            'A full refund has been automatically processed for your registration.'
        );

        -- Create notifications for all registered customers
        OPEN customer_cursor;

        notification_loop: LOOP
            FETCH customer_cursor INTO customer_id_var;

            IF done THEN
                LEAVE notification_loop;
            END IF;

            -- Insert notification for this customer
            INSERT INTO notifications (customer_id, message, notification_type, is_read, created_at)
            VALUES (customer_id_var, cancellation_message, 'alert', FALSE, NOW());
        END LOOP;

        CLOSE customer_cursor;

        -- Mark all event registrations as refunded
        UPDATE event_registrations
        SET refunded_at = NOW(),
            refund_reason = 'Event cancelled'
        WHERE event_id = NEW.event_id
          AND refunded_at IS NULL;
    END IF;
END//

DELIMITER ;

-- Verification queries (commented out, run manually if needed):
-- SELECT 'Auto-renewal job created successfully!' as status;
-- SHOW EVENTS LIKE 'daily_auto_renewal_check';
-- SELECT * FROM customers WHERE membership_auto_renew = TRUE AND membership_end_date = CURDATE();

-- End of merged migration: Add Auto-Renewal Scheduled Job
