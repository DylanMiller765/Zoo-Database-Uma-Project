/*Added deleted_at attributes for
1. Attractions
2. gift_shops
3. Cafes
4. Events
5. Habitats
6. Animals
7. Ticket
8. gift_shop_items
9. cafe_items
10. event_registrations*/

ALTER TABLE animals
ADD COLUMN deleted_at DATETIME NULL DEFAULT NULL;
ALTER TABLE attractions
ADD COLUMN deleted_at DATETIME NULL DEFAULT NULL;
ALTER TABLE cafes
ADD COLUMN deleted_at DATETIME NULL DEFAULT NULL;
ALTER TABLE cafe_items
ADD COLUMN deleted_at DATETIME NULL DEFAULT NULL;
ALTER TABLE events
ADD COLUMN deleted_at DATETIME NULL DEFAULT NULL;
ALTER TABLE event_registrations
ADD COLUMN deleted_at DATETIME NULL DEFAULT NULL;
ALTER TABLE gift_shops
ADD COLUMN deleted_at DATETIME NULL DEFAULT NULL;
ALTER TABLE gift_shop_items
ADD COLUMN deleted_at DATETIME NULL DEFAULT NULL;
ALTER TABLE habitats
ADD COLUMN deleted_at DATETIME NULL DEFAULT NULL;
ALTER TABLE tickets
ADD COLUMN deleted_at DATETIME NULL DEFAULT NULL;
ALTER TABLE employees
ADD COLUMN deleted_at DATETIME NULL DEFAULT NULL;


