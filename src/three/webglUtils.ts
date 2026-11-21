import type * as THREE from 'three';
import type { LoopHandle, ProceduralTextureSet, ShowcaseMaterials } from './webglTypes';

// Utilitas WebGL dibungkus factory supaya modul ini bisa diimpor statis oleh
// komponen tanpa menarik three.js ke bundle utama. three.js sendiri dimuat
// malas lewat loadThree() pada saat renderer WebGL siap dibuat.
export function createWebglUtils(THREE: typeof import('three')) {
  /**
   * Uji dukungan WebGL SEKALI dengan canvas probe yang sengaja dibuang (context
   * lost) supaya tidak pernah merampok konteks dari canvas milik komponen.
   *
   * three.js menolak membuat WebGLRenderer bila `OES_packed_depth_stencil`
   * tidak ada pada konteks WebGL2 (kasus nyata: SwiftShader di Android).
   * Konteks yang gagal di sini = renderer pasti gagal, jadi komponen harus
   * jatuh ke fallback, bukan diam-diam menyisakan viewport kosong.
   */
  function detectSoftwareWebGL(): boolean {
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

  /**
   * true = WebGL praktis tidak bisa dipakai untuk three.js (tanpa konteks, atau
   * WebGL2 tanpa OES_packed_depth_stencil). Komponen harus menampilkan fallback.
   */
  function isWebglUnsupported(): boolean {
    if (typeof document === 'undefined') return true;
    const canvas = document.createElement('canvas');
    const gl2 = canvas.getContext('webgl2');
    if (gl2) {
      const packed = !!gl2.getExtension('OES_packed_depth_stencil');
      gl2.getExtension('WEBGL_lose_context')?.loseContext();
      return !packed;
    }
    // WebGL2 tidak ada: WebGL1 masih bisa dipakai three.js.
    const gl1 = canvas.getContext('webgl');
    if (!gl1) {
      canvas.getContext('webgl2')?.getExtension('WEBGL_lose_context')?.loseContext();
      return true;
    }
    gl1.getExtension('WEBGL_lose_context')?.loseContext();
    return false;
  }

  /** Pesan pendek untuk fallback, menyebut penyebabnya. */
  function webglFallbackReason(): string {
    if (typeof document === 'undefined') return 'Peramban tidak mendukung WebGL.';
    const canvas = document.createElement('canvas');
    const gl2 = canvas.getContext('webgl2');
    if (gl2) {
      const packed = !!gl2.getExtension('OES_packed_depth_stencil');
      gl2.getExtension('WEBGL_lose_context')?.loseContext();
      return packed
        ? 'Perangkat tidak mampu membuka viewport 3D.'
        : 'Kartu grafis perangkat tidak mendukung WebGL2 penuh (OES_packed_depth_stencil).';
    }
    return 'Peramban tidak menyediakan konteks WebGL.';
  }

  function createPacedRenderLoop(
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

  function createProceduralTextures(maxAnisotropy: number): ProceduralTextureSet {
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

    // 6. Anyaman serat karbon (albedo + bump), dipakai rangka drone & panel.
    const carbonCanvas = document.createElement('canvas');
    carbonCanvas.width = 256;
    carbonCanvas.height = 256;
    const cCtx = carbonCanvas.getContext('2d')!;
    cCtx.fillStyle = '#0b0f14';
    cCtx.fillRect(0, 0, 256, 256);
    const cell = 16;
    for (let y = 0; y < 256; y += cell) {
      for (let x = 0; x < 256; x += cell) {
        const over = ((x + y) / cell) % 2 === 0;
        const g = cCtx.createLinearGradient(x, y, over ? x + cell : x, over ? y : y + cell);
        g.addColorStop(0, '#1b2531');
        g.addColorStop(0.5, '#38465a');
        g.addColorStop(1, '#121820');
        cCtx.fillStyle = g;
        cCtx.fillRect(x, y, cell, cell);
      }
    }
    const carbonAlbedo = new THREE.CanvasTexture(carbonCanvas);
    carbonAlbedo.colorSpace = THREE.SRGBColorSpace;
    carbonAlbedo.wrapS = THREE.RepeatWrapping;
    carbonAlbedo.wrapT = THREE.RepeatWrapping;
    carbonAlbedo.repeat.set(4, 4);
    carbonAlbedo.anisotropy = maxAnisotropy;

    const carbonBump = new THREE.CanvasTexture(carbonCanvas);
    carbonBump.wrapS = THREE.RepeatWrapping;
    carbonBump.wrapT = THREE.RepeatWrapping;
    carbonBump.repeat.set(4, 4);

    return {
      brushedBump,
      pcbAlbedo,
      solarAlbedo,
      oledFaceplate,
      contactShadow,
      carbonAlbedo,
      carbonBump,
      dispose: () => {
        brushedBump.dispose();
        pcbAlbedo.dispose();
        solarAlbedo.dispose();
        oledFaceplate.dispose();
        contactShadow.dispose();
        carbonAlbedo.dispose();
        carbonBump.dispose();
      },
    };
  }

  /** Material realistis bersama untuk semua model showcase. */
  function createShowcaseMaterials(textures: ProceduralTextureSet): ShowcaseMaterials {
    const chassis = new THREE.MeshStandardMaterial({
      color: 0x1b222d,
      metalness: 0.72,
      roughness: 0.58,
      bumpMap: textures.brushedBump,
      bumpScale: 0.015,
    });

    const steel = new THREE.MeshStandardMaterial({
      color: 0xcbd5e1,
      metalness: 0.92,
      roughness: 0.22,
      bumpMap: textures.brushedBump,
      bumpScale: 0.01,
    });

    const darkSteel = new THREE.MeshStandardMaterial({
      color: 0x3b4654,
      metalness: 0.88,
      roughness: 0.34,
    });

    const rubber = new THREE.MeshStandardMaterial({
      color: 0x0d1117,
      metalness: 0.05,
      roughness: 0.92,
    });

    const glass = new THREE.MeshPhysicalMaterial({
      color: 0xbfe3ff,
      metalness: 0,
      roughness: 0.06,
      transmission: 0.85,
      thickness: 0.25,
      transparent: true,
      opacity: 0.45,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
      ior: 1.45,
    });

    const carbon = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: textures.carbonAlbedo,
      bumpMap: textures.carbonBump,
      bumpScale: 0.02,
      metalness: 0.35,
      roughness: 0.42,
    });

    const accent = new THREE.MeshStandardMaterial({
      color: 0x0ea5e9,
      emissive: 0x0284c7,
      emissiveIntensity: 0.9,
      roughness: 0.2,
      metalness: 0.4,
    });

    const copper = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      metalness: 0.9,
      roughness: 0.2,
    });

    const pcb = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: textures.pcbAlbedo,
      roughness: 0.45,
      metalness: 0.25,
    });

    const ledGreen = new THREE.MeshStandardMaterial({
      color: 0x22c55e,
      emissive: 0x16a34a,
      emissiveIntensity: 1.6,
      roughness: 0.3,
    });

    const ledAmber = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xd97706,
      emissiveIntensity: 1.4,
      roughness: 0.3,
    });

    return {
      chassis,
      steel,
      darkSteel,
      rubber,
      glass,
      carbon,
      accent,
      copper,
      pcb,
      ledGreen,
      ledAmber,
      dispose: () => {
        chassis.dispose();
        steel.dispose();
        darkSteel.dispose();
        rubber.dispose();
        glass.dispose();
        carbon.dispose();
        accent.dispose();
        copper.dispose();
        pcb.dispose();
        ledGreen.dispose();
        ledAmber.dispose();
      },
    };
  }

  /**
   * Rig studi: lantai reflektif + grid, lampu tiga titik, partikel debu,
   * dan ring holografik — memberi kesan "laboratorium" yang nyata.
   */
  function createStudioEnvironment(THREE: typeof import('three')) {
    const group = new THREE.Group();

    // Lantai: cakram gelap + grid halus.
    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(4.2, 64),
      new THREE.MeshStandardMaterial({
        color: 0x05080d,
        metalness: 0.6,
        roughness: 0.35,
      })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.03;
    floor.receiveShadow = true;
    group.add(floor);

    const grid = new THREE.GridHelper(8, 32, 0x1e3a5f, 0x0b1524);
    grid.position.y = -0.02;
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = 0.5;
    group.add(grid);

    // Ring holografik berdenyut di sekeliling objek.
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.28,
    });
    const ring = new THREE.Mesh(new THREE.RingGeometry(1.55, 1.58, 96), ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = -0.005;
    group.add(ring);

    const ring2 = new THREE.Mesh(new THREE.RingGeometry(1.9, 1.91, 96), ringMat.clone());
    (ring2.material as THREE.MeshBasicMaterial).opacity = 0.12;
    ring2.rotation.x = -Math.PI / 2;
    ring2.position.y = -0.004;
    group.add(ring2);

    // Partikel debu melayang (Points) — kedalaman visual.
    const count = 220;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const r = 1.2 + Math.random() * 3.2;
      const a = Math.random() * Math.PI * 2;
      positions[i * 3] = Math.cos(a) * r;
      positions[i * 3 + 1] = Math.random() * 2.6;
      positions[i * 3 + 2] = Math.sin(a) * r;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x7dd3fc,
      size: 0.012,
      transparent: true,
      opacity: 0.4,
      depthWrite: false,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    group.add(particles);

    // Lampu: key hangat + rim dingin + fill + titik aksen.
    const key = new THREE.DirectionalLight(0xfff1e0, 2.4);
    key.position.set(4.5, 6.5, 4.5);
    group.add(key);

    const rim = new THREE.DirectionalLight(0x38bdf8, 1.8);
    rim.position.set(-4.5, 3.0, -4.5);
    group.add(rim);

    const fill = new THREE.PointLight(0x60a5fa, 12, 9, 2);
    fill.position.set(-2.2, 1.6, 2.4);
    group.add(fill);

    const hemi = new THREE.HemisphereLight(0xbae6fd, 0x090b0e, 0.6);
    group.add(hemi);

    return {
      group,
      ring,
      ring2,
      particles,
      update: (elapsed: number) => {
        ringMat.opacity = 0.22 + Math.sin(elapsed * 1.4) * 0.08;
        ring.scale.setScalar(1 + Math.sin(elapsed * 0.9) * 0.02);
        (ring2.material as THREE.MeshBasicMaterial).opacity =
          0.08 + Math.sin(elapsed * 1.4 + 1.2) * 0.05;
        particles.rotation.y += 0.0006;
      },
    };
  }

  return {
    detectSoftwareWebGL,
    isWebglUnsupported,
    webglFallbackReason,
    createPacedRenderLoop,
    createProceduralTextures,
    createShowcaseMaterials,
    createStudioEnvironment,
  };
}

export type WebglUtils = ReturnType<typeof createWebglUtils>;
