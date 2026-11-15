const ICONS = {
    play: `<svg class="icon-sm" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`,
    star: `<svg class="icon-sm" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`,
    clock: `<svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`,
    eye: `<svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`,
    bookmark: `<svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>`,
    check: `<svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>`
};

const WATCHLIST_FILTER = "WATCHLIST SAYA";

let state = {
    view: "home",
    genre: "Semua",
    authMode: "login",
    user: JSON.parse(localStorage.getItem("nb_user_session") || "null"),
    films: [],
    genreList: [],
    genres: ["Semua"],
    history: [],
    watchlist: [],
    currentFilm: null,
    selectedId: null,
    selectedRating: 5,
    pos: 0,
    lastFocused: null,
    // Pastikan 4 baris ini ada di dalam state:
    adminTab: "films",
    adminStats: { total_films: 0, total_users: 0, total_reviews: 0, total_views: 0 },
    adminReviews: [],
    adminUsers: []
};

let ytPlayerInstance = null;
let ytProgressTimer = null;

const $ = id => document.getElementById(id);

const formatViews = n => {
    const num = Number(n) || 0;
    return num >= 1e6 ? (num / 1e6).toFixed(1) + " JT" : num >= 1e3 ? Math.round(num / 1e3) + " RB" : String(num);
};

function getYouTubeId(url) {
    const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
}

/* Sinkronisasi Database MySQL */
async function initApp() {
    try {
        const [filmsRes, genresRes] = await Promise.all([
            fetch("/api/films"),
            fetch("/api/genres")
        ]);
        state.films = await filmsRes.json();
        state.genreList = await genresRes.json();
        state.genres = ["Semua", WATCHLIST_FILTER, ...state.genreList.map(g => g.name)];

        if (state.films.length && (!state.selectedId || !state.films.some(f => f.id === state.selectedId))) {
            state.selectedId = state.films[0].id;
        }
        if (state.user) {
            await loadUserData();
        } else {
            state.history = [];
            state.watchlist = [];
        }

        if (state.user && state.user.role === "admin" && state.view === "admin") {
            await loadAdminData();
        }

    } catch (err) {
        console.error("Gagal memuat data dari server:", err);
    }
    render();
}

async function loadUserData() {
    if (!state.user) return;
    const [histRes, watchRes] = await Promise.all([
        fetch(`/api/users/${state.user.id}/history`),
        fetch(`/api/users/${state.user.id}/watchlist`)
    ]);
    state.history = await histRes.json();
    state.watchlist = await watchRes.json();
}

/* Modal & Aksesibilitas */
function show(id) {
    state.lastFocused = document.activeElement;
    const modal = $(id);
    modal.hidden = false;
    const input = modal.querySelector("input, select, button");
    if (input) input.focus();
}

function hide(id) {
    $(id).hidden = true;
    if (state.lastFocused) state.lastFocused.focus();
}

function tab(m) {
    state.authMode = m;
    $("fReg").hidden = m !== "reg";
    $("tLogin").classList.toggle("active", m === "login");
    $("tReg").classList.toggle("active", m === "reg");
    $("sub").textContent = m === "reg" ? "Daftar Akun Baru" : "Masuk Akun";
    $("err").textContent = "";
}

function openAuth(m = "login") {
    tab(m);
    show("mAuth");
}

async function submitAuth() {
    const email = $("em").value.trim();
    const password = $("pw").value;
    const name = $("rn").value.trim();
    const endpoint = state.authMode === "reg" ? "/api/auth/register" : "/api/auth/login";

    try {
        const res = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password })
        });
        const data = await res.json();
        if (!res.ok) {
            $("err").textContent = data.error || "Autentikasi gagal.";
            return;
        }
        state.user = data;
        localStorage.setItem("nb_user_session", JSON.stringify(data));
        hide("mAuth");
        $("pw").value = "";
        await loadUserData();
        render();
    } catch {
        $("err").textContent = "Server tidak merespons.";
    }
}

function logout() {
    closePlayer();
    state.user = null;
    state.history = [];
    state.watchlist = [];
    localStorage.removeItem("nb_user_session");
    state.view = "home";
    render();
}

/* Watchlist Toggle dengan Penanganan Sesi & Feedback */
async function toggleWatchlist(filmId) {
    if (!state.user) {
        openAuth("login");
        $("err").textContent = "Masuk terlebih dahulu untuk menyimpan film ke Watchlist.";
        return;
    }

    try {
        const res = await fetch("/api/watchlist/toggle", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: state.user.id, film_id: Number(filmId) })
        });
        const data = await res.json();

        if (res.status === 401) {
            alert(data.error);
            logout();
            openAuth("login");
            return;
        }

        if (!res.ok) {
            alert(data.error || "Gagal menyimpan watchlist.");
            return;
        }

        if (data.saved) {
            if (!state.watchlist.includes(Number(filmId))) {
                state.watchlist = [Number(filmId), ...state.watchlist];
            }
        } else {
            state.watchlist = state.watchlist.filter(id => id !== Number(filmId));
        }
        render();
    } catch (err) {
        alert("Tidak dapat terhubung ke server untuk menyimpan watchlist.");
    }
}

