-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: nozomi.proxy.rlwy.net    Database: zoo_database
-- ------------------------------------------------------
-- Server version	9.4.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `animals`
--

DROP TABLE IF EXISTS `animals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `animals` (
  `animal_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `scientific_name` varchar(100) DEFAULT NULL,
  `species` varchar(100) NOT NULL,
  `date_of_birth` date DEFAULT NULL,
  `arrival_date` date NOT NULL,
  `gender` enum('male','female','unknown') DEFAULT NULL,
  `place_of_origin` varchar(100) DEFAULT NULL,
  `habitat_id` int DEFAULT NULL,
  `medical_notes` text,
  `health_status` enum('excellent','good','fair','poor','critical') DEFAULT 'good',
  `active_status` enum('active','transferred','deceased') DEFAULT 'active',
  `endangerment_status` enum('least_concern','near_threatened','vulnerable','endangered','critically_endangered','extinct_in_the_wild','extinct') DEFAULT 'least_concern',
  `weight` decimal(8,2) DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `deletion_notes` text,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_date` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`animal_id`),
  KEY `habitat_id` (`habitat_id`),
  KEY `idx_animal_species` (`species`),
  KEY `idx_animals_deleted` (`deleted_at`),
  CONSTRAINT `animals_ibfk_1` FOREIGN KEY (`habitat_id`) REFERENCES `habitats` (`habitat_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `animals`
--

