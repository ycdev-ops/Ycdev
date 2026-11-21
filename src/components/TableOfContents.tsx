import { useEffect, useState } from 'react';
import { ListTree } from 'lucide-react';

/**
 * Daftar isi mengambang: memetakan semua section halaman dan menyoroti
 * section yang sedang dibaca. Berguna di halaman sepanjang ini — pembaca
 * selalu tahu posisi dan bisa melompat tanpa menggulir manual.
 */
const SECTIONS: { id: string; label: string }[] = [
  { id: 'lab-3d', label: 'Laboratorium 3D' },
  { id: 'video-projek', label: 'Video Projek' },
  { id: 'live-demo', label: 'Demo Langsung' },
  { id: 'solusi-maritim', label: 'Solusi Maritim' },
  { id: 'layanan', label: 'Layanan' },
  { id: 'studi-kasus', label: 'Studi Kasus' },
  { id: 'profil-pendiri', label: 'Profil Pendiri' },
  { id: 'tim-ycdev', label: 'Tim' },
  { id: 'klien-partner', label: 'Klien & Partner' },
  { id: 'portal-klien', label: 'Portal Klien' },
  { id: 'estimasi', label: 'Estimasi Proyek' },
  { id: 'lokasi-3d', label: 'Peta & Lokasi' },
  { id: 'kontak', label: 'Kontak' },
];

export function TableOfContents() {
  const [active, setActive] = useState<string>('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      // Section dianggap aktif bila meliputi sepertengah viewport.
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    );

    for (const { id } of SECTIONS) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="Daftar isi halaman"
      className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 xl:block"
    >
      <div className="rounded-xl border border-white/10 bg-[#070A0F]/90 p-2 backdrop-blur-md shadow-2xl">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-[11px] font-semibold text-slate-200 transition-colors hover:bg-white/5 cursor-pointer"
        >
          <ListTree className="h-3.5 w-3.5 text-sky-400" aria-hidden="true" />
          <span>Daftar Isi</span>
          <span className="ml-auto font-mono text-[9px] text-ink-500">
            {SECTIONS.findIndex((s) => s.id === active) + 1 || 0}/{SECTIONS.length}
          </span>
        </button>

        <ol
          className={`mt-1 space-y-0.5 overflow-hidden transition-[max-height] duration-300 ${
            open ? 'max-h-[70vh]' : 'max-h-0'
          }`}
        >
          {SECTIONS.map((section, i) => {
            const isActive = active === section.id;
            return (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  aria-current={isActive ? 'true' : undefined}
                  className={`flex items-center gap-2 rounded-md px-2.5 py-1.5 text-[11px] leading-tight transition-colors ${
                    isActive
                      ? 'bg-[#2563EB]/20 text-white'
                      : 'text-ink-400 hover:bg-white/5 hover:text-slate-200'
                  }`}
                >
                  <span
                    className={`font-mono text-[9px] tabular-nums ${
                      isActive ? 'text-sky-300' : 'text-ink-500'
                    }`}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="truncate">{section.label}</span>
                </a>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
