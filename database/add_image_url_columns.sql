-- Quick migration to add image_url columns
-- Run this in your MySQL database

USE zoo_database;

-- Add image_url to animals table
ALTER TABLE `animals`
ADD COLUMN `image_url` LONGTEXT NULL
AFTER `weight`;

-- Add image_url to habitats table
ALTER TABLE `habitats`
ADD COLUMN `image_url` LONGTEXT NULL
AFTER `last_maintenance`;

-- Add image_url to events table
ALTER TABLE `events`
ADD COLUMN `image_url` LONGTEXT NULL
AFTER `ticket_price`;

-- Add image_url to gift_shop_items table
ALTER TABLE `gift_shop_items`
ADD COLUMN `image_url` LONGTEXT NULL
AFTER `supplier`;

-- Add image_url to cafe_items table
ALTER TABLE `cafe_items`
ADD COLUMN `image_url` LONGTEXT NULL
AFTER `price`;

-- Verify the columns were added
SELECT 'Migration completed! Columns added successfully.' as status;

