// ==========================================================
// js/utama.js  —  Logic untuk index.html
// Website Wisata Enrekang
//
// BAGIAN:
// 0. Navbar 
// A. Data destinasi
// B. Render section ke halaman
// C. Audio alam (Web Audio API)
// D. Hero — efek musim & hujan
// E. Scroll — parallax, dwell timer, counter, nav dots
// F. Putar video YouTube
// G. Unlock audio setelah interaksi pertama
// ==========================================================

// 0. Navbar
var elNavbar = document.getElementById('navbar');
var scrollSebelumnya = 0;

function scrollNavbarHilang() {
    var scrollSekarang = window.scrollY;
    console.log('sekarang:', scrollSekarang);
    console.log('sebelumnya:', scrollSebelumnya);
    if (scrollSekarang > scrollSebelumnya && scrollSekarang > 1) {
        elNavbar.classList.add('tersembunyi');
        elNavbar.classList.remove('scrolled');
        elNavbar.style.display = "none";
    } else {
        elNavbar.classList.remove('tersembunyi');
        elNavbar.classList.add('scrolled');
        elNavbar.style.display = "flex";
    }
    scrollSebelumnya = scrollSekarang;
}
window.addEventListener('scroll', scrollNavbarHilang, { passive: true });


// var elNavbar   = document.getElementById('navbar');
// var elMobile   = document.getElementById('nav-mobile');
// var menuTerbuka = false;

// // Tambahkan class .scrolled ke navbar saat user scroll
// function cekScrollNavbar() {
//     if (window.scrollY > 50) {
//         elNavbar.style.display = "flex";
//         elNavbar.classList.add('scrolled');
//     } else {
//         elNavbar.style.display = "none";
//         elNavbar.classList.remove('scrolled');
//     }
// }

// window.addEventListener('scroll', cekScrollNavbar, { passive: true });
// cekScrollNavbar(); // cek langsung saat halaman dibuka

// Buka / tutup menu mobile
function toggleMenu() {
    menuTerbuka = !menuTerbuka;
    elNavbar.classList.toggle('menu-terbuka', menuTerbuka);
    elMobile.classList.toggle('terbuka', menuTerbuka);
    // Kunci scroll body saat menu terbuka
    document.body.style.overflow = menuTerbuka ? 'hidden' : '';
}

// Tutup menu saat klik di luar
document.addEventListener('click', function(e) {
    if (menuTerbuka && !elNavbar.contains(e.target) && !elMobile.contains(e.target)) {
        toggleMenu();
    }
});
// var timerIdle = null;

// function resetIdle() {
//     elNavbar.classList.remove('tersembunyi');
//     clearTimeout(timerIdle);
//     timerIdle = setTimeout(function() {
//         elNavbar.classList.add('tersembunyi');
//     }, 700);
// }

// window.addEventListener('scroll',     resetIdle, { passive: true });
// window.addEventListener('mousemove',  resetIdle, { passive: true });
// window.addEventListener('touchstart', resetIdle, { passive: true });
// window.addEventListener('touchmove',  resetIdle, { passive: true });

// resetIdle(); // mulai timer sejak halaman dibuka
// ==========================================================
// A. DATA DESTINASI
// Ubah data di sini untuk menambah/mengubah destinasi
// ==========================================================


// Deteksi path API otomatis (tidak perlu ubah manual)
const jalurBase = window.location.pathname.replace(/\/[^/]*$/, '');
const URL_API   = jalurBase + '/api/wisata.php?mode=populer';
let semuaData    = [];   // semua data dari API
// let dataSuara = [];

// async function ambilDataSuara() {
//     try {
//         const respons = await fetch(URL_API);
//         if (!respons.ok) throw new Error('HTTP ' + respons.status);
//         const json = await respons.json();
//         if (!json.sukses) throw new Error(json.pesan);

//         return json.data.suaraTipe;

//     } catch (err) {
//         console.log("error diutama.js ambilData", err.message)
//     }
// }
async function ambilData() {
    try {
        const respons = await fetch(URL_API);
        if (!respons.ok) throw new Error('HTTP ' + respons.status);
        const json = await respons.json();
        if (!json.sukses) throw new Error(json.pesan);

        semuaData = json.data;
        mapKartu(semuaData);

    } catch (err) {
        console.log("error diutama.js ambilData", err.message)
    }
}
// ==========================================================
// B. RENDER SECTION KE HALAMAN
// ==========================================================
const wadah    = document.getElementById('destinasi-wrapper');
const navDots  = document.getElementById('nav-dots');

