-- More Seed Data for Zoo Management System
-- This file adds a larger volume of data for more thorough testing of reports.
-- Run this script after the initial seed_data.sql.

USE zoo_database;

-- =======================================
-- 50 Additional Customers
-- =======================================
INSERT INTO customers (customer_id, first_name, last_name, email, phone, address, city, state, zip_code, annual_pass, registration_date) VALUES
(4, 'Emily', 'Carter', 'emily.carter@example.com', '555-0201', '123 Maple St', 'Springfield', 'IL', '62704', 'yes', '2023-11-01'),
(5, 'Benjamin', 'Lee', 'ben.lee@example.com', '555-0202', '456 Oak Ave', 'Springfield', 'IL', '62704', 'no', '2024-01-15'),
(6, 'Olivia', 'Garcia', 'olivia.g@example.com', '555-0203', '789 Pine Rd', 'Shelbyville', 'IL', '62565', 'yes', '2023-05-20'),
(7, 'Liam', 'Martinez', 'liam.m@example.com', '555-0204', '101 Elm St', 'Capital City', 'IL', '62701', 'no', '2024-02-10'),
(8, 'Sophia', 'Nguyen', 'sophia.n@example.com', '555-0205', '212 Birch Rd', 'Springfield', 'IL', '62702', 'yes', '2022-12-30'),
(9, 'Noah', 'Kim', 'noah.kim@example.com', '555-0206', '333 Cedar Ln', 'Springfield', 'IL', '62703', 'no', '2024-03-05'),
(10, 'Ava', 'Rodriguez', 'ava.r@example.com', '555-0207', '444 Spruce Way', 'Shelbyville', 'IL', '62565', 'yes', '2023-08-11'),
(11, 'William', 'Chen', 'will.chen@example.com', '555-0208', '555 Willow Dr', 'Capital City', 'IL', '62701', 'no', '2024-04-22'),
(12, 'Isabella', 'Wang', 'isabella.w@example.com', '555-0209', '666 Aspen Ct', 'Springfield', 'IL', '62704', 'yes', '2023-02-18'),
(13, 'James', 'Patel', 'james.p@example.com', '555-0210', '777 Redwood Pkwy', 'Springfield', 'IL', '62702', 'no', '2024-05-01'),
(14, 'Charlotte', 'Gupta', 'charlotte.g@example.com', '555-0211', '888 Sequoia Ave', 'Shelbyville', 'IL', '62565', 'yes', '2023-09-25'),
(15, 'Michael', 'Lopez', 'michael.l@example.com', '555-0212', '999 Fir St', 'Capital City', 'IL', '62701', 'no', '2024-01-30'),
(16, 'Amelia', 'Gonzalez', 'amelia.g@example.com', '555-0213', '111 Palm Rd', 'Springfield', 'IL', '62703', 'yes', '2023-07-14'),
(17, 'Alexander', 'Hernandez', 'alex.h@example.com', '555-0214', '222 Cypress Ln', 'Springfield', 'IL', '62704', 'no', '2024-03-12'),
(18, 'Mia', 'Perez', 'mia.p@example.com', '555-0215', '333 Magnolia Blvd', 'Shelbyville', 'IL', '62565', 'yes', '2023-10-03'),
(19, 'Ethan', 'Sanchez', 'ethan.s@example.com', '555-0216', '444 Juniper Way', 'Capital City', 'IL', '62701', 'no', '2024-02-28'),
(20, 'Harper', 'Rivera', 'harper.r@example.com', '555-0217', '555 Holly Dr', 'Springfield', 'IL', '62702', 'yes', '2023-04-09'),
(21, 'Daniel', 'Torres', 'daniel.t@example.com', '555-0218', '666 Sycamore Ct', 'Springfield', 'IL', '62703', 'no', '2024-05-15'),
(22, 'Evelyn', 'Flores', 'evelyn.f@example.com', '555-0219', '777 Poplar Ave', 'Shelbyville', 'IL', '62565', 'yes', '2023-11-21'),
(23, 'Matthew', 'Gomez', 'matthew.g@example.com', '555-0220', '888 Chestnut St', 'Capital City', 'IL', '62701', 'no', '2024-01-05'),
(24, 'Abigail', 'Ramirez', 'abigail.r@example.com', '555-0221', '999 Alder Rd', 'Springfield', 'IL', '62704', 'yes', '2023-06-18'),
(25, 'Henry', 'Cruz', 'henry.c@example.com', '555-0222', '1212 Hickory Ln', 'Springfield', 'IL', '62702', 'no', '2024-04-01'),
(26, 'Sofia', 'Reyes', 'sofia.r@example.com', '555-0223', '1313 Walnut Way', 'Shelbyville', 'IL', '62565', 'yes', '2023-12-08'),
(27, 'Joseph', 'Morales', 'joseph.m@example.com', '555-0224', '1414 Cherry Dr', 'Capital City', 'IL', '62701', 'no', '2024-03-20'),
(28, 'Ella', 'Gutierrez', 'ella.g@example.com', '555-0225', '1515 Plum Ct', 'Springfield', 'IL', '62703', 'yes', '2023-08-29'),
(29, 'David', 'Ortiz', 'david.o@example.com', '555-0226', '1616 Peach Ave', 'Springfield', 'IL', '62704', 'no', '2024-02-14'),
(30, 'Scarlett', 'Jimenez', 'scarlett.j@example.com', '555-0227', '1717 Orange St', 'Shelbyville', 'IL', '62565', 'yes', '2023-03-23'),
(31, 'Samuel', 'Ramos', 'samuel.r@example.com', '555-0228', '1818 Lemon Rd', 'Capital City', 'IL', '62701', 'no', '2024-01-25'),
(32, 'Victoria', 'Castillo', 'victoria.c@example.com', '555-0229', '1919 Lime Ln', 'Springfield', 'IL', '62702', 'yes', '2023-09-15'),
(33, 'Jackson', 'Alvarez', 'jackson.a@example.com', '555-0230', '2020 Grape Way', 'Springfield', 'IL', '62703', 'no', '2024-05-10'),
(34, 'Grace', 'Mendoza', 'grace.m@example.com', '555-0231', '2121 Kiwi Dr', 'Shelbyville', 'IL', '62565', 'yes', '2023-10-30'),
(35, 'Sebastian', 'Vargas', 'sebastian.v@example.com', '555-0232', '2222 Mango Ct', 'Capital City', 'IL', '62701', 'no', '2024-04-18'),
(36, 'Chloe', 'Medina', 'chloe.m@example.com', '555-0233', '2323 Papaya Ave', 'Springfield', 'IL', '62704', 'yes', '2023-01-12'),
(37, 'Carter', 'Soto', 'carter.s@example.com', '555-0234', '2424 Fig St', 'Springfield', 'IL', '62702', 'no', '2024-03-28'),
(38, 'Riley', 'Rojas', 'riley.r@example.com', '555-0235', '2525 Date Rd', 'Shelbyville', 'IL', '62565', 'yes', '2023-07-22'),
(39, 'Wyatt', 'Castro', 'wyatt.c@example.com', '555-0236', '2626 Coconut Ln', 'Capital City', 'IL', '62701', 'no', '2024-02-05'),
(40, 'Penelope', 'Silva', 'penelope.s@example.com', '555-0237', '2727 Pineapple Way', 'Springfield', 'IL', '62703', 'yes', '2023-05-11'),
(41, 'Luke', 'Ferreira', 'luke.f@example.com', '555-0238', '2828 Avocado Dr', 'Springfield', 'IL', '62704', 'no', '2024-01-18'),
(42, 'Layla', 'Santos', 'layla.s@example.com', '555-0239', '2929 Guava Ct', 'Shelbyville', 'IL', '62565', 'yes', '2023-11-08'),
(43, 'Jayden', 'Machado', 'jayden.m@example.com', '555-0240', '3030 Lychee Ave', 'Capital City', 'IL', '62701', 'no', '2024-04-25'),
(44, 'Nora', 'Ribeiro', 'nora.r@example.com', '555-0241', '3131 Passionfruit St', 'Springfield', 'IL', '62702', 'yes', '2023-02-25'),
(45, 'Levi', 'Almeida', 'levi.a@example.com', '555-0242', '3232 Dragonfruit Rd', 'Springfield', 'IL', '62703', 'no', '2024-05-20'),
(46, 'Zoe', 'Costa', 'zoe.c@example.com', '555-0243', '3333 Starfruit Ln', 'Shelbyville', 'IL', '62565', 'yes', '2023-08-01'),
(47, 'Julian', 'Pereira', 'julian.p@example.com', '555-0244', '3434 Jackfruit Way', 'Capital City', 'IL', '62701', 'no', '2024-03-15'),
(48, 'Lillian', 'Gomes', 'lillian.g@example.com', '555-0245', '3535 Durian Dr', 'Springfield', 'IL', '62704', 'yes', '2023-09-10'),
(49, 'Leo', 'Sousa', 'leo.s@example.com', '555-0246', '3636 Acai Ct', 'Springfield', 'IL', '62702', 'no', '2024-02-20'),
(50, 'Stella', 'Carvalho', 'stella.c@example.com', '555-0247', '3737 Feijoa Ave', 'Shelbyville', 'IL', '62565', 'yes', '2023-12-15'),
(51, 'Gabriel', 'Rodrigues', 'gabriel.r@example.com', '555-0248', '3838 Cupuacu St', 'Capital City', 'IL', '62701', 'no', '2024-01-01'),
(52, 'Hazel', 'Correia', 'hazel.c@example.com', '555-0249', '3939 Guarana Rd', 'Springfield', 'IL', '62703', 'yes', '2023-06-05'),
(53, 'Lincoln', 'Teixeira', 'lincoln.t@example.com', '555-0250', '4040 Camu Camu Ln', 'Springfield', 'IL', '62704', 'no', '2024-04-10');

