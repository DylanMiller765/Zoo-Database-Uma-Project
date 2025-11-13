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
(8, 'Tom', 'Brown', 'tom.brown@zoo.com', '555-0108', '890-12-3456', 'maintenance', 'full_time', 42000.00, 'active', '2020-11-05', 'male'),
(9, 'Chris', 'Green', 'chris.green@zoo.com', '555-0109', '987-65-4321', 'keeper', 'full_time', 45000.00, 'active', '2023-08-01', 'male'),
(10, 'Jessica', 'Blue', 'jessica.blue@zoo.com', '555-0110', '876-54-3210', 'keeper', 'full_time', 45500.00, 'active', '2023-09-01', 'female'),
(11, 'Mark', 'White', 'mark.white@zoo.com', '555-0111', '765-43-2109', 'veterinarian', 'full_time', 86000.00, 'active', '2023-07-15', 'male'),
(12, 'Laura', 'Black', 'laura.black@zoo.com', '555-0112', '654-32-1098', 'keeper', 'part_time', NULL, 'active', '2024-01-10', 'female');

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
(8, 'tom.brown', 'tom.brown@zoo.com', 'employee', 8),
(12, 'chris.green', 'chris.green@zoo.com', 'employee', 9),
(13, 'jessica.blue', 'jessica.blue@zoo.com', 'employee', 10),
(14, 'mark.white', 'mark.white@zoo.com', 'employee', 11),
(15, 'laura.black', 'laura.black@zoo.com', 'employee', 12);

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
(11, 'password'), -- Robert Davis (Customer)
(12, 'password'),
(13, 'password'),
(14, 'password'),
(15, 'password');

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
('Snake Sanctuary', 5, 'Medium', 'Desert', 15, 'active'),
('Aviary', 2, 'Large', 'Tropical Forest', 50, 'active');

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
('Monty', 'Python regius', 'Ball Python', '2021-03-15', '2022-05-10', 'male', 'Ghana', 7, 'good', 'active', 'least_concern', 1.8),
('Zazu', 'Panthera leo', 'African Lion', '2020-01-01', '2021-01-01', 'male', 'Tanzania', 1, 'excellent', 'active', 'vulnerable', 180.0),
('Sarabi', 'Panthera leo', 'African Lion', '2019-05-20', '2021-01-01', 'female', 'Tanzania', 1, 'good', 'active', 'vulnerable', 120.5),
('Tantor', 'Loxodonta africana', 'African Elephant', '2010-02-15', '2012-03-01', 'male', 'Botswana', 2, 'excellent', 'active', 'endangered', 6000.0),
('Kala', 'Loxodonta africana', 'African Elephant', '2012-07-22', '2014-08-01', 'female', 'Botswana', 2, 'good', 'active', 'endangered', 4500.0),
('Kerchak', 'Gorilla gorilla', 'Western Gorilla', '2010-09-10', '2012-10-01', 'male', 'Cameroon', 3, 'excellent', 'active', 'critically_endangered', 150.0),
('Terk', 'Gorilla gorilla', 'Western Gorilla', '2011-11-05', '2013-12-01', 'female', 'Cameroon', 3, 'good', 'active', 'critically_endangered', 90.0),
('Pingu', 'Aptenodytes forsteri', 'Emperor Penguin', '2021-06-01', '2022-01-10', 'male', 'Antarctica', 4, 'excellent', 'active', 'near_threatened', 24.0),
('Pingi', 'Aptenodytes forsteri', 'Emperor Penguin', '2021-06-05', '2022-01-10', 'female', 'Antarctica', 4, 'excellent', 'active', 'near_threatened', 22.0),
('Pinga', 'Aptenodytes forsteri', 'Emperor Penguin', '2022-08-01', '2023-02-10', 'female', 'Antarctica', 4, 'good', 'active', 'near_threatened', 15.0),
('Kowalski', 'Aptenodytes forsteri', 'Emperor Penguin', '2020-07-15', '2021-01-10', 'male', 'Antarctica', 4, 'excellent', 'active', 'near_threatened', 23.5),
('Rico', 'Aptenodytes forsteri', 'Emperor Penguin', '2020-07-15', '2021-01-10', 'male', 'Antarctica', 4, 'excellent', 'active', 'near_threatened', 23.5),
('Lars', 'Ursus maritimus', 'Polar Bear', '2015-11-10', '2017-02-15', 'male', 'Norway', 5, 'good', 'active', 'vulnerable', 450.0),
('Echo', 'Tursiops truncatus', 'Bottlenose Dolphin', '2018-08-01', '2020-09-01', 'female', 'Mexico', 6, 'excellent', 'active', 'least_concern', 180.0),
('Coral', 'Tursiops truncatus', 'Bottlenose Dolphin', '2019-05-20', '2021-06-01', 'female', 'Mexico', 6, 'good', 'active', 'least_concern', 170.0),
('Kaa', 'Python reticulatus', 'Reticulated Python', '2020-01-15', '2021-02-10', 'male', 'Indonesia', 7, 'good', 'active', 'least_concern', 2.5),
('Nagini', 'Python bivittatus', 'Burmese Python', '2019-03-10', '2020-04-05', 'female', 'Myanmar', 7, 'excellent', 'active', 'vulnerable', 3.0),
('Salazar', 'Boa constrictor', 'Boa Constrictor', '2021-08-20', '2022-09-15', 'male', 'Colombia', 7, 'good', 'active', 'least_concern', 2.0),
('Medusa', 'Eunectes murinus', 'Green Anaconda', '2018-06-12', '2019-07-20', 'female', 'Brazil', 7, 'excellent', 'active', 'least_concern', 4.5),
('Basilisk', 'Varanus komodoensis', 'Komodo Dragon', '2017-09-30', '2018-11-01', 'male', 'Indonesia', 7, 'good', 'active', 'endangered', 70.0),
('Iago', 'Ara macao', 'Scarlet Macaw', '2022-01-10', '2023-02-01', 'male', 'Brazil', 8, 'excellent', 'active', 'least_concern', 1.0),
('Blu', 'Ara ararauna', 'Blue-and-yellow Macaw', '2022-02-15', '2023-03-01', 'male', 'Brazil', 8, 'excellent', 'active', 'least_concern', 1.2),
('Jewel', 'Ara ararauna', 'Blue-and-yellow Macaw', '2022-03-20', '2023-04-01', 'female', 'Brazil', 8, 'good', 'active', 'least_concern', 1.1),
('Touki', 'Ramphastos toco', 'Toco Toucan', '2021-05-10', '2022-06-01', 'male', 'Brazil', 8, 'excellent', 'active', 'least_concern', 0.6),
('Hedwig', 'Bubo scandiacus', 'Snowy Owl', '2020-08-01', '2021-09-01', 'female', 'Arctic', 8, 'good', 'active', 'vulnerable', 2.0),
('Errol', 'Cacatua galerita', 'Sulphur-crested Cockatoo', '2019-04-12', '2020-05-01', 'male', 'Australia', 8, 'excellent', 'active', 'least_concern', 0.9),
('Kevin', 'Phoenicopterus roseus', 'Greater Flamingo', '2022-06-30', '2023-07-01', 'male', 'Africa', 8, 'good', 'active', 'least_concern', 3.5),
('Becky', 'Gypaetus barbatus', 'Bearded Vulture', '2018-09-10', '2019-10-01', 'female', 'Himalayas', 8, 'excellent', 'active', 'near_threatened', 6.0),
('Nigel', 'Pelecanus conspicillatus', 'Australian Pelican', '2021-11-05', '2022-12-01', 'male', 'Australia', 8, 'good', 'active', 'least_concern', 5.0),
('Scuttle', 'Larus argentatus', 'Herring Gull', '2023-01-01', '2024-02-01', 'male', 'North America', 8, 'excellent', 'active', 'least_concern', 1.5);


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
(2, 'Tropical Bird Poster', 'Beautiful rainforest bird poster', 'Art', 12.99, 5.00, 75, 'Art Prints Ltd'),
(1, 'Plush Penguin', 'Soft and cuddly penguin plushie', 'Toys', 19.99, 8.00, 120, 'ToyWorld Inc'),
(1, 'Dolphin Keychain', 'Metal keychain with a dolphin charm', 'Souvenirs', 7.99, 2.50, 300, 'Sticker Co'),
(2, 'Zoo Mug', 'Ceramic mug with zoo animal illustrations', 'Homeware', 14.99, 6.00, 100, 'Apparel Plus'),
(1, 'Savanna Hat', 'Wide-brimmed hat for sun protection', 'Apparel', 29.99, 12.00, 80, 'Apparel Plus');

