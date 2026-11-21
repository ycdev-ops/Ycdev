import { useEffect, useRef, useState } from 'react';

/**
 * Meneruskan `loading="lazy"` ke <img> di dalamnya. Gambar di bawah fold
 * tidak diunduh sampai mendekati viewport — menghemat data dan mempercepat
 * muat awal pada halaman sepanjang ini.
 */
export function LazyImage({
  src,
  alt,
  className = '',
  decoding = 'async',
}: {
  src: string;
  alt: string;
  className?: string;
  decoding?: 'async' | 'sync' | 'auto';
}) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding={decoding}
      referrerPolicy="no-referrer"
      className={className}
    />
  );
}

/**
 * Garis pemisah antar-section yang bereaksi terhadap gulir: semakin terisi
 * saat pengguna membaca. Memberi rasa kemajuan tanpa mengganggu.
 */
export function ReadingProgressLine() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        setVisible(entries[0]?.isIntersecting ?? false);
      },
      { threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`h-px w-full overflow-hidden bg-white/10 transition-opacity duration-500 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="h-full w-1/3 bg-gradient-to-r from-transparent via-sky-400/60 to-transparent" />
    </div>
  );
}