-- =======================================
-- User Accounts & Passwords for New Customers
-- =======================================
INSERT INTO user_accounts (account_id, username, email, role, customer_id) VALUES
(12, 'emily.carter', 'emily.carter@example.com', 'customer', 4),
(13, 'ben.lee', 'ben.lee@example.com', 'customer', 5),
(14, 'olivia.g', 'olivia.g@example.com', 'customer', 6),
(15, 'liam.m', 'liam.m@example.com', 'customer', 7),
(16, 'sophia.n', 'sophia.n@example.com', 'customer', 8),
(17, 'noah.kim', 'noah.kim@example.com', 'customer', 9),
(18, 'ava.r', 'ava.r@example.com', 'customer', 10),
(19, 'will.chen', 'will.chen@example.com', 'customer', 11),
(20, 'isabella.w', 'isabella.w@example.com', 'customer', 12),
(21, 'james.p', 'james.p@example.com', 'customer', 13),
(22, 'charlotte.g', 'charlotte.g@example.com', 'customer', 14),
(23, 'michael.l', 'michael.l@example.com', 'customer', 15),
(24, 'amelia.g', 'amelia.g@example.com', 'customer', 16),
(25, 'alex.h', 'alex.h@example.com', 'customer', 17),
(26, 'mia.p', 'mia.p@example.com', 'customer', 18),
(27, 'ethan.s', 'ethan.s@example.com', 'customer', 19),
(28, 'harper.r', 'harper.r@example.com', 'customer', 20),
(29, 'daniel.t', 'daniel.t@example.com', 'customer', 21),
(30, 'evelyn.f', 'evelyn.f@example.com', 'customer', 22),
(31, 'matthew.g', 'matthew.g@example.com', 'customer', 23),
(32, 'abigail.r', 'abigail.r@example.com', 'customer', 24),
(33, 'henry.c', 'henry.c@example.com', 'customer', 25),
(34, 'sofia.r', 'sofia.r@example.com', 'customer', 26),
(35, 'joseph.m', 'joseph.m@example.com', 'customer', 27),
(36, 'ella.g', 'ella.g@example.com', 'customer', 28),
(37, 'david.o', 'david.o@example.com', 'customer', 29),
(38, 'scarlett.j', 'scarlett.j@example.com', 'customer', 30),
(39, 'samuel.r', 'samuel.r@example.com', 'customer', 31),
(40, 'victoria.c', 'victoria.c@example.com', 'customer', 32),
(41, 'jackson.a', 'jackson.a@example.com', 'customer', 33),
(42, 'grace.m', 'grace.m@example.com', 'customer', 34),
(43, 'sebastian.v', 'sebastian.v@example.com', 'customer', 35),
(44, 'chloe.m', 'chloe.m@example.com', 'customer', 36),
(45, 'carter.s', 'carter.s@example.com', 'customer', 37),
(46, 'riley.r', 'riley.r@example.com', 'customer', 38),
(47, 'wyatt.c', 'wyatt.c@example.com', 'customer', 39),
(48, 'penelope.s', 'penelope.s@example.com', 'customer', 40),
(49, 'luke.f', 'luke.f@example.com', 'customer', 41),
(50, 'layla.s', 'layla.s@example.com', 'customer', 42),
(51, 'jayden.m', 'jayden.m@example.com', 'customer', 43),
(52, 'nora.r', 'nora.r@example.com', 'customer', 44),
(53, 'levi.a', 'levi.a@example.com', 'customer', 45),
(54, 'zoe.c', 'zoe.c@example.com', 'customer', 46),
(55, 'julian.p', 'julian.p@example.com', 'customer', 47),
(56, 'lillian.g', 'lillian.g@example.com', 'customer', 48),
(57, 'leo.s', 'leo.s@example.com', 'customer', 49),
(58, 'stella.c', 'stella.c@example.com', 'customer', 50),
(59, 'gabriel.r', 'gabriel.r@example.com', 'customer', 51),
(60, 'hazel.c', 'hazel.c@example.com', 'customer', 52),
(61, 'lincoln.t', 'lincoln.t@example.com', 'customer', 53);

