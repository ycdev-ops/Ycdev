import type { CertificateSealVariant, CertificationItem } from '../utils/credentialsCatalog';

export interface CertificateThemeConfig {
  paperClass: string;
  innerBorderClass: string;
  headerBandClass: string;
  titleColorClass: string;
  bodyTextClass: string;
  mutedTextClass: string;
  accentHex: string;
  foilFillHex: string;
  foilStrokeHex: string;
  foilTextHex: string;
  cardFrameClass: string;
  cardHeaderClass: string;
  buttonClass: string;
  documentHeading: string;
}

const THEMES: Record<CertificateSealVariant, CertificateThemeConfig> = {
  oscp: {
    paperClass: 'bg-gradient-to-br from-[#140B0E] via-[#0B0C10] to-[#17090D] text-slate-100',
    innerBorderClass: 'border-[#DC2626]/45',
    headerBandClass: 'bg-[#DC2626] text-white',
    titleColorClass: 'text-[#FCA5A5]',
    bodyTextClass: 'text-slate-200',
    mutedTextClass: 'text-slate-400',
    accentHex: '#EF4444',
    foilFillHex: '#991B1B',
    foilStrokeHex: '#FCA5A5',
    foilTextHex: '#FEF2F2',
    cardFrameClass: 'border-rose-500/40 bg-[#0D0A0D] hover:border-rose-400/75',
    cardHeaderClass: 'from-[#2A0E15] via-[#120B0F] to-[#0A080C] border-rose-500/30',
    buttonClass: 'border-rose-400/45 bg-rose-500/15 text-rose-200 hover:bg-rose-500/25',
    documentHeading: 'OFFENSIVE SECURITY CERTIFICATION DOSSIER',
  },
  cks: {
    paperClass: 'bg-gradient-to-br from-[#0B172A] via-[#091220] to-[#071A2B] text-slate-100',
    innerBorderClass: 'border-cyan-400/40',
    headerBandClass: 'bg-[#0284C7] text-white',
    titleColorClass: 'text-cyan-300',
    bodyTextClass: 'text-slate-200',
    mutedTextClass: 'text-slate-400',
    accentHex: '#22D3EE',
    foilFillHex: '#0369A1',
    foilStrokeHex: '#67E8F9',
    foilTextHex: '#ECFEFF',
    cardFrameClass: 'border-cyan-500/40 bg-[#08101C] hover:border-cyan-400/75',
    cardHeaderClass: 'from-[#0C253E] via-[#0A1628] to-[#07101C] border-cyan-400/30',
    buttonClass: 'border-cyan-400/45 bg-cyan-500/15 text-cyan-200 hover:bg-cyan-500/25',
    documentHeading: 'CNCF KUBERNETES SECURITY SPECIALIST CHARTER',
  },
  embedded: {
    paperClass: 'bg-gradient-to-br from-[#FBF7EE] via-[#F7F1E3] to-[#EFE5CF] text-[#1C1917]',
    innerBorderClass: 'border-[#B45309]/45',
    headerBandClass: 'bg-[#78350F] text-amber-100',
    titleColorClass: 'text-[#78350F]',
    bodyTextClass: 'text-[#292524]',
    mutedTextClass: 'text-[#57534E]',
    accentHex: '#D97706',
    foilFillHex: '#E6C674',
    foilStrokeHex: '#92400E',
    foilTextHex: '#451A03',
    cardFrameClass: 'border-amber-500/40 bg-[#100E0B] hover:border-amber-400/75',
    cardHeaderClass: 'from-[#F7EFE0] via-[#EFE3CC] to-[#E7D6B5] border-amber-600/35',
    buttonClass: 'border-amber-400/45 bg-amber-500/15 text-amber-200 hover:bg-amber-500/25',
    documentHeading: 'EMBEDDED SYSTEMS & RTOS ARCHITECTURE DIPLOMA',
  },
  lorawan: {
    paperClass: 'bg-gradient-to-br from-[#F3FAF6] via-[#ECFDF5] to-[#E2F5EB] text-[#06281B]',
    innerBorderClass: 'border-[#059669]/40',
    headerBandClass: 'bg-[#065F46] text-emerald-50',
    titleColorClass: 'text-[#065F46]',
    bodyTextClass: 'text-[#064E3B]',
    mutedTextClass: 'text-[#047857]',
    accentHex: '#10B981',
    foilFillHex: '#A7F3D0',
    foilStrokeHex: '#047857',
    foilTextHex: '#022C22',
    cardFrameClass: 'border-emerald-500/40 bg-[#09120F] hover:border-emerald-400/75',
    cardHeaderClass: 'from-[#ECFDF5] via-[#DFF8EC] to-[#D1F2E3] border-emerald-600/35',
    buttonClass: 'border-emerald-400/45 bg-emerald-500/15 text-emerald-200 hover:bg-emerald-500/25',
    documentHeading: 'LORA ALLIANCE INDUSTRIAL RF TELEMETRY CREDENTIAL',
  },
  aws: {
    paperClass: 'bg-gradient-to-br from-[#1B2532] via-[#141C26] to-[#232F3E] text-white',
    innerBorderClass: 'border-[#FF9900]/55',
    headerBandClass: 'bg-[#FF9900] text-[#0F172A]',
    titleColorClass: 'text-[#FFB84D]',
    bodyTextClass: 'text-slate-200',
    mutedTextClass: 'text-slate-400',
    accentHex: '#FF9900',
    foilFillHex: '#FF9900',
    foilStrokeHex: '#FFF3E0',
    foilTextHex: '#111827',
    cardFrameClass: 'border-orange-500/45 bg-[#121922] hover:border-orange-400/80',
    cardHeaderClass: 'from-[#232F3E] via-[#1C2532] to-[#151D27] border-orange-400/40',
    buttonClass: 'border-orange-400/45 bg-orange-500/15 text-orange-200 hover:bg-orange-500/25',
    documentHeading: 'AMAZON WEB SERVICES PROFESSIONAL CERTIFICATION',
  },
  fullstack: {
    paperClass: 'bg-gradient-to-br from-[#F8FAFC] via-[#EEF2FF] to-[#E0E7FF] text-[#1E1B4B]',
    innerBorderClass: 'border-[#4F46E5]/40',
    headerBandClass: 'bg-[#312E81] text-indigo-100',
    titleColorClass: 'text-[#312E81]',
    bodyTextClass: 'text-[#1E1B4B]',
    mutedTextClass: 'text-[#4338CA]',
    accentHex: '#6366F1',
    foilFillHex: '#C7D2FE',
    foilStrokeHex: '#3730A3',
    foilTextHex: '#1E1B4B',
    cardFrameClass: 'border-indigo-500/40 bg-[#0B0D18] hover:border-indigo-400/75',
    cardHeaderClass: 'from-[#F5F7FF] via-[#EBEEFF] to-[#E0E7FF] border-indigo-500/35',
    buttonClass: 'border-indigo-400/45 bg-indigo-500/15 text-indigo-200 hover:bg-indigo-500/25',
    documentHeading: 'ENTERPRISE DISTRIBUTED WEB ENGINEERING GUILD',
  },
  cka: {
    paperClass: 'bg-gradient-to-br from-[#FFFFFF] via-[#F1F5F9] to-[#E2E8F0] text-[#0F172A]',
    innerBorderClass: 'border-[#2563EB]/45',
    headerBandClass: 'bg-[#1D4ED8] text-white',
    titleColorClass: 'text-[#1E40AF]',
    bodyTextClass: 'text-slate-700',
    mutedTextClass: 'text-slate-500',
    accentHex: '#2563EB',
    foilFillHex: '#BFDBFE',
    foilStrokeHex: '#1D4ED8',
    foilTextHex: '#1E3A8A',
    cardFrameClass: 'border-blue-500/40 bg-[#0A101B] hover:border-blue-400/75',
    cardHeaderClass: 'from-[#FFFFFF] via-[#F4F7FB] to-[#E8EFF8] border-blue-500/35',
    buttonClass: 'border-blue-400/45 bg-blue-500/15 text-blue-200 hover:bg-blue-500/25',
    documentHeading: 'LINUX FOUNDATION · CERTIFIED KUBERNETES ADMINISTRATOR',
  },
  'iso-mikrotik': {
    paperClass: 'bg-gradient-to-br from-[#FCF8F3] via-[#F8EFE6] to-[#EFE1D2] text-[#2A0E16]',
    innerBorderClass: 'border-[#9F1239]/45',
    headerBandClass: 'bg-[#881337] text-rose-50',
    titleColorClass: 'text-[#881337]',
    bodyTextClass: 'text-[#3F1D27]',
    mutedTextClass: 'text-[#6B3B49]',
    accentHex: '#BE123C',
    foilFillHex: '#F3D4B0',
    foilStrokeHex: '#881337',
    foilTextHex: '#4C0519',
    cardFrameClass: 'border-pink-600/40 bg-[#120B0F] hover:border-pink-400/70',
    cardHeaderClass: 'from-[#FCF7F2] via-[#F6EBDD] to-[#EDDCCB] border-rose-800/35',
    buttonClass: 'border-pink-400/40 bg-pink-500/15 text-pink-200 hover:bg-pink-500/25',
    documentHeading: 'ISO/IEC 27001 ACCREDITATION & MIKROTIK MTCINE',
  },
  nmea: {
    paperClass: 'bg-gradient-to-br from-[#FAF6EC] via-[#F3EBD8] to-[#E9DDC0] text-[#0F223D]',
    innerBorderClass: 'border-[#0F223D]/40',
    headerBandClass: 'bg-[#0F223D] text-[#FCD34D]',
    titleColorClass: 'text-[#0F223D]',
    bodyTextClass: 'text-[#1E3A5F]',
    mutedTextClass: 'text-[#475569]',
    accentHex: '#B45309',
    foilFillHex: '#E5C158',
    foilStrokeHex: '#78350F',
    foilTextHex: '#3B1E04',
    cardFrameClass: 'border-yellow-600/45 bg-[#0C1118] hover:border-yellow-400/80',
    cardHeaderClass: 'from-[#FAF6EC] via-[#F2E9D4] to-[#E7D8B6] border-amber-700/40',
    buttonClass: 'border-yellow-400/45 bg-yellow-500/15 text-yellow-200 hover:bg-yellow-500/25',
    documentHeading: 'NMEA MARINE ELECTRONICS & RADAR ENGINEERING SEAL',
  },
  satcom: {
    paperClass: 'bg-gradient-to-br from-[#0F172A] via-[#0B1120] to-[#1E293B] text-slate-100',
    innerBorderClass: 'border-sky-400/45',
    headerBandClass: 'bg-[#0369A1] text-sky-50',
    titleColorClass: 'text-sky-300',
    bodyTextClass: 'text-slate-200',
    mutedTextClass: 'text-slate-400',
    accentHex: '#38BDF8',
    foilFillHex: '#E2E8F0',
    foilStrokeHex: '#0284C7',
    foilTextHex: '#0F172A',
    cardFrameClass: 'border-sky-400/45 bg-[#0A1019] hover:border-sky-300/80',
    cardHeaderClass: 'from-[#142238] via-[#0D1626] to-[#080E1A] border-sky-400/35',
    buttonClass: 'border-sky-400/45 bg-sky-500/15 text-sky-200 hover:bg-sky-500/25',
    documentHeading: 'ORBITAL LEO & L-BAND MARITIME SATCOM COUNCIL',
  },
};