/* Halaman Khusus Daftar Watchlist User */
function renderWatchlistView() {
    if (!state.user) {
        return `
            <div class="empty-state">
                <p>SILAKAN MASUK KE AKUN ANDA UNTUK MELIHAT DAFTAR WATCHLIST.</p>
                <button type="button" class="btn-primary" onclick="openAuth('login')">Masuk Sekarang</button>
            </div>
        `;
    }

    const savedFilms = state.watchlist
        .map(id => state.films.find(f => Number(f.id) === Number(id)))
        .filter(Boolean);

    if (!savedFilms.length) {
        return `
            <div class="section-header" style="margin-top:0">
                <h2>Watchlist Saya // ${state.user.name}</h2>
                <span>0 FILM TERSIMPAN</span>
            </div>
            <div class="empty-state">
                <p>DAFTAR WATCHLIST ANDA MASIH KOSONG.</p>
                <p style="font-size:12px;margin-bottom:18px;">Klik tombol ikon bookmark pada kartu film di Beranda untuk menyimpannya ke daftar ini.</p>
                <button type="button" class="btn-primary" onclick="go('home')">Jelajahi Katalog Film</button>
            </div>
        `;
    }

    return `
        <div class="section-header" style="margin-top:0">
            <h2>Watchlist Saya // ${state.user.name}</h2>
            <span>${savedFilms.length} FILM TERSIMPAN</span>
        </div>
        <div class="film-grid">
            ${savedFilms.map(f => buildCardHTML(f, { showViews: true })).join("")}
        </div>
    `;
}

/* Navigasi */
async function go(v) {
    if (v === "admin" && (!state.user || state.user.role !== "admin")) return;
    state.view = v;
    await render();
    window.scrollTo({ top: 0, behavior: "smooth" });
}


function handleSearch() {
    if (state.view !== "home") state.view = "home";
    render();
}

function selectFilm(id) {
    state.selectedId = id;
    const film = state.films.find(x => x.id === id);
    const heroEl = $("hero");
    if (heroEl && film) {
        heroEl.innerHTML = buildHeroHTML(film);
        document.querySelectorAll(".film-card").forEach(el => {
            el.classList.toggle("selected", Number(el.dataset.id) === id);
        });
        if (window.scrollY > 240) window.scrollTo({ top: 0, behavior: "smooth" });
    }
}

/* Komponen UI Brutalist */
function buildHeroHTML(f) {
    if (!f) return "<p>Belum ada data film.</p>";
    const isSaved = state.watchlist.includes(f.id);

    return `
        <div class="hero-content">
            <span class="hero-tag">FILM PILIHAN // ${f.genre}</span>
            <h1>${f.title}</h1>
            <div class="meta-badges">
                <span class="badge">${ICONS.star} ${Number(f.avg_rating).toFixed(1)} (${f.total_reviews} ULASAN)</span>
                <span class="badge">${ICONS.clock} ${f.duration_minutes} MNT</span>
                <span class="badge">${f.release_year}</span>
                <span class="badge">${ICONS.eye} ${formatViews(f.total_views)} TAYANGAN</span>
            </div>
            <p class="hero-synopsis">${f.synopsis}</p>
            <div class="hero-actions">
                <button type="button" class="btn-primary" onclick="openFilm(${f.id})">
                    ${ICONS.play} Putar Film
                </button>
                <button type="button" class="btn-secondary" onclick="toggleWatchlist(${f.id})">
                    ${isSaved ? ICONS.check + " Tersimpan" : ICONS.bookmark + " Watchlist"}
                </button>
            </div>
        </div>
        <div class="hero-preview">
            <img src="${f.poster_url}" alt="Sampul ${f.title}">
        </div>
    `;
}

function buildCardHTML(f, options = {}) {
    const isSelected = f.id === state.selectedId;
    const isSaved = state.watchlist.includes(f.id);

    return `
        <article class="film-card ${isSelected ? "selected" : ""}" data-id="${f.id}" tabindex="0"
            onclick="selectFilm(${f.id})"
            onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();selectFilm(${f.id})}">
            <div class="poster-box">
                <span class="rating-badge">${ICONS.star} ${Number(f.avg_rating).toFixed(1)}</span>
                <span class="genre-tag-card">${f.genre}</span>
                <img src="${f.poster_url}" loading="lazy" alt="Poster ${f.title}">
            </div>
            <div class="card-body">
                <h3 class="card-title">${f.title}</h3>
                <p class="card-meta">${options.showViews ? formatViews(f.total_views) + " TAYANGAN" : f.duration_minutes + " MNT • " + f.release_year}</p>
                ${options.progress != null ? `<div class="progress-track" style="margin-bottom:10px;"><div class="progress-fill" style="width:${Math.round(options.progress * 100)}%"></div></div>` : ""}
                <div class="card-actions">
                    <button type="button" class="btn-primary btn-sm" onclick="event.stopPropagation(); openFilm(${f.id})">
                        ${ICONS.play} Tonton
                    </button>
                    <button type="button" class="btn-secondary btn-sm" aria-label="${isSaved ? "Hapus dari Watchlist" : "Simpan ke Watchlist"}" onclick="event.stopPropagation(); toggleWatchlist(${f.id})">
                        ${isSaved ? ICONS.check : ICONS.bookmark}
                    </button>
                </div>
            </div>
        </article>
    `;
}

