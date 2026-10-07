/**
 * Equivalent of CSS `color-mix(in oklch, <color> N%, transparent)` for hex
 * and rgba tokens — returns the same color at the given opacity.
 */
export function withAlpha(color: string, alpha: number): string {
  if (color.startsWith('#')) {
    const hex = color.length === 4 ? color.replace(/\w/g, (c) => c + c).slice(1) : color.slice(1, 7);
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }
  const m = color.match(/rgba?\(([^)]+)\)/);
  if (!m) return color;
  const [r, g, b, a = '1'] = m[1].split(',').map((x) => x.trim());
  return `rgba(${r},${g},${b},${Number(a) * alpha})`;
}
