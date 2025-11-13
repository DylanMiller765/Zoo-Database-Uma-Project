-- Migration: Add Auto-Renewal and Payment Methods Support
-- Date: 2025-01-XX
-- Purpose: Add auto-renewal toggle, payment method storage, and link to membership purchases

USE zoo_database;

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

