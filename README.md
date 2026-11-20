# Sampai Ibu Pulang — Pitch Deck Motion

Presentasi motion grafis untuk pitch deck **Sampai Ibu Pulang** (Program Day Care Yatim Dhuafa, by Rumah Yatim).
Alurnya: video intro → 16 slide beranimasi (disusun mengikuti 7 bagian kerangka presentasi) → ditutup slide ajakan. Setiap pindah slide ada sound "wosh" lembut.

## Cara memakai
1. Buka `index.html` di **Chrome / Edge** (klik dua kali), lalu klik **Mulai Presentasi**.
2. Navigasi: `→` / `Spasi` / klik layar = lanjut · `←` = mundur · `F` = layar penuh · `M` = matikan/nyalakan sound · `P` = pause/play video prototype.
3. Di slide video prototype, klik HP untuk pause/play. Gerakkan mouse untuk memunculkan titik navigasi di bawah.

## Upload ke GitHub + jadi link (GitHub Pages)
1. Ekstrak ZIP ini, buat repository baru di GitHub.
2. **Add file → Upload files**, lalu seret **isi** folder hasil ekstrak (`index.html`, `css`, `js`, `assets`, dst.) → Commit.
3. **Settings → Pages → Build and deployment**: Source = *Deploy from a branch*, Branch = `main` / `(root)` → Save.
4. Tunggu 1–2 menit, link presentasi muncul di halaman Pages. Ukuran semua file di bawah batas 25 MB per file GitHub.

## Isi folder
- `index.html` — semua slide (teks ada di sini, mudah diedit)
- `css/style.css` — desain & animasi · `js/app.js` — transisi, sound, navigasi
- `assets/intro.mp4` — video pembuka · `assets/prototype.mp4` — video prototype
- `assets/rumah-yatim-daycare.jpg` — visual desain Day Care Rumah Yatim (slide Product)
- `assets/wosh.mp3` — sound efek (versi dilembutkan) · `assets/wosh-asli.mp3` — file asli
- Ganti video/gambar dengan file bernama sama untuk memperbarui isinya.

## Urutan slide
Cover: 1 Judul
**1. Background & Problem Identification** — 2 Day Care Yatim Dhuafa ("Menjawab:") · 3 4 Masalah dalam 1 rumah · 4 Market Validasi
**2. Innovation & Proposed Solution** — 5 Solution · 6 Competitive Advantages · 7 Prototype (video) · 8 Manfaat yang Diharapkan · 9 Market Size (Care Economy)
**3. Program Design & Implementation** — 10 Product & solution (Kolaborasi) · 11 Visual Day Care Rumah Yatim + Standar Day Care
**4–5. Fundraising & Partnership + Financial Planning** — 12 Market Size (dana sosial syariah) · 13 Business Model · 14 Business Model Canvas
**6. Impact & Sustainability** — 15 Dampak Jangka Panjang
**7. Closing & Recommendation** — 16 Ajakan Rp570,6 Juta

## Catatan
- Revisi terbaru: slide 2 "Apa masalahnya?" → "Menjawab:"; slide Penutup (CTA terakhir) dihapus; narasi "Standar Day Care" (CSP, UU Permensos No. 11 Tahun 2026, Legalitas DP3A, Tata tertib internal RY) ditambahkan di samping foto Product & solution (slide 11); slide 8 "Manfaat yang Diharapkan" ditambahkan dari materi yang diberikan; urutan slide disusun ulang. Isi slide lain tidak diubah.
- Setiap bagian kerangka diberi komentar `<!-- ########## ... ########## -->` di `index.html`, jadi mudah menemukan dan memindahkan slide.