INSERT INTO passwords (account_id, password_hash) VALUES
(12, 'password'), (13, 'password'), (14, 'password'), (15, 'password'), (16, 'password'),
(17, 'password'), (18, 'password'), (19, 'password'), (20, 'password'), (21, 'password'),
(22, 'password'), (23, 'password'), (24, 'password'), (25, 'password'), (26, 'password'),
(27, 'password'), (28, 'password'), (29, 'password'), (30, 'password'), (31, 'password'),
(32, 'password'), (33, 'password'), (34, 'password'), (35, 'password'), (36, 'password'),
(37, 'password'), (38, 'password'), (39, 'password'), (40, 'password'), (41, 'password'),
(42, 'password'), (43, 'password'), (44, 'password'), (45, 'password'), (46, 'password'),
(47, 'password'), (48, 'password'), (49, 'password'), (50, 'password'), (51, 'password'),
(52, 'password'), (53, 'password'), (54, 'password'), (55, 'password'), (56, 'password'),
(57, 'password'), (58, 'password'), (59, 'password'), (60, 'password'), (61, 'password');

-- =======================================
-- 40 Additional Animals
-- =======================================
INSERT INTO animals (name, scientific_name, species, date_of_birth, arrival_date, gender, place_of_origin, habitat_id, health_status, weight) VALUES
('Raja', 'Panthera tigris', 'Bengal Tiger', '2019-02-14', '2020-03-01', 'male', 'India', 1, 'excellent', 220.0),
('Mei', 'Ailuropoda melanoleuca', 'Giant Panda', '2018-08-25', '2020-05-15', 'female', 'China', 3, 'good', 110.5),
('Zara', 'Giraffa camelopardalis', 'Giraffe', '2020-11-30', '2022-01-20', 'female', 'Tanzania', 2, 'excellent', 800.0),
('Gus', 'Hippopotamus amphibius', 'Hippopotamus', '2015-06-10', '2016-08-01', 'male', 'Zambia', 6, 'good', 1500.0),
('Rocky', 'Macropus rufus', 'Red Kangaroo', '2021-04-05', '2022-06-10', 'male', 'Australia', 1, 'excellent', 85.0),
('Draco', 'Varanus komodoensis', 'Komodo Dragon', '2017-09-12', '2019-02-20', 'male', 'Indonesia', 7, 'good', 70.0),
('Zola', 'Struthio camelus', 'Ostrich', '2022-01-20', '2023-03-15', 'female', 'South Africa', 2, 'excellent', 140.0),
('Chomper', 'Alligator mississippiensis', 'American Alligator', '2014-05-22', '2015-07-30', 'male', 'USA', 6, 'good', 250.0),
('Pippin', 'Cebus capucinus', 'Capuchin Monkey', '2020-03-18', '2021-05-01', 'male', 'Costa Rica', 3, 'excellent', 4.0),
('Khan', 'Panthera uncia', 'Snow Leopard', '2019-07-21', '2021-01-10', 'male', 'Himalayas', 5, 'good', 45.0),
('Zebra', 'Equus quagga', 'Plains Zebra', '2021-08-15', '2022-09-01', 'female', 'Kenya', 2, 'excellent', 250.0),
('Red', 'Ailurus fulgens', 'Red Panda', '2022-05-10', '2023-06-01', 'male', 'Nepal', 3, 'good', 5.5),
('Spike', 'Hystrix cristata', 'Crested Porcupine', '2020-10-01', '2021-11-01', 'male', 'North Africa', 1, 'excellent', 15.0),
('Echo', 'Orcinus orca', 'Orca', '2010-12-01', '2012-02-15', 'female', 'Iceland', 6, 'fair', 4000.0),
('Tango', 'Phoenicopterus roseus', 'Greater Flamingo', '2022-02-02', '2023-03-03', 'male', 'Spain', 4, 'excellent', 3.5),
('Bao Bao', 'Ailuropoda melanoleuca', 'Giant Panda', '2021-07-20', '2023-01-10', 'male', 'China', 3, 'good', 90.0),
('Twiga', 'Giraffa camelopardalis', 'Giraffe', '2022-04-10', '2023-05-20', 'female', 'Kenya', 2, 'excellent', 750.0),
('Manny', 'Mammuthus primigenius', 'Woolly Mammoth (Genetic Clone)', '2023-01-01', '2024-01-01', 'male', 'Siberia (Lab)', 5, 'excellent', 6000.0),
('Kovu', 'Panthera leo', 'African Lion', '2020-01-15', '2021-02-10', 'male', 'Tanzania', 1, 'good', 180.0),
('Kiara', 'Panthera leo', 'African Lion', '2021-03-10', '2022-04-05', 'female', 'Tanzania', 1, 'excellent', 125.0),
('Mojo', 'Cebus capucinus', 'Capuchin Monkey', '2021-09-01', '2022-10-01', 'female', 'Panama', 3, 'good', 3.5),
('Frosty', 'Ursus maritimus', 'Polar Bear', '2018-11-15', '2020-01-20', 'male', 'Canada', 5, 'excellent', 260.0),
('Coral', 'Tursiops truncatus', 'Bottlenose Dolphin', '2019-05-20', '2020-06-15', 'female', 'Bahamas', 6, 'good', 190.0),
('Rico', 'Aptenodytes forsteri', 'Emperor Penguin', '2022-08-10', '2023-02-15', 'male', 'Antarctica', 4, 'excellent', 24.0),
('Kaa', 'Python reticulatus', 'Reticulated Python', '2016-04-12', '2017-05-20', 'female', 'Southeast Asia', 7, 'good', 10.0),
('Zazu', 'Tockus erythrorhynchus', 'Red-billed Hornbill', '2022-01-10', '2023-02-15', 'male', 'Sub-Saharan Africa', 2, 'excellent', 0.15),
('Mufasa', 'Panthera leo', 'African Lion', '2015-09-20', '2016-11-01', 'male', 'Kenya', 1, 'excellent', 195.0),
('Sarabi', 'Panthera leo', 'African Lion', '2016-07-14', '2017-08-20', 'female', 'Kenya', 1, 'good', 135.0),
('Timon', 'Suricata suricatta', 'Meerkat', '2022-03-05', '2023-04-10', 'male', 'Botswana', 1, 'excellent', 0.7),
('Pumbaa', 'Phacochoerus africanus', 'Warthog', '2021-11-11', '2022-12-12', 'male', 'Namibia', 1, 'good', 65.0),
('Rafiki', 'Mandrillus sphinx', 'Mandrill', '2012-12-25', '2014-02-01', 'male', 'Cameroon', 3, 'excellent', 35.0),
('Bagheera', 'Panthera pardus', 'Leopard', '2018-06-06', '2019-07-07', 'male', 'India', 3, 'good', 60.0),
('Baloo', 'Melursus ursinus', 'Sloth Bear', '2017-04-01', '2018-05-01', 'male', 'India', 3, 'excellent', 130.0),
('Shere Khan', 'Panthera tigris', 'Bengal Tiger', '2017-08-19', '2018-09-20', 'male', 'India', 1, 'good', 210.0),
('Akela', 'Canis lupus', 'Gray Wolf', '2019-10-10', '2020-11-11', 'male', 'North America', 5, 'excellent', 55.0),
('Raksha', 'Canis lupus', 'Gray Wolf', '2020-04-15', '2021-05-16', 'female', 'North America', 5, 'good', 45.0),
('King Louie', 'Pongo pygmaeus', 'Bornean Orangutan', '2010-02-20', '2011-03-21', 'male', 'Borneo', 3, 'excellent', 75.0),
('Hedwig', 'Bubo scandiacus', 'Snowy Owl', '2022-01-01', '2023-02-01', 'female', 'Arctic', 5, 'excellent', 2.0),
('Crookshanks', 'Felis silvestris catus', 'Domestic Cat (Kneazle Mix)', '2019-05-15', '2020-06-15', 'male', 'United Kingdom', 7, 'good', 6.0),
('Fawkes', 'Phoenix', 'Phoenix', '1000-01-01', '2022-09-01', 'male', 'Egypt', 7, 'excellent', 5.0);

