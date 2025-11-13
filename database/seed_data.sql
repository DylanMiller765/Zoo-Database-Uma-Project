-- Consolidated Seed Data for Zoo Management System
-- This file combines and harmonizes data from mock_data.sql and seed_test_users.sql.
-- Run this script after zoo_schema.sql to populate the database with consistent test data.

USE zoo_database;

-- Temporarily disable foreign key checks to allow truncating tables
SET FOREIGN_KEY_CHECKS = 0;

-- Truncate all tables to ensure a clean slate
TRUNCATE TABLE notifications;
TRUNCATE TABLE cafe_items;
TRUNCATE TABLE cafe_sales;
TRUNCATE TABLE cafes;
TRUNCATE TABLE event_registrations;
TRUNCATE TABLE events;
TRUNCATE TABLE feeding_logs;
TRUNCATE TABLE feeding_schedules;
TRUNCATE TABLE gift_shop_items;
TRUNCATE TABLE gift_shop_sale_items;
TRUNCATE TABLE gift_shop_sales_transactions;
TRUNCATE TABLE gift_shops;
TRUNCATE TABLE zookeeper_assignments;
TRUNCATE TABLE animals;
TRUNCATE TABLE habitats;
TRUNCATE TABLE attractions;
TRUNCATE TABLE passwords;
TRUNCATE TABLE user_accounts;
TRUNCATE TABLE customers;
TRUNCATE TABLE employees;
TRUNCATE TABLE tickets;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- =======================================
-- EMPLOYEES (Source: seed_test_users.sql, with Sarah Johnson as Manager)
-- =======================================
INSERT INTO employees (employee_id, first_name, last_name, email, phone, ssn, job_role, employment_type, salary, status, hire_date, gender) VALUES
(1, 'Sarah', 'Johnson', 'sarah.johnson@zoo.com', '555-0101', '123-45-6789', 'manager', 'full_time', 75000.00, 'active', '2020-01-15', 'female'),
(2, 'Mike', 'Chen', 'mike.chen@zoo.com', '555-0102', '234-56-7890', 'keeper', 'full_time', 45000.00, 'active', '2021-03-20', 'male'),
(3, 'Emily', 'Rodriguez', 'emily.rodriguez@zoo.com', '555-0103', '345-67-8901', 'veterinarian', 'full_time', 85000.00, 'active', '2019-06-10', 'female'),
(4, 'David', 'Kim', 'david.kim@zoo.com', '555-0104', '456-78-9012', 'coordinator', 'full_time', 55000.00, 'active', '2022-02-01', 'male'),
(5, 'Lisa', 'Thompson', 'lisa.thompson@zoo.com', '555-0105', '567-89-0123', 'cashier', 'part_time', NULL, 'active', '2023-05-15', 'female'),
(6, 'James', 'Wilson', 'james.wilson@zoo.com', '555-0106', '678-90-1234', 'guide', 'part_time', NULL, 'active', '2023-07-01', 'male'),
(7, 'Anna', 'Martinez', 'anna.martinez@zoo.com', '555-0107', '789-01-2345', 'keeper', 'full_time', 46000.00, 'active', '2021-09-12', 'female'),
(8, 'Tom', 'Brown', 'tom.brown@zoo.com', '555-0108', '890-12-3456', 'maintenance', 'full_time', 42000.00, 'active', '2020-11-05', 'male');

-- =======================================
-- CUSTOMERS (Source: seed_test_users.sql, including john.smith@email.com)
-- =======================================
-- Note: Maria Garcia has a membership expiring in 20 days (for notification testing)
INSERT INTO customers (customer_id, first_name, last_name, email, phone, address, city, state, zip_code, annual_pass, membership_start_date, membership_end_date, registration_date) VALUES
(1, 'John', 'Smith', 'john.smith@email.com', '555-1001', '123 Main St', 'Springfield', 'IL', '62701', 'no', NULL, NULL, '2024-01-10'),
(2, 'Maria', 'Garcia', 'maria.garcia@email.com', '555-1002', '456 Oak Ave', 'Springfield', 'IL', '62702', 'yes', '2024-01-01', '2025-01-01', '2023-11-15'),
(3, 'Robert', 'Davis', 'robert.davis@email.com', '555-1003', '789 Pine Rd', 'Springfield', 'IL', '62703', 'no', NULL, NULL, '2024-02-20');