-- =======================================
-- CAFE ITEMS (Source: mock_data.sql)
-- =======================================
INSERT INTO cafe_items (cafe_id, name, description, category, price, is_available) VALUES
(1, 'Burger', 'Classic beef burger with fries', 'Entrees', 12.99, TRUE),
(1, 'Hot Dog', 'All-beef hot dog', 'Entrees', 8.99, TRUE),
(1, 'French Fries', 'Crispy golden fries', 'Sides', 4.99, TRUE),
(1, 'Soda', 'Fountain drink', 'Beverages', 2.99, TRUE),
(2, 'Chicken Nuggets', 'Kids meal chicken nuggets', 'Entrees', 7.99, TRUE),
(2, 'Ice Cream', 'Soft serve ice cream cone', 'Desserts', 3.99, TRUE),
(1, 'Pizza Slice', 'Slice of cheese or pepperoni pizza', 'Entrees', 6.99, TRUE),
(1, 'Salad', 'Fresh garden salad with choice of dressing', 'Sides', 7.49, TRUE),
(2, 'Coffee', 'Freshly brewed hot coffee', 'Beverages', 3.49, TRUE),
(2, 'Bottled Water', '500ml bottled water', 'Beverages', 2.49, TRUE);

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
-- ZOOKEEPER ASSIGNMENTS (Assigning keepers to animals)
-- =======================================
-- Mike Chen (employee_id: 2) and Anna Martinez (employee_id: 7) are keepers
INSERT INTO zookeeper_assignments (keeper_id, animal_id, shift) VALUES
-- Mike Chen assignments
(2, 1, 'Morning'), -- Simba
(2, 2, 'Morning'), -- Nala
(2, 5, 'Morning'), -- Skipper (Penguin)
(2, 7, 'Afternoon'), -- Flipper (Dolphin)
-- Anna Martinez assignments
(7, 3, 'Morning'), -- Dumbo (Elephant)
(7, 4, 'Morning'), -- Koko (Gorilla)
(7, 6, 'Afternoon'), -- Snowball (Polar Bear)
(7, 8, 'Weekly'); -- Monty (Python)

