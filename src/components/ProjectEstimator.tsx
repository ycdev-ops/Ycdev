import { ArrowRight, Check, Info } from 'lucide-react';
import { SERVICE_PILLARS, type DisciplineId } from '../data/ycdevData';
import {
  calculateProjectEstimate,
  DISCIPLINE_PRICING,
  formatMillionsToWords,
  type EstimateResult,
  type ProjectScale,
  type TimelineUrgency,
} from '../utils/projectEstimator';

interface ProjectEstimatorProps {
  selectedDisciplines: DisciplineId[];
  scale: ProjectScale;
  urgency: TimelineUrgency;
  onToggleDiscipline: (id: DisciplineId) => void;
  onScaleChange: (scale: ProjectScale) => void;
  onUrgencyChange: (urgency: TimelineUrgency) => void;
  onApplyScope: (summaryText: string) => void;
}

const SCALE_OPTIONS: { id: ProjectScale; label: string; desc: string }[] = [
  { id: 'pilot', label: 'Percontohan', desc: 'Satu lokasi, bukti konsep terukur' },
  { id: 'production', label: 'Sistem Produksi', desc: 'Operasi harian dengan SLA' },
  { id: 'enterprise', label: 'Skala Enterprise', desc: 'Multi-lokasi & integrasi kompleks' },
];

const URGENCY_OPTIONS: { id: TimelineUrgency; label: string; desc: string }[] = [
  { id: 'standard', label: 'Ritme Standar', desc: 'Tanpa penambahan biaya percepatan' },
  { id: 'accelerated', label: 'Akselerasi Cepat', desc: '+22% biaya, durasi dipangkas ±28%' },
];

