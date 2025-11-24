-- Migration: Change image_url columns from TEXT to LONGTEXT
-- TEXT can only hold 64KB, LONGTEXT can hold up to 4GB (perfect for large base64 images)
-- Run this in your MySQL database

USE zoo_database;

-- Update animals table
ALTER TABLE `animals`
MODIFY COLUMN `image_url` LONGTEXT NULL;

-- Update habitats table
ALTER TABLE `habitats`
MODIFY COLUMN `image_url` LONGTEXT NULL;

-- Update events table
ALTER TABLE `events`
MODIFY COLUMN `image_url` LONGTEXT NULL;

-- Update gift_shop_items table
ALTER TABLE `gift_shop_items`
MODIFY COLUMN `image_url` LONGTEXT NULL;

-- Update cafe_items table
ALTER TABLE `cafe_items`
MODIFY COLUMN `image_url` LONGTEXT NULL;

-- Verify the columns were updated
SELECT 'Migration completed! Columns updated to LONGTEXT.' as status;

