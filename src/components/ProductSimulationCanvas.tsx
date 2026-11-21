import { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import type { ProductVideoVariant } from '../utils/maritimeCatalog';

interface ProductSimulationCanvasProps {
  variant: ProductVideoVariant;
  title: string;
  durationLabel: string;
  compact?: boolean;
}

export function ProductSimulationCanvas({
  variant,
  title,
  durationLabel,
  compact = false,
}: ProductSimulationCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState<1 | 2>(1);
  const [progress, setProgress] = useState(0);

  const playingRef = useRef(playing);
  const speedRef = useRef(speed);
  playingRef.current = playing;
  speedRef.current = speed;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId = 0;
    let simTime = 0;
    let lastNow = performance.now();
    let frameTick = 0;

    const drawFrame = (t: number) => {
      const w = canvas.width;
      const h = canvas.height;

      // Deep SpaceX obsidian maritime background
      ctx.fillStyle = '#060A11';
      ctx.fillRect(0, 0, w, h);

      // Subtle tactical grid
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 36) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += 36) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      if (variant === 'radar-sweep' || variant === 'remote-radar') {
        const cx = w * 0.5;
        const cy = h * 0.52;
        const radius = Math.min(w, h) * 0.36;

        [0.33, 0.66, 1].forEach((r) => {
          ctx.beginPath();
          ctx.arc(cx, cy, radius * r, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(16, 185, 129, 0.35)';
          ctx.stroke();
        });

        // Rotating sweep wedge
        const angle = (t * 1.35) % (Math.PI * 2);
        const grad = ctx.createRadialGradient(cx, cy, 4, cx, cy, radius);
        grad.addColorStop(0, 'rgba(16, 185, 129, 0.55)');
        grad.addColorStop(1, 'rgba(56, 189, 248, 0.04)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, radius, angle - 0.55, angle);
        ctx.closePath();
        ctx.fill();

        // Moving ARPA vessel blips + vectors
        [
          { r: 0.45, a: 0.7, lbl: 'TGT-04 14.3kt' },
          { r: 0.72, a: 2.4, lbl: 'TGT-11 19.8kt' },
          { r: 0.58, a: 4.1, lbl: 'CPA 0.8nm' },
        ].forEach((b, idx) => {
          const bx = cx + Math.cos(b.a + t * 0.08 * (idx + 1)) * radius * b.r;
          const by = cy + Math.sin(b.a + t * 0.08 * (idx + 1)) * radius * b.r;
          ctx.fillStyle = '#38bdf8';
          ctx.fillRect(bx - 3, by - 3, 6, 6);
          ctx.beginPath();
          ctx.moveTo(bx, by);
          ctx.lineTo(bx + 18, by - 12);
          ctx.strokeStyle = '#38bdf8';
          ctx.stroke();
          ctx.fillStyle = '#a7f3d0';
          ctx.font = '10px monospace';
          ctx.fillText(b.lbl, bx + 8, by - 14);
        });
      } else if (variant === 'satcom-handover' || variant === 'airtime-qos') {
        // Vessel at sea bottom + Coastal 5G tower left + Orbital Satellites top
        const shipX = w * 0.5 + Math.sin(t * 0.55) * (w * 0.22);
        const shipY = h * 0.72;
        const satX = w * 0.65 + Math.cos(t * 0.45) * 45;
        const satY = h * 0.22;
        const towerX = w * 0.16;
        const towerY = h * 0.68;

        const useSat = shipX > w * 0.44;
        // Draw coastal tower
        ctx.strokeStyle = !useSat ? '#34d399' : '#475569';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(towerX - 10, towerY + 20);
        ctx.lineTo(towerX, towerY - 26);
        ctx.lineTo(towerX + 10, towerY + 20);
        ctx.stroke();

        // Draw satellite icon
        ctx.fillStyle = useSat ? '#38bdf8' : '#64748b';
        ctx.fillRect(satX - 10, satY - 6, 20, 12);
        ctx.fillStyle = '#0ea5e9';
        ctx.fillRect(satX - 28, satY - 4, 15, 8);
        ctx.fillRect(satX + 13, satY - 4, 15, 8);

        // Draw active handover link beam
        const targetX = useSat ? satX : towerX;
        const targetY = useSat ? satY : towerY - 24;
        ctx.setLineDash([6, 6]);
        ctx.lineDashOffset = -t * 36;
        ctx.strokeStyle = useSat ? '#38bdf8' : '#34d399';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(shipX, shipY - 12);
        ctx.lineTo(targetX, targetY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw vessel hull
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath();
        ctx.moveTo(shipX - 28, shipY);
        ctx.lineTo(shipX + 30, shipY);
        ctx.lineTo(shipX + 20, shipY + 12);
        ctx.lineTo(shipX - 22, shipY + 12);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = useSat ? '#38bdf8' : '#34d399';
        ctx.font = 'bold 11px monospace';
        ctx.fillText(
          useSat ? 'LINK: LEO STARLINK / L-BAND ACTIVE' : 'LINK: 5G COASTAL MIMO ACTIVE',
          16,
          h - 18
        );
      } else if (variant === 'enc-fleet' || variant === 'geofence-alert' || variant === 'dredger-rig') {
        // ENC Digital Chart & Geofence Polygons + Moving Vessel Vector
        ctx.fillStyle = 'rgba(14, 165, 233, 0.1)';
        ctx.strokeStyle = variant === 'geofence-alert' ? '#f59e0b' : '#0284c7';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(w * 0.22, h * 0.3);
        ctx.lineTo(w * 0.54, h * 0.24);
        ctx.lineTo(w * 0.62, h * 0.68);
        ctx.lineTo(w * 0.28, h * 0.74);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Moving vessel route path
        const vx = w * 0.16 + ((t * 42) % (w * 0.68));
        const vy = h * 0.5 + Math.sin(t * 1.4) * 28;
        ctx.strokeStyle = '#38bdf8';
        ctx.beginPath();
        ctx.moveTo(w * 0.14, h * 0.52);
        ctx.lineTo(vx, vy);
        ctx.stroke();

        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(vx, vy, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#e2e8f0';
        ctx.font = '11px monospace';
        ctx.fillText(`HDG ${(92 + Math.sin(t) * 6).toFixed(1)}° · SOG 14.8 KTS`, 16, h - 18);
      } else {
        // Waveforms + Node Packets (NMEA Bus, Fuel Flow, API Sync, NOC, On-Board Cabling)
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let x = 20; x < w - 20; x += 6) {
          const y =
            h * 0.48 +
            Math.sin(x * 0.045 + t * 3.2) * 24 +
            Math.cos(x * 0.09 - t * 2.1) * 10;
          if (x === 20) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Packet pulse bars
        for (let i = 0; i < 6; i++) {
          const px = 28 + ((t * 85 + i * 74) % (w - 56));
          ctx.fillStyle = i % 2 === 0 ? '#34d399' : '#38bdf8';
          ctx.fillRect(px, h * 0.72, 14, 5);
        }

        ctx.fillStyle = '#94a3b8';
        ctx.font = '11px monospace';
        ctx.fillText(
          `STREAM: ${variant.toUpperCase()} · PKT ${(Math.floor(t * 24) % 999)
            .toString()
            .padStart(3, '0')} · TLS 1.3`,
          16,
          h - 18
        );
      }

      // Top HUD bar inside video frame
      ctx.fillStyle = 'rgba(5, 7, 10, 0.72)';
      ctx.fillRect(0, 0, w, 28);
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 10px monospace';
      ctx.fillText(`REC · OPERASI PROJEK NYATA YcDev`, 12, 18);
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText(`24 FPS`, w - 54, 18);
    };

    const tick = (now: number) => {
      const dt = Math.min((now - lastNow) / 1000, 0.05);
      lastNow = now;
      if (playingRef.current) {
        simTime += dt * speedRef.current;
        frameTick += 1;
        if (frameTick % 4 === 0) {
          setProgress(((simTime * 12) % 100));
        }
      }
      drawFrame(simTime);
      rafId = window.requestAnimationFrame(tick);
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, [variant]);

  return (
    <div className="overflow-hidden rounded-lg border border-white/15 bg-[#060A11]">
      <div className={`relative w-full ${compact ? 'aspect-[4/3]' : 'aspect-video'}`}>
        <canvas
          ref={canvasRef}
          width={640}
          height={compact ? 480 : 360}
          aria-label={`Animasi video projek ${title}`}
          className="h-full w-full block"
        />
      </div>
      <div className="flex items-center justify-between gap-3 border-t border-white/10 bg-[#0A0E16] px-3 py-2 text-xs">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? `Jeda video ${title}` : `Putar video ${title}`}
            className="inline-flex h-7 w-7 items-center justify-center rounded border border-white/15 bg-white/5 text-white hover:bg-white/10 cursor-pointer"
          >
            {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          </button>
          <button
            type="button"
            onClick={() => setSpeed((s) => (s === 1 ? 2 : 1))}
            className="rounded border border-white/15 px-2 py-1 font-mono text-[11px] text-slate-300 hover:text-white cursor-pointer"
          >
            {speed}x
          </button>
        </div>

        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full bg-sky-400 transition-transform duration-100 origin-left"
            style={{ transform: `scaleX(${Math.max(0.05, progress / 100)})` }}
          />
        </div>

        <span className="font-mono text-[11px] text-ink-400 whitespace-nowrap tabular-nums">
          {durationLabel}
        </span>
      </div>
    </div>
  );
}