export function ProjectEstimator({
  selectedDisciplines,
  scale,
  urgency,
  onToggleDiscipline,
  onScaleChange,
  onUrgencyChange,
  onApplyScope,
}: ProjectEstimatorProps) {
  const estimate: EstimateResult = calculateProjectEstimate({
    disciplines: selectedDisciplines,
    scale,
    urgency,
  });

  const handleApplyClick = () => {
    if (!estimate.isValid) return;
    const disciplineNames = SERVICE_PILLARS.filter((s) =>
      estimate.disciplines.includes(s.id)
    )
      .map((s) => s.title)
      .join(' + ');

    const scaleLabel = SCALE_OPTIONS.find((s) => s.id === scale)?.label ?? scale;
    const urgencyLabel = URGENCY_OPTIONS.find((u) => u.id === urgency)?.label ?? urgency;

    onApplyScope(
      `${disciplineNames} (${scaleLabel}, ${urgencyLabel}) — Estimasi ${estimate.weeksMin}–${estimate.weeksMax} minggu (${estimate.formattedBudgetLong})`
    );
  };

  return (
    <section
      id="estimasi"
      className="relative z-10 border-b border-white/10 bg-[#05070A]/95 py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="max-w-2xl">
          <p className="text-xs font-medium tracking-wide text-sky-400">
            Perencana Ruang Lingkup
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-white text-balance lg:text-4xl">
            Kalkulator Estimasi Investasi & Durasi
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-400">
            Kombinasikan pilar rekayasa yang dibutuhkan. Angka disusun dari harga
            komponen pasar Indonesia — perangkat, platform, personel, dan instalasi —
            sehingga rinciannya dapat diaudit satu per satu.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Controls Column */}
          <div className="space-y-8 rounded-xl border border-white/10 bg-[#11151B] p-6 sm:p-8 lg:col-span-7">
            <div>
              <p className="text-sm font-semibold text-white">
                1. Pilih Pilar Rekayasa
              </p>
              <p className="mt-1 text-xs text-ink-400">
                {SERVICE_PILLARS.length} pilar tersedia; klik untuk menambah atau mengurangi.
              </p>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {SERVICE_PILLARS.map((pillar) => {
                  const active = selectedDisciplines.includes(pillar.id);
                  const pricing = DISCIPLINE_PRICING[pillar.id];
                  const baseSum =
                    pricing?.components.reduce((sum, c) => sum + c.amountMillions, 0) ?? 0;
                  const baseTotal = baseSum + (pricing?.engineeringMillions ?? 0);

                  return (
                    <button
                      key={pillar.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => onToggleDiscipline(pillar.id)}
                      className={`flex items-start justify-between gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 ${
                        active
                          ? 'border-sky-500 bg-sky-500/10 text-white'
                          : 'border-white/10 bg-[#0D1015] text-slate-300 hover:border-white/25'
                      }`}
                    >
                      <span className="min-w-0">
                        <span className="block font-medium leading-snug">{pillar.title}</span>
                        {pricing ? (
                          <span className="mt-1 block font-mono text-[10px] text-ink-400 tabular-nums">
                            {formatMillionsToWords(baseTotal)} dasar
                          </span>
                        ) : null}
                      </span>
                      <span
                        aria-hidden="true"
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                          active
                            ? 'border-sky-400 bg-sky-500 text-slate-950'
                            : 'border-white/20 text-transparent'
                        }`}
                      >
                        <Check className="h-3.5 w-3.5" />
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-white">2. Skala Operasional</p>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {SCALE_OPTIONS.map((opt) => {
                  const active = scale === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => onScaleChange(opt.id)}
                      className={`rounded-lg border p-3.5 text-left transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 ${
                        active
                          ? 'border-sky-500 bg-sky-500/10 text-white'
                          : 'border-white/10 bg-[#0D1015] text-slate-300 hover:border-white/25'
                      }`}
                    >
                      <span className="block text-sm font-semibold">{opt.label}</span>
                      <span className="mt-1 block text-xs text-ink-400">{opt.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-white">3. Target Waktu Rilis</p>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {URGENCY_OPTIONS.map((opt) => {
                  const active = urgency === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => onUrgencyChange(opt.id)}
                      className={`rounded-lg border p-3.5 text-left transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 ${
                        active
                          ? 'border-sky-500 bg-[#2563EB] text-white'
                          : 'border-white/10 bg-[#0D1015] text-slate-300 hover:border-white/25'
                      }`}
                    >
                      <span className="block text-sm font-semibold">{opt.label}</span>
                      <span className={`mt-1 block text-xs ${active ? 'text-blue-100' : 'text-ink-400'}`}>
                        {opt.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Live Output Column */}
          <div className="flex flex-col justify-between rounded-xl border border-white/10 bg-[#11151B] p-6 sm:p-8 lg:col-span-5">
            {estimate.isValid ? (
              <div>
                <p className="text-xs font-medium text-ink-400">
                  Perkiraan Investasi & Durasi
                </p>
                <p
                  data-testid="estimate-budget"
                  className="mt-2 font-mono text-2xl font-medium text-white tabular-nums sm:text-3xl"
                >
                  {estimate.formattedBudgetLong}
                </p>
                <p
                  data-testid="estimate-duration"
                  className="mt-1 font-mono text-sm text-sky-400 tabular-nums"
                >
                  Estimasi pengerjaan: {estimate.weeksMin} – {estimate.weeksMax} minggu
                </p>

                {/* Rincian biaya per pilar — transparan, bisa diaudit */}
                <div className="mt-6 border-t border-white/10 pt-5">
                  <p className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                    Rincian Biaya per Pilar
                    <span className="font-mono text-[10px] font-normal text-ink-500">juta rupiah</span>
                  </p>
                  <ul className="mt-3 space-y-3">
                    {estimate.breakdown.map((row) => (
                      <li
                        key={row.pillar}
                        className="rounded-lg border border-white/10 bg-[#0D1015] p-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <p className="min-w-0 text-xs font-semibold text-white">
                            {SERVICE_PILLARS.find((s) => s.id === row.pillar)?.title ?? row.pillar}
                          </p>
                          <p className="shrink-0 font-mono text-xs text-sky-300 tabular-nums">
                            {formatMillionsToWords(row.subtotalMillions)}
                          </p>
                        </div>
                        <ul className="mt-2 space-y-1">
                          {row.components.map((component) => (
                            <li
                              key={component.label}
                              className="flex items-start justify-between gap-3 text-[11px] leading-snug text-ink-400"
                            >
                              <span className="min-w-0">{component.label}</span>
                              <span className="shrink-0 font-mono tabular-nums">
                                {component.amountMillions.toLocaleString('id-ID')}
                              </span>
                            </li>
                          ))}
                          <li className="flex items-start justify-between gap-3 text-[11px] leading-snug text-ink-400">
                            <span className="min-w-0">Personel & rekayasa</span>
                            <span className="shrink-0 font-mono tabular-nums">
                              {row.engineeringMillions.toLocaleString('id-ID')}
                            </span>
                          </li>
                        </ul>
                      </li>
                    ))}
                  </ul>

                  <p className="mt-3 flex items-start gap-1.5 text-[10px] leading-relaxed text-ink-500">
                    <Info className="mt-0.5 h-3 w-3 shrink-0" aria-hidden="true" />
                    <span>
                      Harga komponen mengacu pada pasar Indonesia (mis. gateway LoRaWAN
                      industri IP67 ±Rp 19,8 jt). Durasi dan biaya akhir disesuaikan
                      setelah survei lokasi.
                    </span>
                  </p>
                </div>

                <div className="mt-6 space-y-4 border-t border-white/10 pt-5">
                  <div>
                    <p className="text-xs font-semibold text-slate-200">
                      Komposisi Tim Inti
                    </p>
                    <p className="mt-1 text-sm text-slate-300">{estimate.teamSummary}</p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-slate-200">
                      Luaran Utama (Deliverables)
                    </p>
                    <ul className="mt-2 space-y-2">
                      {estimate.deliverables.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2 text-sm text-slate-300"
                        >
                          <Check
                            className="mt-0.5 h-4 w-4 shrink-0 text-sky-400"
                            aria-hidden="true"
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-slate-200">
                      Rekomendasi Stack Teknis
                    </p>
                    <p className="mt-1 font-mono text-xs leading-relaxed text-ink-400">
                      {estimate.recommendedStack.join(' · ')}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-1 flex-col justify-center py-8 text-center">
                <p className="text-base font-medium text-slate-200">
                  Belum ada pilar dipilih
                </p>
                <p className="mt-2 text-sm text-ink-400">
                  Aktifkan minimal satu pilar rekayasa di sebelah kiri untuk menghitung
                  estimasi durasi dan kebutuhan tim.
                </p>
              </div>
            )}

            <div className="mt-8 border-t border-white/10 pt-5">
              <button
                type="button"
                disabled={!estimate.isValid}
                onClick={handleApplyClick}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white transition-colors duration-150 hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-ink-400 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
              >
                Gunakan Ruang Lingkup Ini
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
