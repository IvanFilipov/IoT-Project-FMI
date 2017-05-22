-- phpMyAdmin SQL Dump
-- version 4.6.5.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: 22 май 2017 в 17:11
-- Версия на сървъра: 10.1.21-MariaDB
-- PHP Version: 7.1.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `iot`
--

-- --------------------------------------------------------

--
-- Структура на таблица `data`
--

CREATE TABLE `data` (
  `id` int(10) UNSIGNED NOT NULL,
  `unic_id` varchar(50) CHARACTER SET utf8 DEFAULT NULL,
  `temperature` int(11) DEFAULT NULL,
  `moment_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Схема на данните от таблица `data`
--

INSERT INTO `data` (`id`, `unic_id`, `temperature`, `moment_time`) VALUES
(1, 'gosho', NULL, '2017-05-05 14:24:38'),
(2, 'gosho', 32, '2017-05-05 14:25:42'),
(3, 'gosho', 32, '2017-05-05 14:26:42'),
(4, 'df30b2e6a23765', 32, '2017-05-05 14:28:17'),
(5, 'testtesttesttesttesttest', 42, '2017-05-05 15:23:36'),
(6, 'testtesttesttesttesttest', 42, '2017-05-05 15:24:16'),
(7, 'testtesttesttesttesttest', 42, '2017-05-05 15:24:17'),
(8, 'testtesttesttesttesttest', 42, '2017-05-05 15:24:17'),
(9, 'testtesttesttesttesttest', 42, '2017-05-05 15:24:18'),
(10, 'testtesttesttesttesttest', 42, '2017-05-05 15:24:20'),
(11, 'gosho', 42, '2017-05-05 15:26:26'),
(12, 'aaa', 42, '2017-05-05 19:48:32'),
(13, 'gosho', 52, '2017-05-05 20:32:45'),
(14, 'name', 52, '2017-05-10 00:32:27'),
(15, 'name', 52, '2017-05-10 00:32:41'),
(16, 'name', 52, '2017-05-10 00:33:37'),
(17, 'ceco', 52, '2017-05-10 16:58:42'),
(18, 'ceco', 32, '2017-05-10 16:59:00'),
(19, 'ceco', 35, '2017-05-10 19:36:59'),
(20, 'name', 35, '2017-05-10 19:37:23'),
(21, 'morskiq', 35, '2017-05-10 21:10:42'),
(22, 'morskiq', 35, '2017-05-17 17:40:05'),
(23, 'morskiq', 35, '2017-05-17 17:41:33'),
(24, 'morskiq', 35, '2017-05-17 17:43:52'),
(25, 'morskiq', 35, '2017-05-17 17:43:57'),
(26, 'ddd', 35, '2017-05-17 21:23:47'),
(27, 'ddd', 35, '2017-05-17 21:31:50'),
(28, 'ddd', 35, '2017-05-17 21:33:44'),
(29, 'ddd', 35, '2017-05-17 21:34:09'),
(30, 'ddd', 35, '2017-05-17 21:36:25'),
(31, 'ddd', 35, '2017-05-17 21:37:01'),
(32, 'ddd', 35, '2017-05-17 21:37:12'),
(33, 'ddd', 35, '2017-05-17 21:37:41'),
(34, 'ddd', 35, '2017-05-17 21:37:51'),
(35, 'ddd', 35, '2017-05-17 21:38:01'),
(84, 'ddd', 35, '2017-05-17 22:08:54'),
(87, NULL, NULL, '2017-05-18 00:31:31'),
(88, '760174', 10, '2017-05-18 00:32:12'),
(89, '760174', 10, '2017-05-18 00:34:18'),
(90, '760174', 10, '2017-05-18 00:35:52'),
(91, '760174', 10, '2017-05-18 00:36:05'),
(92, 'ddd', 35, '2017-05-18 00:36:15'),
(93, 'ddd', 35, '2017-05-18 00:36:47'),
(94, 'ddd', 35, '2017-05-18 00:45:34'),
(95, '760174', 10, '2017-05-18 00:45:41'),
(96, '760174', 5, '2017-05-22 01:40:56'),
(97, '760174', 5, '2017-05-22 01:40:58'),
(98, '760174', 5, '2017-05-22 01:40:59'),
(99, '760174', 7, '2017-05-22 01:41:02'),
(100, '760174', 9, '2017-05-22 01:41:05'),
(101, '760174', 6, '2017-05-22 01:41:08'),
(102, '760174', 8, '2017-05-22 01:41:13'),
(103, '760174', 15, '2017-05-22 01:41:16'),
(104, '760174', 8, '2017-05-22 01:42:26'),
(105, '760174', 9, '2017-05-22 01:57:31'),
(106, '760174', 9, '2017-05-22 01:57:36'),
(107, '760174', 12, '2017-05-22 01:57:54'),
(108, '760174', 13, '2017-05-22 01:57:58'),
(109, '760174', 12, '2017-05-22 01:58:00'),
(110, '760174', 11, '2017-05-22 01:58:03'),
(111, '760174', 12, '2017-05-22 02:02:50'),
(112, '760174', 12, '2017-05-22 02:02:54'),
(113, '760174', 12, '2017-05-22 02:02:58'),
(114, '760174', 13, '2017-05-22 02:03:00'),
(115, '760174', 17, '2017-05-22 02:03:04'),
(116, '760174', 16, '2017-05-22 02:03:07'),
(117, '760174', 15, '2017-05-22 02:03:09'),
(118, '760174', 12, '2017-05-22 02:03:13'),
(119, '760174', 11, '2017-05-22 02:03:18'),
(120, '760174', 13, '2017-05-22 02:03:26'),
(121, '760174', 17, '2017-05-22 02:03:28'),
(122, '760174', 18, '2017-05-22 02:03:31'),
(123, '760174', 21, '2017-05-22 02:03:36'),
(124, '760174', 20, '2017-05-22 02:11:07'),
(125, '760174', 20, '2017-05-22 02:11:10'),
(126, '760174', 19, '2017-05-22 02:11:15'),
(127, '760174', 18, '2017-05-22 02:11:19'),
(128, '760174', 18, '2017-05-22 02:11:23'),
(129, '760174', 17, '2017-05-22 02:11:26'),
(130, '760174', 17, '2017-05-22 02:11:29'),
(131, '760174', 17, '2017-05-22 02:11:36'),
(132, '760174', 18, '2017-05-22 02:11:40'),
(133, '760174', 19, '2017-05-22 02:11:43'),
(134, 'aaa', 38, '2017-05-22 02:15:36'),
(135, 'aaa', 38, '2017-05-22 02:17:11');

-- --------------------------------------------------------

--
-- Структура на таблица `ESPS`
--

CREATE TABLE `ESPS` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `unic_id` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` int(10) UNSIGNED NOT NULL,
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `public` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Схема на данните от таблица `ESPS`
--

INSERT INTO `ESPS` (`id`, `name`, `unic_id`, `user_id`, `username`, `public`) VALUES
(1, 'pesho', 'gosho', 3, '', 0),
(2, 'ESP2', 'df30b2e6a23765', 2, '', 0),
(3, 'ESP3', '3d0efc8d31874f', 1, '', 0),
(4, 'ESP4', 'email@sdf4tcom', 29, '', 0),
(5, 'ESP5', '3d0dfc8d3f8r4f', 29, '', 0),
(6, 'sasha', 'tatqna', 5, '', 0),
(28, 'testtesttesttesttesttest', 'testtesttesttesttesttest', 0, 'mirko', 0),
(33, 'name', 'gosho', 0, 'mirko', 1),
(34, 'aaa', 'aaa', 0, 'aaa', 1),
(39, 'tedassddsa', 'dsada', 0, 'aaa', 0),
(74, 'testtesttesttesttesttest', 'testtesttesttesttedddsttest', 0, 'mirko', 0),
(79, 'peshko', 'peshkov', 0, 'mirko', 0),
(97, 'testtesttesttesttesttest', 'testtesttesttesttesttest', 0, 'vv', 0),
(100, 'testtesttesttesttesttest', 'testtesttesttestteadssttest', 0, 'vv', 0),
(103, 'testtesttesttesttesttest', 'qqq', 0, 'vv', 0),
(104, 'sasha', 'pasha', 0, 'vv', 0),
(106, 'testtesttesttesttesttest', 'testtesttesttesttesgttest', 0, 'mirko', 0),
(108, 'testtesttesttesttesttest', 'what', 0, 'mirko', 0),
(111, 'ceco', 'ceco', 0, 'ceco', 0),
(112, 'testtesttesttesttesttest', 'name', 0, 'mirko', 0),
(114, 'pesho', 'morskiq', 0, 'mirko', 0),
(115, 'peshooooo', 'yyayayayaya', 0, 'mirko', 0),
(119, 'yyqyqyqy', 'yqyqyqyqy', 0, 'mirko', 0),
(121, 'testtesttesttesttesttest', '760174', 0, 'mirko', 1),
(122, 'ddd', 'ddd', 0, 'mirko', 1),
(130, 'ppp', 'ppp', 0, 'mirko', 0),
(134, 'fepo', 'asdsadsaads', 0, 'mirko', 1);

-- --------------------------------------------------------

--
-- Структура на таблица `users`
--

CREATE TABLE `users` (
  `id` int(10) UNSIGNED NOT NULL,
  `username` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `authKey` varchar(50) CHARACTER SET utf8 NOT NULL DEFAULT 'TEST'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Схема на данните от таблица `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `authKey`) VALUES
(1, 'name1', 'email@adfasd.com', '12jd423r93jf', 'TEST'),
(2, 'name2', 'sdfsdfsd', 'sdf4te3fgdf', 'TEST'),
(3, '123123123', 'asdasd@abv.bg', '9af15b336e6a9619928537df30b2e6a2376569fcf9d7e773eccede65606529a0', 'TEST'),
(4, '324rdfwerftr', 'gsgdgf@gmail.com', 'c0877511f833d0efc8d31874f00e25c7de09d3e59bacf2cb5a20e455aa641d7c', 'TEST'),
(5, 'dsaada', 'asd', 'asd', 'TEST'),
(6, 'dsaadadd', 'asd', 'asd', 'TEST'),
(7, 'dsaadaddd', 'asd', 'asd', 'TEST'),
(8, 'gsdfds', 'dasd', 'asd', 'TEST'),
(9, 'miro', 'dasd', 'asd', 'TEST'),
(11, 'testo', 'testov', '601f1889667efaebb33b8c12572835da3f027f78', 'TEST'),
(12, 'asd', 'asd', 'f10e2821bbbea527ea02200352313bc059445190', 'TEST'),
(29, 'mirko', 'asd', 'f10e2821bbbea527ea02200352313bc059445190', 'RDdtbGtzgvEqrkDCIc2hWt29crrss5riive4SEEI'),
(30, 'asdd', 'asd', 'f10e2821bbbea527ea02200352313bc059445190', 'HMk2E0sOq8oLtSll4rwq6GUEUdVnutgEbgtKa5YE'),
(31, 'qwe', 'asd', 'f10e2821bbbea527ea02200352313bc059445190', 'VTcTecxkdwwLaVHZ3eM7BaDqsYtQJV6ZGXDAbeFf'),
(32, 'zxc', 'zxc', 'a938dfdfbaa1f25ccbc39e16060f73c44e5ef0dd', 'AvojfKtxrzAsVxuNoavXxQ1VZUgRwjQtZoE0Mu7f'),
(33, 'poi', 'poi', 'd1d1aa47a79fd596d8297d0e058f5b65118858f6', 'BT1eFmssKizSeVA9U13Mvl6yBdvKCTgM7Ti450m7'),
(34, 'mnb', 'mnb', '8dc8a0a7729b4e4e5039734523cffedbc498ac76', 'Cu2F2xIsAYPTKLSbzZ0S8QztoFFa6dMBSF8yUnYj'),
(35, 'lkj', 'lkj', '3279f04351a1a9cbe85672a68c451266efde739e', 'odr5Ds1IacESl3vxQNbcvyq8K51EdpzC5XbOywgp'),
(36, 'iii', 'iii', '425ffc1422dc4f32528bd9fd5af355fdb5c96192', 'W4n4ZU6MjR70BU6dmId6Jj75EHedP9c8PYnmfSH2'),
(37, 'fff', 'fff', 'f6949a8c7d5b90b4a698660bbfb9431503fbb995', 'Hpb6oAboOeOPDUz84I8PjvN0LingPu8scpKofuIC'),
(38, 'ddd', 'ddd', '9c969ddf454079e3d439973bbab63ea6233e4087', 'ZgEISzsFlTi9271PU9PGFk7Zvs1vwVtd6zYmzdba'),
(39, 'sss', 'sss', 'bf9661defa3daecacfde5bde0214c4a439351d4d', '1fCnSHmpeyrSHpUMSICZpGaXhC0NrsUBcNxvGiMK'),
(40, 'dddd', 'dddd', '01464e1616e3fdd5c60c0cc5516c1d1454cc4185', 'ixAULbUXyy35rhsVYTqIugJ0Btr6TxhEJ0X9UGNa'),
(41, 'aaa', 'aaa', '7e240de74fb1ed08fa08d38063f6a6a91462a815', 'Kvx06t8fBsWFavuy59a3ahuFh3KNI9rHwNpcB8aB'),
(42, 'qq', 'qq', 'a43801ccfbbd62f3fe23cfc37f52394564715a96', 'TEST'),
(43, 'ss', 'ss', '8e71c639fe038842681b0f62219007a9fb1888cc', 'TEST'),
(44, 'zzz', 'zzz', '191abae8a1c39665aad94b37fb2953db280b64d8', 'TEST'),
(45, 'zz', 'zz', 'd7dacae2c968388960bf8970080a980ed5c5dcb7', '5FAjl1OG0czv0ZzXSmtCsxR8aaUj1enELLpRcaCW'),
(46, 'vv', 'vv', '4cf997735475afd79f8711e22efaa9d306294785', 'CIVWRDrhZf9v598TKve5L8NmA5n8dKaDo5B697x0'),
(47, 'ggg', 'ggg', '07dcd371560bc43c48f56a2f55739ac66741d59d', '3HQ3CCxe0TFhwW1PsymNmVeuXpRn28JAzGDUn3Gy'),
(48, 'ceco', 'ceco', '472ac1195083c0bddb95714263751e4174e6688f', 'cyce7huDQUFKiqyJvycJFklSEgHVGj5lQwCorO7c'),
(49, 'qqq', 'ddd', 'a056c8d05ae9ac6ca180bc991b93b7ffe37563e0', 'UQDoUsMzCa2uowmLtJMdAzCkuKm06SPhPyGgdME2'),
(50, 'xxx', 'xxx', 'b60d121b438a380c343d5ec3c2037564b82ffef3', '8EQg805ZJqhRREFhHnLBsnIffdpbisU5xuIg9rJC'),
(51, 'nnn', 'nnn', '7f88bb68e14d386d89af3cf317f6f7af1d39246c', 'kOW1NHaXMTeU4XCiMx7r6XajOOJm82wbt1Hc1vT8'),
(52, 'kjh', 'kjh', '0b6d42984f80f02e04ef01980ad76165ab8191ef', 'WYS10aMykIixCvIeiTgl7uogRy4uIKn9N4DHkE4F');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `data`
--
ALTER TABLE `data`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ESPS`
--
ALTER TABLE `ESPS`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unic_id_2` (`unic_id`,`username`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `data`
--
ALTER TABLE `data`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=136;
--
-- AUTO_INCREMENT for table `ESPS`
--
ALTER TABLE `ESPS`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=135;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