-- Update Maria Garcia's membership to expire in 20 days (dynamic date calculation)
UPDATE customers
SET
    membership_start_date = DATE_ADD(CURDATE(), INTERVAL -345 DAY),
    membership_end_date = DATE_ADD(CURDATE(), INTERVAL 20 DAY)
WHERE customer_id = 2;

-- =======================================
-- USER ACCOUNTS
-- =======================================
-- Employees
INSERT INTO user_accounts (account_id, username, email, role, employee_id) VALUES
(1, 'sarah.johnson', 'sarah.johnson@zoo.com', 'employee', 1),
(2, 'mike.chen', 'mike.chen@zoo.com', 'employee', 2),
(3, 'emily.rodriguez', 'emily.rodriguez@zoo.com', 'employee', 3),
(4, 'david.kim', 'david.kim@zoo.com', 'employee', 4),
(5, 'lisa.thompson', 'lisa.thompson@zoo.com', 'employee', 5),
(6, 'james.wilson', 'james.wilson@zoo.com', 'employee', 6),
(7, 'anna.martinez', 'anna.martinez@zoo.com', 'employee', 7),
(8, 'tom.brown', 'tom.brown@zoo.com', 'employee', 8);

-- Customers
INSERT INTO user_accounts (account_id, username, email, role, customer_id) VALUES
(9, 'john.smith', 'john.smith@email.com', 'customer', 1),
(10, 'maria.garcia', 'maria.garcia@email.com', 'customer', 2),
(11, 'robert.davis', 'robert.davis@email.com', 'customer', 3);

-- =======================================
-- PASSWORDS (All passwords are "password")
-- =======================================
INSERT INTO passwords (account_id, password_hash) VALUES
(1, 'password'),  -- Sarah Johnson (Manager)
(2, 'password'),  -- Mike Chen (Keeper)
(3, 'password'),  -- Emily Rodriguez (Veterinarian)
(4, 'password'),  -- David Kim (Coordinator)
(5, 'password'),  -- Lisa Thompson (Cashier)
(6, 'password'),  -- James Wilson (Guide)
(7, 'password'),  -- Anna Martinez (Keeper)
(8, 'password'),  -- Tom Brown (Maintenance)
(9, 'password'),  -- John Smith (Customer)
(10, 'password'), -- Maria Garcia (Customer)
(11, 'password'); -- Robert Davis (Customer)

-- =======================================
-- ATTRACTIONS (Source: mock_data.sql)
-- =======================================
INSERT INTO attractions (name, location, human_capacity, opening_time, closing_time, status) VALUES
('African Savanna', 'North Zone', 500, '09:00:00', '18:00:00', 'open'),
('Tropical Rainforest', 'East Zone', 300, '09:00:00', '18:00:00', 'open'),
('Arctic Tundra', 'West Zone', 250, '09:00:00', '18:00:00', 'open'),
('Aquatic Center', 'South Zone', 400, '10:00:00', '19:00:00', 'open'),
('Reptile House', 'Central Zone', 200, '09:00:00', '17:00:00', 'open');

-- =======================================
-- HABITATS (Source: mock_data.sql)
-- =======================================
INSERT INTO habitats (habitat_name, attraction_id, size, environment_type, animal_capacity, status) VALUES
('Lion Pride Rock', 1, 'Large', 'Grassland', 8, 'active'),
('Elephant Plains', 1, 'Extra Large', 'Savanna', 12, 'active'),
('Gorilla Forest', 2, 'Large', 'Tropical Forest', 6, 'active'),
('Penguin Cove', 3, 'Medium', 'Arctic', 25, 'active'),
('Polar Bear Den', 3, 'Large', 'Arctic', 4, 'active'),
('Dolphin Pool', 4, 'Extra Large', 'Aquatic', 8, 'active'),
('Snake Sanctuary', 5, 'Medium', 'Desert', 15, 'active');

