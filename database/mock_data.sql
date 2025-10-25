-- Mock Data for Zoo Management System
-- Comprehensive test data for development and testing
-- Run this after applying zoo_schema.sql

USE zoo_database;

-- ========================================
-- EMPLOYEES
-- ========================================
INSERT INTO employees (first_name, last_name, email, phone, ssn, job_role, employment_type, salary, status, hire_date, gender) VALUES
('John', 'Smith', 'john.smith@zoo.com', '555-0101', '123-45-6789', 'manager', 'full_time', 75000.00, 'active', '2020-01-15', 'male'),
('Sarah', 'Johnson', 'sarah.johnson@zoo.com', '555-0102', '234-56-7890', 'keeper', 'full_time', 45000.00, 'active', '2021-03-20', 'female'),
('Mike', 'Chen', 'mike.chen@zoo.com', '555-0103', '345-67-8901', 'veterinarian', 'full_time', 85000.00, 'active', '2019-06-10', 'male'),
('Emma', 'Davis', 'emma.davis@zoo.com', '555-0104', '456-78-9012', 'keeper', 'part_time', NULL, 'active', '2022-09-01', 'female'),
('David', 'Lee', 'david.lee@zoo.com', '555-0105', '567-89-0123', 'coordinator', 'full_time', 55000.00, 'active', '2021-11-15', 'male'),
('Lisa', 'Martinez', 'lisa.martinez@zoo.com', '555-0106', '678-90-1234', 'guide', 'full_time', 40000.00, 'active', '2022-02-28', 'female'),
('James', 'Wilson', 'james.wilson@zoo.com', '555-0107', '789-01-2345', 'maintenance', 'full_time', 48000.00, 'active', '2020-07-12', 'male'),
('Rachel', 'Brown', 'rachel.brown@zoo.com', '555-0108', '890-12-3456', 'security', 'full_time', 50000.00, 'active', '2021-05-18', 'female'),
('Anna', 'Taylor', 'anna.taylor@zoo.com', '555-0109', '901-23-4567', 'cashier', 'part_time', NULL, 'active', '2023-01-10', 'female'),
('Tom', 'Garcia', 'tom.garcia@zoo.com', '555-0110', '012-34-5678', 'keeper', 'full_time', 46000.00, 'active', '2021-08-22', 'male');

-- ========================================
-- CUSTOMERS
-- ========================================
INSERT INTO customers (first_name, last_name, email, phone, address, city, state, zip_code, annual_pass, registration_date) VALUES
('Alice', 'Anderson', 'alice.anderson@email.com', '555-1001', '123 Maple St', 'Springfield', 'IL', '62701', 'yes', '2024-01-10'),
('Bob', 'Bennett', 'bob.bennett@email.com', '555-1002', '456 Oak Ave', 'Springfield', 'IL', '62702', 'no', '2024-02-15'),
('Carol', 'Carter', 'carol.carter@email.com', '555-1003', '789 Pine Rd', 'Bloomington', 'IL', '61701', 'yes', '2023-11-20'),
('Daniel', 'Dixon', 'daniel.dixon@email.com', '555-1004', '321 Elm St', 'Peoria', 'IL', '61602', 'no', '2024-03-05'),
('Emily', 'Evans', 'emily.evans@email.com', '555-1005', '654 Birch Ln', 'Champaign', 'IL', '61820', 'yes', '2023-12-01'),
('Frank', 'Foster', 'frank.foster@email.com', '555-1006', '987 Cedar Dr', 'Springfield', 'IL', '62703', 'no', '2024-01-25'),
('Grace', 'Green', 'grace.green@email.com', '555-1007', '147 Willow Way', 'Normal', 'IL', '61761', 'yes', '2023-10-15'),
('Henry', 'Harris', 'henry.harris@email.com', '555-1008', '258 Ash Ct', 'Springfield', 'IL', '62704', 'no', '2024-02-28'),
('Iris', 'Ingram', 'iris.ingram@email.com', '555-1009', '369 Spruce Pl', 'Decatur', 'IL', '62521', 'no', '2024-03-12'),
('Jack', 'Jackson', 'jack.jackson@email.com', '555-1010', '741 Redwood Rd', 'Springfield', 'IL', '62705', 'yes', '2023-09-30');

-- ========================================
-- USER ACCOUNTS (Employees)
-- ========================================
INSERT INTO user_accounts (username, email, role, employee_id) VALUES
('jsmith', 'john.smith@zoo.com', 'employee', 1),
('sjohnson', 'sarah.johnson@zoo.com', 'employee', 2),
('mchen', 'mike.chen@zoo.com', 'employee', 3),
('edavis', 'emma.davis@zoo.com', 'employee', 4),
('dlee', 'david.lee@zoo.com', 'employee', 5),
('lmartinez', 'lisa.martinez@zoo.com', 'employee', 6),
('jwilson', 'james.wilson@zoo.com', 'employee', 7),
('rbrown', 'rachel.brown@zoo.com', 'employee', 8),
('ataylor', 'anna.taylor@zoo.com', 'employee', 9),
('tgarcia', 'tom.garcia@zoo.com', 'employee', 10);

