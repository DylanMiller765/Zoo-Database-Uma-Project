
-- Seed data for purchases (tickets, gift shop, cafe) for the last year
-- This data simulates a realistic number of transactions for a small zoo.

USE zoo_database;

-- =======================================
-- TICKET SALES (Sample for last year)
-- =======================================
INSERT INTO tickets (customer_id, visit_date, ticket_type, price, payment_method, purchase_date) VALUES
-- January 2024
(1, '2024-01-15', 'adult', 45.00, 'credit', '2024-01-15 10:00:00'),
(1, '2024-01-15', 'child', 30.00, 'credit', '2024-01-15 10:00:00'),
(2, '2024-01-20', 'adult', 45.00, 'online', '2024-01-18 14:30:00'),
(3, '2024-01-25', 'senior', 35.00, 'cash', '2024-01-25 11:00:00'),
-- March 2024
(1, '2024-03-10', 'adult', 45.00, 'debit', '2024-03-10 09:30:00'),
(2, '2024-03-12', 'adult', 45.00, 'credit', '2024-03-12 12:00:00'),
(2, '2024-03-12', 'child', 30.00, 'credit', '2024-03-12 12:00:00'),
(3, '2024-03-18', 'student', 38.00, 'online', '2024-03-15 18:00:00'),
-- July 2024 (Peak Season)
(1, '2024-07-04', 'adult', 45.00, 'online', '2024-07-01 10:00:00'),
(1, '2024-07-04', 'adult', 45.00, 'online', '2024-07-01 10:00:00'),
(1, '2024-07-04', 'child', 30.00, 'online', '2024-07-01 10:00:00'),
(2, '2024-07-10', 'adult', 45.00, 'credit', '2024-07-10 09:00:00'),
(3, '2024-07-15', 'senior', 35.00, 'cash', '2024-07-15 10:30:00'),
(3, '2024-07-15', 'child', 30.00, 'cash', '2024-07-15 10:30:00'),
-- October 2024
(1, '2024-10-26', 'adult', 45.00, 'credit', '2024-10-26 11:00:00'),
(2, '2024-10-31', 'student', 38.00, 'debit', '2024-10-31 13:00:00');

-- =======================================
-- GIFT SHOP SALES (Sample for last year)
-- =======================================
-- Transaction 1
INSERT INTO gift_shop_sales_transactions (gift_shop_id, customer_id, employee_id, sale_date, total_amount, payment_method)
VALUES (1, 1, 5, '2024-01-15 15:30:00', 44.98, 'credit');
INSERT INTO gift_shop_sale_items (transaction_id, item_id, quantity, unit_price)
VALUES (1, 1, 1, 19.99), (1, 2, 1, 24.99);

-- Transaction 2
INSERT INTO gift_shop_sales_transactions (gift_shop_id, customer_id, employee_id, sale_date, total_amount, payment_method)
VALUES (2, 2, 5, '2024-03-12 16:00:00', 12.99, 'credit');
INSERT INTO gift_shop_sale_items (transaction_id, item_id, quantity, unit_price)
VALUES (2, 4, 1, 12.99);

-- Transaction 3
INSERT INTO gift_shop_sales_transactions (gift_shop_id, employee_id, sale_date, total_amount, payment_method)
VALUES (1, 5, '2024-07-04 14:00:00', 24.97, 'cash');
INSERT INTO gift_shop_sale_items (transaction_id, item_id, quantity, unit_price)
VALUES (3, 1, 1, 19.99), (3, 3, 1, 4.99);

-- Transaction 4
INSERT INTO gift_shop_sales_transactions (gift_shop_id, customer_id, employee_id, sale_date, total_amount, payment_method)
VALUES (1, 3, 5, '2024-10-26 16:30:00', 54.97, 'debit');
INSERT INTO gift_shop_sale_items (transaction_id, item_id, quantity, unit_price)
VALUES (4, 2, 1, 24.99), (4, 1, 1, 19.99), (4, 3, 2, 4.99);

-- =======================================
-- CAFE SALES (Sample for last year)
-- =======================================
-- January 2024
INSERT INTO cafe_sales (cafe_id, transaction_id, customer_id, employee_id, item_id, quantity, line_total, sale_timestamp)
VALUES (1, 'TXN001', 1, 5, 1, 2, 25.98, '2024-01-15 12:30:00'),
(1, 'TXN001', 1, 5, 4, 2, 5.98, '2024-01-15 12:30:00');

-- March 2024
INSERT INTO cafe_sales (cafe_id, transaction_id, customer_id, employee_id, item_id, quantity, line_total, sale_timestamp)
VALUES (2, 'TXN002', 2, 5, 5, 2, 15.98, '2024-03-12 13:00:00'),
(2, 'TXN002', 2, 5, 6, 2, 7.98, '2024-03-12 13:00:00');

