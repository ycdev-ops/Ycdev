import { useEffect, useRef, useState } from 'react';
import {
  Award,
  Boxes,
  ChevronDown,
  Cpu,
  Globe2,
  Lock,
  MapPin,
  Menu,
  Scan,
  Users,
  X,
} from 'lucide-react';
import { STUDIO_PROFILE } from '../data/ycdevData';
import { MARITIME_CATEGORIES, MARITIME_SOLUTIONS } from '../utils/maritimeCatalog';
import { WhatsAppIcon } from './WhatsAppIcon';
import { assetUrl } from '../utils/siteAssets';

interface NavbarProps {
  onConsultClick: () => void;
  onSelectProduct: (productId: string) => void;
}

const NAV_LINKS = [
  { href: '#lab-3d', label: '3D Lab', icon: Cpu },
  { href: '#profil-pendiri', label: 'Profil Pendiri', icon: Award },
  { href: '#tim-ycdev', label: 'Tim', icon: Users },
  { href: '#klien-partner', label: 'Klien', icon: Globe2 },
  { href: '#portal-klien', label: 'Portal Klien', icon: Lock },
  { href: '#lokasi-3d', label: 'Peta 3D', icon: MapPin },
] as const;

/** Indeks section yang dilacak scroll-spy (sama dengan NAV_LINKS). */
const SPY_IDS = NAV_LINKS.map((l) => l.href.slice(1));