-- =======================================
-- ANIMALS (Source: mock_data.sql)
-- =======================================
INSERT INTO animals (name, scientific_name, species, date_of_birth, arrival_date, gender, place_of_origin, habitat_id, health_status, active_status, endangerment_status, weight) VALUES
('Simba', 'Panthera leo', 'African Lion', '2018-05-12', '2019-06-15', 'male', 'South Africa', 1, 'excellent', 'active', 'vulnerable', 190.5),
('Nala', 'Panthera leo', 'African Lion', '2019-03-20', '2019-06-15', 'female', 'South Africa', 1, 'good', 'active', 'vulnerable', 130.2),
('Dumbo', 'Loxodonta africana', 'African Elephant', '2015-08-10', '2016-09-20', 'male', 'Kenya', 2, 'excellent', 'active', 'endangered', 5500.0),
('Koko', 'Gorilla gorilla', 'Western Gorilla', '2012-11-05', '2013-12-10', 'female', 'Congo', 3, 'good', 'active', 'critically_endangered', 85.0),
('Skipper', 'Aptenodytes forsteri', 'Emperor Penguin', '2020-07-15', '2021-01-10', 'male', 'Antarctica', 4, 'excellent', 'active', 'near_threatened', 23.5),
('Snowball', 'Ursus maritimus', 'Polar Bear', '2016-12-20', '2018-03-15', 'female', 'Arctic Circle', 5, 'good', 'active', 'vulnerable', 250.0),
('Flipper', 'Tursiops truncatus', 'Bottlenose Dolphin', '2017-09-08', '2019-04-20', 'male', 'Florida', 6, 'excellent', 'active', 'least_concern', 200.0),
('Monty', 'Python regius', 'Ball Python', '2021-03-15', '2022-05-10', 'male', 'Ghana', 7, 'good', 'active', 'least_concern', 1.8);

-- =======================================
-- EVENTS (Source: mock_data.sql, FKs adjusted)
-- =======================================
INSERT INTO events (name, description, event_date, start_time, end_time, location, max_participants, ticket_price, coordinator_id) VALUES
('Dolphin Show', 'Watch our amazing dolphins perform tricks and learn about marine conservation', '2025-11-15', '14:00:00', '15:00:00', 'Aquatic Center Amphitheater', 400, 15.00, 4),
('Penguin Feeding Time', 'Help our keepers feed the penguins and learn about their diet', '2025-11-10', '11:00:00', '11:30:00', 'Penguin Cove', 50, 10.00, 4),
('Lion Encounter', 'Get up close with our lions through the safe viewing area', '2025-11-20', '13:00:00', '14:00:00', 'African Savanna', 100, 20.00, 4),
('Kids Zoo Camp', 'Week-long summer camp for children ages 8-12', '2025-12-15', '09:00:00', '15:00:00', 'Education Center', 30, 250.00, 4),
('Night at the Zoo', 'Special after-hours tour experience with nocturnal animals', '2025-12-01', '19:00:00', '22:00:00', 'Various Locations', 150, 35.00, 4);

-- =======================================
-- GIFT SHOPS (Source: mock_data.sql, FKs adjusted)
-- =======================================
INSERT INTO gift_shops (name, location, opening_time, closing_time, manager_id) VALUES
('Safari Shop', 'Main Entrance', '09:00:00', '18:00:00', 1),
('Jungle Treasures', 'Tropical Rainforest', '09:30:00', '17:30:00', 1);

-- =======================================
-- CAFES (Source: mock_data.sql, FKs adjusted)
-- =======================================
INSERT INTO cafes (name, location, opening_time, closing_time, manager_id) VALUES
('Savanna Snacks', 'African Savanna Area', '10:00:00', '17:00:00', 1),
('Penguin Cafe', 'Arctic Tundra Zone', '10:00:00', '17:00:00', 1);