-- =======================================
-- 40 Additional Event Registrations
-- =======================================
INSERT INTO event_registrations (event_id, customer_id, number_of_participants, total_amount, payment_status) VALUES
(1, 4, 2, 30.00, 'paid'), (2, 5, 4, 40.00, 'paid'), (3, 6, 1, 20.00, 'paid'), (4, 7, 1, 250.00, 'paid'),
(5, 8, 2, 70.00, 'paid'), (1, 9, 3, 45.00, 'paid'), (2, 10, 2, 20.00, 'paid'), (3, 11, 4, 80.00, 'paid'),
(4, 12, 1, 250.00, 'paid'), (5, 13, 2, 70.00, 'paid'), (1, 14, 1, 15.00, 'paid'), (2, 15, 3, 30.00, 'paid'),
(3, 16, 2, 40.00, 'paid'), (4, 17, 1, 250.00, 'paid'), (5, 18, 4, 140.00, 'paid'), (1, 19, 2, 30.00, 'paid'),
(2, 20, 1, 10.00, 'paid'), (3, 21, 3, 60.00, 'paid'), (4, 22, 1, 250.00, 'paid'), (5, 23, 2, 70.00, 'paid'),
(1, 24, 4, 60.00, 'paid'), (2, 25, 2, 20.00, 'paid'), (3, 26, 1, 20.00, 'paid'), (4, 27, 1, 250.00, 'paid'),
(5, 28, 3, 105.00, 'paid'), (1, 29, 2, 30.00, 'paid'), (2, 30, 1, 10.00, 'paid'), (3, 31, 4, 80.00, 'paid'),
(4, 32, 1, 250.00, 'paid'), (5, 33, 2, 70.00, 'paid'), (1, 34, 3, 45.00, 'paid'), (2, 35, 1, 10.00, 'paid'),
(3, 36, 2, 40.00, 'paid'), (4, 37, 1, 250.00, 'paid'), (5, 38, 4, 140.00, 'paid'), (1, 39, 1, 15.00, 'paid'),
(2, 40, 2, 20.00, 'paid'), (3, 41, 3, 60.00, 'paid'), (4, 42, 1, 250.00, 'paid'), (5, 43, 2, 70.00, 'paid');

