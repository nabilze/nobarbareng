const FILMS = [{
    id: 1,
    t: "Ragnamok",
    g: "Drama",
    y: 2023,
    d: 112,
    img: "src/sampul/ragnamok.jpg",
    vid: "src/film/ragnamok.mp4",
    r: 4.6,
    v: 182,
    c: ["#f97316", "#7c2d12"],
    s: "Seorang pelukis tua kembali ke kampung halaman dan menemukan rahasia keluarga yang lama terkubur."
}, {
    id: 2,
    t: "Suki Terakhir",
    g: "Sci-Fi",
    y: 2024,
    d: 128,
    img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500",
    vid: "https://www.w3schools.com/html/movie.mp4",
    r: 4.8,
    v: 356,
    c: ["#6366f1", "#0f172a"],
    s: "Awak kapal antariksa berlomba mencari planet baru sebelum bumi tak lagi bisa dihuni."
}, {
    id: 3,
    t: "Dapur Mak Ijah",
    g: "Komedi",
    y: 2022,
    d: 96,
    img: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=500",
    vid: "https://www.w3schools.com/html/mov_bbb.mp4",
    r: 4.2,
    v: 274,
    c: ["#eab308", "#b45309"],
    s: "Warung kecil terancam tutup, tiga cucu nekat membuat kontes masak yang berakhir kacau."
}, {
    id: 4,
    t: "Malam di Rumah Tua",
    g: "Horor",
    y: 2023,
    d: 101,
    img: "https://images.unsplash.com/photo-1505635552518-3448ff116af3?w=500",
    vid: "https://www.w3schools.com/html/movie.mp4",
    r: 4.0,
    v: 121,
    c: ["#475569", "#020617"],
    s: "Sekelompok mahasiswa menginap di rumah kosong demi tugas riset dan mulai mendengar suara aneh."
}, {
    id: 5,
    t: "Jejak Sang Pendekar",
    g: "Aksi",
    y: 2024,
    d: 118,
    img: "https://images.unsplash.com/photo-1555597673-b21d5c935865?w=500",
    vid: "https://www.w3schools.com/html/mov_bbb.mp4",
    r: 4.5,
    v: 418,
    c: ["#dc2626", "#450a0a"],
    s: "Mantan pendekar dipaksa kembali bertarung demi melindungi desanya dari sindikat bersenjata."
}, {
    id: 6,
    t: "Hujan di Bulan Juni",
    g: "Romantis",
    y: 2021,
    d: 104,
    img: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=500",
    vid: "https://www.w3schools.com/html/movie.mp4",
    r: 4.4,
    v: 198,
    c: ["#ec4899", "#831843"],
    s: "Dua orang asing bertemu di halte setiap hujan turun, tanpa pernah saling bertukar nama."
}, {
    id: 7,
    t: "Detektif Kota Tua",
    g: "Misteri",
    y: 2022,
    d: 109,
    img: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=500",
    vid: "https://www.w3schools.com/html/mov_bbb.mp4",
    r: 4.3,
    v: 143,
    c: ["#0d9488", "#042f2e"],
    s: "Seorang detektif pensiunan mengurai pembunuhan berantai di distrik bersejarah."
}, {
    id: 8,
    t: "Petualangan Si Kancil",
    g: "Keluarga",
    y: 2023,
    d: 88,
    img: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500",
    vid: "https://www.w3schools.com/html/movie.mp4",
    r: 4.1,
    v: 264,
    c: ["#22c55e", "#14532d"],
    s: "Kancil dan teman-temannya menjelajah hutan untuk menyelamatkan sungai yang mengering."
}, {
    id: 9,
    t: "Kode Merah",
    g: "Aksi",
    y: 2025,
    d: 122,
    img: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500",
    vid: "https://www.w3schools.com/html/mov_bbb.mp4",
    r: 4.7,
    v: 389,
    c: ["#f43f5e", "#1e1b4b"],
    s: "Tim siber elite berpacu dengan waktu menghentikan serangan yang melumpuhkan kota."
}, {
    id: 10,
    t: "Surat untuk Ayah",
    g: "Drama",
    y: 2024,
    d: 99,
    img: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500",
    vid: "https://www.w3schools.com/html/movie.mp4",
    r: 4.9,
    v: 227,
    c: ["#0ea5e9", "#082f49"],
    s: "Setelah ayahnya wafat, seorang anak menemukan puluhan surat yang tak pernah terkirim."
}, {
    id: 11,
    t: "Planet Kembar",
    g: "Sci-Fi",
    y: 2025,
    d: 135,
    img: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=500",
    vid: "https://www.w3schools.com/html/mov_bbb.mp4",
    r: 4.5,
    v: 341,
    c: ["#a855f7", "#2e1065"],
    s: "Ilmuwan menemukan planet kembar bumi dengan penghuni yang ternyata mengenal mereka."
}, {
    id: 12,
    t: "Kos-kosan Gaduh",
    g: "Komedi",
    y: 2025,
    d: 92,
    img: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500",
    vid: "https://www.w3schools.com/html/movie.mp4",
    r: 4.0,
    v: 175,
    c: ["#f59e0b", "#78350f"],
    s: "Lima penghuni kos dengan kepribadian bertolak belakang harus kompak menghadapi ibu kos baru."
}];

