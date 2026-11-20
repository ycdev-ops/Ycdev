import * as THREE from 'three';

export function detectSoftwareWebGL(): boolean {
  if (typeof document === 'undefined') return true;
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
  if (!gl) return true;
  const ext = gl.getExtension('WEBGL_debug_renderer_info');
  const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
  const gpu = String(gl.getParameter(param) || '');
  gl.getExtension('WEBGL_lose_context')?.loseContext();
  return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
}

export interface LoopHandle {
  cancel: () => void;
}

export function createPacedRenderLoop(
  renderer: THREE.WebGLRenderer,
  isSoftwareGl: boolean,
  onFrame: (delta: number, elapsed: number) => void
): LoopHandle {
  const startTime = performance.now();
  let lastTime = startTime;
  let cancelled = false;
  let rafId = 0;
  let timerId = 0;

  const afterDraw = (cb: () => void) => {
    const gl = renderer.getContext() as WebGL2RenderingContext;
    if (typeof gl.fenceSync === 'function') {
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (cancelled) {
          if (sync) gl.deleteSync(sync);
          return;
        }
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          timerId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          timerId = window.setTimeout(cb, 80);
        }
      };
      timerId = window.setTimeout(poll, 5);
    } else {
      timerId = window.setTimeout(cb, 80);
    }
  };

  const tick = () => {
    if (cancelled) return;
    const now = performance.now();
    const delta = Math.min((now - lastTime) / 1000, 0.1);
    const elapsed = (now - startTime) / 1000;
    lastTime = now;
    onFrame(delta, elapsed);
    if (cancelled) return;
    if (isSoftwareGl) {
      afterDraw(tick);
    } else {
      rafId = window.requestAnimationFrame(tick);
    }
  };

  if (isSoftwareGl) {
    timerId = window.setTimeout(tick, 16);
  } else {
    rafId = window.requestAnimationFrame(tick);
  }

  return {
    cancel: () => {
      cancelled = true;
      window.cancelAnimationFrame(rafId);
      window.clearTimeout(timerId);
    },
  };
}

export interface ProceduralTextureSet {
  brushedBump: THREE.CanvasTexture;
  pcbAlbedo: THREE.CanvasTexture;
  solarAlbedo: THREE.CanvasTexture;
  oledFaceplate: THREE.CanvasTexture;
  contactShadow: THREE.CanvasTexture;
  dispose: () => void;
}

