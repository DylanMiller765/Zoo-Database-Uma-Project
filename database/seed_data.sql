-- Zoo Management System - Seed Data
-- Comprehensive test data for the Zoo Management System

USE zoo_database;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE notifications;
TRUNCATE TABLE donations;
TRUNCATE TABLE customer_payment_methods;
TRUNCATE TABLE membership_purchases;
TRUNCATE TABLE cafe_items;
TRUNCATE TABLE cafes;
TRUNCATE TABLE event_registrations;
TRUNCATE TABLE events;
TRUNCATE TABLE feeding_logs;
TRUNCATE TABLE feeding_schedules;
TRUNCATE TABLE gift_shop_items;
TRUNCATE TABLE gift_shops;
TRUNCATE TABLE zookeeper_assignments;
TRUNCATE TABLE animals;
TRUNCATE TABLE habitats;
TRUNCATE TABLE attractions;
TRUNCATE TABLE passwords;
TRUNCATE TABLE user_accounts;
TRUNCATE TABLE customers;
TRUNCATE TABLE employees;
SET FOREIGN_KEY_CHECKS = 1;

-- =======================================
-- EMPLOYEES
-- =======================================
INSERT INTO employees (employee_id, first_name, last_name, email, phone, ssn, job_role, employment_type, salary, status, hire_date, gender) VALUES
(1, 'Sarah', 'Johnson', 'sarah.johnson@zoo.com', '5550101101', '123-45-6789', 'manager', 'full_time', 75000.00, 'active', '2020-01-15', 'female'),
(2, 'Mike', 'Chen', 'mike.chen@zoo.com', '5550101102', '234-56-7890', 'keeper', 'full_time', 45000.00, 'active', '2021-03-20', 'male'),
(3, 'Emily', 'Rodriguez', 'emily.rodriguez@zoo.com', '5550101103', '345-67-8901', 'veterinarian', 'full_time', 85000.00, 'active', '2019-06-10', 'female'),
(4, 'David', 'Kim', 'david.kim@zoo.com', '5550101104', '456-78-9012', 'coordinator', 'full_time', 55000.00, 'active', '2022-02-01', 'male'),
(5, 'Lisa', 'Thompson', 'lisa.thompson@zoo.com', '5550101105', '567-89-0123', 'cashier', 'part_time', NULL, 'active', '2023-05-15', 'female'),
(6, 'James', 'Wilson', 'james.wilson@zoo.com', '5550101106', '678-90-1234', 'guide', 'part_time', NULL, 'active', '2023-07-01', 'male'),
(7, 'Anna', 'Martinez', 'anna.martinez@zoo.com', '5550101107', '789-01-2345', 'keeper', 'full_time', 46000.00, 'active', '2021-09-12', 'female'),
(8, 'Tom', 'Brown', 'tom.brown@zoo.com', '5550101108', '890-12-3456', 'maintenance', 'full_time', 42000.00, 'active', '2020-11-05', 'male'),
(9, 'Chris', 'Green', 'chris.green@zoo.com', '5550101109', '987-65-4321', 'keeper', 'full_time', 45000.00, 'active', '2023-08-01', 'male'),
(10, 'Jessica', 'Blue', 'jessica.blue@zoo.com', '5550101110', '876-54-3210', 'keeper', 'full_time', 45500.00, 'active', '2023-09-01', 'female'),
(11, 'Mark', 'White', 'mark.white@zoo.com', '5550101111', '765-43-2109', 'veterinarian', 'full_time', 86000.00, 'active', '2023-07-15', 'male'),
(12, 'Laura', 'Black', 'laura.black@zoo.com', '5550101112', '999-32-1098', 'keeper', 'part_time', NULL, 'active', '2024-01-10', 'female'),
(13, 'Sky', 'Jones', 'skyjones.vet@gmail.com', '5550101113', '654-32-1098', 'veterinarian', 'full_time', 86000.00, 'active', '2023-07-15', 'female');

-- =======================================
-- CUSTOMERS
-- =======================================
-- Maria Garcia has membership expiring in 20 days (for notification testing)
INSERT INTO customers (customer_id, first_name, last_name, email, phone, address, city, state, zip_code, annual_pass, membership_start_date, membership_end_date, registration_date) VALUES
(1, 'John', 'Smith', 'john.smith@email.com', '5551001101', '123 Main St', 'Springfield', 'IL', '62701', 'no', NULL, NULL, '2024-01-10'),
(2, 'Maria', 'Garcia', 'maria.garcia@email.com', '5551001102', '456 Oak Ave', 'Springfield', 'IL', '62702', 'yes', '2024-01-01', '2025-01-01', '2023-11-15'),
(3, 'Robert', 'Davis', 'robert.davis@email.com', '5551001103', '789 Pine Rd', 'Springfield', 'IL', '62703', 'no', NULL, NULL, '2024-02-20'),
(4, 'Sarah', 'Wilson', 'sarah.wilson@email.com', '5551001104', '321 Elm St', 'Springfield', 'IL', '62704', 'yes', '2024-06-01', '2025-06-01', '2024-05-15'),
(5, 'Michael', 'Johnson', 'michael.johnson@email.com', '5551001105', '654 Maple Dr', 'Springfield', 'IL', '62705', 'yes', '2024-03-15', '2025-03-15', '2024-03-01');

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
(15, 'laura.black', 'laura.black@zoo.com', 'employee', 12),
(18, 'sky.jones', 'skyjones.vet@gmail.com', 'employee', 13);

-- Customers
INSERT INTO user_accounts (account_id, username, email, role, customer_id) VALUES
(9, 'john.smith', 'john.smith@email.com', 'customer', 1),
(10, 'maria.garcia', 'maria.garcia@email.com', 'customer', 2),
(11, 'robert.davis', 'robert.davis@email.com', 'customer', 3),
(16, 'sarah.wilson', 'sarah.wilson@email.com', 'customer', 4),
(17, 'michael.johnson', 'michael.johnson@email.com', 'customer', 5);

-- =======================================
-- PASSWORDS
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
(15, 'password'),
(16, 'password'), -- Sarah Wilson (Customer)
(17, 'password'), -- Michael Johnson (Customer)
(18, 'password'); -- Sky Jones (veterinarian)

-- =======================================
-- ATTRACTIONS
-- =======================================
INSERT INTO attractions (name, location, human_capacity, opening_time, closing_time, status) VALUES
('African Savanna', 'North Zone', 500, '09:00:00', '18:00:00', 'open'),
('Tropical Rainforest', 'East Zone', 300, '09:00:00', '18:00:00', 'open'),
('Arctic Tundra', 'West Zone', 250, '09:00:00', '18:00:00', 'open'),
('Aquatic Center', 'South Zone', 400, '10:00:00', '19:00:00', 'open'),
('Reptile House', 'Central Zone', 200, '09:00:00', '17:00:00', 'open');

-- =======================================
-- HABITATS
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
-- ANIMALS
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
-- EVENTS
-- =======================================
INSERT INTO events (name, description, event_date, start_time, end_time, location, max_participants, ticket_price, coordinator_id) VALUES
-- Past Events
('Tiger Feeding Demonstration', 'Watch our experts safely feed the tigers with specialized techniques', '2025-09-15', '10:00:00', '11:00:00', 'Big Cat Arena', 200, 12.00, 4),
('Reptile Exhibition', 'Explore the world of snakes, lizards, and other reptiles up close', '2025-09-28', '14:00:00', '15:30:00', 'Reptile House', 100, 8.00, 4),
('Primate Discovery Walk', 'Guided tour through our primate exhibits with interactive experiences', '2025-10-10', '11:00:00', '12:30:00', 'Primate Territory', 75, 10.00, 4),
('Butterfly Garden Workshop', 'Learn about monarch butterflies and pollination in our gardens', '2025-10-22', '13:00:00', '14:00:00', 'Botanical Garden', 60, 7.00, 4),
('Avian Training Show', 'See our trained birds perform impressive aerial displays', '2025-11-05', '15:00:00', '16:00:00', 'Bird Sanctuary Theater', 150, 15.00, 4),
('Aquatic Creature Talk', 'Educational presentation about marine conservation and aquatic life', '2025-11-12', '10:30:00', '11:30:00', 'Aquatic Center Amphitheater', 250, 10.00, 4),