-- July 2024
INSERT INTO cafe_sales (cafe_id, transaction_id, employee_id, item_id, quantity, line_total, sale_timestamp)
VALUES (1, 'TXN003', 5, 2, 4, 23.94, '2024-07-04 12:00:00'),
(1, 'TXN003', 5, 3, 4, 19.96, '2024-07-04 12:00:00'),
(1, 'TXN003', 5, 4, 4, 11.96, '2024-07-04 12:00:00');

-- October 2024
INSERT INTO cafe_sales (cafe_id, transaction_id, customer_id, employee_id, item_id, quantity, line_total, sale_timestamp)
VALUES (2, 'TXN004', 1, 5, 6, 1, 3.99, '2024-10-26 14:00:00');

SELECT 'Purchase seed data loaded successfully.' as '';

-- =======================================
-- MORE TICKET SALES (50 additional tickets)
-- =======================================
INSERT INTO tickets (customer_id, visit_date, ticket_type, price, payment_method, purchase_date) VALUES
(NULL, '2024-02-05', 'adult', 45.00, 'cash', '2024-02-05 09:15:00'),
(NULL, '2024-02-05', 'adult', 45.00, 'cash', '2024-02-05 09:15:00'),
(1, '2024-02-14', 'adult', 45.00, 'online', '2024-02-12 11:00:00'),
(1, '2024-02-14', 'adult', 45.00, 'online', '2024-02-12 11:00:00'),
(3, '2024-02-20', 'senior', 35.00, 'debit', '2024-02-20 10:00:00'),
(NULL, '2024-04-01', 'child', 30.00, 'cash', '2024-04-01 13:45:00'),
(NULL, '2024-04-01', 'child', 30.00, 'cash', '2024-04-01 13:45:00'),
(NULL, '2024-04-01', 'adult', 45.00, 'cash', '2024-04-01 13:45:00'),
(2, '2024-04-15', 'adult', 45.00, 'credit', '2024-04-15 11:30:00'),
(2, '2024-04-15', 'child', 30.00, 'credit', '2024-04-15 11:30:00'),
(NULL, '2024-05-02', 'student', 38.00, 'debit', '2024-05-02 12:15:00'),
(NULL, '2024-05-10', 'adult', 45.00, 'online', '2024-05-08 16:00:00'),
(3, '2024-05-25', 'senior', 35.00, 'cash', '2024-05-25 09:45:00'),
(NULL, '2024-06-05', 'adult', 45.00, 'credit', '2024-06-05 10:30:00'),
(NULL, '2024-06-05', 'adult', 45.00, 'credit', '2024-06-05 10:30:00'),
(NULL, '2024-06-12', 'child', 30.00, 'cash', '2024-06-12 14:00:00'),
(1, '2024-06-20', 'adult', 45.00, 'debit', '2024-06-20 11:00:00'),
(NULL, '2024-06-28', 'student', 38.00, 'online', '2024-06-25 20:00:00'),
(NULL, '2024-07-01', 'adult', 45.00, 'cash', '2024-07-01 09:00:00'),
(NULL, '2024-07-02', 'adult', 45.00, 'cash', '2024-07-02 09:05:00'),
(NULL, '2024-07-03', 'adult', 45.00, 'credit', '2024-07-03 09:10:00'),
(NULL, '2024-07-03', 'adult', 45.00, 'credit', '2024-07-03 09:10:00'),
(NULL, '2024-07-03', 'child', 30.00, 'credit', '2024-07-03 09:10:00'),
(NULL, '2024-07-03', 'child', 30.00, 'credit', '2024-07-03 09:10:00'),
(NULL, '2024-07-05', 'adult', 45.00, 'debit', '2024-07-05 09:15:00'),
(2, '2024-07-08', 'adult', 45.00, 'online', '2024-07-06 13:00:00'),
(NULL, '2024-07-11', 'child', 30.00, 'cash', '2024-07-11 09:20:00'),
(NULL, '2024-07-12', 'child', 30.00, 'cash', '2024-07-12 09:25:00'),
(3, '2024-07-18', 'senior', 35.00, 'credit', '2024-07-18 09:30:00'),
(NULL, '2024-07-22', 'student', 38.00, 'debit', '2024-07-22 09:35:00'),
(NULL, '2024-07-25', 'adult', 45.00, 'cash', '2024-07-25 09:40:00'),
(1, '2024-08-01', 'adult', 45.00, 'online', '2024-07-30 17:00:00'),
(NULL, '2024-08-05', 'adult', 45.00, 'credit', '2024-08-05 10:15:00'),
(NULL, '2024-08-05', 'adult', 45.00, 'credit', '2024-08-05 10:15:00'),
(NULL, '2024-08-05', 'child', 30.00, 'credit', '2024-08-05 10:15:00'),
(NULL, '2024-08-05', 'child', 30.00, 'credit', '2024-08-05 10:15:00'),
(NULL, '2024-08-10', 'adult', 45.00, 'debit', '2024-08-10 10:20:00'),
(NULL, '2024-08-15', 'child', 30.00, 'cash', '2024-08-15 10:25:00'),
(2, '2024-08-20', 'adult', 45.00, 'credit', '2024-08-20 10:30:00'),
(NULL, '2024-08-25', 'student', 38.00, 'debit', '2024-08-25 10:35:00'),
(3, '2024-09-01', 'senior', 35.00, 'cash', '2024-09-01 11:00:00'),
(NULL, '2024-09-07', 'adult', 45.00, 'credit', '2024-09-07 11:05:00'),
(NULL, '2024-09-14', 'child', 30.00, 'debit', '2024-09-14 11:10:00'),
(1, '2024-09-21', 'adult', 45.00, 'online', '2024-09-19 19:00:00'),
(NULL, '2024-09-28', 'adult', 45.00, 'credit', '2024-09-28 11:15:00'),
(NULL, '2024-09-28', 'adult', 45.00, 'credit', '2024-09-28 11:15:00'),
(NULL, '2024-09-28', 'child', 30.00, 'credit', '2024-09-28 11:15:00'),
(NULL, '2024-09-28', 'child', 30.00, 'credit', '2024-09-28 11:15:00'),
(NULL, '2024-10-05', 'adult', 45.00, 'cash', '2024-10-05 12:00:00'),
(2, '2024-10-12', 'adult', 45.00, 'debit', '2024-10-12 12:05:00'),
(NULL, '2024-10-19', 'student', 38.00, 'credit', '2024-10-19 12:10:00'),
(3, '2024-10-26', 'senior', 35.00, 'cash', '2024-10-26 12:15:00'),
(NULL, '2024-11-02', 'adult', 45.00, 'debit', '2024-11-02 13:00:00'),
(1, '2024-11-09', 'adult', 45.00, 'online', '2024-11-07 21:00:00'),
(NULL, '2024-11-16', 'child', 30.00, 'cash', '2024-11-16 13:05:00'),
(NULL, '2024-11-23', 'adult', 45.00, 'credit', '2024-11-23 13:10:00'),
(NULL, '2024-11-23', 'adult', 45.00, 'credit', '2024-11-23 13:10:00'),
(NULL, '2024-11-23', 'child', 30.00, 'credit', '2024-11-23 13:10:00'),
(NULL, '2024-11-23', 'child', 30.00, 'credit', '2024-11-23 13:10:00'),
(NULL, '2024-11-30', 'adult', 45.00, 'debit', '2024-11-30 13:15:00');