const SAVED = "🔖 Disimpan",
    GENRES = ["Semua", ...new Set(FILMS.map(f => f.g)), SAVED];
let view = "home",
    genre = "Semua",
    rkTab = "pop",
    mode = "login",
    cur = null,
    pos = 0,
    counted = false,
    sel = 1;
const $ = id => document.getElementById(id);
const bg = f => `background:linear-gradient(160deg,${f.c[0]},${f.c[1]})`;
const mem = {};

function ld(k, def) {
    try {
        const v = localStorage.getItem(k);
        return v ? JSON.parse(v) : def
    } catch (e) {
        return k in mem ? mem[k] : def
    }
}

function sv(k, v) {
    try {
        localStorage.setItem(k, JSON.stringify(v))
    } catch (e) {
        mem[k] = v
    }
}
const users = () => ld("ny_users", {}),
    session = () => ld("ny_session", null),
    hist = em => ld("ny_hist_" + em, []),
    views = () => ld("ny_views", {}),
    saved = () => ld("ny_save", []);
async function hash(s) {
    try {
        const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode("ny:" + s));
        return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, "0")).join("")
    } catch (e) {
        return btoa(unescape(encodeURIComponent(s)))
    }
}
const tv = f => f.v * 1000 + (views()[f.id] || 0);
const fv = n => n >= 1e6 ? (n / 1e6).toFixed(1) + " jt" : n >= 1e3 ? Math.round(n / 1e3) + " rb" : String(n);
const byPop = () => [...FILMS].sort((a, b) => b.r - a.r || tv(b) - tv(a)),
    byView = () => [...FILMS].sort((a, b) => tv(b) - tv(a));

function addView() {
    if (!cur || counted) return;
    counted = true;
    const V = views();
    V[cur.id] = (V[cur.id] || 0) + 1;
    sv("ny_views", V)
}

/* Auth */
function show(id) {
    $(id).classList.add("show")
}

function hide(id) {
    $(id).classList.remove("show")
}

function tab(m) {
    mode = m;
    $("fReg").style.display = m === "reg" ? "block" : "none";
    $("tLogin").classList.toggle("pri", m === "login");
    $("tReg").classList.toggle("pri", m === "reg");
    $("sub").textContent = m === "reg" ? "Buat Akun" : "Masuk";
    $("err").textContent = ""
}

function openAuth(m) {
    tab(m || "login");
    show("mAuth")
}
async function submitAuth() {
    const em = $("em").value.trim().toLowerCase(),
        pw = $("pw").value,
        nm = $("rn").value.trim(),
        U = users();
    if (!/\S+@\S+\.\S+$/.test(em)) return $("err").textContent = "Format email tidak valid.";
    if (pw.length < 6) return $("err").textContent = "Kata sandi minimal 6 karakter.";
    const h = await hash(pw);
    if (mode === "reg") {
        if (!nm) return $("err").textContent = "Nama wajib diisi.";
        if (U[em]) return $("err").textContent = "Email sudah terdaftar. Silakan masuk.";
        U[em] = {
            name: nm,
            pw: h
        };
        sv("ny_users", U);
        sv("ny_session", em)
    } else {
        if (!U[em] || U[em].pw !== h) return $("err").textContent = "Email atau kata sandi salah.";
        sv("ny_session", em)
    }
    hide("mAuth");
    $("pw").value = "";
    render()
}

function logout() {
    closePlayer();
    sv("ny_session", null);
    view = "home";
    render()
}

/* Render */
function go(v) {
    view = v;
    render();
    scrollTo(0, 0)
}

function paint(f) {
    const s = document.body.style;
    s.setProperty("--c1", f.c[1]);
    s.setProperty("--c2", f.c[0])
}