export function getCertificateTheme(variant: CertificateSealVariant): CertificateThemeConfig {
  return THEMES[variant];
}

export function CertificateIssuerSeal({
  variant,
  className = 'h-12 w-12',
}: {
  variant: CertificateSealVariant;
  className?: string;
}) {
  switch (variant) {
    case 'oscp':
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden="true">
          <polygon
            points="32,4 56,16 56,42 32,60 8,42 8,16"
            fill="#450A0A"
            stroke="#EF4444"
            strokeWidth="2.5"
          />
          <polygon points="32,12 48,20 48,38 32,50 16,38 16,20" stroke="#FCA5A5" strokeWidth="1.2" />
          <path d="M23 26L32 19L41 26V35L32 42L23 35V26Z" fill="#DC2626" />
          <text x="32" y="34" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="900" fontFamily="monospace">
            OSCP
          </text>
        </svg>
      );
    case 'cks':
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden="true">
          <polygon
            points="32,4 54,15 60,38 44,57 20,57 4,38 10,15"
            fill="#082F49"
            stroke="#22D3EE"
            strokeWidth="2.5"
          />
          <circle cx="32" cy="32" r="14" stroke="#67E8F9" strokeWidth="1.8" />
          <path d="M32 14V50M14 32H50M19 19L45 45M45 19L19 45" stroke="#22D3EE" strokeWidth="1.4" />
          <circle cx="32" cy="32" r="7" fill="#0EA5E9" />
          <text x="32" y="35" textAnchor="middle" fill="#FFFFFF" fontSize="6.5" fontWeight="900" fontFamily="monospace">
            CKS
          </text>
        </svg>
      );
    case 'embedded':
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden="true">
          <rect x="14" y="14" width="36" height="36" rx="4" fill="#451A03" stroke="#D97706" strokeWidth="2.5" />
          <path
            d="M22 6V14M32 6V14M42 6V14M22 50V58M32 50V58M42 50V58M6 22H14M6 32H14M6 42H14M50 22H58M50 32H58M50 42H58"
            stroke="#B45309"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          <rect x="22" y="22" width="20" height="20" rx="2" fill="#D97706" />
          <text x="32" y="35" textAnchor="middle" fill="#FFFBEB" fontSize="8" fontWeight="900" fontFamily="monospace">
            MCU
          </text>
        </svg>
      );
    case 'lorawan':
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden="true">
          <circle cx="32" cy="32" r="27" fill="#064E3B" stroke="#10B981" strokeWidth="2.5" />
          <path d="M18 39C21 30 26 26 32 26C38 26 43 30 46 39" stroke="#6EE7B7" strokeWidth="2" strokeLinecap="round" />
          <path d="M12 31C18 19 24 15 32 15C40 15 46 19 52 31" stroke="#34D399" strokeWidth="2" strokeLinecap="round" />
          <circle cx="32" cy="40" r="5" fill="#10B981" />
          <text x="32" y="53" textAnchor="middle" fill="#A7F3D0" fontSize="7" fontWeight="900" fontFamily="monospace">
            LoRaWAN
          </text>
        </svg>
      );
    case 'aws':
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden="true">
          <polygon
            points="32,4 58,20 50,54 14,54 6,20"
            fill="#232F3E"
            stroke="#FF9900"
            strokeWidth="2.8"
          />
          <polygon points="32,12 50,23 44,46 20,46 14,23" stroke="#FFB84D" strokeWidth="1.2" />
          <text x="32" y="29" textAnchor="middle" fill="#FF9900" fontSize="10" fontWeight="900" fontFamily="sans-serif">
            AWS
          </text>
          <text x="32" y="40" textAnchor="middle" fill="#FFFFFF" fontSize="6.5" fontWeight="800" fontFamily="monospace">
            SAP PRO
          </text>
        </svg>
      );
    case 'fullstack':
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden="true">
          <rect x="8" y="8" width="48" height="48" rx="10" fill="#1E1B4B" stroke="#6366F1" strokeWidth="2.5" />
          <path d="M22 25L15 32L22 39M42 25L49 32L42 39M35 20L29 44" stroke="#A5B4FC" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'cka':
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden="true">
          <circle cx="32" cy="32" r="27" fill="#1E3A8A" stroke="#60A5FA" strokeWidth="2.5" />
          <polygon points="32,14 48,23 48,41 32,50 16,41 16,23" fill="#2563EB" stroke="#BFDBFE" strokeWidth="1.5" />
          <text x="32" y="35" textAnchor="middle" fill="#FFFFFF" fontSize="9.5" fontWeight="900" fontFamily="monospace">
            CKA
          </text>
        </svg>
      );
    case 'iso-mikrotik':
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden="true">
          <circle cx="32" cy="32" r="27" fill="#4C0519" stroke="#F43F5E" strokeWidth="2.5" />
          <circle cx="32" cy="32" r="20" stroke="#FDE68A" strokeWidth="1.4" strokeDasharray="3 2" />
          <text x="32" y="29" textAnchor="middle" fill="#FDE68A" fontSize="8" fontWeight="900" fontFamily="monospace">
            ISO
          </text>
          <text x="32" y="40" textAnchor="middle" fill="#FFFFFF" fontSize="7.5" fontWeight="800" fontFamily="monospace">
            27001
          </text>
        </svg>
      );
    case 'nmea':
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden="true">
          <circle cx="32" cy="32" r="27" fill="#0F223D" stroke="#D97706" strokeWidth="2.5" />
          <polygon points="32,10 37,27 54,32 37,37 32,54 27,37 10,32 27,27" fill="#F59E0B" />
          <circle cx="32" cy="32" r="7" fill="#0F223D" stroke="#FEF3C7" strokeWidth="1.5" />
        </svg>
      );
    case 'satcom':
      return (
        <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden="true">
          <circle cx="32" cy="32" r="27" fill="#0C172B" stroke="#38BDF8" strokeWidth="2.5" />
          <ellipse cx="32" cy="32" rx="22" ry="9" transform="rotate(-24 32 32)" stroke="#7DD3FC" strokeWidth="1.8" />
          <circle cx="32" cy="32" r="6" fill="#38BDF8" />
          <circle cx="48" cy="21" r="3" fill="#FDE047" />
        </svg>
      );
  }
}

