-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 15, 2026 at 03:50 PM
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
-- Database: `nobarbareng_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `films`
--

CREATE TABLE `films` (
  `id` int(11) NOT NULL,
  `title` varchar(150) NOT NULL,
  `genre_id` int(11) NOT NULL,
  `release_year` int(11) NOT NULL,
  `duration_minutes` int(11) NOT NULL,
  `poster_url` varchar(255) NOT NULL,
  `video_url` varchar(255) NOT NULL,
  `synopsis` text NOT NULL,
  `base_views` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `films`
--

INSERT INTO `films` (`id`, `title`, `genre_id`, `release_year`, `duration_minutes`, `poster_url`, `video_url`, `synopsis`, `base_views`, `created_at`) VALUES
(1, 'Ragnamok', 1, 2023, 112, 'src/sampul/ragnamok.jpg', 'src/film/ragnamok.mp4', 'Seorang pelukis tua kembali ke kampung halaman dan menemukan rahasia keluarga yang lama terkubur.', 182400, '2026-11-15 11:34:12'),
(2, 'Suki Terakhir', 2, 2024, 128, 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600', 'https://www.w3schools.com/html/movie.mp4', 'Awak kapal antariksa berlomba mencari planet baru sebelum bumi tak lagi bisa dihuni.', 356200, '2026-11-15 11:34:12'),
(3, 'Dapur Mak Ijah', 3, 2022, 96, 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600', 'https://www.w3schools.com/html/mov_bbb.mp4', 'Warung kecil terancam tutup, tiga cucu nekat membuat kontes masak yang berakhir kacau.', 274100, '2026-11-15 11:34:12'),
(4, 'Malam di Rumah Tua', 4, 2023, 101, 'https://images.unsplash.com/photo-1505635552518-3448ff116af3?w=600', 'https://www.w3schools.com/html/movie.mp4', 'Sekelompok mahasiswa menginap di rumah kosong demi tugas riset dan mulai mendengar suara aneh.', 121500, '2026-11-15 11:34:12'),
(5, 'Jejak Sang Pendekar', 5, 2024, 118, 'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=600', 'https://www.w3schools.com/html/mov_bbb.mp4', 'Mantan pendekar dipaksa kembali bertarung demi melindungi desanya dari sindikat bersenjata.', 0, '2026-11-15 11:34:12'),
(6, 'Hujan di Bulan Juni', 6, 2021, 104, 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=600', 'https://www.w3schools.com/html/movie.mp4', 'Dua orang asing bertemu di halte setiap hujan turun, tanpa pernah saling bertukar nama.', 0, '2026-11-15 11:34:12'),
(7, 'parwowo', 9, 2026, 110, 'src/sampul/parwowo.jpeg', 'src/film/bad_apple.mp4', 'parwowo', 0, '2026-11-15 11:44:13');

-- --------------------------------------------------------

--
-- Table structure for table `genres`
--

CREATE TABLE `genres` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `genres`
--

INSERT INTO `genres` (`id`, `name`) VALUES
(5, 'Aksi'),
(1, 'Drama'),
(4, 'Horor'),
(8, 'Keluarga'),
(3, 'Komedi'),
(7, 'Misteri'),
(9, 'pacar_rangga'),
(6, 'Romantis'),
(2, 'Sci-Fi');

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` int(11) NOT NULL,
  `film_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `rating` tinyint(4) NOT NULL CHECK (`rating` between 1 and 5),
  `comment` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`id`, `film_id`, `user_id`, `rating`, `comment`, `created_at`, `updated_at`) VALUES
(1, 1, 2, 5, 'Sinematografi tajam dan alur cerita yang sangat kuat.', '2026-11-15 11:34:12', '2026-11-15 11:34:12'),
(2, 2, 2, 4, 'Konsep sci-fi yang solid dari awal sampai akhir.', '2026-11-15 11:34:12', '2026-11-15 11:34:12'),
(3, 7, 3, 5, 'woii', '2026-11-15 11:58:16', '2026-11-15 11:58:16'),
(4, 6, 3, 1, 'jelek', '2026-11-15 11:58:36', '2026-11-15 11:58:55'),
(7, 7, 4, 5, 'hebat', '2026-11-15 11:59:51', '2026-11-15 12:00:39'),
(10, 7, 5, 5, 'p', '2026-11-15 12:25:26', '2026-11-15 12:27:54');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('user','admin') DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `role`, `created_at`) VALUES
(1, 'Administrator', 'admin@nobarbareng.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'admin', '2026-11-15 11:34:12'),
(2, 'Nabil Zaki', 'nabil@example.com', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 'user', '2026-11-15 11:34:12'),
(3, 'user1', 'user1@gmail.com', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 'user', '2026-11-15 11:57:50'),
(4, 'user2', 'user2@gmail.com', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 'user', '2026-11-15 11:59:29'),
(5, 'user3', 'user3@gmail.com', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 'user', '2026-11-15 12:25:07');

-- --------------------------------------------------------

--
-- Table structure for table `watchlist`
--

CREATE TABLE `watchlist` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `film_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `watchlist`
--

INSERT INTO `watchlist` (`id`, `user_id`, `film_id`, `created_at`) VALUES
(2, 5, 7, '2026-11-15 12:39:33');

-- --------------------------------------------------------

--
-- Table structure for table `watch_history`
--

CREATE TABLE `watch_history` (
  `id` int(11) NOT NULL,
  `film_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `progress_ratio` decimal(5,4) DEFAULT 0.0000,
  `watch_count` int(11) DEFAULT 1,
  `last_watched_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `watch_history`
--

INSERT INTO `watch_history` (`id`, `film_id`, `user_id`, `progress_ratio`, `watch_count`, `last_watched_at`) VALUES
(1, 7, 1, 0.1117, 4, '2026-11-15 12:10:49'),
(3, 1, 1, 0.1267, 1, '2026-11-15 11:55:35'),
(5, 7, 3, 0.0149, 1, '2026-11-15 11:58:22'),
(6, 6, 3, 1.0000, 1, '2026-11-15 11:59:09'),
(7, 7, 4, 0.0000, 3, '2026-11-15 12:00:29'),
(11, 7, 5, 0.4924, 7, '2026-11-15 12:28:35');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `films`
--
ALTER TABLE `films`
  ADD PRIMARY KEY (`id`),
  ADD KEY `genre_id` (`genre_id`);

--
-- Indexes for table `genres`
--
ALTER TABLE `genres`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_film` (`film_id`,`user_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `watchlist`
--
ALTER TABLE `watchlist`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_watchlist` (`user_id`,`film_id`),
  ADD KEY `film_id` (`film_id`);

--
-- Indexes for table `watch_history`
--
ALTER TABLE `watch_history`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_watch` (`film_id`,`user_id`),
  ADD KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `films`
--
ALTER TABLE `films`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `genres`
--
ALTER TABLE `genres`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `watchlist`
--
ALTER TABLE `watchlist`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `watch_history`
--
ALTER TABLE `watch_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `films`
--
ALTER TABLE `films`
  ADD CONSTRAINT `films_ibfk_1` FOREIGN KEY (`genre_id`) REFERENCES `genres` (`id`);

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`film_id`) REFERENCES `films` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `watchlist`
--
ALTER TABLE `watchlist`
  ADD CONSTRAINT `watchlist_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `watchlist_ibfk_2` FOREIGN KEY (`film_id`) REFERENCES `films` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `watch_history`
--
ALTER TABLE `watch_history`
  ADD CONSTRAINT `watch_history_ibfk_1` FOREIGN KEY (`film_id`) REFERENCES `films` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `watch_history_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