export function Navbar({ onConsultClick, onSelectProduct }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [productMenuOpen, setProductMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const [scrolled, setScrolled] = useState(false);
  const railRef = useRef<HTMLDivElement | null>(null);
  const [indicator, setIndicator] = useState<{ x: number; w: number } | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Scroll-spy: tandai link aktif + ukur posisi indikator mengikuti gulir.
  useEffect(() => {
    const measure = () => {
      setScrolled(window.scrollY > 12);
      const probe = window.scrollY + window.innerHeight * 0.32;
      let current = '';
      for (const id of SPY_IDS) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.offsetTop <= probe) current = id;
      }
      setActiveSection(current);

      const rail = railRef.current;
      if (!rail) return;
      const target = rail.querySelector<HTMLElement>(
        `[data-spy-link="${current}"]`
      );
      setIndicator(
        target ? { x: target.offsetLeft - 4, w: target.offsetWidth } : null
      );
    };
    measure();
    window.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure);
    return () => {
      window.removeEventListener('scroll', measure);
      window.removeEventListener('resize', measure);
    };
  }, []);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProductMenuOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setProductMenuOpen(false);
        setMobileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  const handleLinkClick = () => {
    setMobileOpen(false);
    setProductMenuOpen(false);
  };

  const handleCtaClick = () => {
    setMobileOpen(false);
    setProductMenuOpen(false);
    onConsultClick();
  };

  const handleProductPick = (productId: string) => {
    setProductMenuOpen(false);
    setMobileOpen(false);
    onSelectProduct(productId);
  };

  return (
    <header className="sticky top-0 z-40 px-3 pt-2.5 sm:px-6">
      {/* Floating Command Dock */}
      <div
        className={`relative mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-2xl border px-4 py-2.5 backdrop-blur-xl transition-all duration-300 lg:px-5 ${
          scrolled
            ? 'border-sky-400/40 bg-[#060A12]/95 shadow-[0_14px_40px_-12px_rgba(14,165,233,0.38)]'
            : 'border-sky-400/20 bg-[#060A12]/80 shadow-[0_8px_28px_-14px_rgba(14,165,233,0.24)]'
        }`}
      >
        {/* Garis horison atas */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-sky-400/80 to-transparent"
        />
        {/* Cahaya sudut */}
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute -top-px left-6 h-px w-16 bg-gradient-to-r from-transparent via-sky-300/90 to-transparent transition-opacity duration-500 ${
            scrolled ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Brand */}
        <a
          href="#top"
          className="group relative inline-flex items-center gap-3 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400"
        >
          <span className="relative inline-flex rounded-full p-0.5 ring-1 ring-sky-400/50 transition-all duration-300 group-hover:ring-sky-300 group-hover:shadow-[0_0_18px_-2px_rgba(56,189,248,0.6)]">
            <img
              src={assetUrl(STUDIO_PROFILE.logoImage)}
              alt="Logo YcDev"
              referrerPolicy="no-referrer"
              className="h-9 w-9 rounded-full object-cover"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-full border border-sky-300/0 transition-all duration-300 group-hover:border-sky-300/40"
            />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-lg font-extrabold tracking-tight text-white">
              {STUDIO_PROFILE.brandName}
            </span>
            <span className="mt-0.5 hidden font-mono text-[10px] font-medium tracking-wider text-sky-400 uppercase sm:block">
              IoT · Cyber · Semarang
            </span>
          </span>
        </a>

        {/* Command rail desktop */}
        <nav
          aria-label="Navigasi utama"
          ref={railRef}
          className="relative hidden items-center gap-1 rounded-xl border border-white/10 bg-[#0B121F] p-1 lg:flex"
        >
          {/* Indikator aktif melayang */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-1 rounded-lg bg-gradient-to-r from-sky-500/25 to-sky-400/5 transition-all duration-300"
            style={{
              width: indicator ? `${indicator.w}px` : '0px',
              transform: `translateX(${indicator ? indicator.x : 0}px)`,
              opacity: indicator ? 1 : 0,
            }}
          />

          <div ref={dropdownRef} className="relative">
            <button
              type="button"
              aria-expanded={productMenuOpen}
              aria-haspopup="true"
              onClick={() => setProductMenuOpen((prev) => !prev)}
              className={`relative inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 ${
                productMenuOpen
                  ? 'bg-[#1A73E8] text-white shadow-[0_0_18px_-4px_rgba(26,115,232,0.7)]'
                  : 'text-slate-100 hover:bg-sky-500/15 hover:text-white'
              }`}
            >
              <Boxes className="h-3.5 w-3.5 text-sky-400" aria-hidden="true" />
              <span>Produk</span>
              <span className="rounded bg-sky-500/20 px-1.5 py-0.5 font-mono text-[10px] text-sky-300 tabular-nums">
                12
              </span>
              <ChevronDown
                className={`h-3.5 w-3.5 text-sky-300 transition-transform duration-200 ${
                  productMenuOpen ? 'rotate-180' : ''
                }`}
                aria-hidden="true"
              />
            </button>

            {productMenuOpen && (
              <div
                role="menu"
                aria-label="Daftar produk perangkat keras, platform software, dan layanan maritim"
                className="absolute left-1/2 top-full z-50 mt-4 w-[800px] max-w-[92vw] -translate-x-1/2 overflow-hidden rounded-2xl border border-sky-400/25 bg-[#080D16] p-6 shadow-2xl"
              >
                <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3.5">
                  <div>
                    <p className="font-mono text-[11px] font-semibold text-sky-400">
                      KATALOG MARITIM & REKAYASA YcDev
                    </p>
                    <p className="mt-0.5 font-display text-base font-bold text-white">
                      12 Solusi Perangkat Keras IP67, Platform Cloud & Layanan NOC
                    </p>
                  </div>
                  <a
                    href="#solusi-maritim"
                    onClick={handleLinkClick}
                    className="rounded-lg border border-sky-400/30 bg-sky-500/10 px-3 py-1.5 text-xs font-semibold text-sky-300 hover:bg-sky-500/20 whitespace-nowrap"
                  >
                    Lihat Semua (12) →
                  </a>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  {MARITIME_CATEGORIES.map((cat) => {
                    const items = MARITIME_SOLUTIONS.filter((s) => s.category === cat.id);
                    return (
                      <div key={cat.id}>
                        <p className="font-mono text-[11px] font-semibold text-sky-400 tabular-nums">
                          {cat.stepNumber}. {cat.shortLabel}
                        </p>
                        <ul className="mt-2.5 space-y-1.5">
                          {items.map((prod) => (
                            <li key={prod.id}>
                              <button
                                type="button"
                                role="menuitem"
                                onClick={() => handleProductPick(prod.id)}
                                className="w-full rounded-lg border border-transparent px-2.5 py-1.5 text-left transition-colors hover:border-sky-400/25 hover:bg-white/5 cursor-pointer"
                              >
                                <span className="block text-xs font-semibold text-white">
                                  {prod.name}
                                </span>
                                <span className="block truncate text-[11px] text-ink-400">
                                  {prod.protocolOrStandard}
                                </span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
                  <p className="font-mono text-[11px] text-ink-400">
                    Butuh spesifikasi kustom kapal atau integrasi API pelabuhan?
                  </p>
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={handleCtaClick}
                      className="rounded-lg border border-white/15 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-white/10 cursor-pointer"
                    >
                      Isi Brief Proyek
                    </button>
                    <a
                      href={STUDIO_PROFILE.whatsappHref}
                      target="_blank"
                      rel="noreferrer"
                      onClick={handleLinkClick}
                      className="inline-flex items-center gap-2 rounded-lg bg-[#16A34A] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#15803D] whitespace-nowrap"
                    >
                      <WhatsAppIcon className="h-4 w-4 shrink-0" />
                      <span>Hubungi Kami</span>
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>

          {NAV_LINKS.map((link) => {
            const Icon = link.icon;
            const isActive = activeSection === link.href.slice(1);
            return (
              <a
                key={link.href}
                href={link.href}
                data-spy-link={link.href.slice(1)}
                aria-current={isActive ? 'true' : undefined}
                className={`relative inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 ${
                  isActive ? 'text-white' : 'text-slate-300 hover:text-white'
                }`}
              >
                <Icon
                  className={`h-3.5 w-3.5 transition-all duration-200 ${
                    isActive
                      ? 'text-sky-300 drop-shadow-[0_0_6px_rgba(56,189,248,0.8)]'
                      : 'text-sky-400/70'
                  }`}
                  aria-hidden="true"
                />
                <span>{link.label}</span>
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-3 -bottom-px h-px bg-gradient-to-r from-transparent via-sky-300/90 to-transparent transition-all duration-300 ${
                    isActive ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-50'
                  }`}
                />
              </a>
            );
          })}
        </nav>

        {/* Action pod */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleCtaClick}
            className="hidden xl:inline-flex items-center justify-center rounded-xl border border-white/15 bg-[#0D1422] px-3.5 py-2 text-xs font-semibold text-slate-200 transition-all duration-200 hover:border-sky-400/50 hover:text-white whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
          >
            Brief Proyek
          </button>

          <a
            href={STUDIO_PROFILE.whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-2 rounded-xl border border-emerald-400/50 bg-gradient-to-r from-[#0F7641] via-[#15803D] to-[#16A34A] px-3.5 py-2 text-xs font-bold text-white shadow-[0_0_24px_-4px_rgba(37,211,102,0.5)] transition-all duration-200 hover:brightness-110 hover:shadow-[0_0_32px_-4px_rgba(37,211,102,0.75)] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
          >
            <WhatsAppIcon className="h-4 w-4 shrink-0" />
            <span>Hubungi Kami</span>
          </a>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
            className="relative inline-flex lg:hidden h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-white/15 bg-[#0B121F] text-slate-200 transition-colors hover:bg-white/10 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
          >
            <Scan
              className={`absolute h-4 w-4 text-sky-400 transition-all duration-300 ${
                scrolled ? 'opacity-60' : 'opacity-0'
              }`}
              aria-hidden="true"
            />
            <span className="relative inline-flex h-5 w-5 items-center justify-center">
              <Menu
                className={`absolute h-5 w-5 transition-all duration-300 ${
                  mobileOpen ? 'rotate-90 opacity-0 scale-50' : 'rotate-0 opacity-100 scale-100'
                }`}
              />
              <X
                className={`absolute h-5 w-5 transition-all duration-300 ${
                  mobileOpen ? 'rotate-0 opacity-100 scale-100' : '-rotate-90 opacity-0 scale-50'
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        id="mobile-navigation"
        className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-300 ease-out lg:hidden ${
          mobileOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <nav
          aria-label="Navigasi seluler"
          className="min-h-0"
        >
          <div className="mx-auto mt-2 max-w-7xl rounded-2xl border border-sky-400/20 bg-[#070B13] px-5 py-4 shadow-2xl">
            <div className="flex flex-col gap-1">
              <a
                href="#solusi-maritim"
                onClick={handleLinkClick}
                className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold text-sky-300 hover:bg-white/5"
              >
                <Boxes className="h-4 w-4" aria-hidden="true" />
                Produk & Solusi Maritim (12)
              </a>
              {NAV_LINKS.map((link) => {
                const Icon = link.icon;
                const isActive = activeSection === link.href.slice(1);
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={handleLinkClick}
                    aria-current={isActive ? 'true' : undefined}
                    className={`relative flex items-center gap-2 overflow-hidden rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive ? 'text-white' : 'text-slate-200 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {isActive ? (
                      <span
                        aria-hidden="true"
                        className="absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.9)]"
                      />
                    ) : null}
                    <Icon
                      className={`h-4 w-4 ${isActive ? 'text-sky-300' : 'text-sky-400/70'}`}
                      aria-hidden="true"
                    />
                    {link.label}
                  </a>
                );
              })}
            </div>

            <div className="mt-3 grid grid-cols-1 gap-2.5 border-t border-white/10 pt-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={handleCtaClick}
                className="w-full rounded-xl border border-white/15 bg-[#0E1524] px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/10 cursor-pointer"
              >
                Konsultasi Brief Proyek
              </button>
              <a
                href={STUDIO_PROFILE.whatsappHref}
                target="_blank"
                rel="noreferrer"
                onClick={handleLinkClick}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-400/50 bg-[#16A34A] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#15803D]"
              >
                <WhatsAppIcon className="h-4 w-4 shrink-0" />
                <span>Hubungi Kami</span>
              </a>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
