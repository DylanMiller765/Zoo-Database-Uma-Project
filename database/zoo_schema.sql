-- Zoo Database Schema
-- Team Project Database Design

-- Use Railway's default database so it shows up in the dashboard
USE railway;

-- This script is designed to be rerunnable. It will drop the existing database to ensure a clean start.
DROP DATABASE IF EXISTS zoo_db;
CREATE DATABASE zoo_db;
USE zoo_db;


CREATE TABLE `employees` (
    `employee_id` INT PRIMARY KEY AUTO_INCREMENT,
    `first_name` VARCHAR(50) NOT NULL,
    `last_name` VARCHAR(50) NOT NULL,
    `email` VARCHAR(100) UNIQUE,
    `phone` VARCHAR(20),
    `hire_date` DATE,
    `job_title` VARCHAR(50),
    `department` VARCHAR(50),
    `job_role` ENUM('keeper', 'manager', 'coordinator', 'cashier', 'guide', 'veterinarian', 'maintenance', 'security', 'other') NOT NULL,
    `salary` DECIMAL(10, 2),
    `status` ENUM('active', 'inactive') DEFAULT 'active',
    `ssn` CHAR(11) UNIQUE NOT NULL,
    `address` VARCHAR(255),
    `city` VARCHAR(50),
    `state` VARCHAR(50),
    `zip_code` VARCHAR(10),
    `gender` ENUM('male', 'female', 'other', 'prefer_not_to_say'),
    `birthday` DATE,
    `employment_type` ENUM('full_time', 'part_time') NOT NULL DEFAULT 'full_time',
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
    `registration_date` DATE,
    INDEX `idx_customer_email` (`email`)
);

CREATE TABLE `attractions` (
    `attraction_id` INT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `location` VARCHAR(100),
    `human_capacity` INT,
    `opening_time` TIME,
    `closing_time` TIME,
    `status` ENUM('open', 'closed', 'maintenance') DEFAULT 'open'
);

CREATE TABLE `gift_shops` (
    `gift_shop_id` INT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `location` VARCHAR(100),
    `opening_time` TIME,
    `closing_time` TIME,
    `manager_id` INT,
    FOREIGN KEY (`manager_id`) REFERENCES `employees`(`employee_id`) ON DELETE SET NULL
);

CREATE TABLE `cafes` (
    `cafe_id` INT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `location` VARCHAR(100),
    `opening_time` TIME,
    `closing_time` TIME,
    `manager_id` INT,
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
    `payment_method` ENUM('cash', 'credit', 'debit', 'online'),
    FOREIGN KEY (`customer_id`) REFERENCES `customers`(`customer_id`) ON DELETE SET NULL,
    INDEX `idx_ticket_date` (`visit_date`)
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
    `payment_method` ENUM('cash', 'credit', 'debit'),
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
    FOREIGN KEY (`cafe_id`) REFERENCES `cafes`(`cafe_id`),
    FOREIGN KEY (`customer_id`) REFERENCES `customers`(`customer_id`) ON DELETE SET NULL,
    FOREIGN KEY (`employee_id`) REFERENCES `employees`(`employee_id`) ON DELETE SET NULL,
    FOREIGN KEY (`item_id`) REFERENCES `cafe_items`(`item_id`)
);