import { useState } from 'react';
import { ZoomIn, ZoomOut } from 'lucide-react';

export interface OfficialCertificate {
  id: string;
  title: string;
  issuer: string;
  issuerShort: string;
  issuedDate?: string;
  validUntil?: string;
  credentialCode?: string;
  imageFile: string;
  /**
   * Nama berkas asli di `src/assets/images/`. Berkas di folder itulah sumber
   * tunggal dokumen yang diakui situs ini.
   */
  sourceFile: string;
}

/**
 * Penampil dokumen sertifikat resmi — tampilan polos.
 *
 * Dokumen ditampilkan apa adanya sebagai <img>. Tidak ada lapisan proteksi
 * (tanpa watermark, tanpa penghambat klik kanan/drag/salin) dan tanpa overlay
 * status, supaya berkas asli terbaca utuh.
 */
export function ProtectedCertificateViewer({
  cert,
}: {
  cert: OfficialCertificate;
  watermark?: string;
}) {
  const [zoom, setZoom] = useState(1);

  // Path relatif terhadap halaman — benar di domain root maupun /Ycdev/.
  const src = cert.imageFile.replace(/^\/+/, '');

  return (
    <figure className="overflow-hidden rounded-xl border border-white/15 bg-[#0B1018]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-[#0D1219] px-4 py-2.5">
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold text-white">{cert.title}</p>
          <p className="truncate text-[11px] text-ink-400">{cert.issuer}</p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(0.6, Math.round((z - 0.2) * 10) / 10))}
            aria-label="Perkecil tampilan dokumen"
            className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-white/15 text-slate-300 hover:bg-white/5 cursor-pointer"
          >
            <ZoomOut className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
          <span className="w-10 text-center font-mono text-[10px] text-ink-400 tabular-nums">
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(2, Math.round((z + 0.2) * 10) / 10))}
            aria-label="Perbesar tampilan dokumen"
            className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-white/15 text-slate-300 hover:bg-white/5 cursor-pointer"
          >
            <ZoomIn className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="bg-[#05070A]">
        <img
          src={src}
          alt={cert.title}
          draggable={false}
          referrerPolicy="no-referrer"
          className="block h-auto w-full"
          style={{ zoom }}
        />
      </div>

      <div className="border-t border-white/10 bg-[#0D1219] px-4 py-3">
        <dl className="grid grid-cols-1 gap-2 text-[11px] sm:grid-cols-3">
          {cert.issuedDate ? (
            <div>
              <dt className="text-ink-500">Terbit</dt>
              <dd className="font-mono text-slate-200 tabular-nums">{cert.issuedDate}</dd>
            </div>
          ) : null}
          {cert.validUntil ? (
            <div>
              <dt className="text-ink-500">Berlaku hingga</dt>
              <dd className="font-mono text-slate-200 tabular-nums">{cert.validUntil}</dd>
            </div>
          ) : null}
          {cert.credentialCode ? (
            <div>
              <dt className="text-ink-500">Nomor kredensial</dt>
              <dd className="font-mono text-slate-200 tabular-nums">{cert.credentialCode}</dd>
            </div>
          ) : null}
        </dl>
      </div>
    </figure>
  );
}