-- Upcoming Events
('Dolphin Show', 'Watch our amazing dolphins perform tricks and learn about marine conservation', '2025-11-21', '14:00:00', '15:00:00', 'Aquatic Center Amphitheater', 400, 15.00, 4),
('Penguin Feeding Time', 'Help our keepers feed the penguins and learn about their diet', '2025-11-28', '11:00:00', '11:30:00', 'Penguin Cove', 50, 10.00, 4),
('Lion Encounter', 'Get up close with our lions through the safe viewing area', '2025-12-05', '13:00:00', '14:00:00', 'African Savanna', 100, 20.00, 4),
('Kids Zoo Camp', 'Week-long summer camp for children ages 8-12', '2025-12-15', '09:00:00', '15:00:00', 'Education Center', 30, 250.00, 4),
('Night at the Zoo', 'Special after-hours tour experience with nocturnal animals', '2025-12-22', '19:00:00', '22:00:00', 'Various Locations', 150, 35.00, 4);

-- =======================================
-- GIFT SHOPS
-- =======================================
INSERT INTO gift_shops (gift_shop_id, name, location, opening_time, closing_time, manager_id) VALUES
(1, 'Zoo Gift Shop', 'Main Entrance', '09:00:00', '18:00:00', 1);

-- =======================================
-- CAFES
-- =======================================
INSERT INTO cafes (cafe_id, name, location, opening_time, closing_time, manager_id) VALUES
(1, 'Zoo Cafe', 'Central Plaza', '10:00:00', '17:00:00', 1);

-- =======================================
-- GIFT SHOP ITEMS
-- =======================================
INSERT INTO gift_shop_items (gift_shop_id, name, description, category, price, cost, quantity_in_stock, supplier) VALUES
(1, 'Plush Lion', 'Soft and cuddly lion plushie', 'Toys', 19.99, 8.00, 150, 'ToyWorld Inc'),
(1, 'Zoo T-Shirt', 'Cotton t-shirt with zoo logo', 'Apparel', 24.99, 10.00, 200, 'Apparel Plus'),
(1, 'Animal Stickers', 'Pack of 20 animal stickers', 'Souvenirs', 4.99, 1.50, 500, 'Sticker Co'),
(1, 'Tropical Bird Poster', 'Beautiful rainforest bird poster', 'Art', 12.99, 5.00, 75, 'Art Prints Ltd'),
(1, 'Plush Penguin', 'Soft and cuddly penguin plushie', 'Toys', 19.99, 8.00, 120, 'ToyWorld Inc'),
(1, 'Dolphin Keychain', 'Metal keychain with a dolphin charm', 'Souvenirs', 7.99, 2.50, 300, 'Sticker Co'),
(1, 'Zoo Mug', 'Ceramic mug with zoo animal illustrations', 'Homeware', 14.99, 6.00, 100, 'Apparel Plus'),
(1, 'Savanna Hat', 'Wide-brimmed hat for sun protection', 'Apparel', 29.99, 12.00, 80, 'Apparel Plus'),
(1, 'Plush Elephant', 'Adorable elephant stuffed animal', 'Toys', 22.99, 9.00, 100, 'ToyWorld Inc'),
(1, 'Zoo Backpack', 'Canvas backpack with animal prints', 'Apparel', 34.99, 15.00, 60, 'Apparel Plus');

-- =======================================
-- CAFE ITEMS
-- =======================================
INSERT INTO cafe_items (cafe_id, name, description, category, price) VALUES
(1, 'Burger', 'Classic beef burger with fries', 'Entrees', 12.99),
(1, 'Hot Dog', 'All-beef hot dog', 'Entrees', 8.99),
(1, 'French Fries', 'Crispy golden fries', 'Sides', 4.99),
(1, 'Soda', 'Fountain drink', 'Beverages', 2.99),
(1, 'Chicken Nuggets', 'Kids meal chicken nuggets', 'Entrees', 7.99),
(1, 'Ice Cream', 'Soft serve ice cream cone', 'Desserts', 3.99),
(1, 'Pizza Slice', 'Slice of cheese or pepperoni pizza', 'Entrees', 6.99),
(1, 'Salad', 'Fresh garden salad with choice of dressing', 'Sides', 7.49),
(1, 'Coffee', 'Freshly brewed hot coffee', 'Beverages', 3.49),
(1, 'Bottled Water', '500ml bottled water', 'Beverages', 2.49),
(1, 'Sandwich', 'Turkey and cheese sandwich', 'Entrees', 9.99),
(1, 'Cookies', 'Chocolate chip cookies (3 pack)', 'Desserts', 4.99);