-- More assignments for new animals and keepers
INSERT INTO zookeeper_assignments (keeper_id, animal_id, shift) VALUES
-- Chris Green (keeper_id: 9) assignments
(9, 9, 'Morning'), -- Zazu (Lion)
(9, 10, 'Morning'), -- Sarabi (Lion)
(9, 11, 'Afternoon'), -- Tantor (Elephant)
(9, 12, 'Afternoon'), -- Kala (Elephant)
(9, 29, 'Morning'), -- Kevin (Flamingo)
(9, 30, 'Morning'), -- Becky (Vulture)

-- Jessica Blue (keeper_id: 10) assignments
(10, 13, 'Morning'), -- Kerchak (Gorilla)
(10, 14, 'Morning'), -- Terk (Gorilla)
(10, 15, 'Afternoon'), -- Pingu (Penguin)
(10, 16, 'Afternoon'), -- Pingi (Penguin)
(10, 17, 'Afternoon'), -- Pinga (Penguin)
(10, 18, 'Afternoon'), -- Kowalski (Penguin)
(10, 19, 'Afternoon'), -- Rico (Penguin)

-- Laura Black (keeper_id: 12) assignments
(12, 20, 'Morning'), -- Lars (Polar Bear)
(12, 21, 'Afternoon'), -- Echo (Dolphin)
(12, 22, 'Afternoon'), -- Coral (Dolphin)
(12, 23, 'Weekly'), -- Kaa (Python)
(12, 24, 'Weekly'), -- Nagini (Python)
(12, 25, 'Weekly'), -- Salazar (Boa)
(12, 26, 'Weekly'), -- Medusa (Anaconda)
(12, 27, 'Weekly'), -- Basilisk (Komodo Dragon)

-- Additional assignments for existing keepers
-- Mike Chen (employee_id: 2)
(2, 28, 'Morning'), -- Iago (Macaw)
(2, 31, 'Morning'), -- Nigel (Pelican)
-- Anna Martinez (employee_id: 7)
(7, 32, 'Morning'), -- Scuttle (Gull)
(7, 33, 'Afternoon'), -- Blu (Macaw)
(7, 34, 'Afternoon'), -- Jewel (Macaw)
(7, 35, 'Afternoon'), -- Touki (Toucan)
(7, 36, 'Afternoon'), -- Hedwig (Owl)
(7, 37, 'Afternoon'); -- Errol (Cockatoo)



