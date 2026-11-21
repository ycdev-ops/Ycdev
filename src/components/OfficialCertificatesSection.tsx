import { Award, ShieldCheck } from 'lucide-react';
import {
  CERTIFICATE_WATERMARK,
  OFFICIAL_CERTIFICATES,
} from '../data/officialCertificates';
import type { OfficialCertificate } from './ProtectedCertificateViewer';
import { ProtectedCertificateViewer } from './ProtectedCertificateViewer';

/**
 * Dokumen sertifikat resmi, tampil di bawah Profil Pendiri.
 *
 * Dokumen ditampilkan apa adanya (bukan rekayasa ulang) di dalam kanvas
 * berlapis watermark. Penghambat interaksi menekan salinan santai; lihat
 * catatan teknis di ProtectedCertificateViewer soal batas perlindungan.
 */
export function OfficialCertificatesSection() {
  return (
    <section
      id="sertifikat-resmi"
      className="relative z-10 scroll-mt-24 border-b border-white/10 bg-[#05070A] py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="eyebrow-tag inline-flex items-center gap-2">
              <Award className="h-3.5 w-3.5" aria-hidden="true" />
              Dokumen Resmi
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white text-balance lg:text-4xl">
              Sertifikat & Kredensial Resmi
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-ink-400 lg:text-base">
              Empat dokumen asli di bawah ini dipindai langsung dari lembaran
              resmi dan ditampilkan apa adanya. Nomor kredensial pada dokumen
              dapat dicek pada masing-masing lembaga penerbit.
            </p>
          </div>

          <div className="flex items-start gap-2.5 rounded-lg border border-white/10 bg-[#0A0E14] px-3.5 py-3 text-[11px] leading-relaxed text-ink-400 lg:max-w-sm">
            <ShieldCheck
              className="mt-0.5 h-4 w-4 shrink-0 text-sky-400"
              aria-hidden="true"
            />
            <span>
              Dokumen dilindungi watermark dan klik kanan dinonaktifkan. Tangkapan
              layar tetap mungkin dilakukan oleh perangkat — mohon tidak menyebarluaskan
              dokumen ini tanpa izin YcDev.
            </span>
          </div>
        </div>

        <div
          data-testid="official-certificates-grid"
          className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2"
        >
          {OFFICIAL_CERTIFICATES.map((cert) => {
            const item: OfficialCertificate = cert;
            return (
              <ProtectedCertificateViewer
                key={item.id}
                cert={item}
                watermark={CERTIFICATE_WATERMARK}
              />
            );
          })}

        </div>
        <p className="mt-8 border-t border-white/10 pt-5 text-center font-mono text-[10px] tracking-[0.16em] text-ink-500 uppercase">
          © {new Date().getFullYear()} YcDev · Seluruh dokumen milik Yuan Nugroho / YcDev Semarang Barat
        </p>
      </div>
    </section>
  );
}
