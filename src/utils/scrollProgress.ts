export function calculateScrollProgress(
  scrollY: number,
  scrollHeight: number,
  clientHeight: number
): number {
  const maxScrollable = scrollHeight - clientHeight;
  if (maxScrollable <= 0 || !Number.isFinite(maxScrollable)) {
    return 0;
  }

  const rawProgress = scrollY / maxScrollable;
  if (!Number.isFinite(rawProgress)) {
    return 0;
  }

  return Math.min(1, Math.max(0, rawProgress));
}