-- =======================================
-- FEEDING SCHEDULES (Define feeding routines for each animal)
-- =======================================
INSERT INTO feeding_schedules (animal_id, food_description, frequency, scheduled_time, notes) VALUES
-- Simba (Lion) - 2 schedules
(1, 'Raw beef 15kg with bone', 'Daily', '09:00:00', 'Prime cuts, vary between beef and chicken. Monitor for dental health.'),
(1, 'Supplemental bones', 'Daily', '17:00:00', 'Large femur bones for enrichment and dental care'),

-- Nala (Lion) - 2 schedules
(2, 'Raw chicken/beef 10kg', 'Daily', '09:30:00', 'Smaller portions than male, alternate proteins daily'),
(2, 'Enrichment feeding', '3x per week', '16:00:00', 'Hide meat in various locations for natural hunting behavior'),

-- Dumbo (Elephant) - 3 schedules
(3, 'Hay 50kg', 'Daily', '07:00:00', 'Timothy hay primary diet'),
(3, 'Fruits and vegetables 30kg', 'Daily', '12:00:00', 'Apples, carrots, sweet potatoes, melons - vary daily'),
(3, 'Browse and branches', 'Daily', '16:00:00', 'Fresh tree branches for foraging behavior'),

-- Koko (Gorilla) - 3 schedules
(4, 'Fruits and leafy greens 8kg', 'Daily', '08:00:00', 'Bananas, apples, kale, romaine, celery'),
(4, 'Vegetables and protein 5kg', 'Daily', '14:00:00', 'Sweet potato, carrots, hard-boiled eggs, nuts'),
(4, 'Browse and enrichment', 'Daily', '18:00:00', 'Bamboo, branches, occasional insects'),

-- Skipper (Penguin) - 2 schedules
(5, 'Fresh fish (herring/capelin) 2kg', 'Twice daily', '10:00:00', 'Vitamin supplements mixed in'),
(5, 'Evening fish feeding', 'Daily', '17:30:00', 'Monitor for individual consumption'),

-- Snowball (Polar Bear) - 2 schedules
(6, 'Fish 20kg', 'Daily', '09:00:00', 'Salmon, trout, and mackerel'),
(6, 'Meat and enrichment', 'Daily', '15:00:00', 'Seal meat when available, frozen treats in summer'),

-- Flipper (Dolphin) - 3 schedules
(7, 'Fresh fish 18kg', 'Three times daily', '09:00:00', 'Herring, capelin - vitamin E supplement'),
(7, 'Mid-day feeding', 'Daily', '13:00:00', 'Monitor weight, adjust portions as needed'),
(7, 'Evening feeding with training', 'Daily', '17:00:00', 'Combined with enrichment and training session'),

-- Monty (Ball Python) - 1 schedule
(8, 'Frozen-thawed rat (adult)', 'Weekly', '19:00:00', 'Feed on Fridays, monitor for strike and consumption. Skip if recent shed.');

