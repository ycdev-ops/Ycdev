import type * as THREE from 'three';

export interface LoopHandle {
  cancel: () => void;
}

export interface ProceduralTextureSet {
  brushedBump: THREE.CanvasTexture;
  pcbAlbedo: THREE.CanvasTexture;
  solarAlbedo: THREE.CanvasTexture;
  oledFaceplate: THREE.CanvasTexture;
  contactShadow: THREE.CanvasTexture;
  /** Tekstur anyaman serat karbon (albedo + bump). */
  carbonAlbedo: THREE.CanvasTexture;
  carbonBump: THREE.CanvasTexture;
  dispose: () => void;
}

/**
 * Kumpulan material realistis yang dipakai semua model showcase.
 * Dibuat sekali per scene, dipakai berulang agar konsisten dan hemat.
 */
export interface ShowcaseMaterials {
  chassis: THREE.MeshStandardMaterial;
  steel: THREE.MeshStandardMaterial;
  darkSteel: THREE.MeshStandardMaterial;
  rubber: THREE.MeshStandardMaterial;
  glass: THREE.MeshPhysicalMaterial;
  carbon: THREE.MeshStandardMaterial;
  accent: THREE.MeshStandardMaterial;
  copper: THREE.MeshStandardMaterial;
  pcb: THREE.MeshStandardMaterial;
  ledGreen: THREE.MeshStandardMaterial;
  ledAmber: THREE.MeshStandardMaterial;
  dispose: () => void;
}
