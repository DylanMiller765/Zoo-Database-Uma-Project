-- Add Login Credentials for Existing Employees
-- This script creates user accounts for employees that already exist in the database

-- First, check which employees exist
SELECT employee_id, first_name, last_name, email, job_role FROM employees;

-- Create user accounts for existing employees (if they don't already have accounts)
INSERT IGNORE INTO user_accounts (username, email, role, employee_id)
SELECT
    LOWER(CONCAT(LEFT(first_name, 1), last_name)) as username,
    email,
    'employee' as role,
    employee_id
FROM employees
WHERE email IS NOT NULL
AND employee_id NOT IN (SELECT COALESCE(employee_id, 0) FROM user_accounts WHERE employee_id IS NOT NULL);

-- Create passwords for the new user accounts (password = 'password' for all)
INSERT IGNORE INTO passwords (account_id, password_hash)
SELECT account_id, 'password'
FROM user_accounts
WHERE role = 'employee'
AND account_id NOT IN (SELECT account_id FROM passwords);

-- Show all employee accounts with their credentials
SELECT
    ua.account_id,
    ua.username,
    ua.email,
    e.first_name,
    e.last_name,
    e.job_role,
    'password' as default_password
FROM user_accounts ua
INNER JOIN employees e ON ua.employee_id = e.employee_id
WHERE ua.role = 'employee'
ORDER BY ua.account_id;
