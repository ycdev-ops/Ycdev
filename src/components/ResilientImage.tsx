import { assetUrl } from '../utils/siteAssets';
import { useEffect, useState } from 'react';
import { Cpu } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  fallbackTitle: string;
  className?: string;
}

// Root-relative path ("/src/assets/...") dipakai oleh kode lama. Bila situs
// di-host di sub-path, path absolut itu mengarah ke domain root dan gagal.
// Kandidat berikut dicoba berurutan sampai ada yang berhasil dimuat.
function candidatePaths(src: string): string[] {
  const normalized = src.startsWith('/') ? src : `/${src}`;
  const out: string[] = [assetUrl(normalized)];

  if (normalized.startsWith('/src/assets/')) {
    out.push(assetUrl(normalized.replace(/^\/src\/assets\//, '')));
  }

  // Host root tanpa sub-path — berguna bila base runtime keliru.
  if (!out.includes(normalized)) out.push(normalized);

  return Array.from(new Set(out));
}

export function ResilientImage({
  src,
  alt,
  fallbackTitle,
  className = '',
}: ResilientImageProps) {
  const candidates = candidatePaths(src);
  const [index, setIndex] = useState(0);
  const [exhausted, setExhausted] = useState(false);

  // Kembali ke kandidat pertama bila src berubah.
  useEffect(() => {
    setIndex(0);
    setExhausted(false);
  }, [src]);

  if (exhausted) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#11151B] via-[#0F172A] to-[#090B0E] p-6 text-center ${className}`}
      >
        <Cpu className="mb-3 h-8 w-8 text-sky-400/80" aria-hidden="true" />
        <p className="font-display text-sm font-medium text-slate-300">{fallbackTitle}</p>
      </div>
    );
  }

  return (
    <img
      src={candidates[index]}
      alt={alt}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => {
        if (index + 1 < candidates.length) {
          setIndex(index + 1);
        } else {
          setExhausted(true);
        }
      }}
      className={className}
    />
  );
}