export function CertificateQrMatrix({
  seedCode,
  fgColor = '#0F172A',
}: {
  seedCode: string;
  fgColor?: string;
}) {
  // Deterministic 5x5 inner QR pattern seeded per credentialCode
  let hash = 2166136261;
  for (let i = 0; i < seedCode.length; i += 1) {
    hash ^= seedCode.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  const cells: { x: number; y: number }[] = [];
  for (let row = 0; row < 5; row += 1) {
    for (let col = 0; col < 5; col += 1) {
      const bit = (hash >>> ((row * 5 + col) % 28)) & 1;
      if (bit === 1 || (row === 2 && col === 2)) {
        cells.push({ x: 14 + col * 2.4, y: 14 + row * 2.4 });
      }
    }
  }

  return (
    <svg
      viewBox="0 0 40 40"
      className="h-12 w-12 shrink-0 rounded border border-slate-300/80 bg-white p-1"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="10" height="10" fill={fgColor} />
      <rect x="4" y="4" width="6" height="6" fill="#FFFFFF" />
      <rect x="5.5" y="5.5" width="3" height="3" fill={fgColor} />

      <rect x="28" y="2" width="10" height="10" fill={fgColor} />
      <rect x="30" y="4" width="6" height="6" fill="#FFFFFF" />
      <rect x="31.5" y="5.5" width="3" height="3" fill={fgColor} />

      <rect x="2" y="28" width="10" height="10" fill={fgColor} />
      <rect x="4" y="30" width="6" height="6" fill="#FFFFFF" />
      <rect x="5.5" y="31.5" width="3" height="3" fill={fgColor} />

      <rect x="16" y="4" width="3" height="3" fill={fgColor} />
      <rect x="22" y="5" width="3" height="4" fill={fgColor} />
      <rect x="4" y="16" width="4" height="5" fill={fgColor} />
      <rect x="30" y="16" width="5" height="4" fill={fgColor} />
      <rect x="16" y="30" width="5" height="4" fill={fgColor} />
      <rect x="28" y="28" width="8" height="3" fill={fgColor} />
      <rect x="32" y="34" width="5" height="3" fill={fgColor} />

      {cells.map((c, idx) => (
        <rect key={idx} x={c.x} y={c.y} width="2" height="2" fill={fgColor} />
      ))}
    </svg>
  );
}

export function MiniatureCertificateSheet({ cert }: { cert: CertificationItem }) {
  const theme = getCertificateTheme(cert.sealVariant);
  const isLightPaper =
    cert.sealVariant === 'embedded' ||
    cert.sealVariant === 'lorawan' ||
    cert.sealVariant === 'fullstack' ||
    cert.sealVariant === 'cka' ||
    cert.sealVariant === 'iso-mikrotik' ||
    cert.sealVariant === 'nmea';

  return (
    <div
      className={`relative overflow-hidden rounded-lg border bg-gradient-to-br p-3.5 ${theme.cardHeaderClass}`}
    >
      {/* Inner Guilloche Hairline */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-1.5 rounded border ${
          isLightPaper ? 'border-slate-900/15' : 'border-white/15'
        }`}
      />

      <div className="relative z-10 flex items-start justify-between gap-2.5">
        <div className="min-w-0 flex-1">
          <span
            className={`inline-block rounded px-2 py-0.5 font-mono text-[9px] font-bold tracking-wider uppercase ${theme.headerBandClass}`}
          >
            {cert.issuerShort}
          </span>

          <p
            className={`mt-2 font-mono text-[9px] uppercase tracking-widest ${
              isLightPaper ? 'text-slate-600' : 'text-slate-400'
            }`}
          >
            Sertifikat Asli · {cert.badgeSeries}
          </p>

          <p
            className={`mt-0.5 font-display text-sm font-extrabold tracking-tight ${
              isLightPaper ? 'text-slate-900' : 'text-white'
            }`}
          >
            {cert.holderName}
          </p>
        </div>

        <CertificateIssuerSeal variant={cert.sealVariant} className="h-11 w-11 shrink-0" />
      </div>

      {/* Mini Signature & Foil Verification Strip */}
      <div
        className={`relative z-10 mt-3 flex items-center justify-between gap-2 border-t pt-2 ${
          isLightPaper ? 'border-slate-900/15' : 'border-white/15'
        }`}
      >
        <div className="flex items-center gap-2 min-w-0">
          <svg viewBox="0 0 180 42" className="h-4 w-16 shrink-0" fill="none" aria-hidden="true">
            <path
              d={cert.signaturePath}
              stroke={theme.accentHex}
              strokeWidth="2.6"
              strokeLinecap="round"
            />
          </svg>
          <span
            className={`truncate font-mono text-[9px] font-medium ${
              isLightPaper ? 'text-slate-700' : 'text-slate-300'
            }`}
          >
            {cert.signatoryName}
          </span>
        </div>

        <span
          className={`shrink-0 font-mono text-[9px] font-bold tabular-nums ${
            isLightPaper ? 'text-emerald-800' : 'text-emerald-400'
          }`}
        >
          SAH · {cert.year}
        </span>
      </div>
    </div>
  );
}