-- =======================================
-- 50 Additional Ticket Purchases
-- =======================================
INSERT INTO tickets (customer_id, visit_date, ticket_type, price, payment_method) VALUES
(4, '2025-11-18', 'adult', 45.00, 'credit'), (5, '2025-11-18', 'child', 30.00, 'credit'),
(6, '2025-11-19', 'senior', 35.00, 'cash'), (7, '2025-11-19', 'adult', 45.00, 'debit'),
(8, '2025-11-20', 'child', 30.00, 'credit'), (9, '2025-11-20', 'adult', 45.00, 'credit'),
(10, '2025-11-21', 'adult', 45.00, 'cash'), (11, '2025-11-21', 'child', 30.00, 'cash'),
(12, '2025-11-22', 'senior', 35.00, 'debit'), (13, '2025-11-22', 'adult', 45.00, 'credit'),
(14, '2025-11-23', 'adult', 45.00, 'credit'), (15, '2025-11-23', 'child', 30.00, 'credit'),
(16, '2025-11-24', 'senior', 35.00, 'cash'), (17, '2025-11-24', 'adult', 45.00, 'debit'),
(18, '2025-11-25', 'child', 30.00, 'credit'), (19, '2025-11-25', 'adult', 45.00, 'credit'),
(20, '2025-11-26', 'adult', 45.00, 'cash'), (21, '2025-11-26', 'child', 30.00, 'cash'),
(22, '2025-11-27', 'senior', 35.00, 'debit'), (23, '2025-11-27', 'adult', 45.00, 'credit'),
(24, '2025-11-28', 'adult', 45.00, 'credit'), (25, '2025-11-28', 'child', 30.00, 'credit'),
(26, '2025-11-29', 'senior', 35.00, 'cash'), (27, '2025-11-29', 'adult', 45.00, 'debit'),
(28, '2025-11-30', 'child', 30.00, 'credit'), (29, '2025-11-30', 'adult', 45.00, 'credit'),
(30, '2025-12-01', 'adult', 45.00, 'cash'), (31, '2025-12-01', 'child', 30.00, 'cash'),
(32, '2025-12-02', 'senior', 35.00, 'debit'), (33, '2025-12-02', 'adult', 45.00, 'credit'),
(34, '2025-12-03', 'adult', 45.00, 'credit'), (35, '2025-12-03', 'child', 30.00, 'credit'),
(36, '2025-12-04', 'senior', 35.00, 'cash'), (37, '2025-12-04', 'adult', 45.00, 'debit'),
(38, '2025-12-05', 'child', 30.00, 'credit'), (39, '2025-12-05', 'adult', 45.00, 'credit'),
(40, '2025-12-06', 'adult', 45.00, 'cash'), (41, '2025-12-06', 'child', 30.00, 'cash'),
(42, '2025-12-07', 'senior', 35.00, 'debit'), (43, '2025-12-07', 'adult', 45.00, 'credit'),
(44, '2025-12-08', 'adult', 45.00, 'credit'), (45, '2025-12-08', 'child', 30.00, 'credit'),
(46, '2025-12-09', 'senior', 35.00, 'cash'), (47, '2025-12-09', 'adult', 45.00, 'debit'),
(48, '2025-12-10', 'child', 30.00, 'credit'), (49, '2025-12-10', 'adult', 45.00, 'credit'),
(50, '2025-12-11', 'adult', 45.00, 'cash'), (51, '2025-12-11', 'child', 30.00, 'cash'),
(52, '2025-12-12', 'senior', 35.00, 'debit'), (53, '2025-12-12', 'adult', 45.00, 'credit');

