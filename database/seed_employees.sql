-- Seed Employees with Login Credentials
-- This script adds sample employees and creates user accounts for them

-- Insert Employees
INSERT INTO employees (first_name, last_name, email, phone, ssn, job_role, employment_type, salary, status, hire_date, gender) VALUES
('John', 'Smith', 'john.smith@zoo.com', '555-0101', '123-45-6789', 'manager', 'full_time', 75000.00, 'active', '2020-01-15', 'male'),
('Sarah', 'Johnson', 'sarah.johnson@zoo.com', '555-0102', '234-56-7890', 'keeper', 'full_time', 45000.00, 'active', '2021-03-20', 'female'),
('Mike', 'Chen', 'mike.chen@zoo.com', '555-0103', '345-67-8901', 'veterinarian', 'full_time', 85000.00, 'active', '2019-06-10', 'male'),
('Emma', 'Davis', 'emma.davis@zoo.com', '555-0104', '456-78-9012', 'keeper', 'part_time', NULL, 'active', '2022-09-01', 'female'),
('David', 'Lee', 'david.lee@zoo.com', '555-0105', '567-89-0123', 'coordinator', 'full_time', 55000.00, 'active', '2021-11-15', 'male'),
('Lisa', 'Martinez', 'lisa.martinez@zoo.com', '555-0106', '678-90-1234', 'guide', 'full_time', 40000.00, 'active', '2022-02-28', 'female'),
('James', 'Wilson', 'james.wilson@zoo.com', '555-0107', '789-01-2345', 'maintenance', 'full_time', 48000.00, 'active', '2020-07-12', 'male'),
('Rachel', 'Brown', 'rachel.brown@zoo.com', '555-0108', '890-12-3456', 'security', 'full_time', 50000.00, 'active', '2021-05-18', 'female');

-- Create user accounts for employees
-- Note: We need to get the employee_ids that were just inserted
-- Using last 8 inserted employee_ids

-- For demonstration, we'll use a simple approach
-- First, let's create user accounts manually with expected employee_ids
-- Assuming employees table starts at ID 1

INSERT INTO user_accounts (username, email, role, employee_id) VALUES
('jsmith', 'john.smith@zoo.com', 'employee', (SELECT employee_id FROM employees WHERE email = 'john.smith@zoo.com')),
('sjohnson', 'sarah.johnson@zoo.com', 'employee', (SELECT employee_id FROM employees WHERE email = 'sarah.johnson@zoo.com')),
('mchen', 'mike.chen@zoo.com', 'employee', (SELECT employee_id FROM employees WHERE email = 'mike.chen@zoo.com')),
('edavis', 'emma.davis@zoo.com', 'employee', (SELECT employee_id FROM employees WHERE email = 'emma.davis@zoo.com')),
('dlee', 'david.lee@zoo.com', 'employee', (SELECT employee_id FROM employees WHERE email = 'david.lee@zoo.com')),
('lmartinez', 'lisa.martinez@zoo.com', 'employee', (SELECT employee_id FROM employees WHERE email = 'lisa.martinez@zoo.com')),
('jwilson', 'james.wilson@zoo.com', 'employee', (SELECT employee_id FROM employees WHERE email = 'james.wilson@zoo.com')),
('rbrown', 'rachel.brown@zoo.com', 'employee', (SELECT employee_id FROM employees WHERE email = 'rachel.brown@zoo.com'));

-- Create passwords for user accounts (using simple passwords for demo)
-- Password is 'password' for all accounts

INSERT INTO passwords (account_id, password_hash) VALUES
((SELECT account_id FROM user_accounts WHERE email = 'john.smith@zoo.com'), 'password'),
((SELECT account_id FROM user_accounts WHERE email = 'sarah.johnson@zoo.com'), 'password'),
((SELECT account_id FROM user_accounts WHERE email = 'mike.chen@zoo.com'), 'password'),
((SELECT account_id FROM user_accounts WHERE email = 'emma.davis@zoo.com'), 'password'),
((SELECT account_id FROM user_accounts WHERE email = 'david.lee@zoo.com'), 'password'),
((SELECT account_id FROM user_accounts WHERE email = 'lisa.martinez@zoo.com'), 'password'),
((SELECT account_id FROM user_accounts WHERE email = 'james.wilson@zoo.com'), 'password'),
((SELECT account_id FROM user_accounts WHERE email = 'rachel.brown@zoo.com'), 'password');

-- Display created accounts
SELECT
    ua.account_id,
    ua.email,
    ua.role,
    e.first_name,
    e.last_name,
    e.job_role,
    'password' as default_password
FROM user_accounts ua
LEFT JOIN employees e ON ua.employee_id = e.employee_id
WHERE ua.role = 'employee';