-- =======================================
-- EVENT REGISTRATIONS
-- =======================================
INSERT INTO event_registrations (event_id, customer_id, number_of_participants, total_amount, payment_status, registration_date) VALUES
(1, 1, 2, 30.00, 'paid', '2024-01-10 10:00:00'),
(1, 2, 1, 15.00, 'paid', '2024-01-12 14:30:00'),
(1, NULL, 3, 45.00, 'paid', '2024-01-15 09:15:00'),
(1, 3, 2, 30.00, 'pending', '2024-01-18 11:00:00'),
(1, 1, 4, 60.00, 'paid', '2024-01-20 13:45:00'),
(1, NULL, 1, 15.00, 'paid', '2024-01-25 10:30:00'),
(1, 2, 2, 30.00, 'cancelled', '2024-01-28 15:00:00'),
(1, 3, 3, 45.00, 'paid', '2024-02-01 09:00:00'),
(1, NULL, 2, 30.00, 'paid', '2024-02-05 12:00:00'),
(1, 1, 1, 15.00, 'pending', '2024-02-08 14:15:00'),
(2, 2, 1, 10.00, 'paid', '2024-01-08 10:00:00'),
(2, 3, 2, 20.00, 'paid', '2024-01-15 11:30:00'),
(2, NULL, 1, 10.00, 'paid', '2024-01-20 09:45:00'),
(2, 1, 3, 30.00, 'pending', '2024-01-25 13:00:00'),
(2, NULL, 2, 20.00, 'paid', '2024-02-02 10:15:00'),
(2, 2, 1, 10.00, 'paid', '2024-02-10 14:30:00'),
(2, 3, 2, 20.00, 'cancelled', '2024-02-15 11:00:00'),
(2, NULL, 1, 10.00, 'paid', '2024-02-20 09:30:00'),
(2, 1, 3, 30.00, 'paid', '2024-02-25 12:45:00'),
(2, 2, 2, 20.00, 'pending', '2024-03-01 10:00:00'),
(3, 3, 3, 60.00, 'pending', '2024-01-05 14:00:00'),
(3, 1, 2, 40.00, 'paid', '2024-01-12 10:30:00'),
(3, 2, 1, 20.00, 'paid', '2024-01-18 13:15:00'),
(3, NULL, 4, 80.00, 'paid', '2024-01-25 09:00:00'),
(3, 3, 2, 40.00, 'paid', '2024-02-01 11:45:00'),
(3, NULL, 3, 60.00, 'pending', '2024-02-08 14:20:00'),
(3, 1, 1, 20.00, 'paid', '2024-02-14 10:15:00'),
(3, 2, 2, 40.00, 'cancelled', '2024-02-20 12:30:00'),
(3, NULL, 3, 60.00, 'paid', '2024-02-27 09:45:00'),
(3, 3, 2, 40.00, 'paid', '2024-03-05 13:00:00'),
(4, 1, 1, 250.00, 'paid', '2024-01-02 09:00:00'),
(4, 2, 2, 500.00, 'paid', '2024-01-10 11:30:00'),
(4, NULL, 1, 250.00, 'pending', '2024-01-20 14:15:00'),
(4, 3, 3, 750.00, 'paid', '2024-02-01 10:00:00'),
(4, 1, 2, 500.00, 'cancelled', '2024-02-10 13:45:00'),
(4, NULL, 1, 250.00, 'paid', '2024-02-20 09:30:00'),
(4, 2, 1, 250.00, 'pending', '2024-03-01 11:00:00'),
(4, 3, 2, 500.00, 'paid', '2024-03-10 14:20:00'),
(5, 2, 2, 70.00, 'paid', '2024-01-15 10:00:00'),
(5, 3, 1, 35.00, 'paid', '2024-01-20 13:30:00'),
(5, NULL, 3, 105.00, 'pending', '2024-01-28 09:45:00'),
(5, 1, 2, 70.00, 'paid', '2024-02-05 11:15:00'),
(5, NULL, 4, 140.00, 'paid', '2024-02-12 14:00:00'),
(5, 2, 1, 35.00, 'cancelled', '2024-02-18 10:30:00'),
(5, 3, 2, 70.00, 'paid', '2024-02-25 12:45:00'),
(5, NULL, 3, 105.00, 'paid', '2024-03-05 09:15:00'),
(1, 2, 2, 30.00, 'paid', '2024-03-10 10:00:00'),
(1, NULL, 3, 45.00, 'pending', '2024-03-15 14:30:00'),
(1, 3, 1, 15.00, 'paid', '2024-03-20 09:00:00'),
(2, 1, 2, 20.00, 'paid', '2024-03-08 11:00:00'),
(2, NULL, 1, 10.00, 'pending', '2024-03-18 13:15:00'),
(3, 2, 2, 40.00, 'paid', '2024-03-12 10:30:00'),
(3, 1, 3, 60.00, 'paid', '2024-03-22 14:00:00'),
(4, NULL, 2, 500.00, 'pending', '2024-03-25 09:30:00'),
(4, 3, 1, 250.00, 'paid', '2024-04-01 11:45:00'),
(5, 1, 2, 70.00, 'paid', '2024-03-28 10:15:00'),
(5, 2, 3, 105.00, 'cancelled', '2024-04-05 13:00:00'),
(1, 1, 4, 60.00, 'paid', '2024-04-10 09:00:00'),
(2, 3, 2, 20.00, 'paid', '2024-04-12 11:30:00'),
(3, NULL, 1, 20.00, 'pending', '2024-04-15 14:45:00'),
(1, 2, 1, 15.00, 'paid', '2024-04-20 10:00:00'),
(5, NULL, 2, 70.00, 'paid', '2024-04-25 12:15:00'),
(4, 1, 1, 250.00, 'pending', '2024-05-01 09:30:00'),
(2, 2, 3, 30.00, 'paid', '2024-05-05 13:00:00'),
(3, 3, 2, 40.00, 'paid', '2024-05-10 10:45:00'),
(1, NULL, 2, 30.00, 'paid', '2024-05-15 14:20:00'),
(5, 1, 1, 35.00, 'cancelled', '2024-05-20 09:15:00'),
(4, 2, 3, 750.00, 'paid', '2024-06-01 11:00:00'),
(1, 3, 3, 45.00, 'paid', '2024-06-10 10:30:00'),
(2, NULL, 1, 10.00, 'pending', '2024-06-15 13:45:00'),
(3, 1, 2, 40.00, 'paid', '2024-06-20 09:00:00'),
(5, 2, 2, 70.00, 'paid', '2024-06-25 12:30:00'),
(1, 2, 2, 30.00, 'paid', '2024-07-05 10:00:00'),
(2, 3, 2, 20.00, 'paid', '2024-07-10 14:15:00'),
(3, NULL, 3, 60.00, 'pending', '2024-07-15 09:30:00'),
(4, 1, 2, 500.00, 'paid', '2024-07-20 11:45:00'),
(5, NULL, 3, 105.00, 'paid', '2024-07-25 13:00:00'),
(1, 3, 1, 15.00, 'paid', '2024-08-05 10:30:00'),
(2, 1, 3, 30.00, 'paid', '2024-08-10 12:00:00'),
(3, 2, 2, 40.00, 'cancelled', '2024-08-15 09:45:00'),
(4, NULL, 1, 250.00, 'pending', '2024-08-20 14:30:00'),
(5, 3, 2, 70.00, 'paid', '2024-08-25 10:15:00'),
(1, NULL, 2, 30.00, 'paid', '2024-09-01 11:00:00'),
(2, 2, 1, 10.00, 'paid', '2024-09-08 13:30:00'),
(3, 1, 3, 60.00, 'paid', '2024-09-15 09:00:00'),
(4, 3, 2, 500.00, 'pending', '2024-09-20 10:45:00'),
(5, NULL, 1, 35.00, 'paid', '2024-09-25 12:15:00'),
(1, 2, 3, 45.00, 'paid', '2024-10-05 10:00:00'),
(2, NULL, 2, 20.00, 'paid', '2024-10-10 14:00:00'),
(3, 3, 1, 20.00, 'pending', '2024-10-15 09:30:00'),
(4, 1, 1, 250.00, 'paid', '2024-10-20 11:15:00'),
(5, 2, 2, 70.00, 'cancelled', '2024-10-25 13:45:00'),
(1, 3, 2, 30.00, 'paid', '2024-11-01 10:30:00'),
(2, 1, 3, 30.00, 'paid', '2024-11-05 12:00:00'),
(3, NULL, 2, 40.00, 'paid', '2024-11-10 09:45:00'),
(4, 2, 2, 500.00, 'pending', '2024-11-15 14:20:00'),
(5, 3, 3, 105.00, 'paid', '2024-11-20 10:15:00'),
(1, NULL, 1, 15.00, 'paid', '2024-12-01 11:00:00'),
(2, 2, 2, 20.00, 'paid', '2024-12-05 13:30:00'),
(3, 1, 3, 60.00, 'paid', '2024-12-10 09:00:00'),
(4, NULL, 1, 250.00, 'cancelled', '2024-12-15 10:45:00'),
(5, 3, 2, 70.00, 'paid', '2024-12-20 12:15:00'),
-- Event 6: Aquatic Creature Talk (2025-11-12) - $10.00 per person
(6, 1, 2, 20.00, 'paid', '2025-10-25 10:00:00'),
(6, 2, 1, 10.00, 'paid', '2025-10-28 14:30:00'),
(6, 3, 3, 30.00, 'paid', '2025-11-01 09:15:00'),
(6, NULL, 2, 20.00, 'paid', '2025-11-03 11:00:00'),
(6, 1, 4, 40.00, 'pending', '2025-11-05 13:45:00'),
(6, 2, 1, 10.00, 'paid', '2025-11-08 10:30:00'),
-- Event 7: Dolphin Show (2025-11-21) - $15.00 per person
(7, 1, 2, 30.00, 'paid', '2025-11-10 10:00:00'),
(7, 2, 1, 15.00, 'paid', '2025-11-12 14:00:00'),
(7, 3, 3, 45.00, 'paid', '2025-11-13 09:30:00'),
(7, NULL, 2, 30.00, 'pending', '2025-11-14 11:15:00'),
(7, 1, 4, 60.00, 'paid', '2025-11-15 13:00:00'),
(7, NULL, 1, 15.00, 'paid', '2025-11-16 10:45:00'),
-- Event 8: Penguin Feeding Time (2025-11-28) - $10.00 per person
(8, 2, 2, 20.00, 'paid', '2025-11-12 10:00:00'),
(8, 3, 1, 10.00, 'paid', '2025-11-14 13:30:00'),
(8, 1, 3, 30.00, 'paid', '2025-11-15 09:45:00'),
(8, NULL, 2, 20.00, 'pending', '2025-11-16 12:00:00'),
(8, 2, 1, 10.00, 'paid', '2025-11-17 14:15:00'),
-- Event 9: Lion Encounter (2025-12-05) - $20.00 per person
(9, 1, 2, 40.00, 'paid', '2025-11-15 10:00:00'),
(9, 2, 2, 40.00, 'paid', '2025-11-16 14:30:00'),
(9, 3, 1, 20.00, 'paid', '2025-11-17 09:15:00'),
(9, NULL, 3, 60.00, 'pending', '2025-11-18 11:00:00'),
(9, 1, 1, 20.00, 'paid', '2025-11-18 13:45:00'),
(9, NULL, 2, 40.00, 'paid', '2025-11-19 10:30:00'),
-- Event 10: Kids Zoo Camp (2025-12-15) - $250.00 per person
(10, 1, 1, 250.00, 'paid', '2025-10-20 10:00:00'),
(10, 2, 2, 500.00, 'paid', '2025-11-01 14:30:00'),
(10, NULL, 1, 250.00, 'paid', '2025-11-10 09:45:00'),
(10, 3, 1, 250.00, 'pending', '2025-11-15 11:15:00'),
-- Event 11: Night at the Zoo (2025-12-22) - $35.00 per person
(11, 1, 2, 70.00, 'paid', '2025-11-10 10:00:00'),
(11, 2, 1, 35.00, 'paid', '2025-11-13 14:00:00'),
(11, 3, 3, 105.00, 'paid', '2025-11-14 09:30:00'),
(11, NULL, 2, 70.00, 'pending', '2025-11-15 12:00:00'),
(11, 1, 4, 140.00, 'paid', '2025-11-16 13:45:00'),
(11, NULL, 1, 35.00, 'paid', '2025-11-17 10:30:00');