-- =======================================
-- MORE GIFT SHOP SALES
-- =======================================
-- Transaction 5
INSERT INTO gift_shop_sales_transactions (gift_shop_id, customer_id, employee_id, sale_date, total_amount, payment_method)
VALUES (1, 2, 5, '2024-04-15 14:00:00', 27.98, 'credit');
INSERT INTO gift_shop_sale_items (transaction_id, item_id, quantity, unit_price)
VALUES (5, 5, 1, 19.99), (5, 6, 1, 7.99);

-- Transaction 6
INSERT INTO gift_shop_sales_transactions (gift_shop_id, employee_id, sale_date, total_amount, payment_method)
VALUES (2, 5, '2024-05-02 15:00:00', 14.99, 'debit');
INSERT INTO gift_shop_sale_items (transaction_id, item_id, quantity, unit_price)
VALUES (6, 7, 1, 14.99);

-- Transaction 7
INSERT INTO gift_shop_sales_transactions (gift_shop_id, customer_id, employee_id, sale_date, total_amount, payment_method)
VALUES (1, 1, 5, '2024-06-20 12:30:00', 34.98, 'debit');
INSERT INTO gift_shop_sale_items (transaction_id, item_id, quantity, unit_price)
VALUES (7, 8, 1, 29.99), (7, 3, 1, 4.99);

-- Transaction 8
INSERT INTO gift_shop_sales_transactions (gift_shop_id, employee_id, sale_date, total_amount, payment_method)
VALUES (1, 5, '2024-07-11 11:00:00', 19.99, 'cash');
INSERT INTO gift_shop_sale_items (transaction_id, item_id, quantity, unit_price)
VALUES (8, 5, 1, 19.99);

