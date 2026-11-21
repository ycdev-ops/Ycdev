import { useEffect, useRef, useState } from 'react';
import type * as THREE from 'three';
import { loadThree } from '../three/loadThree';
import {
  Compass,
  ExternalLink,
  Layers,
  MapPin,
  Minus,
  Plus,
  RotateCcw,
  Ship,
} from 'lucide-react';
import { STUDIO_PROFILE } from '../data/ycdevData';
import {
  createSemarang3DMapSceneFactory,
  type SemarangMapFocus,
  type SemarangMapStyle,
  type SemarangMapTilt,
} from '../three/semarangMapScene';
import { createWebglUtils } from '../three/webglUtils';
import type { LoopHandle } from '../three/webglTypes';

export function Semarang3DMapCanvas() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [focus, setFocus] = useState<SemarangMapFocus>('hq');
  const [mapStyle, setMapStyle] = useState<SemarangMapStyle>('satellite');
  const [tiltMode, setTiltMode] = useState<SemarangMapTilt>('3d');

  const controlStateRef = useRef<{
    focus: SemarangMapFocus;
    tilt: SemarangMapTilt;
    style: SemarangMapStyle;
    cameraDirty: boolean;
    styleDirty: boolean;
    zoomDelta: number;
  }>({
    focus: 'hq',
    tilt: '3d',
    style: 'satellite',
    cameraDirty: false,
    styleDirty: false,
    zoomDelta: 0,
  });

  useEffect(() => {
    controlStateRef.current.focus = focus;
    controlStateRef.current.tilt = tiltMode;
    controlStateRef.current.cameraDirty = true;
  }, [focus, tiltMode]);

  useEffect(() => {
    controlStateRef.current.style = mapStyle;
    controlStateRef.current.styleDirty = true;
  }, [mapStyle]);

  useEffect(() => {
    const container = mountRef.current;
    const outer = containerRef.current;
    if (!container || !outer) return;

    let cancelled = false;
    let cleanup: (() => void) | null = null;

    loadThree().then(async (THREE) => {
      if (cancelled) return;
      const [{ OrbitControls }, { RoomEnvironment }] = await Promise.all([
        import('three/addons/controls/OrbitControls.js'),
        import('three/addons/environments/RoomEnvironment.js'),
      ]);
      if (cancelled) return;

      const webgl = createWebglUtils(THREE);
      const { detectSoftwareWebGL, createPacedRenderLoop } = webgl;

      const isSoftwareGl = detectSoftwareWebGL();
      const width = container.clientWidth || 560;
      const height = container.clientHeight || 340;

      const renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        alpha: false,
        powerPreference: 'high-performance',
      });
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
      renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width, height);

      const canvas = renderer.domElement;
      canvas.style.display = 'block';
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      container.appendChild(canvas);

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x0b1f33);
      scene.fog = new THREE.FogExp2(0x0b1f33, 0.018);

      const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 60);
      camera.position.set(-4.4, 5.5, 8.2);

      const controls = new OrbitControls(camera, canvas);
      controls.enableDamping = !isSoftwareGl;
      controls.dampingFactor = 0.06;
      controls.minDistance = 3.0;
      controls.maxDistance = 15.5;
      controls.maxPolarAngle = Math.PI * 0.46;
      controls.target.set(-2.2, 0.25, 0.8);

      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      const envTarget = pmremGenerator.fromScene(new RoomEnvironment(), 0.04);
      scene.environment = envTarget.texture;
      pmremGenerator.dispose();

      const hemi = new THREE.HemisphereLight(0xe0f2fe, 0x0f172a, 1.15);
      scene.add(hemi);

      const key = new THREE.DirectionalLight(0xfffbeb, 2.2);
      key.position.set(5, 9, 6);
      scene.add(key);

      const createSemarang3DMapScene = createSemarang3DMapSceneFactory(THREE);
      const mapController = createSemarang3DMapScene(scene);

      let isVisible = true;
      const observer = new IntersectionObserver(
        (entries) => {
          isVisible = entries[0]?.isIntersecting ?? true;
        },
        { threshold: 0.05 }
      );
      observer.observe(outer);

      const handleResize = () => {
        if (!container) return;
        const w = container.clientWidth || 560;
        const h = container.clientHeight || 340;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener('resize', handleResize);

      // Initial render frame
      mapController.update(0.2, 0.016);
      controls.update();
      renderer.render(scene, camera);

      const zoomVec = new THREE.Vector3();

      const loop = createPacedRenderLoop(renderer, isSoftwareGl, (delta, elapsed) => {
        const state = controlStateRef.current;
        const hasPendingUpdate = state.cameraDirty || state.styleDirty || state.zoomDelta !== 0;

        if (isSoftwareGl && !isVisible && !hasPendingUpdate) {
          return;
        }

        if (state.styleDirty) {
          mapController.setMapStyle(state.style);
          state.styleDirty = false;
        }

        if (state.cameraDirty) {
          const preset = mapController.getTargetLookAt(state.focus, state.tilt);
          camera.position.set(...preset.camPos);
          controls.target.set(...preset.target);
          state.cameraDirty = false;
        }

        if (state.zoomDelta !== 0) {
          zoomVec.subVectors(camera.position, controls.target);
          const factor = state.zoomDelta > 0 ? 0.8 : 1.24;
          const nextLen = THREE.MathUtils.clamp(zoomVec.length() * factor, 3.0, 15.5);
          zoomVec.setLength(nextLen);
          camera.position.copy(controls.target).add(zoomVec);
          state.zoomDelta = 0;
        }

        mapController.update(elapsed, delta);
        controls.update();
        renderer.render(scene, camera);
      });

      cleanup = () => {
        loop.cancel();
        observer.disconnect();
        window.removeEventListener('resize', handleResize);
        controls.dispose();
        mapController.dispose();
        envTarget.dispose();
        renderer.dispose();
        if (canvas.parentNode === container) {
          container.removeChild(canvas);
        }
      };
    });

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return (
    <div
      id="lokasi-3d"
      ref={containerRef}
      className="scroll-mt-24 overflow-hidden rounded-xl border border-white/15 bg-[#08121E]"
    >
      {/* Top Google Maps 3D Header Strip */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 bg-[#0B121D] px-4 py-2.5 text-xs">
        <div className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="inline-flex h-5 w-5 items-center justify-center rounded bg-[#EA4335] text-white"
          >
            <MapPin className="h-3.5 w-3.5" />
          </span>
          <span className="font-semibold text-white">
            Google Map 3D Live · Jl. Puri Eksekutif A1
          </span>
        </div>
        <span className="font-mono text-[11px] text-sky-400 tabular-nums">
          {STUDIO_PROFILE.coordinatesDisplay}
        </span>
      </div>

      {/* Interactive 3D Map Viewport */}
      <div className="relative h-72 w-full sm:h-80">
        <div
          ref={mountRef}
          data-testid="semarang-3d-map"
          data-map-focus={focus}
          data-map-style={mapStyle}
          data-map-tilt={tiltMode}
          className="h-full w-full cursor-grab active:cursor-grabbing"
        />

        {/* Google Maps Floating Location Card (Top-Left) */}
        <div className="pointer-events-auto absolute top-2.5 left-2.5 max-w-[205px] rounded-lg border border-white/20 bg-[#0F172A]/95 p-2.5 text-xs shadow-lg">
          <p className="font-display text-xs font-bold text-white">
            YcDev Studio HQ
          </p>
          <p className="mt-0.5 text-[10px] leading-snug text-slate-300">
            {STUDIO_PROFILE.addressLine}, Tawangsari
          </p>
          <p className="mt-0.5 font-mono text-[9px] text-sky-300 tabular-nums">
            {STUDIO_PROFILE.latitude}, {STUDIO_PROFILE.longitude} · {STUDIO_PROFILE.plusCode}
          </p>
          <a
            href={STUDIO_PROFILE.googleMapsUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-1.5 inline-flex items-center gap-1 rounded bg-[#1A73E8] px-2 py-1 text-[10px] font-semibold text-white hover:bg-[#1557B0] whitespace-nowrap"
          >
            Buka Google Maps
            <ExternalLink className="h-2.5 w-2.5" aria-hidden="true" />
          </a>
        </div>

        {/* Google Maps Layer Switcher (Bottom-Left) */}
        <button
          type="button"
          onClick={() =>
            setMapStyle((prev) => (prev === 'satellite' ? 'dark' : 'satellite'))
          }
          className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-lg border border-white/25 bg-[#0F172A]/95 px-2.5 py-1.5 text-xs font-semibold text-white hover:border-sky-400 whitespace-nowrap cursor-pointer"
        >
          <Layers className="h-3.5 w-3.5 text-sky-400" aria-hidden="true" />
          {mapStyle === 'satellite' ? 'Satelit 3D' : 'Peta Gelap'}
        </button>

        {/* Google Maps Vertical Control Stack (Bottom-Right) */}
        <div className="absolute right-3 bottom-3 flex flex-col gap-1.5">
          <button
            type="button"
            onClick={() =>
              setTiltMode((prev) => (prev === '3d' ? '2d' : '3d'))
            }
            aria-label="Ubah tampilan kemiringan 3D atau 2D"
            className="flex h-8 w-8 items-center justify-center rounded-md border border-white/20 bg-[#0F172A]/95 font-mono text-[11px] font-bold text-sky-300 hover:bg-[#1E293B] cursor-pointer"
          >
            {tiltMode === '3d' ? '2D' : '3D'}
          </button>

          <div className="flex flex-col overflow-hidden rounded-md border border-white/20 bg-[#0F172A]/95">
            <button
              type="button"
              onClick={() => {
                controlStateRef.current.zoomDelta += 1;
              }}
              aria-label="Perbesar peta 3D"
              className="flex h-7 w-8 items-center justify-center border-b border-white/15 text-slate-200 hover:bg-[#1E293B] cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => {
                controlStateRef.current.zoomDelta -= 1;
              }}
              aria-label="Perkecil peta 3D"
              className="flex h-7 w-8 items-center justify-center text-slate-200 hover:bg-[#1E293B] cursor-pointer"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom POI Jump Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 bg-[#0B121D] px-3 py-2.5">
        <div
          className="flex flex-wrap items-center gap-1.5"
          role="group"
          aria-label="Fokus lokasi peta 3D"
        >
          <button
            type="button"
            aria-pressed={focus === 'hq'}
            onClick={() => setFocus('hq')}
            className={`inline-flex items-center gap-1 rounded px-2.5 py-1 text-xs font-medium whitespace-nowrap cursor-pointer ${
              focus === 'hq'
                ? 'bg-[#1A73E8] text-white'
                : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <MapPin className="h-3 w-3" aria-hidden="true" />
            Jl. Puri Eksekutif A1
          </button>
          <button
            type="button"
            aria-pressed={focus === 'port'}
            onClick={() => setFocus('port')}
            className={`inline-flex items-center gap-1 rounded px-2.5 py-1 text-xs font-medium whitespace-nowrap cursor-pointer ${
              focus === 'port'
                ? 'bg-[#1A73E8] text-white'
                : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Compass className="h-3 w-3" aria-hidden="true" />
            Tanjung Emas
          </button>
          <button
            type="button"
            aria-pressed={focus === 'sea'}
            onClick={() => setFocus('sea')}
            className={`inline-flex items-center gap-1 rounded px-2.5 py-1 text-xs font-medium whitespace-nowrap cursor-pointer ${
              focus === 'sea'
                ? 'bg-[#1A73E8] text-white'
                : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Ship className="h-3 w-3" aria-hidden="true" />
            Kapal Laut Jawa
          </button>
        </div>

        <button
          type="button"
          onClick={() => {
            setTiltMode('3d');
            controlStateRef.current.tilt = '3d';
            controlStateRef.current.cameraDirty = true;
          }}
          aria-label="Reset kamera peta 3D"
          className="inline-flex items-center gap-1 rounded border border-white/15 px-2 py-1 text-xs text-slate-300 hover:text-white whitespace-nowrap cursor-pointer"
        >
          <RotateCcw className="h-3 w-3" aria-hidden="true" />
          Reset
        </button>
      </div>
    </div>
  );
}