-- ========================================
-- USER ACCOUNTS (Customers) - Optional for testing
-- ========================================
INSERT INTO user_accounts (username, email, role, customer_id) VALUES
('aanderson', 'alice.anderson@email.com', 'customer', 1),
('bbennett', 'bob.bennett@email.com', 'customer', 2),
('ccarter', 'carol.carter@email.com', 'customer', 3);

-- ========================================
-- PASSWORDS (All passwords are "password")
-- ========================================
INSERT INTO passwords (account_id, password_hash) VALUES
(1, 'password'),   -- John Smith (Manager)
(2, 'password'),   -- Sarah Johnson (Keeper)
(3, 'password'),   -- Mike Chen (Veterinarian)
(4, 'password'),   -- Emma Davis (Keeper)
(5, 'password'),   -- David Lee (Coordinator)
(6, 'password'),   -- Lisa Martinez (Guide)
(7, 'password'),   -- James Wilson (Maintenance)
(8, 'password'),   -- Rachel Brown (Security)
(9, 'password'),   -- Anna Taylor (Cashier)
(10, 'password'),  -- Tom Garcia (Keeper)
(11, 'password'),  -- Alice Anderson (Customer)
(12, 'password'),  -- Bob Bennett (Customer)
(13, 'password');  -- Carol Carter (Customer)

-- ========================================
-- ATTRACTIONS
-- ========================================
INSERT INTO attractions (name, location, human_capacity, opening_time, closing_time, status) VALUES
('African Savanna', 'North Zone', 500, '09:00:00', '18:00:00', 'open'),
('Tropical Rainforest', 'East Zone', 300, '09:00:00', '18:00:00', 'open'),
('Arctic Tundra', 'West Zone', 250, '09:00:00', '18:00:00', 'open'),
('Aquatic Center', 'South Zone', 400, '10:00:00', '19:00:00', 'open'),
('Reptile House', 'Central Zone', 200, '09:00:00', '17:00:00', 'open');

-- ========================================
-- HABITATS
-- ========================================
INSERT INTO habitats (habitat_name, attraction_id, size, environment_type, animal_capacity, status) VALUES
('Lion Pride Rock', 1, 'Large', 'Grassland', 8, 'active'),
('Elephant Plains', 1, 'Extra Large', 'Savanna', 12, 'active'),
('Gorilla Forest', 2, 'Large', 'Tropical Forest', 6, 'active'),
('Penguin Cove', 3, 'Medium', 'Arctic', 25, 'active'),
('Polar Bear Den', 3, 'Large', 'Arctic', 4, 'active'),
('Dolphin Pool', 4, 'Extra Large', 'Aquatic', 8, 'active'),
('Snake Sanctuary', 5, 'Medium', 'Desert', 15, 'active');

-- ========================================
-- ANIMALS
-- ========================================
INSERT INTO animals (name, scientific_name, species, date_of_birth, arrival_date, gender, place_of_origin, habitat_id, health_status, active_status, endangerment_status, weight) VALUES
('Simba', 'Panthera leo', 'African Lion', '2018-05-12', '2019-06-15', 'male', 'South Africa', 1, 'excellent', 'active', 'vulnerable', 190.5),
('Nala', 'Panthera leo', 'African Lion', '2019-03-20', '2019-06-15', 'female', 'South Africa', 1, 'good', 'active', 'vulnerable', 130.2),
('Dumbo', 'Loxodonta africana', 'African Elephant', '2015-08-10', '2016-09-20', 'male', 'Kenya', 2, 'excellent', 'active', 'endangered', 5500.0),
('Koko', 'Gorilla gorilla', 'Western Gorilla', '2012-11-05', '2013-12-10', 'female', 'Congo', 3, 'good', 'active', 'critically_endangered', 85.0),
('Skipper', 'Aptenodytes forsteri', 'Emperor Penguin', '2020-07-15', '2021-01-10', 'male', 'Antarctica', 4, 'excellent', 'active', 'near_threatened', 23.5),
('Snowball', 'Ursus maritimus', 'Polar Bear', '2016-12-20', '2018-03-15', 'female', 'Arctic Circle', 5, 'good', 'active', 'vulnerable', 250.0),
('Flipper', 'Tursiops truncatus', 'Bottlenose Dolphin', '2017-09-08', '2019-04-20', 'male', 'Florida', 6, 'excellent', 'active', 'least_concern', 200.0),
('Monty', 'Python regius', 'Ball Python', '2021-03-15', '2022-05-10', 'male', 'Ghana', 7, 'good', 'active', 'least_concern', 1.8);