/* Halaman Ditonton Terbanyak */
function renderMostWatchedView() {
    const sorted = [...state.films].sort((a, b) => Number(b.total_views) - Number(a.total_views));
    const maxViews = sorted.length ? Number(sorted[0].total_views) : 1;

    return `
        <div class="section-header" style="margin-top:0">
            <h2>Peringkat Film Ditonton Terbanyak</h2>
            <span>DIURUTKAN BERDASARKAN JUMLAH PEMUTARAN</span>
        </div>
        ${sorted.map((f, idx) => `
            <article class="list-row" tabindex="0" onclick="openFilm(${f.id})">
                <div class="rank-num ${idx < 2 ? "top-" + (idx + 1) : ""}">#${idx + 1}</div>
                <img class="row-thumb" src="${f.poster_url}" alt="Poster ${f.title}">
                <div class="row-info">
                    <h3>${f.title}</h3>
                    <p>${f.genre} // ${f.release_year} // RATING ${Number(f.avg_rating).toFixed(1)} // <strong>${formatViews(f.total_views)} DITONTON</strong></p>
                    <div class="progress-track"><div class="progress-fill" style="width:${Math.round((Number(f.total_views) / maxViews) * 100)}%"></div></div>
                </div>
                <button type="button" class="btn-primary btn-sm">${ICONS.play} Putar</button>
            </article>
        `).join("")}
    `;
}

/* Halaman Riwayat */
function renderHistoryView() {
    if (!state.user) {
        return `
            <div class="empty-state">
                <p>MASUK KE AKUN ANDA UNTUK MELIHAT RIWAYAT TONTONAN.</p>
                <button type="button" class="btn-primary" onclick="openAuth('login')">Masuk Sekarang</button>
            </div>
        `;
    }
    if (!state.history.length) {
        return `<div class="empty-state"><p>BELUM ADA RIWAYAT TONTONAN PADA AKUN INI.</p></div>`;
    }
    return `
        <div class="section-header" style="margin-top:0">
            <h2>Riwayat Tontonan // ${state.user.name}</h2>
            <span>${state.history.length} FILM</span>
        </div>
        ${state.history.map(item => `
            <article class="list-row" tabindex="0" onclick="openFilm(${item.film_id})">
                <img class="row-thumb" src="${item.poster_url}" alt="Poster ${item.title}">
                <div class="row-info">
                    <h3>${item.title}</h3>
                    <p>${item.genre} // ${new Date(item.last_watched_at).toLocaleString("id-ID")} // ${Math.round(item.progress_ratio * 100)}% SELESAI</p>
                    <div class="progress-track"><div class="progress-fill" style="width:${Math.round(item.progress_ratio * 100)}%"></div></div>
                </div>
                <button type="button" class="btn-primary btn-sm">Lanjutkan</button>
            </article>
        `).join("")}
    `;
}


function populateGenreSelect(selectedGenreId = null) {
    const select = $("fGenre");
    select.innerHTML = state.genreList.map(g =>
        `<option value="${g.id}" ${Number(g.id) === Number(selectedGenreId) ? "selected" : ""}>${g.name}</option>`
    ).join("");
}

function openCreateFilm() {
    $("filmFormTitle").textContent = "Tambah Film Baru";
    $("editFilmId").value = "";
    $("fTitle").value = "";
    populateGenreSelect();
    $("fYear").value = 2026;
    $("fDuration").value = 110;
    $("fBaseViews").value = 0;
    $("fPoster").value = "";
    $("fVideo").value = "";
    $("fSynopsis").value = "";
    $("crudErr").textContent = "";
    show("mFilmForm");
}

function openEditFilm(id) {
    const film = state.films.find(f => f.id === id);
    if (!film) return;

    $("filmFormTitle").textContent = `Edit Film #${film.id}`;
    $("editFilmId").value = film.id;
    $("fTitle").value = film.title;
    populateGenreSelect(film.genre_id);
    $("fYear").value = film.release_year;
    $("fDuration").value = film.duration_minutes;
    $("fBaseViews").value = film.base_views || 0;
    $("fPoster").value = film.poster_url;
    $("fVideo").value = film.video_url;
    $("fSynopsis").value = film.synopsis;
    $("crudErr").textContent = "";
    show("mFilmForm");
}