-- =======================================
-- 20 Additional Gift Shop Transactions
-- =======================================
INSERT INTO gift_shop_sales_transactions (gift_shop_id, customer_id, employee_id, total_amount, payment_method) VALUES (1, 4, 5, 44.98, 'credit');
SET @last_trans_id = LAST_INSERT_ID();
INSERT INTO gift_shop_sale_items (transaction_id, item_id, quantity, unit_price) VALUES (@last_trans_id, 1, 1, 19.99), (@last_trans_id, 2, 1, 24.99);

INSERT INTO gift_shop_sales_transactions (gift_shop_id, customer_id, employee_id, total_amount, payment_method) VALUES (2, 10, 5, 17.98, 'debit');
SET @last_trans_id = LAST_INSERT_ID();
INSERT INTO gift_shop_sale_items (transaction_id, item_id, quantity, unit_price) VALUES (@last_trans_id, 4, 1, 12.99), (@last_trans_id, 3, 1, 4.99);

INSERT INTO gift_shop_sales_transactions (gift_shop_id, customer_id, employee_id, total_amount, payment_method) VALUES (1, 15, 5, 19.99, 'cash');
SET @last_trans_id = LAST_INSERT_ID();
INSERT INTO gift_shop_sale_items (transaction_id, item_id, quantity, unit_price) VALUES (@last_trans_id, 1, 1, 19.99);

INSERT INTO gift_shop_sales_transactions (gift_shop_id, customer_id, employee_id, total_amount, payment_method) VALUES (1, 22, 5, 54.97, 'credit');
SET @last_trans_id = LAST_INSERT_ID();
INSERT INTO gift_shop_sale_items (transaction_id, item_id, quantity, unit_price) VALUES (@last_trans_id, 2, 1, 24.99), (@last_trans_id, 1, 1, 19.99), (@last_trans_id, 3, 2, 4.99);

INSERT INTO gift_shop_sales_transactions (gift_shop_id, customer_id, employee_id, total_amount, payment_method) VALUES (2, 30, 5, 12.99, 'debit');
SET @last_trans_id = LAST_INSERT_ID();
INSERT INTO gift_shop_sale_items (transaction_id, item_id, quantity, unit_price) VALUES (@last_trans_id, 4, 1, 12.99);

INSERT INTO gift_shop_sales_transactions (gift_shop_id, customer_id, employee_id, total_amount, payment_method) VALUES (1, 35, 5, 24.99, 'credit');
SET @last_trans_id = LAST_INSERT_ID();
INSERT INTO gift_shop_sale_items (transaction_id, item_id, quantity, unit_price) VALUES (@last_trans_id, 2, 1, 24.99);

INSERT INTO gift_shop_sales_transactions (gift_shop_id, customer_id, employee_id, total_amount, payment_method) VALUES (2, 41, 5, 9.98, 'cash');
SET @last_trans_id = LAST_INSERT_ID();
INSERT INTO gift_shop_sale_items (transaction_id, item_id, quantity, unit_price) VALUES (@last_trans_id, 3, 2, 4.99);

INSERT INTO gift_shop_sales_transactions (gift_shop_id, customer_id, employee_id, total_amount, payment_method) VALUES (1, 50, 5, 39.98, 'credit');
SET @last_trans_id = LAST_INSERT_ID();
INSERT INTO gift_shop_sale_items (transaction_id, item_id, quantity, unit_price) VALUES (@last_trans_id, 1, 2, 19.99);

INSERT INTO gift_shop_sales_transactions (gift_shop_id, customer_id, employee_id, total_amount, payment_method) VALUES (2, 5, 5, 25.98, 'debit');
SET @last_trans_id = LAST_INSERT_ID();
INSERT INTO gift_shop_sale_items (transaction_id, item_id, quantity, unit_price) VALUES (@last_trans_id, 4, 2, 12.99);

INSERT INTO gift_shop_sales_transactions (gift_shop_id, customer_id, employee_id, total_amount, payment_method) VALUES (1, 12, 5, 4.99, 'cash');
SET @last_trans_id = LAST_INSERT_ID();
INSERT INTO gift_shop_sale_items (transaction_id, item_id, quantity, unit_price) VALUES (@last_trans_id, 3, 1, 4.99);

