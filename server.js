const express = require('express');
const mysql = require('mysql2/promise');
const crypto = require('crypto');
const path = require('path');

const multer = require('multer');
const fs = require('fs');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nobarbareng_db',
    waitForConnections: true,
    connectionLimit: 10
});

const hashPwd = (pw) => crypto.createHash('sha256').update(pw).digest('hex');

// Middleware Verifikasi Role Admin
async function requireAdmin(req, res, next) {
    const adminId = req.headers['x-user-id'];
    if (!adminId) return res.status(401).json({ error: 'Akses ditolak. Header user tidak ditemukan.' });
    try {
        const [rows] = await db.query('SELECT role FROM users WHERE id = ?', [adminId]);
        if (!rows.length || rows[0].role !== 'admin') {
            return res.status(403).json({ error: 'Terlarang. Hanya Admin yang dapat mengelola data film.' });
        }
        next();
    } catch (err) {
        res.status(500).json({ error: 'Gagal memverifikasi hak akses admin.' });
    }
}

// 1. Autentikasi (Register & Login mengembalikan role)
app.post('/api/auth/register', async(req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password || password.length < 6) {
        return res.status(400).json({ error: 'Nama, email valid, dan sandi minimal 6 karakter wajib diisi.' });
    }
    try {
        const [result] = await db.query(
            'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)', [name.trim(), email.trim().toLowerCase(), hashPwd(password), 'user']
        );
        res.json({ id: result.insertId, name: name.trim(), email: email.trim().toLowerCase(), role: 'user' });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Email sudah terdaftar.' });
        res.status(500).json({ error: 'Gagal mendaftarkan pengguna.' });
    }
});

app.post('/api/auth/login', async(req, res) => {
    const { email, password } = req.body;
    try {
        const [rows] = await db.query(
            'SELECT id, name, email, role FROM users WHERE email = ? AND password_hash = ?', [email.trim().toLowerCase(), hashPwd(password)]
        );
        if (!rows.length) return res.status(401).json({ error: 'Email atau kata sandi salah.' });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: 'Kesalahan server saat login.' });
    }
});

// 2. Ambil Genre
app.get('/api/genres', async(req, res) => {
    try {
        const [rows] = await db.query('SELECT id, name FROM genres ORDER BY name ASC');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Gagal memuat genre.' });
    }
});

// 3. READ: Ambil Semua Film
app.get('/api/films', async(req, res) => {
    try {
        const query = `
            SELECT 
                f.id, f.title, f.genre_id, g.name AS genre, f.release_year, f.duration_minutes,
                f.poster_url, f.video_url, f.synopsis, f.base_views,
                COALESCE(ROUND(AVG(r.rating), 1), 0.0) AS avg_rating,
                COUNT(DISTINCT r.id) AS total_reviews,
                (f.base_views + COALESCE(SUM(w.watch_count), 0)) AS total_views
            FROM films f
            JOIN genres g ON f.genre_id = g.id
            LEFT JOIN reviews r ON f.id = r.film_id
            LEFT JOIN watch_history w ON f.id = w.film_id
            GROUP BY f.id
            ORDER BY f.id DESC
        `;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Gagal memuat katalog film.' });
    }
});

