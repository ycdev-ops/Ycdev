import { useEffect, useRef } from 'react';
import type * as THREE from 'three';
import { loadThree } from '../three/loadThree';
import { STUDIO_PROFILE } from '../data/ycdevData';
import { createFooter3DSceneFactory } from '../three/footer3DScene';
import { createWebglUtils } from '../three/webglUtils';
import type { LoopHandle } from '../three/webglTypes';
import { WhatsAppIcon } from './WhatsAppIcon';
import { assetUrl } from '../utils/siteAssets';

export function Footer() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const footerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    const footerEl = footerRef.current;
    if (!container || !footerEl) return;

    let cancelled = false;
    let cleanup: (() => void) | null = null;

    loadThree().then((THREE) => {
      if (cancelled) return;

      const webgl = createWebglUtils(THREE);
      const { detectSoftwareWebGL, createPacedRenderLoop } = webgl;

      const isSoftwareGl = detectSoftwareWebGL();
      const width = container.clientWidth || 1200;
      const height = container.clientHeight || 220;

      const renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        alpha: false,
        powerPreference: 'high-performance',
      });
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width, height);

      const canvas = renderer.domElement;
      canvas.style.display = 'block';
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      container.appendChild(canvas);

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x040608);
      scene.fog = new THREE.FogExp2(0x040608, 0.06);

      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 40);
      camera.position.set(0, 0.9, 5.2);
      camera.lookAt(0, -0.35, -3);

      const createFooter3DScene = createFooter3DSceneFactory(THREE);
      const footerScene = createFooter3DScene(scene);

      let isVisible = false;
      const observer = new IntersectionObserver(
        (entries) => {
          isVisible = entries[0]?.isIntersecting ?? false;
        },
        { threshold: 0.02 }
      );
      observer.observe(footerEl);

      const handleResize = () => {
        if (!container) return;
        const w = container.clientWidth || 1200;
        const h = container.clientHeight || 220;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener('resize', handleResize);

      // Draw initial frame
      footerScene.update(0.5);
      renderer.render(scene, camera);

      const loop = createPacedRenderLoop(renderer, isSoftwareGl, (_delta, elapsed) => {
        if (isSoftwareGl && !isVisible) return;
        footerScene.update(elapsed);
        renderer.render(scene, camera);
      });

      cleanup = () => {
        loop.cancel();
        observer.disconnect();
        window.removeEventListener('resize', handleResize);
        footerScene.dispose();
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
    <footer
      ref={footerRef}
      className="relative z-10 overflow-hidden border-t border-white/10 bg-[#040608] py-14"
    >
      {/* Live 3D WebGL Ocean Wave & Orbital Relay Backdrop */}
      <div
        ref={mountRef}
        data-testid="footer-live-3d"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 opacity-85"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-r from-[#040608]/90 via-[#040608]/55 to-[#040608]/90"
      />

      <div className="relative z-10 mx-auto flex max-w-7xl flex-col justify-between gap-8 px-6 md:flex-row md:items-center lg:px-10">
        <div className="flex items-start gap-4">
          <img
            src={assetUrl(STUDIO_PROFILE.logoImage)}
            alt="Logo YcDev"
            referrerPolicy="no-referrer"
            className="h-12 w-12 shrink-0 rounded-full object-cover ring-1 ring-sky-400/35"
          />
          <div>
            <p className="font-display text-lg font-bold tracking-tight text-white">
              {STUDIO_PROFILE.brandName}
            </p>
            <p className="mt-0.5 text-sm text-slate-300">
              {STUDIO_PROFILE.addressLine} · {STUDIO_PROFILE.cityRegion}
            </p>
            <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-slate-400">
              <span>
                Pendiri: {STUDIO_PROFILE.founder} · Telp:{' '}
                <a
                  href={STUDIO_PROFILE.phoneHref}
                  className="font-mono text-sky-300 hover:text-white tabular-nums"
                >
                  {STUDIO_PROFILE.phoneDisplay}
                </a>
              </span>
              <a
                href={STUDIO_PROFILE.whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md border border-emerald-400/40 bg-[#15803D] px-2.5 py-1 text-[11px] font-bold text-white hover:bg-[#16A34A] whitespace-nowrap"
              >
                <WhatsAppIcon className="h-3.5 w-3.5 shrink-0" />
                <span>Hubungi Kami</span>
              </a>
            </div>
          </div>
        </div>

        <nav aria-label="Navigasi footer" className="flex flex-wrap items-center gap-6 text-sm text-slate-300">
          <a href="#lab-3d" className="hover:text-white">
            3D Lab
          </a>
          <a href="#video-projek" className="hover:text-white">
            Video Projek
          </a>
          <a href="#solusi-maritim" className="hover:text-white">
            Produk
          </a>
          <a href="#profil-pendiri" className="hover:text-white">
            Profil & Sertifikasi
          </a>
          <a href="#tim-ycdev" className="hover:text-white">
            Tim YcDev
          </a>
          <a href="#klien-partner" className="hover:text-white">
            Klien & Partner
          </a>
          <a href="#portal-klien" className="hover:text-white">
            Portal Klien
          </a>
          <a href="#lokasi-3d" className="hover:text-white">
            Peta 3D
          </a>
          <a href="#kontak" className="hover:text-white">
            Kontak
          </a>
        </nav>

        <p className="text-xs text-slate-400">
          © {new Date().getFullYear()} {STUDIO_PROFILE.brandName}. Seluruh hak cipta dilindungi.
        </p>
      </div>
    </footer>
  );
}
