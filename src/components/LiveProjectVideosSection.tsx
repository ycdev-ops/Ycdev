import { useState } from 'react';
import { Film, Pause, Play } from 'lucide-react';
import { STUDIO_PROFILE } from '../data/ycdevData';
import { ProductSimulationCanvas } from './ProductSimulationCanvas';
import { ResilientImage } from './ResilientImage';
import type { ProductVideoVariant } from '../utils/maritimeCatalog';

interface VideoChannel {
  id: string;
  code: string;
  title: string;
  location: string;
  summary: string;
  imageUrl: string;
  imageAlt: string;
  variant: ProductVideoVariant;
  durationLabel: string;
}

const PROJECT_VIDEO_CHANNELS: VideoChannel[] = [
  {
    id: 'ch-port-command',
    code: 'CH-01',
    title: 'Komisioning Pusat Kendali Armada & Radar Pelabuhan',
    location: 'Terminal Kontainer · Semarang & Laut Jawa',
    summary:
      'Operasi nyata tim pusat komando YcDev mengintegrasikan tayangan kamera crane, peta laut digital ENC, dan mirroring radar X-Band untuk koordinasi sandar kapal.',
    imageUrl: STUDIO_PROFILE.portCommandImage,
    imageAlt: 'Tim komando operasi YcDev di pusat kendali telemetri pelabuhan',
    variant: 'enc-fleet',
    durationLabel: '01:12 · Field Feed',
  },
  {
    id: 'ch-bridge-nmea',
    code: 'CH-02',
    title: 'Instalasi Edge Box IP67 & Uji NMEA 2000 di Anjungan',
    location: 'On-Board Sea Trial · Pelabuhan Indonesia',
    summary:
      'Dokumentasi penarikan kabel marine armored, pembacaan data NMEA 0183/2000 dari radar serta GPS anjungan, dan pengujian buffer SQLite saat koneksi satelit terputus.',
    imageUrl: '/src/assets/images/onboard_marine_install_1795196271296.jpg',
    imageAlt: 'Teknisi memasang Marine IoT Gateway dan pengkabelan di anjungan kapal',
    variant: 'nmea-bus',
    durationLabel: '00:54 · On-Board',
  },
  {
    id: 'ch-rack-bench',
    code: 'CH-03',
    title: 'Uji Ketahanan Rak Server & Pengalihan Failover Satelit',
    location: 'Laboratorium Perangkat Keras YcDev · Puri Eksekutif',
    summary:
      'Pengujian langsung routing Multi-WAN antara 4G/5G pesisir dan satelit LEO/L-Band serta stress-test papan sirkuit PCB sebelum pengiriman ke armada.',
    imageUrl: STUDIO_PROFILE.serverLabImage,
    imageAlt: 'Rak server fiber optik dan meja uji PCB perangkat keras YcDev',
    variant: 'satcom-handover',
    durationLabel: '01:05 · Lab Stress Test',
  },
  {
    id: 'ch-noc-watch',
    code: 'CH-04',
    title: 'Operasi NOC 24/7, Remote Radar & Peringatan BBM',
    location: 'Network Operations Center · Semarang Barat',
    summary:
      'Pemantauan kesehatan ratusan node sensor kapal, deteksi anomali penyusutan tangki BBM secara langsung, serta pelaporan otomatis ke VMS KKP.',
    imageUrl: '/src/assets/images/maintenance_noc_support_1795196271728.jpg',
    imageAlt: 'Ruang kendali NOC 24/7 memantau seluruh armada kapal',
    variant: 'remote-radar',
    durationLabel: '01:18 · NOC Live',
  },
];