-- =======================================
-- DONATIONS
-- =======================================
INSERT INTO donations (customer_id, amount, donation_date, message) VALUES
(1, 50.00, '2024-01-15 16:00:00', 'Happy to support the zoo!'),
(2, 100.00, '2024-02-10 14:30:00', 'For the penguin habitat'),
(3, 25.00, '2024-03-05 11:00:00', NULL),
(1, 75.00, '2024-04-12 15:45:00', 'Love the animals'),
(2, 150.00, '2024-05-20 10:30:00', 'Conservation is important'),
(4, 200.00, '2024-06-08 13:00:00', 'For endangered species'),
(5, 30.00, '2024-07-04 09:15:00', NULL),
(1, 40.00, '2024-08-15 14:20:00', 'Keep up the great work!'),
(3, 60.00, '2024-09-10 11:45:00', 'For the lions'),
(2, 125.00, '2024-10-05 16:30:00', 'In memory of my grandmother'),
(4, 80.00, '2024-11-12 12:00:00', NULL),
(5, 45.00, '2024-12-01 10:15:00', 'Merry Christmas!'),
(1, 100.00, '2024-02-28 13:30:00', 'Annual donation'),
(3, 35.00, '2024-04-18 15:00:00', NULL),
(2, 90.00, '2024-06-22 11:30:00', 'For animal enrichment programs'),
(4, 55.00, '2024-08-30 14:45:00', 'Supporting conservation'),
(5, 120.00, '2024-10-18 09:00:00', 'For the new aquatic center'),
(1, 65.00, '2024-11-25 16:00:00', 'Thanksgiving donation'),
(3, 110.00, '2024-01-28 12:30:00', 'For veterinary care'),
(2, 85.00, '2024-03-22 10:45:00', NULL);

-- =======================================
-- ZOOKEEPER ASSIGNMENTS
-- =======================================
INSERT INTO zookeeper_assignments (keeper_id, animal_id, shift) VALUES
(2, 1, 'Morning'), (2, 2, 'Morning'), (2, 5, 'Morning'), (2, 7, 'Afternoon'),
(7, 3, 'Morning'), (7, 4, 'Morning'), (7, 6, 'Afternoon'), (7, 8, 'Weekly'),
(9, 9, 'Morning'), (9, 10, 'Morning'), (9, 11, 'Afternoon'), (9, 12, 'Afternoon'),
(9, 29, 'Morning'), (9, 30, 'Morning'),
(10, 13, 'Morning'), (10, 14, 'Morning'), (10, 15, 'Afternoon'), (10, 16, 'Afternoon'),
(10, 17, 'Afternoon'), (10, 18, 'Afternoon'), (10, 19, 'Afternoon'),
(12, 20, 'Morning'), (12, 21, 'Afternoon'), (12, 22, 'Afternoon'), (12, 23, 'Weekly'),
(12, 24, 'Weekly'), (12, 25, 'Weekly'), (12, 26, 'Weekly'), (12, 27, 'Weekly'),
(2, 28, 'Morning'), (2, 31, 'Morning'),
(7, 32, 'Morning'), (7, 33, 'Afternoon'), (7, 34, 'Afternoon'), (7, 35, 'Afternoon'),
(7, 36, 'Afternoon'), (7, 37, 'Afternoon');



-- =======================================
-- FEEDING SCHEDULES
-- =======================================
INSERT INTO feeding_schedules (animal_id, food_description, frequency, scheduled_time, notes) VALUES
(1, 'Raw beef 15kg with bone', 'Daily', '09:00:00', 'Prime cuts, vary between beef and chicken'),
(1, 'Supplemental bones', 'Daily', '17:00:00', 'Large femur bones for enrichment'),
(2, 'Raw chicken/beef 10kg', 'Daily', '09:30:00', 'Alternate proteins daily'),
(2, 'Enrichment feeding', '3x per week', '16:00:00', 'Hide meat for natural hunting behavior'),
(3, 'Hay 50kg', 'Daily', '07:00:00', 'Timothy hay primary diet'),
(3, 'Fruits and vegetables 30kg', 'Daily', '12:00:00', 'Apples, carrots, sweet potatoes'),
(3, 'Browse and branches', 'Daily', '16:00:00', 'Fresh tree branches'),
(4, 'Fruits and leafy greens 8kg', 'Daily', '08:00:00', 'Bananas, apples, kale, romaine'),
(4, 'Vegetables and protein 5kg', 'Daily', '14:00:00', 'Sweet potato, eggs, nuts'),
(4, 'Browse and enrichment', 'Daily', '18:00:00', 'Bamboo, branches, insects'),
(5, 'Fresh fish 2kg', 'Twice daily', '10:00:00', 'Herring/capelin with vitamins'),
(5, 'Evening fish feeding', 'Daily', '17:30:00', 'Monitor consumption'),
(6, 'Fish 20kg', 'Daily', '09:00:00', 'Salmon, trout, mackerel'),
(6, 'Meat and enrichment', 'Daily', '15:00:00', 'Seal meat or frozen treats'),
(7, 'Fresh fish 18kg', 'Three times daily', '09:00:00', 'Herring, capelin with vitamin E'),
(7, 'Mid-day feeding', 'Daily', '13:00:00', 'Monitor weight'),
(7, 'Evening feeding with training', 'Daily', '17:00:00', 'Enrichment and training'),
(8, 'Frozen-thawed rat (adult)', 'Weekly', '19:00:00', 'Feed Fridays, monitor strike');

