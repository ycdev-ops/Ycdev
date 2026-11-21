import type { LucideIcon } from 'lucide-react';

/**
 * Kepala section yang konsisten: label kode, judul, dan deskripsi.
 * Dipakai di semua section agar ritme visual dan hierarki judul seragam.
 */
export function SectionHeader({
  eyebrow,
  title,
  description,
  icon: Icon,
  align = 'left',
}: {
  eyebrow: string;
  title: string;
  description?: string;
  icon?: LucideIcon;
  align?: 'left' | 'center';
}) {
  return (
    <div
      className={
        align === 'center'
          ? 'mx-auto max-w-3xl text-center'
          : 'max-w-2xl'
      }
    >
      <p
        className={`eyebrow-tag inline-flex items-center gap-2 ${
          align === 'center' ? 'justify-center' : ''
        }`}
      >
        {Icon ? <Icon className="h-3.5 w-3.5" aria-hidden="true" /> : null}
        {eyebrow}
      </p>
      <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white text-balance lg:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-sm leading-relaxed text-ink-400 lg:text-base">
          {description}
        </p>
      ) : null}
    </div>
  );
}

/**
 * Penomoran section bergaya indeks (01, 02, ...) — memperkuat kesan
 * dokumentasi teknis dan memudahkan rujuk silang.
 */
export function SectionIndex({
  index,
  total,
  className = '',
}: {
  index: number;
  total?: number;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`font-mono text-[10px] font-medium tracking-[0.2em] text-ink-500 ${className}`}
    >
      {String(index).padStart(2, '0')}
      {total ? ` / ${String(total).padStart(2, '0')}` : ''}
    </span>
  );
}