async function submitFilmCrud() {
    if (!state.user || state.user.role !== "admin") return;

    const id = $("editFilmId").value;
    const payload = {
        title: $("fTitle").value,
        genre_id: Number($("fGenre").value),
        release_year: Number($("fYear").value),
        duration_minutes: Number($("fDuration").value),
        base_views: Number($("fBaseViews").value),
        poster_url: $("fPoster").value,
        video_url: $("fVideo").value,
        synopsis: $("fSynopsis").value
    };

    const url = id ? `/api/films/${id}` : "/api/films";
    const method = id ? "PUT" : "POST";

    try {
        const res = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
                "x-user-id": String(state.user.id)
            },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (!res.ok) {
            $("crudErr").textContent = data.error || "Gagal menyimpan data film.";
            return;
        }
        hide("mFilmForm");
        await initApp();
    } catch {
        $("crudErr").textContent = "Terjadi kesalahan koneksi ke server.";
    }
}

async function deleteFilm(id, title) {
    if (!state.user || state.user.role !== "admin") return;
    if (!confirm(`Yakin ingin menghapus film "${title}" secara permanen dari database?`)) return;

    try {
        const res = await fetch(`/api/films/${id}`, {
            method: "DELETE",
            headers: { "x-user-id": String(state.user.id) }
        });
        if (res.ok) {
            await initApp();
        } else {
            const data = await res.json();
            alert(data.error || "Gagal menghapus film.");
        }
    } catch {
        alert("Gagal terhubung ke server.");
    }
}

/* Render Utama */
function render() {
    const isAdmin = state.user && state.user.role === "admin";
    $("nAdmin").hidden = !isAdmin;

    // Perbarui angka jumlah watchlist di navbar
    const countEl = $("watchCount");
    if (countEl) countEl.textContent = state.watchlist.length;

    $("auth").innerHTML = state.user
        ? `<span>${state.user.name}</span>
           <span class="role-badge">${state.user.role}</span>
           <button type="button" class="btn-secondary btn-sm" onclick="logout()">Keluar</button>`
        : `<button type="button" class="btn-secondary btn-sm" onclick="openAuth('login')">Masuk</button>
           <button type="button" class="btn-primary btn-sm" onclick="openAuth('reg')">Daftar</button>`;

    ["Home", "Rank", "Watch", "Hist", "Admin"].forEach(n => {
        const el = $("n" + n);
        if (el) el.classList.toggle("active", state.view === n.toLowerCase());
    });

    const app = $("app");
    if (state.view === "admin" && isAdmin) {
        app.innerHTML = renderAdminView();
        return;
    }
    if (state.view === "rank") {
        app.innerHTML = renderMostWatchedView();
        return;
    }
    if (state.view === "watch") {
        app.innerHTML = renderWatchlistView();
        return;
    }
    if (state.view === "hist") {
        app.innerHTML = renderHistoryView();
        return;
    }


    // Tambahkan properti berikut di dalam objek state:
// adminTab: "films",
// adminStats: { total_films: 0, total_users: 0, total_reviews: 0, total_views: 0 },
// adminReviews: [],
// adminUsers: [],

/* Muat Data Khusus Admin saat membuka Panel Admin */
async function loadAdminData() {
    if (!state.user || state.user.role !== "admin") return;
    const headers = { "x-user-id": String(state.user.id) };

    try {
        const [statsRes, revRes, usersRes] = await Promise.all([
            fetch("/api/admin/stats", { headers }),
            fetch("/api/admin/reviews", { headers }),
            fetch("/api/admin/users", { headers })
        ]);
        if (statsRes.ok) state.adminStats = await statsRes.json();
        if (revRes.ok) state.adminReviews = await revRes.json();
        if (usersRes.ok) state.adminUsers = await usersRes.json();
    } catch (err) {
        console.error("Gagal memuat data admin:", err);
    }
}

/* Upload File Poster / Video ke Server Lokal */
async function handleAdminUpload(fileInput, targetInputId) {
    const file = fileInput.files[0];
    if (!file || !state.user) return;

    const targetEl = $(targetInputId);
    const oldVal = targetEl.value;
    targetEl.value = "MENGUNGGAH FILE...";
    targetEl.disabled = true;

    const formData = new FormData();
    formData.append("file", file);

    try {
        const res = await fetch("/api/admin/upload", {
            method: "POST",
            headers: { "x-user-id": String(state.user.id) },
            body: formData
        });
        const data = await res.json();
        if (res.ok) {
            targetEl.value = data.url;
        } else {
            alert(data.error || "Gagal mengunggah file.");
            targetEl.value = oldVal;
        }
    } catch {
        alert("Kesalahan koneksi saat mengunggah file.");
        targetEl.value = oldVal;
    } finally {
        targetEl.disabled = false;
        fileInput.value = "";
    }
}

/* Ganti Sub-Tab di Panel Admin */
async function switchAdminTab(tabName) {
    state.adminTab = tabName;
    render(); // Langsung ganti tampilan tab seketika saat diklik
    await loadAdminData();
    render(); // Perbarui isi tabel dengan data terbaru dari MySQL
}

/* CRUD Genre Admin */
async function addNewGenre() {
    const input = $("newGenreName");
    const name = input.value.trim();
    if (!name || !state.user) return;

    const res = await fetch("/api/genres", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-user-id": String(state.user.id)
        },
        body: JSON.stringify({ name })
    });
    const data = await res.json();
    if (res.ok) {
        input.value = "";
        await initApp();
    } else {
        alert(data.error || "Gagal menambah genre.");
    }
}