// 4. CREATE (Admin): Tambah Film Baru
app.post('/api/films', requireAdmin, async(req, res) => {
    const { title, genre_id, release_year, duration_minutes, poster_url, video_url, synopsis, base_views } = req.body;
    if (!title || !genre_id || !release_year || !duration_minutes || !poster_url || !video_url || !synopsis) {
        return res.status(400).json({ error: 'Semua field wajib diisi.' });
    }
    try {
        const [result] = await db.query(
            `INSERT INTO films (title, genre_id, release_year, duration_minutes, poster_url, video_url, synopsis, base_views)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [title.trim(), genre_id, release_year, duration_minutes, poster_url.trim(), video_url.trim(), synopsis.trim(), base_views || 0]
        );
        res.json({ id: result.insertId, message: 'Film berhasil ditambahkan.' });
    } catch (err) {
        res.status(500).json({ error: 'Gagal menambahkan film ke database.' });
    }
});

// 5. UPDATE (Admin): Ubah Data Film
app.put('/api/films/:id', requireAdmin, async(req, res) => {
    const { title, genre_id, release_year, duration_minutes, poster_url, video_url, synopsis, base_views } = req.body;
    try {
        await db.query(
            `UPDATE films SET 
                title = ?, genre_id = ?, release_year = ?, duration_minutes = ?,
                poster_url = ?, video_url = ?, synopsis = ?, base_views = ?
             WHERE id = ?`, [title.trim(), genre_id, release_year, duration_minutes, poster_url.trim(), video_url.trim(), synopsis.trim(), base_views || 0, req.params.id]
        );
        res.json({ message: 'Data film berhasil diperbarui.' });
    } catch (err) {
        res.status(500).json({ error: 'Gagal memperbarui film.' });
    }
});

// 6. DELETE (Admin): Hapus Film
app.delete('/api/films/:id', requireAdmin, async(req, res) => {
    try {
        await db.query('DELETE FROM films WHERE id = ?', [req.params.id]);
        res.json({ message: 'Film berhasil dihapus.' });
    } catch (err) {
        res.status(500).json({ error: 'Gagal menghapus film.' });
    }
});

// 7. Reviews & Rating
app.get('/api/films/:id/reviews', async(req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT r.id, r.user_id, u.name AS user_name, r.rating, r.comment, r.updated_at
            FROM reviews r
            JOIN users u ON r.user_id = u.id
            WHERE r.film_id = ?
            ORDER BY r.updated_at DESC
        `, [req.params.id]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Gagal memuat ulasan.' });
    }
});

app.post('/api/films/:id/reviews', async(req, res) => {
    const { user_id, rating, comment } = req.body;
    if (!user_id || !rating || !comment.trim()) {
        return res.status(400).json({ error: 'Rating dan komentar wajib diisi.' });
    }
    try {
        await db.query(`
            INSERT INTO reviews (film_id, user_id, rating, comment)
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE rating = VALUES(rating), comment = VALUES(comment)
        `, [req.params.id, user_id, rating, comment.trim()]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Gagal menyimpan ulasan.' });
    }
});

// 8. Watch History & Most Watched
app.post('/api/watch', async(req, res) => {
    const { user_id, film_id, progress_ratio, increment_view } = req.body;
    if (!user_id || !film_id) return res.status(400).json({ error: 'Data tidak valid.' });
    try {
        if (increment_view) {
            await db.query(`
                INSERT INTO watch_history (film_id, user_id, progress_ratio, watch_count)
                VALUES (?, ?, ?, 1)
                ON DUPLICATE KEY UPDATE 
                    watch_count = watch_count + 1,
                    progress_ratio = VALUES(progress_ratio)
            `, [film_id, user_id, progress_ratio || 0]);
        } else {
            await db.query(`
                UPDATE watch_history SET progress_ratio = ? WHERE film_id = ? AND user_id = ?
            `, [progress_ratio, film_id, user_id]);
        }
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Gagal memperbarui riwayat.' });
    }
});

app.get('/api/users/:userId/history', async(req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT w.film_id, w.progress_ratio, w.last_watched_at, f.title, g.name AS genre, f.poster_url
            FROM watch_history w
            JOIN films f ON w.film_id = f.id
            JOIN genres g ON f.genre_id = g.id
            WHERE w.user_id = ?
            ORDER BY w.last_watched_at DESC
        `, [req.params.userId]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Gagal memuat riwayat.' });
    }
});

// Jalankan otomatis saat server start untuk memastikan tabel watchlist tersedia
(async() => {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS watchlist (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                film_id INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE KEY unique_user_watchlist (user_id, film_id),
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (film_id) REFERENCES films(id) ON DELETE CASCADE
            )
        `);
        console.log("Tabel watchlist siap digunakan.");
    } catch (err) {
        console.error("Gagal memastikan tabel watchlist:", err.message);
    }
})();

// Ambil daftar ID film di watchlist user
app.get('/api/users/:userId/watchlist', async(req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT film_id FROM watchlist WHERE user_id = ? ORDER BY created_at DESC', [req.params.userId]
        );
        res.json(rows.map(r => Number(r.film_id)));
    } catch (err) {
        console.error("Error GET watchlist:", err);
        res.status(500).json({ error: 'Gagal memuat watchlist.' });
    }
});

// Toggle Simpan / Hapus film dari watchlist user
app.post('/api/watchlist/toggle', async(req, res) => {
    const { user_id, film_id } = req.body;
    if (!user_id || !film_id) {
        return res.status(400).json({ error: 'User ID atau Film ID tidak valid.' });
    }

    try {
        // Pastikan user benar-benar ada di database (antisipasi sesi localStorage lama setelah reset DB)
        const [userCheck] = await db.query('SELECT id FROM users WHERE id = ?', [user_id]);
        if (!userCheck.length) {
            return res.status(401).json({ error: 'Sesi akun kedaluwarsa. Silakan keluar dan masuk ulang.' });
        }

        const [existing] = await db.query(
            'SELECT id FROM watchlist WHERE user_id = ? AND film_id = ?', [user_id, film_id]
        );

        if (existing.length) {
            await db.query('DELETE FROM watchlist WHERE user_id = ? AND film_id = ?', [user_id, film_id]);
            res.json({ saved: false });
        } else {
            await db.query('INSERT INTO watchlist (user_id, film_id) VALUES (?, ?)', [user_id, film_id]);
            res.json({ saved: true });
        }
    } catch (err) {
        console.error("Error POST watchlist:", err);
        res.status(500).json({ error: 'Gagal menyimpan watchlist: ' + err.message });
    }
});