-- =======================================
-- GIFT SHOP ITEMS (Source: mock_data.sql)
-- =======================================
INSERT INTO gift_shop_items (gift_shop_id, name, description, category, price, cost, quantity_in_stock, supplier) VALUES
(1, 'Plush Lion', 'Soft and cuddly lion plushie', 'Toys', 19.99, 8.00, 150, 'ToyWorld Inc'),
(1, 'Zoo T-Shirt', 'Cotton t-shirt with zoo logo', 'Apparel', 24.99, 10.00, 200, 'Apparel Plus'),
(1, 'Animal Stickers', 'Pack of 20 animal stickers', 'Souvenirs', 4.99, 1.50, 500, 'Sticker Co'),
(2, 'Tropical Bird Poster', 'Beautiful rainforest bird poster', 'Art', 12.99, 5.00, 75, 'Art Prints Ltd');

-- =======================================
-- CAFE ITEMS (Source: mock_data.sql)
-- =======================================
INSERT INTO cafe_items (cafe_id, name, description, category, price, is_available) VALUES
(1, 'Burger', 'Classic beef burger with fries', 'Entrees', 12.99, TRUE),
(1, 'Hot Dog', 'All-beef hot dog', 'Entrees', 8.99, TRUE),
(1, 'French Fries', 'Crispy golden fries', 'Sides', 4.99, TRUE),
(1, 'Soda', 'Fountain drink', 'Beverages', 2.99, TRUE),
(2, 'Chicken Nuggets', 'Kids meal chicken nuggets', 'Entrees', 7.99, TRUE),
(2, 'Ice Cream', 'Soft serve ice cream cone', 'Desserts', 3.99, TRUE);

-- =======================================
-- TICKETS (Source: mock_data.sql, FKs adjusted)
-- =======================================
INSERT INTO tickets (customer_id, visit_date, ticket_type, price, payment_method) VALUES
(1, '2025-11-15', 'adult', 45.00, 'credit'),
(1, '2025-11-15', 'child', 30.00, 'credit'),
(2, '2025-11-16', 'adult', 45.00, 'debit'),
(3, '2025-11-14', 'senior', 35.00, 'cash');


-- =======================================
-- EVENT REGISTRATIONS (Source: mock_data.sql, FKs adjusted)
-- =======================================
INSERT INTO event_registrations (event_id, customer_id, number_of_participants, total_amount, payment_status) VALUES
(1, 1, 2, 30.00, 'paid'),
(2, 2, 1, 10.00, 'paid'),
(3, 3, 3, 60.00, 'pending');


-- =======================================
-- Display Summary
-- =======================================
SELECT '========================================' as '';
SELECT 'SEED DATA LOADED SUCCESSFULLY' as '';
SELECT '========================================' as '';

SELECT 'Employees:' as '', COUNT(*) as count FROM employees;
SELECT 'Customers:' as '', COUNT(*) as count FROM customers;
SELECT 'User Accounts:' as '', COUNT(*) as count FROM user_accounts;
SELECT 'Animals:' as '', COUNT(*) as count FROM animals;
SELECT 'Events:' as '', COUNT(*) as count FROM events;
SELECT 'Tickets Sold:' as '', COUNT(*) as count FROM tickets;

SELECT '========================================' as '';
SELECT 'LOGIN CREDENTIALS (All passwords: "password")' as '';
SELECT '========================================' as '';

SELECT
    ua.account_id,
    ua.email,
    ua.role,
    CASE
        WHEN ua.employee_id IS NOT NULL THEN e.job_role
        ELSE 'customer'
    END as job_role,
    'password' as password
FROM user_accounts ua
LEFT JOIN employees e ON ua.employee_id = e.employee_id
LEFT JOIN customers c on ua.customer_id = c.customer_id
ORDER BY ua.role, ua.account_id;