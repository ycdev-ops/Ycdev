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
  dispose: () => void;
}
