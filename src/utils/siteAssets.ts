// Base URL situs, dihitung dari lokasi halaman saat ini.
//
// Dulu semua aset memakai path absolut ("/assets/..."), yang benar hanya bila
// situs di-host di domain root. Sekarang situs juga hidup di sub-path
// (mis. https://ycdev-ops.github.io/Ycdev/), sehingga path harus ditarik dari
// window.location supaya berfungsi di root DAN sub-path sekaligus.
const PATH = window.location.pathname;

function lastNonEmptySegment(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  return segments.length > 0 ? segments[segments.length - 1] : '';
}

function isAssetOrKnownRoutePath(pathname: string): boolean {
  const seg = lastNonEmptySegment(pathname);
  if (!seg) return false;
  if (seg.endsWith('.html')) return true;
  return /^(assets|src|favicon|robots|manifest|404)/.test(seg);
}

// pathType: 'hash'  -> host root, navigasi pakai /#/laman  (basis "/")
//           'path'  -> host sub-path, navigasi pakai /laman (basis "/sub/")
export function resolveBasePath(): string {
  const { pathname, hash } = window.location;
  const trimmed = pathname.replace(/\/+$/, '');

  if (hash.startsWith('#/')) return '/';
  if (!trimmed) return '/';

  if (isAssetOrKnownRoutePath(trimmed)) {
    const idx = trimmed.lastIndexOf('/');
    return idx === 0 ? '/' : trimmed.slice(0, idx + 1);
  }

  return trimmed + '/';
}

export function assetUrl(path: string): string {
  const base = resolveBasePath();
  if (/^https?:\/\//i.test(path)) return path;
  const normalized = path.startsWith('/') ? path.slice(1) : path;
  return normalized ? `${base}${normalized}` : base;
}