-- Feeding schedules for new animals
INSERT INTO feeding_schedules (animal_id, food_description, frequency, scheduled_time, notes) VALUES
-- New Lions (9, 10)
(9, 'Raw beef 15kg', 'Daily', '09:00:00', 'Vary protein sources.'),
(10, 'Raw chicken 10kg', 'Daily', '09:30:00', 'Monitor consumption.'),
-- New Elephants (11, 12)
(11, 'Hay 60kg and Fruits 40kg', 'Daily', '07:00:00', 'Primary diet of Timothy hay.'),
(12, 'Hay 55kg and Vegetables 35kg', 'Daily', '07:30:00', 'Ensure access to fresh water.'),
-- New Gorillas (13, 14)
(13, 'Fruits and leafy greens 10kg', 'Daily', '08:00:00', 'Include enrichment items.'),
(14, 'Fruits and leafy greens 9kg', 'Daily', '08:00:00', 'Monitor for food aggression.'),
-- New Penguins (15-19)
(15, 'Fresh fish (herring/capelin) 2.5kg', 'Twice daily', '10:00:00', 'With vitamin supplements.'),
(16, 'Fresh fish (herring/capelin) 2.5kg', 'Twice daily', '10:00:00', 'With vitamin supplements.'),
(17, 'Fresh fish (herring/capelin) 2kg', 'Twice daily', '10:00:00', 'Younger, smaller portions.'),
(18, 'Fresh fish (herring/capelin) 2.5kg', 'Twice daily', '10:00:00', 'With vitamin supplements.'),
(19, 'Fresh fish (herring/capelin) 2.5kg', 'Twice daily', '10:00:00', 'With vitamin supplements.'),
-- New Polar Bear (20)
(20, 'Fish 25kg and meat 5kg', 'Daily', '09:00:00', 'Include fatty fish like salmon.'),
-- New Dolphins (21, 22)
(21, 'Fresh fish 20kg', 'Three times daily', '09:00:00', 'Used in training sessions.'),
(22, 'Fresh fish 18kg', 'Three times daily', '09:00:00', 'Monitor weight closely.'),
-- New Reptiles (23-27)
(23, 'Frozen-thawed large rat', 'Every 2 weeks', '18:00:00', 'Ensure full consumption.'),
(24, 'Frozen-thawed rabbit', 'Every 2-3 weeks', '18:00:00', 'Monitor shedding cycle.'),
(25, 'Frozen-thawed medium rat', 'Weekly', '18:00:00', 'Normal feeding.'),
(26, 'Frozen-thawed piglet or large rabbit', 'Monthly', '18:00:00', 'Very large meal.'),
(27, 'Whole goat or large deer', 'Every 1-2 months', '12:00:00', 'Massive feeding, requires multiple keepers.'),
-- New Birds (28-37)
(28, 'Fruit and seed mix', 'Daily', '09:00:00', 'Include nuts for enrichment.'),
(29, 'Fruit and seed mix', 'Daily', '09:00:00', 'Ensure variety.'),
(30, 'Fruit and seed mix', 'Daily', '09:00:00', 'Monitor for favoritism.'),
(31, 'Chopped fruit and insects', 'Daily', '09:30:00', 'Loves grapes.'),
(32, 'Thawed mice or small rats', 'Daily', '20:00:00', 'Nocturnal feeding schedule.'),
(33, 'Seed mix with fresh vegetables', 'Daily', '09:00:00', 'Loves sunflower seeds.'),
(34, 'Specialized flamingo pellets and brine shrimp', 'Twice daily', '08:00:00', 'For color maintenance.'),
(35, 'Bone marrow and meat scraps', 'Daily', '11:00:00', 'Specialized diet.'),
(36, 'Whole fish (herring/mackerel)', 'Daily', '10:00:00', 'Swallows whole.'),
(37, 'Fish, insects, and scraps', 'Daily', '10:30:00', 'Opportunistic feeder.');



-- =======================================
-- FEEDING LOGS (Last 30 days of feeding records)
-- =======================================
-- Creating realistic patterns with some gaps to demonstrate compliance tracking
-- Using Mike Chen (keeper_id: 2) and Anna Martinez (keeper_id: 7)

-- Simba (Lion, animal_id: 1) - Mostly consistent, one gap
INSERT INTO feeding_logs (animal_id, keeper_id, feeding_time, food_given, quantity_given, notes) VALUES
(1, 2, DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 9 HOUR, 'Raw beef with bone', '15kg', 'Good appetite, very active'),
(1, 2, DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 17 HOUR, 'Femur bone', '2 large bones', 'Engaged with enrichment for 45 minutes'),
(1, 2, DATE_SUB(NOW(), INTERVAL 2 DAY) + INTERVAL 9 HOUR, 'Raw chicken', '15kg', 'Ate everything within 20 minutes'),
(1, 2, DATE_SUB(NOW(), INTERVAL 2 DAY) + INTERVAL 17 HOUR, 'Femur bone', '2 large bones', 'Normal behavior'),
(1, 2, DATE_SUB(NOW(), INTERVAL 3 DAY) + INTERVAL 9 HOUR, 'Raw beef', '15kg', 'Good appetite'),
(1, 2, DATE_SUB(NOW(), INTERVAL 4 DAY) + INTERVAL 9 HOUR, 'Raw beef', '15kg', 'Normal feeding'),
(1, 2, DATE_SUB(NOW(), INTERVAL 4 DAY) + INTERVAL 17 HOUR, 'Femur bone', '2 large bones', 'Good dental activity'),
(1, 2, DATE_SUB(NOW(), INTERVAL 5 DAY) + INTERVAL 9 HOUR, 'Raw chicken', '15kg', 'Excellent appetite'),
-- GAP on day 6 (missed evening feeding)
(1, 2, DATE_SUB(NOW(), INTERVAL 6 DAY) + INTERVAL 9 HOUR, 'Raw beef', '15kg', 'Normal'),
(1, 2, DATE_SUB(NOW(), INTERVAL 7 DAY) + INTERVAL 9 HOUR, 'Raw beef', '15kg', 'Good'),