export function createProceduralTextures(maxAnisotropy: number): ProceduralTextureSet {
  // 1. Brushed anodized metal bump map (linear space)
  const metalCanvas = document.createElement('canvas');
  metalCanvas.width = 256;
  metalCanvas.height = 256;
  const mCtx = metalCanvas.getContext('2d')!;
  mCtx.fillStyle = '#808080';
  mCtx.fillRect(0, 0, 256, 256);
  for (let y = 0; y < 256; y++) {
    const shade = 112 + Math.floor(((Math.sin(y * 1.7) + 1) * 0.5) * 32);
    mCtx.fillStyle = `rgb(${shade},${shade},${shade})`;
    mCtx.fillRect(0, y, 256, 1);
  }
  const brushedBump = new THREE.CanvasTexture(metalCanvas);
  brushedBump.wrapS = THREE.RepeatWrapping;
  brushedBump.wrapT = THREE.RepeatWrapping;
  brushedBump.repeat.set(2, 2);
  brushedBump.anisotropy = maxAnisotropy;

  // 2. Multilayer PCB albedo (SRGBColorSpace)
  const pcbCanvas = document.createElement('canvas');
  pcbCanvas.width = 512;
  pcbCanvas.height = 512;
  const pCtx = pcbCanvas.getContext('2d')!;
  pCtx.fillStyle = '#07241c';
  pCtx.fillRect(0, 0, 512, 512);
  pCtx.strokeStyle = '#15803d';
  pCtx.lineWidth = 3;
  for (let i = 32; i < 480; i += 32) {
    pCtx.beginPath();
    pCtx.moveTo(24, i);
    pCtx.lineTo(180, i);
    pCtx.lineTo(220, i + 16);
    pCtx.lineTo(488, i + 16);
    pCtx.stroke();
  }
  pCtx.fillStyle = '#eab308';
  for (let x = 40; x < 480; x += 64) {
    for (let y = 40; y < 480; y += 64) {
      pCtx.beginPath();
      pCtx.arc(x, y, 5, 0, Math.PI * 2);
      pCtx.fill();
    }
  }
  const pcbAlbedo = new THREE.CanvasTexture(pcbCanvas);
  pcbAlbedo.colorSpace = THREE.SRGBColorSpace;
  pcbAlbedo.anisotropy = maxAnisotropy;

  // 3. Solar array cell texture (SRGBColorSpace)
  const solarCanvas = document.createElement('canvas');
  solarCanvas.width = 256;
  solarCanvas.height = 256;
  const sCtx = solarCanvas.getContext('2d')!;
  sCtx.fillStyle = '#0a192f';
  sCtx.fillRect(0, 0, 256, 256);
  sCtx.strokeStyle = '#38bdf8';
  sCtx.lineWidth = 1.5;
  for (let x = 0; x <= 256; x += 32) {
    sCtx.beginPath();
    sCtx.moveTo(x, 0);
    sCtx.lineTo(x, 256);
    sCtx.stroke();
  }
  for (let y = 0; y <= 256; y += 64) {
    sCtx.beginPath();
    sCtx.moveTo(0, y);
    sCtx.lineTo(256, y);
    sCtx.stroke();
  }
  const solarAlbedo = new THREE.CanvasTexture(solarCanvas);
  solarAlbedo.colorSpace = THREE.SRGBColorSpace;
  solarAlbedo.anisotropy = maxAnisotropy;

  // 4. OLED Security Telemetry Faceplate (SRGBColorSpace)
  const oledCanvas = document.createElement('canvas');
  oledCanvas.width = 512;
  oledCanvas.height = 128;
  const oCtx = oledCanvas.getContext('2d')!;
  oCtx.fillStyle = '#05080f';
  oCtx.fillRect(0, 0, 512, 128);
  oCtx.strokeStyle = '#0ea5e9';
  oCtx.lineWidth = 2;
  oCtx.strokeRect(8, 8, 496, 112);
  oCtx.fillStyle = '#38bdf8';
  oCtx.font = 'bold 26px monospace';
  oCtx.fillText('YcDev // ZERO-TRUST CORE', 28, 52);
  oCtx.fillStyle = '#10b981';
  oCtx.font = '20px monospace';
  oCtx.fillText('mTLS: ACTIVE   SFP+: 8x10G   DROP: 0', 28, 92);
  const oledFaceplate = new THREE.CanvasTexture(oledCanvas);
  oledFaceplate.colorSpace = THREE.SRGBColorSpace;
  oledFaceplate.anisotropy = maxAnisotropy;

  // 5. Soft radial contact shadow
  const shadowCanvas = document.createElement('canvas');
  shadowCanvas.width = 256;
  shadowCanvas.height = 256;
  const shCtx = shadowCanvas.getContext('2d')!;
  const grad = shCtx.createRadialGradient(128, 128, 10, 128, 128, 124);
  grad.addColorStop(0, 'rgba(0, 0, 0, 0.72)');
  grad.addColorStop(0.6, 'rgba(0, 0, 0, 0.28)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  shCtx.fillStyle = grad;
  shCtx.fillRect(0, 0, 256, 256);
  const contactShadow = new THREE.CanvasTexture(shadowCanvas);

  return {
    brushedBump,
    pcbAlbedo,
    solarAlbedo,
    oledFaceplate,
    contactShadow,
    dispose: () => {
      brushedBump.dispose();
      pcbAlbedo.dispose();
      solarAlbedo.dispose();
      oledFaceplate.dispose();
      contactShadow.dispose();
    },
  };
}