function buatDanTampilkanKartu(w, i) {
    
    // ── Section destinasi fullscreen ──
    var sec = document.createElement('section');
    sec.className    = 'destinasi';
    sec.id           = 'dest-' + i;
    sec.dataset.index = i;
    sec.innerHTML = `
        <div class="dest-bg" style="background-image:url('${w.gambar}')"></div>
        <div class="dest-overlay" style="background:linear-gradient(105deg,rgba(0,0,0,0.88) 0%,rgba(0,0,0,0.5) 55%,${w.warna} 100%)"></div>
        <div class="dest-nomor">${String(i+1).padStart(2,'0')}</div>
        <div class="dest-content">
            <div class="dest-badge">${w.kategori}</div>
            <h2 class="dest-judul">
                ${w.objek_wisata}
            </h2>
            <div class="dest-lokasi">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"/>
                </svg>
                ${w.lokasi}
            </div>
            <p class="dest-deskripsi">${w.deskripsi}</p>
            <div class="dest-info">
                <div class="dest-info-item">
                    <span class="dest-info-label">Jarak dari Kota</span>
                    <span class="dest-info-val">${w.jarak}</span>
                </div>
                <div class="dest-sep"></div>
                <div class="dest-info-item">
                    <span class="dest-info-label">Pengelola</span>
                    <span class="dest-info-val">${w.pengelola}</span>
                </div>
                <div class="dest-sep"></div>
                <div class="dest-info-item">
                    <span class="dest-info-label">Fasilitas</span>
                    <span class="dest-info-val">${w.fasilitas.map(f => `<span class="fasil">${f}</span>`).join('')}</span>
                </div>
            </div>
        </div>`;
        // <div class="dest-thumb">
        //     <img src="${w.thumb}" alt="${w.objek_wisata}" loading="lazy">
        // </div>
    wadah.appendChild(sec);

    // ── Garis pemisah ──
    var pemisah = document.createElement('div');
    pemisah.className = 'section-divider';
    wadah.appendChild(pemisah);

    // ── Section video ──
    var vid = document.createElement('div');
    vid.className = 'video-section';
    var balik = (i % 2 === 1) ? 'reverse' : '';
    vid.innerHTML = `
        <div class="video-inner ${balik}">
            <div class="video-text">
                <div class="video-eyebrow">🎬 Video Destinasi ${String(i+1).padStart(2,'0')}</div>
                <h3 class="video-title">
                    ${w.objek_wisata}
                </h3>
                <p class="video-desc">${w.deskripsi}</p>
                <div class="video-meta">
                    <div class="video-meta-item">
                        <span class="video-meta-label">Tipe</span>
                        <span class="video-meta-val">${w.video_tipe}</span>
                    </div>
                    <div class="video-meta-item">
                        <span class="video-meta-label">Durasi</span>
                        <span class="video-meta-val">${w.video_dur}</span>
                    </div>
                    <div class="video-meta-item">
                        <span class="video-meta-label">Lokasi</span>
                        <span class="video-meta-val">${w.jarak} dari kota</span>
                    </div>
                </div>
                <a href="https://youtu.be/${w.video_id}" target="_blank" class="video-cta">
                    Buka di YouTube →
                </a>
            </div>
            <div class="video-player" onclick="putarVideo(this, '${w.video_id}')">
                <div class="video-cover" style="background-image:url('https://img.youtube.com/vi/${w.video_id}/hqdefault.jpg')"></div>
                <div class="play-btn">
                    <div class="play-circle">
                        <svg fill="white" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    </div>
                    <div class="play-label">Putar Video</div>
                </div>
                <div class="video-badge">${w.video_tipe}</div>
                <div class="video-dur">${w.video_dur}</div>
            </div>
        </div>`;
    wadah.appendChild(vid);

    // ── Titik navigasi kanan ──
    var dot = document.createElement('div');
    dot.className = 'dot';
    dot.dataset.index = i;
    dot.innerHTML = `<span class="dot-label">${w.objek_wisata}</span>`;
    dot.onclick = function() { sec.scrollIntoView({ behavior: 'smooth' }); };
    navDots.appendChild(dot);
};