-- Nala (Lion, animal_id: 2) - Very consistent
(2, 2, DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 9 HOUR + INTERVAL 30 MINUTE, 'Raw chicken', '10kg', 'Healthy appetite'),
(2, 2, DATE_SUB(NOW(), INTERVAL 2 DAY) + INTERVAL 9 HOUR + INTERVAL 30 MINUTE, 'Raw beef', '10kg', 'Normal feeding behavior'),
(2, 2, DATE_SUB(NOW(), INTERVAL 3 DAY) + INTERVAL 9 HOUR + INTERVAL 30 MINUTE, 'Raw chicken', '10kg', 'Good'),
(2, 2, DATE_SUB(NOW(), INTERVAL 3 DAY) + INTERVAL 16 HOUR, 'Enrichment - hidden meat', '3kg', 'Successfully foraged all portions'),
(2, 2, DATE_SUB(NOW(), INTERVAL 4 DAY) + INTERVAL 9 HOUR + INTERVAL 30 MINUTE, 'Raw beef', '10kg', 'Excellent'),
(2, 2, DATE_SUB(NOW(), INTERVAL 5 DAY) + INTERVAL 9 HOUR + INTERVAL 30 MINUTE, 'Raw chicken', '10kg', 'Normal'),
(2, 2, DATE_SUB(NOW(), INTERVAL 6 DAY) + INTERVAL 9 HOUR + INTERVAL 30 MINUTE, 'Raw beef', '10kg', 'Good appetite'),

-- Dumbo (Elephant, animal_id: 3) - Consistent, multiple feedings per day
(3, 7, DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 7 HOUR, 'Timothy hay', '50kg', 'Consumed throughout morning'),
(3, 7, DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 12 HOUR, 'Mixed fruits and vegetables', '30kg', 'Apples, carrots, sweet potatoes'),
(3, 7, DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 16 HOUR, 'Oak and willow branches', '20kg', 'Active foraging behavior'),
(3, 7, DATE_SUB(NOW(), INTERVAL 2 DAY) + INTERVAL 7 HOUR, 'Timothy hay', '50kg', 'Normal'),
(3, 7, DATE_SUB(NOW(), INTERVAL 2 DAY) + INTERVAL 12 HOUR, 'Watermelon, carrots, apples', '30kg', 'Very engaged with watermelon'),
(3, 7, DATE_SUB(NOW(), INTERVAL 2 DAY) + INTERVAL 16 HOUR, 'Mixed branches', '20kg', 'Good'),
(3, 7, DATE_SUB(NOW(), INTERVAL 3 DAY) + INTERVAL 7 HOUR, 'Timothy hay', '50kg', 'Excellent consumption'),
(3, 7, DATE_SUB(NOW(), INTERVAL 3 DAY) + INTERVAL 12 HOUR, 'Fruits and vegetables', '30kg', 'Normal'),

-- Koko (Gorilla, animal_id: 4) - Consistent
(4, 7, DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 8 HOUR, 'Fruits and leafy greens', '8kg', 'Bananas, kale, romaine - good appetite'),
(4, 7, DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 14 HOUR, 'Vegetables with eggs', '5kg', 'Sweet potato, 3 hard-boiled eggs, almonds'),
(4, 7, DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 18 HOUR, 'Bamboo shoots', '3kg', 'Very interested in bamboo today'),
(4, 7, DATE_SUB(NOW(), INTERVAL 2 DAY) + INTERVAL 8 HOUR, 'Mixed fruits and greens', '8kg', 'Normal feeding'),
(4, 7, DATE_SUB(NOW(), INTERVAL 2 DAY) + INTERVAL 14 HOUR, 'Vegetables with protein', '5kg', 'Good appetite'),
(4, 7, DATE_SUB(NOW(), INTERVAL 3 DAY) + INTERVAL 8 HOUR, 'Fruits and greens', '8kg', 'Excellent'),
(4, 7, DATE_SUB(NOW(), INTERVAL 3 DAY) + INTERVAL 14 HOUR, 'Vegetables and nuts', '5kg', 'Favored the almonds'),

