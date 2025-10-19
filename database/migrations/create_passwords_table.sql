-- Create separate passwords table (security best practice)
-- Passwords should NOT be stored in the same table as user accounts

CREATE TABLE IF NOT EXISTS passwords (
  password_id INT AUTO_INCREMENT PRIMARY KEY,
  account_id INT NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (account_id) REFERENCES user_accounts(account_id) ON DELETE CASCADE,
  INDEX idx_account_id (account_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
COMMENT='Stores user passwords separately from account data for security';

-- Note: Even though we're using plain text passwords for this project,
-- keeping them in a separate table is still a best practice for:
-- 1. Security - limits exposure if user_accounts table is queried
-- 2. Separation of concerns - authentication data separate from user data
-- 3. Easier to add password history, reset tokens, etc. later