export function LiveProjectVideosSection() {
  const [activeChannelId, setActiveChannelId] = useState<string>(
    PROJECT_VIDEO_CHANNELS[0].id
  );
  const [kenBurnsActive, setKenBurnsActive] = useState(true);

  const activeChannel =
    PROJECT_VIDEO_CHANNELS.find((c) => c.id === activeChannelId) ??
    PROJECT_VIDEO_CHANNELS[0];

  return (
    <section
      id="video-projek"
      className="relative z-10 scroll-mt-20 border-b border-white/10 bg-[#05070A]/95 py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-medium tracking-wide text-sky-400">
              Dokumentasi Lapangan & Video Proyek
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-white text-balance lg:text-4xl">
              Video Projek Nyata & Telemetri Operasional
            </h2>
          </div>
          <p className="max-w-md text-sm text-slate-400">
            Tinjau cuplikan proyek langsung di pelabuhan, anjungan kapal, dan ruang server
            bersama aliran data telemetri waktu nyata.
          </p>
        </div>

        {/* Interactive Multi-Channel Video Theater */}
        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left 8 Cols: Active Field Video Reel + Live Telemetry Stream */}
          <div className="space-y-4 rounded-xl border border-white/10 bg-[#0C1119] p-5 lg:col-span-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-mono text-xs text-sky-400 tabular-nums">
                  {activeChannel.code} · {activeChannel.location}
                </p>
                <h3 className="mt-1 font-display text-xl font-bold text-white">
                  {activeChannel.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setKenBurnsActive((prev) => !prev)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-white/10 cursor-pointer"
              >
                {kenBurnsActive ? (
                  <>
                    <Pause className="h-3.5 w-3.5 text-sky-400" aria-hidden="true" />
                    Jeda Gerak Kamera
                  </>
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5 text-sky-400" aria-hidden="true" />
                    Putar Gerak Kamera
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Field Documentary Frame with subtle animated camera drift */}
              <div className="relative overflow-hidden rounded-lg border border-white/15 bg-[#060A11]">
                <div className="aspect-video w-full overflow-hidden">
                  <ResilientImage
                    src={activeChannel.imageUrl}
                    alt={activeChannel.imageAlt}
                    fallbackTitle={activeChannel.title}
                    className={`h-full w-full object-cover transition-transform duration-[4000ms] ease-in-out ${
                      kenBurnsActive ? 'scale-105' : 'scale-100'
                    }`}
                  />
                </div>
                <div className="flex items-center justify-between border-t border-white/10 bg-[#0A0E16] px-3 py-2 font-mono text-[11px] text-slate-400">
                  <span className="inline-flex items-center gap-1.5 text-slate-200">
                    <Film className="h-3.5 w-3.5 text-sky-400" aria-hidden="true" />
                    REKAMAN OPERASI LAPANGAN
                  </span>
                  <span className="tabular-nums">{activeChannel.durationLabel}</span>
                </div>
              </div>

              {/* Synchronized Live Engineering Video Simulation */}
              <ProductSimulationCanvas
                variant={activeChannel.variant}
                title={activeChannel.title}
                durationLabel={activeChannel.durationLabel}
              />
            </div>

            <p className="text-sm leading-relaxed text-slate-300">
              {activeChannel.summary}
            </p>
          </div>

          {/* Right 4 Cols: Interactive Channel Playlist */}
          <div
            role="tablist"
            aria-label="Pilih saluran video proyek nyata"
            className="flex flex-col gap-3 lg:col-span-4"
          >
            {PROJECT_VIDEO_CHANNELS.map((ch) => {
              const selected = ch.id === activeChannel.id;
              return (
                <button
                  key={ch.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setActiveChannelId(ch.id)}
                  className={`flex items-start gap-3.5 rounded-xl border p-3.5 text-left transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 ${
                    selected
                      ? 'border-sky-500 bg-sky-500/10 text-white'
                      : 'border-white/10 bg-[#0B0F17] text-slate-300 hover:border-white/25 hover:text-white'
                  }`}
                >
                  <div className="h-16 w-24 shrink-0 overflow-hidden rounded-md border border-white/10 bg-[#05070A]">
                    <ResilientImage
                      src={ch.imageUrl}
                      alt={ch.imageAlt}
                      fallbackTitle={ch.code}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-mono text-[11px] text-sky-400 tabular-nums">
                      {ch.code} · {ch.durationLabel}
                    </p>
                    <p className="mt-0.5 text-sm font-semibold leading-snug text-white">
                      {ch.title}
                    </p>
                    <p className="mt-1 truncate text-xs text-slate-400">
                      {ch.location}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
