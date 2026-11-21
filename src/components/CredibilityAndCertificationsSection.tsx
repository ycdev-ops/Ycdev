import { useEffect, useState } from 'react';
import { CheckCircle2, Download, ShieldCheck, X } from 'lucide-react';
import { STUDIO_PROFILE } from '../data/ycdevData';
import {
  CERTIFICATIONS,
  FOUNDER_EXECUTIVE_PROFILE,
  filterCertifications,
  type CertificationFilter,
  type CertificationItem,
} from '../utils/credentialsCatalog';
import { downloadCertificationPdf } from '../utils/clientPdfGenerator';
import {
  CertificateIssuerSeal,
  CertificateQrMatrix,
  MiniatureCertificateSheet,
  getCertificateTheme,
} from './CertificateArtwork';
import { ResilientImage } from './ResilientImage';
import { assetUrl } from '../utils/siteAssets';

const CERT_FILTERS: { id: CertificationFilter; label: string }[] = [
  { id: 'all', label: 'Semua Bidang (10)' },
  { id: 'iot', label: 'IoT & Embedded (2)' },
  { id: 'cybersecurity', label: 'Cybersecurity (2)' },
  { id: 'fullstack', label: 'Full-Stack & Cloud (2)' },
  { id: 'software', label: 'Software Eng. (2)' },
  { id: 'maritime', label: 'Maritim & Satcom (2)' },
];