async function deleteGenre(id, name) {
    if (!confirm(`Hapus genre "${name}"?`)) return;
    const res = await fetch(`/api/genres/${id}`, {
        method: "DELETE",
        headers: { "x-user-id": String(state.user.id) }
    });
    const data = await res.json();
    if (res.ok) {
        await initApp();
    } else {
        alert(data.error || "Genre masih digunakan oleh film.");
    }
}

/* Moderasi Hapus Ulasan oleh Admin */
async function adminDeleteReview(reviewId) {
    if (!confirm("Hapus ulasan pengguna ini secara permanen?")) return;
    const res = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: "DELETE",
        headers: { "x-user-id": String(state.user.id) }
    });
    if (res.ok) {
        await loadAdminData();
        await initApp();
    }
}

/* Ubah Role Pengguna (User <-> Admin) */
async function toggleUserRole(userId, currentRole) {
    if (Number(userId) === Number(state.user.id)) {
        alert("Anda tidak dapat mengubah role akun Anda sendiri.");
        return;
    }
    const newRole = currentRole === "admin" ? "user" : "admin";
    if (!confirm(`Ubah role pengguna #${userId} menjadi ${newRole.toUpperCase()}?`)) return;

    const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "x-user-id": String(state.user.id)
        },
        body: JSON.stringify({ role: newRole })
    });
    if (res.ok) {
        await loadAdminData();
        render();
    }
}

