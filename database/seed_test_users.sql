-- Seed Test Users for Zoo Management System
-- Creates fake employees with user accounts and passwords

USE zoo_database;

-- Insert test employees with different roles
INSERT INTO employees (first_name, last_name, email, phone, ssn, job_role, employment_type, salary, status, hire_date) VALUES
('Sarah', 'Johnson', 'sarah.johnson@zoo.com', '555-0101', '123-45-6789', 'manager', 'full_time', 75000.00, 'active', '2020-01-15'),
('Mike', 'Chen', 'mike.chen@zoo.com', '555-0102', '234-56-7890', 'keeper', 'full_time', 45000.00, 'active', '2021-03-20'),
('Emily', 'Rodriguez', 'emily.rodriguez@zoo.com', '555-0103', '345-67-8901', 'veterinarian', 'full_time', 85000.00, 'active', '2019-06-10'),
('David', 'Kim', 'david.kim@zoo.com', '555-0104', '456-78-9012', 'coordinator', 'full_time', 55000.00, 'active', '2022-02-01'),
('Lisa', 'Thompson', 'lisa.thompson@zoo.com', '555-0105', '567-89-0123', 'cashier', 'part_time', NULL, 'active', '2023-05-15'),
('James', 'Wilson', 'james.wilson@zoo.com', '555-0106', '678-90-1234', 'guide', 'part_time', NULL, 'active', '2023-07-01'),
('Anna', 'Martinez', 'anna.martinez@zoo.com', '555-0107', '789-01-2345', 'keeper', 'full_time', 46000.00, 'active', '2021-09-12'),
('Tom', 'Brown', 'tom.brown@zoo.com', '555-0108', '890-12-3456', 'maintenance', 'full_time', 42000.00, 'active', '2020-11-05');

-- Insert test customers
INSERT INTO customers (first_name, last_name, email, phone, address, city, state, zip_code, annual_pass, registration_date) VALUES
('John', 'Smith', 'john.smith@email.com', '555-1001', '123 Main St', 'Springfield', 'IL', '62701', 'no', '2024-01-10'),
('Maria', 'Garcia', 'maria.garcia@email.com', '555-1002', '456 Oak Ave', 'Springfield', 'IL', '62702', 'yes', '2023-11-15'),
('Robert', 'Davis', 'robert.davis@email.com', '555-1003', '789 Pine Rd', 'Springfield', 'IL', '62703', 'no', '2024-02-20');

-- Create user accounts for employees
INSERT INTO user_accounts (username, email, role, employee_id) VALUES
('sarah.johnson', 'sarah.johnson@zoo.com', 'employee', 1),
('mike.chen', 'mike.chen@zoo.com', 'employee', 2),
('emily.rodriguez', 'emily.rodriguez@zoo.com', 'employee', 3),
('david.kim', 'david.kim@zoo.com', 'employee', 4),
('lisa.thompson', 'lisa.thompson@zoo.com', 'employee', 5),
('james.wilson', 'james.wilson@zoo.com', 'employee', 6),
('anna.martinez', 'anna.martinez@zoo.com', 'employee', 7),
('tom.brown', 'tom.brown@zoo.com', 'employee', 8);

-- Create user accounts for customers
INSERT INTO user_accounts (username, email, role, customer_id) VALUES
('john.smith', 'john.smith@email.com', 'customer', 1),
('maria.garcia', 'maria.garcia@email.com', 'customer', 2),
('robert.davis', 'robert.davis@email.com', 'customer', 3);

-- Add passwords for all users (simple passwords for testing)
-- Employee passwords: all use "password123"
INSERT INTO passwords (account_id, password_hash) VALUES
(1, 'password123'),  -- Sarah Johnson (Manager)
(2, 'password123'),  -- Mike Chen (Keeper)
(3, 'password123'),  -- Emily Rodriguez (Veterinarian)
(4, 'password123'),  -- David Kim (Coordinator)
(5, 'password123'),  -- Lisa Thompson (Cashier)
(6, 'password123'),  -- James Wilson (Guide)
(7, 'password123'),  -- Anna Martinez (Keeper)
(8, 'password123'),  -- Tom Brown (Maintenance)
(9, 'password123'),  -- John Smith (Customer)
(10, 'password123'), -- Maria Garcia (Customer)
(11, 'password123'); -- Robert Davis (Customer)

-- Verify the data
SELECT 'Employees Created:' as Status;
SELECT e.employee_id, e.first_name, e.last_name, e.email, e.job_role, u.account_id
FROM employees e
JOIN user_accounts u ON e.employee_id = u.employee_id;

SELECT 'Customers Created:' as Status;
SELECT c.customer_id, c.first_name, c.last_name, c.email, u.account_id
FROM customers c
JOIN user_accounts u ON c.customer_id = u.customer_id;

SELECT 'Login Credentials:' as Status;
SELECT
    u.account_id,
    u.email,
    u.role,
    'password123' as password,
    CASE
        WHEN u.employee_id IS NOT NULL THEN e.job_role
        ELSE 'customer'
    END as job_role
FROM user_accounts u
LEFT JOIN employees e ON u.employee_id = e.employee_id
ORDER BY u.account_id;
