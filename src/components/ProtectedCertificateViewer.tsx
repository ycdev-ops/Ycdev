import { useEffect, useRef, useState } from 'react';
import { Eye, ShieldAlert, ZoomIn, ZoomOut } from 'lucide-react';

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
  /** Catatan kejujuran: tampilkan bila dokumen tidak punya nomor/verifikasi. */
  note?: string;
}

/**
 * Penampil dokumen resmi.
 *
 * LAPISAN PENGHAMBAT — yang bisa dan tidak bisa dilakukan:
 *
 * BISA: menonaktifkan klik kanan, drag, dan salin; menimpa watermark;
 *       menurunkan resolusi tampilan; memakai URL relatif sehingga path gambar
 *       tidak tertulis pola yang gampang ditebak.
 *
 * TIDAK BISA: mencegah screenshot. Selama dokumen tampil di layar, sistem
 *       operasi (tombol screenshot Android, PrtSc, alat tangkap apa pun) tetap
 *       mereamnya. Karena itu penghambat di sini hanya pencegah salinan santai.
 *
 * Catatan teknis: dokumen TIDAK dimuat lewat <canvas> dengan crossOrigin.
 * Canvas + crossOrigin='anonymous' membuat gambar gagal dimuat bila server
 * tak menuruti preflight CORS (atau bila halaman di-cache/agregator), dan
 * kegagalan itu muncul sebagai "Dokumen tidak dapat dimuat". <img> biasa di
 * origin yang sama tidak punya risiko itu, jadi dipilih <img>.
 */
export function ProtectedCertificateViewer({
  cert,
  watermark,
}: {
  cert: OfficialCertificate;
  watermark: string;
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [zoom, setZoom] = useState(1);
  const [status, setStatus] = useState<'loading' | 'ready' | 'blocked'>('loading');
  const [srcIndex, setSrcIndex] = useState(0);

  // Kandidat URL: path absolut web dulu (benar di hosting nyata), lalu path
  // relatif terhadap halaman (benar saat preview/build di sub-path).
  const candidates = [cert.imageFile, cert.imageFile.replace(/^\/+/, '')];
  const uniqueCandidates = Array.from(new Set(candidates));

  useEffect(() => {
    setStatus('loading');
    setSrcIndex(0);
  }, [cert.imageFile]);

  // Penghambat interaksi: klik kanan, drag, dan salin.
  useEffect(() => {
    const node = wrapRef.current;
    if (!node) return;

    const onContext = (e: MouseEvent) => e.preventDefault();
    const onCopy = (e: ClipboardEvent) => e.preventDefault();
    const onDrag = (e: DragEvent) => e.preventDefault();

    node.addEventListener('contextmenu', onContext);
    node.addEventListener('copy', onCopy);
    node.addEventListener('cut', onCopy);
    node.addEventListener('dragstart', onDrag);

    return () => {
      node.removeEventListener('contextmenu', onContext);
      node.removeEventListener('copy', onCopy);
      node.removeEventListener('cut', onCopy);
      node.removeEventListener('dragstart', onDrag);
    };
  }, []);

  const scale = Math.max(0.6, Math.min(2, zoom));

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

      <div
        ref={wrapRef}
        data-testid={`cert-viewer-${cert.id}`}
        className="relative select-none overflow-hidden bg-[#05070A]"
        style={{ cursor: 'default' }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
          style={{
            backgroundImage: `repeating-linear-gradient(-22deg, transparent 0 90px, rgba(15,23,42,0.10) 90px 91px)`,
          }}
        />

        {status !== 'blocked' ? (
          <img
            src={uniqueCandidates[srcIndex]}
            alt={cert.title}
            draggable={false}
            referrerPolicy="no-referrer"
            onLoad={() => setStatus('ready')}
            onError={() => {
              if (srcIndex + 1 < uniqueCandidates.length) {
                setSrcIndex((i) => i + 1);
              } else {
                setStatus('blocked');
              }
            }}
            className="block h-auto w-full transition-transform duration-200"
            style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}
          />
        ) : null}

        {status === 'loading' ? (
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-[#05070A]/80 text-xs text-ink-400">
            <Eye className="h-4 w-4" aria-hidden="true" />
            Menyiapkan dokumen…
          </div>
        ) : null}

        {status === 'blocked' ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[#05070A]/90 p-6 text-center">
            <ShieldAlert className="h-6 w-6 text-amber-400" aria-hidden="true" />
            <p className="text-sm font-medium text-white">Dokumen tidak dapat dimuat</p>
            <p className="text-xs text-ink-400">
              Periksa koneksi Anda lalu muat ulang halaman.
            </p>
          </div>
        ) : null}

        <div className="pointer-events-none absolute right-2 bottom-2 rounded bg-black/55 px-2 py-1 font-mono text-[9px] tracking-wide text-slate-300">
          DOKUMEN RESMI · DILINDUNGI
        </div>
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

        {cert.note ? (
          <p className="mt-2.5 flex items-start gap-1.5 text-[10px] leading-relaxed text-ink-500">
            <ShieldAlert className="mt-0.5 h-3 w-3 shrink-0" aria-hidden="true" />
            <span>{cert.note}</span>
          </p>
        ) : null}
      </div>
    </figure>
  );
}
