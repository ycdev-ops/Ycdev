import { Award } from 'lucide-react';
import {
  CERTIFICATE_SOURCE_FILES,
  OFFICIAL_CERTIFICATES,
} from '../data/officialCertificates';
import type { OfficialCertificate } from './ProtectedCertificateViewer';
import { ProtectedCertificateViewer } from './ProtectedCertificateViewer';

/**
 * Dokumen sertifikat resmi, tampil di bawah Profil Pendiri.
 *
 * Dokumen ditampilkan apa adanya; daftar putih CERTIFICATE_SOURCE_FILES
 * menjaga hanya berkas dari `src/assets/images/` yang tampil.
 */
export function OfficialCertificatesSection() {
  const allowed = new Set(CERTIFICATE_SOURCE_FILES);
  const certificates = OFFICIAL_CERTIFICATES.filter((cert) =>
    allowed.has(cert.sourceFile)
  );

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
          </div>
        </div>

        <div
          data-testid="official-certificates-grid"
          className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2"
        >
          {certificates.map((cert) => {
            const item: OfficialCertificate = cert;
            return <ProtectedCertificateViewer key={item.id} cert={item} />;
          })}
        </div>

        <p className="mt-8 border-t border-white/10 pt-5 text-center font-mono text-[10px] tracking-[0.16em] text-ink-500 uppercase">
          © {new Date().getFullYear()} YcDev · Seluruh dokumen milik Yuan Nugroho / YcDev Semarang Barat
        </p>
      </div>
    </section>
  );
}