function heroHTML(f) {
    const sv_ = saved().includes(f.id);
    return `<div class="ht"><h1>${f.t}</h1><div class="meta"><span class="glass">★ ${f.r.toFixed(1)}</span><span class="glass">⏱ ${f.d} mnt</span><span class="glass">♥ ${Math.round(f.r/5*100)}% suka</span><span class="glass">${f.g} · ${f.y}</span></div><p>${f.s}</p><div class="acts"><button class="yb" onclick="openFilm(${f.id})">▶ Putar Film</button><button class="btn ob glass lq" onclick="toggleSave(${f.id})">${sv_?"✓ Tersimpan":"🔖 Simpan Nanti"}</button></div></div><div class="big" style="background-image: url('${f.img}'); background-size: cover; background-position: center; border-radius: 12px; width: 320px; height: 180px; aspect-ratio: 16/9;"></div>`
}

function pick(id) {
    sel = id;
    const f = FILMS.find(x => x.id === id);
    paint(f);
    const h = $("hero");
    if (h) {
        h.innerHTML = heroHTML(f);
        document.querySelectorAll(".film").forEach(e => e.classList.toggle("on", +e.dataset.id === id));
        if (scrollY > 200) scrollTo({
            top: 0,
            behavior: "smooth"
        })
    }
}

function toggleSave(id) {
    let S = saved();
    S = S.includes(id) ? S.filter(x => x !== id) : [...S, id];
    sv("ny_save", S);
    $("hero").innerHTML = heroHTML(FILMS.find(x => x.id === sel))
}

function card(f, i, o = {}) {
    return `<div class="film ${f.id===sel?"on":""}" data-id="${f.id}" tabindex="0" style="--i:${Math.min(i,10)}" onclick="pick(${f.id})" onkeydown="if(event.key==='Enter')pick(${f.id})"><div class="poster" style="${bg(f)}"><div class="tag">★ ${f.r.toFixed(1)}</div><img src="${f.img}" style="width:100%;height:100%;object-fit:cover;" alt="poster"></div><div class="inf"><b>${f.t}</b><small>${f.g} · ${o.m==="v"?"👁 "+fv(tv(f)):f.d+" mnt"}</small>${o.p!=null?`<div class="bar"><i style="width:${Math.round(o.p*100)}%"></i></div>`:""}<button class="yb s" onclick="event.stopPropagation();openFilm(${f.id})">▶ Putar</button></div></div>`}

function sec(id,title,sub,arr,o={}){
let h=title?`<div class="sh"><h2>${title}</h2><small>${sub||""}</small></div>`:"";
h+=`<div class="railwrap"><button class="nv l glass lq" aria-label="Geser kiri" onclick="sl('${id}',-1)">‹</button><div class="rail" id="${id}">${arr.map((f,i)=>card(f,i,o)).join("")}</div><button class="nv r glass lq" aria-label="Geser kanan" onclick="sl('${id}',1)">›</button></div>`;return h}

function sl(id,d){const r=$(id);r.scrollBy({left:d*r.clientWidth*.85,behavior:"smooth"})}

function rankView(){
const arr=(rkTab==="pop"?byPop():byView()).slice(0,10),max=rkTab==="pop"?5:tv(arr[0]);
let h=`<h2 style="margin-top:34px">Ranking Film</h2><div class="chips"><div class="chip glass ${rkTab==="pop"?"on":""}" onclick="rkTab='pop';render()">★ Terpopuler</div><div class="chip glass ${rkTab==="views"?"on":""}" onclick="rkTab='views';render()">👁 Banyak Ditonton</div></div>`;
return h+arr.map((f,i)=>{const val=rkTab==="pop"?f.r:tv(f);return`<div class="row glass" style="--i:${i}" onclick="openFilm(${f.id})"><div class="num ${i<3?"n"+(i+1):""}">${i+1}</div><div class="th" style="${bg(f)}"><img src="${f.img}" style="width:100%;height:100%;object-fit:cover;border-radius:14px;" alt=""></div><div class="m"><b>${f.t}</b><br><span>${f.g} · ${f.y} · ${rkTab==="pop"?"★ "+f.r.toFixed(1)+" / 5":"👁 "+fv(tv(f))+" tontonan"}</span><div class="bar" style="margin:6px 0 0"><i style="width:${Math.round(val/max*100)}%"></i></div></div><button class="yb s">Tonton</button></div>`}).join("")}

