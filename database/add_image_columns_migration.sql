-- Migration: Add image_url columns (TEXT type for base64 images)
-- Run this if you haven't already added the columns

USE zoo_database;

-- Add image_url to animals table (if not exists)
ALTER TABLE `animals`
ADD COLUMN IF NOT EXISTS `image_url` TEXT NULL
AFTER `weight`;

-- Add image_url to habitats table (if not exists)
ALTER TABLE `habitats`
ADD COLUMN IF NOT EXISTS `image_url` TEXT NULL
AFTER `last_maintenance`;

-- Add image_url to events table (if not exists)
ALTER TABLE `events`
ADD COLUMN IF NOT EXISTS `image_url` TEXT NULL
AFTER `ticket_price`;

-- Add image_url to gift_shop_items table (if not exists)
ALTER TABLE `gift_shop_items`
ADD COLUMN IF NOT EXISTS `image_url` TEXT NULL
AFTER `supplier`;

-- Add image_url to cafe_items table (if not exists)
ALTER TABLE `cafe_items`
ADD COLUMN IF NOT EXISTS `image_url` TEXT NULL
AFTER `is_available`;

-- If columns already exist but are VARCHAR(500), change them to TEXT:
-- ALTER TABLE `animals` MODIFY COLUMN `image_url` TEXT NULL;
-- ALTER TABLE `habitats` MODIFY COLUMN `image_url` TEXT NULL;
-- ALTER TABLE `events` MODIFY COLUMN `image_url` TEXT NULL;
-- ALTER TABLE `gift_shop_items` MODIFY COLUMN `image_url` TEXT NULL;
-- ALTER TABLE `cafe_items` MODIFY COLUMN `image_url` TEXT NULL;

