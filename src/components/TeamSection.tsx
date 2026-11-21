import { useState } from 'react';
import { ArrowUpRight, Globe2, MapPin } from 'lucide-react';
import {
  TEAM_BRIEFING_SHOWCASE,
  YCDEV_TEAM_MEMBERS,
  filterTeamMembers,
  formatTeamConsultationScope,
  type TeamRegionFilter,
} from '../utils/teamCatalog';
import { ResilientImage } from './ResilientImage';

interface TeamSectionProps {
  onConsultTeamMember: (scopeSummary: string) => void;
}

const TEAM_FILTERS: { id: TeamRegionFilter; label: string }[] = [
  { id: 'all', label: `Semua Tim (${YCDEV_TEAM_MEMBERS.length})` },
  {
    id: 'indonesia',
    label: `Tim Inti Indonesia (${filterTeamMembers(YCDEV_TEAM_MEMBERS, 'indonesia').length})`,
  },
  {
    id: 'international',
    label: `Tim Internasional (${filterTeamMembers(YCDEV_TEAM_MEMBERS, 'international').length})`,
  },
];

export function TeamSection({ onConsultTeamMember }: TeamSectionProps) {
  const [regionFilter, setRegionFilter] = useState<TeamRegionFilter>('all');

  const visibleMembers = filterTeamMembers(YCDEV_TEAM_MEMBERS, regionFilter);
  const coreIndonesia = visibleMembers.filter((m) => m.regionGroup === 'indonesia');
  const internationalSpecs = visibleMembers.filter((m) => m.regionGroup === 'international');

  const renderMemberCard = (member: (typeof YCDEV_TEAM_MEMBERS)[number], aspectClass: string) => (
    <article
      key={member.id}
      className="flex flex-col justify-between overflow-hidden rounded-xl border border-white/10 bg-[#0B1018] transition-colors hover:border-sky-400/40"
    >
      <div>
        <div className={`relative ${aspectClass} w-full overflow-hidden bg-[#080C13]`}>
          <ResilientImage
            src={member.imageUrl}
            alt={member.imageAlt}
            fallbackTitle={member.name}
            className="h-full w-full object-cover object-top"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0B1018] via-[#0B1018]/60 to-transparent"
          />
          <div className="absolute inset-x-4 bottom-3 flex items-center justify-between gap-2 text-xs text-slate-100">
            <span className="inline-flex min-w-0 items-center gap-1.5 font-medium">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-sky-400" aria-hidden="true" />
              <span className="truncate">{member.location}</span>
            </span>
            <span className="shrink-0 font-mono font-semibold text-sky-300 tabular-nums">
              {member.countryCode} · {member.experienceYears}
            </span>
          </div>
        </div>

        <div className="p-5">
          <p className="text-xs font-semibold text-sky-400">{member.role}</p>
          <h3 className="mt-1 font-display text-lg font-bold tracking-tight text-white">
            {member.name}
          </h3>
          <p className="mt-0.5 text-xs text-ink-400">{member.division}</p>

          <p className="mt-3 text-xs leading-relaxed text-slate-300">{member.bio}</p>

          <p className="mt-4 border-t border-white/10 pt-3 font-mono text-[11px] text-ink-400">
            {member.specialties.join(' · ')}
          </p>
        </div>
      </div>

      <div className="px-5 pb-5">
        <button
          type="button"
          onClick={() => onConsultTeamMember(formatTeamConsultationScope(member))}
          className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-white/15 bg-[#080C13] px-3.5 py-2 text-xs font-semibold text-slate-200 transition-colors hover:border-sky-400/50 hover:text-white whitespace-nowrap cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
        >
          <span>Konsultasi Bidang Ini</span>
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>
    </article>
  );

  return (
    <section
      id="tim-ycdev"
      className="relative z-10 border-b border-white/10 bg-[#070A0F]/95 py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Section Header & Region Filter */}
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-medium tracking-wide text-sky-400">
              Struktur Rekayasa & Operasi Global
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-white text-balance lg:text-4xl">
              Team YcDev: Analis, Optic IoT, Satelit Radar & Spesialis Internasional
            </h2>
          </div>

          <div
            role="group"
            aria-label="Filter wilayah tim YcDev"
            className="flex flex-wrap items-center gap-1 self-start rounded-lg border border-white/10 bg-[#0B1018] p-1 lg:self-auto"
          >
            {TEAM_FILTERS.map((filter) => (
              <button
                key={filter.id}
                type="button"
                aria-pressed={regionFilter === filter.id}
                onClick={() => setRegionFilter(filter.id)}
                className={`rounded-md px-3.5 py-2 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  regionFilter === filter.id
                    ? 'bg-[#2563EB] text-white'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Command Briefing Feature Showcase */}
        <div className="mt-10 overflow-hidden rounded-2xl border border-white/10 bg-[#0B1018]">
          <div className="grid grid-cols-1 items-stretch lg:grid-cols-12">
            <div className="relative aspect-[4/3] overflow-hidden bg-[#080C13] lg:col-span-5 lg:aspect-auto lg:h-[340px]">
              <ResilientImage
                src={TEAM_BRIEFING_SHOWCASE.imageUrl}
                alt={TEAM_BRIEFING_SHOWCASE.imageAlt}
                fallbackTitle="Briefing Tim Operasi YcDev"
                className="h-full w-full object-cover object-[center_42%]"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0B1018]/90 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-[#0B1018]/80"
              />
            </div>

            <div className="flex flex-col justify-between p-6 sm:p-8 lg:col-span-7">
              <div>
                <p className="inline-flex items-center gap-2 font-mono text-xs font-medium text-sky-400">
                  <Globe2 className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{TEAM_BRIEFING_SHOWCASE.eyebrow}</span>
                </p>
                <h3 className="mt-2 font-display text-2xl font-bold tracking-tight text-white text-balance">
                  {TEAM_BRIEFING_SHOWCASE.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">
                  {TEAM_BRIEFING_SHOWCASE.summary}
                </p>
              </div>

              <dl className="mt-6 grid grid-cols-1 gap-5 border-t border-white/10 pt-5 sm:grid-cols-3">
                {TEAM_BRIEFING_SHOWCASE.highlights.map((item) => (
                  <div key={item.label}>
                    <dt className="text-xs text-ink-400">{item.label}</dt>
                    <dd className="mt-1 font-mono text-sm font-bold text-white tabular-nums">
                      {item.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>

        {/* Team Member Grids */}
        <div data-testid="ycdev-team-grid" className="mt-10 space-y-10">
          {coreIndonesia.length > 0 && (
            <div>
              <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2 border-b border-white/10 pb-2.5">
                <h3 className="font-display text-base font-semibold tracking-tight text-white">
                  Tim Inti Indonesia — Semarang Barat & NOC Laut Jawa
                </h3>
                <span className="font-mono text-xs text-sky-400 tabular-nums">
                  {coreIndonesia.length} Spesialis Utama
                </span>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {coreIndonesia.map((member) => renderMemberCard(member, 'aspect-square'))}
              </div>
            </div>
          )}

          {internationalSpecs.length > 0 && (
            <div>
              <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2 border-b border-white/10 pb-2.5">
                <h3 className="font-display text-base font-semibold tracking-tight text-white">
                  Tim Spesialis Internasional — Hub Teknik Lintas Negara
                </h3>
                <span className="font-mono text-xs text-sky-400 tabular-nums">
                  {internationalSpecs.length} Spesialis Global (JP · NL · DE · US)
                </span>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
                {internationalSpecs.map((member) => renderMemberCard(member, 'aspect-[3/4]'))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