function render(){
const em=session(),U=users();
$("auth").innerHTML=em&&U[em]?`<div class="av">${U[em].name[0].toUpperCase()}</div><span>${U[em].name}</span><button class="btn" onclick="logout()">Keluar</button>`:`<button class="btn" onclick="openAuth('login')">Masuk</button><button class="yb s" onclick="openAuth('reg')">Daftar</button>`;
["Home","Rank","Hist","Mcu"].forEach(n=>$("n"+n).classList.toggle("on",view===n.toLowerCase().replace("home","home")));
const app=$("app");
if(view==="rank"){app.innerHTML=rankView();return}
if(view==="mcu"){paint({c:["#e23636","#2a0a0e"]});app.innerHTML=mcuView();return}
if(view==="hist"){
if(!em){app.innerHTML=`<h2 style="margin-top:34px">Riwayat Tontonan</h2><div class="empty glass">Masuk atau buat akun untuk melihat riwayat tontonan Anda.<br><br><button class="yb" onclick="openAuth('login')">Masuk</button></div>`;return}
const H=hist(em);
app.innerHTML=`<h2 style="margin-top:34px">Riwayat Tontonan</h2>`+(H.length?H.map((h,i)=>{const f=FILMS.find(x=>x.id===h.id);if(!f)return"";const done=h.p>=.98;
return`<div class="row glass" style="--i:${i}" onclick="openFilm(${f.id})"><div class="th" style="${bg(f)}"><img src="${f.img}" style="width:100%;height:100%;object-fit:cover;border-radius:14px;"></div><div class="m"><b>${f.t}</b><br><span>${new Date(h.at).toLocaleString("id-ID",{dateStyle:"medium",timeStyle:"short"})} · ${done?"Selesai":Math.round(h.p*100)+"% ditonton"}</span><div class="bar" style="margin:6px 0 0"><i style="width:${Math.round(h.p*100)}%"></i></div></div><button class="yb s">${done?"Tonton lagi":"Lanjutkan"}</button></div>`}).join("")+`<button class="btn" onclick="clearHist()">Hapus riwayat</button>`:`<div class="empty glass">Belum ada film yang ditonton. Yuk mulai nonton!</div>`);return}
const q=$("q").value.toLowerCase().trim(),H=em?hist(em):[],f0=FILMS.find(x=>x.id===sel);paint(f0);
let h=`<section class="hero" id="hero">${heroHTML(f0)}</section>`;
h+=`<div class="chips">${GENRES.map(g=>`<div class="chip glass ${g===genre?"on":""}" tabindex="0" onclick="genre='${g}';render()">${g}</div>`).join("")}</div>`;
const cont=H.filter(x=>x.p<.98).slice(0,10);
if(genre==="Semua"&&!q){
if(em&&cont.length)h+=sec("rCont","Lanjutkan Menonton","Dari menit terakhir",cont.map(x=>FILMS.find(f=>f.id===x.id)),{});
h+=sec("rAll","Semua Film",`${FILMS.length} film · geser untuk melihat lainnya`,FILMS);
h+=sec("rPop","★ Terpopuler","Rating tertinggi",byPop().slice(0,10));
h+=sec("rView","👁 Banyak Ditonton","Paling sering diputar",byView().slice(0,10),{m:"v"});
h+=mcuRail();
}else{
const S=saved();let list=FILMS.filter(f=>genre==="Semua"||(genre===SAVED?S.includes(f.id):f.g===genre));list=list.filter(f=>f.t.toLowerCase().includes(q));
h+=list.length?sec("rRes",genre==="Semua"?"Hasil pencarian":genre,`${list.length} film`,list):`<div class="empty glass">${genre===SAVED&&!q?"Belum ada film yang disimpan.":"Film tidak ditemukan."}</div>`}
h+=`<p class="note">Web ini masih dalam tahap pengembangan oleh kelompok 3</p>`;app.innerHTML=h}
function clearHist(){const em=session();if(em&&confirm("Hapus semua riwayat tontonan?")){sv("ny_hist_"+em,[]);render()}}