/* Render Lengkap Halaman Panel Admin */
function renderAdminView() {
    const activeTab = state.adminTab || "films";
    const s = state.adminStats || { total_films: state.films.length, total_users: 0, total_reviews: 0, total_views: 0 };

    let tabContent = "";

    if (activeTab === "films") {
        tabContent = `
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;flex-wrap:wrap;gap:10px;">
                <h2 style="font:900 18px/1 var(--font-display);margin:0;">DAFTAR KATALOG FILM (${state.films.length})</h2>
                <button type="button" class="btn-primary btn-sm" onclick="openCreateFilm()">+ Tambah Film Baru</button>
            </div>
            <div class="admin-table-wrap">
                <table class="brutal-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Judul Film</th>
                            <th>Genre</th>
                            <th>Tahun</th>
                            <th>Durasi</th>
                            <th>Rating</th>
                            <th>Ditonton</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${state.films.map(f => `
                            <tr>
                                <td>#${f.id}</td>
                                <td><strong>${f.title}</strong></td>
                                <td>${f.genre}</td>
                                <td>${f.release_year}</td>
                                <td>${f.duration_minutes} mnt</td>
                                <td>${Number(f.avg_rating).toFixed(1)} (${f.total_reviews})</td>
                                <td>${formatViews(f.total_views)}</td>
                                <td>
                                    <div class="action-group">
                                        <button type="button" class="btn-secondary btn-sm" onclick="openEditFilm(${f.id})">Edit</button>
                                        <button type="button" class="btn-danger btn-sm" onclick="deleteFilm(${f.id}, '${f.title.replace(/'/g, "\\'")}')">Hapus</button>
                                    </div>
                                </td>
                            </tr>
                        `).join("")}
                    </tbody>
                </table>
            </div>
        `;
    } else if (activeTab === "genres") {
        tabContent = `
            <h2 style="font:900 18px/1 var(--font-display);margin:0 0 14px;">KELOLA KATEGORI GENRE</h2>
            <form class="genre-manager-bar" onsubmit="event.preventDefault(); addNewGenre()">
                <input id="newGenreName" type="text" placeholder="Nama genre baru (misal: Dokumenter)" required>
                <button type="submit" class="btn-primary btn-sm">+ Tambah Genre</button>
            </form>
            <div class="admin-table-wrap">
                <table class="brutal-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nama Genre</th>
                            <th>Jumlah Film</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${state.genreList.map(g => {
                            const count = state.films.filter(f => Number(f.genre_id) === Number(g.id)).length;
                            return `
                                <tr>
                                    <td>#${g.id}</td>
                                    <td><strong>${g.name}</strong></td>
                                    <td>${count} film</td>
                                    <td>
                                        <button type="button" class="btn-danger btn-sm" onclick="deleteGenre(${g.id}, '${g.name.replace(/'/g, "\\'")}')">Hapus</button>
                                    </td>
                                </tr>
                            `;
                        }).join("")}
                    </tbody>
                </table>
            </div>
        `;
    } else if (activeTab === "reviews") {
        tabContent = `
            <h2 style="font:900 18px/1 var(--font-display);margin:0 0 14px;">MODERASI ULASAN & KOMENTAR (${state.adminReviews.length})</h2>
            <div class="admin-table-wrap">
                <table class="brutal-table">
                    <thead>
                        <tr>
                            <th>Film</th>
                            <th>Pengguna</th>
                            <th>Rating</th>
                            <th>Komentar</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${state.adminReviews.length ? state.adminReviews.map(r => `
                            <tr>
                                <td><strong>${r.film_title}</strong></td>
                                <td>${r.user_name}</td>
                                <td>${r.rating} ★</td>
                                <td>${r.comment}</td>
                                <td>
                                    <button type="button" class="btn-danger btn-sm" onclick="adminDeleteReview(${r.id})">Hapus</button>
                                </td>
                            </tr>
                        `).join("") : `<tr><td colspan="5">Belum ada ulasan pengguna.</td></tr>`}
                    </tbody>
                </table>
            </div>
        `;
    } else if (activeTab === "users") {
        tabContent = `
            <h2 style="font:900 18px/1 var(--font-display);margin:0 0 14px;">MANAJEMEN AKUN PENGGUNA (${state.adminUsers.length})</h2>
            <div class="admin-table-wrap">
                <table class="brutal-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nama</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${state.adminUsers.map(u => `
                            <tr>
                                <td>#${u.id}</td>
                                <td><strong>${u.name}</strong></td>
                                <td>${u.email}</td>
                                <td><span class="role-badge">${u.role}</span></td>
                                <td>
                                    <button type="button" class="btn-secondary btn-sm" onclick="toggleUserRole(${u.id}, '${u.role}')">
                                        Jadikan ${u.role === "admin" ? "User" : "Admin"}
                                    </button>
                                </td>
                            </tr>
                        `).join("")}
                    </tbody>
                </table>
            </div>
        `;
    }

    return `
        <section class="admin-panel">
            <div class="admin-header">
                <div>
                    <h1 class="modal-title" style="margin:0">Dashboard Administrator</h1>
                    <p style="font-family:var(--font-mono);font-size:12px;margin:4px 0 0">KONTROL PENUH KATALOG FILM, GENRE, ULASAN & PENGGUNA</p>
                </div>
            </div>

            <div class="stats-grid">
                <div class="stat-card highlight">
                    <p class="stat-label">Total Film</p>
                    <p class="stat-value">${s.total_films}</p>
                </div>
                <div class="stat-card">
                    <p class="stat-label">Total Penayangan</p>
                    <p class="stat-value">${formatViews(s.total_views)}</p>
                </div>
                <div class="stat-card">
                    <p class="stat-label">Total Pengguna</p>
                    <p class="stat-value">${s.total_users}</p>
                </div>
                <div class="stat-card">
                    <p class="stat-label">Total Ulasan</p>
                    <p class="stat-value">${s.total_reviews}</p>
                </div>
            </div>

            <div class="admin-subtabs" role="tablist">
                <button type="button" class="chip ${activeTab === "films" ? "active" : ""}" onclick="switchAdminTab('films')">Kelola Film</button>
                <button type="button" class="chip ${activeTab === "genres" ? "active" : ""}" onclick="switchAdminTab('genres')">Kelola Genre</button>
                <button type="button" class="chip ${activeTab === "reviews" ? "active" : ""}" onclick="switchAdminTab('reviews')">Moderasi Komentar</button>
                <button type="button" class="chip ${activeTab === "users" ? "active" : ""}" onclick="switchAdminTab('users')">Daftar User</button>
            </div>

            ${tabContent}
        </section>
    `;
}

    // ... lanjutkan kode render Beranda seperti sebelumnya

    const query = $("q").value.toLowerCase().trim();
    const activeFilm = state.films.find(x => x.id === state.selectedId) || state.films[0];

    let html = `<section class="hero" id="hero">${buildHeroHTML(activeFilm)}</section>`;
    html += `<div class="chips" role="group" aria-label="Filter Genre">
        ${state.genres.map(g => `
            <button type="button" class="chip ${g === state.genre ? "active" : ""}" onclick="state.genre='${g}';render()">
                ${g}
            </button>
        `).join("")}
    </div>`;

    const mostWatched = [...state.films].sort((a, b) => Number(b.total_views) - Number(a.total_views)).slice(0, 4);
    const inProgress = state.history.filter(h => h.progress_ratio > 0.01 && h.progress_ratio < 0.98).slice(0, 4);

    if (state.genre === "Semua" && !query) {
        // Bagian Lanjutkan Menonton (Jika user login dan ada film belum selesai)
        if (state.user && inProgress.length) {
            html += `
                <div class="section-header">
                    <h2>Lanjutkan Menonton</h2>
                    <span>MELANJUTKAN DARI MENIT TERAKHIR</span>
                </div>
                <div class="film-grid">
                    ${inProgress.map(item => {
                        const f = state.films.find(x => x.id === item.film_id);
                        return f ? buildCardHTML(f, { progress: item.progress_ratio }) : "";
                    }).join("")}
                </div>
            `;
        }

        html += `
            <div class="section-header">
                <h2>Ditonton Terbanyak</h2>
                <span>TOP 4 PALING POPULER</span>
            </div>
            <div class="film-grid">
                ${mostWatched.map(f => buildCardHTML(f, { showViews: true })).join("")}
            </div>

            <div class="section-header">
                <h2>Semua Katalog Film</h2>
                <span>${state.films.length} JUDUL TERSEDIA</span>
            </div>
            <div class="film-grid">
                ${state.films.map(f => buildCardHTML(f, { showViews: false })).join("")}
            </div>
        `;
    } else {
        const filtered = state.films.filter(f => {
            const matchGenre =
                state.genre === "Semua" ||
                (state.genre === WATCHLIST_FILTER ? state.watchlist.includes(f.id) : f.genre === state.genre);
            const matchQuery = f.title.toLowerCase().includes(query);
            return matchGenre && matchQuery;
        });

        html += `
            <div class="section-header">
                <h2>${state.genre === "Semua" ? "Hasil Pencarian" : state.genre}</h2>
                <span>${filtered.length} FILM DITEMUKAN</span>
            </div>
            ${filtered.length
                ? `<div class="film-grid">${filtered.map(f => buildCardHTML(f, { showViews: true })).join("")}</div>`
                : `<div class="empty-state"><p>${state.genre === WATCHLIST_FILTER ? "WATCHLIST ANDA MASIH KOSONG. KLIK TOMBOL SIMPAN PADA FILM." : "TIDAK ADA FILM YANG COCOK DENGAN FILTER."}</p></div>`}
        `;
    }

    app.innerHTML = html;
}