INSERT INTO feeding_schedules (animal_id, food_description, frequency, scheduled_time, notes) VALUES
(9, 'Raw beef 15kg', 'Daily', '09:00:00', 'Vary protein sources'),
(10, 'Raw chicken 10kg', 'Daily', '09:30:00', 'Monitor consumption'),
(11, 'Hay 60kg and Fruits 40kg', 'Daily', '07:00:00', 'Timothy hay primary'),
(12, 'Hay 55kg and Vegetables 35kg', 'Daily', '07:30:00', 'Fresh water access'),
(13, 'Fruits and leafy greens 10kg', 'Daily', '08:00:00', 'Enrichment items'),
(14, 'Fruits and leafy greens 9kg', 'Daily', '08:00:00', 'Monitor aggression'),
(15, 'Fresh fish 2.5kg', 'Twice daily', '10:00:00', 'With vitamins'),
(16, 'Fresh fish 2.5kg', 'Twice daily', '10:00:00', 'With vitamins'),
(17, 'Fresh fish 2kg', 'Twice daily', '10:00:00', 'Smaller portions'),
(18, 'Fresh fish 2.5kg', 'Twice daily', '10:00:00', 'With vitamins'),
(19, 'Fresh fish 2.5kg', 'Twice daily', '10:00:00', 'With vitamins'),
(20, 'Fish 25kg and meat 5kg', 'Daily', '09:00:00', 'Fatty fish'),
(21, 'Fresh fish 20kg', 'Three times daily', '09:00:00', 'Training sessions'),
(22, 'Fresh fish 18kg', 'Three times daily', '09:00:00', 'Weight monitoring'),
(23, 'Frozen-thawed large rat', 'Every 2 weeks', '18:00:00', 'Full consumption'),
(24, 'Frozen-thawed rabbit', 'Every 2-3 weeks', '18:00:00', 'Shedding cycle'),
(25, 'Frozen-thawed medium rat', 'Weekly', '18:00:00', 'Normal feeding'),
(26, 'Frozen-thawed rabbit', 'Monthly', '18:00:00', 'Large meal'),
(27, 'Whole goat or deer', 'Every 1-2 months', '12:00:00', 'Multiple keepers'),
(28, 'Fruit and seed mix', 'Daily', '09:00:00', 'Nuts enrichment'),
(29, 'Fruit and seed mix', 'Daily', '09:00:00', 'Variety'),
(30, 'Fruit and seed mix', 'Daily', '09:00:00', 'Monitor variety'),
(31, 'Chopped fruit and insects', 'Daily', '09:30:00', 'Grapes favorite'),
(32, 'Thawed mice or small rats', 'Daily', '20:00:00', 'Nocturnal'),
(33, 'Seed mix and vegetables', 'Daily', '09:00:00', 'Sunflower seeds'),
(34, 'Flamingo pellets and brine shrimp', 'Twice daily', '08:00:00', 'Color maintenance'),
(35, 'Bone marrow and meat scraps', 'Daily', '11:00:00', 'Specialized'),
(36, 'Whole fish', 'Daily', '10:00:00', 'Herring/mackerel'),
(37, 'Fish and insects', 'Daily', '10:30:00', 'Opportunistic');



