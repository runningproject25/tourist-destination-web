// ==========================================================
// js/destinasi.js  —  Logic untuk destinasi.html
// Website Wisata Enrekang
//
// ALUR KERJA:
// 1. Halaman dibuka → ambilData() dipanggil
// 2. Data dari API → simpan ke semuaData → tampilkanKartu()
// 3. User klik filter / ketik pencarian → filterDanCari()
// 4. filterDanCari() saring semuaData → tampilkanKartu()
// ==========================================================

// Deteksi path API otomatis (tidak perlu ubah manual)
const jalurBase = window.location.pathname.replace(/\/[^/]*$/, '');
const URL_API   = jalurBase + '/api/wisata.php?mode=semua';

// Elemen HTML yang dipakai
const elGrid     = document.getElementById('dest-grid');
const elJumlah   = document.getElementById('count-label');
const elCari     = document.getElementById('search-input');

// State (data yang disimpan di memori)
let semuaData    = [];   // semua data dari API
let filterAktif  = 'semua';
let kataCari     = '';

// Ikon untuk tiap kategori
const IKON = { 'Panorama':'🏔', 'Wisata Air':'💧', 'Gunung':'🗻', 'Taman':'🌿', 'Pendakian':'🥾' };


// ----------------------------------------------------------
// 1. AMBIL DATA dari API
// ----------------------------------------------------------
async function ambilData() {
    try {
        const respons = await fetch(URL_API);
        if (!respons.ok) throw new Error('HTTP ' + respons.status);
        const json = await respons.json();
        if (!json.sukses) throw new Error(json.pesan);

        semuaData = json.data;
        tampilkanKartu(semuaData);

    } catch (err) {
        elGrid.innerHTML = `
            <div style="grid-column:1/-1; text-align:center; padding:80px 24px; color:#a09890;">
                <p style="font-family:'Lora',serif; font-size:22px; color:#6b6560; margin-bottom:8px;">
                    Gagal memuat data
                </p>
                <p style="font-size:13px;">Error: ${err.message}</p>
                <p style="font-size:13px; margin-top:8px;">
                    Pastikan XAMPP aktif dan database sudah diimport.
                </p>
            </div>`;
    }
}


// ----------------------------------------------------------
// 2. BUAT HTML SATU KARTU
// ----------------------------------------------------------
function buatKartu(wisata, urutan) {
    const ikon      = IKON[wisata.kategori] || '📍';
    // const fasilitas = (wisata.fasilitas || []).slice(0, 4);
    const fasilitas = (wisata.fasilitas || []);
    const deskripsi = wisata.deskripsi.replace(/<[^>]*>/g, ''); // hapus tag HTML
    const jeda      = (urutan % 6) * 80; // animasi muncul berurutan

    const tagFasilitas = fasilitas
        .map(f => `<span class="card-tag">${f}</span>`)
        .join('');

    // const tagLebih = wisata.fasilitas.length > 4
    //     ? `<span class="card-tag">+${wisata.fasilitas.length - 4}</span>`
    //     : '';

    const badgePopuler = wisata.populer == 1
        ? `<div class="card-populer">⭐ Populer</div>`
        : '';

    return `
    <article class="card" style="animation-delay:${jeda}ms"
             onclick="window.location='detail.html?id=${wisata.id}'">

        <div class="card-img">
            <img src="${wisata.gambar}" alt="${wisata.objek_wisata}" loading="lazy">
            <div class="card-badge">${ikon} ${wisata.kategori}</div>
            <div class="card-jarak">📍 ${wisata.jarak} dari kota</div>
            ${badgePopuler}
        </div>

        <div class="card-body">
            <a href="${wisata.link_maps}" class="card-lokasi">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                </svg>
                ${wisata.lokasi}
            </a>

            <h2 class="card-judul">${wisata.objek_wisata}</h2>
            <p class="card-desc">${deskripsi}</p>

            <div class="card-tags">
                ${tagFasilitas}            
            </div>

            <div class="card-footer">
                <span class="card-pengelola">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="4" width="18" height="18" rx="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8"  y1="2" x2="8"  y2="6"/>
                        <line x1="3"  y1="10" x2="21" y2="10"/>
                    </svg>
                    ${wisata.pengelola}
                </span>
            </div>
        </div>
    </article>`;
}

// <a href="detail.html?id=${wisata.id}" class="card-cta"
//    onclick="event.stopPropagation()">
//     Lihat Detail →
// </a>
// ----------------------------------------------------------
// 3. TAMPILKAN SEMUA KARTU KE GRID
// ----------------------------------------------------------
function tampilkanKartu(data) {
    elJumlah.textContent = data.length + ' destinasi ditemukan';

    if (data.length === 0) {
        elGrid.innerHTML = `
            <div style="grid-column:1/-1; text-align:center; padding:80px 24px;">
                <p style="font-family:'Lora',serif; font-size:24px; color:#6b6560; margin-bottom:8px;">
                    Tidak ada hasil
                </p>
                <p style="font-size:13px; color:#a09890;">Coba kata kunci lain atau ubah filter.</p>
            </div>`;
        return;
    }

    elGrid.innerHTML = data.map(buatKartu).join('');
}


// ----------------------------------------------------------
// 4. FILTER + PENCARIAN (dikombinasi dalam 1 fungsi)
// ----------------------------------------------------------
function filterDanCari() {
    let hasil = semuaData;

    // Saring berdasarkan kategori
    if (filterAktif !== 'semua') {
        hasil = hasil.filter(w => w.kategori === filterAktif);
    }

    // Saring berdasarkan kata pencarian
    if (kataCari.trim()) {
        const q = kataCari.toLowerCase();
        hasil = hasil.filter(w =>
            w.objek_wisata.toLowerCase().includes(q)    ||
            w.lokasi.toLowerCase().includes(q)   ||
            w.deskripsi.toLowerCase().includes(q)
        );
    }

    tampilkanKartu(hasil);
}


// ----------------------------------------------------------
// 5. EVENT — Klik tombol filter
// ----------------------------------------------------------
document.querySelectorAll('.filter-btn').forEach(function(tombol) {
    tombol.addEventListener('click', function() {
        // Hapus .active dari semua tombol
        document.querySelectorAll('.filter-btn').forEach(function(t) {
            t.classList.remove('active');
        });
        // Pasang .active ke tombol yang diklik
        tombol.classList.add('active');

        filterAktif = tombol.dataset.filter;
        filterDanCari();
    });
});


// ----------------------------------------------------------
// 6. EVENT — Ketik di kotak pencarian
// ----------------------------------------------------------
elCari.addEventListener('input', function(e) {
    kataCari = e.target.value;
    filterDanCari();
});


// ----------------------------------------------------------
// Jalankan saat halaman pertama dibuka
// ----------------------------------------------------------
ambilData();