-- Skipper (Penguin, animal_id: 5) - Twice daily, very consistent
(5, 2, DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 10 HOUR, 'Herring with vitamins', '2kg', 'Ate enthusiastically, vitamin supplement included'),
(5, 2, DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 17 HOUR + INTERVAL 30 MINUTE, 'Capelin', '1.5kg', 'Normal consumption'),
(5, 2, DATE_SUB(NOW(), INTERVAL 2 DAY) + INTERVAL 10 HOUR, 'Capelin with vitamins', '2kg', 'Good appetite'),
(5, 2, DATE_SUB(NOW(), INTERVAL 2 DAY) + INTERVAL 17 HOUR + INTERVAL 30 MINUTE, 'Herring', '1.5kg', 'Normal'),
(5, 2, DATE_SUB(NOW(), INTERVAL 3 DAY) + INTERVAL 10 HOUR, 'Herring with vitamins', '2kg', 'Excellent'),
(5, 2, DATE_SUB(NOW(), INTERVAL 3 DAY) + INTERVAL 17 HOUR + INTERVAL 30 MINUTE, 'Capelin', '1.5kg', 'Good'),
(5, 2, DATE_SUB(NOW(), INTERVAL 4 DAY) + INTERVAL 10 HOUR, 'Mixed fish with vitamins', '2kg', 'Normal'),

-- Snowball (Polar Bear, animal_id: 6) - Consistent with one gap
(6, 7, DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 9 HOUR, 'Salmon and trout', '20kg', 'Very active during feeding'),
(6, 7, DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 15 HOUR, 'Frozen fish treats', '5kg', 'Enrichment - played with ice blocks'),
(6, 7, DATE_SUB(NOW(), INTERVAL 2 DAY) + INTERVAL 9 HOUR, 'Mixed fish', '20kg', 'Good appetite'),
(6, 7, DATE_SUB(NOW(), INTERVAL 2 DAY) + INTERVAL 15 HOUR, 'Seal meat', '8kg', 'Special enrichment day'),
(6, 7, DATE_SUB(NOW(), INTERVAL 3 DAY) + INTERVAL 9 HOUR, 'Salmon', '20kg', 'Normal feeding'),
-- GAP on day 4 (missed afternoon feeding)
(6, 7, DATE_SUB(NOW(), INTERVAL 4 DAY) + INTERVAL 9 HOUR, 'Mackerel and salmon', '20kg', 'Excellent'),
(6, 7, DATE_SUB(NOW(), INTERVAL 5 DAY) + INTERVAL 9 HOUR, 'Mixed fish', '20kg', 'Good'),

-- Flipper (Dolphin, animal_id: 7) - Three times daily, very consistent
(7, 2, DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 9 HOUR, 'Herring with vitamin E', '6kg', 'Training session - responded well'),
(7, 2, DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 13 HOUR, 'Capelin', '6kg', 'Normal consumption'),
(7, 2, DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 17 HOUR, 'Herring with training', '6kg', 'Excellent training session, all behaviors performed'),
(7, 2, DATE_SUB(NOW(), INTERVAL 2 DAY) + INTERVAL 9 HOUR, 'Mixed fish with vitamin E', '6kg', 'Good appetite'),
(7, 2, DATE_SUB(NOW(), INTERVAL 2 DAY) + INTERVAL 13 HOUR, 'Herring', '6kg', 'Normal'),
(7, 2, DATE_SUB(NOW(), INTERVAL 2 DAY) + INTERVAL 17 HOUR, 'Capelin with training', '6kg', 'Worked on new behaviors'),
(7, 2, DATE_SUB(NOW(), INTERVAL 3 DAY) + INTERVAL 9 HOUR, 'Herring with vitamin E', '6kg', 'Excellent'),
(7, 2, DATE_SUB(NOW(), INTERVAL 3 DAY) + INTERVAL 13 HOUR, 'Mixed fish', '6kg', 'Good'),

