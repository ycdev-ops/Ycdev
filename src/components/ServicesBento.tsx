import { ArrowRight, Check } from 'lucide-react';
import { SERVICE_PILLARS, type DisciplineId } from '../data/ycdevData';

interface ServicesBentoProps {
  selectedDisciplines: DisciplineId[];
  onSelectForEstimate: (discipline: DisciplineId) => void;
}

export function ServicesBento({
  selectedDisciplines,
  onSelectForEstimate,
}: ServicesBentoProps) {
  return (
    <section
      id="layanan"
      className="relative z-10 border-b border-white/10 bg-[#05070A]/95 py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-medium tracking-wide text-sky-400">
              Kapabilitas Inti Studio
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-white text-balance lg:text-4xl">
              Empat Disiplin Rekayasa dalam Satu Tim Terpadu
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-slate-400">
            Menghilangkan celah koordinasi antara tim firmware, pengembang aplikasi, dan
            auditor keamanan sejak hari pertama perancangan.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {SERVICE_PILLARS.map((service) => {
            const isSelected = selectedDisciplines.includes(service.id);

            return (
              <article
                key={service.id}
                className={`flex flex-col justify-between rounded-xl border bg-[#11151B] p-6 sm:p-8 transition-colors duration-150 ${service.spanClass} ${
                  isSelected
                    ? 'border-sky-500/70 bg-[#131A24]'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                <div>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="font-mono text-sm font-medium text-sky-400 tabular-nums">
                      {service.indexLabel}
                    </span>
                    <span className="text-xs text-slate-400">{service.subtitle}</span>
                  </div>

                  <h3 className="mt-4 font-display text-xl font-semibold tracking-tight text-white lg:text-2xl">
                    {service.title}
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-slate-300 lg:text-base">
                    {service.description}
                  </p>

                  <ul className="mt-6 space-y-2.5 border-t border-white/10 pt-5">
                    {service.deliverables.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2.5 text-sm text-slate-300"
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

                <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5">
                  <p className="font-mono text-xs text-slate-400">{service.stackLabel}</p>

                  <button
                    type="button"
                    onClick={() => onSelectForEstimate(service.id)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-400 transition-colors duration-150 hover:text-sky-300 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400"
                  >
                    {isSelected ? 'Sudah di Estimator' : 'Hitung di Estimator'}
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
