DROP DATABASE IF EXISTS nobarbareng_db;
CREATE DATABASE nobarbareng_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE nobarbareng_db;

-- 1. Tabel Pengguna dengan Role (admin / user)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabel Genre Film
CREATE TABLE genres (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- 3. Tabel Film
CREATE TABLE films (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    genre_id INT NOT NULL,
    release_year INT NOT NULL,
    duration_minutes INT NOT NULL,
    poster_url VARCHAR(255) NOT NULL,
    video_url VARCHAR(255) NOT NULL,
    synopsis TEXT NOT NULL,
    base_views INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (genre_id) REFERENCES genres(id) ON DELETE RESTRICT
);

-- 4. Tabel Komentar & Rating Pengguna
CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    film_id INT NOT NULL,
    user_id INT NOT NULL,
    rating TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_film (film_id, user_id),
    FOREIGN KEY (film_id) REFERENCES films(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 5. Tabel Riwayat Tontonan & Ditonton Terbanyak
CREATE TABLE watch_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    film_id INT NOT NULL,
    user_id INT NOT NULL,
    progress_ratio DECIMAL(5,4) DEFAULT 0.0000,
    watch_count INT DEFAULT 1,
    last_watched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_watch (film_id, user_id),
    FOREIGN KEY (film_id) REFERENCES films(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Data Awal Genre
INSERT INTO genres (name) VALUES 
('Drama'), ('Sci-Fi'), ('Komedi'), ('Horor'), ('Aksi'), ('Romantis'), ('Misteri'), ('Keluarga');

-- Data Awal Akun:
-- Admin -> admin@nobarbareng.com (password: admin123)
-- User  -> nabil@example.com (password: 123456)
INSERT INTO users (name, email, password_hash, role) VALUES 
('Administrator', 'admin@nobarbareng.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'admin'),
('Nabil Zaki', 'nabil@example.com', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 'user');

-- Data Awal Film
INSERT INTO films (title, genre_id, release_year, duration_minutes, poster_url, video_url, synopsis, base_views) VALUES
('Ragnamok', 1, 2023, 112, 'src/sampul/ragnamok.jpg', 'src/film/ragnamok.mp4', 'Seorang pelukis tua kembali ke kampung halaman dan menemukan rahasia keluarga yang lama terkubur.', 182400),
('Suki Terakhir', 2, 2024, 128, 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600', 'https://www.w3schools.com/html/movie.mp4', 'Awak kapal antariksa berlomba mencari planet baru sebelum bumi tak lagi bisa dihuni.', 356200),
('Dapur Mak Ijah', 3, 2022, 96, 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600', 'https://www.w3schools.com/html/mov_bbb.mp4', 'Warung kecil terancam tutup, tiga cucu nekat membuat kontes masak yang berakhir kacau.', 274100),
('Malam di Rumah Tua', 4, 2023, 101, 'https://images.unsplash.com/photo-1505635552518-3448ff116af3?w=600', 'https://www.w3schools.com/html/movie.mp4', 'Sekelompok mahasiswa menginap di rumah kosong demi tugas riset dan mulai mendengar suara aneh.', 121500),
('Jejak Sang Pendekar', 5, 2024, 118, 'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=600', 'https://www.w3schools.com/html/mov_bbb.mp4', 'Mantan pendekar dipaksa kembali bertarung demi melindungi desanya dari sindikat bersenjata.', 418900),
('Hujan di Bulan Juni', 6, 2021, 104, 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=600', 'https://www.w3schools.com/html/movie.mp4', 'Dua orang asing bertemu di halte setiap hujan turun, tanpa pernah saling bertukar nama.', 198300);

-- Data Awal Komentar & Rating
INSERT INTO reviews (film_id, user_id, rating, comment) VALUES
(1, 2, 5, 'Sinematografi tajam dan alur cerita yang sangat kuat.'),
(2, 2, 4, 'Konsep sci-fi yang solid dari awal sampai akhir.');