// Pastikan folder penyimpanan upload lokal tersedia
const uploadDirs = [
    path.join(__dirname, 'public/src/sampul'),
    path.join(__dirname, 'public/src/film')
];
uploadDirs.forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Konfigurasi Multer untuk Upload Poster & Video Lokal
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isVideo = file.mimetype.startsWith('video/');
        cb(null, path.join(__dirname, isVideo ? 'public/src/film' : 'public/src/sampul'));
    },
    filename: (req, file, cb) => {
        const safeName = Date.now() + '-' + file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
        cb(null, safeName);
    }
});
const upload = multer({ storage });

// 1. Upload File Lokal (Admin) -> Mengembalikan path relatif untuk disimpan ke MySQL
app.post('/api/admin/upload', requireAdmin, upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'Tidak ada file yang diunggah.' });
    const isVideo = req.file.mimetype.startsWith('video/');
    const relativeUrl = `${isVideo ? 'src/film' : 'src/sampul'}/${req.file.filename}`;
    res.json({ url: relativeUrl });
});

// 2. Statistik Dashboard Admin
app.get('/api/admin/stats', requireAdmin, async(req, res) => {
    try {
        const [
            [filmStat]
        ] = await db.query('SELECT COUNT(*) AS total_films, COALESCE(SUM(base_views), 0) AS base_views FROM films');
        const [
            [watchStat]
        ] = await db.query('SELECT COALESCE(SUM(watch_count), 0) AS real_views FROM watch_history');
        const [
            [userStat]
        ] = await db.query('SELECT COUNT(*) AS total_users FROM users');
        const [
            [revStat]
        ] = await db.query('SELECT COUNT(*) AS total_reviews FROM reviews');

        res.json({
            total_films: filmStat.total_films,
            total_users: userStat.total_users,
            total_reviews: revStat.total_reviews,
            total_views: Number(filmStat.base_views) + Number(watchStat.real_views)
        });
    } catch (err) {
        res.status(500).json({ error: 'Gagal memuat statistik admin.' });
    }
});

// 3. CRUD Genre (Tambah & Hapus Genre)
app.post('/api/genres', requireAdmin, async(req, res) => {
    const { name } = req.body;
    if (!name || !name.trim()) return res.status(400).json({ error: 'Nama genre wajib diisi.' });
    try {
        const [result] = await db.query('INSERT INTO genres (name) VALUES (?)', [name.trim()]);
        res.json({ id: result.insertId, name: name.trim() });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Genre sudah ada.' });
        res.status(500).json({ error: 'Gagal menambah genre.' });
    }
});

app.delete('/api/genres/:id', requireAdmin, async(req, res) => {
    try {
        await db.query('DELETE FROM genres WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        // Gagal jika masih dipakai oleh film (ON DELETE RESTRICT)
        res.status(400).json({ error: 'Genre tidak dapat dihapus karena masih digunakan oleh film.' });
    }
});

// 4. Moderasi Semua Ulasan (Lihat Semua & Hapus Ulasan Manapun)
app.get('/api/admin/reviews', requireAdmin, async(req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT r.id, r.rating, r.comment, r.updated_at, u.name AS user_name, f.title AS film_title
            FROM reviews r
            JOIN users u ON r.user_id = u.id
            JOIN films f ON r.film_id = f.id
            ORDER BY r.updated_at DESC
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Gagal memuat daftar ulasan.' });
    }
});

app.delete('/api/admin/reviews/:id', requireAdmin, async(req, res) => {
    try {
        await db.query('DELETE FROM reviews WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Gagal menghapus ulasan.' });
    }
});

// 5. Manajemen User (Lihat Daftar Akun & Ubah Role)
app.get('/api/admin/users', requireAdmin, async(req, res) => {
    try {
        const [rows] = await db.query('SELECT id, name, email, role, created_at FROM users ORDER BY id ASC');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: 'Gagal memuat daftar pengguna.' });
    }
});

app.put('/api/admin/users/:id/role', requireAdmin, async(req, res) => {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) return res.status(400).json({ error: 'Role tidak valid.' });
    try {
        await db.query('UPDATE users SET role = ? WHERE id = ?', [role, req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Gagal mengubah role pengguna.' });
    }
});

app.listen(3000, () => console.log('Server Brutalism NobarBareng aktif di http://localhost:3000'));