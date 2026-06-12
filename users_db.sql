-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3310
-- Generation Time: Jun 11, 2026 at 08:35 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `users_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `agreements`
--

CREATE TABLE `agreements` (
  `id` int(11) NOT NULL,
  `booking_ref` varchar(50) NOT NULL,
  `renter_id` int(11) NOT NULL DEFAULT 0,
  `car_id` varchar(50) DEFAULT NULL,
  `car_name` varchar(150) NOT NULL,
  `host_name` varchar(100) NOT NULL,
  `pickup_date` date NOT NULL,
  `return_date` date NOT NULL,
  `days` int(11) NOT NULL DEFAULT 1,
  `daily_rate` decimal(10,2) NOT NULL DEFAULT 0.00,
  `service_fee` decimal(10,2) NOT NULL DEFAULT 0.00,
  `total_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `invoice_ref` varchar(50) DEFAULT NULL,
  `renter_signed` tinyint(1) NOT NULL DEFAULT 0,
  `owner_signed` tinyint(1) NOT NULL DEFAULT 1,
  `signed_at` datetime DEFAULT NULL,
  `ip_address` varchar(50) DEFAULT NULL,
  `status` varchar(30) NOT NULL DEFAULT 'renter_signed',
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `agreements`
--

INSERT INTO `agreements` (`id`, `booking_ref`, `renter_id`, `car_id`, `car_name`, `host_name`, `pickup_date`, `return_date`, `days`, `daily_rate`, `service_fee`, `total_amount`, `invoice_ref`, `renter_signed`, `owner_signed`, `signed_at`, `ip_address`, `status`, `created_at`) VALUES
(1, 'DL-2026-36168', 0, '3', 'VW Polo 2020', 'Ayanda D.', '2000-09-10', '2000-09-15', 5, 420.00, 210.00, 2310.00, 'INVOICE #1162', 1, 1, '2026-06-05 10:47:04', '::1', 'fully_signed', '2026-06-05 10:47:04'),
(2, 'DL-2026-31287', 0, '3', 'VW Polo 2020', 'Ayanda D.', '2000-09-10', '2000-09-15', 5, 420.00, 210.00, 2310.00, 'INVOICE #3495', 1, 1, '2026-06-05 11:48:28', '::1', 'fully_signed', '2026-06-05 11:48:28'),
(3, 'DL-2026-79426', 0, '3', 'VW Polo 2020', 'Ayanda D.', '2000-09-10', '2000-09-15', 5, 420.00, 210.00, 2310.00, 'INVOICE #8745', 1, 1, '2026-06-05 12:52:24', '::1', 'fully_signed', '2026-06-05 12:52:24'),
(4, 'DL-2026-99663', 0, '3', 'VW Polo 2020', 'Ayanda D.', '2000-09-10', '2000-09-15', 5, 420.00, 210.00, 2310.00, 'INVOICE #9081', 1, 1, '2026-06-05 12:58:19', '::1', 'fully_signed', '2026-06-05 12:58:19');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(10) UNSIGNED NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `gender` varchar(20) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `address` text NOT NULL,
  `sub_id_passport` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `gender`, `email`, `password`, `phone`, `address`, `sub_id_passport`) VALUES
(1, 'Tshidiso', 'Possa', '', 'tshidiso861@gmail.com', '', 'rgrtrrrtgrtrr', '4567 Blue Valley golf estate', 'eedededededdddde'),
(2, '', '', 'Male', 'tp@gmail.com', '', 'rgrtrrrtgrtrr', '4567 Blue Valley golf estate', ''),
(3, '', '', 'Male', 'kaho@gmail.com', '', '6343467673', 'sfdsfdffvfdr', '');

-- --------------------------------------------------------

--
-- Table structure for table `vehicles`
--

CREATE TABLE `vehicles` (
  `id` int(11) NOT NULL,
  `make` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL,
  `year` int(11) NOT NULL,
  `colour` varchar(50) NOT NULL,
  `registration` varchar(50) NOT NULL,
  `vin_number` varchar(100) NOT NULL,
  `kilometers` int(11) NOT NULL,
  `vehicle_category` varchar(100) NOT NULL,
  `transmission` enum('Manual','Automatic') NOT NULL,
  `gearbox` varchar(50) NOT NULL,
  `fuel_type` enum('Petrol','Diesel','Hybrid','Electric') NOT NULL,
  `front_exterior_photo` varchar(255) DEFAULT NULL,
  `back_exterior_photo` varchar(255) DEFAULT NULL,
  `daily_rate` decimal(10,2) NOT NULL,
  `weekly_rate` decimal(10,2) NOT NULL,
  `minimum_rental_period` varchar(50) NOT NULL,
  `booking_type` varchar(50) NOT NULL,
  `vehicle_features` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `daily_kilometer_rate` int(11) NOT NULL,
  `extra_kilometer_rate` decimal(10,2) NOT NULL,
  `minimum_driver_age` int(11) NOT NULL,
  `proof_of_ownership_photo` varchar(255) DEFAULT NULL,
  `licence_disk_photo` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `vehicles`
--

INSERT INTO `vehicles` (`id`, `make`, `model`, `year`, `colour`, `registration`, `vin_number`, `kilometers`, `vehicle_category`, `transmission`, `gearbox`, `fuel_type`, `front_exterior_photo`, `back_exterior_photo`, `daily_rate`, `weekly_rate`, `minimum_rental_period`, `booking_type`, `vehicle_features`, `daily_kilometer_rate`, `extra_kilometer_rate`, `minimum_driver_age`, `proof_of_ownership_photo`, `licence_disk_photo`) VALUES
(1, '', '', 0, '', '', '', 0, '', '', '', '', NULL, NULL, 0.00, 0.00, '1 day', 'Request book', '', 0, 0.00, 18, NULL, NULL),
(2, '', '', 0, '', '', '', 0, '', '', '', '', NULL, NULL, 0.00, 0.00, '1 day', 'Request book', '', 0, 0.00, 18, NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `agreements`
--
ALTER TABLE `agreements`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `vehicles`
--
ALTER TABLE `vehicles`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `agreements`
--
ALTER TABLE `agreements`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `vehicles`
--
ALTER TABLE `vehicles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