-- =======================================
-- FEEDING LOGS
-- =======================================
INSERT INTO feeding_logs (animal_id, keeper_id, feeding_time, food_given, quantity_given, notes) VALUES
(1, 2, DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 9 HOUR, 'Raw beef with bone', '15kg', 'Good appetite'),
(1, 2, DATE_SUB(NOW(), INTERVAL 2 DAY) + INTERVAL 9 HOUR, 'Raw chicken', '15kg', 'Ate enthusiastically'),
(1, 2, DATE_SUB(NOW(), INTERVAL 3 DAY) + INTERVAL 9 HOUR, 'Raw beef', '15kg', 'Normal'),
(1, 2, DATE_SUB(NOW(), INTERVAL 4 DAY) + INTERVAL 9 HOUR, 'Raw beef', '15kg', 'Active'),
(1, 2, DATE_SUB(NOW(), INTERVAL 5 DAY) + INTERVAL 9 HOUR, 'Raw chicken', '15kg', 'Good'),
(1, 2, DATE_SUB(NOW(), INTERVAL 6 DAY) + INTERVAL 9 HOUR, 'Raw beef', '15kg', 'Excellent'),
(2, 2, DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 9 HOUR + INTERVAL 30 MINUTE, 'Raw chicken', '10kg', 'Healthy appetite'),
(2, 2, DATE_SUB(NOW(), INTERVAL 2 DAY) + INTERVAL 9 HOUR + INTERVAL 30 MINUTE, 'Raw beef', '10kg', 'Normal'),
(2, 2, DATE_SUB(NOW(), INTERVAL 3 DAY) + INTERVAL 9 HOUR + INTERVAL 30 MINUTE, 'Raw chicken', '10kg', 'Good'),
(2, 2, DATE_SUB(NOW(), INTERVAL 4 DAY) + INTERVAL 9 HOUR + INTERVAL 30 MINUTE, 'Raw beef', '10kg', 'Excellent'),
(2, 2, DATE_SUB(NOW(), INTERVAL 5 DAY) + INTERVAL 9 HOUR + INTERVAL 30 MINUTE, 'Raw chicken', '10kg', 'Normal'),
(2, 2, DATE_SUB(NOW(), INTERVAL 6 DAY) + INTERVAL 9 HOUR + INTERVAL 30 MINUTE, 'Raw beef', '10kg', 'Good'),
(3, 7, DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 7 HOUR, 'Timothy hay', '50kg', 'Good consumption'),
(3, 7, DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 12 HOUR, 'Mixed fruits and vegetables', '30kg', 'Apples, carrots'),
(3, 7, DATE_SUB(NOW(), INTERVAL 2 DAY) + INTERVAL 7 HOUR, 'Timothy hay', '50kg', 'Normal'),
(3, 7, DATE_SUB(NOW(), INTERVAL 2 DAY) + INTERVAL 12 HOUR, 'Watermelon, carrots', '30kg', 'Engaged'),
(3, 7, DATE_SUB(NOW(), INTERVAL 3 DAY) + INTERVAL 7 HOUR, 'Timothy hay', '50kg', 'Excellent'),
(3, 7, DATE_SUB(NOW(), INTERVAL 3 DAY) + INTERVAL 12 HOUR, 'Fruits and vegetables', '30kg', 'Good'),
(3, 7, DATE_SUB(NOW(), INTERVAL 4 DAY) + INTERVAL 7 HOUR, 'Timothy hay', '50kg', 'Active'),
(4, 7, DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 8 HOUR, 'Fruits and leafy greens', '8kg', 'Good appetite'),
(4, 7, DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 14 HOUR, 'Vegetables with eggs', '5kg', 'Ate well'),
(4, 7, DATE_SUB(NOW(), INTERVAL 2 DAY) + INTERVAL 8 HOUR, 'Mixed fruits', '8kg', 'Normal'),
(4, 7, DATE_SUB(NOW(), INTERVAL 2 DAY) + INTERVAL 14 HOUR, 'Vegetables with protein', '5kg', 'Good'),
(4, 7, DATE_SUB(NOW(), INTERVAL 3 DAY) + INTERVAL 8 HOUR, 'Fruits and greens', '8kg', 'Excellent'),
(4, 7, DATE_SUB(NOW(), INTERVAL 4 DAY) + INTERVAL 8 HOUR, 'Mixed fruits', '8kg', 'Active'),
(5, 2, DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 10 HOUR, 'Herring with vitamins', '2kg', 'Ate enthusiastically'),
(5, 2, DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 17 HOUR + INTERVAL 30 MINUTE, 'Capelin', '1.5kg', 'Normal'),
(5, 2, DATE_SUB(NOW(), INTERVAL 2 DAY) + INTERVAL 10 HOUR, 'Capelin with vitamins', '2kg', 'Good appetite'),
(5, 2, DATE_SUB(NOW(), INTERVAL 2 DAY) + INTERVAL 17 HOUR + INTERVAL 30 MINUTE, 'Herring', '1.5kg', 'Normal'),
(5, 2, DATE_SUB(NOW(), INTERVAL 3 DAY) + INTERVAL 10 HOUR, 'Herring with vitamins', '2kg', 'Excellent'),
(5, 2, DATE_SUB(NOW(), INTERVAL 3 DAY) + INTERVAL 17 HOUR + INTERVAL 30 MINUTE, 'Capelin', '1.5kg', 'Active'),
(5, 2, DATE_SUB(NOW(), INTERVAL 4 DAY) + INTERVAL 10 HOUR, 'Mixed fish with vitamins', '2kg', 'Good'),
(6, 7, DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 9 HOUR, 'Salmon and trout', '20kg', 'Very active'),
(6, 7, DATE_SUB(NOW(), INTERVAL 2 DAY) + INTERVAL 9 HOUR, 'Mixed fish', '20kg', 'Good appetite'),
(6, 7, DATE_SUB(NOW(), INTERVAL 3 DAY) + INTERVAL 9 HOUR, 'Salmon', '20kg', 'Normal'),
(6, 7, DATE_SUB(NOW(), INTERVAL 4 DAY) + INTERVAL 9 HOUR, 'Mackerel and salmon', '20kg', 'Excellent'),
(6, 7, DATE_SUB(NOW(), INTERVAL 5 DAY) + INTERVAL 9 HOUR, 'Mixed fish', '20kg', 'Active'),
(6, 7, DATE_SUB(NOW(), INTERVAL 6 DAY) + INTERVAL 9 HOUR, 'Salmon', '20kg', 'Good'),
(7, 2, DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 9 HOUR, 'Herring with vitamin E', '6kg', 'Training session'),
(7, 2, DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 13 HOUR, 'Capelin', '6kg', 'Normal'),
(7, 2, DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 17 HOUR, 'Herring with training', '6kg', 'Excellent'),
(7, 2, DATE_SUB(NOW(), INTERVAL 2 DAY) + INTERVAL 9 HOUR, 'Mixed fish with vitamin E', '6kg', 'Good'),
(7, 2, DATE_SUB(NOW(), INTERVAL 2 DAY) + INTERVAL 13 HOUR, 'Herring', '6kg', 'Active'),
(7, 2, DATE_SUB(NOW(), INTERVAL 3 DAY) + INTERVAL 9 HOUR, 'Herring with vitamin E', '6kg', 'Good'),
(7, 2, DATE_SUB(NOW(), INTERVAL 3 DAY) + INTERVAL 13 HOUR, 'Mixed fish', '6kg', 'Normal'),
(8, 7, DATE_SUB(NOW(), INTERVAL 2 DAY) + INTERVAL 19 HOUR, 'Frozen-thawed adult rat', '1 rat', 'Good strike'),
(8, 7, DATE_SUB(NOW(), INTERVAL 9 DAY) + INTERVAL 19 HOUR, 'Frozen-thawed adult rat', '1 rat', 'Normal'),
(8, 7, DATE_SUB(NOW(), INTERVAL 16 DAY) + INTERVAL 19 HOUR, 'Frozen-thawed adult rat', '1 rat', 'Good'),
(8, 7, DATE_SUB(NOW(), INTERVAL 23 DAY) + INTERVAL 19 HOUR, 'Frozen-thawed adult rat', '1 rat', 'Excellent'),
(9, 9, DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 9 HOUR, 'Raw beef', '12kg', 'Good appetite'),
(9, 9, DATE_SUB(NOW(), INTERVAL 2 DAY) + INTERVAL 9 HOUR, 'Raw chicken', '12kg', 'Normal'),
(9, 9, DATE_SUB(NOW(), INTERVAL 3 DAY) + INTERVAL 9 HOUR, 'Raw beef', '12kg', 'Ate well'),
(9, 9, DATE_SUB(NOW(), INTERVAL 4 DAY) + INTERVAL 9 HOUR, 'Raw beef', '12kg', 'Good'),
(9, 9, DATE_SUB(NOW(), INTERVAL 5 DAY) + INTERVAL 9 HOUR, 'Raw chicken', '12kg', 'Active'),
(10, 9, DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 9 HOUR + INTERVAL 30 MINUTE, 'Raw chicken', '10kg', 'Good appetite'),
(10, 9, DATE_SUB(NOW(), INTERVAL 2 DAY) + INTERVAL 9 HOUR + INTERVAL 30 MINUTE, 'Raw beef', '10kg', 'Normal'),
(10, 9, DATE_SUB(NOW(), INTERVAL 3 DAY) + INTERVAL 9 HOUR + INTERVAL 30 MINUTE, 'Raw chicken', '10kg', 'Active'),
(10, 9, DATE_SUB(NOW(), INTERVAL 4 DAY) + INTERVAL 9 HOUR + INTERVAL 30 MINUTE, 'Raw beef', '10kg', 'Good'),
(10, 9, DATE_SUB(NOW(), INTERVAL 5 DAY) + INTERVAL 9 HOUR + INTERVAL 30 MINUTE, 'Raw chicken', '10kg', 'Excellent'),
(11, 9, DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 7 HOUR, 'Hay', '60kg', 'Good consumption'),
(11, 9, DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 12 HOUR, 'Fruits and vegetables', '35kg', 'Engaged'),
(11, 9, DATE_SUB(NOW(), INTERVAL 2 DAY) + INTERVAL 7 HOUR, 'Hay', '60kg', 'Normal'),
(11, 9, DATE_SUB(NOW(), INTERVAL 2 DAY) + INTERVAL 12 HOUR, 'Mixed fruits', '35kg', 'Good'),
(11, 9, DATE_SUB(NOW(), INTERVAL 3 DAY) + INTERVAL 7 HOUR, 'Hay', '60kg', 'Excellent'),
(12, 9, DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 7 HOUR + INTERVAL 30 MINUTE, 'Hay', '55kg', 'Good'),
(12, 9, DATE_SUB(NOW(), INTERVAL 2 DAY) + INTERVAL 7 HOUR + INTERVAL 30 MINUTE, 'Hay', '55kg', 'Normal'),
(12, 9, DATE_SUB(NOW(), INTERVAL 3 DAY) + INTERVAL 7 HOUR + INTERVAL 30 MINUTE, 'Vegetables', '35kg', 'Active'),
(12, 9, DATE_SUB(NOW(), INTERVAL 4 DAY) + INTERVAL 7 HOUR + INTERVAL 30 MINUTE, 'Hay', '55kg', 'Excellent'),
(13, 10, DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 8 HOUR, 'Fruits and leafy greens', '10kg', 'Good appetite'),
(13, 10, DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 14 HOUR, 'Vegetables and protein', '6kg', 'Active'),
(13, 10, DATE_SUB(NOW(), INTERVAL 2 DAY) + INTERVAL 8 HOUR, 'Fruits and leafy greens', '10kg', 'Normal'),
(13, 10, DATE_SUB(NOW(), INTERVAL 3 DAY) + INTERVAL 8 HOUR, 'Mixed fruits', '10kg', 'Good'),
(13, 10, DATE_SUB(NOW(), INTERVAL 4 DAY) + INTERVAL 8 HOUR, 'Fruits and greens', '10kg', 'Excellent'),
(14, 10, DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 8 HOUR, 'Fruits and leafy greens', '9kg', 'Good'),
(14, 10, DATE_SUB(NOW(), INTERVAL 2 DAY) + INTERVAL 8 HOUR, 'Mixed fruits', '9kg', 'Normal'),
(14, 10, DATE_SUB(NOW(), INTERVAL 3 DAY) + INTERVAL 8 HOUR, 'Fruits and greens', '9kg', 'Active'),
(14, 10, DATE_SUB(NOW(), INTERVAL 4 DAY) + INTERVAL 8 HOUR, 'Leafy greens', '9kg', 'Good'),
(15, 10, DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 10 HOUR, 'Herring with vitamins', '2.5kg', 'Active'),
(15, 10, DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 17 HOUR, 'Capelin', '2kg', 'Good'),
(15, 10, DATE_SUB(NOW(), INTERVAL 2 DAY) + INTERVAL 10 HOUR, 'Herring', '2.5kg', 'Normal'),
(15, 10, DATE_SUB(NOW(), INTERVAL 3 DAY) + INTERVAL 10 HOUR, 'Herring with vitamins', '2.5kg', 'Excellent'),
(15, 10, DATE_SUB(NOW(), INTERVAL 4 DAY) + INTERVAL 10 HOUR, 'Capelin', '2kg', 'Good'),
(16, 10, DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 10 HOUR, 'Fresh fish', '2.5kg', 'Active'),
(16, 10, DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 17 HOUR, 'Fish', '2kg', 'Normal'),
(16, 10, DATE_SUB(NOW(), INTERVAL 2 DAY) + INTERVAL 10 HOUR, 'Fresh fish', '2.5kg', 'Good'),
(16, 10, DATE_SUB(NOW(), INTERVAL 3 DAY) + INTERVAL 10 HOUR, 'Fish', '2.5kg', 'Excellent'),
(17, 10, DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 10 HOUR, 'Fresh fish', '2kg', 'Good appetite'),
(17, 10, DATE_SUB(NOW(), INTERVAL 2 DAY) + INTERVAL 10 HOUR, 'Fish', '2kg', 'Normal'),
(17, 10, DATE_SUB(NOW(), INTERVAL 3 DAY) + INTERVAL 10 HOUR, 'Fresh fish', '2kg', 'Active'),
(17, 10, DATE_SUB(NOW(), INTERVAL 4 DAY) + INTERVAL 10 HOUR, 'Fish', '2kg', 'Good'),
(18, 10, DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 10 HOUR, 'Fresh fish', '2.5kg', 'Normal'),
(18, 10, DATE_SUB(NOW(), INTERVAL 2 DAY) + INTERVAL 10 HOUR, 'Fish', '2.5kg', 'Good'),
(18, 10, DATE_SUB(NOW(), INTERVAL 3 DAY) + INTERVAL 10 HOUR, 'Fresh fish', '2.5kg', 'Excellent'),
(19, 10, DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 10 HOUR, 'Fresh fish', '2.5kg', 'Active'),
(19, 10, DATE_SUB(NOW(), INTERVAL 2 DAY) + INTERVAL 10 HOUR, 'Fish', '2.5kg', 'Good'),
(19, 10, DATE_SUB(NOW(), INTERVAL 3 DAY) + INTERVAL 10 HOUR, 'Fresh fish', '2.5kg', 'Normal'),
(19, 10, DATE_SUB(NOW(), INTERVAL 4 DAY) + INTERVAL 10 HOUR, 'Fish', '2.5kg', 'Excellent'),
(20, 12, DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 9 HOUR, 'Salmon and trout', '25kg', 'Very active'),
(20, 12, DATE_SUB(NOW(), INTERVAL 2 DAY) + INTERVAL 9 HOUR, 'Mixed fish', '25kg', 'Good appetite'),
(20, 12, DATE_SUB(NOW(), INTERVAL 3 DAY) + INTERVAL 9 HOUR, 'Salmon', '25kg', 'Normal'),
(20, 12, DATE_SUB(NOW(), INTERVAL 4 DAY) + INTERVAL 9 HOUR, 'Mixed fish', '25kg', 'Excellent'),
(20, 12, DATE_SUB(NOW(), INTERVAL 5 DAY) + INTERVAL 9 HOUR, 'Salmon', '25kg', 'Active'),
(21, 12, DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 9 HOUR, 'Fresh fish', '20kg', 'Training session'),
(21, 12, DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 13 HOUR, 'Fish', '20kg', 'Good'),
(21, 12, DATE_SUB(NOW(), INTERVAL 2 DAY) + INTERVAL 9 HOUR, 'Fresh fish', '20kg', 'Normal'),
(21, 12, DATE_SUB(NOW(), INTERVAL 3 DAY) + INTERVAL 9 HOUR, 'Fish', '20kg', 'Active'),
(22, 12, DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 9 HOUR, 'Fresh fish', '18kg', 'Good'),
(22, 12, DATE_SUB(NOW(), INTERVAL 2 DAY) + INTERVAL 9 HOUR, 'Fish', '18kg', 'Normal'),
(22, 12, DATE_SUB(NOW(), INTERVAL 3 DAY) + INTERVAL 9 HOUR, 'Fresh fish', '18kg', 'Excellent'),
(22, 12, DATE_SUB(NOW(), INTERVAL 4 DAY) + INTERVAL 9 HOUR, 'Fish', '18kg', 'Active'),
(23, 12, DATE_SUB(NOW(), INTERVAL 5 DAY) + INTERVAL 18 HOUR, 'Frozen-thawed rat', '1 rat', 'Good strike'),
(23, 12, DATE_SUB(NOW(), INTERVAL 19 DAY) + INTERVAL 18 HOUR, 'Frozen-thawed rat', '1 rat', 'Normal'),
(24, 12, DATE_SUB(NOW(), INTERVAL 4 DAY) + INTERVAL 18 HOUR, 'Frozen-thawed rabbit', '1 rabbit', 'Good consumption'),
(24, 12, DATE_SUB(NOW(), INTERVAL 18 DAY) + INTERVAL 18 HOUR, 'Frozen-thawed rabbit', '1 rabbit', 'Excellent'),
(25, 12, DATE_SUB(NOW(), INTERVAL 6 DAY) + INTERVAL 18 HOUR, 'Frozen-thawed rat', '1 rat', 'Normal'),
(25, 12, DATE_SUB(NOW(), INTERVAL 13 DAY) + INTERVAL 18 HOUR, 'Frozen-thawed rat', '1 rat', 'Good'),
(25, 12, DATE_SUB(NOW(), INTERVAL 20 DAY) + INTERVAL 18 HOUR, 'Frozen-thawed rat', '1 rat', 'Active'),
(26, 12, DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 18 HOUR, 'Frozen-thawed rabbit', '1 rabbit', 'Good'),
(26, 12, DATE_SUB(NOW(), INTERVAL 30 DAY) + INTERVAL 18 HOUR, 'Frozen-thawed rabbit', '1 rabbit', 'Excellent'),
(27, 12, DATE_SUB(NOW(), INTERVAL 10 DAY) + INTERVAL 12 HOUR, 'Whole goat', '10kg', 'Large meal'),
(27, 12, DATE_SUB(NOW(), INTERVAL 45 DAY) + INTERVAL 12 HOUR, 'Large deer', '12kg', 'Massive feeding'),
(28, 2, DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 9 HOUR, 'Fruit and seed mix', '100g', 'Vocal'),
(28, 2, DATE_SUB(NOW(), INTERVAL 2 DAY) + INTERVAL 9 HOUR, 'Fruit and seed mix', '100g', 'Normal'),
(28, 2, DATE_SUB(NOW(), INTERVAL 3 DAY) + INTERVAL 9 HOUR, 'Fruit and seed mix', '100g', 'Active'),
(28, 2, DATE_SUB(NOW(), INTERVAL 4 DAY) + INTERVAL 9 HOUR, 'Fruit and seed mix', '100g', 'Good'),
(29, 9, DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 9 HOUR, 'Fruit and seed mix', '100g', 'Good appetite'),
(29, 9, DATE_SUB(NOW(), INTERVAL 2 DAY) + INTERVAL 9 HOUR, 'Fruit and seed mix', '100g', 'Normal'),
(29, 9, DATE_SUB(NOW(), INTERVAL 3 DAY) + INTERVAL 9 HOUR, 'Fruit and seed mix', '100g', 'Active'),
(29, 9, DATE_SUB(NOW(), INTERVAL 4 DAY) + INTERVAL 9 HOUR, 'Fruit and seed mix', '100g', 'Good'),
(30, 9, DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 9 HOUR, 'Fruit and seed mix', '100g', 'Hunting'),
(30, 9, DATE_SUB(NOW(), INTERVAL 2 DAY) + INTERVAL 9 HOUR, 'Fruit and seed mix', '100g', 'Normal'),
(30, 9, DATE_SUB(NOW(), INTERVAL 3 DAY) + INTERVAL 9 HOUR, 'Fruit and seed mix', '100g', 'Good'),
(30, 9, DATE_SUB(NOW(), INTERVAL 4 DAY) + INTERVAL 9 HOUR, 'Fruit and seed mix', '100g', 'Excellent'),
(31, 2, DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 9 HOUR + INTERVAL 30 MINUTE, 'Chopped fruit and insects', '150g', 'Engaged'),
(31, 2, DATE_SUB(NOW(), INTERVAL 2 DAY) + INTERVAL 9 HOUR + INTERVAL 30 MINUTE, 'Chopped fruit and insects', '150g', 'Good'),
(31, 2, DATE_SUB(NOW(), INTERVAL 3 DAY) + INTERVAL 9 HOUR + INTERVAL 30 MINUTE, 'Chopped fruit and insects', '150g', 'Normal'),
(31, 2, DATE_SUB(NOW(), INTERVAL 4 DAY) + INTERVAL 9 HOUR + INTERVAL 30 MINUTE, 'Chopped fruit and insects', '150g', 'Active'),
(32, 7, DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 20 HOUR, 'Thawed mice', '2 mice', 'Quick strike'),
(32, 7, DATE_SUB(NOW(), INTERVAL 2 DAY) + INTERVAL 20 HOUR, 'Thawed mice', '2 mice', 'Good'),
(32, 7, DATE_SUB(NOW(), INTERVAL 3 DAY) + INTERVAL 20 HOUR, 'Thawed mice', '2 mice', 'Normal'),
(32, 7, DATE_SUB(NOW(), INTERVAL 4 DAY) + INTERVAL 20 HOUR, 'Thawed mice', '2 mice', 'Excellent'),
(33, 7, DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 9 HOUR, 'Seed mix', '150g', 'Vocal'),
(33, 7, DATE_SUB(NOW(), INTERVAL 2 DAY) + INTERVAL 9 HOUR, 'Seed mix', '150g', 'Normal'),
(33, 7, DATE_SUB(NOW(), INTERVAL 3 DAY) + INTERVAL 9 HOUR, 'Seed mix', '150g', 'Active'),
(33, 7, DATE_SUB(NOW(), INTERVAL 4 DAY) + INTERVAL 9 HOUR, 'Seed mix', '150g', 'Good'),
(34, 7, DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 8 HOUR, 'Flamingo pellets', '200g', 'Color maintenance'),
(34, 7, DATE_SUB(NOW(), INTERVAL 2 DAY) + INTERVAL 8 HOUR, 'Flamingo pellets', '200g', 'Good'),
(34, 7, DATE_SUB(NOW(), INTERVAL 3 DAY) + INTERVAL 8 HOUR, 'Flamingo pellets', '200g', 'Normal'),
(34, 7, DATE_SUB(NOW(), INTERVAL 4 DAY) + INTERVAL 8 HOUR, 'Flamingo pellets', '200g', 'Active'),
(35, 7, DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 11 HOUR, 'Bone marrow', '150g', 'Aggressive eating'),
(35, 7, DATE_SUB(NOW(), INTERVAL 2 DAY) + INTERVAL 11 HOUR, 'Bone marrow', '150g', 'Good'),
(35, 7, DATE_SUB(NOW(), INTERVAL 3 DAY) + INTERVAL 11 HOUR, 'Meat scraps', '150g', 'Normal'),
(35, 7, DATE_SUB(NOW(), INTERVAL 4 DAY) + INTERVAL 11 HOUR, 'Bone marrow', '150g', 'Excellent'),
(36, 7, DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 10 HOUR, 'Whole fish', '200g', 'Swallowed whole'),
(36, 7, DATE_SUB(NOW(), INTERVAL 2 DAY) + INTERVAL 10 HOUR, 'Whole fish', '200g', 'Good'),
(36, 7, DATE_SUB(NOW(), INTERVAL 3 DAY) + INTERVAL 10 HOUR, 'Whole fish', '200g', 'Normal'),
(36, 7, DATE_SUB(NOW(), INTERVAL 4 DAY) + INTERVAL 10 HOUR, 'Whole fish', '200g', 'Active'),
(37, 7, DATE_SUB(NOW(), INTERVAL 1 DAY) + INTERVAL 10 HOUR + INTERVAL 30 MINUTE, 'Fish and insects', '180g', 'Opportunistic'),
(37, 7, DATE_SUB(NOW(), INTERVAL 2 DAY) + INTERVAL 10 HOUR + INTERVAL 30 MINUTE, 'Fish and insects', '180g', 'Good'),
(37, 7, DATE_SUB(NOW(), INTERVAL 3 DAY) + INTERVAL 10 HOUR + INTERVAL 30 MINUTE, 'Fish and insects', '180g', 'Normal'),
(37, 7, DATE_SUB(NOW(), INTERVAL 4 DAY) + INTERVAL 10 HOUR + INTERVAL 30 MINUTE, 'Fish and insects', '180g', 'Excellent');