-- Monty (Ball Python, animal_id: 8) - Weekly feeding, showing last 4 weeks
(8, 7, DATE_SUB(NOW(), INTERVAL 2 DAY) + INTERVAL 19 HOUR, 'Frozen-thawed adult rat', '1 rat', 'Successful strike and consumption, eating well'),
(8, 7, DATE_SUB(NOW(), INTERVAL 9 DAY) + INTERVAL 19 HOUR, 'Frozen-thawed adult rat', '1 rat', 'Normal feeding response'),
(8, 7, DATE_SUB(NOW(), INTERVAL 16 DAY) + INTERVAL 19 HOUR, 'Frozen-thawed adult rat', '1 rat', 'Good appetite'),
(8, 7, DATE_SUB(NOW(), INTERVAL 23 DAY) + INTERVAL 19 HOUR, 'Frozen-thawed adult rat', '1 rat', 'Excellent feeding response'),
(8, 7, DATE_SUB(NOW(), INTERVAL 30 DAY) + INTERVAL 19 HOUR, 'Frozen-thawed adult rat', '1 rat', 'Normal');

-- Feeding logs for new animals
INSERT INTO feeding_logs (animal_id, keeper_id, feeding_time, food_given, quantity_given, notes) VALUES
-- Zazu (Lion, 9) - Keeper: Chris (9)
(9, 9, DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 9 HOUR, 'Raw beef', '12kg', 'Good appetite'),
(9, 9, DATE_SUB(NOW(), INTERVAL 2 DAY) + INTERVAL 9 HOUR, 'Raw chicken', '12kg', 'Normal'),
(9, 9, DATE_SUB(NOW(), INTERVAL 3 DAY) + INTERVAL 9 HOUR, 'Raw beef', '12kg', 'Ate well'),

-- Tantor (Elephant, 11) - Keeper: Chris (9)
(11, 9, DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 7 HOUR, 'Hay', '60kg', 'Normal consumption'),
(11, 9, DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 12 HOUR, 'Fruits and vegetables', '35kg', 'Enjoyed the watermelon'),
(11, 9, DATE_SUB(NOW(), INTERVAL 2 DAY) + INTERVAL 7 HOUR, 'Hay', '60kg', 'Good appetite'),

-- Kerchak (Gorilla, 13) - Keeper: Jessica (10)
(13, 10, DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 8 HOUR, 'Fruits and leafy greens', '10kg', 'Ate all the bananas first'),
(13, 10, DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 14 HOUR, 'Vegetables and protein', '6kg', 'Normal'),
(13, 10, DATE_SUB(NOW(), INTERVAL 2 DAY) + INTERVAL 8 HOUR, 'Fruits and leafy greens', '10kg', 'Good'),

-- Pingu (Penguin, 15) - Keeper: Jessica (10)
(15, 10, DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 10 HOUR, 'Herring with vitamins', '2.5kg', 'Ate well'),
(15, 10, DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 17 HOUR, 'Capelin', '2kg', 'Normal'),
(15, 10, DATE_SUB(NOW(), INTERVAL 2 DAY) + INTERVAL 10 HOUR, 'Herring', '2.5kg', 'Good appetite'),

-- Lars (Polar Bear, 20) - Keeper: Laura (12)
(20, 12, DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 9 HOUR, 'Salmon and trout', '25kg', 'Very active'),
(20, 12, DATE_SUB(NOW(), INTERVAL 2 DAY) + INTERVAL 9 HOUR, 'Mixed fish', '25kg', 'Normal'),
(20, 12, DATE_SUB(NOW(), INTERVAL 3 DAY) + INTERVAL 9 HOUR, 'Salmon', '25kg', 'Good'),

-- Iago (Macaw, 28) - Keeper: Mike (2)
(28, 2, DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 9 HOUR, 'Fruit and seed mix', '100g', 'Very vocal today'),
(28, 2, DATE_SUB(NOW(), INTERVAL 2 DAY) + INTERVAL 9 HOUR, 'Fruit and seed mix', '100g', 'Normal'),

-- Hedwig (Snowy Owl, 32) - Keeper: Anna (7)
(32, 7, DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 20 HOUR, 'Thawed mice', '2 mice', 'Ate quickly'),
(32, 7, DATE_SUB(NOW(), INTERVAL 2 DAY) + INTERVAL 20 HOUR, 'Thawed mice', '2 mice', 'Normal');



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
SELECT 'Zookeeper Assignments:' as '', COUNT(*) as count FROM zookeeper_assignments;
SELECT 'Feeding Schedules:' as '', COUNT(*) as count FROM feeding_schedules;
SELECT 'Feeding Logs:' as '', COUNT(*) as count FROM feeding_logs;

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