LOCK TABLES `animals` WRITE;
/*!40000 ALTER TABLE `animals` DISABLE KEYS */;
INSERT INTO `animals` VALUES (1,'Simba','Panthera leo','African Lion','2018-05-12','2025-03-25','male','South Africa',1,NULL,'excellent','active','vulnerable',190.50,'https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?auto=format&fit=crop&w=600&q=80',NULL,'2025-11-25 04:22:32','2025-11-25 04:22:32',NULL),(2,'Nala','Panthera leo','African Lion','2019-03-20','2025-03-25','female','South Africa',1,NULL,'good','active','vulnerable',130.20,'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=600&q=80',NULL,'2025-11-25 04:22:32','2025-11-25 04:22:32',NULL),(3,'Dumbo','Loxodonta africana','African Elephant','2015-08-10','2025-01-07','male','Kenya',2,NULL,'excellent','active','endangered',5500.00,'https://images.unsplash.com/photo-1581852017103-68ac6550d80c?auto=format&fit=crop&w=600&q=80',NULL,'2025-11-25 04:22:32','2025-11-25 04:22:32',NULL),(4,'Koko','Gorilla gorilla','Western Gorilla','2012-11-05','2024-12-15','female','Congo',3,NULL,'good','active','critically_endangered',85.00,'https://images.unsplash.com/photo-1580982512684-2a13f0194451?auto=format&fit=crop&w=600&q=80',NULL,'2025-11-25 04:22:32','2025-11-25 04:22:32',NULL),(5,'Skipper','Aptenodytes forsteri','Emperor Penguin','2020-07-15','2025-05-11','male','Antarctica',4,NULL,'excellent','active','near_threatened',23.50,'https://images.unsplash.com/photo-1551093122-f190e3868297?auto=format&fit=crop&w=600&q=80',NULL,'2025-11-25 04:22:32','2025-11-25 04:22:32',NULL),(6,'Snowball','Ursus maritimus','Polar Bear','2016-12-20','2025-02-22','female','Arctic Circle',5,NULL,'good','active','vulnerable',250.00,'https://images.unsplash.com/photo-1589656966895-2f33e7653819?auto=format&fit=crop&w=600&q=80',NULL,'2025-11-25 04:22:32','2025-11-25 04:22:32',NULL),(7,'Flipper','Tursiops truncatus','Bottlenose Dolphin','2017-09-08','2025-07-14','male','Florida',6,NULL,'excellent','active','least_concern',200.00,'https://images.unsplash.com/photo-1570481662006-a3a1374699e8?auto=format&fit=crop&w=600&q=80',NULL,'2025-11-25 04:22:32','2025-11-25 04:22:32',NULL),(8,'Monty','Python regius','Ball Python','2021-03-15','2025-08-28','male','Ghana',7,NULL,'good','active','least_concern',1.80,'https://images.unsplash.com/photo-1610444565784-0994f305db43?auto=format&fit=crop&w=600&q=80',NULL,'2025-11-25 04:22:32','2025-11-25 04:22:32',NULL),(9,'Zazu','Panthera leo','African Lion','2020-01-01','2025-06-22','male','Tanzania',1,NULL,'excellent','active','vulnerable',180.00,'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?auto=format&fit=crop&w=600&q=80',NULL,'2025-11-25 04:22:32','2025-11-25 04:22:32',NULL),(10,'Sarabi','Panthera leo','African Lion','2019-05-20','2025-07-03','female','Tanzania',1,NULL,'good','active','vulnerable',120.50,'https://images.unsplash.com/photo-1510443048560-afc531d04135?auto=format&fit=crop&w=600&q=80',NULL,'2025-11-25 04:22:32','2025-11-25 04:22:32',NULL),(11,'Tantor','Loxodonta africana','African Elephant','2010-02-15','2025-02-09','male','Botswana',2,NULL,'excellent','active','endangered',6000.00,'https://images.unsplash.com/photo-1503919005314-30d93d07d823?auto=format&fit=crop&w=600&q=80',NULL,'2025-11-25 04:22:32','2025-11-25 04:22:32',NULL),(12,'Kala','Loxodonta africana','African Elephant','2012-07-22','2025-04-05','female','Botswana',2,NULL,'good','active','endangered',4500.00,'https://images.unsplash.com/photo-1564760055278-8d551e5e408c?auto=format&fit=crop&w=600&q=80',NULL,'2025-11-25 04:22:32','2025-11-25 04:22:32',NULL),(13,'Kerchak','Gorilla gorilla','Western Gorilla','2010-09-10','2025-01-17','male','Cameroon',3,NULL,'excellent','active','critically_endangered',150.00,'https://images.unsplash.com/photo-1533202127271-e2311756543b?auto=format&fit=crop&w=600&q=80',NULL,'2025-11-25 04:22:32','2025-11-25 04:22:32',NULL),(14,'Terk','Gorilla gorilla','Western Gorilla','2011-11-05','2025-03-03','female','Cameroon',3,NULL,'good','active','critically_endangered',90.00,'https://images.unsplash.com/photo-1535497274640-f4728cb17029?auto=format&fit=crop&w=600&q=80',NULL,'2025-11-25 04:22:32','2025-11-25 04:22:32',NULL),(15,'Pingu','Aptenodytes forsteri','Emperor Penguin','2021-06-01','2025-05-08','male','Antarctica',4,NULL,'excellent','active','near_threatened',24.00,'https://images.unsplash.com/photo-1517783999520-f068d343e95e?auto=format&fit=crop&w=600&q=80',NULL,'2025-11-25 04:22:32','2025-11-25 04:22:32',NULL),(16,'Pingi','Aptenodytes forsteri','Emperor Penguin','2021-06-05','2025-06-22','female','Antarctica',4,NULL,'excellent','active','near_threatened',22.00,'https://images.unsplash.com/photo-1540880190529-688c226fc0c7?auto=format&fit=crop&w=600&q=80',NULL,'2025-11-25 04:22:32','2025-11-25 04:22:32',NULL),(17,'Pinga','Aptenodytes forsteri','Emperor Penguin','2022-08-01','2025-08-28','female','Antarctica',4,NULL,'good','active','near_threatened',15.00,'https://images.unsplash.com/photo-1462888461757-d218206d2039?auto=format&fit=crop&w=600&q=80',NULL,'2025-11-25 04:22:32','2025-11-25 04:22:32',NULL),(18,'Kowalski','Aptenodytes forsteri','Emperor Penguin','2020-07-15','2025-05-31','male','Antarctica',4,NULL,'excellent','active','near_threatened',23.50,'https://images.unsplash.com/photo-1518063319789-7217e6706b04?auto=format&fit=crop&w=600&q=80',NULL,'2025-11-25 04:22:32','2025-11-25 04:22:32',NULL),(19,'Rico','Aptenodytes forsteri','Emperor Penguin','2020-07-15','2025-07-05','male','Antarctica',4,NULL,'excellent','active','near_threatened',23.50,'https://images.unsplash.com/photo-1470165439527-33eb9777f98d?auto=format&fit=crop&w=600&q=80',NULL,'2025-11-25 04:22:32','2025-11-25 04:22:32',NULL),(20,'Lars','Ursus maritimus','Polar Bear','2015-11-10','2025-01-31','male','Norway',5,NULL,'good','active','vulnerable',450.00,'https://images.unsplash.com/photo-1547781958-b1187425264b?auto=format&fit=crop&w=600&q=80',NULL,'2025-11-25 04:22:32','2025-11-25 04:22:32',NULL),(21,'Echo','Tursiops truncatus','Bottlenose Dolphin','2018-08-01','2025-04-05','female','Mexico',6,NULL,'excellent','active','least_concern',180.00,'https://images.unsplash.com/photo-1629737979624-912df082dc86?auto=format&fit=crop&w=600&q=80',NULL,'2025-11-25 04:22:32','2025-11-25 04:22:32',NULL),(22,'Coral','Tursiops truncatus','Bottlenose Dolphin','2019-05-20','2025-07-25','female','Mexico',6,NULL,'good','active','least_concern',170.00,'https://images.unsplash.com/photo-1570341773099-04c861295e8e?auto=format&fit=crop&w=600&q=80',NULL,'2025-11-25 04:22:32','2025-11-25 04:22:32',NULL),(23,'Kaa','Python reticulatus','Reticulated Python','2020-01-15','2025-06-11','male','Indonesia',7,NULL,'good','active','least_concern',2.50,'https://images.unsplash.com/photo-1623862800407-357563065842?auto=format&fit=crop&w=600&q=80',NULL,'2025-11-25 04:22:32','2025-11-25 04:22:32',NULL),(24,'Nagini','Python bivittatus','Burmese Python','2019-03-10','2025-05-11','female','Myanmar',7,NULL,'excellent','active','vulnerable',3.00,'https://images.unsplash.com/photo-1582239335805-3de131920875?auto=format&fit=crop&w=600&q=80',NULL,'2025-11-25 04:22:32','2025-11-25 04:22:32',NULL),(25,'Salazar','Boa constrictor','Boa Constrictor','2021-08-20','2025-09-19','male','Colombia',7,NULL,'good','active','least_concern',2.00,'https://images.unsplash.com/photo-1531386816488-969248b940ce?auto=format&fit=crop&w=600&q=80',NULL,'2025-11-25 04:22:32','2025-11-25 04:22:32',NULL),(26,'Medusa','Eunectes murinus','Green Anaconda','2018-06-12','2025-02-09','female','Brazil',7,NULL,'excellent','active','least_concern',4.50,'https://images.unsplash.com/photo-1568285935759-42b78995a560?auto=format&fit=crop&w=600&q=80',NULL,'2025-11-25 04:22:32','2025-11-25 04:22:32',NULL),(27,'Basilisk','Varanus komodoensis','Komodo Dragon','2017-09-30','2025-04-05','male','Indonesia',7,NULL,'good','active','endangered',70.00,'https://images.unsplash.com/photo-1545283996-01d78278784d?auto=format&fit=crop&w=600&q=80',NULL,'2025-11-25 04:22:32','2025-11-25 04:22:32',NULL),(28,'Iago','Ara macao','Scarlet Macaw','2022-01-10','2025-10-11','male','Brazil',8,NULL,'excellent','active','least_concern',1.00,'https://images.unsplash.com/photo-1550503023-e6922dfd37c5?auto=format&fit=crop&w=600&q=80',NULL,'2025-11-25 04:22:32','2025-11-25 04:22:32',NULL),(29,'Blu','Ara ararauna','Blue-and-yellow Macaw','2022-02-15','2025-11-02','male','Brazil',8,NULL,'excellent','active','least_concern',1.20,'https://images.unsplash.com/photo-1452570053594-1b985d6ea890?auto=format&fit=crop&w=600&q=80',NULL,'2025-11-25 04:22:32','2025-11-25 04:22:32',NULL),(30,'Jewel','Ara ararauna','Blue-and-yellow Macaw','2022-03-20','2025-09-08','female','Brazil',8,NULL,'good','active','least_concern',1.10,'https://images.unsplash.com/photo-1590426189576-9c424df39c4a?auto=format&fit=crop&w=600&q=80',NULL,'2025-11-25 04:22:32','2025-11-25 04:22:32',NULL),(31,'Touki','Ramphastos toco','Toco Toucan','2021-05-10','2025-06-22','male','Brazil',8,NULL,'excellent','active','least_concern',0.60,'https://images.unsplash.com/photo-1579549320876-0f305047b779?auto=format&fit=crop&w=600&q=80',NULL,'2025-11-25 04:22:32','2025-11-25 04:22:32',NULL),(32,'Hedwig','Bubo scandiacus','Snowy Owl','2020-08-01','2025-05-31','female','Arctic',8,NULL,'good','active','vulnerable',2.00,'https://images.unsplash.com/photo-1589467647242-4f35e40645c9?auto=format&fit=crop&w=600&q=80',NULL,'2025-11-25 04:22:32','2025-11-25 04:22:32',NULL),(33,'Errol','Cacatua galerita','Sulphur-crested Cockatoo','2019-04-12','2025-02-09','male','Australia',8,NULL,'excellent','active','least_concern',0.90,'https://images.unsplash.com/photo-1533166579294-811c75949d8c?auto=format&fit=crop&w=600&q=80',NULL,'2025-11-25 04:22:32','2025-11-25 04:22:32',NULL),(34,'Kevin','Phoenicopterus roseus','Greater Flamingo','2022-06-30','2025-10-22','male','Africa',8,NULL,'good','active','least_concern',3.50,'https://images.unsplash.com/photo-1596708766432-614b7e98d197?auto=format&fit=crop&w=600&q=80',NULL,'2025-11-25 04:22:32','2025-11-25 04:22:32',NULL),(35,'Becky','Gypaetus barbatus','Bearded Vulture','2018-09-10','2025-03-03','female','Himalayas',8,NULL,'excellent','active','near_threatened',6.00,'https://images.unsplash.com/photo-1627917711466-963e634731a5?auto=format&fit=crop&w=600&q=80',NULL,'2025-11-25 04:22:32','2025-11-25 04:22:32',NULL),(36,'Nigel','Pelecanus conspicillatus','Australian Pelican','2021-11-05','2025-09-30','male','Australia',8,NULL,'good','active','least_concern',5.00,'https://images.unsplash.com/photo-1549608276-5786777e6587?auto=format&fit=crop&w=600&q=80',NULL,'2025-11-25 04:22:32','2025-11-25 04:22:32',NULL),(37,'Scuttle','Larus argentatus','Herring Gull','2023-01-01','2025-11-13','male','North America',8,NULL,'excellent','active','least_concern',1.50,'https://images.unsplash.com/photo-1616428740177-3e6f540700c2?auto=format&fit=crop&w=600&q=80',NULL,'2025-11-25 04:22:32','2025-11-25 04:22:32',NULL);
/*!40000 ALTER TABLE `animals` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`%`*/ /*!50003 TRIGGER `alert_animal_health_and_active_status_upon_threshold` AFTER UPDATE ON `animals` FOR EACH ROW BEGIN
    DECLARE existing_alert_id INT;
    DECLARE done INT DEFAULT FALSE;
    DECLARE vet_id INT;

    DECLARE vet_cursor CURSOR FOR
        SELECT employee_id FROM employees WHERE job_role = 'veterinarian';

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    IF NEW.health_status IN ('poor', 'critical') AND NEW.health_status != OLD.health_status THEN

        SET existing_alert_id = NULL;

        SELECT alert.animal_alert_id INTO existing_alert_id
        FROM animals_alert_queue alert
        WHERE alert.animal_id = NEW.animal_id
          AND alert.alert_reason = 'health_status'
          AND alert.processed_at IS NULL
        LIMIT 1;

        IF existing_alert_id IS NULL THEN
            INSERT INTO animals_alert_queue(alert_reason, alert_value, animal_id)
            VALUES ('health_status', NEW.health_status, NEW.animal_id);
        ELSE
            UPDATE animals_alert_queue
            SET
                alert_value = NEW.health_status,
                created_at = NOW()
            WHERE animal_alert_id = existing_alert_id;
        END IF;

        SET done = FALSE;

        OPEN vet_cursor;
        read_loop: LOOP
            FETCH vet_cursor INTO vet_id;

            IF done THEN
                LEAVE read_loop;
            END IF;

            INSERT INTO notifications (employee_id, message, notification_type, created_at)
            VALUES (
                vet_id,
                CONCAT('Alert: Animal "', NEW.name, ' health status is now "', NEW.health_status, '". Immediate attention required.'),
                'alert',
                NOW()
            );
        END LOOP;
        CLOSE vet_cursor;

    END IF;

    IF NEW.active_status = 'deceased' AND NEW.active_status != OLD.active_status THEN

        SET existing_alert_id = NULL;

        SELECT alert.animal_alert_id INTO existing_alert_id
        FROM animals_alert_queue alert
        WHERE alert.animal_id = NEW.animal_id
          AND alert.alert_reason = 'active_status'
          AND alert.processed_at IS NULL
        LIMIT 1;

        IF existing_alert_id IS NULL THEN
            INSERT INTO animals_alert_queue(alert_reason, alert_value, animal_id)
            VALUES ('active_status', NEW.active_status, NEW.animal_id);
        ELSE
            UPDATE animals_alert_queue
            SET created_at = NOW()
            WHERE animal_alert_id = existing_alert_id;
        END IF;

    END IF;

END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `animals_alert_queue`
--

DROP TABLE IF EXISTS `animals_alert_queue`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `animals_alert_queue` (
  `animal_alert_id` int NOT NULL AUTO_INCREMENT,
  `alert_reason` enum('health_status','active_status') NOT NULL,
  `alert_value` varchar(50) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `processed_at` datetime DEFAULT NULL,
  `animal_id` int NOT NULL,
  PRIMARY KEY (`animal_alert_id`),
  KEY `animal_id` (`animal_id`),
  KEY `idx_processed_at` (`processed_at`),
  CONSTRAINT `animals_alert_queue_ibfk_1` FOREIGN KEY (`animal_id`) REFERENCES `animals` (`animal_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `animals_alert_queue`
--

LOCK TABLES `animals_alert_queue` WRITE;
/*!40000 ALTER TABLE `animals_alert_queue` DISABLE KEYS */;
/*!40000 ALTER TABLE `animals_alert_queue` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `attractions`
--

DROP TABLE IF EXISTS `attractions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attractions` (
  `attraction_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `location` varchar(100) DEFAULT NULL,
  `human_capacity` int DEFAULT NULL,
  `opening_time` time DEFAULT NULL,
  `closing_time` time DEFAULT NULL,
  `status` enum('open','closed','maintenance') DEFAULT 'open',
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`attraction_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attractions`
--

LOCK TABLES `attractions` WRITE;
/*!40000 ALTER TABLE `attractions` DISABLE KEYS */;
INSERT INTO `attractions` VALUES (1,'African Savanna','North Zone',500,'09:00:00','18:00:00','open',NULL),(2,'Tropical Rainforest','East Zone',300,'09:00:00','18:00:00','open',NULL),(3,'Arctic Tundra','West Zone',250,'09:00:00','18:00:00','open',NULL),(4,'Aquatic Center','South Zone',400,'10:00:00','19:00:00','open',NULL),(5,'Reptile House','Central Zone',200,'09:00:00','17:00:00','open',NULL);
/*!40000 ALTER TABLE `attractions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cafe_items`
--

DROP TABLE IF EXISTS `cafe_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cafe_items` (
  `item_id` int NOT NULL AUTO_INCREMENT,
  `cafe_id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text,
  `category` varchar(50) DEFAULT NULL,
  `price` decimal(8,2) NOT NULL,
  `is_available` tinyint(1) DEFAULT '1',
  `image_url` varchar(500) DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`item_id`),
  KEY `cafe_id` (`cafe_id`),
  CONSTRAINT `cafe_items_ibfk_1` FOREIGN KEY (`cafe_id`) REFERENCES `cafes` (`cafe_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cafe_items`
--

LOCK TABLES `cafe_items` WRITE;
/*!40000 ALTER TABLE `cafe_items` DISABLE KEYS */;
INSERT INTO `cafe_items` VALUES (1,1,'Burger','Classic beef burger with fries','Entrees',12.99,1,'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',NULL),(2,1,'Hot Dog','All-beef hot dog','Entrees',8.99,1,'https://images.unsplash.com/photo-1613482084286-41f25b486fa2?auto=format&fit=crop&w=800&q=80',NULL),(3,1,'French Fries','Crispy golden fries','Sides',4.99,1,'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?auto=format&fit=crop&w=600&q=80',NULL),(4,1,'Soda','Fountain drink','Beverages',2.99,1,'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80',NULL),(5,1,'Chicken Nuggets','Kids meal chicken nuggets','Entrees',7.99,1,'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=600&q=80',NULL),(6,1,'Ice Cream','Soft serve ice cream cone','Desserts',3.99,1,'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&w=600&q=80',NULL),(7,1,'Pizza Slice','Slice of cheese or pepperoni pizza','Entrees',6.99,1,'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80',NULL),(8,1,'Salad','Fresh garden salad with choice of dressing','Sides',7.49,1,'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',NULL),(9,1,'Coffee','Freshly brewed hot coffee','Beverages',3.49,1,'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80',NULL),(10,1,'Bottled Water','500ml bottled water','Beverages',2.49,1,'https://images.unsplash.com/photo-1550505095-81378a674395?auto=format&fit=crop&w=800&q=80',NULL),(11,1,'Sandwich','Turkey and cheese sandwich','Entrees',9.99,1,'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80',NULL),(12,1,'Cookies','Chocolate chip cookies (3 pack)','Desserts',4.99,1,'https://images.unsplash.com/photo-1622467827417-bbe2237067a9?auto=format&fit=crop&w=800&q=80',NULL);
/*!40000 ALTER TABLE `cafe_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cafe_sales`
--

DROP TABLE IF EXISTS `cafe_sales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cafe_sales` (
  `sale_id` int NOT NULL AUTO_INCREMENT,
  `cafe_id` int NOT NULL,
  `transaction_id` varchar(255) NOT NULL,
  `customer_id` int DEFAULT NULL,
  `employee_id` int DEFAULT NULL,
  `item_id` int NOT NULL,
  `quantity` int NOT NULL,
  `line_total` decimal(10,2) NOT NULL,
  `sale_timestamp` datetime DEFAULT CURRENT_TIMESTAMP,
  `status` enum('completed','returned') DEFAULT 'completed',
  PRIMARY KEY (`sale_id`),
  KEY `cafe_id` (`cafe_id`),
  KEY `customer_id` (`customer_id`),
  KEY `employee_id` (`employee_id`),
  KEY `item_id` (`item_id`),
  CONSTRAINT `cafe_sales_ibfk_1` FOREIGN KEY (`cafe_id`) REFERENCES `cafes` (`cafe_id`),
  CONSTRAINT `cafe_sales_ibfk_2` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`) ON DELETE SET NULL,
  CONSTRAINT `cafe_sales_ibfk_3` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`) ON DELETE SET NULL,
  CONSTRAINT `cafe_sales_ibfk_4` FOREIGN KEY (`item_id`) REFERENCES `cafe_items` (`item_id`)
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cafe_sales`
--

LOCK TABLES `cafe_sales` WRITE;
/*!40000 ALTER TABLE `cafe_sales` DISABLE KEYS */;
INSERT INTO `cafe_sales` VALUES (1,1,'TXN001',1,5,1,2,25.98,'2025-01-15 12:30:00','completed'),(2,1,'TXN001',1,5,4,2,5.98,'2025-01-15 12:30:00','completed'),(3,1,'TXN002',2,5,5,2,15.98,'2025-03-12 13:00:00','completed'),(4,1,'TXN002',2,5,6,2,7.98,'2025-03-12 13:00:00','completed'),(5,1,'TXN003',NULL,5,2,1,8.99,'2025-07-04 12:00:00','completed'),(6,1,'TXN003',NULL,5,3,2,9.98,'2025-07-04 12:00:00','completed'),(7,1,'TXN003',NULL,5,4,1,2.99,'2025-07-04 12:00:00','completed'),(8,1,'TXN004',1,5,6,1,3.99,'2025-10-26 14:00:00','completed'),(9,1,'TXN005',1,5,9,2,6.98,'2025-02-14 13:00:00','completed'),(10,1,'TXN005',1,5,10,1,2.49,'2025-02-14 13:00:00','completed'),(11,1,'TXN006',NULL,5,5,1,7.99,'2025-04-01 14:00:00','completed'),(12,1,'TXN006',NULL,5,4,1,2.99,'2025-04-01 14:00:00','completed'),(13,1,'TXN007',3,5,8,1,7.49,'2025-05-25 12:00:00','completed'),(14,1,'TXN007',3,5,10,1,2.49,'2025-05-25 12:00:00','completed'),(15,1,'TXN008',NULL,5,5,1,7.99,'2025-06-12 14:30:00','completed'),(16,1,'TXN008',NULL,5,6,1,3.99,'2025-06-12 14:30:00','completed'),(17,1,'TXN009',NULL,5,1,4,51.96,'2025-08-05 12:30:00','completed'),(18,1,'TXN009',NULL,5,7,2,13.98,'2025-08-05 12:30:00','completed'),(19,1,'TXN010',1,5,9,1,3.49,'2025-09-21 15:00:00','completed'),(20,1,'TXN011',NULL,5,1,1,12.99,'2025-11-02 13:30:00','completed'),(21,1,'TXN011',NULL,5,3,1,4.99,'2025-11-02 13:30:00','completed'),(22,1,'TXN011',NULL,5,4,1,2.99,'2025-11-02 13:30:00','completed'),(23,1,'TXN012',NULL,5,9,2,6.98,'2025-11-05 14:00:00','completed'),(24,1,'TXN012',NULL,5,10,2,4.98,'2025-11-05 14:00:00','completed'),(25,1,'TXN013',2,5,2,1,8.99,'2025-01-20 11:30:00','completed'),(26,1,'TXN013',2,5,3,1,4.99,'2025-01-20 11:30:00','completed'),(27,1,'TXN014',NULL,5,5,2,15.98,'2025-02-10 12:45:00','completed'),(28,1,'TXN014',NULL,5,9,1,3.49,'2025-02-10 12:45:00','completed'),(29,1,'TXN015',3,5,1,1,12.99,'2025-03-25 13:15:00','completed'),(30,1,'TXN015',3,5,8,1,7.49,'2025-03-25 13:15:00','completed'),(31,1,'TXN016',NULL,5,6,3,11.97,'2025-04-08 14:20:00','completed'),(32,1,'TXN017',1,5,7,2,13.98,'2025-05-12 12:30:00','completed'),(33,1,'TXN018',NULL,5,9,2,6.98,'2025-06-18 15:00:00','completed'),(34,1,'TXN018',NULL,5,10,2,4.98,'2025-06-18 15:00:00','completed'),(35,1,'TXN019',2,5,2,1,8.99,'2025-07-22 13:00:00','completed'),(36,1,'TXN019',2,5,3,1,4.99,'2025-07-22 13:00:00','completed'),(37,1,'TXN020',NULL,5,5,1,7.99,'2025-08-15 12:15:00','completed'),(38,1,'TXN021',3,5,1,2,25.98,'2025-09-05 14:30:00','completed'),(39,1,'TXN022',NULL,5,6,1,3.99,'2025-10-08 11:45:00','completed'),(40,1,'TXN022',NULL,5,9,1,3.49,'2025-10-08 11:45:00','completed'),(41,1,'TXN023',1,5,2,1,8.99,'2025-11-12 12:20:00','completed'),(42,1,'TXN024',NULL,5,8,2,14.98,'2025-11-02 13:45:00','completed'),(43,1,'TXN024',NULL,5,10,1,2.49,'2025-11-02 13:45:00','completed');
/*!40000 ALTER TABLE `cafe_sales` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cafes`
--

DROP TABLE IF EXISTS `cafes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cafes` (
  `cafe_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `location` varchar(100) DEFAULT NULL,
  `opening_time` time DEFAULT NULL,
  `closing_time` time DEFAULT NULL,
  `manager_id` int DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`cafe_id`),
  KEY `manager_id` (`manager_id`),
  KEY `idx_cafes_deleted` (`deleted_at`),
  CONSTRAINT `cafes_ibfk_1` FOREIGN KEY (`manager_id`) REFERENCES `employees` (`employee_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cafes`
--

LOCK TABLES `cafes` WRITE;
/*!40000 ALTER TABLE `cafes` DISABLE KEYS */;
INSERT INTO `cafes` VALUES (1,'Zoo Cafe','Central Plaza','10:00:00','17:00:00',1,NULL);
/*!40000 ALTER TABLE `cafes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customer_payment_methods`
--

DROP TABLE IF EXISTS `customer_payment_methods`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer_payment_methods` (
  `payment_method_id` int NOT NULL AUTO_INCREMENT,
  `customer_id` int NOT NULL,
  `card_number` varchar(19) NOT NULL,
  `cardholder_name` varchar(100) NOT NULL,
  `expiry_month` tinyint NOT NULL,
  `expiry_year` smallint NOT NULL,
  `cvv` varchar(4) DEFAULT NULL,
  `billing_address` varchar(200) DEFAULT NULL,
  `billing_city` varchar(50) DEFAULT NULL,
  `billing_state` varchar(50) DEFAULT NULL,
  `billing_zip` varchar(10) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`payment_method_id`),
  UNIQUE KEY `customer_id` (`customer_id`),
  KEY `idx_customer_payment` (`customer_id`),
  CONSTRAINT `customer_payment_methods_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer_payment_methods`
--

LOCK TABLES `customer_payment_methods` WRITE;
/*!40000 ALTER TABLE `customer_payment_methods` DISABLE KEYS */;
INSERT INTO `customer_payment_methods` VALUES (1,2,'4532123456789012','Maria Garcia',12,2026,'456','456 Oak Ave','Springfield','IL','62702','2025-11-25 04:22:32','2025-11-25 04:22:32'),(2,4,'5412876543210987','Sarah Wilson',6,2027,'789','321 Elm St','Springfield','IL','62704','2025-11-25 04:22:32','2025-11-25 04:22:32'),(3,5,'6011234567890123','Michael Johnson',3,2028,'234','654 Maple Dr','Springfield','IL','62705','2025-11-25 04:22:32','2025-11-25 04:22:32');
/*!40000 ALTER TABLE `customer_payment_methods` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customers` (
  `customer_id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` varchar(200) DEFAULT NULL,
  `city` varchar(50) DEFAULT NULL,
  `state` varchar(50) DEFAULT NULL,
  `zip_code` varchar(10) DEFAULT NULL,
  `annual_pass` enum('yes','no') DEFAULT 'no',
  `membership_start_date` date DEFAULT NULL,
  `membership_end_date` date DEFAULT NULL,
  `membership_auto_renew` tinyint(1) DEFAULT '0',
  `registration_date` date DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`customer_id`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_customer_email` (`email`),
  KEY `idx_customers_deleted` (`deleted_at`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
INSERT INTO `customers` VALUES (1,'John','Smith','john.smith@email.com','5551001101','123 Main St','Springfield','IL','62701','no',NULL,NULL,0,'2024-01-10',NULL),(2,'Maria','Garcia','maria.garcia@email.com','5551001102','456 Oak Ave','Springfield','IL','62702','yes','2024-12-15','2025-12-15',0,'2023-11-15',NULL),(3,'Robert','Davis','robert.davis@email.com','5551001103','789 Pine Rd','Springfield','IL','62703','no',NULL,NULL,0,'2024-02-20',NULL),(4,'Sarah','Wilson','sarah.wilson@email.com','5551001104','321 Elm St','Springfield','IL','62704','yes','2024-06-01','2025-06-01',0,'2024-05-15',NULL),(5,'Michael','Johnson','michael.johnson@email.com','5551001105','654 Maple Dr','Springfield','IL','62705','yes','2024-03-15','2025-03-15',0,'2024-03-01',NULL);
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`%`*/ /*!50003 TRIGGER `trg_membership_expiration_notification` AFTER UPDATE ON `customers` FOR EACH ROW BEGIN
    IF NEW.annual_pass = 'yes' AND NEW.membership_end_date IS NOT NULL THEN
        IF DATEDIFF(NEW.membership_end_date, CURDATE()) BETWEEN 1 AND 30 THEN
            IF NOT EXISTS (
                SELECT 1 FROM notifications n
                WHERE n.customer_id = NEW.customer_id
                AND n.message LIKE CONCAT('%', DATE_FORMAT(NEW.membership_end_date, '%M %d, %Y'), '%')
                AND DATE(n.created_at) >= DATE_ADD(CURDATE(), INTERVAL -7 DAY)
            ) THEN
                INSERT INTO notifications (customer_id, message, notification_type, created_at)
                VALUES (
                    NEW.customer_id,
                    CONCAT('Your membership expires on ', DATE_FORMAT(NEW.membership_end_date, '%M %d, %Y'),
                           '. Renew now to continue enjoying member benefits!'),
                    'warning',
                    NOW()
                );
            END IF;
        END IF;
    END IF;

    IF NEW.annual_pass = 'yes' AND NEW.membership_end_date IS NOT NULL THEN
        IF NEW.membership_end_date < CURDATE() THEN
            UPDATE customers
            SET annual_pass = 'no'
            WHERE customer_id = NEW.customer_id;
        END IF;
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `donations`
--

DROP TABLE IF EXISTS `donations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `donations` (
  `donation_id` int NOT NULL AUTO_INCREMENT,
  `customer_id` int DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `donation_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `message` text,
  `donation_type` enum('general','conservation','research','animal_care') DEFAULT 'general',
  `payment_method` enum('cash','credit','debit') DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`donation_id`),
  KEY `customer_id` (`customer_id`),
  CONSTRAINT `donations_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `donations`
--

LOCK TABLES `donations` WRITE;
/*!40000 ALTER TABLE `donations` DISABLE KEYS */;
INSERT INTO `donations` VALUES (1,1,50.00,'2024-01-15 16:00:00','Happy to support the zoo!','general',NULL,NULL),(2,2,100.00,'2024-02-10 14:30:00','For the penguin habitat','general',NULL,NULL),(3,3,25.00,'2024-03-05 11:00:00',NULL,'general',NULL,NULL),(4,1,75.00,'2024-04-12 15:45:00','Love the animals','general',NULL,NULL),(5,2,150.00,'2024-05-20 10:30:00','Conservation is important','general',NULL,NULL),(6,4,200.00,'2024-06-08 13:00:00','For endangered species','general',NULL,NULL),(7,5,30.00,'2024-07-04 09:15:00',NULL,'general',NULL,NULL),(8,1,40.00,'2024-08-15 14:20:00','Keep up the great work!','general',NULL,NULL),(9,3,60.00,'2024-09-10 11:45:00','For the lions','general',NULL,NULL),(10,2,125.00,'2024-10-05 16:30:00','In memory of my grandmother','general',NULL,NULL),(11,4,80.00,'2024-11-12 12:00:00',NULL,'general',NULL,NULL),(12,5,45.00,'2024-12-01 10:15:00','Merry Christmas!','general',NULL,NULL),(13,1,100.00,'2024-02-28 13:30:00','Annual donation','general',NULL,NULL),(14,3,35.00,'2024-04-18 15:00:00',NULL,'general',NULL,NULL),(15,2,90.00,'2024-06-22 11:30:00','For animal enrichment programs','general',NULL,NULL),(16,4,55.00,'2024-08-30 14:45:00','Supporting conservation','general',NULL,NULL),(17,5,120.00,'2024-10-18 09:00:00','For the new aquatic center','general',NULL,NULL),(18,1,65.00,'2024-11-25 16:00:00','Thanksgiving donation','general',NULL,NULL),(19,3,110.00,'2024-01-28 12:30:00','For veterinary care','general',NULL,NULL),(20,2,85.00,'2024-03-22 10:45:00',NULL,'general',NULL,NULL);
/*!40000 ALTER TABLE `donations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employees`
--

DROP TABLE IF EXISTS `employees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employees` (
  `employee_id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `ssn` char(11) NOT NULL,
  `job_role` enum('keeper','manager','coordinator','cashier','guide','veterinarian','maintenance','security','other') NOT NULL,
  `employment_type` enum('full_time','part_time') NOT NULL DEFAULT 'full_time',
  `salary` decimal(10,2) DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `hire_date` date DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `city` varchar(50) DEFAULT NULL,
  `state` varchar(50) DEFAULT NULL,
  `zip_code` varchar(10) DEFAULT NULL,
  `gender` enum('male','female','other','prefer_not_to_say') DEFAULT NULL,
  `birthday` date DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`employee_id`),
  UNIQUE KEY `ssn` (`ssn`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_employees_deleted` (`deleted_at`),
  CONSTRAINT `chk_salary` CHECK ((((`employment_type` = _utf8mb4'full_time') and (`salary` is not null)) or ((`employment_type` = _utf8mb4'part_time') and (`salary` is null))))
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employees`
--

LOCK TABLES `employees` WRITE;
/*!40000 ALTER TABLE `employees` DISABLE KEYS */;
INSERT INTO `employees` VALUES (1,'Sarah','Johnson','sarah.johnson@zoo.com','5550101101','123-45-6789','manager','full_time',75000.00,'active','2020-01-15',NULL,NULL,NULL,NULL,'female',NULL,NULL),(2,'Mike','Chen','mike.chen@zoo.com','5550101102','234-56-7890','keeper','full_time',45000.00,'active','2021-03-20',NULL,NULL,NULL,NULL,'male',NULL,NULL),(3,'Emily','Rodriguez','emily.rodriguez@zoo.com','5550101103','345-67-8901','veterinarian','full_time',85000.00,'active','2019-06-10',NULL,NULL,NULL,NULL,'female',NULL,NULL),(4,'David','Kim','david.kim@zoo.com','5550101104','456-78-9012','coordinator','full_time',55000.00,'active','2022-02-01',NULL,NULL,NULL,NULL,'male',NULL,NULL),(5,'Lisa','Thompson','lisa.thompson@zoo.com','5550101105','567-89-0123','cashier','part_time',NULL,'active','2023-05-15',NULL,NULL,NULL,NULL,'female',NULL,NULL),(6,'James','Wilson','james.wilson@zoo.com','5550101106','678-90-1234','guide','part_time',NULL,'active','2023-07-01',NULL,NULL,NULL,NULL,'male',NULL,NULL),(7,'Anna','Martinez','anna.martinez@zoo.com','5550101107','789-01-2345','keeper','full_time',46000.00,'active','2021-09-12',NULL,NULL,NULL,NULL,'female',NULL,NULL),(8,'Tom','Brown','tom.brown@zoo.com','5550101108','890-12-3456','maintenance','full_time',42000.00,'active','2020-11-05',NULL,NULL,NULL,NULL,'male',NULL,NULL),(9,'Chris','Green','chris.green@zoo.com','5550101109','987-65-4321','keeper','full_time',45000.00,'active','2023-08-01',NULL,NULL,NULL,NULL,'male',NULL,NULL),(10,'Jessica','Blue','jessica.blue@zoo.com','5550101110','876-54-3210','keeper','full_time',45500.00,'active','2023-09-01',NULL,NULL,NULL,NULL,'female',NULL,NULL),(11,'Mark','White','mark.white@zoo.com','5550101111','765-43-2109','veterinarian','full_time',86000.00,'active','2023-07-15',NULL,NULL,NULL,NULL,'male',NULL,NULL),(12,'Laura','Black','laura.black@zoo.com','5550101112','999-32-1098','keeper','part_time',NULL,'active','2024-01-10',NULL,NULL,NULL,NULL,'female',NULL,NULL),(13,'Sky','Jones','skyjones.vet@gmail.com','5550101113','654-32-1098','veterinarian','full_time',86000.00,'active','2023-07-15',NULL,NULL,NULL,NULL,'female',NULL,NULL);
/*!40000 ALTER TABLE `employees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event_registrations`
--

DROP TABLE IF EXISTS `event_registrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `event_registrations` (
  `registration_id` int NOT NULL AUTO_INCREMENT,
  `event_id` int NOT NULL,
  `customer_id` int DEFAULT NULL,
  `registration_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `number_of_participants` int DEFAULT '1',
  `total_amount` decimal(10,2) DEFAULT NULL,
  `payment_status` enum('pending','paid','cancelled') DEFAULT 'paid',
  `refunded_at` datetime DEFAULT NULL,
  `refund_reason` varchar(255) DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`registration_id`),
  KEY `event_id` (`event_id`),
  KEY `customer_id` (`customer_id`),
  CONSTRAINT `event_registrations_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`event_id`) ON DELETE CASCADE,
  CONSTRAINT `event_registrations_ibfk_2` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=135 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event_registrations`
--

LOCK TABLES `event_registrations` WRITE;
/*!40000 ALTER TABLE `event_registrations` DISABLE KEYS */;
INSERT INTO `event_registrations` VALUES (1,1,1,'2024-01-10 10:00:00',2,30.00,'paid',NULL,NULL,NULL),(2,1,2,'2024-01-12 14:30:00',1,15.00,'paid',NULL,NULL,NULL),(3,1,NULL,'2024-01-15 09:15:00',3,45.00,'paid',NULL,NULL,NULL),(4,1,3,'2024-01-18 11:00:00',2,30.00,'paid',NULL,NULL,NULL),(5,1,1,'2024-01-20 13:45:00',4,60.00,'paid',NULL,NULL,NULL),(6,1,NULL,'2024-01-25 10:30:00',1,15.00,'paid',NULL,NULL,NULL),(7,1,2,'2024-01-28 15:00:00',2,30.00,'cancelled',NULL,NULL,NULL),(8,1,3,'2024-02-01 09:00:00',3,45.00,'paid',NULL,NULL,NULL),(9,1,NULL,'2024-02-05 12:00:00',2,30.00,'paid',NULL,NULL,NULL),(10,1,1,'2024-02-08 14:15:00',1,15.00,'paid',NULL,NULL,NULL),(11,2,2,'2024-01-08 10:00:00',1,10.00,'paid',NULL,NULL,NULL),(12,2,3,'2024-01-15 11:30:00',2,20.00,'paid',NULL,NULL,NULL),(13,2,NULL,'2024-01-20 09:45:00',1,10.00,'paid',NULL,NULL,NULL),(14,2,1,'2024-01-25 13:00:00',3,30.00,'paid',NULL,NULL,NULL),(15,2,NULL,'2024-02-02 10:15:00',2,20.00,'paid',NULL,NULL,NULL),(16,2,2,'2024-02-10 14:30:00',1,10.00,'paid',NULL,NULL,NULL),(17,2,3,'2024-02-15 11:00:00',2,20.00,'cancelled',NULL,NULL,NULL),(18,2,NULL,'2024-02-20 09:30:00',1,10.00,'paid',NULL,NULL,NULL),(19,2,1,'2024-02-25 12:45:00',3,30.00,'paid',NULL,NULL,NULL),(20,2,2,'2024-03-01 10:00:00',2,20.00,'paid',NULL,NULL,NULL),(21,3,3,'2024-01-05 14:00:00',3,60.00,'paid',NULL,NULL,NULL),(22,3,1,'2024-01-12 10:30:00',2,40.00,'paid',NULL,NULL,NULL),(23,3,2,'2024-01-18 13:15:00',1,20.00,'paid',NULL,NULL,NULL),(24,3,NULL,'2024-01-25 09:00:00',4,80.00,'paid',NULL,NULL,NULL),(25,3,3,'2024-02-01 11:45:00',2,40.00,'paid',NULL,NULL,NULL),(26,3,NULL,'2024-02-08 14:20:00',3,60.00,'paid',NULL,NULL,NULL),(27,3,1,'2024-02-14 10:15:00',1,20.00,'paid',NULL,NULL,NULL),(28,3,2,'2024-02-20 12:30:00',2,40.00,'cancelled',NULL,NULL,NULL),(29,3,NULL,'2024-02-27 09:45:00',3,60.00,'paid',NULL,NULL,NULL),(30,3,3,'2024-03-05 13:00:00',2,40.00,'paid',NULL,NULL,NULL),(31,4,1,'2024-01-02 09:00:00',1,250.00,'paid',NULL,NULL,NULL),(32,4,2,'2024-01-10 11:30:00',2,500.00,'paid',NULL,NULL,NULL),(33,4,NULL,'2024-01-20 14:15:00',1,250.00,'paid',NULL,NULL,NULL),(34,4,3,'2024-02-01 10:00:00',3,750.00,'paid',NULL,NULL,NULL),(35,4,1,'2024-02-10 13:45:00',2,500.00,'cancelled',NULL,NULL,NULL),(36,4,NULL,'2024-02-20 09:30:00',1,250.00,'paid',NULL,NULL,NULL),(37,4,2,'2024-03-01 11:00:00',1,250.00,'paid',NULL,NULL,NULL),(38,4,3,'2024-03-10 14:20:00',2,500.00,'paid',NULL,NULL,NULL),(39,5,2,'2024-01-15 10:00:00',2,70.00,'paid',NULL,NULL,NULL),(40,5,3,'2024-01-20 13:30:00',1,35.00,'paid',NULL,NULL,NULL),(41,5,NULL,'2024-01-28 09:45:00',3,105.00,'paid',NULL,NULL,NULL),(42,5,1,'2024-02-05 11:15:00',2,70.00,'paid',NULL,NULL,NULL),(43,5,NULL,'2024-02-12 14:00:00',4,140.00,'paid',NULL,NULL,NULL),(44,5,2,'2024-02-18 10:30:00',1,35.00,'cancelled',NULL,NULL,NULL),(45,5,3,'2024-02-25 12:45:00',2,70.00,'paid',NULL,NULL,NULL),(46,5,NULL,'2024-03-05 09:15:00',3,105.00,'paid',NULL,NULL,NULL),(47,1,2,'2024-03-10 10:00:00',2,30.00,'paid',NULL,NULL,NULL),(48,1,NULL,'2024-03-15 14:30:00',3,45.00,'paid',NULL,NULL,NULL),(49,1,3,'2024-03-20 09:00:00',1,15.00,'paid',NULL,NULL,NULL),(50,2,1,'2024-03-08 11:00:00',2,20.00,'paid',NULL,NULL,NULL),(51,2,NULL,'2024-03-18 13:15:00',1,10.00,'paid',NULL,NULL,NULL),(52,3,2,'2024-03-12 10:30:00',2,40.00,'paid',NULL,NULL,NULL),(53,3,1,'2024-03-22 14:00:00',3,60.00,'paid',NULL,NULL,NULL),(54,4,NULL,'2024-03-25 09:30:00',2,500.00,'paid',NULL,NULL,NULL),(55,4,3,'2024-04-01 11:45:00',1,250.00,'paid',NULL,NULL,NULL),(56,5,1,'2024-03-28 10:15:00',2,70.00,'paid',NULL,NULL,NULL),(57,5,2,'2024-04-05 13:00:00',3,105.00,'cancelled',NULL,NULL,NULL),(58,1,1,'2024-04-10 09:00:00',4,60.00,'paid',NULL,NULL,NULL),(59,2,3,'2024-04-12 11:30:00',2,20.00,'paid',NULL,NULL,NULL),(60,3,NULL,'2024-04-15 14:45:00',1,20.00,'paid',NULL,NULL,NULL),(61,1,2,'2024-04-20 10:00:00',1,15.00,'paid',NULL,NULL,NULL),(62,5,NULL,'2024-04-25 12:15:00',2,70.00,'paid',NULL,NULL,NULL),(63,4,1,'2024-05-01 09:30:00',1,250.00,'paid',NULL,NULL,NULL),(64,2,2,'2024-05-05 13:00:00',3,30.00,'paid',NULL,NULL,NULL),(65,3,3,'2024-05-10 10:45:00',2,40.00,'paid',NULL,NULL,NULL),(66,1,NULL,'2024-05-15 14:20:00',2,30.00,'paid',NULL,NULL,NULL),(67,5,1,'2024-05-20 09:15:00',1,35.00,'cancelled',NULL,NULL,NULL),(68,4,2,'2024-06-01 11:00:00',3,750.00,'paid',NULL,NULL,NULL),(69,1,3,'2024-06-10 10:30:00',3,45.00,'paid',NULL,NULL,NULL),(70,2,NULL,'2024-06-15 13:45:00',1,10.00,'paid',NULL,NULL,NULL),(71,3,1,'2024-06-20 09:00:00',2,40.00,'paid',NULL,NULL,NULL),(72,5,2,'2024-06-25 12:30:00',2,70.00,'paid',NULL,NULL,NULL),(73,1,2,'2024-07-05 10:00:00',2,30.00,'paid',NULL,NULL,NULL),(74,2,3,'2024-07-10 14:15:00',2,20.00,'paid',NULL,NULL,NULL),(75,3,NULL,'2024-07-15 09:30:00',3,60.00,'paid',NULL,NULL,NULL),(76,4,1,'2024-07-20 11:45:00',2,500.00,'paid',NULL,NULL,NULL),(77,5,NULL,'2024-07-25 13:00:00',3,105.00,'paid',NULL,NULL,NULL),(78,1,3,'2024-08-05 10:30:00',1,15.00,'paid',NULL,NULL,NULL),(79,2,1,'2024-08-10 12:00:00',3,30.00,'paid',NULL,NULL,NULL),(80,3,2,'2024-08-15 09:45:00',2,40.00,'cancelled',NULL,NULL,NULL),(81,4,NULL,'2024-08-20 14:30:00',1,250.00,'paid',NULL,NULL,NULL),(82,5,3,'2024-08-25 10:15:00',2,70.00,'paid',NULL,NULL,NULL),(83,1,NULL,'2024-09-01 11:00:00',2,30.00,'paid',NULL,NULL,NULL),(84,2,2,'2024-09-08 13:30:00',1,10.00,'paid',NULL,NULL,NULL),(85,3,1,'2024-09-15 09:00:00',3,60.00,'paid',NULL,NULL,NULL),(86,4,3,'2024-09-20 10:45:00',2,500.00,'paid',NULL,NULL,NULL),(87,5,NULL,'2024-09-25 12:15:00',1,35.00,'paid',NULL,NULL,NULL),(88,1,2,'2024-10-05 10:00:00',3,45.00,'paid',NULL,NULL,NULL),(89,2,NULL,'2024-10-10 14:00:00',2,20.00,'paid',NULL,NULL,NULL),(90,3,3,'2024-10-15 09:30:00',1,20.00,'paid',NULL,NULL,NULL),(91,4,1,'2024-10-20 11:15:00',1,250.00,'paid',NULL,NULL,NULL),(92,5,2,'2024-10-25 13:45:00',2,70.00,'cancelled',NULL,NULL,NULL),(93,1,3,'2024-11-01 10:30:00',2,30.00,'paid',NULL,NULL,NULL),(94,2,1,'2024-11-05 12:00:00',3,30.00,'paid',NULL,NULL,NULL),(95,3,NULL,'2024-11-10 09:45:00',2,40.00,'paid',NULL,NULL,NULL),(96,4,2,'2024-11-15 14:20:00',2,500.00,'paid',NULL,NULL,NULL),(97,5,3,'2024-11-20 10:15:00',3,105.00,'paid',NULL,NULL,NULL),(98,1,NULL,'2024-12-01 11:00:00',1,15.00,'paid',NULL,NULL,NULL),(99,2,2,'2024-12-05 13:30:00',2,20.00,'paid',NULL,NULL,NULL),(100,3,1,'2024-12-10 09:00:00',3,60.00,'paid',NULL,NULL,NULL),(101,4,NULL,'2024-12-15 10:45:00',1,250.00,'cancelled',NULL,NULL,NULL),(102,5,3,'2024-12-20 12:15:00',2,70.00,'paid',NULL,NULL,NULL),(103,6,1,'2025-10-25 10:00:00',2,20.00,'paid',NULL,NULL,NULL),(104,6,2,'2025-10-28 14:30:00',1,10.00,'paid',NULL,NULL,NULL),(105,6,3,'2025-11-01 09:15:00',3,30.00,'paid',NULL,NULL,NULL),(106,6,NULL,'2025-11-03 11:00:00',2,20.00,'paid',NULL,NULL,NULL),(107,6,1,'2025-11-05 13:45:00',4,40.00,'paid',NULL,NULL,NULL),(108,6,2,'2025-11-08 10:30:00',1,10.00,'paid',NULL,NULL,NULL),(109,7,1,'2025-11-10 10:00:00',2,30.00,'paid',NULL,NULL,NULL),(110,7,2,'2025-11-12 14:00:00',1,15.00,'paid',NULL,NULL,NULL),(111,7,3,'2025-11-13 09:30:00',3,45.00,'paid',NULL,NULL,NULL),(112,7,NULL,'2025-11-14 11:15:00',2,30.00,'paid',NULL,NULL,NULL),(113,7,1,'2025-11-15 13:00:00',4,60.00,'paid',NULL,NULL,NULL),(114,7,NULL,'2025-11-16 10:45:00',1,15.00,'paid',NULL,NULL,NULL),(115,8,2,'2025-11-12 10:00:00',2,20.00,'paid',NULL,NULL,NULL),(116,8,3,'2025-11-14 13:30:00',1,10.00,'paid',NULL,NULL,NULL),(117,8,1,'2025-11-15 09:45:00',3,30.00,'paid',NULL,NULL,NULL),(118,8,NULL,'2025-11-16 12:00:00',2,20.00,'paid',NULL,NULL,NULL),(119,8,2,'2025-11-17 14:15:00',1,10.00,'paid',NULL,NULL,NULL),(120,9,1,'2025-11-15 10:00:00',2,40.00,'paid',NULL,NULL,NULL),(121,9,2,'2025-11-16 14:30:00',2,40.00,'paid',NULL,NULL,NULL),(122,9,3,'2025-11-17 09:15:00',1,20.00,'paid',NULL,NULL,NULL),(123,9,NULL,'2025-11-18 11:00:00',3,60.00,'paid',NULL,NULL,NULL),(124,9,1,'2025-11-18 13:45:00',1,20.00,'paid',NULL,NULL,NULL),(125,10,1,'2025-10-20 10:00:00',1,250.00,'paid',NULL,NULL,NULL),(126,10,2,'2025-11-01 14:30:00',2,500.00,'paid',NULL,NULL,NULL),(127,10,NULL,'2025-11-10 09:45:00',1,250.00,'paid',NULL,NULL,NULL),(128,10,3,'2025-11-15 11:15:00',1,250.00,'paid',NULL,NULL,NULL),(129,11,1,'2025-11-10 10:00:00',2,70.00,'paid',NULL,NULL,NULL),(130,11,2,'2025-11-13 14:00:00',1,35.00,'paid',NULL,NULL,NULL),(131,11,3,'2025-11-14 09:30:00',3,105.00,'paid',NULL,NULL,NULL),(132,11,NULL,'2025-11-15 12:00:00',2,70.00,'paid',NULL,NULL,NULL),(133,11,1,'2025-11-16 13:45:00',4,140.00,'paid',NULL,NULL,NULL),(134,11,NULL,'2025-11-17 10:30:00',1,35.00,'paid',NULL,NULL,NULL);
/*!40000 ALTER TABLE `event_registrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `events` (
  `event_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text,
  `event_date` date DEFAULT NULL,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `location` varchar(100) DEFAULT NULL,
  `max_participants` int DEFAULT NULL,
  `ticket_price` decimal(8,2) DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `coordinator_id` int DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`event_id`),
  KEY `coordinator_id` (`coordinator_id`),
  KEY `idx_events_deleted` (`deleted_at`),
  CONSTRAINT `events_ibfk_1` FOREIGN KEY (`coordinator_id`) REFERENCES `employees` (`employee_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` VALUES (1,'Tiger Feeding Demonstration','Watch our experts safely feed the tigers with specialized techniques','2025-09-15','10:00:00','11:00:00','Big Cat Arena',200,12.00,'https://images.unsplash.com/photo-1503335165261-a1d723f1d0e6?auto=format&fit=crop&w=800&q=80',4,'2025-11-25 04:22:32',NULL),(2,'Reptile Exhibition','Explore the world of snakes, lizards, and other reptiles up close','2025-09-28','14:00:00','15:30:00','Reptile House',100,8.00,'https://images.unsplash.com/photo-1444947173422-9737546c41a5?auto=format&fit=crop&w=800&q=80',4,'2025-11-25 04:22:32',NULL),(3,'Primate Discovery Walk','Guided tour through our primate exhibits with interactive experiences','2025-10-10','11:00:00','12:30:00','Primate Territory',75,10.00,'https://images.unsplash.com/photo-1463852247062-1bbca38f7805?auto=format&fit=crop&w=800&q=80',4,'2025-11-25 04:22:32',NULL),(4,'Butterfly Garden Workshop','Learn about monarch butterflies and pollination in our gardens','2025-10-22','13:00:00','14:00:00','Botanical Garden',60,7.00,'https://images.unsplash.com/photo-1548701822-320aba03ab0f?auto=format&fit=crop&w=800&q=80',4,'2025-11-25 04:22:32',NULL),(5,'Avian Training Show','See our trained birds perform impressive aerial displays','2025-11-05','15:00:00','16:00:00','Bird Sanctuary Theater',150,15.00,'https://images.unsplash.com/photo-1664790423583-0d72e6ce77fa?auto=format&fit=crop&w=800&q=80',4,'2025-11-25 04:22:32',NULL),(6,'Aquatic Creature Talk','Educational presentation about marine conservation and aquatic life','2025-11-12','10:30:00','11:30:00','Aquatic Center Amphitheater',250,10.00,'https://images.unsplash.com/photo-1551980349-75d992b49c86?auto=format&fit=crop&w=800&q=80',4,'2025-11-25 04:22:32',NULL),(7,'Dolphin Show','Watch our amazing dolphins perform tricks and learn about marine conservation','2025-11-21','14:00:00','15:00:00','Aquatic Center Amphitheater',400,15.00,'https://images.unsplash.com/photo-1570481662006-a3a1374699e8?auto=format&fit=crop&w=800&q=80',4,'2025-11-25 04:22:32',NULL),(8,'Penguin Feeding Time','Help our keepers feed the penguins and learn about their diet','2025-11-28','11:00:00','11:30:00','Penguin Cove',50,10.00,'https://images.unsplash.com/photo-1598439210625-5067c578f3f6?auto=format&fit=crop&w=800&q=80',4,'2025-11-25 04:22:32',NULL),(9,'Lion Encounter','Get up close with our lions through the safe viewing area','2025-12-05','13:00:00','14:00:00','African Savanna',100,20.00,'https://images.unsplash.com/photo-1634875979174-20afffe447b7?auto=format&fit=crop&w=800&q=80',4,'2025-11-25 04:22:32',NULL),(10,'Kids Zoo Camp','Week-long summer camp for children ages 8-12','2025-12-15','09:00:00','15:00:00','Education Center',30,250.00,'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=800&q=80',4,'2025-11-25 04:22:32',NULL),(11,'Night at the Zoo','Special after-hours tour experience with nocturnal animals','2025-12-22','19:00:00','22:00:00','Various Locations',150,35.00,'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=600&q=80',4,'2025-11-25 04:22:32',NULL);
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`%`*/ /*!50003 TRIGGER `trigger_event_cancellation` AFTER UPDATE ON `events` FOR EACH ROW BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE customer_id_var INT;
    DECLARE event_name_var VARCHAR(100);
    DECLARE event_date_var DATE;
    DECLARE event_time_var TIME;
    DECLARE formatted_datetime VARCHAR(100);
    DECLARE cancellation_message VARCHAR(500);

    DECLARE customer_cursor CURSOR FOR
        SELECT DISTINCT er.customer_id
        FROM event_registrations er
        WHERE er.event_id = NEW.event_id
          AND er.customer_id IS NOT NULL;

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    IF OLD.deleted_at IS NULL AND NEW.deleted_at IS NOT NULL THEN

        SET event_name_var = NEW.name;
        SET event_date_var = NEW.event_date;
        SET event_time_var = NEW.start_time;

        SET formatted_datetime = DATE_FORMAT(event_date_var, '%M %d, %Y');
        IF event_time_var IS NOT NULL THEN
            SET formatted_datetime = CONCAT(formatted_datetime, ' at ', DATE_FORMAT(event_time_var, '%h:%i %p'));
        END IF;

        SET cancellation_message = CONCAT(
            'CANCELLATION: The event "', event_name_var, '" scheduled for ', formatted_datetime,
            ' has been cancelled. We sincerely apologize for any inconvenience this may cause. ',
            'A full refund has been automatically processed for your registration.'
        );

        OPEN customer_cursor;

        notification_loop: LOOP
            FETCH customer_cursor INTO customer_id_var;

            IF done THEN
                LEAVE notification_loop;
            END IF;

            INSERT INTO notifications (customer_id, message, notification_type, is_read, created_at)
            VALUES (customer_id_var, cancellation_message, 'alert', FALSE, NOW());
        END LOOP;

        CLOSE customer_cursor;

        UPDATE event_registrations
        SET refunded_at = NOW(),
            refund_reason = 'Event cancelled'
        WHERE event_id = NEW.event_id
          AND refunded_at IS NULL;
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `feeding_logs`
--

DROP TABLE IF EXISTS `feeding_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `feeding_logs` (
  `log_id` int NOT NULL AUTO_INCREMENT,
  `animal_id` int NOT NULL,
  `keeper_id` int DEFAULT NULL,
  `feeding_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `food_given` varchar(255) NOT NULL,
  `quantity_given` varchar(50) DEFAULT NULL,
  `notes` text,
  PRIMARY KEY (`log_id`),
  KEY `animal_id` (`animal_id`),
  KEY `keeper_id` (`keeper_id`),
  CONSTRAINT `feeding_logs_ibfk_1` FOREIGN KEY (`animal_id`) REFERENCES `animals` (`animal_id`) ON DELETE CASCADE,
  CONSTRAINT `feeding_logs_ibfk_2` FOREIGN KEY (`keeper_id`) REFERENCES `employees` (`employee_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=162 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feeding_logs`
--

LOCK TABLES `feeding_logs` WRITE;
/*!40000 ALTER TABLE `feeding_logs` DISABLE KEYS */;
INSERT INTO `feeding_logs` VALUES (1,1,2,'2025-11-24 13:22:33','Raw beef with bone','15kg','Good appetite'),(2,1,2,'2025-11-23 13:22:33','Raw chicken','15kg','Ate enthusiastically'),(3,1,2,'2025-11-22 13:22:33','Raw beef','15kg','Normal'),(4,1,2,'2025-11-21 13:22:33','Raw beef','15kg','Active'),(5,1,2,'2025-11-20 13:22:33','Raw chicken','15kg','Good'),(6,1,2,'2025-11-19 13:22:33','Raw beef','15kg','Excellent'),(7,2,2,'2025-11-24 13:52:33','Raw chicken','10kg','Healthy appetite'),(8,2,2,'2025-11-23 13:52:33','Raw beef','10kg','Normal'),(9,2,2,'2025-11-22 13:52:33','Raw chicken','10kg','Good'),(10,2,2,'2025-11-21 13:52:33','Raw beef','10kg','Excellent'),(11,2,2,'2025-11-20 13:52:33','Raw chicken','10kg','Normal'),(12,2,2,'2025-11-19 13:52:33','Raw beef','10kg','Good'),(13,3,7,'2025-11-24 11:22:33','Timothy hay','50kg','Good consumption'),(14,3,7,'2025-11-24 16:22:33','Mixed fruits and vegetables','30kg','Apples, carrots'),(15,3,7,'2025-11-23 11:22:33','Timothy hay','50kg','Normal'),(16,3,7,'2025-11-23 16:22:33','Watermelon, carrots','30kg','Engaged'),(17,3,7,'2025-11-22 11:22:33','Timothy hay','50kg','Excellent'),(18,3,7,'2025-11-22 16:22:33','Fruits and vegetables','30kg','Good'),(19,3,7,'2025-11-21 11:22:33','Timothy hay','50kg','Active'),(20,4,7,'2025-11-24 12:22:33','Fruits and leafy greens','8kg','Good appetite'),(21,4,7,'2025-11-24 18:22:33','Vegetables with eggs','5kg','Ate well'),(22,4,7,'2025-11-23 12:22:33','Mixed fruits','8kg','Normal'),(23,4,7,'2025-11-23 18:22:33','Vegetables with protein','5kg','Good'),(24,4,7,'2025-11-22 12:22:33','Fruits and greens','8kg','Excellent'),(25,4,7,'2025-11-21 12:22:33','Mixed fruits','8kg','Active'),(26,5,2,'2025-11-24 14:22:33','Herring with vitamins','2kg','Ate enthusiastically'),(27,5,2,'2025-11-24 21:52:33','Capelin','1.5kg','Normal'),(28,5,2,'2025-11-23 14:22:33','Capelin with vitamins','2kg','Good appetite'),(29,5,2,'2025-11-23 21:52:33','Herring','1.5kg','Normal'),(30,5,2,'2025-11-22 14:22:33','Herring with vitamins','2kg','Excellent'),(31,5,2,'2025-11-22 21:52:33','Capelin','1.5kg','Active'),(32,5,2,'2025-11-21 14:22:33','Mixed fish with vitamins','2kg','Good'),(33,6,7,'2025-11-24 13:22:33','Salmon and trout','20kg','Very active'),(34,6,7,'2025-11-23 13:22:33','Mixed fish','20kg','Good appetite'),(35,6,7,'2025-11-22 13:22:33','Salmon','20kg','Normal'),(36,6,7,'2025-11-21 13:22:33','Mackerel and salmon','20kg','Excellent'),(37,6,7,'2025-11-20 13:22:33','Mixed fish','20kg','Active'),(38,6,7,'2025-11-19 13:22:33','Salmon','20kg','Good'),(39,7,2,'2025-11-24 13:22:33','Herring with vitamin E','6kg','Training session'),(40,7,2,'2025-11-24 17:22:33','Capelin','6kg','Normal'),(41,7,2,'2025-11-24 21:22:33','Herring with training','6kg','Excellent'),(42,7,2,'2025-11-23 13:22:33','Mixed fish with vitamin E','6kg','Good'),(43,7,2,'2025-11-23 17:22:33','Herring','6kg','Active'),(44,7,2,'2025-11-22 13:22:33','Herring with vitamin E','6kg','Good'),(45,7,2,'2025-11-22 17:22:33','Mixed fish','6kg','Normal'),(46,8,7,'2025-11-23 23:22:33','Frozen-thawed adult rat','1 rat','Good strike'),(47,8,7,'2025-11-16 23:22:33','Frozen-thawed adult rat','1 rat','Normal'),(48,8,7,'2025-11-09 23:22:33','Frozen-thawed adult rat','1 rat','Good'),(49,8,7,'2025-11-02 23:22:33','Frozen-thawed adult rat','1 rat','Excellent'),(50,9,9,'2025-11-24 13:22:33','Raw beef','12kg','Good appetite'),(51,9,9,'2025-11-23 13:22:33','Raw chicken','12kg','Normal'),(52,9,9,'2025-11-22 13:22:33','Raw beef','12kg','Ate well'),(53,9,9,'2025-11-21 13:22:33','Raw beef','12kg','Good'),(54,9,9,'2025-11-20 13:22:33','Raw chicken','12kg','Active'),(55,10,9,'2025-11-24 13:52:33','Raw chicken','10kg','Good appetite'),(56,10,9,'2025-11-23 13:52:33','Raw beef','10kg','Normal'),(57,10,9,'2025-11-22 13:52:33','Raw chicken','10kg','Active'),(58,10,9,'2025-11-21 13:52:33','Raw beef','10kg','Good'),(59,10,9,'2025-11-20 13:52:33','Raw chicken','10kg','Excellent'),(60,11,9,'2025-11-24 11:22:33','Hay','60kg','Good consumption'),(61,11,9,'2025-11-24 16:22:33','Fruits and vegetables','35kg','Engaged'),(62,11,9,'2025-11-23 11:22:33','Hay','60kg','Normal'),(63,11,9,'2025-11-23 16:22:33','Mixed fruits','35kg','Good'),(64,11,9,'2025-11-22 11:22:33','Hay','60kg','Excellent'),(65,12,9,'2025-11-24 11:52:33','Hay','55kg','Good'),(66,12,9,'2025-11-23 11:52:33','Hay','55kg','Normal'),(67,12,9,'2025-11-22 11:52:33','Vegetables','35kg','Active'),(68,12,9,'2025-11-21 11:52:33','Hay','55kg','Excellent'),(69,13,10,'2025-11-24 12:22:33','Fruits and leafy greens','10kg','Good appetite'),(70,13,10,'2025-11-24 18:22:33','Vegetables and protein','6kg','Active'),(71,13,10,'2025-11-23 12:22:33','Fruits and leafy greens','10kg','Normal'),(72,13,10,'2025-11-22 12:22:33','Mixed fruits','10kg','Good'),(73,13,10,'2025-11-21 12:22:33','Fruits and greens','10kg','Excellent'),(74,14,10,'2025-11-24 12:22:33','Fruits and leafy greens','9kg','Good'),(75,14,10,'2025-11-23 12:22:33','Mixed fruits','9kg','Normal'),(76,14,10,'2025-11-22 12:22:33','Fruits and greens','9kg','Active'),(77,14,10,'2025-11-21 12:22:33','Leafy greens','9kg','Good'),(78,15,10,'2025-11-24 14:22:33','Herring with vitamins','2.5kg','Active'),(79,15,10,'2025-11-24 21:22:33','Capelin','2kg','Good'),(80,15,10,'2025-11-23 14:22:33','Herring','2.5kg','Normal'),(81,15,10,'2025-11-22 14:22:33','Herring with vitamins','2.5kg','Excellent'),(82,15,10,'2025-11-21 14:22:33','Capelin','2kg','Good'),(83,16,10,'2025-11-24 14:22:33','Fresh fish','2.5kg','Active'),(84,16,10,'2025-11-24 21:22:33','Fish','2kg','Normal'),(85,16,10,'2025-11-23 14:22:33','Fresh fish','2.5kg','Good'),(86,16,10,'2025-11-22 14:22:33','Fish','2.5kg','Excellent'),(87,17,10,'2025-11-24 14:22:33','Fresh fish','2kg','Good appetite'),(88,17,10,'2025-11-23 14:22:33','Fish','2kg','Normal'),(89,17,10,'2025-11-22 14:22:33','Fresh fish','2kg','Active'),(90,17,10,'2025-11-21 14:22:33','Fish','2kg','Good'),(91,18,10,'2025-11-24 14:22:33','Fresh fish','2.5kg','Normal'),(92,18,10,'2025-11-23 14:22:33','Fish','2.5kg','Good'),(93,18,10,'2025-11-22 14:22:33','Fresh fish','2.5kg','Excellent'),(94,19,10,'2025-11-24 14:22:33','Fresh fish','2.5kg','Active'),(95,19,10,'2025-11-23 14:22:33','Fish','2.5kg','Good'),(96,19,10,'2025-11-22 14:22:33','Fresh fish','2.5kg','Normal'),(97,19,10,'2025-11-21 14:22:33','Fish','2.5kg','Excellent'),(98,20,12,'2025-11-24 13:22:33','Salmon and trout','25kg','Very active'),(99,20,12,'2025-11-23 13:22:33','Mixed fish','25kg','Good appetite'),(100,20,12,'2025-11-22 13:22:33','Salmon','25kg','Normal'),(101,20,12,'2025-11-21 13:22:33','Mixed fish','25kg','Excellent'),(102,20,12,'2025-11-20 13:22:33','Salmon','25kg','Active'),(103,21,12,'2025-11-24 13:22:33','Fresh fish','20kg','Training session'),(104,21,12,'2025-11-24 17:22:33','Fish','20kg','Good'),(105,21,12,'2025-11-23 13:22:33','Fresh fish','20kg','Normal'),(106,21,12,'2025-11-22 13:22:33','Fish','20kg','Active'),(107,22,12,'2025-11-24 13:22:33','Fresh fish','18kg','Good'),(108,22,12,'2025-11-23 13:22:33','Fish','18kg','Normal'),(109,22,12,'2025-11-22 13:22:33','Fresh fish','18kg','Excellent'),(110,22,12,'2025-11-21 13:22:33','Fish','18kg','Active'),(111,23,12,'2025-11-20 22:22:33','Frozen-thawed rat','1 rat','Good strike'),(112,23,12,'2025-11-06 22:22:33','Frozen-thawed rat','1 rat','Normal'),(113,24,12,'2025-11-21 22:22:33','Frozen-thawed rabbit','1 rabbit','Good consumption'),(114,24,12,'2025-11-07 22:22:33','Frozen-thawed rabbit','1 rabbit','Excellent'),(115,25,12,'2025-11-19 22:22:33','Frozen-thawed rat','1 rat','Normal'),(116,25,12,'2025-11-12 22:22:33','Frozen-thawed rat','1 rat','Good'),(117,25,12,'2025-11-05 22:22:33','Frozen-thawed rat','1 rat','Active'),(118,26,12,'2025-11-24 22:22:33','Frozen-thawed rabbit','1 rabbit','Good'),(119,26,12,'2025-10-26 22:22:33','Frozen-thawed rabbit','1 rabbit','Excellent'),(120,27,12,'2025-11-15 16:22:33','Whole goat','10kg','Large meal'),(121,27,12,'2025-10-11 16:22:33','Large deer','12kg','Massive feeding'),(122,28,2,'2025-11-24 13:22:33','Fruit and seed mix','100g','Vocal'),(123,28,2,'2025-11-23 13:22:33','Fruit and seed mix','100g','Normal'),(124,28,2,'2025-11-22 13:22:33','Fruit and seed mix','100g','Active'),(125,28,2,'2025-11-21 13:22:33','Fruit and seed mix','100g','Good'),(126,29,9,'2025-11-24 13:22:33','Fruit and seed mix','100g','Good appetite'),(127,29,9,'2025-11-23 13:22:33','Fruit and seed mix','100g','Normal'),(128,29,9,'2025-11-22 13:22:33','Fruit and seed mix','100g','Active'),(129,29,9,'2025-11-21 13:22:33','Fruit and seed mix','100g','Good'),(130,30,9,'2025-11-24 13:22:33','Fruit and seed mix','100g','Hunting'),(131,30,9,'2025-11-23 13:22:33','Fruit and seed mix','100g','Normal'),(132,30,9,'2025-11-22 13:22:33','Fruit and seed mix','100g','Good'),(133,30,9,'2025-11-21 13:22:33','Fruit and seed mix','100g','Excellent'),(134,31,2,'2025-11-24 13:52:33','Chopped fruit and insects','150g','Engaged'),(135,31,2,'2025-11-23 13:52:33','Chopped fruit and insects','150g','Good'),(136,31,2,'2025-11-22 13:52:33','Chopped fruit and insects','150g','Normal'),(137,31,2,'2025-11-21 13:52:33','Chopped fruit and insects','150g','Active'),(138,32,7,'2025-11-25 00:22:33','Thawed mice','2 mice','Quick strike'),(139,32,7,'2025-11-24 00:22:33','Thawed mice','2 mice','Good'),(140,32,7,'2025-11-23 00:22:33','Thawed mice','2 mice','Normal'),(141,32,7,'2025-11-22 00:22:33','Thawed mice','2 mice','Excellent'),(142,33,7,'2025-11-24 13:22:33','Seed mix','150g','Vocal'),(143,33,7,'2025-11-23 13:22:33','Seed mix','150g','Normal'),(144,33,7,'2025-11-22 13:22:33','Seed mix','150g','Active'),(145,33,7,'2025-11-21 13:22:33','Seed mix','150g','Good'),(146,34,7,'2025-11-24 12:22:33','Flamingo pellets','200g','Color maintenance'),(147,34,7,'2025-11-23 12:22:33','Flamingo pellets','200g','Good'),(148,34,7,'2025-11-22 12:22:33','Flamingo pellets','200g','Normal'),(149,34,7,'2025-11-21 12:22:33','Flamingo pellets','200g','Active'),(150,35,7,'2025-11-24 15:22:33','Bone marrow','150g','Aggressive eating'),(151,35,7,'2025-11-23 15:22:33','Bone marrow','150g','Good'),(152,35,7,'2025-11-22 15:22:33','Meat scraps','150g','Normal'),(153,35,7,'2025-11-21 15:22:33','Bone marrow','150g','Excellent'),(154,36,7,'2025-11-24 14:22:33','Whole fish','200g','Swallowed whole'),(155,36,7,'2025-11-23 14:22:33','Whole fish','200g','Good'),(156,36,7,'2025-11-22 14:22:33','Whole fish','200g','Normal'),(157,36,7,'2025-11-21 14:22:33','Whole fish','200g','Active'),(158,37,7,'2025-11-24 14:52:33','Fish and insects','180g','Opportunistic'),(159,37,7,'2025-11-23 14:52:33','Fish and insects','180g','Good'),(160,37,7,'2025-11-22 14:52:33','Fish and insects','180g','Normal'),(161,37,7,'2025-11-21 14:52:33','Fish and insects','180g','Excellent');
/*!40000 ALTER TABLE `feeding_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feeding_schedules`
--

DROP TABLE IF EXISTS `feeding_schedules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `feeding_schedules` (
  `schedule_id` int NOT NULL AUTO_INCREMENT,
  `animal_id` int NOT NULL,
  `food_description` varchar(255) NOT NULL,
  `frequency` varchar(100) DEFAULT NULL,
  `scheduled_time` time DEFAULT NULL,
  `notes` text,
  PRIMARY KEY (`schedule_id`),
  KEY `animal_id` (`animal_id`),
  CONSTRAINT `feeding_schedules_ibfk_1` FOREIGN KEY (`animal_id`) REFERENCES `animals` (`animal_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feeding_schedules`
--

LOCK TABLES `feeding_schedules` WRITE;
/*!40000 ALTER TABLE `feeding_schedules` DISABLE KEYS */;
INSERT INTO `feeding_schedules` VALUES (1,1,'Raw beef 15kg with bone','Daily','09:00:00','Prime cuts, vary between beef and chicken'),(2,1,'Supplemental bones','Daily','17:00:00','Large femur bones for enrichment'),(3,2,'Raw chicken/beef 10kg','Daily','09:30:00','Alternate proteins daily'),(4,2,'Enrichment feeding','3x per week','16:00:00','Hide meat for natural hunting behavior'),(5,3,'Hay 50kg','Daily','07:00:00','Timothy hay primary diet'),(6,3,'Fruits and vegetables 30kg','Daily','12:00:00','Apples, carrots, sweet potatoes'),(7,3,'Browse and branches','Daily','16:00:00','Fresh tree branches'),(8,4,'Fruits and leafy greens 8kg','Daily','08:00:00','Bananas, apples, kale, romaine'),(9,4,'Vegetables and protein 5kg','Daily','14:00:00','Sweet potato, eggs, nuts'),(10,4,'Browse and enrichment','Daily','18:00:00','Bamboo, branches, insects'),(11,5,'Fresh fish 2kg','Twice daily','10:00:00','Herring/capelin with vitamins'),(12,5,'Evening fish feeding','Daily','17:30:00','Monitor consumption'),(13,6,'Fish 20kg','Daily','09:00:00','Salmon, trout, mackerel'),(14,6,'Meat and enrichment','Daily','15:00:00','Seal meat or frozen treats'),(15,7,'Fresh fish 18kg','Three times daily','09:00:00','Herring, capelin with vitamin E'),(16,7,'Mid-day feeding','Daily','13:00:00','Monitor weight'),(17,7,'Evening feeding with training','Daily','17:00:00','Enrichment and training'),(18,8,'Frozen-thawed rat (adult)','Weekly','19:00:00','Feed Fridays, monitor strike'),(19,9,'Raw beef 15kg','Daily','09:00:00','Vary protein sources'),(20,10,'Raw chicken 10kg','Daily','09:30:00','Monitor consumption'),(21,11,'Hay 60kg and Fruits 40kg','Daily','07:00:00','Timothy hay primary'),(22,12,'Hay 55kg and Vegetables 35kg','Daily','07:30:00','Fresh water access'),(23,13,'Fruits and leafy greens 10kg','Daily','08:00:00','Enrichment items'),(24,14,'Fruits and leafy greens 9kg','Daily','08:00:00','Monitor aggression'),(25,15,'Fresh fish 2.5kg','Twice daily','10:00:00','With vitamins'),(26,16,'Fresh fish 2.5kg','Twice daily','10:00:00','With vitamins'),(27,17,'Fresh fish 2kg','Twice daily','10:00:00','Smaller portions'),(28,18,'Fresh fish 2.5kg','Twice daily','10:00:00','With vitamins'),(29,19,'Fresh fish 2.5kg','Twice daily','10:00:00','With vitamins'),(30,20,'Fish 25kg and meat 5kg','Daily','09:00:00','Fatty fish'),(31,21,'Fresh fish 20kg','Three times daily','09:00:00','Training sessions'),(32,22,'Fresh fish 18kg','Three times daily','09:00:00','Weight monitoring'),(33,23,'Frozen-thawed large rat','Every 2 weeks','18:00:00','Full consumption'),(34,24,'Frozen-thawed rabbit','Every 2-3 weeks','18:00:00','Shedding cycle'),(35,25,'Frozen-thawed medium rat','Weekly','18:00:00','Normal feeding'),(36,26,'Frozen-thawed rabbit','Monthly','18:00:00','Large meal'),(37,27,'Whole goat or deer','Every 1-2 months','12:00:00','Multiple keepers'),(38,28,'Fruit and seed mix','Daily','09:00:00','Nuts enrichment'),(39,29,'Fruit and seed mix','Daily','09:00:00','Variety'),(40,30,'Fruit and seed mix','Daily','09:00:00','Monitor variety'),(41,31,'Chopped fruit and insects','Daily','09:30:00','Grapes favorite'),(42,32,'Thawed mice or small rats','Daily','20:00:00','Nocturnal'),(43,33,'Seed mix and vegetables','Daily','09:00:00','Sunflower seeds'),(44,34,'Flamingo pellets and brine shrimp','Twice daily','08:00:00','Color maintenance'),(45,35,'Bone marrow and meat scraps','Daily','11:00:00','Specialized'),(46,36,'Whole fish','Daily','10:00:00','Herring/mackerel'),(47,37,'Fish and insects','Daily','10:30:00','Opportunistic');
/*!40000 ALTER TABLE `feeding_schedules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gift_shop_items`
--

DROP TABLE IF EXISTS `gift_shop_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gift_shop_items` (
  `item_id` int NOT NULL AUTO_INCREMENT,
  `gift_shop_id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text,
  `category` varchar(50) DEFAULT NULL,
  `price` decimal(8,2) NOT NULL,
  `cost` decimal(8,2) DEFAULT NULL,
  `quantity_in_stock` int DEFAULT '0',
  `supplier` varchar(100) DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`item_id`),
  KEY `gift_shop_id` (`gift_shop_id`),
  CONSTRAINT `gift_shop_items_ibfk_1` FOREIGN KEY (`gift_shop_id`) REFERENCES `gift_shops` (`gift_shop_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gift_shop_items`
--

LOCK TABLES `gift_shop_items` WRITE;
/*!40000 ALTER TABLE `gift_shop_items` DISABLE KEYS */;
INSERT INTO `gift_shop_items` VALUES (1,1,'Plush Lion','Soft and cuddly lion plushie','Toys',19.99,8.00,150,'ToyWorld Inc','https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=600&q=80',NULL),(2,1,'Zoo T-Shirt','Cotton t-shirt with zoo logo','Apparel',24.99,10.00,200,'Apparel Plus','https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80',NULL),(3,1,'Animal Stickers','Pack of 20 animal stickers','Souvenirs',4.99,1.50,500,'Sticker Co','https://images.unsplash.com/photo-1604590496881-c5b5b4e877f1?auto=format&fit=crop&w=800&q=80',NULL),(4,1,'Tropical Bird Poster','Beautiful rainforest bird poster','Art',12.99,5.00,75,'Art Prints Ltd','https://images.unsplash.com/photo-1452570053594-1b985d6ea890?auto=format&fit=crop&w=600&q=80',NULL),(5,1,'Plush Penguin','Soft and cuddly penguin plushie','Toys',19.99,8.00,120,'ToyWorld Inc','https://images.unsplash.com/photo-1728321653765-c2901aa9305a?auto=format&fit=crop&w=800&q=80',NULL),(6,1,'Dolphin Keychain','Metal keychain with a dolphin charm','Souvenirs',7.99,2.50,300,'Sticker Co','https://images.unsplash.com/photo-1644065745907-e6bc5bf990c1?auto=format&fit=crop&w=800&q=80',NULL),(7,1,'Zoo Mug','Ceramic mug with zoo animal illustrations','Homeware',14.99,6.00,100,'Apparel Plus','https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=600&q=80',NULL),(8,1,'Savanna Hat','Wide-brimmed hat for sun protection','Apparel',29.99,12.00,80,'Apparel Plus','https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=600&q=80',NULL),(9,1,'Plush Elephant','Adorable elephant stuffed animal','Toys',22.99,9.00,100,'ToyWorld Inc','https://images.unsplash.com/photo-1759004543851-ee3c44f6582c?auto=format&fit=crop&w=800&q=80',NULL),(10,1,'Zoo Backpack','Canvas backpack with animal prints','Apparel',34.99,15.00,60,'Apparel Plus','https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80',NULL);
/*!40000 ALTER TABLE `gift_shop_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gift_shop_sale_items`
--

DROP TABLE IF EXISTS `gift_shop_sale_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gift_shop_sale_items` (
  `sale_item_id` int NOT NULL AUTO_INCREMENT,
  `transaction_id` int NOT NULL,
  `item_id` int NOT NULL,
  `quantity` int NOT NULL,
  `unit_price` decimal(8,2) NOT NULL,
  PRIMARY KEY (`sale_item_id`),
  KEY `transaction_id` (`transaction_id`),
  KEY `item_id` (`item_id`),
  CONSTRAINT `gift_shop_sale_items_ibfk_1` FOREIGN KEY (`transaction_id`) REFERENCES `gift_shop_sales_transactions` (`transaction_id`) ON DELETE CASCADE,
  CONSTRAINT `gift_shop_sale_items_ibfk_2` FOREIGN KEY (`item_id`) REFERENCES `gift_shop_items` (`item_id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gift_shop_sale_items`
--

LOCK TABLES `gift_shop_sale_items` WRITE;
/*!40000 ALTER TABLE `gift_shop_sale_items` DISABLE KEYS */;
INSERT INTO `gift_shop_sale_items` VALUES (1,1,1,1,19.99),(2,1,2,1,24.99),(3,2,4,1,12.99),(4,3,1,1,19.99),(5,3,3,1,4.99),(6,4,2,1,24.99),(7,4,1,1,19.99),(8,4,3,2,4.99),(9,5,5,1,19.99),(10,5,6,1,7.99),(11,6,7,1,14.99),(12,7,8,1,29.99),(13,7,3,1,4.99),(14,8,5,1,19.99),(15,9,7,1,14.99),(16,9,6,1,7.99),(17,10,1,1,19.99),(18,10,2,1,24.99),(19,11,8,1,29.99),(20,11,6,1,7.99),(21,12,4,1,12.99),(22,12,7,1,14.99),(23,12,3,1,4.99),(24,13,1,1,19.99),(25,13,5,1,9.99),(26,14,2,1,24.99),(27,14,4,1,14.99),(28,15,5,2,9.99),(29,16,1,2,19.99),(30,16,6,1,4.99),(31,17,8,1,24.99),(32,18,4,1,12.99),(33,18,3,2,11.00),(34,19,1,1,19.99),(35,19,7,1,7.99),(36,20,2,2,24.99),(37,21,5,1,19.99),(38,21,6,1,4.98),(39,22,8,1,29.99),(40,22,4,1,12.98),(41,23,1,2,19.99),(42,23,2,1,14.99),(43,24,4,1,12.99),(44,24,7,1,14.99),(45,24,6,1,7.99);
/*!40000 ALTER TABLE `gift_shop_sale_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gift_shop_sales_transactions`
--

DROP TABLE IF EXISTS `gift_shop_sales_transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gift_shop_sales_transactions` (
  `transaction_id` int NOT NULL AUTO_INCREMENT,
  `gift_shop_id` int NOT NULL,
  `customer_id` int DEFAULT NULL,
  `employee_id` int DEFAULT NULL,
  `sale_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `total_amount` decimal(10,2) NOT NULL,
  `payment_method` enum('cash','credit','debit') DEFAULT NULL,
  `status` enum('completed','returned') DEFAULT 'completed',
  PRIMARY KEY (`transaction_id`),
  KEY `gift_shop_id` (`gift_shop_id`),
  KEY `customer_id` (`customer_id`),
  KEY `employee_id` (`employee_id`),
  CONSTRAINT `gift_shop_sales_transactions_ibfk_1` FOREIGN KEY (`gift_shop_id`) REFERENCES `gift_shops` (`gift_shop_id`),
  CONSTRAINT `gift_shop_sales_transactions_ibfk_2` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`) ON DELETE SET NULL,
  CONSTRAINT `gift_shop_sales_transactions_ibfk_3` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gift_shop_sales_transactions`
--

LOCK TABLES `gift_shop_sales_transactions` WRITE;
/*!40000 ALTER TABLE `gift_shop_sales_transactions` DISABLE KEYS */;
INSERT INTO `gift_shop_sales_transactions` VALUES (1,1,1,5,'2025-01-15 15:30:00',44.98,'credit','completed'),(2,1,2,5,'2025-03-12 16:00:00',12.99,'credit','completed'),(3,1,NULL,5,'2025-07-04 14:00:00',24.97,'cash','completed'),(4,1,3,5,'2025-10-26 16:30:00',54.97,'debit','completed'),(5,1,2,5,'2025-04-15 14:00:00',27.98,'credit','completed'),(6,1,NULL,5,'2025-05-02 15:00:00',14.99,'debit','completed'),(7,1,1,5,'2025-06-20 12:30:00',34.98,'debit','completed'),(8,1,NULL,5,'2025-07-11 11:00:00',19.99,'cash','completed'),(9,1,3,5,'2025-08-20 16:00:00',22.98,'credit','completed'),(10,1,NULL,5,'2025-09-07 13:00:00',49.98,'credit','completed'),(11,1,1,5,'2025-11-09 15:30:00',37.98,'debit','completed'),(12,1,NULL,5,'2025-11-11 14:30:00',32.97,'credit','completed'),(13,1,2,5,'2025-02-14 14:00:00',29.98,'debit','completed'),(14,1,1,5,'2025-02-28 15:30:00',39.98,'credit','completed'),(15,1,3,5,'2025-03-30 13:15:00',19.99,'cash','completed'),(16,1,NULL,5,'2025-04-25 16:45:00',44.97,'debit','completed'),(17,1,2,5,'2025-05-18 14:20:00',24.98,'credit','completed'),(18,1,NULL,5,'2025-06-10 11:30:00',34.98,'cash','completed'),(19,1,3,5,'2025-07-15 15:00:00',27.98,'debit','completed'),(20,1,1,5,'2025-08-10 13:45:00',49.98,'credit','completed'),(21,1,NULL,5,'2025-09-20 16:00:00',24.97,'cash','completed'),(22,1,2,5,'2025-10-10 14:15:00',42.97,'debit','completed'),(23,1,3,5,'2025-10-30 15:30:00',37.98,'credit','completed'),(24,1,NULL,5,'2025-11-01 12:00:00',54.97,'debit','completed'),(25,1,1,5,'2025-11-14 14:45:00',29.98,'cash','completed');
/*!40000 ALTER TABLE `gift_shop_sales_transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gift_shops`
--

DROP TABLE IF EXISTS `gift_shops`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gift_shops` (
  `gift_shop_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `location` varchar(100) DEFAULT NULL,
  `opening_time` time DEFAULT NULL,
  `closing_time` time DEFAULT NULL,
  `manager_id` int DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`gift_shop_id`),
  KEY `manager_id` (`manager_id`),
  KEY `idx_gift_shops_deleted` (`deleted_at`),
  CONSTRAINT `gift_shops_ibfk_1` FOREIGN KEY (`manager_id`) REFERENCES `employees` (`employee_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gift_shops`
--

LOCK TABLES `gift_shops` WRITE;
/*!40000 ALTER TABLE `gift_shops` DISABLE KEYS */;
INSERT INTO `gift_shops` VALUES (1,'Zoo Gift Shop','Main Entrance','09:00:00','18:00:00',1,NULL);
/*!40000 ALTER TABLE `gift_shops` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `habitats`
--

DROP TABLE IF EXISTS `habitats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `habitats` (
  `habitat_id` int NOT NULL AUTO_INCREMENT,
  `habitat_name` varchar(100) NOT NULL,
  `attraction_id` int DEFAULT NULL,
  `size` varchar(50) DEFAULT NULL,
  `environment_type` varchar(50) DEFAULT NULL,
  `animal_capacity` int DEFAULT '10',
  `cleaning_schedule` varchar(100) DEFAULT NULL,
  `last_maintenance` date DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `status` enum('active','maintenance','renovation','closed') DEFAULT 'active',
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`habitat_id`),
  KEY `attraction_id` (`attraction_id`),
  KEY `idx_habitats_deleted` (`deleted_at`),
  CONSTRAINT `habitats_ibfk_1` FOREIGN KEY (`attraction_id`) REFERENCES `attractions` (`attraction_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `habitats`
--

LOCK TABLES `habitats` WRITE;
/*!40000 ALTER TABLE `habitats` DISABLE KEYS */;
INSERT INTO `habitats` VALUES (1,'Lion Pride Rock',1,'Large','Grassland',8,NULL,'2025-10-11','https://images.unsplash.com/photo-1583587067350-2c49115673c9?auto=format&fit=crop&w=600&q=80','active','2025-11-25 04:22:32',NULL),(2,'Elephant Plains',1,'Extra Large','Savanna',12,NULL,'2025-07-28','https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=800&q=80','active','2025-11-25 04:22:32',NULL),(3,'Gorilla Forest',2,'Large','Tropical Forest',6,NULL,'2025-11-02','https://images.unsplash.com/photo-1614528767034-70de9fe166e0?auto=format&fit=crop&w=800&q=80','active','2025-11-25 04:22:32',NULL),(4,'Penguin Cove',3,'Medium','Arctic',25,NULL,'2025-08-28','https://images.unsplash.com/photo-1598439210625-5067c578f3f6?auto=format&fit=crop&w=800&q=80','active','2025-11-25 04:22:32',NULL),(5,'Polar Bear Den',3,'Large','Arctic',4,NULL,'2025-06-22','https://images.unsplash.com/photo-1589656966895-2f33e7653819?auto=format&fit=crop&w=800&q=80','active','2025-11-25 04:22:32',NULL),(6,'Dolphin Pool',4,'Extra Large','Aquatic',8,NULL,'2025-09-19','https://images.unsplash.com/photo-1763920848955-4b3873ec85cf?auto=format&fit=crop&w=800&q=80','active','2025-11-25 04:22:32',NULL),(7,'Snake Sanctuary',5,'Medium','Desert',15,NULL,'2025-04-05','https://images.unsplash.com/photo-1686110448055-5446817f6ac9?auto=format&fit=crop&w=800&q=80','active','2025-11-25 04:22:32',NULL),(8,'Aviary',2,'Large','Tropical Forest',50,NULL,'2025-08-15','https://images.unsplash.com/photo-1452570053594-1b985d6ea890?auto=format&fit=crop&w=800&q=80','active','2025-11-25 04:22:32',NULL);
/*!40000 ALTER TABLE `habitats` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `membership_purchases`
--

DROP TABLE IF EXISTS `membership_purchases`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `membership_purchases` (
  `purchase_id` int NOT NULL AUTO_INCREMENT,
  `customer_id` int NOT NULL,
  `purchase_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `price` decimal(8,2) NOT NULL,
  `payment_method` enum('cash','credit','debit') DEFAULT NULL,
  `auto_renewed` tinyint(1) DEFAULT '0',
  `payment_method_id` int DEFAULT NULL,
  PRIMARY KEY (`purchase_id`),
  KEY `idx_customer_purchases` (`customer_id`,`purchase_date`),
  KEY `payment_method_id` (`payment_method_id`),
  CONSTRAINT `membership_purchases_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`) ON DELETE CASCADE,
  CONSTRAINT `membership_purchases_ibfk_2` FOREIGN KEY (`payment_method_id`) REFERENCES `customer_payment_methods` (`payment_method_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `membership_purchases`
--

LOCK TABLES `membership_purchases` WRITE;
/*!40000 ALTER TABLE `membership_purchases` DISABLE KEYS */;
INSERT INTO `membership_purchases` VALUES (1,2,'2023-11-15 10:00:00','2023-11-15','2024-11-15',149.00,'credit',0,1),(2,2,'2024-11-15 09:30:00','2024-11-15','2025-11-15',149.00,'credit',1,1),(3,4,'2024-05-15 14:20:00','2024-06-01','2025-06-01',149.00,'credit',0,2),(4,5,'2024-02-15 11:45:00','2024-03-15','2025-03-15',149.00,'credit',0,3),(5,5,'2024-03-10 10:00:00','2024-03-15','2025-03-15',149.00,'credit',1,3);
/*!40000 ALTER TABLE `membership_purchases` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `notification_id` int NOT NULL AUTO_INCREMENT,
  `customer_id` int DEFAULT NULL,
  `employee_id` int DEFAULT NULL,
  `message` varchar(500) NOT NULL,
  `notification_type` enum('info','warning','alert') DEFAULT 'info',
  `is_read` tinyint(1) DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`notification_id`),
  KEY `idx_customer_unread` (`customer_id`,`is_read`),
  KEY `idx_created_at` (`created_at`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (1,2,NULL,'Your membership expires on December 15, 2025. Renew now to continue enjoying member benefits!','warning',0,'2025-11-25 04:22:32');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `passwords`
--

DROP TABLE IF EXISTS `passwords`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `passwords` (
  `password_id` int NOT NULL AUTO_INCREMENT,
  `account_id` int NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`password_id`),
  UNIQUE KEY `account_id` (`account_id`),
  CONSTRAINT `passwords_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `user_accounts` (`account_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `passwords`
--

LOCK TABLES `passwords` WRITE;
/*!40000 ALTER TABLE `passwords` DISABLE KEYS */;
INSERT INTO `passwords` VALUES (1,1,'password','2025-11-25 04:22:32','2025-11-25 04:22:32'),(2,2,'password','2025-11-25 04:22:32','2025-11-25 04:22:32'),(3,3,'password','2025-11-25 04:22:32','2025-11-25 04:22:32'),(4,4,'password','2025-11-25 04:22:32','2025-11-25 04:22:32'),(5,5,'password','2025-11-25 04:22:32','2025-11-25 04:22:32'),(6,6,'password','2025-11-25 04:22:32','2025-11-25 04:22:32'),(7,7,'password','2025-11-25 04:22:32','2025-11-25 04:22:32'),(8,8,'password','2025-11-25 04:22:32','2025-11-25 04:22:32'),(9,9,'password','2025-11-25 04:22:32','2025-11-25 04:22:32'),(10,10,'password','2025-11-25 04:22:32','2025-11-25 04:22:32'),(11,11,'password','2025-11-25 04:22:32','2025-11-25 04:22:32'),(12,12,'password','2025-11-25 04:22:32','2025-11-25 04:22:32'),(13,13,'password','2025-11-25 04:22:32','2025-11-25 04:22:32'),(14,14,'password','2025-11-25 04:22:32','2025-11-25 04:22:32'),(15,15,'password','2025-11-25 04:22:32','2025-11-25 04:22:32'),(16,16,'password','2025-11-25 04:22:32','2025-11-25 04:22:32'),(17,17,'password','2025-11-25 04:22:32','2025-11-25 04:22:32'),(18,18,'password','2025-11-25 04:22:32','2025-11-25 04:22:32');
/*!40000 ALTER TABLE `passwords` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tickets`
--

DROP TABLE IF EXISTS `tickets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tickets` (
  `ticket_id` int NOT NULL AUTO_INCREMENT,
  `customer_id` int DEFAULT NULL,
  `purchase_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `visit_date` date DEFAULT NULL,
  `ticket_type` enum('adult','child','senior','student') NOT NULL,
  `price` decimal(8,2) NOT NULL,
  `payment_method` enum('cash','credit','debit') DEFAULT NULL,
  `sold_by` int DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`ticket_id`),
  KEY `customer_id` (`customer_id`),
  KEY `sold_by` (`sold_by`),
  KEY `idx_ticket_date` (`visit_date`),
  KEY `idx_tickets_deleted` (`deleted_at`),
  CONSTRAINT `tickets_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`) ON DELETE SET NULL,
  CONSTRAINT `tickets_ibfk_2` FOREIGN KEY (`sold_by`) REFERENCES `employees` (`employee_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=83 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tickets`
--

LOCK TABLES `tickets` WRITE;
/*!40000 ALTER TABLE `tickets` DISABLE KEYS */;
INSERT INTO `tickets` VALUES (1,1,'2025-01-15 10:00:00','2025-01-15','adult',45.00,'credit',NULL,NULL),(2,1,'2025-01-15 10:00:00','2025-01-15','child',30.00,'credit',NULL,NULL),(3,2,'2025-01-18 14:30:00','2025-01-20','adult',45.00,'credit',NULL,NULL),(4,3,'2025-01-25 11:00:00','2025-01-25','senior',35.00,'cash',NULL,NULL),(5,NULL,'2025-02-05 09:15:00','2025-02-05','adult',45.00,'cash',NULL,NULL),(6,NULL,'2025-02-05 09:15:00','2025-02-05','adult',45.00,'cash',NULL,NULL),(7,1,'2025-02-12 11:00:00','2025-02-14','adult',45.00,'credit',NULL,NULL),(8,1,'2025-02-12 11:00:00','2025-02-14','adult',45.00,'credit',NULL,NULL),(9,3,'2025-02-20 10:00:00','2025-02-20','senior',35.00,'debit',NULL,NULL),(10,NULL,'2025-03-05 14:00:00','2025-03-05','child',30.00,'cash',NULL,NULL),(11,1,'2025-03-10 09:30:00','2025-03-10','adult',45.00,'debit',NULL,NULL),(12,2,'2025-03-12 12:00:00','2025-03-12','adult',45.00,'credit',NULL,NULL),(13,2,'2025-03-12 12:00:00','2025-03-12','child',30.00,'credit',NULL,NULL),(14,3,'2025-03-15 18:00:00','2025-03-18','student',38.00,'credit',NULL,NULL),(15,NULL,'2025-04-01 13:45:00','2025-04-01','child',30.00,'cash',NULL,NULL),(16,NULL,'2025-04-01 13:45:00','2025-04-01','child',30.00,'cash',NULL,NULL),(17,NULL,'2025-04-01 13:45:00','2025-04-01','adult',45.00,'cash',NULL,NULL),(18,2,'2025-04-15 11:30:00','2025-04-15','adult',45.00,'credit',NULL,NULL),(19,2,'2025-04-15 11:30:00','2025-04-15','child',30.00,'credit',NULL,NULL),(20,NULL,'2025-05-02 12:15:00','2025-05-02','student',38.00,'debit',NULL,NULL),(21,NULL,'2025-05-08 16:00:00','2025-05-10','adult',45.00,'credit',NULL,NULL),(22,3,'2025-05-25 09:45:00','2025-05-25','senior',35.00,'cash',NULL,NULL),(23,NULL,'2025-06-05 10:30:00','2025-06-05','adult',45.00,'credit',NULL,NULL),(24,NULL,'2025-06-05 10:30:00','2025-06-05','adult',45.00,'credit',NULL,NULL),(25,NULL,'2025-06-12 14:00:00','2025-06-12','child',30.00,'cash',NULL,NULL),(26,1,'2025-06-20 11:00:00','2025-06-20','adult',45.00,'debit',NULL,NULL),(27,NULL,'2025-06-25 20:00:00','2025-06-28','student',38.00,'credit',NULL,NULL),(28,NULL,'2025-07-01 09:00:00','2025-07-01','adult',45.00,'cash',NULL,NULL),(29,NULL,'2025-07-02 09:05:00','2025-07-02','adult',45.00,'cash',NULL,NULL),(30,NULL,'2025-07-03 09:10:00','2025-07-03','adult',45.00,'credit',NULL,NULL),(31,NULL,'2025-07-03 09:10:00','2025-07-03','adult',45.00,'credit',NULL,NULL),(32,NULL,'2025-07-03 09:10:00','2025-07-03','child',30.00,'credit',NULL,NULL),(33,NULL,'2025-07-03 09:10:00','2025-07-03','child',30.00,'credit',NULL,NULL),(34,NULL,'2025-07-01 10:00:00','2025-07-04','adult',45.00,'credit',NULL,NULL),(35,NULL,'2025-07-01 10:00:00','2025-07-04','adult',45.00,'credit',NULL,NULL),(36,NULL,'2025-07-01 10:00:00','2025-07-04','child',30.00,'credit',NULL,NULL),(37,NULL,'2025-07-05 09:15:00','2025-07-05','adult',45.00,'debit',NULL,NULL),(38,2,'2025-07-06 13:00:00','2025-07-08','adult',45.00,'credit',NULL,NULL),(39,NULL,'2025-07-10 09:00:00','2025-07-10','adult',45.00,'credit',NULL,NULL),(40,NULL,'2025-07-11 09:20:00','2025-07-11','child',30.00,'cash',NULL,NULL),(41,NULL,'2025-07-12 09:25:00','2025-07-12','child',30.00,'cash',NULL,NULL),(42,3,'2025-07-15 10:30:00','2025-07-15','senior',35.00,'cash',NULL,NULL),(43,3,'2025-07-15 10:30:00','2025-07-15','child',30.00,'cash',NULL,NULL),(44,3,'2025-07-18 09:30:00','2025-07-18','senior',35.00,'credit',NULL,NULL),(45,NULL,'2025-07-22 09:35:00','2025-07-22','student',38.00,'debit',NULL,NULL),(46,NULL,'2025-07-25 09:40:00','2025-07-25','adult',45.00,'cash',NULL,NULL),(47,1,'2025-07-30 17:00:00','2025-08-01','adult',45.00,'credit',NULL,NULL),(48,NULL,'2025-08-05 10:15:00','2025-08-05','adult',45.00,'credit',NULL,NULL),(49,NULL,'2025-08-05 10:15:00','2025-08-05','adult',45.00,'credit',NULL,NULL),(50,NULL,'2025-08-05 10:15:00','2025-08-05','child',30.00,'credit',NULL,NULL),(51,NULL,'2025-08-05 10:15:00','2025-08-05','child',30.00,'credit',NULL,NULL),(52,NULL,'2025-08-10 10:20:00','2025-08-10','adult',45.00,'debit',NULL,NULL),(53,NULL,'2025-08-15 10:25:00','2025-08-15','child',30.00,'cash',NULL,NULL),(54,2,'2025-08-20 10:30:00','2025-08-20','adult',45.00,'credit',NULL,NULL),(55,NULL,'2025-08-25 10:35:00','2025-08-25','student',38.00,'debit',NULL,NULL),(56,3,'2025-09-01 11:00:00','2025-09-01','senior',35.00,'cash',NULL,NULL),(57,NULL,'2025-09-07 11:05:00','2025-09-07','adult',45.00,'credit',NULL,NULL),(58,NULL,'2025-09-14 11:10:00','2025-09-14','child',30.00,'debit',NULL,NULL),(59,1,'2025-09-19 19:00:00','2025-09-21','adult',45.00,'credit',NULL,NULL),(60,NULL,'2025-09-28 11:15:00','2025-09-28','adult',45.00,'credit',NULL,NULL),(61,NULL,'2025-09-28 11:15:00','2025-09-28','adult',45.00,'credit',NULL,NULL),(62,NULL,'2025-09-28 11:15:00','2025-09-28','child',30.00,'credit',NULL,NULL),(63,NULL,'2025-09-28 11:15:00','2025-09-28','child',30.00,'credit',NULL,NULL),(64,NULL,'2025-10-05 12:00:00','2025-10-05','adult',45.00,'cash',NULL,NULL),(65,2,'2025-10-12 12:05:00','2025-10-12','adult',45.00,'debit',NULL,NULL),(66,NULL,'2025-10-19 12:10:00','2025-10-19','student',38.00,'credit',NULL,NULL),(67,3,'2025-10-26 12:15:00','2025-10-26','senior',35.00,'cash',NULL,NULL),(68,1,'2025-10-26 11:00:00','2025-10-26','adult',45.00,'credit',NULL,NULL),(69,2,'2025-10-31 13:00:00','2025-10-31','student',38.00,'debit',NULL,NULL),(70,NULL,'2025-11-02 13:00:00','2025-11-02','adult',45.00,'debit',NULL,NULL),(71,1,'2025-11-07 21:00:00','2025-11-09','adult',45.00,'credit',NULL,NULL),(72,NULL,'2025-11-10 13:05:00','2025-11-10','child',30.00,'cash',NULL,NULL),(73,NULL,'2025-11-11 13:10:00','2025-11-11','adult',45.00,'credit',NULL,NULL),(74,NULL,'2025-11-11 13:10:00','2025-11-11','adult',45.00,'credit',NULL,NULL),(75,NULL,'2025-11-11 13:10:00','2025-11-11','child',30.00,'credit',NULL,NULL),(76,NULL,'2025-11-11 13:10:00','2025-11-11','child',30.00,'credit',NULL,NULL),(77,NULL,'2025-11-12 13:15:00','2025-11-12','adult',45.00,'debit',NULL,NULL),(78,NULL,'2025-11-01 10:00:00','2025-11-01','adult',45.00,'cash',NULL,NULL),(79,NULL,'2025-11-03 11:00:00','2025-11-03','adult',45.00,'credit',NULL,NULL),(80,1,'2025-11-13 15:00:00','2025-11-14','adult',45.00,'credit',NULL,NULL),(81,NULL,'2025-11-05 12:00:00','2025-11-05','child',30.00,'debit',NULL,NULL),(82,NULL,'2025-11-06 09:30:00','2025-11-06','student',38.00,'cash',NULL,NULL);
/*!40000 ALTER TABLE `tickets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_accounts`
--

DROP TABLE IF EXISTS `user_accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_accounts` (
  `account_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(80) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `role` enum('employee','customer') NOT NULL,
  `employee_id` int DEFAULT NULL,
  `customer_id` int DEFAULT NULL,
  `last_login_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`account_id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `employee_id` (`employee_id`),
  UNIQUE KEY `customer_id` (`customer_id`),
  CONSTRAINT `user_accounts_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`employee_id`) ON DELETE CASCADE,
  CONSTRAINT `user_accounts_ibfk_2` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`) ON DELETE CASCADE,
  CONSTRAINT `chk_user_owner` CHECK ((((`employee_id` is not null) and (`customer_id` is null)) or ((`employee_id` is null) and (`customer_id` is not null))))
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_accounts`
--

LOCK TABLES `user_accounts` WRITE;
/*!40000 ALTER TABLE `user_accounts` DISABLE KEYS */;
INSERT INTO `user_accounts` VALUES (1,'sarah.johnson','sarah.johnson@zoo.com','employee',1,NULL,NULL,'2025-11-25 04:22:32','2025-11-25 04:22:32'),(2,'mike.chen','mike.chen@zoo.com','employee',2,NULL,NULL,'2025-11-25 04:22:32','2025-11-25 04:22:32'),(3,'emily.rodriguez','emily.rodriguez@zoo.com','employee',3,NULL,NULL,'2025-11-25 04:22:32','2025-11-25 04:22:32'),(4,'david.kim','david.kim@zoo.com','employee',4,NULL,NULL,'2025-11-25 04:22:32','2025-11-25 04:22:32'),(5,'lisa.thompson','lisa.thompson@zoo.com','employee',5,NULL,NULL,'2025-11-25 04:22:32','2025-11-25 04:22:32'),(6,'james.wilson','james.wilson@zoo.com','employee',6,NULL,NULL,'2025-11-25 04:22:32','2025-11-25 04:22:32'),(7,'anna.martinez','anna.martinez@zoo.com','employee',7,NULL,NULL,'2025-11-25 04:22:32','2025-11-25 04:22:32'),(8,'tom.brown','tom.brown@zoo.com','employee',8,NULL,NULL,'2025-11-25 04:22:32','2025-11-25 04:22:32'),(9,'john.smith','john.smith@email.com','customer',NULL,1,NULL,'2025-11-25 04:22:32','2025-11-25 04:22:32'),(10,'maria.garcia','maria.garcia@email.com','customer',NULL,2,NULL,'2025-11-25 04:22:32','2025-11-25 04:22:32'),(11,'robert.davis','robert.davis@email.com','customer',NULL,3,NULL,'2025-11-25 04:22:32','2025-11-25 04:22:32'),(12,'chris.green','chris.green@zoo.com','employee',9,NULL,NULL,'2025-11-25 04:22:32','2025-11-25 04:22:32'),(13,'jessica.blue','jessica.blue@zoo.com','employee',10,NULL,NULL,'2025-11-25 04:22:32','2025-11-25 04:22:32'),(14,'mark.white','mark.white@zoo.com','employee',11,NULL,NULL,'2025-11-25 04:22:32','2025-11-25 04:22:32'),(15,'laura.black','laura.black@zoo.com','employee',12,NULL,NULL,'2025-11-25 04:22:32','2025-11-25 04:22:32'),(16,'sarah.wilson','sarah.wilson@email.com','customer',NULL,4,NULL,'2025-11-25 04:22:32','2025-11-25 04:22:32'),(17,'michael.johnson','michael.johnson@email.com','customer',NULL,5,NULL,'2025-11-25 04:22:32','2025-11-25 04:22:32'),(18,'sky.jones','skyjones.vet@gmail.com','employee',13,NULL,NULL,'2025-11-25 04:22:32','2025-11-25 04:22:32');
/*!40000 ALTER TABLE `user_accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `zookeeper_assignments`
--

DROP TABLE IF EXISTS `zookeeper_assignments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `zookeeper_assignments` (
  `assignment_id` int NOT NULL AUTO_INCREMENT,
  `keeper_id` int NOT NULL,
  `animal_id` int NOT NULL,
  `shift` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`assignment_id`),
  UNIQUE KEY `keeper_id` (`keeper_id`,`animal_id`),
  KEY `animal_id` (`animal_id`),
  CONSTRAINT `zookeeper_assignments_ibfk_1` FOREIGN KEY (`keeper_id`) REFERENCES `employees` (`employee_id`) ON DELETE CASCADE,
  CONSTRAINT `zookeeper_assignments_ibfk_2` FOREIGN KEY (`animal_id`) REFERENCES `animals` (`animal_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `zookeeper_assignments`
--

LOCK TABLES `zookeeper_assignments` WRITE;
/*!40000 ALTER TABLE `zookeeper_assignments` DISABLE KEYS */;
INSERT INTO `zookeeper_assignments` VALUES (1,2,1,'Morning'),(2,2,2,'Morning'),(3,2,5,'Morning'),(4,2,7,'Afternoon'),(5,7,3,'Morning'),(6,7,4,'Morning'),(7,7,6,'Afternoon'),(8,7,8,'Weekly'),(9,9,9,'Morning'),(10,9,10,'Morning'),(11,9,11,'Afternoon'),(12,9,12,'Afternoon'),(13,9,29,'Morning'),(14,9,30,'Morning'),(15,10,13,'Morning'),(16,10,14,'Morning'),(17,10,15,'Afternoon'),(18,10,16,'Afternoon'),(19,10,17,'Afternoon'),(20,10,18,'Afternoon'),(21,10,19,'Afternoon'),(22,12,20,'Morning'),(23,12,21,'Afternoon'),(24,12,22,'Afternoon'),(25,12,23,'Weekly'),(26,12,24,'Weekly'),(27,12,25,'Weekly'),(28,12,26,'Weekly'),(29,12,27,'Weekly'),(30,2,28,'Morning'),(31,2,31,'Morning'),(32,7,32,'Morning'),(33,7,33,'Afternoon'),(34,7,34,'Afternoon'),(35,7,35,'Afternoon'),(36,7,36,'Afternoon'),(37,7,37,'Afternoon');
/*!40000 ALTER TABLE `zookeeper_assignments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'zoo_database'
--
/*!50003 DROP PROCEDURE IF EXISTS `auto_renew_memberships` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `auto_renew_memberships`()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE v_customer_id INT;
    DECLARE v_payment_method_id INT;
    DECLARE v_old_end_date DATE;
    DECLARE v_new_end_date DATE;
    DECLARE v_membership_price DECIMAL(8, 2) DEFAULT 149.00;

    DECLARE cur_memberships CURSOR FOR
        SELECT
            c.customer_id,
            c.membership_end_date,
            pm.payment_method_id
        FROM customers c
        INNER JOIN customer_payment_methods pm ON c.customer_id = pm.customer_id
        WHERE c.annual_pass = 'yes'
        AND c.membership_auto_renew = TRUE
        AND c.membership_end_date = CURDATE()
        AND c.membership_end_date IS NOT NULL;

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    OPEN cur_memberships;

    read_loop: LOOP
        FETCH cur_memberships INTO v_customer_id, v_old_end_date, v_payment_method_id;

        IF done THEN
            LEAVE read_loop;
        END IF;

        SET v_new_end_date = DATE_ADD(v_old_end_date, INTERVAL 1 YEAR);

        UPDATE customers
        SET
            membership_start_date = v_old_end_date,
            membership_end_date = v_new_end_date,
            annual_pass = 'yes'
        WHERE customer_id = v_customer_id;

        INSERT INTO membership_purchases
        (customer_id, purchase_date, start_date, end_date, price, payment_method, auto_renewed, payment_method_id)
        VALUES
        (v_customer_id, NOW(), v_old_end_date, v_new_end_date, v_membership_price, 'credit', TRUE, v_payment_method_id);

    END LOOP;

    CLOSE cur_memberships;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-24 22:25:16
