# 🎬 NobarBareng — Platform Streaming Film (Neo-Brutalism Edition)

Aplikasi web streaming film *full-stack* menggunakan **Node.js, Express, MySQL**, dan **YouTube IFrame API** dengan gaya desain **Neo-Brutalism**. Dilengkapi fitur katalog film per genre, peringkat ditonton terbanyak, *watchlist* pribadi, riwayat menonton otomatis, sistem rating/komentar, serta **Panel Administrator (CRUD Film, Genre, Moderasi Komentar & Manajemen User)**.

---

## 📋 1. Persiapan Software di Laptop (Wajib Diinstal)

Karena aplikasi ini menggunakan backend Node.js dan database MySQL, pastikan dua software berikut sudah terinstal di laptop Anda selain **VS Code**:

1. **Node.js (Versi LTS)**  
   * Unduh di: [https://nodejs.org/](https://nodejs.org/)
   * Instal seperti biasa (*Next > Next > Finish*).
   * Untuk mengecek apakah sudah terpasang, buka Terminal di VS Code (`Ctrl + ~`) dan ketik:
     ```bash
     node -v
     ```
2. **XAMPP (untuk MySQL & phpMyAdmin)**  
   * Unduh di: [https://www.apachefriends.org/](https://www.apachefriends.org/)
   * Instal seperti biasa untuk menjalankan server database MySQL lokal.

---

## 🗄️ 2. Setup Database MySQL

1. Buka aplikasi **XAMPP Control Panel**.
2. Klik tombol **Start** pada baris **Apache** dan **MySQL** hingga berwarna hijau.
3. Buka browser dan kunjungi: **`http://localhost/phpmyadmin`**
4. Klik menu **New** (Baru) di panel sebelah kiri, lalu buat database dengan nama persis seperti ini:
   ```text
   nobarbareng_db
   ```
5. Setelah masuk ke database `nobarbareng_db`, klik tab **Import** di bagian atas.
6. Klik **Choose File**, pilih file **`database.sql`** yang ada di dalam folder proyek ini, lalu gulir ke bawah dan klik tombol **Import / Go**.

---

## 🚀 3. Cara Menjalankan Proyek di VS Code

1. Ekstrak folder proyek ini, lalu buka foldernya menggunakan **VS Code** (`File > Open Folder...`).
2. Buka Terminal di dalam VS Code dengan menekan tombol **`Ctrl + ~`** (atau menu `Terminal > New Terminal`).
3. Instal seluruh pustaka/dependensi proyek (*Express, MySQL2, Multer*) dengan menjalankan perintah:
   ```bash
   npm install
   ```
   *(Tunggu hingga proses unduhan selesai dan folder `node_modules` muncul).*
4. Jalankan server aplikasi dengan perintah:
   ```bash
   npm start
   ```
5. Jika muncul pesan `Server Brutalism NobarBareng aktif di http://localhost:3000`, buka browser Anda dan akses:
   👉 **[http://localhost:3000](http://localhost:3000)**

---

## 🔑 4. Akun Bawaan untuk Pengujian (Login)

Anda dapat langsung mencoba fitur aplikasi menggunakan akun berikut atau mendaftar akun baru melalui tab **Daftar**:

| Role | Email | Kata Sandi | Hak Akses |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@nobarbareng.com` | `admin123` | Akses **Panel Admin** (CRUD Film, Upload Poster/MP4, Kelola Genre, Moderasi Komentar, Ubah Role User) |
| **User** | `nabil@example.com` | `123456` | Menonton film, menyimpan Watchlist, melanjutkan menit terakhir, memberi rating & komentar |

---

## 🛠️ 5. Pemecahan Masalah Umum (Troubleshooting)

* **Error Koneksi Database (`ER_ACCESS_DENIED_ERROR`):**  
  Buka file `server.js` di VS Code, periksa bagian `mysql.createPool({...})`. Secara default XAMPP tidak memakai password (`password: ''`). Jika MySQL Anda menggunakan password, sesuaikan isinya di file tersebut.
* **Perubahan Kode Tidak Muncul di Browser:**  
  Tekan **`Ctrl + Shift + R`** (*Hard Refresh*) pada browser agar cache file CSS/JS lama terhapus.
* **Mengubah File Backend (`server.js`):**  
  Setiap kali mengedit `server.js`, matikan server di terminal dengan menekan **`Ctrl + C`**, lalu jalankan ulang **`npm start`**.