-- =======================================
-- 30 Additional Cafe Sales
-- =======================================
INSERT INTO cafe_sales (cafe_id, transaction_id, customer_id, employee_id, item_id, quantity, line_total, status) VALUES
(1, 'TXN-C-1001', 4, 5, 1, 2, 25.98, 'completed'), (1, 'TXN-C-1001', 4, 5, 4, 2, 5.98, 'completed'),
(2, 'TXN-C-1002', 8, 5, 5, 1, 7.99, 'completed'), (2, 'TXN-C-1002', 8, 5, 6, 1, 3.99, 'completed'),
(1, 'TXN-C-1003', 15, 5, 2, 1, 8.99, 'completed'),
(2, 'TXN-C-1004', 21, 5, 6, 3, 11.97, 'completed'),
(1, 'TXN-C-1005', 28, 5, 1, 1, 12.99, 'completed'), (1, 'TXN-C-1005', 28, 5, 3, 1, 4.99, 'completed'),
(2, 'TXN-C-1006', 33, 5, 5, 2, 15.98, 'completed'),
(1, 'TXN-C-1007', 40, 5, 4, 4, 11.96, 'completed'),
(2, 'TXN-C-1008', 45, 5, 6, 1, 3.99, 'completed'),
(1, 'TXN-C-1009', 52, 5, 1, 1, 12.99, 'completed'), (1, 'TXN-C-1009', 52, 5, 2, 1, 8.99, 'completed'), (1, 'TXN-C-1009', 52, 5, 3, 2, 9.98, 'completed'),
(2, 'TXN-C-1010', 7, 5, 5, 4, 31.96, 'completed'),
(1, 'TXN-C-1011', 11, 5, 3, 1, 4.99, 'completed'),
(2, 'TXN-C-1012', 19, 5, 6, 2, 7.98, 'completed'),
(1, 'TXN-C-1013', 25, 5, 1, 1, 12.99, 'completed'),
(2, 'TXN-C-1014', 31, 5, 5, 1, 7.99, 'completed'), (2, 'TXN-C-1014', 31, 5, 4, 1, 2.99, 'completed'),
(1, 'TXN-C-1015', 38, 5, 2, 2, 17.98, 'completed'),
(2, 'TXN-C-1016', 48, 5, 5, 1, 7.99, 'completed'), (2, 'TXN-C-1016', 48, 5, 6, 1, 3.99, 'completed'),
(1, 'TXN-C-1017', 3, 5, 1, 1, 12.99, 'completed'),
(2, 'TXN-C-1018', 13, 5, 6, 2, 7.98, 'completed'),
(1, 'TXN-C-1019', 23, 5, 3, 2, 9.98, 'completed'),
(2, 'TXN-C-1020', 34, 5, 5, 1, 7.99, 'completed');

-- =======================================
-- Feeding Schedules for New Animals
-- =======================================
INSERT INTO feeding_schedules (animal_id, food_description, frequency, scheduled_time, notes) VALUES
(9, 'Fish', 'Twice a day', '09:00:00', 'Standard diet.'),
(10, 'Bamboo', 'All day', '08:00:00', 'Ensure fresh bamboo is always available.'),
(11, 'Acacia leaves', 'Three times a day', '09:00:00', 'High browse.'),
(12, 'Aquatic plants', 'All day', '07:00:00', 'Loves water lettuce.'),
(13, 'Grass and hay', 'Twice a day', '08:30:00', 'Standard diet.'),
(14, 'Meat and bones', 'Once a day', '14:00:00', 'Large carcasses preferred.'),
(15, 'Fruits and seeds', 'Twice a day', '10:00:00', 'Loves ostrich-specific pellets.'),
(16, 'Fish and chicken', 'Once a day', '15:00:00', 'Standard diet.'),
(17, 'Fruits and insects', 'Three times a day', '09:30:00', 'Enrichment with puzzle feeders.'),
(18, 'Goats and deer', 'Once every three days', '12:00:00', 'Live feeding simulation.'),
(19, 'Grass and hay', 'All day', '08:00:00', 'Grazing animal.'),
(20, 'Bamboo and fruits', 'Twice a day', '10:00:00', 'Loves apples.'),
(21, 'Insects and seeds', 'Twice a day', '11:00:00', 'Standard diet.'),
(22, 'Fish', 'Once a day', '13:00:00', 'Prefers salmon.'),
(23, 'Algae and small fish', 'Three times a day', '09:00:00', 'Filter feeder.'),
(24, 'Bamboo', 'All day', '08:00:00', 'Second panda, monitor intake.'),
(25, 'Acacia leaves', 'Three times a day', '09:00:00', 'High browse, different individual.'),
(26, 'Ice blocks with fruit', 'Once a day', '11:00:00', 'Special enrichment.'),
(27, 'Meat', 'Twice a day', '10:00:00', 'Standard diet.'),
(28, 'Meat', 'Twice a day', '10:00:00', 'Standard diet.'),
(29, 'Fruits and nuts', 'Three times a day', '09:30:00', 'Loves bananas.'),
(30, 'Seals and fish', 'Once every two days', '14:00:00', 'Large meal.'),
(31, 'Fish', 'Once a day', '13:30:00', 'Standard diet.'),
(32, 'Krill', 'Twice a day', '11:30:00', 'Standard diet.'),
(33, 'Rodents', 'Once a week', '16:00:00', 'Standard diet.'),
(34, 'Insects and fruits', 'Twice a day', '10:30:00', 'Standard diet.'),
(35, 'Meat', 'Twice a day', '10:00:00', 'Alpha male.'),
(36, 'Meat', 'Twice a day', '10:00:00', 'Alpha female.'),
(37, 'Insects and small reptiles', 'All day', '09:00:00', 'Foraging enrichment.'),
(38, 'Roots and tubers', 'All day', '09:00:00', 'Foraging enrichment.'),
(39, 'Fruits and leaves', 'Three times a day', '09:30:00', 'Loves fruit salads.'),
(40, 'Leaves and shoots', 'Twice a day', '10:00:00', 'Standard diet.'),
(41, 'Fruits and insects', 'Twice a day', '11:00:00', 'Standard diet.'),
(42, 'Meat', 'Once a day', '14:00:00', 'Rival to Raja.'),
(43, 'Meat', 'Once a day', '15:00:00', 'Pack leader.'),
(44, 'Meat', 'Once a day', '15:00:00', 'Pack member.'),
(45, 'Fruits and leaves', 'Twice a day', '10:30:00', 'Loves bananas.'),
(46, 'Mice and voles', 'Once a day', '18:00:00', 'Nocturnal feeder.'),
(47, 'Tuna and salmon', 'Twice a day', '11:00:00', 'Loves salmon.'),
(48, 'Ashes', 'Once a century', '06:00:00', 'Rebirth cycle.');

