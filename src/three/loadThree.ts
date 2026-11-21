import type * as ThreeType from 'three';

// three.js (~480 kB gzip) dipakai hanya oleh 4 komponen WebGL. Dimuat malas
// (lazy) supaya bundle utama tetap kecil: halaman bisa tampil dulu, lalu
// pustaka 3D diambil di belakang.
let cached: typeof ThreeType | null = null;
let inFlight: Promise<typeof ThreeType> | null = null;

export function loadThree(): Promise<typeof ThreeType> {
  if (cached) return Promise.resolve(cached);
  if (!inFlight) {
    inFlight = import('three').then((mod) => {
      cached = mod;
      return mod;
    });
  }
  return inFlight;
}