/* Pemutar Film Hybrid (YouTube API dengan Fallback Error + HTML5 Video) */
async function openFilm(id) {
    if (!state.user) {
        openAuth("login");
        $("err").textContent = "Masuk terlebih dahulu untuk memutar film dan menulis ulasan.";
        return;
    }

    const film = state.films.find(f => f.id === id);
    if (!film) return;

    state.currentFilm = film;
    const histRec = state.history.find(h => h.film_id === id);
    state.pos = histRec && histRec.progress_ratio < 0.98 ? histRec.progress_ratio * film.duration_minutes : 0;

    $("pt").textContent = film.title;
    $("pm").textContent = `${film.genre} // ${film.release_year} // ${film.duration_minutes} MNT // RATING ${Number(film.avg_rating).toFixed(1)} // ${formatViews(film.total_views)} DITONTON`;
    $("ps").textContent = film.synopsis;

    show("mPlay");
    setRating(5);
    $("reviewComment").value = "";

    await fetch("/api/watch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            user_id: state.user.id,
            film_id: film.id,
            progress_ratio: state.pos / film.duration_minutes,
            increment_view: true
        })
    });

    await loadReviews(film.id);

    const ytId = getYouTubeId(film.video_url);

    if (ytId) {
        $("scr").innerHTML = `<div id="ytPlayerMount" style="width:100%; height:100%;"></div>`;
        const startSeconds = Math.floor((state.pos / film.duration_minutes) * (film.duration_minutes * 60)) || 0;

        if (window.YT && window.YT.Player) {
            ytPlayerInstance = new YT.Player("ytPlayerMount", {
                width: "100%",
                height: "100%",
                videoId: ytId,
                playerVars: {
                    autoplay: 1,
                    start: startSeconds,
                    rel: 0,
                    modestbranding: 1
                },
                events: {
                    onReady: (event) => event.target.playVideo(),
                    onError: () => {
                        $("scr").innerHTML = `
                            <div class="yt-error-box">
                                <p>VIDEO INI MEMBATASI PEMUTARAN EMBED DI LUAR YOUTUBE.</p>
                                <a href="${film.video_url}" target="_blank" rel="noopener noreferrer" class="btn-primary">
                                    TONTON LANGSUNG DI YOUTUBE
                                </a>
                            </div>
                        `;
                    },
                    onStateChange: (event) => {
                        if (event.data === YT.PlayerState.PLAYING) {
                            clearInterval(ytProgressTimer);
                            ytProgressTimer = setInterval(() => {
                                if (ytPlayerInstance && ytPlayerInstance.getCurrentTime && ytPlayerInstance.getDuration) {
                                    const curTime = ytPlayerInstance.getCurrentTime();
                                    const dur = ytPlayerInstance.getDuration();
                                    if (dur > 0) {
                                        state.pos = (curTime / dur) * film.duration_minutes;
                                    }
                                }
                            }, 2000);
                        } else {
                            clearInterval(ytProgressTimer);
                        }
                    }
                }
            });
        }
    } else {
        $("scr").innerHTML = `<video id="mainWebVideo" src="${film.video_url}" poster="${film.poster_url}" controls playsinline preload="metadata"></video>`;
        const video = $("mainWebVideo");
        if (video) {
            video.onloadedmetadata = () => {
                if (state.pos > 0 && video.duration) {
                    video.currentTime = (state.pos / film.duration_minutes) * video.duration;
                }
                video.play().catch(() => {});
            };
            video.ontimeupdate = () => {
                if (video.duration) {
                    state.pos = (video.currentTime / video.duration) * film.duration_minutes;
                }
            };
        }
    }
}