-- Transaction 9
INSERT INTO gift_shop_sales_transactions (gift_shop_id, customer_id, employee_id, sale_date, total_amount, payment_method)
VALUES (2, 3, 5, '2024-08-20 16:00:00', 22.98, 'credit');
INSERT INTO gift_shop_sale_items (transaction_id, item_id, quantity, unit_price)
VALUES (9, 7, 1, 14.99), (9, 6, 1, 7.99);

-- Transaction 10
INSERT INTO gift_shop_sales_transactions (gift_shop_id, employee_id, sale_date, total_amount, payment_method)
VALUES (1, 5, '2024-09-07 13:00:00', 49.98, 'credit');
INSERT INTO gift_shop_sale_items (transaction_id, item_id, quantity, unit_price)
VALUES (10, 1, 1, 19.99), (10, 2, 1, 24.99);

-- Transaction 11
INSERT INTO gift_shop_sales_transactions (gift_shop_id, customer_id, employee_id, sale_date, total_amount, payment_method)
VALUES (1, 1, 5, '2024-11-09 15:30:00', 37.98, 'debit');
INSERT INTO gift_shop_sale_items (transaction_id, item_id, quantity, unit_price)
VALUES (11, 8, 1, 29.99), (11, 6, 1, 7.99);

-- Transaction 12
INSERT INTO gift_shop_sales_transactions (gift_shop_id, employee_id, sale_date, total_amount, payment_method)
VALUES (2, 5, '2024-11-23 14:30:00', 32.97, 'credit');
INSERT INTO gift_shop_sale_items (transaction_id, item_id, quantity, unit_price)
VALUES (12, 4, 1, 12.99), (12, 7, 1, 14.99), (12, 3, 1, 4.99);

-- =======================================
-- MORE CAFE SALES
-- =======================================
-- February 2024
INSERT INTO cafe_sales (cafe_id, transaction_id, customer_id, employee_id, item_id, quantity, line_total, sale_timestamp)
VALUES (2, 'TXN005', 1, 5, 9, 2, 6.98, '2024-02-14 13:00:00'),
(2, 'TXN005', 1, 5, 10, 1, 2.49, '2024-02-14 13:00:00');

-- April 2024
INSERT INTO cafe_sales (cafe_id, transaction_id, employee_id, item_id, quantity, line_total, sale_timestamp)
VALUES (1, 'TXN006', 5, 5, 2, 8.99, '2024-04-01 14:00:00'),
(1, 'TXN006', 5, 4, 1, 2.99, '2024-04-01 14:00:00');

-- May 2024
INSERT INTO cafe_sales (cafe_id, transaction_id, customer_id, employee_id, item_id, quantity, line_total, sale_timestamp)
VALUES (1, 'TXN007', 3, 5, 8, 1, 7.49, '2024-05-25 12:00:00'),
(1, 'TXN007', 3, 5, 10, 1, 2.49, '2024-05-25 12:00:00');

-- June 2024
INSERT INTO cafe_sales (cafe_id, transaction_id, employee_id, item_id, quantity, line_total, sale_timestamp)
VALUES (2, 'TXN008', 5, 5, 5, 7.99, '2024-06-12 14:30:00'),
(2, 'TXN008', 5, 6, 1, 3.99, '2024-06-12 14:30:00');

-- August 2024
INSERT INTO cafe_sales (cafe_id, transaction_id, employee_id, item_id, quantity, line_total, sale_timestamp)
VALUES (1, 'TXN009', 5, 1, 4, 77.94, '2024-08-05 12:30:00'),
(1, 'TXN009', 5, 7, 2, 13.98, '2024-08-05 12:30:00');

-- September 2024
INSERT INTO cafe_sales (cafe_id, transaction_id, customer_id, employee_id, item_id, quantity, line_total, sale_timestamp)
VALUES (2, 'TXN010', 1, 5, 9, 1, 3.49, '2024-09-21 15:00:00');

-- November 2024
INSERT INTO cafe_sales (cafe_id, transaction_id, employee_id, item_id, quantity, line_total, sale_timestamp)
VALUES (1, 'TXN011', 5, 1, 1, 12.99, '2024-11-02 13:30:00'),
(1, 'TXN011', 5, 3, 1, 4.99, '2024-11-02 13:30:00'),
(1, 'TXN011', 5, 4, 1, 2.99, '2024-11-02 13:30:00');

-- December 2024
INSERT INTO cafe_sales (cafe_id, transaction_id, employee_id, item_id, quantity, line_total, sale_timestamp)
VALUES (2, 'TXN012', 5, 9, 2, 6.98, '2024-12-20 14:00:00'),
(2, 'TXN012', 5, 10, 2, 4.98, '2024-12-20 14:00:00');

SELECT 'Additional purchase seed data loaded successfully.' as '';

