-- Add password field to user_accounts table
-- This migration adds password storage capability to the authentication system

USE zoo_database;

-- Add password_hash column to user_accounts
ALTER TABLE `user_accounts`
ADD COLUMN `password_hash` VARCHAR(255) NOT NULL AFTER `email`;

-- Optional: Add password reset fields
ALTER TABLE `user_accounts`
ADD COLUMN `reset_token` VARCHAR(255) DEFAULT NULL,
ADD COLUMN `reset_token_expires` DATETIME DEFAULT NULL;

-- Note: After running this migration, update existing auth service to use password_hash field