/* Marvel Cinematic Universe */
const MCU=[
{t:"Iron Man",y:2008,p:1,e:"🦾",c:["#dc2626","#3b0a0a"],s:"Miliarder jenius Tony Stark membangun baju zirah canggih setelah lolos dari penyekapan, lalu memakainya untuk melawan ancaman dari dalam perusahaannya sendiri."},
{t:"Captain America: The First Avenger",y:2011,p:1,e:"🛡️",c:["#2563eb","#0b1b4d"],s:"Steve Rogers, pemuda ringkih di masa Perang Dunia II, menjadi prajurit super dan memimpin pasukan melawan organisasi Hydra."},
{t:"The Avengers",y:2012,p:1,e:"⚡",c:["#6366f1","#1e1b4b"],s:"Para pahlawan yang berbeda karakter dipaksa bersatu untuk menghentikan Loki dan pasukan alien yang menyerang New York."},
{t:"Guardians of the Galaxy",y:2014,p:2,e:"🌌",c:["#a855f7","#2e1065"],s:"Sekelompok penjahat antariksa yang tak akur terpaksa bekerja sama demi merebut sebuah orb berkekuatan dahsyat."},
{t:"Avengers: Age of Ultron",y:2015,p:2,e:"🤖",c:["#0ea5e9","#082f49"],s:"Program pelindung dunia ciptaan Tony Stark berbalik menjadi ancaman, dan para Avengers harus menghentikannya."},
{t:"Doctor Strange",y:2016,p:3,e:"🔮",c:["#f59e0b","#78350f"],s:"Seorang ahli bedah brilian kehilangan kemampuan tangannya, lalu belajar sihir dan dimensi lain di Kamar-Taj."},
{t:"Black Panther",y:2018,p:3,e:"🐆",c:["#7c3aed","#1a0b33"],s:"T’Challa pulang ke Wakanda untuk naik takhta dan menghadapi tantangan atas kerajaan serta rahasia teknologinya."},
{t:"Avengers: Infinity War",y:2018,p:3,e:"💎",c:["#9333ea","#2a0a3d"],s:"Thanos mengejar enam Infinity Stone untuk memusnahkan separuh kehidupan, sementara para pahlawan berjuang menghentikannya."},
{t:"Avengers: Endgame",y:2019,p:3,e:"⏳",c:["#eab308","#3d2a05"],s:"Setelah kehilangan besar, para Avengers yang tersisa menyusun rencana nekat untuk memulihkan apa yang telah hilang."},
{t:"Shang-Chi and the Legend of the Ten Rings",y:2021,p:4,e:"🥋",c:["#16a34a","#052e16"],s:"Shang-Chi harus menghadapi masa lalunya ketika ayahnya, pemimpin organisasi Ten Rings, kembali memanggilnya."},
{t:"Spider-Man: No Way Home",y:2021,p:4,e:"🕷️",c:["#ef4444","#1e1b4b"],s:"Peter Parker meminta bantuan Doctor Strange untuk menutupi identitasnya, namun mantra itu membuka pintu antar-semesta."},
{t:"Doctor Strange in the Multiverse of Madness",y:2022,p:4,e:"🌀",c:["#f43f5e","#3b0764"],s:"Doctor Strange menjelajahi multisemesta untuk melindungi seorang gadis muda yang diburu kekuatan jahat."},
{t:"Guardians of the Galaxy Vol. 3",y:2023,p:5,e:"🎵",c:["#ec4899","#4a044e"],s:"Para Guardians berkumpul untuk misi penyelamatan yang menguak masa lalu kelam salah satu anggotanya."},
{t:"Deadpool & Wolverine",y:2024,p:5,e:"⚔️",c:["#e11d48","#450a0a"],s:"Deadpool dan Wolverine terpaksa bekerja sama dalam misi kacau yang mengguncang garis waktu."},
{t:"The Fantastic Four: First Steps",y:2025,p:6,e:"4️⃣",c:["#0891b2","#083344"],s:"Empat penjelajah antariksa yang mendapat kekuatan super menjadi keluarga pahlawan pertama dan menghadapi ancaman kosmik."}];
let mph=0;
const trailerURL=m=>"https://www.youtube.com/results?search_query="+encodeURIComponent(m.t+" "+m.y+" official trailer");
function mcuCard(m,i){return`<div class="film" tabindex="0" style="--i:${Math.min(i,10)}" onclick="openMcu(${MCU.indexOf(m)})" onkeydown="if(event.key==='Enter')openMcu(${MCU.indexOf(m)})"><div class="poster mp" style="${bg(m)}"><div class="tag">Phase ${m.p}</div><span class="gl">${m.e}</span><div class="mt"><h4>${m.t}</h4><small>${m.y}</small></div></div></div>`}
function mcuRail(){return`<div class="sh"><h2>🦸 Marvel Cinematic Universe</h2><button class="btn" style="margin:0 0 12px" onclick="go('mcu')">Lihat semua →</button></div><div class="railwrap"><button class="nv l glass lq" aria-label="Geser kiri" onclick="sl('rMcu',-1)">‹</button><div class="rail" id="rMcu">${MCU.map(mcuCard).join("")}</div><button class="nv r glass lq" aria-label="Geser kanan" onclick="sl('rMcu',1)">›</button></div>`}
function mcuView(){const list=MCU.filter(m=>!mph||m.p===mph);return`<section class="hero" style="min-height:auto;padding:34px 8px 6px"><div class="ht"><h1>Marvel Cinematic Universe</h1><p>Kumpulan film MCU berdasarkan fase. Klik poster untuk melihat sinopsis dan trailernya.</p></div></section><div class="chips">${[0,1,2,3,4,5,6].map(p=>`<div class="chip glass ${p===mph?"on":""}" tabindex="0" onclick="mph=${p};render()">${p?"Phase "+p:"Semua"}</div>`).join("")}</div><div class="mgrid">${list.map(mcuCard).join("")}</div>`}
function openMcu(i){const m=MCU[i];$("mcuB").innerHTML=`<div class="mm"><div class="poster mp" style="${bg(m)}"><div class="tag">Phase ${m.p}</div><span class="gl">${m.e}</span><div class="mt"><h4>${m.t}</h4><small>${m.y}</small></div></div><div class="mi"><h3>${m.t}</h3><div class="meta"><span class="glass">Marvel Cinematic Universe</span><span class="glass">Phase ${m.p}</span><span class="glass">${m.y}</span></div><p>${m.s}</p><a class="trl" style="${bg(m)}" href="${trailerURL(m)}" target="_blank" rel="noopener noreferrer"><span class="pl glass">▶</span><b>Tonton trailer · dibuka di YouTube</b></a></div></div>`;show("mMcu")}

