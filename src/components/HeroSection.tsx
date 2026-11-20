import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { HERO_METRICS, STUDIO_PROFILE } from '../data/ycdevData';
import { WhatsAppIcon } from './WhatsAppIcon';

interface HeroSectionProps {
  onConsultClick: () => void;
}

export function HeroSection({ onConsultClick }: HeroSectionProps) {
  return (
    <section
      id="top"
      className="relative z-10 flex min-h-[calc(100vh-68px)] flex-col justify-between border-b border-white/10"
    >
      {/* Subtle directional gradient scrim on the left so text stays WCAG AA crisp over live 3D satellites */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#05070A]/90 via-[#05070A]/55 to-transparent"
      />

      <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-6 pt-16 pb-12 lg:px-10 lg:pt-24">
        <div className="max-w-2xl">
          <div className="flex items-center gap-4">
            <img
              src={STUDIO_PROFILE.logoImage}
              alt="Emblem resmi YcDev"
              referrerPolicy="no-referrer"
              className="h-14 w-14 rounded-full object-cover ring-1 ring-sky-400/40 shadow-lg"
            />
            <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-medium text-slate-300">
              <span className="whitespace-nowrap">{STUDIO_PROFILE.addressLine}</span>
              <span aria-hidden="true" className="text-slate-500">
                ·
              </span>
              <span className="whitespace-nowrap">
                Pendiri: {STUDIO_PROFILE.founder}
              </span>
            </p>
          </div>

          <h1
            className="mt-7 font-display font-bold tracking-tight text-white text-balance"
            style={{ fontSize: 'clamp(2.5rem, 4.8vw, 4.25rem)', lineHeight: 1.05 }}
          >
            Arsitektur IoT, Full-Stack & Keamanan Siber Skala Misi Kritis
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-200 lg:text-lg">
            YcDev membangun sistem telemetri orbital dan industri, aplikasi web
            full-stack berkinerja tinggi, serta pertahanan siber Zero-Trust dari
            laboratorium rekayasa di Semarang Barat.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href="#lab-3d"
              className="inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-6 py-3.5 text-sm font-semibold text-white transition-colors duration-150 hover:bg-[#1D4ED8] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
            >
              Eksplorasi Multi-3D Lab
              <ArrowDown className="h-4 w-4" aria-hidden="true" />
            </a>

            <a
              href={STUDIO_PROFILE.whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-emerald-400/45 bg-[#15803D] px-5 py-3.5 text-sm font-bold text-white transition-all duration-150 hover:bg-[#16A34A] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
            >
              <WhatsAppIcon className="h-4 w-4 shrink-0" />
              <span>Hubungi Kami</span>
            </a>

            <button
              type="button"
              onClick={onConsultClick}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-[#0B1018]/85 px-5 py-3.5 text-sm font-semibold text-white transition-colors duration-150 hover:border-sky-400/60 hover:bg-[#101826] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
            >
              Jadwalkan Konsultasi
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* Full-width SpaceX-style quantitative telemetry strip anchored at bottom of hero */}
      <div className="relative border-t border-white/10 bg-[#05070A]/85">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 pt-7 pb-20 sm:grid-cols-2 sm:pb-8 lg:grid-cols-4 lg:px-10 lg:pr-72 2xl:pr-10">
          {HERO_METRICS.map((metric) => (
            <div key={metric.label} className="space-y-1">
              <p className="font-mono text-2xl font-medium tracking-tight text-white tabular-nums lg:text-3xl">
                {metric.value}
              </p>
              <p className="text-sm font-semibold text-slate-200">{metric.label}</p>
              <p className="text-xs text-slate-400">{metric.context}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
