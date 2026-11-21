import { ArrowRight, Check } from 'lucide-react';
import { SERVICE_PILLARS, type DisciplineId } from '../data/ycdevData';
import {
  calculateProjectEstimate,
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
  { id: 'mvp', label: 'Prototype / MVP', desc: 'Validasi cepat 1 modul inti' },
  { id: 'production', label: 'Sistem Produksi', desc: 'Siap operasional harian & SLA' },
  { id: 'enterprise', label: 'Skala Enterprise', desc: 'Multi-lokasi & integrasi kompleks' },
];

const URGENCY_OPTIONS: { id: TimelineUrgency; label: string }[] = [
  { id: 'standard', label: 'Ritme Standar' },
  { id: 'accelerated', label: 'Akselerasi Cepat' },
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
      `${disciplineNames} (${scaleLabel}, ${urgencyLabel}) — Estimasi ${estimate.weeksMin}–${estimate.weeksMax} minggu (${estimate.formattedBudget})`
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
            Kalkulator Estimasi Arsitektur & Durasi
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-400">
            Kombinasikan disiplin rekayasa yang dibutuhkan untuk mendapatkan perkiraan
            timeline sprint, komposisi tim, serta kisaran anggaran proyek sebelum diskusi teknis.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Controls Column */}
          <div className="space-y-8 rounded-xl border border-white/10 bg-[#11151B] p-6 sm:p-8 lg:col-span-7">
            <div>
              <p className="text-sm font-semibold text-white">
                1. Pilih Disiplin Rekayasa
              </p>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {SERVICE_PILLARS.map((pillar) => {
                  const active = selectedDisciplines.includes(pillar.id);
                  return (
                    <button
                      key={pillar.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => onToggleDiscipline(pillar.id)}
                      className={`flex items-center justify-between gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 ${
                        active
                          ? 'border-sky-500 bg-sky-500/10 text-white'
                          : 'border-white/10 bg-[#0D1015] text-slate-300 hover:border-white/25'
                      }`}
                    >
                      <span className="font-medium">{pillar.title}</span>
                      <span
                        aria-hidden="true"
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
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
              <div className="mt-3 inline-flex rounded-lg border border-white/10 bg-[#0D1015] p-1">
                {URGENCY_OPTIONS.map((opt) => {
                  const active = urgency === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => onUrgencyChange(opt.id)}
                      className={`rounded-md px-4 py-2 text-xs font-medium transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 ${
                        active
                          ? 'bg-[#2563EB] text-white'
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      {opt.label}
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
                  {estimate.formattedBudget}
                </p>
                <p
                  data-testid="estimate-duration"
                  className="mt-1 font-mono text-sm text-sky-400 tabular-nums"
                >
                  Estimasi pengerjaan: {estimate.weeksMin} – {estimate.weeksMax} minggu
                </p>

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
                  Belum ada disiplin dipilih
                </p>
                <p className="mt-2 text-sm text-ink-400">
                  Aktifkan minimal satu disiplin rekayasa di sebelah kiri untuk menghitung
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