function mapKartu(data) {
    
     data.map(buatDanTampilkanKartu).join('');
}
// ==========================================================
// C. AUDIO ALAM — Web Audio API
// Semua suara dibuat langsung di browser, tanpa file audio
// ==========================================================
var audioCtx    = null;  // konteks audio utama
var gainUtama   = null;  // volume master destinasi
var nodeSuara   = [];    // node yang sedang aktif
var idxAktif    = -1;    // index destinasi yang sedang berbunyi
var audioHidup  = false; // apakah user sudah mengizinkan audio

// Buka AudioContext (harus dipanggil setelah interaksi user)
function bukaAudio() {
    if (!audioCtx) {
        audioCtx  = new (window.AudioContext || window.webkitAudioContext)();
        gainUtama = audioCtx.createGain();
        gainUtama.gain.value = 0;
        gainUtama.connect(audioCtx.destination);
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
}

// Fade volume pelan-pelan
function fadeVolume(ke, milidetik) {
    gainUtama.gain.cancelScheduledValues(audioCtx.currentTime);
    gainUtama.gain.setValueAtTime(gainUtama.gain.value, audioCtx.currentTime);
    gainUtama.gain.linearRampToValueAtTime(ke, audioCtx.currentTime + milidetik / 1000);
}

// Hentikan semua suara dengan fade out
function hentikanSemua(ms) {
    ms = ms || 600;
    var lama = nodeSuara.slice();
    fadeVolume(0, ms);
    setTimeout(function() {
        lama.forEach(function(n) { try { n.stop(); } catch(e) {} });
    }, ms + 50);
    nodeSuara = [];
}

// Buat brown noise (suara dasar seperti angin/air)
function buatNoise(tipe) {
    var buf  = audioCtx.createBuffer(1, audioCtx.sampleRate * 4, audioCtx.sampleRate);
    var data = buf.getChannelData(0);
    if (tipe === 'white') {
        for (var i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    } else {
        var terakhir = 0;
        for (var i = 0; i < data.length; i++) {
            var w = Math.random() * 2 - 1;
            data[i] = (terakhir + 0.02 * w) / 1.02;
            terakhir = data[i];
            data[i] *= 3.5;
        }
    }
    var src = audioCtx.createBufferSource();
    src.buffer = buf;
    src.loop   = true;
    return src;
}

// Buat LFO (oscillator lambat untuk modulasi suara)
function buatLFO(frekuensi) {
    var osc = audioCtx.createOscillator();
    osc.frequency.value = frekuensi;
    osc.start();
    return osc;
}

// Pembuat suara tiap tipe destinasi
var pembuatSuara = {
    wind: function() {
        var n = buatNoise('brown');
        var f = audioCtx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 400; f.Q.value = 0.6;
        var lfo = buatLFO(0.18); var lg = audioCtx.createGain(); lg.gain.value = 200;
        lfo.connect(lg); lg.connect(f.frequency);
        var g = audioCtx.createGain(); g.gain.value = 0.9;
        n.connect(f); f.connect(g); g.connect(gainUtama); n.start();
        return [n, lfo];
    },
    water: function() {
        var n = buatNoise('white');
        var hp = audioCtx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 800;
        var lp = audioCtx.createBiquadFilter(); lp.type = 'lowpass';  lp.frequency.value = 5000;
        var lfo = buatLFO(8); var lg = audioCtx.createGain(); var tg = audioCtx.createGain();
        lg.gain.value = 0.15; tg.gain.value = 0.75;
        lfo.connect(lg); lg.connect(tg.gain);
        n.connect(hp); hp.connect(lp); lp.connect(tg); tg.connect(gainUtama); n.start();
        return [n, lfo];
    },
    forest: function() {
        var angin = buatNoise('brown'); var f = audioCtx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 600;
        var g = audioCtx.createGain(); g.gain.value = 0.5;
        angin.connect(f); f.connect(g); g.connect(gainUtama); angin.start();
        var nodes = [angin];
        function cicitan() {
            if (!audioHidup) return;
            var osc = audioCtx.createOscillator(); var env = audioCtx.createGain();
            osc.type = 'sine'; osc.frequency.value = 1800 + Math.random() * 1200;
            env.gain.setValueAtTime(0, audioCtx.currentTime);
            env.gain.linearRampToValueAtTime(0.08, audioCtx.currentTime + 0.02);
            env.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.18);
            osc.connect(env); env.connect(gainUtama);
            osc.start(); osc.stop(audioCtx.currentTime + 0.2);
            nodes.push(osc);
            setTimeout(cicitan, 800 + Math.random() * 2500);
        }
        setTimeout(cicitan, 500);
        return nodes;
    },
    leaves: function() {
        var n = buatNoise('white'); var f = audioCtx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 3000; f.Q.value = 1.2;
        var lfo = buatLFO(0.4); var lg = audioCtx.createGain(); lg.gain.value = 1200;
        lfo.connect(lg); lg.connect(f.frequency);
        var g = audioCtx.createGain(); g.gain.value = 0.6;
        n.connect(f); f.connect(g); g.connect(gainUtama); n.start();
        return [n, lfo];
    },
    river: function() {
        var n = buatNoise('brown'); var f = audioCtx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 1200;
        var lfo = buatLFO(0.25); var lg = audioCtx.createGain(); lg.gain.value = 400;
        lfo.connect(lg); lg.connect(f.frequency);
        var g = audioCtx.createGain(); g.gain.value = 1.1;
        n.connect(f); f.connect(g); g.connect(gainUtama); n.start();
        return [n, lfo];
    },
    jungle: function() {
        var angin = buatNoise('brown'); var wf = audioCtx.createBiquadFilter(); wf.type = 'lowpass'; wf.frequency.value = 500;
        var wg = audioCtx.createGain(); wg.gain.value = 0.45;
        angin.connect(wf); wf.connect(wg); wg.connect(gainUtama); angin.start();
        var osc = audioCtx.createOscillator(); var lfo = audioCtx.createOscillator();
        var lg = audioCtx.createGain(); var env = audioCtx.createGain();
        osc.type = 'sine'; osc.frequency.value = 4200;
        lfo.type = 'square'; lfo.frequency.value = 14;
        lg.gain.value = 0.055; env.gain.value = 0.07;
        lfo.connect(lg); lg.connect(env.gain);
        osc.connect(env); env.connect(gainUtama);
        osc.start(); lfo.start();
        return [angin, osc, lfo];
    }
};

// Mainkan suara untuk destinasi tertentu
function mainkanSuara(tipe, idx) {
    if (idxAktif === idx) return; // sudah main, tidak perlu ulang
    bukaAudio();
    hentikanSemua(700);
    idxAktif = idx;
    document.getElementById('sound-name').textContent = semuaData[idx].suara_tipe;
    document.getElementById('eq').classList.add('muted');

    setTimeout(function() {
        if (idxAktif !== idx) return; // user sudah pindah destinasi
        var pembuat = pembuatSuara[tipe] || pembuatSuara.wind;
        var nodes   = pembuat();
        nodeSuara   = Array.isArray(nodes) ? nodes : [nodes];
        fadeVolume(0.42, 1000);
        document.getElementById('eq').classList.remove('muted');
    }, 750);
}

// Toggle mute / unmute
var sedangSenyap = false;
document.getElementById('audio-btn').addEventListener('click', function() {
    sedangSenyap = !sedangSenyap;
    document.getElementById('ico-on').style.display  = sedangSenyap ? 'none' : '';
    document.getElementById('ico-off').style.display = sedangSenyap ? ''     : 'none';
    document.getElementById('eq').classList.toggle('muted', sedangSenyap);

    if (sedangSenyap) {
        hentikanSemua(500);
    } else {
        var idx = idxAktif;
        idxAktif = -1;
        if (idx >= 0) mainkanSuara(semuaData[idx].suara_tipe, idx);
    }
});


// ==========================================================
// D. HERO — GANTI WAKTU (Siang / Senja / Malam)
// ==========================================================
// var musimSaatIni = 'siang';

// Ganti waktu saat tombol diklik
// Fungsi ini mengubah class di <section id="hero-intro">
// CSS yang mengontrol gambar mana yang tampil (lihat utama.css bagian 6)
// function gantiMusim(waktu) {
//     musimSaatIni = waktu;

//     // Ganti class musim di section hero
//     document.getElementById('hero-intro').className = 'musim-' + waktu;

//     // Update tombol aktif
//     document.querySelectorAll('.musim-btn').forEach(function(btn) {
//         btn.classList.remove('active');
//     });
//     document.getElementById('btn-' + waktu).classList.add('active');
// }


// ==========================================================
// E. SCROLL — Parallax, Dwell Timer, Counter, Nav Dots
// ==========================================================
var elProgres    = document.getElementById('progress-bar');
var elCounter    = document.getElementById('counter-current');
var elOutroBg    = document.querySelector('.outro-bg');
var idxSection   = -1;  // index destinasi yang terlihat saat ini
var timerDwell   = null; // timer 0.2 detik sebelum audio mulai
var idxDwell     = -1;

// Jadwalkan audio mulai setelah diam 0.2 detik
function jadwalkanSuara(i) {
    if (idxDwell === i) return;
    clearTimeout(timerDwell);
    idxDwell = i;
    timerDwell = setTimeout(function() {
        if (idxDwell !== i || !audioHidup) return;
        mainkanSuara(semuaData[i].suara_tipe, i);
    }, 200);
}

// Batalkan timer dan hentikan audio
function batalkanSuara() {
    clearTimeout(timerDwell);
    idxDwell = -1;
    if (nodeSuara.length > 0) {
        hentikanSemua(600);
        idxAktif = -1;
        document.getElementById('eq').classList.add('muted');
    }
}

function saatScroll() {
    var maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    elProgres.style.width = (window.scrollY / maxScroll * 100) + '%';

    // Parallax outro
    var rOutro = document.getElementById('outro').getBoundingClientRect();
    elOutroBg.style.transform = 'translateY(' + (rOutro.top / window.innerHeight * -20) + '%)';

    var adaTerlihat = false;

    document.querySelectorAll('.destinasi').forEach(function(sec, i) {
        var r  = sec.getBoundingClientRect();
        var bg = sec.querySelector('.dest-bg');

        // Efek parallax: gerakkan background berlawanan arah scroll
        var kemajuan = (window.innerHeight - r.top) / (window.innerHeight + r.height);
        kemajuan = Math.max(0, Math.min(1, kemajuan));
        bg.style.transform = 'translateY(' + ((kemajuan - 0.5) * 30) + '%)';

        // Cek apakah section ada di tengah layar
        var terlihat = r.top < window.innerHeight * 0.55 && r.bottom > window.innerHeight * 0.45;

        if (terlihat) {
            adaTerlihat = true;
            sec.classList.add('in-view');

            if (idxSection !== i) {
                idxSection = i;
                batalkanSuara();
                jadwalkanSuara(i);

                // Update nav dots
                document.querySelectorAll('.dot').forEach(function(d, di) {
                    d.classList.toggle('active', di === i);
                });

                // Animasi counter berganti
                elCounter.style.opacity   = '0';
                elCounter.style.transform = 'translateY(10px)';
                setTimeout(function() {
                    elCounter.textContent     = String(i + 1).padStart(2, '0');
                    elCounter.style.opacity   = '1';
                    elCounter.style.transform = 'translateY(0)';
                }, 150);

                document.getElementById('sound-name').textContent = semuaData[i].suara_tipe;
            }
        }
    });

    // Tidak ada destinasi di layar → stop audio
    if (!adaTerlihat && idxSection >= 0) {
        var rHero = document.getElementById('hero-intro').getBoundingClientRect();
        var diHero = rHero.top < window.innerHeight && rHero.bottom > 0;
        if (!diHero) {
            batalkanSuara();
            idxSection = -1;
        }
    }

    // Video section muncul saat hampir terlihat
    document.querySelectorAll('.video-section').forEach(function(v) {
        if (v.getBoundingClientRect().top < window.innerHeight * 0.88) {
            v.classList.add('visible');
        }
    });
}

window.addEventListener('scroll', saatScroll, { passive: true });
saatScroll(); // jalankan sekali saat halaman dibuka


// ==========================================================
// F. PUTAR VIDEO YOUTUBE
// ==========================================================
function putarVideo(player, videoId) {
    var cover = player.querySelector('.video-cover');
    var play  = player.querySelector('.play-btn');

    cover.style.opacity = '0';
    play.style.opacity  = '0';
    setTimeout(function() {
        cover.style.display = 'none';
        play.style.display  = 'none';
    }, 400);

    var iframe = document.createElement('iframe');
    iframe.src   = 'https://www.youtube.com/embed/' + videoId + '?autoplay=1&rel=0&modestbranding=1';
    iframe.allow = 'autoplay; fullscreen';
    player.appendChild(iframe);

    // Kecilkan volume audio alam saat video main
    if (gainUtama && audioHidup) fadeVolume(0.07, 500);
}


// ==========================================================
// G. UNLOCK AUDIO setelah interaksi pertama
// Browser modern tidak izinkan audio sebelum user berinteraksi
// ==========================================================
document.getElementById('eq').classList.add('muted');
document.getElementById('sound-name').textContent = '— scroll untuk mendengar —';

function aktifkanAudio() {
    if (audioHidup) return;
    audioHidup = true;

    // Jika sedang di destinasi, langsung jadwalkan suara
    if (idxSection >= 0) {
        idxDwell = -1;
        jadwalkanSuara(idxSection);
    }
}

document.addEventListener('click',      aktifkanAudio, { once: true });
document.addEventListener('touchstart', aktifkanAudio, { once: true });
document.addEventListener('scroll',     aktifkanAudio, { once: true, passive: true });



const parallax_cl = document.querySelectorAll(".parallax");

let xValue = 0,
    yValue = 0;
let rotateDegree = 0;

function update(cursorCoordX) {
    parallax_cl.forEach((cl) => {

        let speedx = parseFloat(cl.dataset.speedx || "0");
        let speedy = parseFloat(cl.dataset.speedy || "0");
        let speedz = parseFloat(cl.dataset.speedz || "0");
        let rotateSpeed = parseFloat(cl.dataset.rotation || "0");

        let left = parseFloat(getComputedStyle(cl).left);
        let isInLeft = left < window.innerWidth / 2 ? -1 : 1;

        let zValue = (cursorCoordX - left) * isInLeft * 0.3;

        cl.style.transform = `
            translateX(calc(-50% + ${-xValue * speedx}px))
            translateY(calc(-50% + ${yValue * speedy}px))
            perspective(2300px) translateZ(${zValue * speedz}px)
            rotateY(${rotateDegree * rotateSpeed}deg)
        `;

        // const perspectiveRatio = cursorCoordX / window.innerWidth;

        // const dayLayer = document.querySelector("#day");
        // const sunsetLayer = document.querySelector("#sunset");
        // const nightLayer = document.querySelector("#night");

        // const gunungDay = document.querySelector("#gunung-day");
        // const gunungSunset = document.querySelector("#gunung-sunset");
        // const gunungNight = document.querySelector("#gunung-night");

        // if (perspectiveRatio < 0.33) {

        //     if (dayLayer) dayLayer.style.display = "block";
        //     if (sunsetLayer) sunsetLayer.style.display = "none";
        //     if (nightLayer) nightLayer.style.display = "none";

        //     if (gunungDay) gunungDay.style.display = "block";
        //     if (gunungSunset) gunungSunset.style.display = "none";
        //     if (gunungNight) gunungNight.style.display = "none";

        // } else if (perspectiveRatio < 0.66) {

        //     if (dayLayer) dayLayer.style.display = "none";
        //     if (sunsetLayer) sunsetLayer.style.display = "block";
        //     if (nightLayer) nightLayer.style.display = "none";

        //     if (gunungDay) gunungDay.style.display = "none";
        //     if (gunungSunset) gunungSunset.style.display = "block";
        //     if (gunungNight) gunungNight.style.display = "none";

        // } else {

        //     if (dayLayer) dayLayer.style.display = "none";
        //     if (sunsetLayer) sunsetLayer.style.display = "none";
        //     if (nightLayer) nightLayer.style.display = "block";

        //     if (gunungDay) gunungDay.style.display = "none";
        //     if (gunungSunset) gunungSunset.style.display = "none";
        //     if (gunungNight) gunungNight.style.display = "block";

        // }
    });
}

update(0);

window.addEventListener("mousemove", (e) => {
    if (timeline.isActive()) return;
    if (e.clientY < 80) return;

    requestAnimationFrame(() => {
        xValue = e.clientX - window.innerWidth / 2;
        yValue = e.clientY - window.innerHeight / 2;
        rotateDegree = (xValue / (window.innerWidth / 2)) * -20;

        update(e.clientX);
    });
}); 

// GSAP
let timeline = gsap.timeline();

parallax_cl.forEach((cl) => {
    timeline.from(
        cl,
        {
            top: `${cl.offsetHeight / 2 + parseFloat(cl.dataset.distance || "0")}px`,
            duration: 3.5,
            ease: "power2.out",
            autoRound: false
        },
        "1"
    );
});

timeline.from("#desktop-menu, #menu-open", {
    opacity: 0,
    duration: 3.5,
}, "3");



ambilData();