export function CredibilityAndCertificationsSection() {
  const [domainFilter, setDomainFilter] = useState<CertificationFilter>('all');
  const [selectedCert, setSelectedCert] = useState<CertificationItem | null>(null);
  const [downloadingCertId, setDownloadingCertId] = useState<string | null>(null);

  const visibleCerts = filterCertifications(CERTIFICATIONS, domainFilter);
  const modalTheme = selectedCert ? getCertificateTheme(selectedCert.sealVariant) : null;

  const handleDownloadCertificatePdf = async (cert: CertificationItem) => {
    setDownloadingCertId(cert.id);
    try {
      await downloadCertificationPdf(cert);
    } finally {
      window.setTimeout(() => setDownloadingCertId(null), 1200);
    }
  };

  useEffect(() => {
    if (!selectedCert) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedCert(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedCert]);

  return (
    <section
      id="profil-pendiri"
      className="relative z-10 scroll-mt-20 border-b border-white/10 bg-[#070A0F]/95 py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        {/* Executive Founder Bio & Autodidact Mastery */}
        <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0B0F17] lg:col-span-5 flex flex-col">
            <div className="relative flex-1 min-h-[340px] bg-[#06090F]">
              <ResilientImage
                src={assetUrl(STUDIO_PROFILE.founderImage)}
                alt="Yuan Nugroho, Pendiri & Principal Systems Architect YcDev di ruang pusat data"
                fallbackTitle="Yuan Nugroho — Pendiri YcDev"
                className="h-full w-full object-cover object-top"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#05070A] via-[#05070A]/65 to-transparent p-6">
                <p className="font-mono text-xs text-sky-400">
                  PENDIRI & PRINCIPAL ARCHITECT
                </p>
                <p className="mt-1 font-display text-2xl font-bold text-white">
                  {FOUNDER_EXECUTIVE_PROFILE.fullName}
                </p>
                <p className="text-xs text-slate-300">
                  {STUDIO_PROFILE.addressLine} · {STUDIO_PROFILE.cityRegion}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 divide-x divide-y divide-white/10 border-t border-white/10 bg-[#080C12]">
              {FOUNDER_EXECUTIVE_PROFILE.highlights.map((stat) => (
                <div key={stat.label} className="p-4">
                  <p className="font-mono text-lg font-semibold text-white tabular-nums">
                    {stat.value}
                  </p>
                  <p className="mt-0.5 text-[11px] leading-snug text-ink-400">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-xl border border-white/10 bg-[#0B0F17] p-6 sm:p-8 lg:col-span-7">
            <div>
              <p className="text-xs font-medium tracking-wide text-sky-400">
                Profil Kepemimpinan & Rekam Jejak Autodidak
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-white text-balance lg:text-3xl">
                {FOUNDER_EXECUTIVE_PROFILE.headline}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-300 lg:text-base">
                {FOUNDER_EXECUTIVE_PROFILE.executiveSummary}
              </p>
            </div>

            <div className="mt-8 border-t border-white/10 pt-6">
              <p className="font-mono text-xs text-ink-400">
                LINIMASA PERJALANAN REKAYASA AUTODIDAK
              </p>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {FOUNDER_EXECUTIVE_PROFILE.milestones.map((item) => (
                  <div
                    key={item.period}
                    className="rounded-lg border border-white/10 bg-[#080B11] p-4"
                  >
                    <p className="font-mono text-xs text-sky-400 tabular-nums">
                      {item.period} · {item.phase}
                    </p>
                    <h3 className="mt-1.5 font-display text-sm font-semibold text-white">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-ink-400">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Comprehensive Certifications Matrix Across All Domains */}
        {/* Bagian sertifikasi disembunyikan dari tampilan. */}
        <div id="sertifikasi" className="mt-20 scroll-mt-24" hidden>
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <p className="text-xs font-medium tracking-wide text-sky-400">
                Standar Kompetensi & Lisensi Teknis
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-white text-balance lg:text-4xl">
                Sertifikat Keahlian di Seluruh Disiplin Rekayasa
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-400">
                Pembuktian formal melengkapi pengalaman autodidak lapangan—mencakup keamanan
                ofensif, firmware IoT, arsitektur cloud, sistem terdistribusi, hingga elektronika maritim.
              </p>
            </div>

            <div
              role="tablist"
              aria-label="Filter sertifikat keahlian berdasarkan bidang"
              className="flex flex-wrap gap-2"
            >
              {CERT_FILTERS.map((tab) => {
                const selected = domainFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    onClick={() => setDomainFilter(tab.id)}
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
            data-testid="certifications-grid"
            className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {visibleCerts.map((cert) => {
              const theme = getCertificateTheme(cert.sealVariant);
              return (
                <article
                  key={cert.id}
                  className={`group relative flex flex-col justify-between overflow-hidden rounded-xl border p-4 transition-colors ${theme.cardFrameClass}`}
                >
                  <div>
                    {/* Authentic Issuer-Matched Miniature Certificate Replica */}
                    <MiniatureCertificateSheet cert={cert} />

                    <div className="mt-4">
                      <p className="font-mono text-[11px] font-medium text-sky-400">
                        {cert.domainLabel}
                      </p>
                      <h3 className="mt-1 font-display text-base font-bold leading-snug text-white">
                        {cert.title}
                      </h3>
                      <p className="mt-1 text-xs font-medium text-ink-400">
                        {cert.issuer}
                      </p>
                      <p className="mt-2.5 text-xs leading-relaxed text-slate-300">
                        {cert.competencyFocus}
                      </p>
                    </div>
                  </div>

                  {/* Credential Registry Strip & Modal Trigger */}
                  <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/10 pt-3.5">
                    <div className="min-w-0">
                      <p className="truncate font-mono text-[10px] text-slate-300 tabular-nums">
                        {cert.credentialCode}
                      </p>
                      <p className="font-mono text-[10px] text-ink-400 tabular-nums">
                        Terbit: {cert.issuedDate}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedCert(cert)}
                      className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-semibold transition-colors hover:text-white whitespace-nowrap shrink-0 cursor-pointer ${theme.buttonClass}`}
                    >
                      <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                      {cert.originalDocumentUrl ? 'Lihat Dokumen' : 'Lihat Detail'}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>

      {/* Authentic Per-Issuer Full Certificate Inspection Modal */}
      {selectedCert && modalTheme && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cert-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/85 p-4"
          onClick={() => setSelectedCert(null)}
        >
          <div
            className="my-auto w-full max-w-3xl overflow-hidden rounded-xl border border-white/15 bg-[#0B1018] p-4 sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Dokumen asli (scan/foto) bila diunggah pemilik; kalau belum,
                tampilkan lembar ringkasan yang diberi label jelas. */}
            <div
              className={`relative overflow-hidden rounded-lg border-[3px] p-6 sm:p-8 ${modalTheme.paperClass}`}
              style={{ borderColor: modalTheme.accentHex }}
            >
              {selectedCert.originalDocumentUrl ? (
                <>
                  <img
                    src={assetUrl(selectedCert.originalDocumentUrl)}
                    alt={`Dokumen asli ${selectedCert.title} terbitan ${selectedCert.issuer}`}
                    className="h-auto w-full rounded object-contain"
                  />
                  <p className="mt-3 text-center font-mono text-[10px] text-emerald-600">
                    {selectedCert.originalDocumentLabel ?? 'Dokumen asli'}
                  </p>
                </>
              ) : (
                <>
                  {/* Tanda agar lembar ringkasan tidak disangka dokumen resmi */}
                  <div className="mb-4 flex justify-center">
                    <span className="rounded border border-dashed border-slate-500/50 px-3 py-1 font-mono text-[9px] tracking-[0.16em] text-ink-400 uppercase">
                      Lembar Ringkasan — Bukan Dokumen Resmi
                    </span>
                  </div>

                  {/* Centered Subtle YcDev Verification Watermark */}
              <img
                src={assetUrl("/assets/aistudio/SmartSelect_20261115_111928_Gallery_7ef9e0a2.png")}
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full object-contain opacity-[0.06]"
              />

              {/* Inner Guilloche Hairline Frame */}
              <div
                aria-hidden="true"
                className={`pointer-events-none absolute inset-2.5 rounded border ${modalTheme.innerBorderClass}`}
              />

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedCert(null)}
                aria-label="Tutup detail sertifikat"
                className="absolute top-4 right-4 z-10 inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-500/35 bg-black/25 text-current hover:bg-black/45 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="relative z-10">
                {/* Issuer Crest & Official Classification Header */}
                <div className="flex flex-col items-center text-center">
                  <CertificateIssuerSeal
                    variant={selectedCert.sealVariant}
                    className="h-16 w-16"
                  />

                  <div
                    className={`mt-3 inline-flex items-center gap-2 rounded px-3 py-1 font-mono text-[10px] font-bold tracking-[0.18em] uppercase ${modalTheme.headerBandClass}`}
                  >
                    {modalTheme.documentHeading}
                  </div>

                  <p className={`mt-2.5 font-mono text-xs font-semibold ${modalTheme.mutedTextClass}`}>
                    {selectedCert.issuer}
                  </p>

                  <div
                    className="mt-4 h-px w-52 opacity-50"
                    style={{
                      background: `linear-gradient(to right, transparent, ${modalTheme.accentHex}, transparent)`,
                    }}
                  />

                  <p className={`mt-4 text-[11px] font-semibold tracking-[0.2em] uppercase ${modalTheme.mutedTextClass}`}>
                    Sertifikat Resmi Ini Diberikan Kepada
                  </p>
                  <h4 className="mt-1.5 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
                    {selectedCert.holderName}
                  </h4>
                  <p className={`mt-1.5 text-xs ${modalTheme.mutedTextClass}`}>
                    Pendiri & Principal Systems Architect · YcDev Semarang Barat
                  </p>

                  <p className={`mt-4 max-w-xl text-xs leading-relaxed ${modalTheme.bodyTextClass}`}>
                    Telah lulus evaluasi resmi, pengujian arsitektur praktis, dan verifikasi
                    kompetensi teknis berstandar internasional pada disiplin{' '}
                    <span className="font-semibold underline decoration-current/30 underline-offset-4">
                      {selectedCert.domainLabel}
                    </span>{' '}
                    dan dinyatakan sah menyandang gelar sertifikasi:
                  </p>

                  <h3
                    id="cert-modal-title"
                    className={`mt-3 font-display text-xl font-bold sm:text-2xl ${modalTheme.titleColorClass}`}
                  >
                    {selectedCert.title}
                  </h3>

                  <p className={`mt-1.5 font-mono text-[11px] tabular-nums ${modalTheme.mutedTextClass}`}>
                    No. Registrasi: {selectedCert.badgeSeries} · Masa Berlaku: {selectedCert.validUntil}
                  </p>
                </div>

                {/* Signatory Signature, Foil Seal & Unique QR Verification */}
                <div
                  className={`mt-7 grid grid-cols-1 items-end gap-5 border-t pt-5 sm:grid-cols-3 ${modalTheme.innerBorderClass}`}
                >
                  {/* Signature Block */}
                  <div className="text-center sm:text-left">
                    <svg
                      viewBox="0 0 180 42"
                      className="mx-auto h-9 w-40 sm:mx-0"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d={selectedCert.signaturePath}
                        stroke={modalTheme.accentHex}
                        strokeWidth="2.2"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className={`mt-1 border-t pt-1 ${modalTheme.innerBorderClass}`}>
                      <p className="text-[11px] font-bold">{selectedCert.signatoryName}</p>
                      <p className={`text-[10px] ${modalTheme.mutedTextClass}`}>
                        {selectedCert.signatoryTitle}
                      </p>
                      <p className={`mt-0.5 font-mono text-[10px] tabular-nums ${modalTheme.mutedTextClass}`}>
                        Terbit: {selectedCert.issuedDate}
                      </p>
                    </div>
                  </div>

                  {/* Custom Embossed Foil Rosette Seal */}
                  <div className="flex flex-col items-center justify-center">
                    <svg viewBox="0 0 88 88" className="h-20 w-20" fill="none" aria-hidden="true">
                      <circle
                        cx="44"
                        cy="44"
                        r="36"
                        fill={modalTheme.foilFillHex}
                        stroke={modalTheme.foilStrokeHex}
                        strokeWidth="2.5"
                      />
                      <circle
                        cx="44"
                        cy="44"
                        r="28"
                        fill={modalTheme.foilFillHex}
                        stroke={modalTheme.foilStrokeHex}
                        strokeWidth="1.5"
                        strokeDasharray="3 3"
                      />
                      <text
                        x="44"
                        y="39"
                        textAnchor="middle"
                        fill={modalTheme.foilTextHex}
                        fontSize="8.5"
                        fontWeight="800"
                        fontFamily="monospace"
                      >
                        VERIFIED
                      </text>
                      <text
                        x="44"
                        y="52"
                        textAnchor="middle"
                        fill={modalTheme.foilTextHex}
                        fontSize="11"
                        fontWeight="900"
                        fontFamily="sans-serif"
                      >
                        {selectedCert.year}
                      </text>
                    </svg>
                  </div>

                  {/* Verification ID, Registry URL & Unique QR Matrix */}
                  <div className="flex items-center justify-center gap-3 sm:justify-end">
                    <div className="text-right">
                      <p className={`font-mono text-[10px] font-semibold uppercase ${modalTheme.mutedTextClass}`}>
                        ID Kredensial Asli
                      </p>
                      <p className={`font-mono text-xs font-bold tabular-nums ${modalTheme.titleColorClass}`}>
                        {selectedCert.credentialCode}
                      </p>
                      <p className="mt-0.5 font-mono text-[9px] opacity-80">
                        {selectedCert.registryUrl}
                      </p>
                    </div>
                    <CertificateQrMatrix
                      seedCode={`${selectedCert.credentialCode}-${selectedCert.badgeSeries}`}
                      fgColor="#0F172A"
                    />
                  </div>
                </div>
              </div>
                </>
              )}
            </div>

            {/* Competency Verification Highlights Strip */}
            <div className="mt-4 rounded-lg border border-white/10 bg-[#080C12] p-4">
              <p className="text-xs font-semibold text-white">
                Cakupan Kompetensi & Audit Lapangan
              </p>
              <ul className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-3">
                {selectedCert.verificationHighlights.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-xs leading-relaxed text-slate-300"
                  >
                    <CheckCircle2
                      className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sky-400"
                      aria-hidden="true"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => handleDownloadCertificatePdf(selectedCert)}
                className="inline-flex items-center gap-2 rounded-lg border border-emerald-400/40 bg-[#0F7641] px-4 py-2 text-xs font-semibold text-white hover:bg-[#15803D] cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" aria-hidden="true" />
                <span>
                  {downloadingCertId === selectedCert.id
                    ? 'Mengunduh PDF...'
                    : 'Unduh PDF Sertifikat'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedCert(null)}
                className="rounded-lg bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1D4ED8] cursor-pointer"
              >
                Tutup Sertifikat
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