-- =======================================
-- CUSTOMER PAYMENT METHODS
-- =======================================
INSERT INTO customer_payment_methods (payment_method_id, customer_id, card_number, cardholder_name, expiry_month, expiry_year, cvv, billing_address, billing_city, billing_state, billing_zip) VALUES
(1, 2, '4532123456789012', 'Maria Garcia', 12, 2026, '456', '456 Oak Ave', 'Springfield', 'IL', '62702'),
(2, 4, '5412876543210987', 'Sarah Wilson', 6, 2027, '789', '321 Elm St', 'Springfield', 'IL', '62704'),
(3, 5, '6011234567890123', 'Michael Johnson', 3, 2028, '234', '654 Maple Dr', 'Springfield', 'IL', '62705');

-- =======================================
-- MEMBERSHIP PURCHASES
-- =======================================
INSERT INTO membership_purchases (customer_id, purchase_date, start_date, end_date, price, payment_method, auto_renewed, payment_method_id) VALUES
(2, '2023-11-15 10:00:00', '2023-11-15', '2024-11-15', 149.00, 'credit', 0, 1),
(2, '2024-11-15 09:30:00', '2024-11-15', '2025-11-15', 149.00, 'credit', 1, 1),
(4, '2024-05-15 14:20:00', '2024-06-01', '2025-06-01', 149.00, 'credit', 0, 2),
(5, '2024-02-15 11:45:00', '2024-03-15', '2025-03-15', 149.00, 'credit', 0, 3),
(5, '2024-03-10 10:00:00', '2024-03-15', '2025-03-15', 149.00, 'credit', 1, 3);

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