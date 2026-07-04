-- MySQL dump 10.13  Distrib 8.0.46, for Linux (aarch64)
--
-- Host: localhost    Database: yucai_hr
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
-- Current Database: `yucai_hr`
--

/*!40000 DROP DATABASE IF EXISTS `yucai_hr`*/;

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `yucai_hr` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `yucai_hr`;

--
-- Table structure for table `companies`
--

DROP TABLE IF EXISTS `companies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `companies` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logo_url` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `industry` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `scale` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `province` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `city` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `district` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `credit_score` int NOT NULL DEFAULT '0',
  `is_verified` tinyint(1) NOT NULL DEFAULT '0',
  `status` int NOT NULL DEFAULT '1',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `companies_name_key` (`name`),
  KEY `companies_name_idx` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `companies`
--

LOCK TABLES `companies` WRITE;
/*!40000 ALTER TABLE `companies` DISABLE KEYS */;
INSERT INTO `companies` VALUES ('cmr27v12i0000gw969nr5abz3','美团科技有限公司',NULL,'互联网','10000人以上',NULL,'北京','北京',NULL,NULL,88,1,1,'2026-07-01 15:14:30.570'),('cmr27v12l0001gw96wi8kmah3','腾讯科技（深圳）有限公司',NULL,'互联网','10000人以上',NULL,'广东','深圳',NULL,NULL,95,1,1,'2026-07-01 15:14:30.570'),('cmr27v12l0002gw9681nwyhca','新东方教育科技集团',NULL,'教育','10000人以上',NULL,'北京','北京',NULL,NULL,82,1,1,'2026-07-01 15:14:30.571'),('cmr27v12m0003gw96zt6invb7','华为技术有限公司',NULL,'通信/硬件','10000人以上',NULL,'广东','深圳',NULL,NULL,97,1,1,'2026-07-01 15:14:30.570'),('cmr27v12m0004gw96xupqb5kd','京东集团',NULL,'电商','10000人以上',NULL,'北京','北京',NULL,NULL,89,1,1,'2026-07-01 15:14:30.571'),('cmr27v12m0005gw96gyax0jpl','阿里巴巴集团',NULL,'互联网','10000人以上',NULL,'浙江','杭州',NULL,NULL,94,1,1,'2026-07-01 15:14:30.570'),('cmr27v12o0006gw965ap14ubl','中国平安保险集团',NULL,'金融/保险','10000人以上',NULL,'广东','深圳',NULL,NULL,91,1,1,'2026-07-01 15:14:30.571'),('cmr27v12p0007gw96musmbg45','招商银行股份有限公司',NULL,'金融/银行','10000人以上',NULL,'广东','深圳',NULL,NULL,93,1,1,'2026-07-01 15:14:30.571'),('cmr27v12q0008gw96831rmegi','网易（杭州）网络有限公司',NULL,'游戏/互联网','5000-10000人',NULL,'浙江','杭州',NULL,NULL,86,1,1,'2026-07-01 15:14:30.571'),('cmr27v12q0009gw96e3yef3fh','字节跳动有限公司',NULL,'互联网','10000人以上',NULL,'北京','北京',NULL,NULL,92,1,1,'2026-07-01 15:14:30.570'),('cmr29r6gw0000e3hda660m4hq','百度在线网络技术有限公司',NULL,'互联网','10000人以上',NULL,'北京','北京',NULL,NULL,90,1,1,'2026-07-01 16:07:30.177'),('cmr29r6h00001e3hdyj56ekjv','小米科技有限责任公司',NULL,'通信/硬件','10000人以上',NULL,'北京','北京',NULL,NULL,91,1,1,'2026-07-01 16:07:30.177'),('cmr29r6h10002e3hdtygfuqkc','中国太平洋保险集团',NULL,'金融/保险','10000人以上',NULL,'上海','上海',NULL,NULL,90,1,1,'2026-07-01 16:07:30.177'),('cmr29r6h10003e3hdssux3oj1','好未来教育科技集团',NULL,'教育','10000人以上',NULL,'北京','北京',NULL,NULL,83,1,1,'2026-07-01 16:07:30.177'),('cmr29r6h10004e3hdxnegtnk9','滴滴出行科技有限公司',NULL,'互联网','10000人以上',NULL,'北京','北京',NULL,NULL,87,1,1,'2026-07-01 16:07:30.177'),('cmr29r6h10005e3hdra370tft','快手科技有限公司',NULL,'游戏/互联网','10000人以上',NULL,'北京','北京',NULL,NULL,86,1,1,'2026-07-01 16:07:30.177'),('cmr29r6h10006e3hdioyohuoy','拼多多网络科技有限公司',NULL,'电商','10000人以上',NULL,'上海','上海',NULL,NULL,85,1,1,'2026-07-01 16:07:30.177'),('cmr29r6h10007e3hdalxm2h7u','哔哩哔哩科技有限公司',NULL,'游戏/互联网','5000-10000人',NULL,'上海','上海',NULL,NULL,84,1,1,'2026-07-01 16:07:30.177'),('cmr29r6h20008e3hdxthwbj6u','大疆创新科技有限公司',NULL,'通信/硬件','5000-10000人',NULL,'广东','深圳',NULL,NULL,93,1,1,'2026-07-01 16:07:30.177'),('cmr29r6h30009e3hd2au6ng1e','中国工商银行股份有限公司',NULL,'金融/银行','10000人以上',NULL,'北京','北京',NULL,NULL,95,1,1,'2026-07-01 16:07:30.177'),('cmr29z7y8000owvbpd62mmfw9','星辰科技（深圳）有限公司',NULL,'互联网','100-499人',NULL,NULL,'深圳',NULL,NULL,0,0,1,'2026-07-01 16:13:45.345'),('cmr29z7ya000pwvbpowfj35rk','云图数据服务有限公司',NULL,'大数据','50-99人',NULL,NULL,'杭州',NULL,NULL,85,1,1,'2026-07-01 16:13:45.346');
/*!40000 ALTER TABLE `companies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `deliveries`
--

DROP TABLE IF EXISTS `deliveries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `deliveries` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `job_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('PENDING','VIEWED','INTERVIEW','REJECTED','ACCEPTED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `credit_authorized` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `deliveries_user_id_job_id_key` (`user_id`,`job_id`),
  KEY `deliveries_user_id_idx` (`user_id`),
  KEY `deliveries_job_id_idx` (`job_id`),
  CONSTRAINT `deliveries_job_id_fkey` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `deliveries_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `deliveries`
--

LOCK TABLES `deliveries` WRITE;
/*!40000 ALTER TABLE `deliveries` DISABLE KEYS */;
INSERT INTO `deliveries` VALUES ('cmr27wk7k0001mprh4jzc5sgf','mock-seeker-002','cmr27v135000fgw96jxiftcbw','PENDING',1,'2026-07-01 15:15:42.032','2026-07-01 15:15:42.032'),('cmr27wk7r0003mprh9cjhv6ep','mock-seeker-002','cmr27v132000dgw963ssdlrvf','PENDING',1,'2026-07-01 15:15:42.039','2026-07-01 15:15:42.039'),('cmr27wk7u0005mprhf0mgvn2c','mock-seeker-003','cmr27v137000hgw96qjs9caky','PENDING',1,'2026-07-01 15:15:42.043','2026-07-01 15:15:42.043'),('cmr27wk7x0007mprhfdm5bsgj','mock-seeker-004','cmr27v138000jgw9628ekm68g','PENDING',1,'2026-07-01 15:15:42.046','2026-07-01 15:15:42.046'),('cmr27wk800009mprhdtqnvvzj','mock-seeker-005','cmr27v138000jgw9628ekm68g','PENDING',1,'2026-07-01 15:15:42.048','2026-07-01 15:15:42.048'),('cmr27wk82000bmprh2nq9342u','mock-seeker-006','cmr27v135000fgw96jxiftcbw','PENDING',1,'2026-07-01 15:15:42.051','2026-07-01 15:15:42.051'),('cmr27wk84000dmprhc7kbibwq','mock-seeker-007','cmr27v132000dgw963ssdlrvf','PENDING',1,'2026-07-01 15:15:42.052','2026-07-01 15:15:42.052'),('cmr29rfh50001hp6yoyj0qqum','mock-seeker-b2-002','cmr29r6hf000de3hdte6iftcp','PENDING',1,'2026-07-01 16:07:41.849','2026-07-01 16:07:41.849'),('cmr29rfha0003hp6yrvxzw3a3','mock-seeker-b2-002','cmr29r6hi000fe3hdslfn9489','PENDING',1,'2026-07-01 16:07:41.854','2026-07-01 16:07:41.854'),('cmr29rfhd0005hp6yhj6gtbt7','mock-seeker-b2-003','cmr29r6hl000je3hdstqw7d4b','PENDING',1,'2026-07-01 16:07:41.858','2026-07-01 16:07:41.858'),('cmr29rfhg0007hp6y742d1leo','mock-seeker-b2-004','cmr29r6hm000le3hd2q5busv5','PENDING',1,'2026-07-01 16:07:41.860','2026-07-01 16:07:41.860'),('cmr29rfhi0009hp6y1dmezsa1','mock-seeker-b2-005','cmr29r6hj000he3hdb7ik806y','PENDING',1,'2026-07-01 16:07:41.863','2026-07-01 16:07:41.863'),('cmr29rfhl000bhp6ynlozjsqm','mock-seeker-b2-006','cmr29r6hi000fe3hdslfn9489','PENDING',1,'2026-07-01 16:07:41.866','2026-07-01 16:07:41.866'),('cmr29rfhn000dhp6yonucbt1d','mock-seeker-b2-007','cmr29r6hf000de3hdte6iftcp','PENDING',1,'2026-07-01 16:07:41.867','2026-07-01 16:07:41.867'),('cmr2a4l31000313bjolj1rtpn','mock-seeker-001','cmr29r6jh003ne3hdhproxf9r','PENDING',1,'2026-07-01 16:17:55.645','2026-07-01 16:17:55.645'),('cmr2ab01b000713bj5fmjuc4a','mock-seeker-001','cmr29r6kq005ne3hdbs442oq9','PENDING',1,'2026-07-01 16:22:54.959','2026-07-01 16:22:54.959'),('cmr2aban1000913bjhl605i4a','mock-seeker-001','cmr29r6kt005re3hdd7ps02b9','PENDING',1,'2026-07-01 16:23:08.702','2026-07-01 16:23:08.702');
/*!40000 ALTER TABLE `deliveries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `educations`
--

DROP TABLE IF EXISTS `educations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `educations` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `profile_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `school` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `major` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `degree` enum('ANY','JUNIOR_HIGH','HIGH_SCHOOL','ASSOCIATE','BACHELOR','MASTER','DOCTOR') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ANY',
  `start_date` datetime(3) DEFAULT NULL,
  `end_date` datetime(3) DEFAULT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `educations_profile_id_idx` (`profile_id`),
  CONSTRAINT `educations_profile_id_fkey` FOREIGN KEY (`profile_id`) REFERENCES `seeker_profiles` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `educations`
--

LOCK TABLES `educations` WRITE;
/*!40000 ALTER TABLE `educations` DISABLE KEYS */;
INSERT INTO `educations` VALUES ('cmr26se2t000b118xb1uyx4po','cmr26mo0k0001118xwjzwbmtl','北京科技大学','工业制造','DOCTOR','2023-06-30 16:00:00.000','2026-06-30 16:00:00.000',0,'2026-07-01 14:44:27.846','2026-07-01 14:44:27.846'),('cmr27v1sb0003sbmqg1bttat5','cmr27v1s40001sbmqpfu6jd7d','复旦大学','软件工程','BACHELOR','2015-09-01 00:00:00.000','2019-06-01 00:00:00.000',0,'2026-07-01 15:14:31.499','2026-07-01 15:14:31.499'),('cmr27v1sp000bsbmq1g4mi7k3','cmr27v1sm0009sbmqo64y446m','深圳大学','视觉传达设计','BACHELOR','2017-09-01 00:00:00.000','2021-06-01 00:00:00.000',0,'2026-07-01 15:14:31.513','2026-07-01 15:14:31.513'),('cmr27v1sw000jsbmqbxugyyr9','cmr27v1sv000hsbmq6tq53y0d','北京大学','信息管理','MASTER','2016-09-01 00:00:00.000','2019-06-01 00:00:00.000',0,'2026-07-01 15:14:31.521','2026-07-01 15:14:31.521'),('cmr27v1t4000rsbmqf168yh45','cmr27v1t2000psbmq4s0d3l7u','中山大学','新闻传播','BACHELOR','2019-09-01 00:00:00.000','2023-06-01 00:00:00.000',0,'2026-07-01 15:14:31.528','2026-07-01 15:14:31.528'),('cmr27v1ta000xsbmqa23bq2dk','cmr27v1t8000vsbmq9btyovab','电子科技大学','统计学','MASTER','2018-09-01 00:00:00.000','2021-06-01 00:00:00.000',0,'2026-07-01 15:14:31.535','2026-07-01 15:14:31.535'),('cmr27v1tc000zsbmqdbck0m4u','cmr27v1t8000vsbmq9btyovab','电子科技大学','数学','BACHELOR','2014-09-01 00:00:00.000','2018-06-01 00:00:00.000',1,'2026-07-01 15:14:31.536','2026-07-01 15:14:31.536'),('cmr27v1tj0017sbmq3e0kmlj1','cmr27v1ti0015sbmq6ac6gcaj','浙江大学','计算机科学','BACHELOR','2022-09-01 00:00:00.000','2026-06-01 00:00:00.000',0,'2026-07-01 15:14:31.544','2026-07-01 15:14:31.544'),('cmr29rf0t00031tqnzt12d80x','cmr29rf0m00011tqnv77txsm1','北京航空航天大学','计算机科学与技术','BACHELOR','2013-09-01 00:00:00.000','2017-06-01 00:00:00.000',0,'2026-07-01 16:07:41.261','2026-07-01 16:07:41.261'),('cmr29rf16000b1tqn17ku6tko','cmr29rf1400091tqn2hk5i21p','上海交通大学','工业工程','MASTER','2015-09-01 00:00:00.000','2018-06-01 00:00:00.000',0,'2026-07-01 16:07:41.275','2026-07-01 16:07:41.275'),('cmr29rf1e000j1tqntcgo8cql','cmr29rf1c000h1tqnbxuvv40r','哈尔滨工业大学','电子信息工程','BACHELOR','2015-09-01 00:00:00.000','2019-06-01 00:00:00.000',0,'2026-07-01 16:07:41.282','2026-07-01 16:07:41.282'),('cmr29rf1l000r1tqnaxp6tbmh','cmr29rf1j000p1tqnuxidzup3','中国人民大学','统计学','MASTER','2018-09-01 00:00:00.000','2021-06-01 00:00:00.000',0,'2026-07-01 16:07:41.289','2026-07-01 16:07:41.289'),('cmr29rf1r000x1tqnv1sm4a8l','cmr29rf1p000v1tqnk0o33mlp','同济大学','软件工程','MASTER','2016-09-01 00:00:00.000','2019-06-01 00:00:00.000',0,'2026-07-01 16:07:41.295','2026-07-01 16:07:41.295'),('cmr29rf1s000z1tqnfjklscbp','cmr29rf1p000v1tqnk0o33mlp','同济大学','计算机科学','BACHELOR','2012-09-01 00:00:00.000','2016-06-01 00:00:00.000',1,'2026-07-01 16:07:41.296','2026-07-01 16:07:41.296'),('cmr29rf1z00171tqn4pcuxihs','cmr29rf1x00151tqnxk0k6mji','中国美术学院','视觉传达设计','MASTER','2023-09-01 00:00:00.000','2026-06-01 00:00:00.000',0,'2026-07-01 16:07:41.303','2026-07-01 16:07:41.303'),('cmr6jn6820001ro8pefwexhcc','cmr26mo0k0001118xwjzwbmtl','北京农业大学','计算机科学与技术','BACHELOR','2016-09-30 16:00:00.000','2023-02-28 16:00:00.000',0,'2026-07-04 15:55:24.098','2026-07-04 15:55:24.098');
/*!40000 ALTER TABLE `educations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `identity_verifications`
--

DROP TABLE IF EXISTS `identity_verifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `identity_verifications` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `real_name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_number` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_front_url` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_back_url` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_valid_date` datetime(3) DEFAULT NULL,
  `status` enum('PENDING','APPROVED','REJECTED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `reject_reason` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reviewed_at` datetime(3) DEFAULT NULL,
  `reviewer_id` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `identity_verifications_user_id_key` (`user_id`),
  CONSTRAINT `identity_verifications_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `identity_verifications`
--

LOCK TABLES `identity_verifications` WRITE;
/*!40000 ALTER TABLE `identity_verifications` DISABLE KEYS */;
INSERT INTO `identity_verifications` VALUES ('cmr29z7y4000jwvbpm4citu6n','mock-seeker-002','张伟','110101199001011234',NULL,NULL,NULL,'PENDING',NULL,NULL,NULL,'2026-07-01 16:13:45.341'),('cmr29z7y6000lwvbp5cjeh11z','mock-seeker-003','王芳','110101199203052345',NULL,NULL,NULL,'PENDING',NULL,NULL,NULL,'2026-07-01 16:13:45.342'),('cmr29z7y7000nwvbp736xsbqg','mock-seeker-004','刘洋','310101199505103456',NULL,NULL,NULL,'APPROVED',NULL,'2026-07-01 16:14:17.003','mock-admin-001','2026-07-01 16:13:45.344');
/*!40000 ALTER TABLE `identity_verifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_favorites`
--

DROP TABLE IF EXISTS `job_favorites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_favorites` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `job_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `job_favorites_user_id_job_id_key` (`user_id`,`job_id`),
  KEY `job_favorites_user_id_idx` (`user_id`),
  KEY `job_favorites_job_id_fkey` (`job_id`),
  CONSTRAINT `job_favorites_job_id_fkey` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `job_favorites_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_favorites`
--

LOCK TABLES `job_favorites` WRITE;
/*!40000 ALTER TABLE `job_favorites` DISABLE KEYS */;
INSERT INTO `job_favorites` VALUES ('cmr29z7xh0001wvbpxbdk5tjm','mock-seeker-001','cmr27v132000dgw963ssdlrvf','2026-07-01 16:13:45.317'),('cmr29z7xp0003wvbpq1v5aufy','mock-seeker-001','cmr27v135000fgw96jxiftcbw','2026-07-01 16:13:45.325'),('cmr29z7xr0005wvbprjcqo6jq','mock-seeker-001','cmr27v137000hgw96qjs9caky','2026-07-01 16:13:45.328'),('cmr29z7xu0007wvbphviyvrn4','mock-seeker-001','cmr27v138000jgw9628ekm68g','2026-07-01 16:13:45.330'),('cmr29z7xw0009wvbp51hjsl74','mock-seeker-001','cmr27v13a000lgw965qoq8w43','2026-07-01 16:13:45.332'),('cmr2abny1000b13bjb8kcxzq1','mock-seeker-001','cmr29r6kq005ne3hdbs442oq9','2026-07-01 16:23:25.945');
/*!40000 ALTER TABLE `job_favorites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `recruiter_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `company_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nature` enum('FULL_TIME','PART_TIME','INTERNSHIP') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'FULL_TIME',
  `province` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `city` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `district` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `salary_range` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `min_degree` enum('ANY','JUNIOR_HIGH','HIGH_SCHOOL','ASSOCIATE','BACHELOR','MASTER','DOCTOR') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ANY',
  `min_exp_years` int NOT NULL DEFAULT '0',
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `perks` json DEFAULT NULL,
  `status` enum('DRAFT','ACTIVE','CLOSED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ACTIVE',
  `view_count` int NOT NULL DEFAULT '0',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_company_id_idx` (`company_id`),
  KEY `jobs_status_created_at_idx` (`status`,`created_at`),
  KEY `jobs_city_status_idx` (`city`,`status`),
  KEY `jobs_recruiter_id_fkey` (`recruiter_id`),
  CONSTRAINT `jobs_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `jobs_recruiter_id_fkey` FOREIGN KEY (`recruiter_id`) REFERENCES `recruiters` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
INSERT INTO `jobs` VALUES ('cmr27v132000dgw963ssdlrvf','cmr27v12y000bgw96f4e97fxi','cmr27v12q0009gw96e3yef3fh','高级 React 前端工程师','FULL_TIME','北京','北京',NULL,NULL,'20k以上','BACHELOR',4,'负责公司核心业务的前端架构设计与开发，技术栈 React 18 + TypeScript。','[\"股票期权\", \"弹性工作\", \"五险一金\", \"免费三餐\"]','ACTIVE',0,'2026-07-01 15:14:30.591','2026-07-01 15:14:40.089'),('cmr27v135000fgw96jxiftcbw','cmr27v12y000bgw96f4e97fxi','cmr27v12q0009gw96e3yef3fh','Go 后端开发工程师','FULL_TIME','北京','北京',NULL,NULL,'20k以上','BACHELOR',3,'参与搜索/推荐系统后端开发，掌握分布式系统原理。','[\"年终奖\", \"五险一金\", \"健康保险\", \"带薪年假\"]','ACTIVE',0,'2026-07-01 15:14:30.594','2026-07-01 15:14:40.099'),('cmr27v137000hgw96qjs9caky','cmr27v12y000bgw96f4e97fxi','cmr27v12m0005gw96gyax0jpl','大数据开发工程师','FULL_TIME','浙江','杭州',NULL,NULL,'20k以上','BACHELOR',3,'负责数据仓库建设与 ETL 开发，熟悉 Flink/Spark/Hive。','[\"股票期权\", \"弹性工作\", \"五险一金\", \"交通补贴\"]','ACTIVE',0,'2026-07-01 15:14:30.595','2026-07-01 15:14:40.104'),('cmr27v138000jgw9628ekm68g','cmr27v12y000bgw96f4e97fxi','cmr27v12m0005gw96gyax0jpl','Java 架构师','FULL_TIME','浙江','杭州',NULL,NULL,'20k以上','BACHELOR',6,'主导电商平台核心系统架构设计，熟悉高并发分布式系统。','[\"股票期权\", \"年终奖\", \"五险一金\", \"住房补贴\"]','ACTIVE',0,'2026-07-01 15:14:30.597','2026-07-01 15:14:40.108'),('cmr27v13a000lgw965qoq8w43','cmr27v12y000bgw96f4e97fxi','cmr27v12l0001gw96wi8kmah3','iOS 开发工程师','FULL_TIME','广东','深圳',NULL,NULL,'12k-20k','BACHELOR',2,'负责微信相关 App 的 iOS 功能开发与优化。','[\"股票期权\", \"弹性工作\", \"五险一金\", \"班车\"]','ACTIVE',0,'2026-07-01 15:14:30.598','2026-07-01 15:14:40.111'),('cmr27v13b000ngw96d88g22dh','cmr27v12y000bgw96f4e97fxi','cmr27v12l0001gw96wi8kmah3','Android 开发工程师','FULL_TIME','广东','深圳',NULL,NULL,'12k-20k','BACHELOR',2,'负责 Android 端产品研发，熟悉 Kotlin/Java 开发。','[\"股票期权\", \"弹性工作\", \"五险一金\", \"免费体检\"]','ACTIVE',0,'2026-07-01 15:14:30.599','2026-07-01 15:14:40.115'),('cmr27v13c000pgw96yrmzx4u9','cmr27v12y000bgw96f4e97fxi','cmr27v12q0009gw96e3yef3fh','算法工程师（推荐系统）','FULL_TIME','北京','北京',NULL,NULL,'20k以上','MASTER',2,'负责短视频推荐算法研究与落地，有 CTR/排序模型经验优先。','[\"股票期权\", \"年终奖\", \"弹性工作\", \"五险一金\"]','ACTIVE',0,'2026-07-01 15:14:30.601','2026-07-01 15:14:40.118'),('cmr27v13e000rgw96vsozzqko','cmr27v12y000bgw96f4e97fxi','cmr27v12m0003gw96zt6invb7','机器学习工程师','FULL_TIME','广东','深圳',NULL,NULL,'20k以上','MASTER',2,'负责 NLP/CV 模型工程化落地，熟悉 PyTorch/TensorFlow。','[\"股票期权\", \"五险一金\", \"技术培训\", \"年终奖\"]','ACTIVE',0,'2026-07-01 15:14:30.602','2026-07-01 15:14:40.121'),('cmr27v13f000tgw96gp9gswxa','cmr27v12y000bgw96f4e97fxi','cmr27v12m0003gw96zt6invb7','嵌入式软件工程师','FULL_TIME','广东','深圳',NULL,NULL,'12k-20k','BACHELOR',2,'负责智能硬件固件开发，熟悉 C/C++，有 RTOS 经验优先。','[\"年终奖\", \"五险一金\", \"带薪年假\"]','ACTIVE',0,'2026-07-01 15:14:30.604','2026-07-01 15:14:40.123'),('cmr27v13h000vgw96gr3d6wcj','cmr27v12y000bgw96f4e97fxi','cmr27v12m0003gw96zt6invb7','网络安全工程师','FULL_TIME','广东','深圳',NULL,NULL,'20k以上','BACHELOR',3,'负责企业网络安全防护与渗透测试，有 CISP/CISSP 证书优先。','[\"年终奖\", \"五险一金\", \"专项培训\"]','ACTIVE',0,'2026-07-01 15:14:30.605','2026-07-01 15:14:40.126'),('cmr27v13i000xgw962gvke4mc','cmr27v12y000bgw96f4e97fxi','cmr27v12i0000gw969nr5abz3','产品经理（用户增长）','FULL_TIME','北京','北京',NULL,NULL,'12k-20k','BACHELOR',3,'负责用户增长策略制定，有 A/B 测试和数据分析经验。','[\"股票期权\", \"五险一金\", \"弹性工作\"]','ACTIVE',0,'2026-07-01 15:14:30.607','2026-07-01 15:14:40.129'),('cmr27v13j000zgw96kfmr26ht','cmr27v12y000bgw96f4e97fxi','cmr27v12i0000gw969nr5abz3','高级运营专员','FULL_TIME','北京','北京',NULL,NULL,'8k-12k','BACHELOR',2,'负责平台商家运营，熟悉电商运营数据分析工具。','[\"五险一金\", \"年终奖\", \"餐补\"]','ACTIVE',0,'2026-07-01 15:14:30.608','2026-07-01 15:14:40.131'),('cmr27v13l0011gw965ckraxb1','cmr27v12y000bgw96f4e97fxi','cmr27v12q0009gw96e3yef3fh','内容运营经理','FULL_TIME','上海','上海',NULL,NULL,'12k-20k','BACHELOR',3,'负责平台内容生态建设，熟悉 MCN 运营及创作者激励机制。','[\"股票期权\", \"五险一金\", \"弹性工作\", \"远程办公\"]','ACTIVE',0,'2026-07-01 15:14:30.609','2026-07-01 15:14:40.133'),('cmr27v13m0013gw96q3o0a0bg','cmr27v12y000bgw96f4e97fxi','cmr27v12m0005gw96gyax0jpl','市场品牌经理','FULL_TIME','广东','广州',NULL,NULL,'12k-20k','BACHELOR',3,'负责品牌市场策略规划与执行，有 4A 广告或快消品经验优先。','[\"五险一金\", \"年终奖\", \"出差补贴\"]','ACTIVE',0,'2026-07-01 15:14:30.610','2026-07-01 15:14:40.135'),('cmr27v13n0015gw960f7ndsn2','cmr27v12y000bgw96f4e97fxi','cmr27v12m0005gw96gyax0jpl','电商运营专员','FULL_TIME','浙江','杭州',NULL,NULL,'8k-12k','ASSOCIATE',1,'负责淘宝/天猫店铺日常运营，有电商平台操作经验。','[\"五险一金\", \"年终奖\"]','ACTIVE',0,'2026-07-01 15:14:30.612','2026-07-01 15:14:40.136'),('cmr27v13o0017gw96g1sjbo5o','cmr27v12y000bgw96f4e97fxi','cmr27v12m0004gw96xupqb5kd','UI/UX 高级设计师','FULL_TIME','上海','上海',NULL,NULL,'12k-20k','BACHELOR',4,'负责核心产品视觉与交互设计，精通 Figma，有系统化设计经验。','[\"弹性工作\", \"五险一金\", \"年终奖\"]','ACTIVE',0,'2026-07-01 15:14:30.613','2026-07-01 15:14:40.138'),('cmr27v13q0019gw96kelchvau','cmr27v12y000bgw96f4e97fxi','cmr27v12q0008gw96831rmegi','游戏美术原画师','FULL_TIME','浙江','杭州',NULL,NULL,'12k-20k','ANY',2,'负责游戏角色/场景原画设计，精通 PS/SAI，有东方风格作品集优先。','[\"弹性工作\", \"五险一金\", \"作品版权保留\"]','ACTIVE',0,'2026-07-01 15:14:30.614','2026-07-01 15:14:40.140'),('cmr27v13r001bgw96eqejnr1a','cmr27v12y000bgw96f4e97fxi','cmr27v12q0008gw96831rmegi','3D 动画设计师','FULL_TIME','浙江','杭州',NULL,NULL,'12k-20k','ANY',2,'负责游戏内 3D 角色动作绑定与动画制作，熟悉 Maya/Blender。','[\"弹性工作\", \"五险一金\", \"技术沙龙\"]','ACTIVE',0,'2026-07-01 15:14:30.615','2026-07-01 15:14:30.615'),('cmr27v13s001dgw96geqo4juy','cmr27v12y000bgw96f4e97fxi','cmr27v12o0006gw965ap14ubl','数据分析师','FULL_TIME','广东','深圳',NULL,NULL,'12k-20k','BACHELOR',1,'负责业务数据分析，支持产品迭代决策，熟悉 SQL/Python/Tableau。','[\"五险一金\", \"年终奖\", \"弹性工作\"]','ACTIVE',0,'2026-07-01 15:14:30.617','2026-07-01 15:14:30.617'),('cmr27v13u001fgw967v2h0x1f','cmr27v12y000bgw96f4e97fxi','cmr27v12o0006gw965ap14ubl','风险量化分析师','FULL_TIME','广东','深圳',NULL,NULL,'20k以上','MASTER',2,'负责信用风险建模，熟悉 SAS/Python，有金融工程背景优先。','[\"股票期权\", \"五险一金\", \"专业培训\"]','ACTIVE',0,'2026-07-01 15:14:30.618','2026-07-01 15:14:40.141'),('cmr27v13v001hgw96h66ysokw','cmr27v12y000bgw96f4e97fxi','cmr27v12m0004gw96xupqb5kd','商业智能（BI）工程师','FULL_TIME','北京','北京',NULL,NULL,'12k-20k','BACHELOR',2,'负责 BI 报表开发及数据可视化平台建设，熟悉 Power BI/Tableau。','[\"五险一金\", \"年终奖\", \"带薪学习\"]','ACTIVE',0,'2026-07-01 15:14:30.619','2026-07-01 15:14:40.143'),('cmr27v13w001jgw96y3dle9ki','cmr27v12y000bgw96f4e97fxi','cmr27v12m0005gw96gyax0jpl','企业销售经理（华东）','FULL_TIME','上海','上海',NULL,NULL,'12k-20k','BACHELOR',3,'负责华东地区企业客户开拓与维护，有 SaaS/云服务销售经验优先。','[\"提成无上限\", \"五险一金\", \"出差补贴\"]','ACTIVE',0,'2026-07-01 15:14:30.621','2026-07-01 15:14:30.621'),('cmr27v13y001lgw9643b4vzbj','cmr27v12y000bgw96f4e97fxi','cmr27v12m0005gw96gyax0jpl','客户成功经理','FULL_TIME','四川','成都',NULL,NULL,'8k-12k','BACHELOR',2,'负责企业客户 SaaS 产品使用培训与续约，降低客户流失率。','[\"五险一金\", \"年终奖\", \"弹性工作\"]','ACTIVE',0,'2026-07-01 15:14:30.622','2026-07-01 15:14:40.144'),('cmr27v13z001ngw964fh1do30','cmr27v12y000bgw96f4e97fxi','cmr27v12m0004gw96xupqb5kd','高级客服专员','FULL_TIME','湖北','武汉',NULL,NULL,'5k-8k','ASSOCIATE',1,'负责处理电商平台客户投诉及售后，熟悉 CRM 系统。','[\"五险一金\", \"年终奖\", \"餐补\"]','ACTIVE',0,'2026-07-01 15:14:30.624','2026-07-01 15:14:40.146'),('cmr27v140001pgw96e5xzokee','cmr27v12y000bgw96f4e97fxi','cmr27v12p0007gw96musmbg45','理财顾问','FULL_TIME','广东','深圳',NULL,NULL,'8k-12k','BACHELOR',1,'为高净值客户提供个人理财规划，有基金/保险从业资格证优先。','[\"提成\", \"五险一金\", \"节日福利\"]','ACTIVE',0,'2026-07-01 15:14:30.625','2026-07-01 15:14:40.147'),('cmr27v142001rgw96ts7p12az','cmr27v12y000bgw96f4e97fxi','cmr27v12p0007gw96musmbg45','零售信贷客户经理','FULL_TIME','广东','广州',NULL,NULL,'8k-12k','BACHELOR',1,'负责个人住房/消费贷款业务开展，完成月度信贷指标。','[\"提成\", \"五险一金\", \"年终奖\"]','ACTIVE',0,'2026-07-01 15:14:30.626','2026-07-01 15:14:40.149'),('cmr27v143001tgw9686luwue9','cmr27v12y000bgw96f4e97fxi','cmr27v12o0006gw965ap14ubl','金融风控分析师','FULL_TIME','广东','深圳',NULL,NULL,'12k-20k','BACHELOR',2,'负责贷款审批风险评估，有征信数据分析经验。','[\"五险一金\", \"年终奖\", \"专业培训\"]','ACTIVE',0,'2026-07-01 15:14:30.628','2026-07-01 15:14:30.628'),('cmr27v144001vgw96l5sojl35','cmr27v12y000bgw96f4e97fxi','cmr27v12l0002gw9681nwyhca','英语课程顾问','FULL_TIME','北京','北京',NULL,NULL,'8k-12k','BACHELOR',0,'负责向家长介绍英语培训课程，完成招生任务，有教育行业销售经验优先。','[\"提成无上限\", \"五险一金\", \"内部培训\"]','ACTIVE',0,'2026-07-01 15:14:30.629','2026-07-01 15:14:40.150'),('cmr27v146001xgw96zjn41xsi','cmr27v12y000bgw96f4e97fxi','cmr27v12l0002gw9681nwyhca','在线教育产品经理','FULL_TIME','北京','北京',NULL,NULL,'12k-20k','BACHELOR',3,'负责在线直播课 App 产品规划，有 K12 教育产品经验优先。','[\"股票期权\", \"五险一金\", \"弹性工作\"]','ACTIVE',0,'2026-07-01 15:14:30.630','2026-07-01 15:14:40.152'),('cmr27v147001zgw96slu4ceth','cmr27v12y000bgw96f4e97fxi','cmr27v12l0002gw9681nwyhca','教研内容设计师','FULL_TIME','上海','上海',NULL,NULL,'8k-12k','BACHELOR',2,'负责 K12 数学课程内容研发与质量管控，师范类专业优先。','[\"五险一金\", \"年终奖\", \"带薪培训\"]','ACTIVE',0,'2026-07-01 15:14:30.631','2026-07-01 15:14:40.154'),('cmr27v1480021gw96ywonvnll','cmr27v12y000bgw96f4e97fxi','cmr27v12i0000gw969nr5abz3','HR 招聘专员','FULL_TIME','四川','成都',NULL,NULL,'5k-8k','BACHELOR',1,'负责研发岗位简历筛选与面试安排，有互联网招聘经验优先。','[\"五险一金\", \"年终奖\", \"弹性工作\"]','ACTIVE',0,'2026-07-01 15:14:30.633','2026-07-01 15:14:40.155'),('cmr27v1490023gw96ihd3uhf1','cmr27v12y000bgw96f4e97fxi','cmr27v12q0009gw96e3yef3fh','HRBP（人力资源业务伙伴）','FULL_TIME','北京','北京',NULL,NULL,'12k-20k','BACHELOR',4,'支持业务部门 HR 策略落地，熟悉绩效管理与组织发展。','[\"股票期权\", \"五险一金\", \"弹性工作\"]','ACTIVE',0,'2026-07-01 15:14:30.634','2026-07-01 15:14:40.157'),('cmr27v14b0025gw967y0wnhqo','cmr27v12y000bgw96f4e97fxi','cmr27v12m0003gw96zt6invb7','行政助理','FULL_TIME','陕西','西安',NULL,NULL,'5k-8k','ASSOCIATE',0,'协助部门日常行政事务，会议安排、差旅报销、物资管理等。','[\"五险一金\", \"年终奖\", \"节日福利\"]','ACTIVE',0,'2026-07-01 15:14:30.635','2026-07-01 15:14:30.635'),('cmr27v14c0027gw96a8jsq6m2','cmr27v12y000bgw96f4e97fxi','cmr27v12m0005gw96gyax0jpl','法务专员','FULL_TIME','浙江','杭州',NULL,NULL,'8k-12k','BACHELOR',2,'负责公司合同审核及法律合规工作，法律专业背景，有律师资格证优先。','[\"五险一金\", \"年终奖\", \"带薪年假\"]','ACTIVE',0,'2026-07-01 15:14:30.636','2026-07-01 15:14:40.158'),('cmr27v14d0029gw96sei93hpr','cmr27v12y000bgw96f4e97fxi','cmr27v12o0006gw965ap14ubl','财务分析经理','FULL_TIME','广东','深圳',NULL,NULL,'12k-20k','BACHELOR',5,'负责集团财务规划与经营分析，有 CPA/CFA 证书优先。','[\"五险一金\", \"年终奖\", \"绩效奖金\"]','ACTIVE',0,'2026-07-01 15:14:30.638','2026-07-01 15:14:40.160'),('cmr27v14e002bgw9659fhj5cq','cmr27v12y000bgw96f4e97fxi','cmr27v12m0004gw96xupqb5kd','供应链管理专员','FULL_TIME','北京','北京',NULL,NULL,'8k-12k','BACHELOR',2,'负责采购计划制定与供应商管理，有 ERP 系统使用经验。','[\"五险一金\", \"年终奖\", \"员工优惠\"]','ACTIVE',0,'2026-07-01 15:14:30.639','2026-07-01 15:14:40.161'),('cmr27v14f002dgw96ejtqjoi6','cmr27v12y000bgw96f4e97fxi','cmr27v12m0004gw96xupqb5kd','仓储物流主管','FULL_TIME','湖北','武汉',NULL,NULL,'8k-12k','ASSOCIATE',3,'负责仓库日常管理与物流配送协调，有大型仓储管理经验。','[\"五险一金\", \"年终奖\", \"班车\"]','ACTIVE',0,'2026-07-01 15:14:30.640','2026-07-01 15:14:40.163'),('cmr27v14h002fgw96gsnhz24f','cmr27v12y000bgw96f4e97fxi','cmr27v12q0008gw96831rmegi','游戏策划师（数值）','FULL_TIME','浙江','杭州',NULL,NULL,'12k-20k','BACHELOR',2,'负责游戏经济系统数值设计与平衡性调整，有 MMORPG 项目经验优先。','[\"弹性工作\", \"五险一金\", \"游戏内部测试福利\"]','ACTIVE',0,'2026-07-01 15:14:30.641','2026-07-01 15:14:40.164'),('cmr27v14i002hgw96a8exzvk3','cmr27v12y000bgw96f4e97fxi','cmr27v12q0008gw96831rmegi','游戏服务器工程师','FULL_TIME','浙江','杭州',NULL,NULL,'20k以上','BACHELOR',3,'负责游戏后端服务开发，C++ 为主，熟悉 Redis/MySQL 等。','[\"弹性工作\", \"五险一金\", \"年终奖\"]','ACTIVE',0,'2026-07-01 15:14:30.642','2026-07-01 15:14:40.166'),('cmr27v14j002jgw960nqv4sgx','cmr27v12y000bgw96f4e97fxi','cmr27v12m0004gw96xupqb5kd','测试工程师（自动化）','FULL_TIME','上海','上海',NULL,NULL,'12k-20k','BACHELOR',2,'负责功能测试与自动化框架建设，熟悉 Selenium/Appium/JMeter。','[\"五险一金\", \"年终奖\", \"弹性工作\"]','ACTIVE',0,'2026-07-01 15:14:30.643','2026-07-01 15:14:40.167'),('cmr27v14k002lgw96z3cq6c50','cmr27v12y000bgw96f4e97fxi','cmr27v12i0000gw969nr5abz3','DevOps 工程师','FULL_TIME','北京','北京',NULL,NULL,'12k-20k','BACHELOR',3,'负责 CI/CD 流程建设与云基础设施运维，熟悉 Kubernetes/Docker/Terraform。','[\"股票期权\", \"五险一金\", \"弹性工作\"]','ACTIVE',0,'2026-07-01 15:14:30.645','2026-07-01 15:14:40.168'),('cmr27v14l002ngw96htln8y1l','cmr27v12y000bgw96f4e97fxi','cmr27v12m0003gw96zt6invb7','技术支持工程师','FULL_TIME','江苏','南京',NULL,NULL,'8k-12k','ASSOCIATE',1,'负责为客户提供产品使用及故障排查技术支持，有一线技术支持经验。','[\"五险一金\", \"年终奖\"]','ACTIVE',0,'2026-07-01 15:14:30.646','2026-07-01 15:14:40.170'),('cmr27v14m002pgw96wrwee9xt','cmr27v12y000bgw96f4e97fxi','cmr27v12m0003gw96zt6invb7','售前解决方案工程师','FULL_TIME','四川','成都',NULL,NULL,'12k-20k','BACHELOR',3,'支持企业级客户投标方案制作与技术演示，熟悉云计算/AI 方向。','[\"五险一金\", \"差旅补贴\", \"年终奖\"]','ACTIVE',0,'2026-07-01 15:14:30.647','2026-07-01 15:14:40.171'),('cmr27v14o002rgw96kxu6mtqk','cmr27v12y000bgw96f4e97fxi','cmr27v12l0001gw96wi8kmah3','项目经理（PMP）','FULL_TIME','广东','广州',NULL,NULL,'12k-20k','BACHELOR',4,'负责互联网产品研发项目管理，有 PMP/PMI-ACP 证书优先。','[\"五险一金\", \"年终奖\", \"弹性工作\"]','ACTIVE',0,'2026-07-01 15:14:30.648','2026-07-01 15:14:40.173'),('cmr27v14p002tgw96fkihhhps','cmr27v12y000bgw96f4e97fxi','cmr27v12l0001gw96wi8kmah3','云计算架构师','FULL_TIME','广东','深圳',NULL,NULL,'20k以上','BACHELOR',6,'负责企业级云方案设计，熟悉腾讯云/AWS/阿里云产品体系。','[\"股票期权\", \"年终奖\", \"五险一金\"]','ACTIVE',0,'2026-07-01 15:14:30.649','2026-07-01 15:14:40.174'),('cmr27v14q002vgw962rz00k5i','cmr27v12y000bgw96f4e97fxi','cmr27v12l0001gw96wi8kmah3','微信小程序开发工程师','FULL_TIME','广东','深圳',NULL,NULL,'12k-20k','BACHELOR',2,'负责微信生态小程序/公众号开发，熟悉 UniApp/Taro 优先。','[\"股票期权\", \"五险一金\", \"弹性工作\"]','ACTIVE',0,'2026-07-01 15:14:30.650','2026-07-01 15:14:40.175'),('cmr27v14r002xgw964oizbexb','cmr27v12y000bgw96f4e97fxi','cmr27v12i0000gw969nr5abz3','软件研发工程师','FULL_TIME','四川','成都',NULL,NULL,'12k-20k','BACHELOR',1,'参与公司 SaaS 产品后端开发，Java/Spring Boot 技术栈。','[\"五险一金\", \"年终奖\", \"弹性工作\"]','ACTIVE',0,'2026-07-01 15:14:30.652','2026-07-01 15:14:30.652'),('cmr27v14s002zgw96qb1s8fvo','cmr27v12y000bgw96f4e97fxi','cmr27v12i0000gw969nr5abz3','数据工程师','FULL_TIME','四川','成都',NULL,NULL,'12k-20k','BACHELOR',2,'负责数据管道建设与数仓开发，熟悉 Spark/Airflow/Kafka。','[\"五险一金\", \"年终奖\", \"弹性工作\"]','ACTIVE',0,'2026-07-01 15:14:30.653','2026-07-01 15:14:40.177'),('cmr27v14u0031gw96verrgycm','cmr27v12y000bgw96f4e97fxi','cmr27v12m0003gw96zt6invb7','前端开发工程师','FULL_TIME','陕西','西安',NULL,NULL,'8k-12k','BACHELOR',1,'Vue3 + TypeScript 开发企业管理后台，参与组件库建设。','[\"五险一金\", \"年终奖\", \"弹性工作\"]','ACTIVE',0,'2026-07-01 15:14:30.654','2026-07-01 15:14:40.178'),('cmr27v14v0033gw96n9yd50r3','cmr27v12y000bgw96f4e97fxi','cmr27v12m0003gw96zt6invb7','Python 后端工程师','FULL_TIME','江苏','南京',NULL,NULL,'12k-20k','BACHELOR',2,'负责 AI 平台后端 API 开发，Django/FastAPI 技术栈。','[\"五险一金\", \"年终奖\", \"技术培训\"]','ACTIVE',0,'2026-07-01 15:14:30.655','2026-07-01 15:14:40.179'),('cmr27v14w0035gw96vmr8guek','cmr27v12y000bgw96f4e97fxi','cmr27v12o0006gw965ap14ubl','区块链开发工程师','FULL_TIME','上海','上海',NULL,NULL,'20k以上','BACHELOR',3,'负责金融科技区块链平台开发，熟悉 Solidity/Go。','[\"股票期权\", \"五险一金\", \"年终奖\"]','ACTIVE',0,'2026-07-01 15:14:30.657','2026-07-01 15:14:40.181'),('cmr27v14x0037gw96b8qkximv','cmr27v12y000bgw96f4e97fxi','cmr27v12o0006gw965ap14ubl','保险精算师（助理）','FULL_TIME','广东','深圳',NULL,NULL,'12k-20k','MASTER',0,'负责寿险/健康险产品定价，有精算师考试通过经历优先。','[\"五险一金\", \"年终奖\", \"考试费用报销\"]','ACTIVE',0,'2026-07-01 15:14:30.658','2026-07-01 15:14:40.182'),('cmr27v14z0039gw96xvvhfesf','cmr27v12y000bgw96f4e97fxi','cmr27v12m0005gw96gyax0jpl','直播运营专员','FULL_TIME','广东','广州',NULL,NULL,'8k-12k','ANY',1,'负责直播间选品、主播管理及实时运营互动，有电商直播经验优先。','[\"五险一金\", \"提成\", \"免费试用产品\"]','ACTIVE',0,'2026-07-01 15:14:30.659','2026-07-01 15:14:40.185'),('cmr27v150003bgw96qiwy7s2c','cmr27v12y000bgw96f4e97fxi','cmr27v12q0009gw96e3yef3fh','新媒体运营经理','FULL_TIME','北京','北京',NULL,NULL,'12k-20k','BACHELOR',3,'负责抖音/微博/微信公众号账号矩阵运营，有 10W+ 爆文经验优先。','[\"股票期权\", \"五险一金\", \"弹性工作\"]','ACTIVE',0,'2026-07-01 15:14:30.661','2026-07-01 15:14:30.661'),('cmr27v151003dgw96xg3gv61k','cmr27v12y000bgw96f4e97fxi','cmr27v12m0005gw96gyax0jpl','SEO 优化专员','FULL_TIME','浙江','杭州',NULL,NULL,'5k-8k','ANY',1,'负责电商平台商品搜索排名优化，有跨境电商 SEO 经验优先。','[\"五险一金\", \"年终奖\"]','ACTIVE',0,'2026-07-01 15:14:30.662','2026-07-01 15:14:40.188'),('cmr27v152003fgw963r8wsinx','cmr27v12y000bgw96f4e97fxi','cmr27v12m0005gw96gyax0jpl','国际贸易专员','FULL_TIME','广东','广州',NULL,NULL,'8k-12k','BACHELOR',1,'负责跨境电商平台海外商家招募与支持，英语流利。','[\"五险一金\", \"年终奖\", \"出国机会\"]','ACTIVE',0,'2026-07-01 15:14:30.663','2026-07-01 15:14:40.190'),('cmr27v154003hgw969583au4a','cmr27v12y000bgw96f4e97fxi','cmr27v12l0002gw9681nwyhca','在线英语家教（兼职）','PART_TIME','北京','北京',NULL,NULL,'面议','BACHELOR',0,'为 K12 学生提供在线英语辅导，有教学经验或雅思/托福高分者优先。','[\"灵活排班\", \"远程上课\"]','ACTIVE',0,'2026-07-01 15:14:30.664','2026-07-01 15:14:40.192'),('cmr27v155003jgw969g2awo9e','cmr27v12y000bgw96f4e97fxi','cmr27v12m0005gw96gyax0jpl','兼职摄影师','PART_TIME','上海','上海',NULL,NULL,'面议','ANY',0,'为品牌电商产品拍摄棚拍及外拍图片，有商业摄影作品集。','[\"灵活接单\", \"设备补贴\"]','ACTIVE',0,'2026-07-01 15:14:30.665','2026-07-01 15:14:40.194'),('cmr27v156003lgw96o8hak9j7','cmr27v12y000bgw96f4e97fxi','cmr27v12o0006gw965ap14ubl','市场调研员（兼职）','PART_TIME','广东','深圳',NULL,NULL,'面议','ANY',0,'按计划完成指定地点的市场调研与访谈任务，按单结算。','[\"灵活时间\", \"交通补贴\"]','ACTIVE',0,'2026-07-01 15:14:30.666','2026-07-01 15:14:40.195'),('cmr27v157003ngw966d2lqv84','cmr27v12y000bgw96f4e97fxi','cmr27v12q0009gw96e3yef3fh','数据标注员（兼职）','PART_TIME','四川','成都',NULL,NULL,'3k-5k','HIGH_SCHOOL',0,'完成图像/语音/文本标注任务，支持远程居家办公。','[\"灵活上班\", \"远程办公\"]','ACTIVE',0,'2026-07-01 15:14:30.668','2026-07-01 15:14:40.196'),('cmr27v158003pgw96dgi8h81l','cmr27v12y000bgw96f4e97fxi','cmr27v12q0009gw96e3yef3fh','视频剪辑（兼职）','PART_TIME','浙江','杭州',NULL,NULL,'5k-8k','ANY',1,'负责短视频及直播切片剪辑，熟悉 Premiere/剪映，接项目计酬。','[\"远程工作\", \"弹性排班\"]','ACTIVE',0,'2026-07-01 15:14:30.669','2026-07-01 15:14:40.198'),('cmr27v15a003rgw96ieraer9t','cmr27v12y000bgw96f4e97fxi','cmr27v12m0003gw96zt6invb7','翻译（兼职/英日韩）','PART_TIME','广东','广州',NULL,NULL,'面议','BACHELOR',0,'承接技术文档/法律合同翻译，英语/日语/韩语方向均有需求。','[\"远程工作\", \"弹性时间\"]','ACTIVE',0,'2026-07-01 15:14:30.670','2026-07-01 15:14:40.199'),('cmr27v15b003tgw968ku4rnsr','cmr27v12y000bgw96f4e97fxi','cmr27v12l0002gw9681nwyhca','社群运营助手（兼职）','PART_TIME','北京','北京',NULL,NULL,'3k-5k','ANY',0,'协助管理微信社群，每日推送内容及回答用户问题，每天 2-3 小时。','[\"远程工作\", \"灵活时间\"]','ACTIVE',0,'2026-07-01 15:14:30.671','2026-07-01 15:14:40.200'),('cmr27v15c003vgw96nz0p20u0','cmr27v12y000bgw96f4e97fxi','cmr27v12i0000gw969nr5abz3','Python 脚本开发（兼职）','PART_TIME','湖北','武汉',NULL,NULL,'5k-8k','ANY',1,'按需开发数据采集/处理脚本，项目制合作，100% 远程。','[\"远程工作\", \"弹性合作\"]','ACTIVE',0,'2026-07-01 15:14:30.672','2026-07-01 15:14:40.202'),('cmr27v15d003xgw96hrra6v2n','cmr27v12y000bgw96f4e97fxi','cmr27v12q0008gw96831rmegi','平面设计（兼职）','PART_TIME','江苏','南京',NULL,NULL,'3k-5k','ANY',1,'协助设计部门完成日常海报/Banner 设计，熟悉 Photoshop/Illustrator。','[\"远程工作\", \"弹性上班\"]','ACTIVE',0,'2026-07-01 15:14:30.674','2026-07-01 15:14:40.203'),('cmr27v15e003zgw963okbcxrc','cmr27v12y000bgw96f4e97fxi','cmr27v12l0002gw9681nwyhca','英语口语陪练（兼职）','PART_TIME','上海','上海',NULL,NULL,'面议','BACHELOR',0,'为成人学员提供英语口语 1v1 对话练习，母语/海外留学背景优先。','[\"远程上课\", \"弹性时间\"]','ACTIVE',0,'2026-07-01 15:14:30.675','2026-07-01 15:14:40.205'),('cmr27v15f0041gw96ju55hw5m','cmr27v12y000bgw96f4e97fxi','cmr27v12l0002gw9681nwyhca','兼职数学讲师','PART_TIME','广东','广州',NULL,NULL,'面议','BACHELOR',0,'为初高中生提供数学线上辅导，数学/理工科专业在读优先。','[\"灵活排班\", \"远程授课\"]','ACTIVE',0,'2026-07-01 15:14:30.676','2026-07-01 15:14:40.206'),('cmr27v15h0043gw96faxsxhzl','cmr27v12y000bgw96f4e97fxi','cmr27v12o0006gw965ap14ubl','财务记账（兼职）','PART_TIME','广东','深圳',NULL,NULL,'面议','ASSOCIATE',1,'为中小企业提供代账服务，每月工作量约 10-20 小时，远程完成。','[\"远程工作\", \"灵活时间\"]','ACTIVE',0,'2026-07-01 15:14:30.677','2026-07-01 15:14:40.208'),('cmr27v15i0045gw96vmf91c3a','cmr27v12y000bgw96f4e97fxi','cmr27v12o0006gw965ap14ubl','问卷调查员（兼职）','PART_TIME','陕西','西安',NULL,NULL,'面议','ANY',0,'按要求完成线上或线下问卷调查任务，按完成数量结算。','[\"灵活时间\", \"交通补贴\"]','ACTIVE',0,'2026-07-01 15:14:30.678','2026-07-01 15:14:40.209'),('cmr27v15j0047gw964v8wn36c','cmr27v12y000bgw96f4e97fxi','cmr27v12i0000gw969nr5abz3','产品测试体验官（兼职）','PART_TIME','四川','成都',NULL,NULL,'3k-5k','ANY',0,'体验测试新功能并提交反馈报告，每月约 10 小时，远程参与。','[\"远程工作\", \"免费使用产品\"]','ACTIVE',1,'2026-07-01 15:14:30.679','2026-07-02 13:17:32.089'),('cmr27v15k0049gw968za02m2o','cmr27v12y000bgw96f4e97fxi','cmr27v12q0009gw96e3yef3fh','前端开发实习生','INTERNSHIP','北京','北京',NULL,NULL,'面议','ASSOCIATE',0,'参与商业化产品前端开发，Vue3 技术栈，每周至少 4 天到岗。','[\"五险\", \"餐补\", \"转正机会\"]','ACTIVE',0,'2026-07-01 15:14:30.681','2026-07-01 15:14:40.212'),('cmr27v15l004bgw96i7ma5cmk','cmr27v12y000bgw96f4e97fxi','cmr27v12l0001gw96wi8kmah3','后端开发实习生','INTERNSHIP','广东','深圳',NULL,NULL,'面议','ASSOCIATE',0,'参与电商系统后端开发，Java/Go 任一，每周至少 4 天。','[\"五险\", \"餐补\", \"转正机会\"]','ACTIVE',0,'2026-07-01 15:14:30.682','2026-07-01 15:14:40.213'),('cmr27v15n004dgw960nh7xi6n','cmr27v12y000bgw96f4e97fxi','cmr27v12m0005gw96gyax0jpl','数据分析实习生','INTERNSHIP','浙江','杭州',NULL,NULL,'面议','ASSOCIATE',0,'协助业务数据分析工作，熟悉 Python/SQL，在校本科/研究生。','[\"五险\", \"餐补\", \"实习证明\"]','ACTIVE',0,'2026-07-01 15:14:30.683','2026-07-01 15:14:40.214'),('cmr27v15o004fgw9605r0z9oc','cmr27v12y000bgw96f4e97fxi','cmr27v12i0000gw969nr5abz3','产品经理实习生','INTERNSHIP','北京','北京',NULL,NULL,'面议','BACHELOR',0,'参与外卖产品需求分析与原型设计，有互联网实习经历优先。','[\"五险\", \"餐补\", \"导师制\"]','ACTIVE',0,'2026-07-01 15:14:30.684','2026-07-01 15:14:40.216'),('cmr27v15p004hgw96fgr5aylf','cmr27v12y000bgw96f4e97fxi','cmr27v12q0008gw96831rmegi','UI 设计实习生','INTERNSHIP','浙江','杭州',NULL,NULL,'面议','ANY',0,'协助设计师完成界面设计稿输出，熟悉 Figma，有作品集。','[\"餐补\", \"设计资源\", \"实习证明\"]','ACTIVE',0,'2026-07-01 15:14:30.685','2026-07-01 15:14:40.218'),('cmr27v15q004jgw96wv4w3491','cmr27v12y000bgw96f4e97fxi','cmr27v12m0004gw96xupqb5kd','运营实习生','INTERNSHIP','上海','上海',NULL,NULL,'面议','BACHELOR',0,'协助商家运营团队完成日常数据监控与活动执行。','[\"餐补\", \"班车\", \"转正机会\"]','ACTIVE',0,'2026-07-01 15:14:30.687','2026-07-01 15:14:40.220'),('cmr27v15r004lgw96tvtihknj','cmr27v12y000bgw96f4e97fxi','cmr27v12m0003gw96zt6invb7','测试实习生','INTERNSHIP','广东','深圳',NULL,NULL,'面议','ASSOCIATE',0,'协助功能测试与 Bug 提交，有 Python/Selenium 基础优先。','[\"五险\", \"餐补\", \"实习证明\"]','ACTIVE',0,'2026-07-01 15:14:30.688','2026-07-01 15:14:40.221'),('cmr27v15t004ngw96aclgdjsl','cmr27v12y000bgw96f4e97fxi','cmr27v12o0006gw965ap14ubl','财务实习生','INTERNSHIP','广东','深圳',NULL,NULL,'面议','BACHELOR',0,'协助财务团队完成凭证整理、报表汇总，财会专业在读。','[\"餐补\", \"实习证明\", \"转正机会\"]','ACTIVE',0,'2026-07-01 15:14:30.689','2026-07-01 15:14:40.223'),('cmr27v15u004pgw96kjvxghdw','cmr27v12y000bgw96f4e97fxi','cmr27v12m0005gw96gyax0jpl','法务实习生','INTERNSHIP','浙江','杭州',NULL,NULL,'面议','BACHELOR',0,'协助合同审核与法律研究工作，法学专业在读，有司法考试备考经历优先。','[\"餐补\", \"实习证明\", \"指导律师带教\"]','ACTIVE',0,'2026-07-01 15:14:30.690','2026-07-01 15:14:40.224'),('cmr27v15v004rgw96vpryz34w','cmr27v12y000bgw96f4e97fxi','cmr27v12l0002gw9681nwyhca','市场营销实习生','INTERNSHIP','北京','北京',NULL,NULL,'面议','BACHELOR',0,'协助品牌营销活动策划与执行，市场营销/传播学专业优先。','[\"餐补\", \"班车\", \"实习证明\"]','ACTIVE',0,'2026-07-01 15:14:30.692','2026-07-01 15:14:40.226'),('cmr27v15w004tgw96xjodiroo','cmr27v12y000bgw96f4e97fxi','cmr27v12m0003gw96zt6invb7','C++ 研发工程师（无人驾驶）','FULL_TIME','北京','北京',NULL,NULL,'20k以上','MASTER',2,'参与自动驾驶感知算法工程化，熟悉 ROS/CUDA，有激光雷达数据处理经验优先。','[\"股票期权\", \"五险一金\", \"弹性工作\", \"年终奖\"]','ACTIVE',0,'2026-07-01 15:14:30.693','2026-07-01 15:14:40.228'),('cmr27v15y004vgw96gdqoz9dt','cmr27v12y000bgw96f4e97fxi','cmr27v12m0003gw96zt6invb7','硬件测试工程师','FULL_TIME','广东','深圳',NULL,NULL,'8k-12k','BACHELOR',1,'负责硬件产品可靠性及兼容性测试，熟悉万用表/示波器等仪器。','[\"五险一金\", \"年终奖\"]','ACTIVE',0,'2026-07-01 15:14:30.694','2026-07-01 15:14:40.230'),('cmr27v15z004xgw96ou9ayosu','cmr27v12y000bgw96f4e97fxi','cmr27v12m0003gw96zt6invb7','物联网软件开发工程师','FULL_TIME','湖北','武汉',NULL,NULL,'12k-20k','BACHELOR',2,'负责智能家居 IoT 平台开发，熟悉 MQTT/CoAP 协议。','[\"五险一金\", \"年终奖\", \"弹性工作\"]','ACTIVE',0,'2026-07-01 15:14:30.695','2026-07-01 15:14:40.231'),('cmr27v160004zgw96p1586x4e','cmr27v12y000bgw96f4e97fxi','cmr27v12q0009gw96e3yef3fh','人工智能产品经理','FULL_TIME','上海','上海',NULL,NULL,'20k以上','BACHELOR',3,'负责 AI 大模型应用产品从 0 到 1，有 NLP/CV 产品落地经验。','[\"股票期权\", \"五险一金\", \"弹性工作\"]','ACTIVE',0,'2026-07-01 15:14:30.696','2026-07-01 15:14:40.233'),('cmr27v1610051gw965c2omqs9','cmr27v12y000bgw96f4e97fxi','cmr27v12m0005gw96gyax0jpl','兼职直播助手','PART_TIME','广东','广州',NULL,NULL,'3k-5k','ANY',0,'协助主播直播过程中的评论回复、商品上架及订单跟进，每晚 3 小时。','[\"灵活排班\", \"提成分成\"]','ACTIVE',0,'2026-07-01 15:14:30.698','2026-07-01 15:14:40.234'),('cmr27v1620053gw962m3hs118','cmr27v12y000bgw96f4e97fxi','cmr27v12m0004gw96xupqb5kd','客服实习生（在线）','INTERNSHIP','四川','成都',NULL,NULL,'面议','HIGH_SCHOOL',0,'处理电商平台用户在线咨询，支持远程办公，每天 6 小时。','[\"餐补\", \"实习证明\"]','ACTIVE',0,'2026-07-01 15:14:30.699','2026-07-01 15:14:40.236'),('cmr27v1640055gw96epv6c2xn','cmr27v12y000bgw96f4e97fxi','cmr27v12i0000gw969nr5abz3','品牌设计师','FULL_TIME','四川','成都',NULL,NULL,'12k-20k','BACHELOR',3,'负责企业 VI/品牌物料设计，精通 AI/PS，有系统化品牌设计经验。','[\"五险一金\", \"弹性工作\", \"年终奖\"]','ACTIVE',0,'2026-07-01 15:14:30.700','2026-07-01 15:14:30.700'),('cmr27v1650057gw96o0yc6rjd','cmr27v12y000bgw96f4e97fxi','cmr27v12m0004gw96xupqb5kd','采购专员','FULL_TIME','江苏','南京',NULL,NULL,'8k-12k','BACHELOR',2,'负责 IT 设备及耗材采购，有供应链谈判经验，熟悉招投标流程。','[\"五险一金\", \"年终奖\"]','ACTIVE',0,'2026-07-01 15:14:30.701','2026-07-01 15:14:40.237'),('cmr27v1660059gw96k0ioqeii','cmr27v12y000bgw96f4e97fxi','cmr27v12m0004gw96xupqb5kd','全栈工程师','FULL_TIME','上海','上海',NULL,NULL,'12k-20k','BACHELOR',3,'负责电商平台前后端开发，TypeScript + Node.js + React 技术栈。','[\"股票期权\", \"五险一金\", \"弹性工作\"]','ACTIVE',0,'2026-07-01 15:14:30.702','2026-07-01 15:14:40.239'),('cmr27v167005bgw9687z9o835','cmr27v12y000bgw96f4e97fxi','cmr27v12l0001gw96wi8kmah3','运维工程师（云平台）','FULL_TIME','广东','深圳',NULL,NULL,'12k-20k','BACHELOR',2,'负责腾讯云基础设施运维，熟悉 Linux/Ansible/监控体系建设。','[\"五险一金\", \"年终奖\", \"轮班补贴\"]','ACTIVE',0,'2026-07-01 15:14:30.704','2026-07-01 15:14:40.240'),('cmr27v169005dgw96gkqx67p0','cmr27v12y000bgw96f4e97fxi','cmr27v12q0009gw96e3yef3fh','首席技术官助理（实习）','INTERNSHIP','北京','北京',NULL,NULL,'面议','MASTER',0,'协助 CTO 完成技术调研与竞品分析，每周至少 3 天，全程英文沟通。','[\"餐补\", \"导师制\", \"转正机会\"]','ACTIVE',0,'2026-07-01 15:14:30.705','2026-07-01 15:14:40.241'),('cmr27v16a005fgw96xng2rd3p','cmr27v12y000bgw96f4e97fxi','cmr27v12m0005gw96gyax0jpl','销售助理（实习）','INTERNSHIP','上海','上海',NULL,NULL,'面议','BACHELOR',0,'协助销售团队完成客户资料整理与 CRM 录入，市场营销专业优先。','[\"餐补\", \"实习证明\", \"班车\"]','ACTIVE',0,'2026-07-01 15:14:30.707','2026-07-01 15:14:40.243'),('cmr27v16b005hgw9682kb5t0a','cmr27v12y000bgw96f4e97fxi','cmr27v12q0009gw96e3yef3fh','短视频创作者（兼职）','PART_TIME','四川','成都',NULL,NULL,'3k-5k','ANY',0,'为品牌账号产出短视频内容，按条结算，支持异地远程合作。','[\"远程工作\", \"弹性时间\", \"素材支持\"]','ACTIVE',0,'2026-07-01 15:14:30.708','2026-07-01 15:14:40.244'),('cmr27v16d005jgw9612d01oms','cmr27v12y000bgw96f4e97fxi','cmr27v12l0002gw9681nwyhca','电话销售专员（兼职）','PART_TIME','陕西','西安',NULL,NULL,'3k-5k','HIGH_SCHOOL',0,'通过电话开拓潜在用户，每天工作 4 小时，底薪加提成。','[\"提成无上限\", \"灵活时间\"]','ACTIVE',0,'2026-07-01 15:14:30.709','2026-07-01 15:14:40.246'),('cmr27v16e005lgw96oe3dwmdz','cmr27v12y000bgw96f4e97fxi','cmr27v12i0000gw969nr5abz3','生鲜品控专员','FULL_TIME','北京','北京',NULL,NULL,'8k-12k','ASSOCIATE',1,'负责生鲜商品进货质量验收与冷链管理，有食品安全相关证书优先。','[\"五险一金\", \"年终奖\", \"员工优惠\"]','ACTIVE',0,'2026-07-01 15:14:30.710','2026-07-01 15:14:40.247'),('cmr27v16f005ngw96rb27i7ho','cmr27v12y000bgw96f4e97fxi','cmr27v12i0000gw969nr5abz3','骑行配送团队督导','FULL_TIME','广东','广州',NULL,NULL,'5k-8k','HIGH_SCHOOL',2,'负责城市配送团队日常管理与绩效考核，有基层管理经验优先。','[\"五险一金\", \"年终奖\"]','ACTIVE',0,'2026-07-01 15:14:30.712','2026-07-01 15:14:40.249'),('cmr27v16g005pgw96kk2na5sb','cmr27v12y000bgw96f4e97fxi','cmr27v12o0006gw965ap14ubl','保险理赔专员','FULL_TIME','湖北','武汉',NULL,NULL,'5k-8k','BACHELOR',1,'负责个人及企业保险理赔申请受理与审核，有保险从业资格证优先。','[\"五险一金\", \"年终奖\", \"内部培训\"]','ACTIVE',0,'2026-07-01 15:14:30.713','2026-07-01 15:14:40.250'),('cmr27v16i005rgw96cvdbsnyb','cmr27v12y000bgw96f4e97fxi','cmr27v12l0002gw9681nwyhca','教育技术研发工程师','FULL_TIME','北京','北京',NULL,NULL,'12k-20k','BACHELOR',2,'负责在线教育平台技术研发，熟悉直播/点播流媒体技术优先。','[\"股票期权\", \"五险一金\", \"弹性工作\"]','ACTIVE',0,'2026-07-01 15:14:30.714','2026-07-01 15:14:40.251'),('cmr27v16j005tgw9623l1zju0','cmr27v12y000bgw96f4e97fxi','cmr27v12m0004gw96xupqb5kd','仓储运营实习生','INTERNSHIP','北京','北京',NULL,NULL,'面议','ASSOCIATE',0,'协助仓储团队完成货物盘点与系统录入，物流/供应链专业优先。','[\"餐补\", \"实习证明\", \"班车\"]','ACTIVE',0,'2026-07-01 15:14:30.715','2026-07-01 15:14:40.253'),('cmr27v16k005vgw961gsqw7u9','cmr27v12y000bgw96f4e97fxi','cmr27v12q0008gw96831rmegi','AI 绘画设计师（兼职）','PART_TIME','上海','上海',NULL,NULL,'面议','ANY',0,'使用 Stable Diffusion/MidJourney 为游戏/品牌生成概念图，按稿结算。','[\"远程工作\", \"弹性时间\", \"素材支持\"]','ACTIVE',0,'2026-07-01 15:14:30.717','2026-07-01 15:14:40.254'),('cmr29r6hf000de3hdte6iftcp','cmr29r6hb000be3hd4bc7zfsd','cmr29r6gw0000e3hda660m4hq','资深 Vue 前端工程师','FULL_TIME','北京','北京',NULL,NULL,'24k-38k','BACHELOR',4,'负责搜索业务前端架构与性能优化，技术栈 Vue3 + TypeScript + Vite。','[\"股票期权\", \"弹性工作\", \"五险一金\", \"免费三餐\"]','ACTIVE',0,'2026-07-01 16:07:30.195','2026-07-01 16:07:30.195'),('cmr29r6hi000fe3hdslfn9489','cmr29r6hb000be3hd4bc7zfsd','cmr29r6gw0000e3hda660m4hq','Java 后端开发工程师','FULL_TIME','北京','北京',NULL,NULL,'20k-36k','BACHELOR',3,'参与广告投放系统后端开发，掌握 Spring Cloud 微服务架构。','[\"年终奖\", \"五险一金\", \"健康保险\", \"带薪年假\"]','ACTIVE',0,'2026-07-01 16:07:30.198','2026-07-01 16:07:30.198'),('cmr29r6hj000he3hdb7ik806y','cmr29r6hb000be3hd4bc7zfsd','cmr29r6h10006e3hdioyohuoy','大数据平台工程师','FULL_TIME','上海','上海',NULL,NULL,'20k-34k','BACHELOR',3,'负责实时计算平台建设与维护，熟悉 Flink/Kafka/ClickHouse。','[\"股票期权\", \"弹性工作\", \"五险一金\", \"交通补贴\"]','ACTIVE',0,'2026-07-01 16:07:30.200','2026-07-01 16:07:30.200'),('cmr29r6hl000je3hdstqw7d4b','cmr29r6hb000be3hd4bc7zfsd','cmr29r6gw0000e3hda660m4hq','搜索算法架构师','FULL_TIME','北京','北京',NULL,NULL,'38k-65k','MASTER',6,'主导搜索排序核心系统架构设计，熟悉大规模检索与排序模型。','[\"股票期权\", \"年终奖\", \"五险一金\", \"住房补贴\"]','ACTIVE',0,'2026-07-01 16:07:30.201','2026-07-01 16:07:30.201'),('cmr29r6hm000le3hd2q5busv5','cmr29r6hb000be3hd4bc7zfsd','cmr29r6h10005e3hdra370tft','Android 应用开发工程师','FULL_TIME','北京','北京',NULL,NULL,'18k-30k','BACHELOR',2,'负责短视频 App 的 Android 端功能开发与体验优化。','[\"股票期权\", \"弹性工作\", \"五险一金\", \"班车\"]','ACTIVE',0,'2026-07-01 16:07:30.202','2026-07-01 16:07:30.202'),('cmr29r6hn000ne3hd1v90101n','cmr29r6hb000be3hd4bc7zfsd','cmr29r6h10007e3hdalxm2h7u','iOS 客户端工程师','FULL_TIME','上海','上海',NULL,NULL,'18k-32k','BACHELOR',2,'负责视频社区 iOS 端研发，熟悉 Swift/OC 与音视频技术。','[\"股票期权\", \"弹性工作\", \"五险一金\", \"免费体检\"]','ACTIVE',0,'2026-07-01 16:07:30.204','2026-07-01 16:07:30.204'),('cmr29r6hp000pe3hdzmv4wglw','cmr29r6hb000be3hd4bc7zfsd','cmr29r6h10005e3hdra370tft','推荐算法工程师','FULL_TIME','北京','北京',NULL,NULL,'30k-56k','MASTER',2,'负责短视频推荐算法研究与落地，有召回/排序模型经验优先。','[\"股票期权\", \"年终奖\", \"弹性工作\", \"五险一金\"]','ACTIVE',0,'2026-07-01 16:07:30.205','2026-07-01 16:07:30.205'),('cmr29r6hq000re3hdvod1ucdg','cmr29r6hb000be3hd4bc7zfsd','cmr29r6h20008e3hdxthwbj6u','深度学习工程师','FULL_TIME','广东','深圳',NULL,NULL,'28k-52k','MASTER',2,'负责无人机视觉感知模型工程化，熟悉 PyTorch/TensorRT。','[\"股票期权\", \"五险一金\", \"技术培训\", \"年终奖\"]','ACTIVE',0,'2026-07-01 16:07:30.206','2026-07-01 16:07:30.206'),('cmr29r6hr000te3hd2h2nduip','cmr29r6hb000be3hd4bc7zfsd','cmr29r6h20008e3hdxthwbj6u','嵌入式开发工程师','FULL_TIME','广东','深圳',NULL,NULL,'16k-28k','BACHELOR',2,'负责飞控系统固件开发，熟悉 C/C++，有 RTOS 经验优先。','[\"年终奖\", \"五险一金\", \"带薪年假\"]','ACTIVE',0,'2026-07-01 16:07:30.207','2026-07-01 16:07:30.207'),('cmr29r6hs000ve3hdyngrd0sd','cmr29r6hb000be3hd4bc7zfsd','cmr29r6h00001e3hdyj56ekjv','信息安全工程师','FULL_TIME','北京','北京',NULL,NULL,'20k-36k','BACHELOR',3,'负责业务安全防护与漏洞挖掘，有 CISP/OSCP 证书优先。','[\"年终奖\", \"五险一金\", \"专项培训\"]','ACTIVE',0,'2026-07-01 16:07:30.209','2026-07-01 16:07:30.209'),('cmr29r6ht000xe3hd3vs3iups','cmr29r6hb000be3hd4bc7zfsd','cmr29r6h10006e3hdioyohuoy','产品经理（交易平台）','FULL_TIME','上海','上海',NULL,NULL,'20k-32k','BACHELOR',3,'负责电商交易链路产品设计，有支付/订单系统经验优先。','[\"股票期权\", \"五险一金\", \"弹性工作\"]','ACTIVE',0,'2026-07-01 16:07:30.210','2026-07-01 16:07:30.210'),('cmr29r6hv000ze3hdqlhqsshk','cmr29r6hb000be3hd4bc7zfsd','cmr29r6h10005e3hdra370tft','用户运营专员','FULL_TIME','北京','北京',NULL,NULL,'10k-16k','BACHELOR',2,'负责社区用户拉新与留存活动运营，熟悉数据分析工具。','[\"五险一金\", \"年终奖\", \"餐补\"]','ACTIVE',0,'2026-07-01 16:07:30.211','2026-07-01 16:07:30.211'),('cmr29r6hw0011e3hdjijsybb1','cmr29r6hb000be3hd4bc7zfsd','cmr29r6h10007e3hdalxm2h7u','内容生态运营经理','FULL_TIME','上海','上海',NULL,NULL,'16k-26k','BACHELOR',3,'负责 UP 主生态运营与激励体系建设，熟悉内容社区玩法。','[\"股票期权\", \"五险一金\", \"弹性工作\", \"远程办公\"]','ACTIVE',0,'2026-07-01 16:07:30.212','2026-07-01 16:07:30.212'),('cmr29r6hx0013e3hd3en0xm7s','cmr29r6hb000be3hd4bc7zfsd','cmr29r6h00001e3hdyj56ekjv','品牌市场经理','FULL_TIME','北京','北京',NULL,NULL,'16k-24k','BACHELOR',3,'负责智能硬件品牌营销策划与执行，有 3C 数码行业经验优先。','[\"五险一金\", \"年终奖\", \"出差补贴\"]','ACTIVE',0,'2026-07-01 16:07:30.214','2026-07-01 16:07:30.214'),('cmr29r6hz0015e3hd7pulv4nl','cmr29r6hb000be3hd4bc7zfsd','cmr29r6h10006e3hdioyohuoy','平台运营专员','FULL_TIME','上海','上海',NULL,NULL,'8k-14k','ASSOCIATE',1,'负责拼团活动日常运营，有电商平台操作经验。','[\"五险一金\", \"年终奖\"]','ACTIVE',0,'2026-07-01 16:07:30.215','2026-07-01 16:07:30.215'),('cmr29r6i00017e3hdon6iuler','cmr29r6hb000be3hd4bc7zfsd','cmr29r6h00001e3hdyj56ekjv','资深 UI/UX 设计师','FULL_TIME','北京','北京',NULL,NULL,'18k-28k','BACHELOR',4,'负责手机系统 UI 与交互设计，精通 Figma，有系统化设计经验。','[\"弹性工作\", \"五险一金\", \"年终奖\"]','ACTIVE',0,'2026-07-01 16:07:30.217','2026-07-01 16:07:30.217'),('cmr29r6i10019e3hdm47k874x','cmr29r6hb000be3hd4bc7zfsd','cmr29r6h10007e3hdalxm2h7u','游戏角色原画师','FULL_TIME','上海','上海',NULL,NULL,'12k-22k','ANY',2,'负责二次元游戏角色/场景原画设计，精通 PS/SAI，有作品集优先。','[\"弹性工作\", \"五险一金\", \"作品版权保留\"]','ACTIVE',0,'2026-07-01 16:07:30.218','2026-07-01 16:07:30.218'),('cmr29r6i3001be3hd2jna6qor','cmr29r6hb000be3hd4bc7zfsd','cmr29r6h10005e3hdra370tft','动效设计师','FULL_TIME','北京','北京',NULL,NULL,'12k-20k','ANY',2,'负责 App 内动效与短视频特效设计，熟悉 AE/C4D。','[\"弹性工作\", \"五险一金\", \"技术沙龙\"]','ACTIVE',0,'2026-07-01 16:07:30.219','2026-07-01 16:07:30.219'),('cmr29r6i4001de3hd4cxcx3fi','cmr29r6hb000be3hd4bc7zfsd','cmr29r6h10006e3hdioyohuoy','数据分析师','FULL_TIME','上海','上海',NULL,NULL,'12k-20k','BACHELOR',1,'负责电商业务数据分析，支持运营决策，熟悉 SQL/Python/Tableau。','[\"五险一金\", \"年终奖\", \"弹性工作\"]','ACTIVE',0,'2026-07-01 16:07:30.220','2026-07-01 16:07:30.220'),('cmr29r6i5001fe3hdk0eirokm','cmr29r6hb000be3hd4bc7zfsd','cmr29r6h30009e3hd2au6ng1e','风险量化分析师','FULL_TIME','北京','北京',NULL,NULL,'20k-38k','MASTER',2,'负责信贷风险建模，熟悉 SAS/Python，有金融工程背景优先。','[\"五险一金\", \"专业培训\", \"年终奖\"]','ACTIVE',0,'2026-07-01 16:07:30.222','2026-07-01 16:07:30.222'),('cmr29r6i6001he3hdne1vj7lc','cmr29r6hb000be3hd4bc7zfsd','cmr29r6gw0000e3hda660m4hq','商业智能（BI）工程师','FULL_TIME','北京','北京',NULL,NULL,'18k-28k','BACHELOR',2,'负责 BI 报表开发及数据可视化平台建设，熟悉 Power BI/Tableau。','[\"五险一金\", \"年终奖\", \"带薪学习\"]','ACTIVE',0,'2026-07-01 16:07:30.223','2026-07-01 16:07:30.223'),('cmr29r6i7001je3hd83pg79fw','cmr29r6hb000be3hd4bc7zfsd','cmr29r6gw0000e3hda660m4hq','企业销售经理（华北）','FULL_TIME','北京','北京',NULL,NULL,'12k-20k','BACHELOR',3,'负责华北地区企业客户开拓与维护，有云服务/广告销售经验优先。','[\"提成无上限\", \"五险一金\", \"出差补贴\"]','ACTIVE',0,'2026-07-01 16:07:30.224','2026-07-01 16:07:30.224'),('cmr29r6i9001le3hdphg6alje','cmr29r6hb000be3hd4bc7zfsd','cmr29r6h10006e3hdioyohuoy','客户成功经理','FULL_TIME','上海','上海',NULL,NULL,'10k-18k','BACHELOR',2,'负责商家 SaaS 产品使用培训与续约，降低客户流失率。','[\"五险一金\", \"年终奖\", \"弹性工作\"]','ACTIVE',0,'2026-07-01 16:07:30.225','2026-07-01 16:07:30.225'),('cmr29r6ia001ne3hd2qbec72d','cmr29r6hb000be3hd4bc7zfsd','cmr29r6h10006e3hdioyohuoy','高级客服专员','FULL_TIME','四川','成都',NULL,NULL,'6k-10k','ASSOCIATE',1,'负责处理电商平台客户投诉及售后，熟悉 CRM 系统。','[\"五险一金\", \"年终奖\", \"餐补\"]','ACTIVE',0,'2026-07-01 16:07:30.226','2026-07-01 16:07:30.226'),('cmr29r6ib001pe3hd92x7cpik','cmr29r6hb000be3hd4bc7zfsd','cmr29r6h30009e3hd2au6ng1e','理财顾问','FULL_TIME','北京','北京',NULL,NULL,'8k-18k','BACHELOR',1,'为高净值客户提供个人理财规划，有基金/保险从业资格证优先。','[\"提成\", \"五险一金\", \"节日福利\"]','ACTIVE',0,'2026-07-01 16:07:30.227','2026-07-01 16:07:30.227'),('cmr29r6ic001re3hdmogjc84y','cmr29r6hb000be3hd4bc7zfsd','cmr29r6h30009e3hd2au6ng1e','对公客户经理','FULL_TIME','上海','上海',NULL,NULL,'9k-16k','BACHELOR',1,'负责对公信贷业务拓展与授信管理，完成月度业务指标。','[\"提成\", \"五险一金\", \"年终奖\"]','ACTIVE',0,'2026-07-01 16:07:30.229','2026-07-01 16:07:30.229'),('cmr29r6id001te3hd8j6wfgzd','cmr29r6hb000be3hd4bc7zfsd','cmr29r6h10002e3hdtygfuqkc','保险风控分析师','FULL_TIME','上海','上海',NULL,NULL,'12k-20k','BACHELOR',2,'负责承保风险评估与理赔风控，有精算或数据分析经验。','[\"五险一金\", \"年终奖\", \"专业培训\"]','ACTIVE',0,'2026-07-01 16:07:30.230','2026-07-01 16:07:30.230'),('cmr29r6if001ve3hdxx38ihsz','cmr29r6hb000be3hd4bc7zfsd','cmr29r6h10003e3hdssux3oj1','数学课程顾问','FULL_TIME','北京','北京',NULL,NULL,'8k-16k','BACHELOR',0,'负责向家长介绍数学培训课程，完成招生任务，有教育行业销售经验优先。','[\"提成无上限\", \"五险一金\", \"内部培训\"]','ACTIVE',0,'2026-07-01 16:07:30.232','2026-07-01 16:07:30.232'),('cmr29r6ih001xe3hdtlcbkbd0','cmr29r6hb000be3hd4bc7zfsd','cmr29r6h10003e3hdssux3oj1','在线教育产品经理','FULL_TIME','北京','北京',NULL,NULL,'15k-25k','BACHELOR',3,'负责在线直播课 App 产品规划，有 K12 教育产品经验优先。','[\"股票期权\", \"五险一金\", \"弹性工作\"]','ACTIVE',0,'2026-07-01 16:07:30.233','2026-07-01 16:07:30.233'),('cmr29r6ii001ze3hd2nannoyw','cmr29r6hb000be3hd4bc7zfsd','cmr29r6h10003e3hdssux3oj1','教研内容设计师','FULL_TIME','北京','北京',NULL,NULL,'10k-16k','BACHELOR',2,'负责 K12 英语课程内容研发与质量管控，师范类专业优先。','[\"五险一金\", \"年终奖\", \"带薪培训\"]','ACTIVE',0,'2026-07-01 16:07:30.234','2026-07-01 16:07:30.234'),('cmr29r6ij0021e3hdja5hvq2x','cmr29r6hb000be3hd4bc7zfsd','cmr29r6gw0000e3hda660m4hq','HR 招聘专员','FULL_TIME','北京','北京',NULL,NULL,'7k-12k','BACHELOR',1,'负责研发岗位简历筛选与面试安排，有互联网招聘经验优先。','[\"五险一金\", \"年终奖\", \"弹性工作\"]','ACTIVE',0,'2026-07-01 16:07:30.235','2026-07-01 16:07:30.235'),('cmr29r6ik0023e3hd7f5h7i1w','cmr29r6hb000be3hd4bc7zfsd','cmr29r6h00001e3hdyj56ekjv','HRBP（人力资源业务伙伴）','FULL_TIME','北京','北京',NULL,NULL,'15k-25k','BACHELOR',4,'支持业务部门 HR 策略落地，熟悉绩效管理与组织发展。','[\"股票期权\", \"五险一金\", \"弹性工作\"]','ACTIVE',0,'2026-07-01 16:07:30.236','2026-07-01 16:07:30.236'),('cmr29r6il0025e3hdajg9y38t','cmr29r6hb000be3hd4bc7zfsd','cmr29r6h20008e3hdxthwbj6u','行政助理','FULL_TIME','广东','深圳',NULL,NULL,'5k-8k','ASSOCIATE',0,'协助部门日常行政事务，会议安排、差旅报销、物资管理等。','[\"五险一金\", \"年终奖\", \"节日福利\"]','ACTIVE',0,'2026-07-01 16:07:30.238','2026-07-01 16:07:30.238'),('cmr29r6im0027e3hd1omhc78d','cmr29r6hb000be3hd4bc7zfsd','cmr29r6h10006e3hdioyohuoy','法务专员','FULL_TIME','上海','上海',NULL,NULL,'10k-18k','BACHELOR',2,'负责公司合同审核及法律合规工作，法律专业背景，有律师资格证优先。','[\"五险一金\", \"年终奖\", \"带薪年假\"]','ACTIVE',0,'2026-07-01 16:07:30.239','2026-07-01 16:07:30.239'),('cmr29r6io0029e3hd3a9xbvni','cmr29r6hb000be3hd4bc7zfsd','cmr29r6h10002e3hdtygfuqkc','财务分析经理','FULL_TIME','上海','上海',NULL,NULL,'18k-30k','BACHELOR',5,'负责集团财务规划与经营分析，有 CPA/CFA 证书优先。','[\"五险一金\", \"年终奖\", \"绩效奖金\"]','ACTIVE',0,'2026-07-01 16:07:30.240','2026-07-01 16:07:30.240'),('cmr29r6ip002be3hd85zpnlkb','cmr29r6hb000be3hd4bc7zfsd','cmr29r6h10006e3hdioyohuoy','供应链管理专员','FULL_TIME','上海','上海',NULL,NULL,'10k-16k','BACHELOR',2,'负责采购计划制定与供应商管理，有 ERP 系统使用经验。','[\"五险一金\", \"年终奖\", \"员工优惠\"]','ACTIVE',0,'2026-07-01 16:07:30.241','2026-07-01 16:07:30.241'),('cmr29r6iq002de3hdmue4depp','cmr29r6hb000be3hd4bc7zfsd','cmr29r6h10006e3hdioyohuoy','仓储物流主管','FULL_TIME','湖北','武汉',NULL,NULL,'8k-14k','ASSOCIATE',3,'负责仓库日常管理与物流配送协调，有大型仓储管理经验。','[\"五险一金\", \"年终奖\", \"班车\"]','ACTIVE',0,'2026-07-01 16:07:30.242','2026-07-01 16:07:30.242'),('cmr29r6ir002fe3hdztw95gcy','cmr29r6hb000be3hd4bc7zfsd','cmr29r6h10007e3hdalxm2h7u','游戏策划师（系统）','FULL_TIME','上海','上海',NULL,NULL,'12k-22k','BACHELOR',2,'负责游戏系统玩法设计与平衡性调整，有二次元项目经验优先。','[\"弹性工作\", \"五险一金\", \"游戏内部测试福利\"]','ACTIVE',0,'2026-07-01 16:07:30.244','2026-07-01 16:07:30.244'),('cmr29r6is002he3hds5bykal1','cmr29r6hb000be3hd4bc7zfsd','cmr29r6h10005e3hdra370tft','游戏后端工程师','FULL_TIME','北京','北京',NULL,NULL,'20k-35k','BACHELOR',3,'负责游戏后端服务开发，C++/Go 为主，熟悉 Redis/MySQL 等。','[\"弹性工作\", \"五险一金\", \"年终奖\"]','ACTIVE',0,'2026-07-01 16:07:30.245','2026-07-01 16:07:30.245'),('cmr29r6iu002je3hd2dz5h6x9','cmr29r6hb000be3hd4bc7zfsd','cmr29r6h20008e3hdxthwbj6u','测试工程师（自动化）','FULL_TIME','广东','深圳',NULL,NULL,'14k-22k','BACHELOR',2,'负责功能测试与自动化框架建设，熟悉 Selenium/Appium/JMeter。','[\"五险一金\", \"年终奖\", \"弹性工作\"]','ACTIVE',0,'2026-07-01 16:07:30.246','2026-07-01 16:07:30.246'),('cmr29r6iv002le3hdrofmsp0a','cmr29r6hb000be3hd4bc7zfsd','cmr29r6gw0000e3hda660m4hq','DevOps 工程师','FULL_TIME','北京','北京',NULL,NULL,'18k-32k','BACHELOR',3,'负责 CI/CD 流程建设与云基础设施运维，熟悉 Kubernetes/Docker/Terraform。','[\"股票期权\", \"五险一金\", \"弹性工作\"]','ACTIVE',0,'2026-07-01 16:07:30.247','2026-07-01 16:07:30.247'),('cmr29r6iw002ne3hdo1wv8pqg','cmr29r6hb000be3hd4bc7zfsd','cmr29r6h00001e3hdyj56ekjv','技术支持工程师','FULL_TIME','江苏','南京',NULL,NULL,'8k-14k','ASSOCIATE',1,'负责为客户提供产品使用及故障排查技术支持，有一线技术支持经验。','[\"五险一金\", \"年终奖\"]','ACTIVE',0,'2026-07-01 16:07:30.249','2026-07-01 16:07:30.249'),('cmr29r6ix002pe3hd0dp2kgx3','cmr29r6hb000be3hd4bc7zfsd','cmr29r6gw0000e3hda660m4hq','售前解决方案工程师','FULL_TIME','四川','成都',NULL,NULL,'15k-25k','BACHELOR',3,'支持企业级客户投标方案制作与技术演示，熟悉云计算/AI 方向。','[\"五险一金\", \"差旅补贴\", \"年终奖\"]','ACTIVE',0,'2026-07-01 16:07:30.250','2026-07-01 16:07:30.250'),('cmr29r6iy002re3hdjc8e87v7','cmr29r6hb000be3hd4bc7zfsd','cmr29r6h20008e3hdxthwbj6u','项目经理（PMP）','FULL_TIME','广东','深圳',NULL,NULL,'18k-30k','BACHELOR',4,'负责智能硬件研发项目管理，有 PMP/PMI-ACP 证书优先。','[\"五险一金\", \"年终奖\", \"弹性工作\"]','ACTIVE',0,'2026-07-01 16:07:30.251','2026-07-01 16:07:30.251'),('cmr29r6j0002te3hdvlhjeklc','cmr29r6hb000be3hd4bc7zfsd','cmr29r6gw0000e3hda660m4hq','云计算架构师','FULL_TIME','北京','北京',NULL,NULL,'35k-60k','BACHELOR',6,'负责企业级云方案设计，熟悉百度云/AWS/阿里云产品体系。','[\"股票期权\", \"年终奖\", \"五险一金\"]','ACTIVE',0,'2026-07-01 16:07:30.252','2026-07-01 16:07:30.252'),('cmr29r6j1002ve3hdn1udged7','cmr29r6hb000be3hd4bc7zfsd','cmr29r6h00001e3hdyj56ekjv','小程序开发工程师','FULL_TIME','北京','北京',NULL,NULL,'16k-28k','BACHELOR',2,'负责小程序/H5 开发，熟悉 UniApp/Taro 优先。','[\"股票期权\", \"五险一金\", \"弹性工作\"]','ACTIVE',0,'2026-07-01 16:07:30.253','2026-07-01 16:07:30.253'),('cmr29r6j2002xe3hdhibx940d','cmr29r6hb000be3hd4bc7zfsd','cmr29r6h10005e3hdra370tft','软件研发工程师','FULL_TIME','四川','成都',NULL,NULL,'12k-20k','BACHELOR',1,'参与公司 SaaS 产品后端开发，Java/Spring Boot 技术栈。','[\"五险一金\", \"年终奖\", \"弹性工作\"]','ACTIVE',0,'2026-07-01 16:07:30.254','2026-07-01 16:07:30.254'),('cmr29r6j3002ze3hd3kt2db2j','cmr29r6hb000be3hd4bc7zfsd','cmr29r6h10005e3hdra370tft','数据工程师','FULL_TIME','四川','成都',NULL,NULL,'14k-22k','BACHELOR',2,'负责数据管道建设与数仓开发，熟悉 Spark/Airflow/Kafka。','[\"五险一金\", \"年终奖\", \"弹性工作\"]','ACTIVE',0,'2026-07-01 16:07:30.256','2026-07-01 16:07:30.256'),('cmr29r6j50031e3hd2q95fnob','cmr29r6hb000be3hd4bc7zfsd','cmr29r6h00001e3hdyj56ekjv','前端开发工程师','FULL_TIME','陕西','西安',NULL,NULL,'10k-18k','BACHELOR',1,'Vue3 + TypeScript 开发企业管理后台，参与组件库建设。','[\"五险一金\", \"年终奖\", \"弹性工作\"]','ACTIVE',0,'2026-07-01 16:07:30.257','2026-07-01 16:07:30.257'),('cmr29r6j60033e3hd9bslbsj6','cmr29r6hb000be3hd4bc7zfsd','cmr29r6h00001e3hdyj56ekjv','Python 后端工程师','FULL_TIME','江苏','南京',NULL,NULL,'15k-25k','BACHELOR',2,'负责 AI 平台后端 API 开发，Django/FastAPI 技术栈。','[\"五险一金\", \"年终奖\", \"技术培训\"]','ACTIVE',0,'2026-07-01 16:07:30.258','2026-07-01 16:07:30.258'),('cmr29r6j70035e3hdswdlk5dw','cmr29r6hb000be3hd4bc7zfsd','cmr29r6h10002e3hdtygfuqkc','区块链开发工程师','FULL_TIME','上海','上海',NULL,NULL,'25k-45k','BACHELOR',3,'负责金融科技区块链平台开发，熟悉 Solidity/Go。','[\"股票期权\", \"五险一金\", \"年终奖\"]','ACTIVE',0,'2026-07-01 16:07:30.259','2026-07-01 16:07:30.259'),('cmr29r6j80037e3hdj20mntrh','cmr29r6hb000be3hd4bc7zfsd','cmr29r6h10002e3hdtygfuqkc','保险精算师（助理）','FULL_TIME','上海','上海',NULL,NULL,'15k-30k','MASTER',0,'负责寿险/健康险产品定价，有精算师考试通过经历优先。','[\"五险一金\", \"年终奖\", \"考试费用报销\"]','ACTIVE',0,'2026-07-01 16:07:30.260','2026-07-01 16:07:30.260'),('cmr29r6j90039e3hdq8s54ajm','cmr29r6hb000be3hd4bc7zfsd','cmr29r6h10006e3hdioyohuoy','直播运营专员','FULL_TIME','广东','广州',NULL,NULL,'8k-15k','ANY',1,'负责直播间选品、主播管理及实时运营互动，有电商直播经验优先。','[\"五险一金\", \"提成\", \"免费试用产品\"]','ACTIVE',0,'2026-07-01 16:07:30.262','2026-07-01 16:07:30.262'),('cmr29r6ja003be3hdxoqo69z7','cmr29r6hb000be3hd4bc7zfsd','cmr29r6h10005e3hdra370tft','新媒体运营经理','FULL_TIME','北京','北京',NULL,NULL,'12k-20k','BACHELOR',3,'负责抖音/微博/微信公众号账号矩阵运营，有 10W+ 爆文经验优先。','[\"股票期权\", \"五险一金\", \"弹性工作\"]','ACTIVE',0,'2026-07-01 16:07:30.263','2026-07-01 16:07:30.263'),('cmr29r6jc003de3hdqmn4o04o','cmr29r6hb000be3hd4bc7zfsd','cmr29r6h10006e3hdioyohuoy','SEO 优化专员','FULL_TIME','上海','上海',NULL,NULL,'7k-12k','ANY',1,'负责电商平台商品搜索排名优化，有跨境电商 SEO 经验优先。','[\"五险一金\", \"年终奖\"]','ACTIVE',0,'2026-07-01 16:07:30.264','2026-07-01 16:07:30.264'),('cmr29r6jd003fe3hdxusq02ty','cmr29r6hb000be3hd4bc7zfsd','cmr29r6h20008e3hdxthwbj6u','国际贸易专员','FULL_TIME','广东','深圳',NULL,NULL,'8k-14k','BACHELOR',1,'负责跨境业务海外商家招募与支持，英语流利。','[\"五险一金\", \"年终奖\", \"出国机会\"]','ACTIVE',0,'2026-07-01 16:07:30.265','2026-07-01 16:07:30.265'),('cmr29r6je003he3hdnmzl45h7','cmr29r6hb000be3hd4bc7zfsd','cmr29r6h10003e3hdssux3oj1','在线数学家教（兼职）','PART_TIME','北京','北京',NULL,NULL,'150-300元/小时','BACHELOR',0,'为 K12 学生提供在线数学辅导，有教学经验或竞赛获奖者优先。','[\"灵活排班\", \"远程上课\"]','ACTIVE',0,'2026-07-01 16:07:30.266','2026-07-01 16:07:30.266'),('cmr29r6jf003je3hdpe0aitix','cmr29r6hb000be3hd4bc7zfsd','cmr29r6h10006e3hdioyohuoy','兼职产品摄影师','PART_TIME','上海','上海',NULL,NULL,'500-1500元/天','ANY',0,'为电商产品拍摄棚拍及外拍图片，有商业摄影作品集。','[\"灵活接单\", \"设备补贴\"]','ACTIVE',0,'2026-07-01 16:07:30.268','2026-07-01 16:07:30.268'),('cmr29r6jg003le3hd2vhc80jm','cmr29r6hb000be3hd4bc7zfsd','cmr29r6h10002e3hdtygfuqkc','市场调研员（兼职）','PART_TIME','北京','北京',NULL,NULL,'120-200元/天','ANY',0,'按计划完成指定地点的市场调研与访谈任务，按单结算。','[\"灵活时间\", \"交通补贴\"]','ACTIVE',0,'2026-07-01 16:07:30.269','2026-07-01 16:07:30.269'),('cmr29r6jh003ne3hdhproxf9r','cmr29r6hb000be3hd4bc7zfsd','cmr29r6gw0000e3hda660m4hq','数据标注员（兼职）','PART_TIME','四川','成都',NULL,NULL,'4k-7k','HIGH_SCHOOL',0,'完成图像/语音/文本标注任务，支持远程居家办公。','[\"灵活上班\", \"远程办公\"]','ACTIVE',2,'2026-07-01 16:07:30.270','2026-07-01 16:17:22.612'),('cmr29r6jj003pe3hdlfsg00id','cmr29r6hb000be3hd4bc7zfsd','cmr29r6h10005e3hdra370tft','视频剪辑（兼职）','PART_TIME','北京','北京',NULL,NULL,'6k-12k','ANY',1,'负责短视频及直播切片剪辑，熟悉 Premiere/剪映，接项目计酬。','[\"远程工作\", \"弹性排班\"]','ACTIVE',0,'2026-07-01 16:07:30.271','2026-07-01 16:07:30.271'),('cmr29r6jk003re3hd645yab2e','cmr29r6hb000be3hd4bc7zfsd','cmr29r6h20008e3hdxthwbj6u','翻译（兼职/英日韩）','PART_TIME','广东','深圳',NULL,NULL,'100-200元/千字','BACHELOR',0,'承接技术文档/法律合同翻译，英语/日语/韩语方向均有需求。','[\"远程工作\", \"弹性时间\"]','ACTIVE',0,'2026-07-01 16:07:30.272','2026-07-01 16:07:30.272'),('cmr29r6jl003te3hdz90q5v5a','cmr29r6hb000be3hd4bc7zfsd','cmr29r6h10003e3hdssux3oj1','社群运营助手（兼职）','PART_TIME','北京','北京',NULL,NULL,'3k-6k','ANY',0,'协助管理微信社群，每日推送内容及回答用户问题，每天 2-3 小时。','[\"远程工作\", \"灵活时间\"]','ACTIVE',0,'2026-07-01 16:07:30.273','2026-07-01 16:07:30.273'),('cmr29r6jm003ve3hd0dfxt05h','cmr29r6hb000be3hd4bc7zfsd','cmr29r6h10006e3hdioyohuoy','Python 脚本开发（兼职）','PART_TIME','湖北','武汉',NULL,NULL,'5k-10k','ANY',1,'按需开发数据采集/处理脚本，项目制合作，100% 远程。','[\"远程工作\", \"弹性合作\"]','ACTIVE',0,'2026-07-01 16:07:30.274','2026-07-01 16:07:30.274'),('cmr29r6jn003xe3hd1l2h1n49','cmr29r6hb000be3hd4bc7zfsd','cmr29r6h10007e3hdalxm2h7u','平面设计（兼职）','PART_TIME','上海','上海',NULL,NULL,'4k-8k','ANY',1,'协助设计部门完成日常海报/Banner 设计，熟悉 Photoshop/Illustrator。','[\"远程工作\", \"弹性上班\"]','ACTIVE',0,'2026-07-01 16:07:30.276','2026-07-01 16:07:30.276'),('cmr29r6jo003ze3hd0hmo6b04','cmr29r6hb000be3hd4bc7zfsd','cmr29r6h10003e3hdssux3oj1','英语口语陪练（兼职）','PART_TIME','北京','北京',NULL,NULL,'80-150元/小时','BACHELOR',0,'为成人学员提供英语口语 1v1 对话练习，母语/海外留学背景优先。','[\"远程上课\", \"弹性时间\"]','ACTIVE',0,'2026-07-01 16:07:30.277','2026-07-01 16:07:30.277'),('cmr29r6jp0041e3hdk88c1pwi','cmr29r6hb000be3hd4bc7zfsd','cmr29r6h10003e3hdssux3oj1','兼职物理讲师','PART_TIME','北京','北京',NULL,NULL,'150-300元/小时','BACHELOR',0,'为初高中生提供物理线上辅导，物理/理工科专业在读优先。','[\"灵活排班\", \"远程授课\"]','ACTIVE',0,'2026-07-01 16:07:30.278','2026-07-01 16:07:30.278'),('cmr29r6jr0043e3hdu77sexy2','cmr29r6hb000be3hd4bc7zfsd','cmr29r6h10002e3hdtygfuqkc','财务记账（兼职）','PART_TIME','上海','上海',NULL,NULL,'500-2000元/月','ASSOCIATE',1,'为中小企业提供代账服务，每月工作量约 10-20 小时，远程完成。','[\"远程工作\", \"灵活时间\"]','ACTIVE',0,'2026-07-01 16:07:30.279','2026-07-01 16:07:30.279'),('cmr29r6js0045e3hdpgjetvzi','cmr29r6hb000be3hd4bc7zfsd','cmr29r6h10002e3hdtygfuqkc','问卷调查员（兼职）','PART_TIME','陕西','西安',NULL,NULL,'80-150元/天','ANY',0,'按要求完成线上或线下问卷调查任务，按完成数量结算。','[\"灵活时间\", \"交通补贴\"]','ACTIVE',0,'2026-07-01 16:07:30.280','2026-07-01 16:07:30.280'),('cmr29r6jt0047e3hdxwwb9bth','cmr29r6hb000be3hd4bc7zfsd','cmr29r6h00001e3hdyj56ekjv','产品测试体验官（兼职）','PART_TIME','四川','成都',NULL,NULL,'1k-3k','ANY',0,'体验测试新功能并提交反馈报告，每月约 10 小时，远程参与。','[\"远程工作\", \"免费使用产品\"]','ACTIVE',3,'2026-07-01 16:07:30.281','2026-07-01 16:18:27.854'),('cmr29r6ju0049e3hdgfkmggt5','cmr29r6hb000be3hd4bc7zfsd','cmr29r6gw0000e3hda660m4hq','前端开发实习生','INTERNSHIP','北京','北京',NULL,NULL,'200-250元/天','ASSOCIATE',0,'参与商业化产品前端开发，Vue3 技术栈，每周至少 4 天到岗。','[\"五险\", \"餐补\", \"转正机会\"]','ACTIVE',0,'2026-07-01 16:07:30.283','2026-07-01 16:07:30.283'),('cmr29r6jv004be3hduxf10b7b','cmr29r6hb000be3hd4bc7zfsd','cmr29r6h10005e3hdra370tft','后端开发实习生','INTERNSHIP','北京','北京',NULL,NULL,'180-240元/天','ASSOCIATE',0,'参与短视频系统后端开发，Java/Go 任一，每周至少 4 天。','[\"五险\", \"餐补\", \"转正机会\"]','ACTIVE',0,'2026-07-01 16:07:30.284','2026-07-01 16:07:30.284'),('cmr29r6jw004de3hdyn7o1uy6','cmr29r6hb000be3hd4bc7zfsd','cmr29r6h10006e3hdioyohuoy','数据分析实习生','INTERNSHIP','上海','上海',NULL,NULL,'180-220元/天','ASSOCIATE',0,'协助业务数据分析工作，熟悉 Python/SQL，在校本科/研究生。','[\"五险\", \"餐补\", \"实习证明\"]','ACTIVE',0,'2026-07-01 16:07:30.285','2026-07-01 16:07:30.285'),('cmr29r6jx004fe3hdpuxd5yt0','cmr29r6hb000be3hd4bc7zfsd','cmr29r6h10005e3hdra370tft','产品经理实习生','INTERNSHIP','北京','北京',NULL,NULL,'160-220元/天','BACHELOR',0,'参与内容社区产品需求分析与原型设计，有互联网实习经历优先。','[\"五险\", \"餐补\", \"导师制\"]','ACTIVE',0,'2026-07-01 16:07:30.286','2026-07-01 16:07:30.286'),('cmr29r6jz004he3hd68afte2v','cmr29r6hb000be3hd4bc7zfsd','cmr29r6h10007e3hdalxm2h7u','UI 设计实习生','INTERNSHIP','上海','上海',NULL,NULL,'150-200元/天','ANY',0,'协助设计师完成界面设计稿输出，熟悉 Figma，有作品集。','[\"餐补\", \"设计资源\", \"实习证明\"]','ACTIVE',0,'2026-07-01 16:07:30.287','2026-07-01 16:07:30.287'),('cmr29r6k0004je3hdn7idlk24','cmr29r6hb000be3hd4bc7zfsd','cmr29r6h10006e3hdioyohuoy','运营实习生','INTERNSHIP','上海','上海',NULL,NULL,'140-180元/天','BACHELOR',0,'协助商家运营团队完成日常数据监控与活动执行。','[\"餐补\", \"班车\", \"转正机会\"]','ACTIVE',0,'2026-07-01 16:07:30.288','2026-07-01 16:07:30.288'),('cmr29r6k1004le3hdjv9t3zj6','cmr29r6hb000be3hd4bc7zfsd','cmr29r6h20008e3hdxthwbj6u','测试实习生','INTERNSHIP','广东','深圳',NULL,NULL,'150-200元/天','ASSOCIATE',0,'协助功能测试与 Bug 提交，有 Python/Selenium 基础优先。','[\"五险\", \"餐补\", \"实习证明\"]','ACTIVE',0,'2026-07-01 16:07:30.289','2026-07-01 16:07:30.289'),('cmr29r6k2004ne3hdt5tyk3ui','cmr29r6hb000be3hd4bc7zfsd','cmr29r6h10002e3hdtygfuqkc','财务实习生','INTERNSHIP','上海','上海',NULL,NULL,'120-160元/天','BACHELOR',0,'协助财务团队完成凭证整理、报表汇总，财会专业在读。','[\"餐补\", \"实习证明\", \"转正机会\"]','ACTIVE',0,'2026-07-01 16:07:30.291','2026-07-01 16:07:30.291'),('cmr29r6k4004pe3hd5lxw0xwp','cmr29r6hb000be3hd4bc7zfsd','cmr29r6h10006e3hdioyohuoy','法务实习生','INTERNSHIP','上海','上海',NULL,NULL,'120-180元/天','BACHELOR',0,'协助合同审核与法律研究工作，法学专业在读，有司法考试备考经历优先。','[\"餐补\", \"实习证明\", \"指导律师带教\"]','ACTIVE',0,'2026-07-01 16:07:30.292','2026-07-01 16:07:30.292'),('cmr29r6k5004re3hd7gknwoh8','cmr29r6hb000be3hd4bc7zfsd','cmr29r6h10003e3hdssux3oj1','市场营销实习生','INTERNSHIP','北京','北京',NULL,NULL,'130-180元/天','BACHELOR',0,'协助品牌营销活动策划与执行，市场营销/传播学专业优先。','[\"餐补\", \"班车\", \"实习证明\"]','ACTIVE',0,'2026-07-01 16:07:30.293','2026-07-01 16:07:30.293'),('cmr29r6k6004te3hdm1ycmk8d','cmr29r6hb000be3hd4bc7zfsd','cmr29r6h10007e3hdalxm2h7u','C++ 音视频开发工程师','FULL_TIME','上海','上海',NULL,NULL,'28k-48k','BACHELOR',3,'负责直播音视频引擎开发，熟悉 FFmpeg/WebRTC，有低延迟优化经验优先。','[\"股票期权\", \"五险一金\", \"弹性工作\", \"年终奖\"]','ACTIVE',0,'2026-07-01 16:07:30.294','2026-07-01 16:07:30.294'),('cmr29r6k7004ve3hd2edkbh82','cmr29r6hb000be3hd4bc7zfsd','cmr29r6h20008e3hdxthwbj6u','硬件结构工程师','FULL_TIME','广东','深圳',NULL,NULL,'12k-20k','BACHELOR',2,'负责无人机结构件设计与验证，熟悉 SolidWorks/ProE。','[\"五险一金\", \"年终奖\"]','ACTIVE',0,'2026-07-01 16:07:30.295','2026-07-01 16:07:30.295'),('cmr29r6k8004xe3hdiszwpkxs','cmr29r6hb000be3hd4bc7zfsd','cmr29r6h00001e3hdyj56ekjv','物联网平台开发工程师','FULL_TIME','北京','北京',NULL,NULL,'15k-25k','BACHELOR',2,'负责智能家居 IoT 云平台开发，熟悉 MQTT/CoAP 协议。','[\"五险一金\", \"年终奖\", \"弹性工作\"]','ACTIVE',0,'2026-07-01 16:07:30.296','2026-07-01 16:07:30.296'),('cmr29r6k9004ze3hdjsp6oda8','cmr29r6hb000be3hd4bc7zfsd','cmr29r6gw0000e3hda660m4hq','AI 大模型产品经理','FULL_TIME','北京','北京',NULL,NULL,'22k-40k','BACHELOR',3,'负责 AI 大模型应用产品从 0 到 1，有 NLP/CV 产品落地经验。','[\"股票期权\", \"五险一金\", \"弹性工作\"]','ACTIVE',0,'2026-07-01 16:07:30.297','2026-07-01 16:07:30.297'),('cmr29r6ka0051e3hdksf70kn8','cmr29r6hb000be3hd4bc7zfsd','cmr29r6h10006e3hdioyohuoy','兼职直播助手','PART_TIME','上海','上海',NULL,NULL,'3k-6k','ANY',0,'协助主播直播过程中的评论回复、商品上架及订单跟进，每晚 3 小时。','[\"灵活排班\", \"提成分成\"]','ACTIVE',1,'2026-07-01 16:07:30.299','2026-07-02 12:20:57.546'),('cmr29r6kb0053e3hdxubjbjmo','cmr29r6hb000be3hd4bc7zfsd','cmr29r6h10006e3hdioyohuoy','客服实习生（在线）','INTERNSHIP','四川','成都',NULL,NULL,'100-140元/天','HIGH_SCHOOL',0,'处理电商平台用户在线咨询，支持远程办公，每天 6 小时。','[\"餐补\", \"实习证明\"]','ACTIVE',0,'2026-07-01 16:07:30.300','2026-07-01 16:07:30.300'),('cmr29r6ke0055e3hdlgaz1x9u','cmr29r6hb000be3hd4bc7zfsd','cmr29r6h00001e3hdyj56ekjv','品牌视觉设计师','FULL_TIME','北京','北京',NULL,NULL,'12k-20k','BACHELOR',3,'负责企业 VI/品牌物料设计，精通 AI/PS，有系统化品牌设计经验。','[\"五险一金\", \"弹性工作\", \"年终奖\"]','ACTIVE',2,'2026-07-01 16:07:30.302','2026-07-01 16:23:00.474'),('cmr29r6kf0057e3hdzdp0vnxc','cmr29r6hb000be3hd4bc7zfsd','cmr29r6h20008e3hdxthwbj6u','采购专员','FULL_TIME','广东','深圳',NULL,NULL,'8k-14k','BACHELOR',2,'负责电子元器件及耗材采购，有供应链谈判经验，熟悉招投标流程。','[\"五险一金\", \"年终奖\"]','ACTIVE',0,'2026-07-01 16:07:30.304','2026-07-01 16:07:30.304'),('cmr29r6kg0059e3hdoafulhp5','cmr29r6hb000be3hd4bc7zfsd','cmr29r6h10005e3hdra370tft','全栈开发工程师','FULL_TIME','北京','北京',NULL,NULL,'18k-32k','BACHELOR',3,'负责内容平台前后端开发，TypeScript + Node.js + React 技术栈。','[\"股票期权\", \"五险一金\", \"弹性工作\"]','ACTIVE',1,'2026-07-01 16:07:30.305','2026-07-04 18:10:42.973'),('cmr29r6ki005be3hdqlobtvdh','cmr29r6hb000be3hd4bc7zfsd','cmr29r6gw0000e3hda660m4hq','运维工程师（云平台）','FULL_TIME','北京','北京',NULL,NULL,'12k-22k','BACHELOR',2,'负责云基础设施运维，熟悉 Linux/Ansible/监控体系建设。','[\"五险一金\", \"年终奖\", \"轮班补贴\"]','ACTIVE',0,'2026-07-01 16:07:30.306','2026-07-01 16:07:30.306'),('cmr29r6kj005de3hd2w98nsww','cmr29r6hb000be3hd4bc7zfsd','cmr29r6gw0000e3hda660m4hq','CTO 助理（实习）','INTERNSHIP','北京','北京',NULL,NULL,'200-280元/天','MASTER',0,'协助 CTO 完成技术调研与竞品分析，每周至少 3 天，全程英文沟通。','[\"餐补\", \"导师制\", \"转正机会\"]','ACTIVE',0,'2026-07-01 16:07:30.307','2026-07-01 16:07:30.307'),('cmr29r6kk005fe3hdqqxnullz','cmr29r6hb000be3hd4bc7zfsd','cmr29r6h10006e3hdioyohuoy','销售助理（实习）','INTERNSHIP','上海','上海',NULL,NULL,'120-160元/天','BACHELOR',0,'协助销售团队完成客户资料整理与 CRM 录入，市场营销专业优先。','[\"餐补\", \"实习证明\", \"班车\"]','ACTIVE',0,'2026-07-01 16:07:30.309','2026-07-01 16:07:30.309'),('cmr29r6km005he3hd0o6fjm11','cmr29r6hb000be3hd4bc7zfsd','cmr29r6h10005e3hdra370tft','短视频创作者（兼职）','PART_TIME','四川','成都',NULL,NULL,'3k-8k','ANY',0,'为品牌账号产出短视频内容，按条结算，支持异地远程合作。','[\"远程工作\", \"弹性时间\", \"素材支持\"]','ACTIVE',3,'2026-07-01 16:07:30.311','2026-07-02 13:17:30.005'),('cmr29r6kn005je3hdijauv7le','cmr29r6hb000be3hd4bc7zfsd','cmr29r6h10003e3hdssux3oj1','电话销售专员（兼职）','PART_TIME','陕西','西安',NULL,NULL,'3k-6k','HIGH_SCHOOL',0,'通过电话开拓潜在用户，每天工作 4 小时，底薪加提成。','[\"提成无上限\", \"灵活时间\"]','ACTIVE',0,'2026-07-01 16:07:30.312','2026-07-01 16:07:30.312'),('cmr29r6kp005le3hd1zuozjww','cmr29r6hb000be3hd4bc7zfsd','cmr29r6h10006e3hdioyohuoy','供应链品控专员','FULL_TIME','上海','上海',NULL,NULL,'8k-13k','ASSOCIATE',1,'负责商品进货质量验收与供应商管理，有品控相关证书优先。','[\"五险一金\", \"年终奖\", \"员工优惠\"]','ACTIVE',0,'2026-07-01 16:07:30.313','2026-07-01 16:07:30.313'),('cmr29r6kq005ne3hdbs442oq9','cmr29r6hb000be3hd4bc7zfsd','cmr29r6h10004e3hdxnegtnk9','配送团队督导','FULL_TIME','北京','北京',NULL,NULL,'7k-12k','HIGH_SCHOOL',2,'负责城市配送团队日常管理与绩效考核，有基层管理经验优先。','[\"五险一金\", \"年终奖\"]','ACTIVE',5,'2026-07-01 16:07:30.315','2026-07-04 17:51:36.094'),('cmr29r6ks005pe3hd1yutba9d','cmr29r6hb000be3hd4bc7zfsd','cmr29r6h10002e3hdtygfuqkc','保险理赔专员','FULL_TIME','上海','上海',NULL,NULL,'7k-12k','BACHELOR',1,'负责个人及企业保险理赔申请受理与审核，有保险从业资格证优先。','[\"五险一金\", \"年终奖\", \"内部培训\"]','ACTIVE',0,'2026-07-01 16:07:30.316','2026-07-01 16:07:30.316'),('cmr29r6kt005re3hdd7ps02b9','cmr29r6hb000be3hd4bc7zfsd','cmr29r6h10003e3hdssux3oj1','教育技术研发工程师','FULL_TIME','北京','北京',NULL,NULL,'16k-26k','BACHELOR',2,'负责在线教育平台技术研发，熟悉直播/点播流媒体技术优先。','[\"股票期权\", \"五险一金\", \"弹性工作\"]','ACTIVE',5,'2026-07-01 16:07:30.318','2026-07-04 18:10:31.203'),('cmr29r6ku005te3hdutp817oa','cmr29r6hb000be3hd4bc7zfsd','cmr29r6h10006e3hdioyohuoy','仓储运营实习生','INTERNSHIP','上海','上海',NULL,NULL,'110-150元/天','ASSOCIATE',0,'协助仓储团队完成货物盘点与系统录入，物流/供应链专业优先。','[\"餐补\", \"实习证明\", \"班车\"]','ACTIVE',0,'2026-07-01 16:07:30.319','2026-07-01 16:07:30.319'),('cmr29r6kw005ve3hdrh4vqpad','cmr29r6hb000be3hd4bc7zfsd','cmr29r6h10007e3hdalxm2h7u','AI 绘画设计师（兼职）','PART_TIME','上海','上海',NULL,NULL,'200-500元/稿','ANY',0,'使用 Stable Diffusion/MidJourney 为游戏/品牌生成概念图，按稿结算。','[\"远程工作\", \"弹性时间\", \"素材支持\"]','ACTIVE',1,'2026-07-01 16:07:30.320','2026-07-02 12:20:53.663'),('cmr3mkij40001buct5gs7whok','cmr27v12y000bgw96f4e97fxi','cmr27v12l0001gw96wi8kmah3','硬件开发工程师','FULL_TIME','北京市','北京市','东城区','知春路10号','8k-12k','BACHELOR',5,'- 本科及以上电子信息、电气工程、自动化、微电子等相关专业，1-3年硬件开发经验；\n- 熟练使用AD/Cadence等硬件设计工具，独立完成过完整项目从原理图到量产的流程；\n- 扎实的模电、数电基础，精通DC-DC/LDO电源架构、常见保护电路、差分/单端信号布线规范；\n- 熟悉常用MCU、外设接口、CAN/RS485/Ethernet等工业接口，了解基础EMC、安规设计要点；\n- 具备较强问题排查能力，能独立定位硬件故障（电源、时钟、干扰、虚焊、信号质量等）；\n- 有工业控制、物联网、消费电子、车载硬件经验者优先。','[\"五险一金\"]','ACTIVE',0,'2026-07-02 14:54:00.400','2026-07-02 14:54:00.400');
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messages` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('INVITE','CHAT','SYSTEM') COLLATE utf8mb4_unicode_ci NOT NULL,
  `sender_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `receiver_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `job_id` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `extra` json DEFAULT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `messages_receiver_id_is_read_idx` (`receiver_id`,`is_read`),
  KEY `messages_sender_id_receiver_id_idx` (`sender_id`,`receiver_id`),
  CONSTRAINT `messages_receiver_id_fkey` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `messages_sender_id_fkey` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
INSERT INTO `messages` VALUES ('cmr29z7xy000bwvbp8stuo8xf','INVITE','mock-recruiter-001','mock-seeker-001','cmr27v132000dgw963ssdlrvf','您好，我们对您的简历很感兴趣，诚邀您参加面试，方便沟通吗？',NULL,1,'2026-07-01 16:13:45.335'),('cmr29z7y0000dwvbp1ylx9ume','CHAT','mock-recruiter-001','mock-seeker-001',NULL,'请问您目前的求职状态如何？',NULL,0,'2026-07-01 16:13:45.337'),('cmr29z7y2000fwvbpo67g9sh4','CHAT','mock-seeker-001','mock-recruiter-001',NULL,'您好，我正在看新机会，可以详细聊聊这个岗位。',NULL,0,'2026-07-01 16:13:45.338'),('cmr29z7y3000hwvbpoxqot36n','SYSTEM','mock-seeker-001','mock-seeker-001',NULL,'您的简历已被 3 家企业查看，保持在线提升曝光。',NULL,0,'2026-07-01 16:13:45.339');
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_experiences`
--

DROP TABLE IF EXISTS `project_experiences`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_experiences` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `profile_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tech_tags` json DEFAULT NULL,
  `content` text COLLATE utf8mb4_unicode_ci,
  `start_date` datetime(3) DEFAULT NULL,
  `end_date` datetime(3) DEFAULT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `project_experiences_profile_id_idx` (`profile_id`),
  CONSTRAINT `project_experiences_profile_id_fkey` FOREIGN KEY (`profile_id`) REFERENCES `seeker_profiles` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_experiences`
--

LOCK TABLES `project_experiences` WRITE;
/*!40000 ALTER TABLE `project_experiences` DISABLE KEYS */;
INSERT INTO `project_experiences` VALUES ('cmr3j60ga0001jons0muis6yw','cmr26mo0k0001118xwjzwbmtl','让人222','2555222','null','1212125455656版本','2026-06-30 16:00:00.000','2026-07-30 16:00:00.000',0,'2026-07-02 13:18:44.938','2026-07-02 13:25:52.013');
/*!40000 ALTER TABLE `project_experiences` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recommendations`
--

DROP TABLE IF EXISTS `recommendations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recommendations` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `recommender_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `job_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `company` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('DONE','REVIEW') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'REVIEW',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `recommendations_recommender_id_idx` (`recommender_id`),
  CONSTRAINT `recommendations_recommender_id_fkey` FOREIGN KEY (`recommender_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recommendations`
--

LOCK TABLES `recommendations` WRITE;
/*!40000 ALTER TABLE `recommendations` DISABLE KEYS */;
/*!40000 ALTER TABLE `recommendations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recruiters`
--

DROP TABLE IF EXISTS `recruiters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recruiters` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `company_id` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `real_name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `department` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contact_phone` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_verified` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `recruiters_user_id_key` (`user_id`),
  KEY `recruiters_company_id_fkey` (`company_id`),
  CONSTRAINT `recruiters_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `recruiters_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recruiters`
--

LOCK TABLES `recruiters` WRITE;
/*!40000 ALTER TABLE `recruiters` DISABLE KEYS */;
INSERT INTO `recruiters` VALUES ('cmr27v12y000bgw96f4e97fxi','mock-recruiter-001','cmr27v12l0001gw96wi8kmah3','王HR','技术部','1323456432',1,'2026-07-01 15:14:30.587','2026-07-04 18:22:01.498'),('cmr29r6hb000be3hd4bc7zfsd','mock-recruiter-b2-001','cmr29r6gw0000e3hda660m4hq','李HR','人力资源部',NULL,1,'2026-07-01 16:07:30.191','2026-07-01 16:07:30.191');
/*!40000 ALTER TABLE `recruiters` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `seeker_profiles`
--

DROP TABLE IF EXISTS `seeker_profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seeker_profiles` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `real_name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gender` enum('UNKNOWN','MALE','FEMALE') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'UNKNOWN',
  `birth_date` datetime(3) DEFAULT NULL,
  `city` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role_title` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `self_desc` text COLLATE utf8mb4_unicode_ci,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `seeker_profiles_user_id_key` (`user_id`),
  CONSTRAINT `seeker_profiles_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `seeker_profiles`
--

LOCK TABLES `seeker_profiles` WRITE;
/*!40000 ALTER TABLE `seeker_profiles` DISABLE KEYS */;
INSERT INTO `seeker_profiles` VALUES ('cmr26mo0k0001118xwjzwbmtl','mock-seeker-001','孙大锤','MALE','1982-06-30 16:00:00.000','北京',NULL,'本人拥有扎实的专业知识储备与丰富的实操工作经验，具备良好的项目统筹、团队协作与问题解决能力。工作中严谨细致、责任心强，拥有优秀的沟通协调能力和高效的执行力，能够快速适配岗位工作与企业工作节奏。擅长梳理工作流程、统筹项目落地、对接多方资源，可独立完成各项工作任务及全流程项目推进。对待工作积极主动、乐于学习迭代，能够快速掌握新技能、适应新场景，具备较强的抗压能力和大局意识，始终以结果为导向高效完成各项工作目标，适配各类职场岗位工作需求。','2026-07-01 14:40:00.788','2026-07-04 13:46:34.211'),('cmr27v1s40001sbmqpfu6jd7d','mock-seeker-002','张伟','MALE',NULL,'上海','后端工程师','5年Java开发经验，熟悉Spring Boot、微服务架构，有大型互联网公司经历。','2026-07-01 15:14:31.493','2026-07-01 15:14:31.493'),('cmr27v1sm0009sbmqo64y446m','mock-seeker-003','王芳','FEMALE',NULL,'深圳','UI设计师','专注移动端UI设计3年，熟练使用Figma、Sketch，有独立完成从需求到上线全流程的经验。','2026-07-01 15:14:31.511','2026-07-01 15:14:31.511'),('cmr27v1sv000hsbmq6tq53y0d','mock-seeker-004','刘洋','MALE',NULL,'北京','产品经理','4年C端产品经验，主导过从0到1的产品从立项到百万DAU，擅长数据分析和用户研究。','2026-07-01 15:14:31.519','2026-07-01 15:14:31.519'),('cmr27v1t2000psbmq4s0d3l7u','mock-seeker-005','陈静','FEMALE',NULL,'广州','运营专员','2年内容运营经验，负责过公众号从1万到20万粉丝的增长，熟悉新媒体矩阵运营。','2026-07-01 15:14:31.527','2026-07-01 15:14:31.527'),('cmr27v1t8000vsbmq9btyovab','mock-seeker-006','赵磊','MALE',NULL,'成都','数据分析师','3年数据分析经验，熟练Python、SQL、Tableau，有电商和金融行业数据建模经验。','2026-07-01 15:14:31.533','2026-07-01 15:14:31.533'),('cmr27v1ti0015sbmq6ac6gcaj','mock-seeker-007','孙晓','FEMALE',NULL,'杭州','前端工程师（实习）','在校大学生，熟悉Vue3、TypeScript，参与过开源项目，期待在实际项目中积累经验。','2026-07-01 15:14:31.542','2026-07-01 15:14:31.542'),('cmr29rf0m00011tqnv77txsm1','mock-seeker-b2-002','李强','MALE',NULL,'北京','前端工程师','6年前端开发经验，精通React、Vue生态，主导过大型中后台系统架构，有团队管理经验。','2026-07-01 16:07:41.255','2026-07-01 16:07:41.255'),('cmr29rf1400091tqn2hk5i21p','mock-seeker-b2-003','周敏','FEMALE',NULL,'上海','产品经理','5年B端产品经验，擅长供应链与SaaS系统设计，有从需求到落地的完整闭环经验。','2026-07-01 16:07:41.273','2026-07-01 16:07:41.273'),('cmr29rf1c000h1tqnbxuvv40r','mock-seeker-b2-004','吴涛','MALE',NULL,'深圳','嵌入式工程师','4年嵌入式开发经验，熟悉C/C++、RTOS，有无人机与智能硬件项目落地经验。','2026-07-01 16:07:41.281','2026-07-01 16:07:41.281'),('cmr29rf1j000p1tqnuxidzup3','mock-seeker-b2-005','郑雪','FEMALE',NULL,'北京','数据分析师','3年数据分析经验，精通SQL、Python、Tableau，有互联网广告与用户增长分析经验。','2026-07-01 16:07:41.288','2026-07-01 16:07:41.288'),('cmr29rf1p000v1tqnk0o33mlp','mock-seeker-b2-006','孙浩','MALE',NULL,'上海','后端工程师','5年后端开发经验，熟悉Java、Go微服务架构，有高并发交易系统设计经验。','2026-07-01 16:07:41.294','2026-07-01 16:07:41.294'),('cmr29rf1x00151tqnxk0k6mji','mock-seeker-b2-007','林悦','FEMALE',NULL,'杭州','UI设计师（实习）','在校研究生，熟悉Figma、C4D，参与过多个校园品牌设计项目，期待在实践中成长。','2026-07-01 16:07:41.302','2026-07-01 16:07:41.302');
/*!40000 ALTER TABLE `seeker_profiles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('SEEKER','RECRUITER','ADMIN','SUPER_ADMIN') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'SEEKER',
  `nickname` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar_url` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` int NOT NULL DEFAULT '1',
  `id_verified_at` datetime(3) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_phone_key` (`phone`),
  KEY `users_role_idx` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('mock-admin-001','13800000003','$2b$12$zPPx.6kSQelRCqRLOyIjzeXyOWs.URH2PJSX0Kz4RTiJk3N1qrVNW','ADMIN','测试运营',NULL,1,'2026-07-01 14:21:31.956','2026-07-01 14:21:31.988','2026-07-01 15:14:19.950'),('mock-admin-b2-001','13800000103','$2b$12$.vNBEr2NK7rpWj5hjn0FTev.iKyYPIjWGQjARjoSWtxFmI5QmuCDS','ADMIN','测试运营B2',NULL,1,'2026-07-01 16:07:29.552','2026-07-01 16:07:29.586','2026-07-01 16:07:29.586'),('mock-recruiter-001','13800000002','$2b$12$zPPx.6kSQelRCqRLOyIjzeXyOWs.URH2PJSX0Kz4RTiJk3N1qrVNW','RECRUITER','测试招聘官','fa:heart',1,NULL,'2026-07-01 14:21:31.980','2026-07-04 18:21:34.244'),('mock-recruiter-b2-001','13800000102','$2b$12$.vNBEr2NK7rpWj5hjn0FTev.iKyYPIjWGQjARjoSWtxFmI5QmuCDS','RECRUITER','测试招聘官B2',NULL,1,NULL,'2026-07-01 16:07:29.582','2026-07-01 16:07:29.582'),('mock-seeker-001','13800000001','$2b$12$zPPx.6kSQelRCqRLOyIjzeXyOWs.URH2PJSX0Kz4RTiJk3N1qrVNW','SEEKER','测试求职者','fa:heart',1,NULL,'2026-07-01 14:21:31.965','2026-07-04 18:09:12.133'),('mock-seeker-002','13800000011','$2b$12$c.9EwbgioUU2Xt.KPOvSVuZNuuyIM4waazVrG5AapIJySeZBgPtmC','SEEKER','张伟',NULL,1,NULL,'2026-07-01 15:14:31.487','2026-07-01 15:14:31.487'),('mock-seeker-003','13800000012','$2b$12$c.9EwbgioUU2Xt.KPOvSVuZNuuyIM4waazVrG5AapIJySeZBgPtmC','SEEKER','王芳',NULL,1,NULL,'2026-07-01 15:14:31.508','2026-07-01 15:14:31.508'),('mock-seeker-004','13800000013','$2b$12$c.9EwbgioUU2Xt.KPOvSVuZNuuyIM4waazVrG5AapIJySeZBgPtmC','SEEKER','刘洋',NULL,1,'2026-07-01 16:14:17.010','2026-07-01 15:14:31.518','2026-07-01 16:14:17.011'),('mock-seeker-005','13800000014','$2b$12$c.9EwbgioUU2Xt.KPOvSVuZNuuyIM4waazVrG5AapIJySeZBgPtmC','SEEKER','陈静',NULL,1,NULL,'2026-07-01 15:14:31.525','2026-07-01 15:14:31.525'),('mock-seeker-006','13800000015','$2b$12$c.9EwbgioUU2Xt.KPOvSVuZNuuyIM4waazVrG5AapIJySeZBgPtmC','SEEKER','赵磊',NULL,1,NULL,'2026-07-01 15:14:31.531','2026-07-01 15:14:31.531'),('mock-seeker-007','13800000016','$2b$12$c.9EwbgioUU2Xt.KPOvSVuZNuuyIM4waazVrG5AapIJySeZBgPtmC','SEEKER','孙晓',NULL,1,NULL,'2026-07-01 15:14:31.541','2026-07-01 15:14:31.541'),('mock-seeker-b2-001','13800000101','$2b$12$.vNBEr2NK7rpWj5hjn0FTev.iKyYPIjWGQjARjoSWtxFmI5QmuCDS','SEEKER','测试求职者B2',NULL,1,NULL,'2026-07-01 16:07:29.562','2026-07-01 16:07:29.562'),('mock-seeker-b2-002','13800000111','$2b$12$F/8.O74w2hsMYjyDJn9mbuoKCfQ.Gwh3Ue/c3TDWyc//FfqNp.JFO','SEEKER','李强',NULL,1,NULL,'2026-07-01 16:07:41.249','2026-07-01 16:07:41.249'),('mock-seeker-b2-003','13800000112','$2b$12$F/8.O74w2hsMYjyDJn9mbuoKCfQ.Gwh3Ue/c3TDWyc//FfqNp.JFO','SEEKER','周敏',NULL,1,NULL,'2026-07-01 16:07:41.270','2026-07-01 16:07:41.270'),('mock-seeker-b2-004','13800000113','$2b$12$F/8.O74w2hsMYjyDJn9mbuoKCfQ.Gwh3Ue/c3TDWyc//FfqNp.JFO','SEEKER','吴涛',NULL,1,NULL,'2026-07-01 16:07:41.279','2026-07-01 16:07:41.279'),('mock-seeker-b2-005','13800000114','$2b$12$F/8.O74w2hsMYjyDJn9mbuoKCfQ.Gwh3Ue/c3TDWyc//FfqNp.JFO','SEEKER','郑雪',NULL,1,NULL,'2026-07-01 16:07:41.287','2026-07-01 16:07:41.287'),('mock-seeker-b2-006','13800000115','$2b$12$F/8.O74w2hsMYjyDJn9mbuoKCfQ.Gwh3Ue/c3TDWyc//FfqNp.JFO','SEEKER','孙浩',NULL,1,NULL,'2026-07-01 16:07:41.292','2026-07-01 16:07:41.292'),('mock-seeker-b2-007','13800000116','$2b$12$F/8.O74w2hsMYjyDJn9mbuoKCfQ.Gwh3Ue/c3TDWyc//FfqNp.JFO','SEEKER','林悦',NULL,1,NULL,'2026-07-01 16:07:41.300','2026-07-01 16:07:41.300'),('mock-super-001','13800000004','$2b$12$zPPx.6kSQelRCqRLOyIjzeXyOWs.URH2PJSX0Kz4RTiJk3N1qrVNW','SUPER_ADMIN','超级管理员',NULL,1,'2026-07-01 14:21:31.956','2026-07-01 14:21:31.993','2026-07-01 15:14:19.952'),('mock-super-b2-001','13800000104','$2b$12$.vNBEr2NK7rpWj5hjn0FTev.iKyYPIjWGQjARjoSWtxFmI5QmuCDS','SUPER_ADMIN','超级管理员B2',NULL,1,'2026-07-01 16:07:29.552','2026-07-01 16:07:29.590','2026-07-01 16:07:29.590');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `work_certifications`
--

DROP TABLE IF EXISTS `work_certifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `work_certifications` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `work_exp_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `certifier_id` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `certifier_type` enum('ADMIN','PEER') COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('PENDING','APPROVED','REVOKED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING',
  `note` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `relationship` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `anonymous` tinyint(1) NOT NULL DEFAULT '0',
  `know_from` datetime(3) DEFAULT NULL,
  `know_to` datetime(3) DEFAULT NULL,
  `recommendation` text COLLATE utf8mb4_unicode_ci,
  `share_token` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `share_expire_at` datetime(3) DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `work_certifications_work_exp_id_key` (`work_exp_id`),
  UNIQUE KEY `work_certifications_share_token_key` (`share_token`),
  KEY `work_certifications_user_id_idx` (`user_id`),
  KEY `work_certifications_certifier_id_idx` (`certifier_id`),
  CONSTRAINT `work_certifications_certifier_id_fkey` FOREIGN KEY (`certifier_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `work_certifications_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `work_certifications_work_exp_id_fkey` FOREIGN KEY (`work_exp_id`) REFERENCES `work_experiences` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `work_certifications`
--

LOCK TABLES `work_certifications` WRITE;
/*!40000 ALTER TABLE `work_certifications` DISABLE KEYS */;
INSERT INTO `work_certifications` VALUES ('cmr29z7yc000rwvbp1d2wi94a','mock-seeker-001','cmr26vqhz000d118x442ivz89',NULL,'ADMIN','PENDING','申请官方工作认证',NULL,0,NULL,NULL,NULL,NULL,NULL,'2026-07-01 16:13:45.349','2026-07-01 16:13:45.349');
/*!40000 ALTER TABLE `work_certifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `work_experiences`
--

DROP TABLE IF EXISTS `work_experiences`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `work_experiences` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `profile_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `company_id` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `company` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `city` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `salary_min` int DEFAULT NULL,
  `salary_max` int DEFAULT NULL,
  `skill_tags` json DEFAULT NULL,
  `content` text COLLATE utf8mb4_unicode_ci,
  `start_date` datetime(3) DEFAULT NULL,
  `end_date` datetime(3) DEFAULT NULL,
  `sort_order` int NOT NULL DEFAULT '0',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `work_experiences_profile_id_idx` (`profile_id`),
  KEY `work_experiences_company_id_fkey` (`company_id`),
  CONSTRAINT `work_experiences_company_id_fkey` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `work_experiences_profile_id_fkey` FOREIGN KEY (`profile_id`) REFERENCES `seeker_profiles` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `work_experiences`
--

LOCK TABLES `work_experiences` WRITE;
/*!40000 ALTER TABLE `work_experiences` DISABLE KEYS */;
INSERT INTO `work_experiences` VALUES ('cmr26vqhz000d118x442ivz89','cmr26mo0k0001118xwjzwbmtl',NULL,'北京道法无边科技有限公司','技术经理',NULL,NULL,NULL,'null','- 负责公司日常业务运营、流程落地与执行跟进，梳理优化工作流程，提升整体工作效率，降低岗位运营成本；','2026-01-01 16:00:00.000','2026-06-30 16:00:00.000',0,'2026-07-01 14:47:03.912','2026-07-01 14:47:03.912'),('cmr27v1se0005sbmqwn2w2cyu','cmr27v1s40001sbmqpfu6jd7d',NULL,'字节跳动','高级Java工程师','上海',NULL,NULL,NULL,'负责推荐系统后端开发，日均QPS 50万+','2021-07-01 00:00:00.000',NULL,0,'2026-07-01 15:14:31.503','2026-07-01 15:14:31.503'),('cmr27v1sh0007sbmqfwax8qe5','cmr27v1s40001sbmqpfu6jd7d',NULL,'携程旅行','Java工程师','上海',NULL,NULL,NULL,'订单中台服务开发与维护','2019-07-01 00:00:00.000','2021-06-01 00:00:00.000',1,'2026-07-01 15:14:31.506','2026-07-01 15:14:31.506'),('cmr27v1sq000dsbmq7e3shln9','cmr27v1sm0009sbmqo64y446m',NULL,'腾讯','UI设计师','深圳',NULL,NULL,NULL,'负责微信小程序视觉规范制定与交互设计','2022-03-01 00:00:00.000',NULL,0,'2026-07-01 15:14:31.515','2026-07-01 15:14:31.515'),('cmr27v1ss000fsbmqa6ysttm2','cmr27v1sm0009sbmqo64y446m',NULL,'猿辅导','初级UI设计师','北京',NULL,NULL,NULL,'教育产品视觉设计，完成多个版本迭代','2021-07-01 00:00:00.000','2022-02-01 00:00:00.000',1,'2026-07-01 15:14:31.516','2026-07-01 15:14:31.516'),('cmr27v1sy000lsbmq8dr5kmc9','cmr27v1sv000hsbmq6tq53y0d',NULL,'美团','高级产品经理','北京',NULL,NULL,NULL,'负责到店业务产品设计，DAU增长150%','2021-06-01 00:00:00.000',NULL,0,'2026-07-01 15:14:31.522','2026-07-01 15:14:31.522'),('cmr27v1sz000nsbmqi6zsirzc','cmr27v1sv000hsbmq6tq53y0d',NULL,'滴滴出行','产品经理','北京',NULL,NULL,NULL,'出行场景产品设计与迭代','2019-07-01 00:00:00.000','2021-05-01 00:00:00.000',1,'2026-07-01 15:14:31.524','2026-07-01 15:14:31.524'),('cmr27v1t5000tsbmq4566gc13','cmr27v1t2000psbmq4s0d3l7u',NULL,'网易云音乐','内容运营专员','广州',NULL,NULL,NULL,'负责UGC内容生态运营，策划多个爆款活动','2023-07-01 00:00:00.000',NULL,0,'2026-07-01 15:14:31.530','2026-07-01 15:14:31.530'),('cmr27v1te0011sbmqvp1b5o8b','cmr27v1t8000vsbmq9btyovab',NULL,'京东','数据分析师','成都',NULL,NULL,NULL,'负责供应链数据分析，优化库存周转率20%','2022-01-01 00:00:00.000',NULL,0,'2026-07-01 15:14:31.538','2026-07-01 15:14:31.538'),('cmr27v1tf0013sbmqz4lh7w7v','cmr27v1t8000vsbmq9btyovab',NULL,'东方财富','初级数据分析师','成都',NULL,NULL,NULL,'股票行情数据清洗与报表开发','2021-07-01 00:00:00.000','2021-12-01 00:00:00.000',1,'2026-07-01 15:14:31.540','2026-07-01 15:14:31.540'),('cmr27v1tl0019sbmqz32ywe05','cmr27v1ti0015sbmq6ac6gcaj',NULL,'阿里巴巴','前端实习生','杭州',NULL,NULL,NULL,'参与淘宝商家后台功能开发，完成3个需求的独立交付','2024-07-01 00:00:00.000','2024-10-01 00:00:00.000',0,'2026-07-01 15:14:31.545','2026-07-01 15:14:31.545'),('cmr29rf0w00051tqnymwujke2','cmr29rf0m00011tqnv77txsm1',NULL,'百度','高级前端工程师','北京',NULL,NULL,NULL,'负责搜索前端平台建设，主导组件库从0到1','2020-08-01 00:00:00.000',NULL,0,'2026-07-01 16:07:41.265','2026-07-01 16:07:41.265'),('cmr29rf0z00071tqnlg2nbs2u','cmr29rf0m00011tqnv77txsm1',NULL,'滴滴出行','前端工程师','北京',NULL,NULL,NULL,'出行业务H5与小程序开发','2017-07-01 00:00:00.000','2020-07-01 00:00:00.000',1,'2026-07-01 16:07:41.268','2026-07-01 16:07:41.268'),('cmr29rf18000d1tqntb2y7mng','cmr29rf1400091tqn2hk5i21p',NULL,'拼多多','高级产品经理','上海',NULL,NULL,NULL,'负责商家后台交易系统产品设计，服务百万级商家','2021-03-01 00:00:00.000',NULL,0,'2026-07-01 16:07:41.276','2026-07-01 16:07:41.276'),('cmr29rf19000f1tqn8lm6jozy','cmr29rf1400091tqn2hk5i21p',NULL,'携程','产品经理','上海',NULL,NULL,NULL,'供应商管理平台产品迭代','2018-07-01 00:00:00.000','2021-02-01 00:00:00.000',1,'2026-07-01 16:07:41.277','2026-07-01 16:07:41.277'),('cmr29rf1f000l1tqnlkfnj8nb','cmr29rf1c000h1tqnbxuvv40r',NULL,'大疆创新','嵌入式工程师','深圳',NULL,NULL,NULL,'负责飞控固件开发与传感器驱动适配','2021-05-01 00:00:00.000',NULL,0,'2026-07-01 16:07:41.284','2026-07-01 16:07:41.284'),('cmr29rf1h000n1tqnwso1vwkx','cmr29rf1c000h1tqnbxuvv40r',NULL,'中兴通讯','初级嵌入式工程师','深圳',NULL,NULL,NULL,'通信模组底层软件开发','2019-07-01 00:00:00.000','2021-04-01 00:00:00.000',1,'2026-07-01 16:07:41.285','2026-07-01 16:07:41.285'),('cmr29rf1n000t1tqnxf62zz72','cmr29rf1j000p1tqnuxidzup3',NULL,'快手','数据分析师','北京',NULL,NULL,NULL,'负责商业化广告数据分析，支持投放策略优化','2021-07-01 00:00:00.000',NULL,0,'2026-07-01 16:07:41.291','2026-07-01 16:07:41.291'),('cmr29rf1t00111tqnssr02azw','cmr29rf1p000v1tqnk0o33mlp',NULL,'哔哩哔哩','高级后端工程师','上海',NULL,NULL,NULL,'负责会员与支付系统后端开发，日均订单百万级','2021-09-01 00:00:00.000',NULL,0,'2026-07-01 16:07:41.298','2026-07-01 16:07:41.298'),('cmr29rf1v00131tqnc53m6cax','cmr29rf1p000v1tqnk0o33mlp',NULL,'拼多多','后端工程师','上海',NULL,NULL,NULL,'交易链路服务开发与性能优化','2019-07-01 00:00:00.000','2021-08-01 00:00:00.000',1,'2026-07-01 16:07:41.299','2026-07-01 16:07:41.299'),('cmr29rf2000191tqncvsfrmhc','cmr29rf1x00151tqnxk0k6mji',NULL,'网易','UI设计实习生','杭州',NULL,NULL,NULL,'参与游戏官网与活动页视觉设计，完成2个专题上线','2024-06-01 00:00:00.000','2024-09-01 00:00:00.000',0,'2026-07-01 16:07:41.305','2026-07-01 16:07:41.305');
/*!40000 ALTER TABLE `work_experiences` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'yucai_hr'
--

--
-- Dumping routines for database 'yucai_hr'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-04 18:51:12
