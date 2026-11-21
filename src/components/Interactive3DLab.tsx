import { useEffect, useRef, useState } from 'react';
import type * as THREE from 'three';
import { loadThree } from '../three/loadThree';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import {
  SHOWCASE_MODELS,
  createShowcaseObjects,
  type ShowcaseModelId,
} from '../three/showcaseObjects';
import {
  createWebglUtils,
} from '../three/webglUtils';
import type { ProceduralTextureSet } from '../three/webglTypes';

interface Interactive3DLabProps {
  selectedModelId?: ShowcaseModelId;
  onSelectModel?: (id: ShowcaseModelId) => void;
}

export function Interactive3DLab({
  selectedModelId,
  onSelectModel,
}: Interactive3DLabProps = {}) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [internalModel, setInternalModel] = useState<ShowcaseModelId>('iot-gateway');
  const activeModel = selectedModelId ?? internalModel;
  const setActiveModel = (id: ShowcaseModelId) => {
    setInternalModel(id);
    onSelectModel?.(id);
  };
  const [explodePercent, setExplodePercent] = useState(20);
  const [autoOrbit, setAutoOrbit] = useState(true);
  const [dockCollapsed, setDockCollapsed] = useState(false);

  const activeModelRef = useRef<ShowcaseModelId>(activeModel);
  const explodeRef = useRef<number>(explodePercent / 100);
  const autoOrbitRef = useRef<boolean>(autoOrbit);
  const resetSignalRef = useRef<number>(0);

  activeModelRef.current = activeModel;
  explodeRef.current = explodePercent / 100;
  autoOrbitRef.current = autoOrbit;

  const sceneRefs = useRef<{
    scene: THREE.Scene | null;
    textures: ProceduralTextureSet | null;
    modelGroup: THREE.Group | null;
    loadedId: ShowcaseModelId | null;
    swapNow: (() => void) | null;
  }>({
    scene: null,
    textures: null,
    modelGroup: null,
    loadedId: null,
    swapNow: null,
  });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

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
      const showcase = createShowcaseObjects(THREE);
      const { detectSoftwareWebGL, createPacedRenderLoop, createProceduralTextures } = webgl;

      const isSoftwareGl = detectSoftwareWebGL();
      const width = container.clientWidth || 960;
      const height = container.clientHeight || 560;

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
      renderer.shadowMap.enabled = !isSoftwareGl;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      const canvas = renderer.domElement;
      canvas.style.display = 'block';
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      container.appendChild(canvas);

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x080c12);
      scene.fog = new THREE.FogExp2(0x080c12, 0.04);

      const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 40);
      camera.position.set(3.4, 2.25, 3.8);

      const controls = new OrbitControls(camera, canvas);
      controls.enableDamping = !isSoftwareGl;
      controls.dampingFactor = 0.06;
      controls.minDistance = 2.1;
      controls.maxDistance = 7.5;
      controls.maxPolarAngle = Math.PI * 0.49;
      controls.target.set(0, 0.45, 0);

      let userInteracting = false;
      controls.addEventListener('start', () => {
        userInteracting = true;
      });

      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      const envTarget = pmremGenerator.fromScene(new RoomEnvironment(), 0.04);
      scene.environment = envTarget.texture;
      pmremGenerator.dispose();

      // Three-point studio rig + cool hemisphere
      const hemiLight = new THREE.HemisphereLight(0xbae6fd, 0x090b0e, 0.75);
      scene.add(hemiLight);

      const keyLight = new THREE.DirectionalLight(0xfff1e0, 2.3);
      keyLight.position.set(4.5, 6.5, 4.5);
      if (!isSoftwareGl) {
        keyLight.castShadow = true;
        keyLight.shadow.mapSize.set(1024, 1024);
        keyLight.shadow.bias = -0.0005;
      }
      scene.add(keyLight);

      const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.5);
      rimLight.position.set(-4.5, 3.0, -4.5);
      scene.add(rimLight);

      // Subtle aerospace floor grid + contact shadow disc
      const grid = new THREE.GridHelper(12, 24, 0x1e3a5f, 0x0f172a);
      grid.position.y = -0.02;
      scene.add(grid);

      const textures = createProceduralTextures(
        Math.min(4, renderer.capabilities.getMaxAnisotropy())
      );

      const shadowPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(3.8, 3.8),
        new THREE.MeshBasicMaterial({
          map: textures.contactShadow,
          transparent: true,
          depthWrite: false,
          opacity: 0.55,
        })
      );
      shadowPlane.rotation.x = -Math.PI / 2;
      shadowPlane.position.y = 0.0;
      scene.add(shadowPlane);

      sceneRefs.current.scene = scene;
      sceneRefs.current.textures = textures;

      const swapModelIfNeeded = () => {
        const targetId = activeModelRef.current;
        if (sceneRefs.current.loadedId === targetId) return false;

        if (sceneRefs.current.modelGroup) {
          scene.remove(sceneRefs.current.modelGroup);
          sceneRefs.current.modelGroup.traverse((obj) => {
            if ((obj as THREE.Mesh).isMesh) {
              const m = obj as THREE.Mesh;
              m.geometry?.dispose();
            }
          });
        }

        const nextGroup = showcase.buildShowcaseModel(targetId, textures);
        showcase.updateShowcaseExplodeAndSpin(nextGroup, explodeRef.current, 1.0);
        scene.add(nextGroup);
        sceneRefs.current.modelGroup = nextGroup;
        sceneRefs.current.loadedId = targetId;
        return true;
      };

      sceneRefs.current.swapNow = () => {
        const changed = swapModelIfNeeded();
        if (changed && sceneRefs.current.modelGroup) {
          showcase.updateShowcaseExplodeAndSpin(
            sceneRefs.current.modelGroup,
            explodeRef.current,
            0.5
          );
          controls.update();
          renderer.render(scene, camera);
        }
      };

      swapModelIfNeeded();
      if (!isSoftwareGl) {
        renderer.compile(scene, camera);
      }

      const handleResize = () => {
        if (!container) return;
        const w = container.clientWidth || 960;
        const h = container.clientHeight || 560;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener('resize', handleResize);

      let lastHandledReset = 0;

      const loopHandle = createPacedRenderLoop(renderer, isSoftwareGl, (delta) => {
        swapModelIfNeeded();

        if (resetSignalRef.current !== lastHandledReset) {
          lastHandledReset = resetSignalRef.current;
          camera.position.set(3.4, 2.25, 3.8);
          controls.target.set(0, 0.45, 0);
          userInteracting = false;
        }

        if (sceneRefs.current.modelGroup) {
          showcase.updateShowcaseExplodeAndSpin(
            sceneRefs.current.modelGroup,
            explodeRef.current,
            delta
          );
          if (autoOrbitRef.current && !userInteracting) {
            sceneRefs.current.modelGroup.rotation.y += delta * 0.25;
          }
        }

        controls.update();
        renderer.render(scene, camera);
      });

      cleanup = () => {
        loopHandle.cancel();
        sceneRefs.current.loadedId = null;
        sceneRefs.current.swapNow = null;
        window.removeEventListener('resize', handleResize);
        controls.dispose();
        textures.dispose();
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

  useEffect(() => {
    sceneRefs.current.swapNow?.();
  }, [activeModel]);

  const currentSpec =
    SHOWCASE_MODELS.find((m) => m.id === activeModel) ?? SHOWCASE_MODELS[0];

  return (
    <section
      id="lab-3d"
      className="relative z-10 scroll-mt-20 border-y border-white/10 bg-[#05070A]/90 py-16 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-medium tracking-wide text-sky-400">
              Inspeksi Multi-Objek 3D Interaktif
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-white text-balance lg:text-4xl">
              Laboratorium Perangkat Keras & Arsitektur 3D
            </h2>
          </div>
          <p className="max-w-md text-sm text-ink-400">
            Putar 360°, perbesar detail sambungan, dan tarik slider komponen terurai
            untuk meninjau setiap unit perangkat keras dan sistem yang kami bangun.
          </p>
        </div>

        {/* Dedicated 3D Viewport with Collapsible Bottom Dock */}
        <div className="relative mt-10 h-[540px] w-full overflow-hidden rounded-xl border border-white/15 bg-[#080C12] sm:h-[600px]">
          {/* Isolated WebGL mount container */}
          <div
            ref={mountRef}
            data-testid="interactive-3d-viewport"
            data-active-model={activeModel}
            className="h-full w-full cursor-grab active:cursor-grabbing"
          />

          {/* Minimal Top-Left Spec Badge (never covering center model, no backdrop-blur) */}
          <div className="pointer-events-none absolute top-4 left-4 max-w-sm rounded-lg border border-white/15 bg-[#090D14]/90 p-4">
            <p className="font-mono text-xs text-sky-400 tabular-nums">
              {currentSpec.discipline} · {currentSpec.partCount} Sub-Komponen
            </p>
            <h3 className="mt-1 font-display text-lg font-bold text-white">
              {currentSpec.title}
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-300">
              {currentSpec.summary}
            </p>
            <p className="mt-2 font-mono text-[11px] text-ink-400">
              {currentSpec.specs}
            </p>
          </div>

          {/* Collapsible Bottom Control Dock (solid/rgba surface, zero backdrop-filter) */}
          <div className="absolute inset-x-0 bottom-4 z-20 mx-auto flex w-fit max-w-[95%] flex-col items-center">
            <button
              type="button"
              onClick={() => setDockCollapsed((prev) => !prev)}
              aria-expanded={!dockCollapsed}
              className="inline-flex items-center gap-1.5 rounded-t-lg border border-b-0 border-white/15 bg-[#0B1018]/95 px-3 py-1.5 text-xs font-medium text-slate-200 hover:text-white cursor-pointer"
            >
              {dockCollapsed ? (
                <>
                  <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
                  Tampilkan Kontrol 3D
                </>
              ) : (
                <>
                  <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
                  Sembunyikan Kontrol 3D
                </>
              )}
            </button>

            {!dockCollapsed && (
              <div className="flex max-w-5xl flex-wrap items-center justify-center gap-3 rounded-xl border border-white/15 bg-[#0B1018]/95 px-4 py-3 shadow-2xl">
                {/* 6 Realistic 3D Object Switchers */}
                <div
                  role="group"
                  aria-label="Pilih objek 3D"
                  className="flex flex-wrap items-center justify-center gap-1.5"
                >
                  {SHOWCASE_MODELS.map((model) => {
                    const isSelected = activeModel === model.id;
                    return (
                      <button
                        key={model.id}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => setActiveModel(model.id)}
                        className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                          isSelected
                            ? 'bg-[#2563EB] text-white'
                            : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        {model.title}
                      </button>
                    );
                  })}
                </div>

                <div className="hidden h-6 w-px bg-white/15 sm:block" aria-hidden="true" />

                {/* Exploded View Slider */}
                <label className="flex items-center gap-2.5 text-xs text-slate-300">
                  <span className="whitespace-nowrap font-medium">Urai Komponen</span>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={explodePercent}
                    aria-label="Urai komponen 3D"
                    onChange={(e) => setExplodePercent(Number(e.target.value))}
                    className="w-24 accent-sky-400 cursor-pointer"
                  />
                  <span className="w-9 font-mono text-sky-300 tabular-nums">
                    {explodePercent}%
                  </span>
                </label>

                {/* Auto-orbit & Reset */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    aria-pressed={autoOrbit}
                    onClick={() => setAutoOrbit((prev) => !prev)}
                    className={`rounded-md border px-2.5 py-1.5 text-xs font-medium whitespace-nowrap cursor-pointer ${
                      autoOrbit
                        ? 'border-sky-500/60 bg-sky-500/15 text-sky-300'
                        : 'border-white/15 text-slate-300 hover:text-white'
                    }`}
                  >
                    Auto-Putar
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      resetSignalRef.current += 1;
                      setExplodePercent(0);
                    }}
                    aria-label="Reset kamera 3D"
                    className="inline-flex items-center gap-1 rounded-md border border-white/15 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:bg-white/5 hover:text-white cursor-pointer"
                  >
                    <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                    Reset
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
