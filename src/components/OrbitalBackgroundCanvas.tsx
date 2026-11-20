import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { createOrbitalBackgroundScene } from '../three/backgroundOrbitalScene';
import {
  createPacedRenderLoop,
  createProceduralTextures,
  detectSoftwareWebGL,
} from '../three/webglUtils';
import { calculateScrollProgress } from '../utils/scrollProgress';

export function OrbitalBackgroundCanvas() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const scrollRef = useRef(0);
  const [contextLost, setContextLost] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const handlePointerMove = (e: PointerEvent) => {
      pointerRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointerRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const handleScroll = () => {
      scrollRef.current = calculateScrollProgress(
        window.scrollY,
        document.documentElement.scrollHeight,
        window.innerHeight
      );
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    const isSoftwareGl = detectSoftwareWebGL();
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: false,
      powerPreference: 'high-performance',
    });

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const canvas = renderer.domElement;
    canvas.style.display = 'block';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    container.appendChild(canvas);

    const onContextLost = (e: Event) => {
      e.preventDefault();
      setContextLost(true);
    };
    const onContextRestored = () => {
      setContextLost(false);
    };
    canvas.addEventListener('webglcontextlost', onContextLost);
    canvas.addEventListener('webglcontextrestored', onContextRestored);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x05070a);
    scene.fog = new THREE.FogExp2(0x05070a, 0.055);

    const camera = new THREE.PerspectiveCamera(
      48,
      window.innerWidth / window.innerHeight,
      0.1,
      60
    );
    camera.position.set(0, 0, 6.2);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTarget = pmremGenerator.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envTarget.texture;
    pmremGenerator.dispose();

    // Warm key + cool hemisphere lighting rig
    const hemiLight = new THREE.HemisphereLight(0x38bdf8, 0x090b0e, 0.85);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xffedd5, 2.2);
    keyLight.position.set(6, 7, 5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x0ea5e9, 1.4);
    rimLight.position.set(-6, -2, -4);
    scene.add(rimLight);

    const textures = createProceduralTextures(
      Math.min(4, renderer.capabilities.getMaxAnisotropy())
    );
    const orbital = createOrbitalBackgroundScene(scene, camera, textures);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    let loopHandle: { cancel: () => void } | null = null;
    if (prefersReducedMotion) {
      orbital.update(0.5, 0.016, scrollRef.current, 0, 0);
      renderer.render(scene, camera);
    } else {
      loopHandle = createPacedRenderLoop(renderer, isSoftwareGl, (delta, elapsed) => {
        if (isSoftwareGl && window.scrollY > window.innerHeight * 0.95) {
          return;
        }
        orbital.update(
          elapsed,
          delta,
          scrollRef.current,
          pointerRef.current.x,
          pointerRef.current.y
        );
        renderer.render(scene, camera);
      });
    }

    return () => {
      loopHandle?.cancel();
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('webglcontextlost', onContextLost);
      canvas.removeEventListener('webglcontextrestored', onContextRestored);
      orbital.dispose();
      textures.dispose();
      envTarget.dispose();
      renderer.dispose();
      if (canvas.parentNode === container) {
        container.removeChild(canvas);
      }
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#05070A]"
    >
      <div
        ref={mountRef}
        data-testid="orbital-background-canvas"
        className="h-full w-full"
      />
      {contextLost && (
        <div className="absolute inset-0 bg-gradient-to-b from-[#05070A] via-[#09111E] to-[#05070A]" />
      )}
    </div>
  );
}
