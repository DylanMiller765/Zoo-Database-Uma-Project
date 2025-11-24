-- Add quantity_in_stock column to cafe_items table
ALTER TABLE `cafe_items` 
ADD COLUMN `quantity_in_stock` INT DEFAULT 0 AFTER `price`;

-- Update existing items to have a default stock value if needed
UPDATE `cafe_items` SET `quantity_in_stock` = 0 WHERE `quantity_in_stock` IS NULL;

