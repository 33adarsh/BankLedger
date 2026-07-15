-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: bank_ledger
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `accounts`
--

DROP TABLE IF EXISTS `accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `accounts` (
  `id` char(36) NOT NULL,
  `user_id` char(36) DEFAULT NULL,
  `status` enum('ACTIVE','BLOCKED','CLOSED') DEFAULT 'ACTIVE',
  `currency` varchar(10) DEFAULT 'INR',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_accounts_user_id` (`user_id`),
  CONSTRAINT `accounts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accounts`
--

LOCK TABLES `accounts` WRITE;
/*!40000 ALTER TABLE `accounts` DISABLE KEYS */;
INSERT INTO `accounts` VALUES ('254ce4d2-899d-4540-ba1d-5e587f8a6edd','c7e8b6b5-fabf-45dd-a86d-dd4500f1f687','ACTIVE','INR','2026-07-14 14:20:20','2026-07-14 14:20:20'),('3aaece8a-dcf7-4d3f-8168-53f0bf9897e4','7a3830c3-d27c-4aef-bca6-c4d1073900fc','ACTIVE','INR','2026-07-14 17:15:52','2026-07-14 17:15:52'),('4ce3e98b-3f84-4e5f-bf65-e6f9fb429582','39c564f0-728e-4031-94f4-37c3f897a8e4','ACTIVE','INR','2026-07-14 14:15:05','2026-07-14 14:15:05'),('5b7a247e-2f14-4b9c-9a99-720cd87f2cd8','ae1d15f9-22fa-48ce-9d1c-f888f89fe3a7','ACTIVE','INR','2026-07-14 14:16:06','2026-07-14 14:16:06'),('81bcd997-2f97-4fa7-aa82-38870b48b19e','dd4a5b40-3417-463d-b7eb-609cbb2a7b34','ACTIVE','INR','2026-07-14 14:06:42','2026-07-14 14:06:42'),('f252e023-7f56-4b52-9782-9cc5a5928585','2a3483c2-dbd3-4a0a-af31-c11029085f5c','ACTIVE','INR','2026-07-14 14:16:02','2026-07-14 14:16:02');
/*!40000 ALTER TABLE `accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ledgers`
--

DROP TABLE IF EXISTS `ledgers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ledgers` (
  `id` char(36) NOT NULL,
  `account_id` char(36) DEFAULT NULL,
  `transaction_id` char(36) DEFAULT NULL,
  `amount` decimal(18,2) DEFAULT NULL,
  `type` enum('CREDIT','DEBIT') DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `transaction_id` (`transaction_id`),
  KEY `idx_ledgers_account_id` (`account_id`),
  CONSTRAINT `ledgers_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `ledgers_ibfk_2` FOREIGN KEY (`transaction_id`) REFERENCES `transactions` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ledgers`
--

LOCK TABLES `ledgers` WRITE;
/*!40000 ALTER TABLE `ledgers` DISABLE KEYS */;
INSERT INTO `ledgers` VALUES ('43f69cf1-a2ab-451c-81bc-9e35dbeb08db','f252e023-7f56-4b52-9782-9cc5a5928585','bfaecd37-2cf8-4594-90a3-0758e2947c29',500.00,'DEBIT','2026-07-14 14:16:06'),('4aff3649-fb7b-4f5a-bb6b-be83bbce8bea','5b7a247e-2f14-4b9c-9a99-720cd87f2cd8','99a87e74-dbe7-4a02-9737-47679ed4cffb',1000.00,'CREDIT','2026-07-14 14:16:21'),('4e051782-14b7-4121-bce9-9105ef23036b','f252e023-7f56-4b52-9782-9cc5a5928585','94b07d24-853d-45cc-b530-84759f270f51',500.00,'DEBIT','2026-07-14 14:20:43'),('a35a008b-1ee3-4bbf-97c4-117b76d02c56','5b7a247e-2f14-4b9c-9a99-720cd87f2cd8','bfaecd37-2cf8-4594-90a3-0758e2947c29',500.00,'CREDIT','2026-07-14 14:16:06'),('c630e5d7-cd03-4fed-a602-df7d472d2f11','f252e023-7f56-4b52-9782-9cc5a5928585','99a87e74-dbe7-4a02-9737-47679ed4cffb',1000.00,'DEBIT','2026-07-14 14:16:06'),('e64b3f24-9d38-4eb9-aa7c-90cadce8c278','254ce4d2-899d-4540-ba1d-5e587f8a6edd','94b07d24-853d-45cc-b530-84759f270f51',500.00,'CREDIT','2026-07-14 14:20:43');
/*!40000 ALTER TABLE `ledgers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `token_blacklist`
--

DROP TABLE IF EXISTS `token_blacklist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `token_blacklist` (
  `token` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  KEY `idx_token_blacklist_token` (`token`(255))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `token_blacklist`
--

LOCK TABLES `token_blacklist` WRITE;
/*!40000 ALTER TABLE `token_blacklist` DISABLE KEYS */;
INSERT INTO `token_blacklist` VALUES ('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJkZDRhNWI0MC0zNDE3LTQ2M2QtYjdlYi02MDljYmIyYTdiMzQiLCJpYXQiOjE3ODQwMzc5ODQsImV4cCI6MTc4NDI5NzE4NH0.EcXWTf0DJ82qLDGW3us2mG1d70rh8suRWIA-3bXlyPo','2026-07-14 14:07:25');
/*!40000 ALTER TABLE `token_blacklist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transactions`
--

DROP TABLE IF EXISTS `transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transactions` (
  `id` char(36) NOT NULL,
  `from_account` char(36) DEFAULT NULL,
  `to_account` char(36) DEFAULT NULL,
  `amount` decimal(18,2) DEFAULT NULL,
  `status` enum('PENDING','SUCCESS','FAILED','COMPLETED','REVERSED') DEFAULT 'PENDING',
  `idempotency_key` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idempotency_key` (`idempotency_key`),
  KEY `idx_transactions_from_account` (`from_account`),
  KEY `idx_transactions_to_account` (`to_account`),
  KEY `idx_transactions_idempotency_key` (`idempotency_key`),
  CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`from_account`) REFERENCES `accounts` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `transactions_ibfk_2` FOREIGN KEY (`to_account`) REFERENCES `accounts` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transactions`
--

LOCK TABLES `transactions` WRITE;
/*!40000 ALTER TABLE `transactions` DISABLE KEYS */;
INSERT INTO `transactions` VALUES ('94b07d24-853d-45cc-b530-84759f270f51','f252e023-7f56-4b52-9782-9cc5a5928585','254ce4d2-899d-4540-ba1d-5e587f8a6edd',500.00,'SUCCESS','6599dc4d-8997-4633-ba40-bd2d76b6b4c1','2026-07-14 14:20:43','2026-07-14 14:20:43'),('99a87e74-dbe7-4a02-9737-47679ed4cffb','f252e023-7f56-4b52-9782-9cc5a5928585','5b7a247e-2f14-4b9c-9a99-720cd87f2cd8',1000.00,'SUCCESS','6f680dd2-4cf4-4729-900f-2b9a1730bb9e','2026-07-14 14:16:06','2026-07-14 14:16:21'),('bfaecd37-2cf8-4594-90a3-0758e2947c29','f252e023-7f56-4b52-9782-9cc5a5928585','5b7a247e-2f14-4b9c-9a99-720cd87f2cd8',500.00,'SUCCESS','f1999a73-a038-4ad4-a726-3017f9c63c77','2026-07-14 14:16:06','2026-07-14 14:16:06');
/*!40000 ALTER TABLE `transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` char(36) NOT NULL,
  `email` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `system_user` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('2a3483c2-dbd3-4a0a-af31-c11029085f5c','sys_26bc4001@test.com','System User','$2b$10$vg/Nvnv5UR30e4gbfi6Vue2BxIa6URcy/n7m1EEgFAMkZ1Hb9Krl2',1,'2026-07-14 14:15:58','2026-07-14 14:16:02'),('39c564f0-728e-4031-94f4-37c3f897a8e4','user1_223a9167@test.com','Normal User','$2b$10$VSTCeBoPMUn18JX8YD33NemxBRiy5Wa/jmxaXpu0rRSKaV3dwEUsO',0,'2026-07-14 14:15:00','2026-07-14 14:15:00'),('7a3830c3-d27c-4aef-bca6-c4d1073900fc','vk2225754@gmail.com','Adarsh kumar ','$2b$10$qQi8hHLZ0GoySRR558u2W.Y7b2gub4gurwAInMetky8qfN5G10iiC',0,'2026-07-14 17:14:32','2026-07-14 17:14:32'),('99fc7c16-486f-4e8a-8d00-1bf862d6c29c','sudhanshukumar15101@gmail.com','test2test','$2b$10$jD8BJla2C/.OSo1CZ9bjiO0yPT8GUAGk7.B7hJMPjJLiFbTvRkiuO',0,'2026-07-13 09:20:40','2026-07-13 09:20:40'),('ae1d15f9-22fa-48ce-9d1c-f888f89fe3a7','user1_26bc4001@test.com','Normal User','$2b$10$HupZozwRIXjyuN0pq/FIzOebn8WdDjgBG7iQKCqcav4jQRnoCajyq',0,'2026-07-14 14:16:02','2026-07-14 14:16:02'),('c7e8b6b5-fabf-45dd-a86d-dd4500f1f687','deposit123@test.com','Deposit Tester','$2b$10$i4Y1LgCzFOjgNQRGTV4oA.WjzrOINfZ02kFOuRa7YIbvmO5WFuF3O',0,'2026-07-14 14:19:59','2026-07-14 14:19:59'),('dd4a5b40-3417-463d-b7eb-609cbb2a7b34','e2etest2@test.com','Test User','$2b$10$81L/v1LAWKxyC6ZvNCWPPuQr5zVh0A7BTqS5ncJ7KjYP8wJIYsoTe',0,'2026-07-14 14:06:20','2026-07-14 14:06:20');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-16  1:51:18
