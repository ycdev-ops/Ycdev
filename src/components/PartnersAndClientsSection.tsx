import { useState } from 'react';
import { ArrowRight, Building2, Globe2, Quote } from 'lucide-react';
import {
  ENTERPRISE_CUSTOMERS,
  GLOBAL_PARTNERS,
  filterEnterpriseCustomers,
  formatCustomerInquiryScope,
  type CustomerSectorFilter,
} from '../utils/credentialsCatalog';
import { BrandLogo } from './BrandLogo';
import { ResilientImage } from './ResilientImage';

interface PartnersAndClientsSectionProps {
  onSelectCustomerReference: (scopeSummary: string) => void;
}

const SECTOR_FILTERS: { id: CustomerSectorFilter; label: string }[] = [
  { id: 'all', label: 'Semua Klien (6)' },
  { id: 'pelindo', label: 'Instansi Pelindo' },
  { id: 'pemerintah', label: 'Instansi Pemerintah' },
  { id: 'tesla', label: 'Tesla Ecosystem' },
  { id: 'global', label: 'Perusahaan Luar Negeri (3)' },
];

export function PartnersAndClientsSection({
  onSelectCustomerReference,
}: PartnersAndClientsSectionProps) {
  const [sectorFilter, setSectorFilter] = useState<CustomerSectorFilter>('all');

  const visibleCustomers = filterEnterpriseCustomers(ENTERPRISE_CUSTOMERS, sectorFilter);

  return (
    <section
      id="klien-partner"
      className="relative z-10 scroll-mt-20 border-b border-white/10 bg-[#05070A]/95 py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Global Technology & Ecosystem Partners */}
        <div id="partner-global" className="scroll-mt-24">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="text-xs font-medium tracking-wide text-sky-400">
                Ekosistem Teknologi Global
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-white text-balance lg:text-4xl">
                Partner Perusahaan Dunia & Infrastruktur Strategis
              </h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-slate-400">
              Kolaborasi teknis bersama penyedia satelit orbit rendah, komputasi AI tepi,
              perangkat jaringan kelas operator, serta keamanan cloud internasional.
            </p>
          </div>

          <div
            data-testid="global-partners-grid"
            className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            {GLOBAL_PARTNERS.map((partner) => (
              <div
                key={partner.id}
                className="flex flex-col justify-between rounded-xl border border-white/10 bg-[#0B1018] p-5 transition-colors hover:border-sky-500/40"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3.5">
                    <BrandLogo id={partner.id} className="h-9 w-9 shrink-0" />
                    <Globe2 className="h-4 w-4 shrink-0 text-slate-500" aria-hidden="true" />
                  </div>
                  <h3 className="mt-3.5 font-display text-sm font-bold text-white">
                    {partner.name}
                  </h3>
                  <p className="mt-0.5 text-xs font-medium text-sky-400">
                    {partner.category}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-slate-400">
                    {partner.collaborationScope}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Verified Enterprise & Government Customer Experiences */}
        <div className="mt-20 border-t border-white/10 pt-16">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <p className="text-xs font-medium tracking-wide text-sky-400">
                Pengalaman Klien & Implementasi Nyata
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-white text-balance lg:text-4xl">
                Dipercaya Instansi Pelindo, Pemerintah, Tesla & Perusahaan Luar Negeri
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                Rekam jejak pengerjaan sistem telemetri pelabuhan, kepatuhan VMS pemerintah,
                keamanan energi EV, hingga armada kapal niaga lintas Jepang, Singapura, dan Eropa.
              </p>
            </div>

            <div
              role="tablist"
              aria-label="Filter pengalaman customer YcDev"
              className="flex flex-wrap gap-2"
            >
              {SECTOR_FILTERS.map((tab) => {
                const selected = sectorFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    onClick={() => setSectorFilter(tab.id)}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 ${
                      selected
                        ? 'border-sky-500 bg-[#2563EB] text-white'
                        : 'border-white/10 bg-[#0B1018] text-slate-300 hover:border-white/25 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div
            data-testid="enterprise-customers-grid"
            className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2"
          >
            {visibleCustomers.map((customer) => (
              <article
                key={customer.id}
                className="flex flex-col justify-between overflow-hidden rounded-xl border border-white/10 bg-[#0C1119]"
              >
                {/* Authentic Field & Operational Customer Photography */}
                <div className="relative aspect-[4/3] w-full overflow-hidden border-b border-white/10 bg-[#070B11]">
                  <ResilientImage
                    src={customer.imageUrl}
                    alt={customer.imageAlt}
                    fallbackTitle={customer.organization}
                    className="h-full w-full object-cover"
                  />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#070A0F] via-[#070A0F]/65 to-transparent px-5 pt-10 pb-3.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <BrandLogo id={customer.id} className="h-7 w-7 shrink-0" />
                      <span className="font-mono text-[11px] font-medium text-slate-200">
                        Proyek Terverifikasi · {customer.region}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-1 flex-col justify-between p-6 sm:p-7">
                  <div>
                    <div className="flex items-center gap-1.5 font-mono text-xs text-sky-400">
                      <Building2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      <span>{customer.sectorLabel}</span>
                    </div>

                    <h3 className="mt-2 font-display text-xl font-bold text-white">
                      {customer.organization}
                    </h3>
                    <p className="mt-1 text-sm font-medium text-slate-200">
                      {customer.projectTitle}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-slate-400">
                      {customer.scopeSummary}
                    </p>

                    <div className="mt-4 rounded-lg border border-white/10 bg-[#080C12] p-4">
                      <p className="font-mono text-xs font-semibold text-sky-300 tabular-nums">
                        Dampak Terukur: {customer.impactMetric}
                      </p>
                      <blockquote className="mt-2.5 flex items-start gap-2 text-xs italic leading-relaxed text-slate-300">
                        <Quote
                          className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sky-400"
                          aria-hidden="true"
                        />
                        <span>“{customer.testimonialQuote}”</span>
                      </blockquote>
                      <p className="mt-2 text-[11px] font-medium text-slate-400">
                        — {customer.spokesperson}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
                    <p className="font-mono text-[11px] text-slate-400">
                      {customer.stackTags.join(' · ')}
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        onSelectCustomerReference(formatCustomerInquiryScope(customer))
                      }
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-400 hover:text-sky-300 whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      Konsultasi Pola Serupa
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
