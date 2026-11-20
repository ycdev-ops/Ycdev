import { useEffect, useState } from 'react';
import { ArrowUpRight, Layers, X } from 'lucide-react';
import {
  CASE_STUDIES,
  type CaseStudy,
  type DomainFilter,
} from '../data/ycdevData';
import { filterItemsByDiscipline } from '../utils/projectEstimator';
import { ResilientImage } from './ResilientImage';

const FILTER_OPTIONS: { id: DomainFilter; label: string }[] = [
  { id: 'all', label: 'Semua' },
  { id: 'iot', label: 'IoT' },
  { id: 'fullstack', label: 'Full-Stack' },
  { id: 'cybersecurity', label: 'Cybersecurity' },
  { id: 'software', label: 'Software Engineering' },
];

export function CaseStudiesSection() {
  const [activeFilter, setActiveFilter] = useState<DomainFilter>('all');
  const [selectedStudy, setSelectedStudy] = useState<CaseStudy | null>(null);

  const visibleStudies = filterItemsByDiscipline(CASE_STUDIES, activeFilter);

  useEffect(() => {
    if (!selectedStudy) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedStudy(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedStudy]);

  return (
    <section
      id="studi-kasus"
      className="relative z-10 border-b border-white/10 bg-[#070A0F]/95 py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs font-medium tracking-wide text-sky-400">
              Bukti Implementasi
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-white text-balance lg:text-4xl">
              Studi Kasus & Dampak Terukur
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <span className="font-mono text-xs text-slate-400 tabular-nums">
              Menampilkan {visibleStudies.length} dari {CASE_STUDIES.length} proyek
            </span>

            <div
              role="group"
              aria-label="Filter studi kasus berdasarkan disiplin"
              className="flex flex-wrap items-center gap-1 rounded-lg border border-white/10 bg-[#11151B] p-1"
            >
              {FILTER_OPTIONS.map((option) => {
                const isActive = activeFilter === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setActiveFilter(option.id)}
                    className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 ${
                      isActive
                        ? 'bg-[#2563EB] text-white'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
          {visibleStudies.map((study) => (
            <article
              key={study.id}
              className="flex flex-col justify-between overflow-hidden rounded-xl border border-white/10 bg-[#11151B]"
            >
              {study.imageUrl ? (
                <div className="aspect-[4/3] w-full overflow-hidden border-b border-white/10 bg-[#0D1015]">
                  <ResilientImage
                    src={study.imageUrl}
                    alt={study.imageAlt ?? study.title}
                    fallbackTitle={study.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex aspect-[4/3] w-full flex-col justify-between border-b border-white/10 bg-gradient-to-br from-[#131922] via-[#0F141C] to-[#0B0E14] p-6 sm:p-8">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-mono text-sky-400">{study.disciplineLabel}</span>
                    <Layers className="h-4 w-4 text-slate-500" aria-hidden="true" />
                  </div>
                  <div className="space-y-3">
                    <p className="font-mono text-xs text-slate-400">
                      Ringkasan Topologi Sistem
                    </p>
                    <ul className="space-y-2 border-t border-white/10 pt-3">
                      {study.architectureNotes.slice(0, 2).map((note) => (
                        <li key={note} className="text-sm text-slate-300">
                          {note}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p className="font-mono text-xs text-slate-400">
                    {study.stack.join(' · ')}
                  </p>
                </div>
              )}

              <div className="flex flex-1 flex-col justify-between p-6 sm:p-8">
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                    <span>{study.disciplineLabel}</span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">{study.year}</span>
                    <span aria-hidden="true">·</span>
                    <span>{study.clientSector}</span>
                  </div>

                  <h3 className="mt-3 font-display text-xl font-semibold tracking-tight text-white">
                    {study.title}
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-slate-300">
                    {study.summary}
                  </p>
                </div>

                <div className="mt-6 border-t border-white/10 pt-5">
                  <p className="font-mono text-sm font-medium text-sky-300 tabular-nums">
                    {study.impactMetric}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">{study.impactContext}</p>

                  <div className="mt-5 flex items-center justify-between gap-4">
                    <p className="truncate font-mono text-xs text-slate-400">
                      {study.stack.join(' · ')}
                    </p>
                    <button
                      type="button"
                      onClick={() => setSelectedStudy(study)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-white transition-colors hover:text-sky-400 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400"
                    >
                      Lihat Arsitektur
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Case Study Architecture Modal */}
      {selectedStudy && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="case-study-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
          onClick={() => setSelectedStudy(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-white/15 bg-[#11151B] p-6 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs text-slate-400">
                  {selectedStudy.disciplineLabel} · {selectedStudy.year} ·{' '}
                  {selectedStudy.clientSector}
                </p>
                <h3
                  id="case-study-modal-title"
                  className="mt-2 font-display text-2xl font-bold text-white"
                >
                  {selectedStudy.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedStudy(null)}
                aria-label="Tutup detail arsitektur"
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/15 text-slate-300 hover:bg-white/5 hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-slate-300">
              {selectedStudy.summary}
            </p>

            <div className="mt-6 rounded-lg border border-white/10 bg-[#0D1015] p-4">
              <p className="font-mono text-sm font-medium text-sky-300 tabular-nums">
                {selectedStudy.impactMetric}
              </p>
              <p className="mt-1 text-xs text-slate-400">{selectedStudy.impactContext}</p>
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-semibold text-white">
                Catatan Implementasi & Arsitektur
              </h4>
              <ul className="mt-3 space-y-2.5">
                {selectedStudy.architectureNotes.map((note) => (
                  <li
                    key={note}
                    className="border-b border-white/10 pb-2.5 text-sm text-slate-300 last:border-b-0"
                  >
                    {note}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5">
              <p className="font-mono text-xs text-slate-400">
                Stack: {selectedStudy.stack.join(' · ')}
              </p>
              <button
                type="button"
                onClick={() => setSelectedStudy(null)}
                className="rounded-lg bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1D4ED8] cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
