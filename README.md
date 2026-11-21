# YcDev — Situs Studio

Situs profil YcDev (rekayasa perangkat lunak, IoT, full-stack, keamanan siber).
React 19 + Vite + Tailwind CSS 4 + three.js.

## Menjalankan Lokal

```bash
npm install --legacy-peer-deps
npm run dev          # http://localhost:3000
```

## Build

```bash
npm run build        # keluaran di dist/
npm run preview
```

## Struktur

```
src/
  components/   komponen halaman (Hero, 3D Lab, Footer, dst.)
  three/        modul WebGL + factory pemuatan three.js
  utils/        helper (siteAssets, estimator, asisten virtual)
  data/         data statis studio
```

## Deploy

Push ke branch `main` — GitHub Actions membangun dan mempublikasikan ke
GitHub Pages otomatis (lihat `.github/workflows/deploy.yml`).

## Catatan Teknis

- `base: './'` di `vite.config.ts` membuat semua aset relatif, sehingga build
  bisa di-host di domain root maupun sub-path (`/Ycdev/`).
- Path gambar di kode sumber disesuaikan saat runtime oleh
  `src/utils/siteAssets.ts`, dengan fallback bertahap di `ResilientImage`.
- three.js dimuat malas (lazy) dan dipisah ke chunk sendiri; bundle utama
  tetap ringan.