/* Pemutar Video Web Asli */
function openFilm(id){
    const em=session();if(!em){openAuth("login");$("err").textContent="Masuk dulu untuk menonton film.";return}
    cur=FILMS.find(f=>f.id===id);counted=false;const rec=hist(em).find(x=>x.id===id);pos=rec&&rec.p<.98?rec.p*cur.d:0;
    
    // Injeksi tag <video> asli ke elemen kontainer #scr
    $("scr").innerHTML = `<video id="mainWebVideo" src="${cur.vid}" poster="${cur.img}" controls style="width:100%; height:100%; border-radius:16px 16px 0 0; background-color:#000; object-fit:contain; display:block;"></video>`;
    
    $("pt").textContent=cur.t;
    $("pm").textContent=`${cur.g} · ${cur.y} · ${cur.d} menit · ★ ${cur.r.toFixed(1)} · 👁 ${fv(tv(cur))}`;
    $("ps").textContent=cur.s;
    
    show("mPlay");
    addView();
    
    const v = $("mainWebVideo");
    if(v) {
        v.currentTime = (pos / cur.d) * v.duration || 0;
        v.play().catch(e => console.log("Autoplay dicegah oleh browser. Silakan klik play manual."));
        
        v.ontimeupdate = () => {
            if(v.duration) {
                pos = (v.currentTime / v.duration) * cur.d;
                saveHist();
            }
        };
    }
}

function closePlayer(){
    const v = $("mainWebVideo");
    if(v) {
        v.pause();
        if(v.duration) pos = (v.currentTime / v.duration) * cur.d;
        v.src = "";
        v.load();
    }
    saveHist();
    hide("mPlay");
    cur=null;
    render();
}

function saveHist(){const em=session();if(!em||!cur)return;let H=hist(em).filter(x=>x.id!==cur.id);H.unshift({id:cur.id,at:Date.now(),p:pos/cur.d});sv("ny_hist_"+em,H.slice(0,50))}

// Event listener modal close
["mAuth","mMcu"].forEach(id=>$(id).addEventListener("click",e=>{if(e.target.id===id)hide(id)}));
$("mPlay").addEventListener("click",e=>{if(e.target.id==="mPlay")closePlayer()});
["em","pw","rn"].forEach(id=>$(id).addEventListener("keydown",e=>{if(e.key==="Enter")submitAuth()}));

/* Kilau liquid glass mengikuti kursor */
document.addEventListener("pointermove",e=>{const t=e.target.closest&&e.target.closest(".glass");if(!t)return;const r=t.getBoundingClientRect();t.style.setProperty("--mx",(e.clientX-r.left)+"px");t.style.setProperty("--my",(e.clientY-r.top)+"px")});
tab("login");render();