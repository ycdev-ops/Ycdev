interface BrandLogoProps {
  id: string;
  className?: string;
}

export function BrandLogo({ id, className = 'h-7 w-auto' }: BrandLogoProps) {
  switch (id) {
    case 'partner-starlink':
      return (
        <div className="flex items-center gap-2.5" aria-label="Logo Starlink SpaceX">
          <svg viewBox="0 0 36 36" className={className} fill="none" aria-hidden="true">
            <rect width="36" height="36" rx="8" fill="#0B1220" />
            <path d="M8 25C14 14 21 10 29 9" stroke="#38BDF8" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M10 10L26 26M24 10L11 26" stroke="#F8FAFC" strokeWidth="2.2" strokeLinecap="round" />
            <circle cx="28.5" cy="9.5" r="2" fill="#38BDF8" />
          </svg>
          <span className="font-display text-sm font-bold tracking-wider text-white">STARLINK</span>
        </div>
      );

    case 'partner-mikrotik':
      return (
        <div className="flex items-center gap-2.5" aria-label="Logo MikroTik">
          <svg viewBox="0 0 36 36" className={className} fill="none" aria-hidden="true">
            <rect width="36" height="36" rx="8" fill="#181214" />
            <path d="M7 22C10 14 15 11 18 11C21 11 26 14 29 22" stroke="#F97316" strokeWidth="2.4" strokeLinecap="round" />
            <path d="M11.5 23C13.5 17.5 16 15.5 18 15.5C20 15.5 22.5 17.5 24.5 23" stroke="#FB923C" strokeWidth="2" strokeLinecap="round" />
            <circle cx="18" cy="23.5" r="2.6" fill="#F8FAFC" />
          </svg>
          <span className="font-display text-sm font-bold tracking-tight text-white">
            Mikro<span className="text-orange-400">Tik</span>
          </span>
        </div>
      );

    case 'partner-nvidia':
      return (
        <div className="flex items-center gap-2.5" aria-label="Logo NVIDIA">
          <svg viewBox="0 0 36 36" className={className} fill="none" aria-hidden="true">
            <rect width="36" height="36" rx="8" fill="#101C0C" />
            <path
              d="M7 18C10.5 12.5 17 11 22.5 13C26.5 14.5 28.5 18 28.5 18C28.5 18 25.5 23.5 19.5 24.5C13.5 25.5 10 21.5 10 18C10 15.5 12.5 13.5 16.5 14C19.5 14.3 21.5 16.5 21.5 18C21.5 19.5 19.5 21 17 20.5"
              stroke="#76B900"
              strokeWidth="2.3"
              strokeLinecap="round"
            />
            <circle cx="17.5" cy="18" r="2" fill="#76B900" />
          </svg>
          <span className="font-display text-sm font-extrabold tracking-wide text-[#86D100]">
            NVIDIA
          </span>
        </div>
      );

    case 'partner-aws':
      return (
        <div className="flex items-center gap-2.5" aria-label="Logo Amazon Web Services">
          <svg viewBox="0 0 36 36" className={className} fill="none" aria-hidden="true">
            <rect width="36" height="36" rx="8" fill="#161D26" />
            <text x="18" y="18" textAnchor="middle" fill="#F8FAFC" fontSize="11" fontWeight="800" fontFamily="sans-serif">
              aws
            </text>
            <path d="M8 22.5C14 26.5 22 26.5 28 22" stroke="#FF9900" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M25.5 21L28.5 21.8L27.2 24.8" stroke="#FF9900" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="font-display text-sm font-bold text-white">
            Amazon <span className="text-amber-400">AWS</span>
          </span>
        </div>
      );

    case 'partner-cloudflare':
      return (
        <div className="flex items-center gap-2.5" aria-label="Logo Cloudflare">
          <svg viewBox="0 0 36 36" className={className} fill="none" aria-hidden="true">
            <rect width="36" height="36" rx="8" fill="#1D130B" />
            <path
              d="M9 23.5H26.5C28.4 23.5 29.5 22.1 29.5 20.5C29.5 18.8 28.2 17.5 26.4 17.5C25.8 14.3 23 12 19.6 12C16.2 12 13.6 14.2 13.1 17.2C10.8 17.3 9 19 9 21.1C9 22.4 9.5 23.5 9 23.5Z"
              fill="#F38020"
            />
            <path d="M26 14L30 12.5M27.5 16.5L31 16" stroke="#FBBF24" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <span className="font-display text-sm font-bold tracking-tight text-white">
            CLOUD<span className="text-orange-400">FLARE</span>
          </span>
        </div>
      );

    case 'partner-iridium':
      return (
        <div className="flex items-center gap-2.5" aria-label="Logo Iridium Inmarsat">
          <svg viewBox="0 0 36 36" className={className} fill="none" aria-hidden="true">
            <rect width="36" height="36" rx="8" fill="#0B1829" />
            <circle cx="10" cy="14" r="1.8" fill="#38BDF8" />
            <circle cx="14" cy="11" r="1.8" fill="#38BDF8" />
            <circle cx="19" cy="13" r="1.8" fill="#F8FAFC" />
            <circle cx="23" cy="16.5" r="2" fill="#38BDF8" />
            <circle cx="27" cy="14.5" r="1.8" fill="#38BDF8" />
            <circle cx="27.5" cy="21" r="1.8" fill="#F8FAFC" />
            <circle cx="21.5" cy="22.5" r="1.8" fill="#38BDF8" />
            <path d="M10 14L14 11L19 13L23 16.5L27 14.5L27.5 21L21.5 22.5L23 16.5" stroke="#38BDF8" strokeWidth="1.1" strokeOpacity="0.6" />
          </svg>
          <span className="font-display text-sm font-bold tracking-tight text-sky-300">
            IRIDIUM
          </span>
        </div>
      );

    case 'partner-espressif':
      return (
        <div className="flex items-center gap-2.5" aria-label="Logo Espressif & ST">
          <svg viewBox="0 0 36 36" className={className} fill="none" aria-hidden="true">
            <rect width="36" height="36" rx="8" fill="#1F0E12" />
            <circle cx="18" cy="18" r="9.5" stroke="#EF4444" strokeWidth="2" />
            <path d="M11.5 20.5C13.5 16 17.5 14 22 14.5" stroke="#F8FAFC" strokeWidth="2" strokeLinecap="round" />
            <path d="M13 23.5C15.5 20 19.5 18.5 24 19" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
            <circle cx="22.5" cy="14.5" r="1.7" fill="#EF4444" />
          </svg>
          <span className="font-display text-sm font-bold text-white">
            ESPRESSIF <span className="text-rose-400">· ST</span>
          </span>
        </div>
      );

    case 'partner-hashicorp':
      return (
        <div className="flex items-center gap-2.5" aria-label="Logo HashiCorp Linux Foundation">
          <svg viewBox="0 0 36 36" className={className} fill="none" aria-hidden="true">
            <rect width="36" height="36" rx="8" fill="#111622" />
            <path d="M11 10V26M25 10V26M11 18H25" stroke="#A78BFA" strokeWidth="2.8" strokeLinecap="square" />
            <path d="M18 7L28 12.5V23.5L18 29L8 23.5V12.5L18 7Z" stroke="#64748B" strokeWidth="1.2" />
          </svg>
          <span className="font-display text-sm font-bold text-white">
            HashiCorp <span className="text-slate-400">CNCF</span>
          </span>
        </div>
      );

    // Client Organization Badges
    case 'cust-pelindo':
      return (
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 32 32" className={className} fill="none" aria-hidden="true">
            <rect width="32" height="32" rx="7" fill="#0B2245" />
            <path d="M6 19C10 15 14 15 18 19C21 22 24 22 26 19" stroke="#38BDF8" strokeWidth="2.4" strokeLinecap="round" />
            <path d="M16 7V21M12 11H20" stroke="#F8FAFC" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span className="font-mono text-xs font-bold tracking-wider text-white">PELINDO</span>
        </div>
      );

    case 'cust-pemerintah':
      return (
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 32 32" className={className} fill="none" aria-hidden="true">
            <rect width="32" height="32" rx="7" fill="#1E170A" />
            <path d="M16 6L24 10V17C24 22 16 26 16 26C16 26 8 22 8 17V10L16 6Z" stroke="#FBBF24" strokeWidth="2" />
            <path d="M12 16L15 19L20.5 13" stroke="#F8FAFC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="font-mono text-xs font-bold tracking-wider text-amber-300">RI · VMS KKP</span>
        </div>
      );

    case 'cust-tesla':
      return (
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 32 32" className={className} fill="none" aria-hidden="true">
            <rect width="32" height="32" rx="7" fill="#260A0E" />
            <path d="M7.5 11.5C12.5 9.5 19.5 9.5 24.5 11.5" stroke="#EF4444" strokeWidth="2.4" strokeLinecap="round" />
            <path d="M10.5 13.5H21.5M16 13.5V25" stroke="#EF4444" strokeWidth="2.4" strokeLinecap="round" />
          </svg>
          <span className="font-mono text-xs font-bold tracking-widest text-rose-400">TESLA</span>
        </div>
      );

    default:
      return (
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 32 32" className={className} fill="none" aria-hidden="true">
            <rect width="32" height="32" rx="7" fill="#0C1B2E" />
            <circle cx="16" cy="16" r="8" stroke="#38BDF8" strokeWidth="1.8" />
            <ellipse cx="16" cy="16" rx="3.5" ry="8" stroke="#38BDF8" strokeWidth="1.2" />
            <path d="M8 16H24" stroke="#38BDF8" strokeWidth="1.2" />
          </svg>
          <span className="font-mono text-xs font-bold tracking-wider text-sky-300">GLOBAL</span>
        </div>
      );
  }
}