async function loadReviews(filmId) {
    const res = await fetch(`/api/films/${filmId}/reviews`);
    const reviews = await res.json();
    const listEl = $("reviewList");

    if (!reviews.length) {
        listEl.innerHTML = `<p style="font-family:var(--font-mono);font-size:12px">Belum ada ulasan. Tulis ulasan pertama Anda di atas.</p>`;
        return;
    }

    listEl.innerHTML = reviews.map(r => {
        const isOwn = state.user && r.user_id === state.user.id;
        const dateStr = new Date(r.updated_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
        return `
            <div class="review-item">
                <div class="review-item-header">
                    <span>${r.user_name} ${isOwn ? "[ANDA]" : ""} &bull; <small style="font-weight:400">${dateStr}</small></span>
                    <div>
                        <span class="review-stars">${"★".repeat(r.rating)}${"☆".repeat(5 - r.rating)} (${r.rating}/5)</span>
                        ${isOwn ? `<button type="button" class="btn-delete-review" onclick="deleteMyReview(${r.id})">HAPUS</button>` : ""}
                    </div>
                </div>
                <p class="review-text">${r.comment}</p>
            </div>
        `;
    }).join("");
}

async function deleteMyReview(reviewId) {
    if (!state.user || !state.currentFilm) return;
    if (!confirm("Hapus ulasan Anda pada film ini?")) return;

    const res = await fetch(`/api/reviews/${reviewId}`, {
        method: "DELETE",
        headers: { "x-user-id": String(state.user.id) }
    });

    if (res.ok) {
        await loadReviews(state.currentFilm.id);
        await initApp();
    }
}

function setRating(val) {
    state.selectedRating = val;
    document.querySelectorAll(".star-btn").forEach(btn => {
        btn.classList.toggle("active", Number(btn.dataset.val) === val);
    });
}

async function submitReview() {
    if (!state.user || !state.currentFilm) return;
    const comment = $("reviewComment").value.trim();
    if (!comment) return;

    const res = await fetch(`/api/films/${state.currentFilm.id}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            user_id: state.user.id,
            rating: state.selectedRating,
            comment
        })
    });

    if (res.ok) {
        $("reviewComment").value = "";
        await loadReviews(state.currentFilm.id);
        await initApp();
    }
}

async function closePlayer() {
    clearInterval(ytProgressTimer);

    if (ytPlayerInstance) {
        if (ytPlayerInstance.getCurrentTime && ytPlayerInstance.getDuration && state.currentFilm) {
            const curTime = ytPlayerInstance.getCurrentTime();
            const dur = ytPlayerInstance.getDuration();
            if (dur > 0) {
                state.pos = (curTime / dur) * state.currentFilm.duration_minutes;
            }
        }
        ytPlayerInstance.destroy();
        ytPlayerInstance = null;
    }

    const video = $("mainWebVideo");
    if (video && state.currentFilm) {
        video.pause();
        if (video.duration) {
            state.pos = (video.currentTime / video.duration) * state.currentFilm.duration_minutes;
        }
        video.removeAttribute("src");
        video.load();
    }

    if (state.currentFilm && state.user) {
        await fetch("/api/watch", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user_id: state.user.id,
                film_id: state.currentFilm.id,
                progress_ratio: Math.min(1, Math.max(0, state.pos / state.currentFilm.duration_minutes)),
                increment_view: false
            })
        });
    }

    $("scr").innerHTML = "";
    hide("mPlay");
    state.currentFilm = null;
    await initApp();
}

/* Global Modal Events */
["mAuth", "mFilmForm"].forEach(id => {
    $(id).addEventListener("click", e => { if (e.target.id === id) hide(id); });
});
$("mPlay").addEventListener("click", e => { if (e.target.id === "mPlay") closePlayer(); });
document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
        if (!$("mPlay").hidden) closePlayer();
        if (!$("mAuth").hidden) hide("mAuth");
        if (!$("mFilmForm").hidden) hide("mFilmForm");
    }
});

tab("login");
initApp();