-- =======================================
-- Feeding Logs for New Animals
-- =======================================
INSERT INTO feeding_logs (animal_id, keeper_id, feeding_time, food_given, quantity_given, notes) VALUES
(9, 2, '2024-05-01 09:05:00', 'Fish', '2 kg', 'Ate well.'),
(9, 7, '2024-05-01 16:02:00', 'Fish', '2 kg', 'Ate well.'),
(10, 2, '2024-05-01 08:10:00', 'Bamboo', '10 kg', 'Good appetite.'),
(11, 7, '2024-05-01 09:03:00', 'Acacia leaves', '5 kg', 'Ate well.'),
(12, 2, '2024-05-01 07:05:00', 'Aquatic plants', '20 kg', 'Grazing throughout the day.'),
(13, 7, '2024-05-01 08:35:00', 'Grass and hay', '10 kg', 'Ate well.'),
(14, 2, '2024-05-01 14:05:00', 'Meat and bones', '15 kg', 'Finished quickly.'),
(15, 7, '2024-05-01 10:10:00', 'Fruits and seeds', '3 kg', 'Ate well.'),
(16, 2, '2024-05-01 15:02:00', 'Fish and chicken', '8 kg', 'Ate well.'),
(17, 7, '2024-05-01 09:35:00', 'Fruits and insects', '1 kg', 'Foraged well.'),
(18, 2, '2024-04-30 12:15:00', 'Goats and deer', '50 kg', 'Successful hunt simulation.'),
(19, 7, '2024-05-01 08:00:00', 'Grass and hay', '10 kg', 'Ate well.'),
(20, 2, '2024-05-01 10:05:00', 'Bamboo and fruits', '8 kg', 'Loves apples.'),
(21, 7, '2024-05-01 11:02:00', 'Insects and seeds', '0.5 kg', 'Ate well.'),
(22, 2, '2024-05-01 13:05:00', 'Fish', '20 kg', 'Prefers salmon.'),
(23, 7, '2024-05-01 09:10:00', 'Algae and small fish', '5 kg', 'Ate well.'),
(24, 2, '2024-05-01 08:15:00', 'Bamboo', '12 kg', 'Good appetite.'),
(25, 7, '2024-05-01 09:05:00', 'Acacia leaves', '6 kg', 'Ate well.'),
(26, 2, '2024-05-01 11:05:00', 'Ice blocks with fruit', '2 kg', 'Enjoyed the enrichment.'),
(27, 7, '2024-05-01 10:02:00', 'Meat', '5 kg', 'Ate well.'),
(28, 2, '2024-05-01 10:03:00', 'Meat', '4 kg', 'Ate well.'),
(29, 7, '2024-05-01 09:32:00', 'Fruits and nuts', '1.5 kg', 'Loves bananas.'),
(30, 2, '2024-04-29 14:10:00', 'Seals and fish', '100 kg', 'Large meal.'),
(31, 7, '2024-05-01 13:35:00', 'Fish', '10 kg', 'Ate well.'),
(32, 2, '2024-05-01 11:35:00', 'Krill', '2 kg', 'Ate well.'),
(33, 7, '2024-04-28 16:05:00', 'Rodents', '0.5 kg', 'Ate well.'),
(34, 2, '2024-05-01 10:35:00', 'Insects and fruits', '0.2 kg', 'Ate well.'),
(35, 7, '2024-05-01 10:01:00', 'Meat', '6 kg', 'Assertive during feeding.'),
(36, 2, '2024-05-01 10:02:00', 'Meat', '5 kg', 'Ate well.'),
(37, 7, '2024-05-01 09:05:00', 'Insects and small reptiles', '0.5 kg', 'Good foraging.'),
(38, 2, '2024-05-01 09:02:00', 'Roots and tubers', '3 kg', 'Good foraging.'),
(39, 7, '2024-05-01 09:35:00', 'Fruits and leaves', '4 kg', 'Ate well.'),
(40, 2, '2024-05-01 10:05:00', 'Leaves and shoots', '10 kg', 'Ate well.'),
(41, 7, '2024-05-01 11:05:00', 'Fruits and insects', '2 kg', 'Ate well.'),
(42, 2, '2024-05-01 14:02:00', 'Meat', '8 kg', 'Ate well.'),
(43, 7, '2024-05-01 15:05:00', 'Meat', '10 kg', 'Ate well.'),
(44, 2, '2024-05-01 15:06:00', 'Meat', '8 kg', 'Ate well.'),
(45, 7, '2024-05-01 10:35:00', 'Fruits and leaves', '15 kg', 'Loves bananas.'),
(46, 2, '2024-05-01 18:05:00', 'Mice and voles', '0.1 kg', 'Ate well.'),
(47, 7, '2024-05-01 11:05:00', 'Tuna and salmon', '5 kg', 'Loves salmon.'),
(48, 2, '2024-01-01 06:00:00', 'Ashes', '1 kg', 'Rebirth cycle initiated.');