-- ╔══════════════════════════════════════════════════════╗
-- ║   db_dispopar.sql — DATABASE WISATA ENREKANG         ║
-- ║   1 tabel wisata + kolom populer                     ║
-- ╚══════════════════════════════════════════════════════╝

DROP DATABASE IF EXISTS db_dispopar;
CREATE DATABASE db_dispopar CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE db_dispopar;

CREATE TABLE wisata (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    judul       VARCHAR(255)  NOT NULL,
    subjudul    VARCHAR(255)  DEFAULT '',
    lokasi      VARCHAR(255)  DEFAULT '',
    kategori    VARCHAR(100)  DEFAULT '',
    deskripsi   LONGTEXT,
    fasilitas   TEXT,                          -- JSON array: ["Parkir","Musholla"]
    jarak       VARCHAR(50)   DEFAULT '',
    pengelola   VARCHAR(255)  DEFAULT '',
    gambar      LONGTEXT,                      -- URL atau base64
    thumb       LONGTEXT,                      -- versi kecil untuk card
    suara_tipe  VARCHAR(50)   DEFAULT 'wind',  -- wind/water/forest/leaves/river/jungle
    video_id    VARCHAR(50)   DEFAULT '',
    video_tipe  VARCHAR(100)  DEFAULT '',
    video_dur   VARCHAR(20)   DEFAULT '',
    urutan      INT           DEFAULT 0,
    populer     TINYINT(1)    DEFAULT 0,       -- 1 = tampil di halaman utama (parallax)
    aktif       TINYINT(1)    DEFAULT 1,       -- 1 = tampil, 0 = sembunyikan
    created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ═══════════════════════════════════════════════════════
-- DATA: populer=1 → tampil di index.html (parallax)
--       populer=0 → hanya di destinasi.html (card)
-- ═══════════════════════════════════════════════════════
INSERT INTO wisata (judul, subjudul, lokasi, kategori, deskripsi, fasilitas, jarak, pengelola, gambar, thumb, suara_tipe, video_id, video_tipe, video_dur, urutan, populer) VALUES

('Enrekang Emas 360°','Buttu Macca','Desa Bambapuang, Kec. Anggeraja','Panorama',
'<p>Berdiri di satu titik, dua gunung legendaris tersaji dalam <strong>panorama 360 derajat</strong>. Surga tersembunyi "Swiss-nya" Sulawesi Selatan.</p>',
'["Cafetaria","Musholla","Parkir Area","Spot Foto"]','15 Km','Pemda. Enrekang',
'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80',
'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
'wind','j-BQ_WAVkXo','Drone View','4:32',1,1),

('Permandian Alam','Lewaja','Kelurahan Lewaja, Kec. Enrekang','Wisata Air',
'<p>Kolam renang alami dengan <strong>air jernih</strong> dari sumber pegunungan. Lengkap dengan waterboom untuk semua usia.</p>',
'["Kolam Renang","Waterboom","Balai Pertemuan","Rumah Makan","Spot Foto"]','5 Km','Pemda. Enrekang',
'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=1600&q=80',
'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=600&q=80',
'water','V-_O7nl0Ii0','Wisata Air','3:15',2,1),

('Gunung Nona','Villa Bambapuang','Desa Bambapuang, Kec. Anggeraja','Gunung',
'<p><strong>Buttu Kabobong</strong> — gunung ikonik dengan lereng unik membentuk siluet memukau di antara vegetasi hijau tropis.</p>',
'["Cafetaria","Musholla","Parkir Area","Spot Foto"]','15 Km','Pemda. Enrekang',
'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&q=80',
'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80',
'forest','ZxNnFBoGWKQ','Alam Gunung','5:48',3,1),

('Anjungan Sungai','Mata Allo','Kelurahan Galonta, Kec. Enrekang','Taman',
'<p>Taman terbuka hijau di tepi Sungai Mata Allo. Dirancang <strong>ramah difabel</strong> dengan spot foto modern.</p>',
'["Ramah Difabel","Taman Hijau","Parkir Area","Spot Foto"]','1 Km','Pemda. Enrekang',
'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=1600&q=80',
'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=600&q=80',
'leaves','eKFTSSKCzWA','Taman Kota','2:54',4,1),

('Gunung Latimojong','Trek Pendakian','Desa Latimojong, Kec. Buntu Batu','Pendakian',
'<p>Salah satu <strong>puncak tertinggi Sulawesi</strong>. Trek jungle tracking melewati hutan lebat dan kabut pagi yang dramatis.</p>',
'["Jungle Tracking","Outbound","Area Parkir","Musholla","Wifi Area","Spot Foto"]','70 Km','Pokdarwis Sirandepala',
'https://images.unsplash.com/photo-1551632811-561732d1e306?w=1600&q=80',
'https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&q=80',
'jungle','sGkh1W5cbH4','Pendakian','6:20',5,1),

-- populer=0 → hanya muncul di halaman destinasi.html
('Anjungan Sungai','Mata Saddang','Kelurahan Galonta, Kec. Enrekang','Taman',
'<p>Taman serba guna dengan <strong>ruang pameran budaya lokal</strong>, taman bermain anak, dan area santai di tepi sungai.</p>',
'["Taman Bermain","Ruang Pameran","Parkir Area","Spot Foto"]','1 Km','Pemda. Enrekang',
'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1600&q=80',
'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=600&q=80',
'river','CHJf5hW7RBY','Taman Publik','3:40',6,0);
