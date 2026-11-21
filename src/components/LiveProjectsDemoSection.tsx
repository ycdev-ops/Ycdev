import { useEffect, useState } from 'react';
import { Activity, Cpu, ShieldAlert, ShieldCheck, Zap } from 'lucide-react';
import { STUDIO_PROFILE } from '../data/ycdevData';
import {
  calculatePipelineMetrics,
  simulateIotStreamTick,
  simulateSecurityEvent,
  type IotStreamState,
  type SecurityStreamState,
} from '../utils/telemetrySimulation';
import { ResilientImage } from './ResilientImage';

type DemoTab = 'iot' | 'security' | 'pipeline';

export function LiveProjectsDemoSection() {
  const [activeTab, setActiveTab] = useState<DemoTab>('iot');

  // Demo 1: Live IoT Cold-Chain & Port Telemetry
  const [anomalyActive, setAnomalyActive] = useState(false);
  const [iotState, setIotState] = useState<IotStreamState>({
    tick: 1,
    temperatureC: -18.5,
    humidityPct: 54,
    latencyMs: 14,
    activeNodes: 140,
    totalNodes: 140,
    bufferMode: 'STREAMING',
    historyTemp: [-18.6, -18.4, -18.5, -18.3, -18.5, -18.4, -18.6, -18.5],
  });

  // Demo 2: Live Zero-Trust Cybersecurity
  const [secState, setSecState] = useState<SecurityStreamState>({
    blockedProbes: 1428,
    mitigationMs: 3,
    mtlsKeyAgeMinutes: 18,
    threatLevel: 'NOMINAL',
    latestLog: 'Sesi mTLS aktif · 68 endpoint API terproteksi eBPF filter.',
  });

  // Demo 3: Live Distributed Software Pipeline
  const [targetRps, setTargetRps] = useState(24000);
  const pipelineMetrics = calculatePipelineMetrics(targetRps);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setIotState((prev) => simulateIotStreamTick(prev, anomalyActive));
      setSecState((prev) => simulateSecurityEvent(prev, 'tick'));
    }, 1400);
    return () => window.clearInterval(interval);
  }, [anomalyActive]);

  // Build SVG polyline points for IoT temperature live chart
  const tempPoints = iotState.historyTemp
    .map((val, idx) => {
      const x = (idx / Math.max(1, iotState.historyTemp.length - 1)) * 320;
      // Map [-20 .. -10] to [80 .. 12]
      const normalized = Math.min(1, Math.max(0, (val + 20) / 10));
      const y = 84 - normalized * 68;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  return (
    <section
      id="live-demo"
      className="relative z-10 scroll-mt-20 border-b border-white/10 bg-[#070A0F]/95 py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-medium tracking-wide text-sky-400">
              Operasi Nyata & Demonstrasi Sistem
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-white text-balance lg:text-4xl">
              Live Projek & Demo Kemampuan Teknis
            </h2>
          </div>

          <div
            role="tablist"
            aria-label="Pilih demo skill interaktif"
            className="flex flex-wrap items-center gap-1 rounded-lg border border-white/10 bg-[#0E131B] p-1"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'iot'}
              onClick={() => setActiveTab('iot')}
              className={`rounded-md px-3.5 py-2 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'iot'
                  ? 'bg-[#2563EB] text-white'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              01. Live IoT Telemetry
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'security'}
              onClick={() => setActiveTab('security')}
              className={`rounded-md px-3.5 py-2 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'security'
                  ? 'bg-[#2563EB] text-white'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              02. Live Zero-Trust Firewall
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'pipeline'}
              onClick={() => setActiveTab('pipeline')}
              className={`rounded-md px-3.5 py-2 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'pipeline'
                  ? 'bg-[#2563EB] text-white'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              03. Live Backend Throughput
            </button>
          </div>
        </div>

        {/* Interactive Live Telemetry Console */}
        <div className="mt-10 rounded-xl border border-white/15 bg-[#0C1018] p-6 sm:p-8">
          {activeTab === 'iot' && (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
              <div className="flex flex-col justify-between lg:col-span-5">
                <div>
                  <div className="flex items-center gap-2 text-xs font-medium text-sky-400">
                    <Activity className="h-4 w-4" aria-hidden="true" />
                    <span>Proyek Aktif: Jaringan Sensor LoRaWAN & Pelabuhan</span>
                  </div>
                  <h3 className="mt-3 font-display text-2xl font-bold text-white">
                    Stream Telemetri Suhu & Failover Edge Gateway
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-300">
                    Uji langsung bagaimana arsitektur edge YcDev menangani lonjakan suhu
                    atau putus sinyal seluler dengan penyimpanan buffer lokal otomatis.
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setAnomalyActive((prev) => !prev)}
                    className={`rounded-lg px-4 py-2.5 text-xs font-semibold transition-colors cursor-pointer ${
                      anomalyActive
                        ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                        : 'bg-amber-600 text-white hover:bg-amber-500'
                    }`}
                  >
                    {anomalyActive
                      ? 'Pulihkan Kondisi Normal'
                      : 'Uji Anomali Sensor'}
                  </button>
                  <span className="font-mono text-xs text-ink-400">
                    Mode: {iotState.bufferMode}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:col-span-7">
                <div className="rounded-lg border border-white/10 bg-[#080B11] p-4">
                  <p className="text-xs text-ink-400">Suhu Ruang Dingin</p>
                  <p
                    data-testid="live-iot-temp"
                    className={`mt-2 font-mono text-2xl font-semibold tabular-nums ${
                      anomalyActive ? 'text-amber-400' : 'text-sky-300'
                    }`}
                  >
                    {iotState.temperatureC} °C
                  </p>
                </div>

                <div className="rounded-lg border border-white/10 bg-[#080B11] p-4">
                  <p className="text-xs text-ink-400">Latensi Edge</p>
                  <p className="mt-2 font-mono text-2xl font-semibold text-white tabular-nums">
                    {iotState.latencyMs} ms
                  </p>
                </div>

                <div className="rounded-lg border border-white/10 bg-[#080B11] p-4">
                  <p className="text-xs text-ink-400">Node Terhubung</p>
                  <p className="mt-2 font-mono text-2xl font-semibold text-white tabular-nums">
                    {iotState.activeNodes}/{iotState.totalNodes}
                  </p>
                </div>

                <div className="rounded-lg border border-white/10 bg-[#080B11] p-4">
                  <p className="text-xs text-ink-400">Kelembapan</p>
                  <p className="mt-2 font-mono text-2xl font-semibold text-white tabular-nums">
                    {iotState.humidityPct}%
                  </p>
                </div>

                {/* Live Animated Waveform SVG */}
                <div className="col-span-2 rounded-lg border border-white/10 bg-[#080B11] p-4 sm:col-span-4">
                  <div className="flex items-center justify-between text-xs text-ink-400">
                    <span>Grafik Telemetri Waktu Nyata (Tick #{iotState.tick})</span>
                    <span className="font-mono text-sky-400">MQTT over TLS 1.3</span>
                  </div>
                  <svg
                    viewBox="0 0 320 96"
                    className="mt-3 h-24 w-full overflow-visible"
                    aria-label="Grafik garis suhu IoT langsung"
                  >
                    <line
                      x1="0"
                      y1="48"
                      x2="320"
                      y2="48"
                      stroke="rgba(148,163,184,0.15)"
                      strokeDasharray="4 4"
                    />
                    <polyline
                      fill="none"
                      stroke={anomalyActive ? '#f59e0b' : '#38bdf8'}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={tempPoints}
                    />
                  </svg>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
              <div className="flex flex-col justify-between lg:col-span-5">
                <div>
                  <div className="flex items-center gap-2 text-xs font-medium text-sky-400">
                    <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                    <span>Proyek Aktif: Zero-Trust API & Pertahanan eBPF</span>
                  </div>
                  <h3 className="mt-3 font-display text-2xl font-bold text-white">
                    Mitigasi Intrusi Otomatis & Rotasi Kunci mTLS
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-300">
                    Uji ketahanan filter eBPF terhadap lonjakan serangan API serta rotasi
                    kunci kriptografi Vault tanpa memutus sesi pengguna sah.
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setSecState((prev) => simulateSecurityEvent(prev, 'attack_test'))
                    }
                    className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-rose-500 cursor-pointer"
                  >
                    <ShieldAlert className="h-4 w-4" aria-hidden="true" />
                    Uji Serangan API
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setSecState((prev) => simulateSecurityEvent(prev, 'rotate_mtls'))
                    }
                    className="rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-semibold text-white hover:bg-white/10 cursor-pointer"
                  >
                    Rotasi Kunci mTLS
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:col-span-7">
                <div className="rounded-lg border border-white/10 bg-[#080B11] p-4">
                  <p className="text-xs text-ink-400">Upaya Intrusi Diblokir</p>
                  <p
                    data-testid="live-sec-blocked"
                    className="mt-2 font-mono text-2xl font-semibold text-white tabular-nums"
                  >
                    {secState.blockedProbes.toLocaleString('id-ID')}
                  </p>
                </div>
                <div className="rounded-lg border border-white/10 bg-[#080B11] p-4">
                  <p className="text-xs text-ink-400">Waktu Isolasi</p>
                  <p className="mt-2 font-mono text-2xl font-semibold text-sky-300 tabular-nums">
                    {secState.mitigationMs} ms
                  </p>
                </div>
                <div className="rounded-lg border border-white/10 bg-[#080B11] p-4">
                  <p className="text-xs text-ink-400">Umur Kunci mTLS</p>
                  <p className="mt-2 font-mono text-2xl font-semibold text-white tabular-nums">
                    {secState.mtlsKeyAgeMinutes} mnt
                  </p>
                </div>

                <div className="rounded-lg border border-white/10 bg-[#080B11] p-4 sm:col-span-3">
                  <p className="text-xs text-ink-400">
                    Status Keamanan: {secState.threatLevel}
                  </p>
                  <p
                    data-testid="live-sec-log"
                    className="mt-2 font-mono text-sm text-emerald-300"
                  >
                    {secState.latestLog}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'pipeline' && (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
              <div className="flex flex-col justify-between lg:col-span-5">
                <div>
                  <div className="flex items-center gap-2 text-xs font-medium text-sky-400">
                    <Zap className="h-4 w-4" aria-hidden="true" />
                    <span>Proyek Aktif: Mesin Ingest Go & Kafka Skala Regional</span>
                  </div>
                  <h3 className="mt-3 font-display text-2xl font-bold text-white">
                    Pengukur Skala Beban Full-Stack & Distributed Pipeline
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-300">
                    Geser target beban permintaan per detik untuk mengamati penskalaan
                    otomatis worker Go, latensi p99 PostgreSQL, dan jejak memori.
                  </p>
                </div>

                <div className="mt-6">
                  <label className="block text-xs font-semibold text-slate-200">
                    Target Beban Trafik:{' '}
                    <span className="font-mono text-sky-300 tabular-nums">
                      {pipelineMetrics.targetRps.toLocaleString('id-ID')} req/s
                    </span>
                  </label>
                  <input
                    type="range"
                    min={5000}
                    max={48000}
                    step={1000}
                    value={targetRps}
                    aria-label="Target beban trafik per detik"
                    onChange={(e) => setTargetRps(Number(e.target.value))}
                    className="mt-3 w-full accent-sky-400 cursor-pointer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:col-span-7">
                <div className="rounded-lg border border-white/10 bg-[#080B11] p-4">
                  <p className="text-xs text-ink-400">Worker Pool Go</p>
                  <p className="mt-2 font-mono text-2xl font-semibold text-white tabular-nums">
                    {pipelineMetrics.goWorkerCount} pod
                  </p>
                </div>
                <div className="rounded-lg border border-white/10 bg-[#080B11] p-4">
                  <p className="text-xs text-ink-400">Latensi p99 DB</p>
                  <p className="mt-2 font-mono text-2xl font-semibold text-sky-300 tabular-nums">
                    {pipelineMetrics.dbP99Ms} ms
                  </p>
                </div>
                <div className="rounded-lg border border-white/10 bg-[#080B11] p-4">
                  <p className="text-xs text-ink-400">Redis Cache Hit</p>
                  <p className="mt-2 font-mono text-2xl font-semibold text-white tabular-nums">
                    {pipelineMetrics.cacheHitRatePct}%
                  </p>
                </div>
                <div className="rounded-lg border border-white/10 bg-[#080B11] p-4">
                  <p className="text-xs text-ink-400">Jejak Memori</p>
                  <p className="mt-2 font-mono text-2xl font-semibold text-white tabular-nums">
                    {pipelineMetrics.memoryFootprintMb} MB
                  </p>
                </div>
                <div className="rounded-lg border border-white/10 bg-[#080B11] p-4 sm:col-span-2">
                  <p className="text-xs text-ink-400">Antrean Kafka Lag</p>
                  <p className="mt-2 font-mono text-2xl font-semibold text-emerald-300 tabular-nums">
                    {pipelineMetrics.kafkaLagMessages} pesan
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Real-World Deployment & Engineering Reference Gallery */}
        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <article className="overflow-hidden rounded-xl border border-white/10 bg-[#0C1018]">
            <div className="aspect-[16/9] w-full overflow-hidden border-b border-white/10 bg-[#080B11]">
              <ResilientImage
                src={STUDIO_PROFILE.portCommandImage}
                alt="Tim komando operasi dan pusat kendali telemetri pelabuhan YcDev"
                fallbackTitle="Pusat Kendali Operasi Pelabuhan"
                className="h-full w-full object-cover object-center"
              />
            </div>
            <div className="p-6">
              <p className="text-xs text-sky-400">
                Operasi Lapangan · Pusat Kendali Logistik & Pelabuhan
              </p>
              <h3 className="mt-2 font-display text-xl font-semibold text-white">
                Sistem Kendali Crane, CCTV & Telemetri Armada Pelabuhan
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                Integrasi pemantauan multi-layar waktu nyata untuk mengoordinasikan pergerakan
                kontainer, telemetri alat berat, dan keamanan jaringan terminal.
              </p>
            </div>
          </article>

          <article className="overflow-hidden rounded-xl border border-white/10 bg-[#0C1018]">
            <div className="aspect-[16/9] w-full overflow-hidden border-b border-white/10 bg-[#080B11]">
              <ResilientImage
                src={STUDIO_PROFILE.serverLabImage}
                alt="Rak server infrastruktur fiber optik dan meja uji prototipe PCB perangkat keras YcDev"
                fallbackTitle="Laboratorium Server & Hardware PCB"
                className="h-full w-full object-cover object-center"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 text-xs text-sky-400">
                <Cpu className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Fasilitas Infrastruktur · Rak Server & Bench PCB</span>
              </div>
              <h3 className="mt-2 font-display text-xl font-semibold text-white">
                Pengujian Rak Server Fiber Optik & Prototipe Papan Sirkuit
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">
                Setiap perangkat IoT, modul RF, dan arsitektur server diuji langsung secara
                fisik di laboratorium perangkat keras sebelum dikirim ke lokasi klien.
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