-- ========================================
-- EVENTS
-- ========================================
INSERT INTO events (name, description, event_date, start_time, end_time, location, max_participants, ticket_price, coordinator_id) VALUES
('Dolphin Show', 'Watch our amazing dolphins perform tricks and learn about marine conservation', '2025-11-15', '14:00:00', '15:00:00', 'Aquatic Center Amphitheater', 400, 15.00, 5),
('Penguin Feeding Time', 'Help our keepers feed the penguins and learn about their diet', '2025-11-10', '11:00:00', '11:30:00', 'Penguin Cove', 50, 10.00, 5),
('Lion Encounter', 'Get up close with our lions through the safe viewing area', '2025-11-20', '13:00:00', '14:00:00', 'African Savanna', 100, 20.00, 5),
('Kids Zoo Camp', 'Week-long summer camp for children ages 8-12', '2025-12-15', '09:00:00', '15:00:00', 'Education Center', 30, 250.00, 5),
('Night at the Zoo', 'Special after-hours tour experience with nocturnal animals', '2025-12-01', '19:00:00', '22:00:00', 'Various Locations', 150, 35.00, 5);

-- ========================================
-- GIFT SHOPS
-- ========================================
INSERT INTO gift_shops (name, location, opening_time, closing_time, manager_id) VALUES
('Safari Shop', 'Main Entrance', '09:00:00', '18:00:00', 1),
('Jungle Treasures', 'Tropical Rainforest', '09:30:00', '17:30:00', 1);

-- ========================================
-- CAFES
-- ========================================
INSERT INTO cafes (name, location, opening_time, closing_time, manager_id) VALUES
('Savanna Snacks', 'African Savanna Area', '10:00:00', '17:00:00', 1),
('Penguin Cafe', 'Arctic Tundra Zone', '10:00:00', '17:00:00', 1);

-- ========================================
-- GIFT SHOP ITEMS
-- ========================================
INSERT INTO gift_shop_items (gift_shop_id, name, description, category, price, cost, quantity_in_stock, supplier) VALUES
(1, 'Plush Lion', 'Soft and cuddly lion plushie', 'Toys', 19.99, 8.00, 150, 'ToyWorld Inc'),
(1, 'Zoo T-Shirt', 'Cotton t-shirt with zoo logo', 'Apparel', 24.99, 10.00, 200, 'Apparel Plus'),
(1, 'Animal Stickers', 'Pack of 20 animal stickers', 'Souvenirs', 4.99, 1.50, 500, 'Sticker Co'),
(2, 'Tropical Bird Poster', 'Beautiful rainforest bird poster', 'Art', 12.99, 5.00, 75, 'Art Prints Ltd');

-- ========================================
-- CAFE ITEMS
-- ========================================
INSERT INTO cafe_items (cafe_id, name, description, category, price, is_available) VALUES
(1, 'Burger', 'Classic beef burger with fries', 'Entrees', 12.99, TRUE),
(1, 'Hot Dog', 'All-beef hot dog', 'Entrees', 8.99, TRUE),
(1, 'French Fries', 'Crispy golden fries', 'Sides', 4.99, TRUE),
(1, 'Soda', 'Fountain drink', 'Beverages', 2.99, TRUE),
(2, 'Chicken Nuggets', 'Kids meal chicken nuggets', 'Entrees', 7.99, TRUE),
(2, 'Ice Cream', 'Soft serve ice cream cone', 'Desserts', 3.99, TRUE);

-- ========================================
-- TICKETS (Sample ticket sales)
-- ========================================
INSERT INTO tickets (customer_id, visit_date, ticket_type, price, payment_method) VALUES
(1, '2025-11-15', 'adult', 45.00, 'credit'),
(1, '2025-11-15', 'child', 30.00, 'credit'),
(2, '2025-11-16', 'adult', 45.00, 'debit'),
(3, '2025-11-14', 'senior', 35.00, 'cash'),
(4, '2025-12-05', 'adult', 45.00, 'online'),
(4, '2025-12-05', 'adult', 45.00, 'online');

-- ========================================
-- EVENT REGISTRATIONS
-- ========================================
INSERT INTO event_registrations (event_id, customer_id, number_of_participants, total_amount, payment_status) VALUES
(1, 1, 2, 30.00, 'paid'),
(2, 2, 1, 10.00, 'paid'),
(3, 3, 3, 60.00, 'pending'),
(5, 4, 2, 70.00, 'paid');

-- ========================================
-- Display Summary
-- ========================================
SELECT '========================================' as '';
SELECT 'MOCK DATA LOADED SUCCESSFULLY' as '';
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
ORDER BY ua.role, ua.account_id;
