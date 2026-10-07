/**
 * Semantic design tokens, ported 1:1 from the IRONBUILD v2 prototype.
 * Screens read only these values — mode and accent swap at the root.
 */

export type ThemeMode = 'dark' | 'light';
export type AccentKey = 'volt' | 'ember' | 'ice';

export type Palette = {
  bg: string;
  surface1: string;
  surface2: string;
  line: string;
  lineStrong: string;
  glass: string;
  glassStrong: string;
  glassLine: string;
  navGlass: string;
  navHi: string;
  navLo: string;
  navPill: string;
  navPillHi: string;
  text1: string;
  text2: string;
  text3: string;
  scrim: string;
  ok: string;
  warn: string;
  err: string;
  info: string;
  accent: string;
  accentInk: string;
  accentText: string;
  accentSoft: string;
};

const dark: Omit<Palette, 'accent' | 'accentInk' | 'accentText' | 'accentSoft'> = {
  bg: '#111214',
  surface1: '#1a1b1e',
  surface2: '#25262a',
  line: 'rgba(255,255,255,0.08)',
  lineStrong: 'rgba(255,255,255,0.16)',
  glass: 'rgba(26,27,30,0.58)',
  glassStrong: 'rgba(17,18,20,0.78)',
  glassLine: 'rgba(255,255,255,0.14)',
  navGlass: 'rgba(32,33,37,0.42)',
  navHi: 'rgba(255,255,255,0.28)',
  navLo: 'rgba(0,0,0,0.35)',
  navPill: 'rgba(255,255,255,0.12)',
  navPillHi: 'rgba(255,255,255,0.22)',
  text1: '#f3f3ef',
  text2: '#a8a9a4',
  text3: '#7f807b',
  scrim: 'rgba(0,0,0,0.55)',
  ok: '#4cd98a',
  warn: '#f5b93a',
  err: '#ff6b6b',
  info: '#62a8ff',
};

const light: typeof dark = {
  bg: '#f4f3ef',
  surface1: '#ffffff',
  surface2: '#e8e7e1',
  line: 'rgba(17,18,20,0.08)',
  lineStrong: 'rgba(17,18,20,0.18)',
  glass: 'rgba(255,255,255,0.6)',
  glassStrong: 'rgba(255,255,255,0.82)',
  glassLine: 'rgba(17,18,20,0.1)',
  navGlass: 'rgba(255,255,255,0.5)',
  navHi: 'rgba(255,255,255,0.9)',
  navLo: 'rgba(17,18,20,0.12)',
  navPill: 'rgba(17,18,20,0.07)',
  navPillHi: 'rgba(255,255,255,0.7)',
  text1: '#121316',
  text2: '#55565a',
  text3: '#6f7074',
  scrim: 'rgba(20,20,15,0.35)',
  ok: '#15894f',
  warn: '#9a6200',
  err: '#c93434',
  info: '#1f6fd1',
};

type AccentSet = Pick<Palette, 'accent' | 'accentInk' | 'accentText' | 'accentSoft'>;

const accents: Record<AccentKey, Record<ThemeMode, AccentSet>> = {
  volt: {
    dark: { accent: '#d4ff3a', accentInk: '#0f1206', accentText: '#d4ff3a', accentSoft: 'rgba(212,255,58,0.12)' },
    light: { accent: '#d4ff3a', accentInk: '#0f1206', accentText: '#4a6600', accentSoft: 'rgba(140,180,0,0.14)' },
  },
  ember: {
    dark: { accent: '#ff6b2c', accentInk: '#1a0a02', accentText: '#ff7a3d', accentSoft: 'rgba(255,107,44,0.14)' },
    light: { accent: '#ff6b2c', accentInk: '#1a0a02', accentText: '#b93c08', accentSoft: 'rgba(255,107,44,0.14)' },
  },
  ice: {
    dark: { accent: '#62e2ff', accentInk: '#03171d', accentText: '#62e2ff', accentSoft: 'rgba(98,226,255,0.14)' },
    light: { accent: '#62e2ff', accentInk: '#03171d', accentText: '#0b6a80', accentSoft: 'rgba(98,226,255,0.14)' },
  },
};

export const ACCENT_SWATCHES: { key: AccentKey; color: string; label: string }[] = [
  { key: 'volt', color: '#d4ff3a', label: 'Volt' },
  { key: 'ember', color: '#ff6b2c', label: 'Ember' },
  { key: 'ice', color: '#62e2ff', label: 'Ice' },
];

export function buildPalette(mode: ThemeMode, accent: AccentKey): Palette {
  return { ...(mode === 'dark' ? dark : light), ...accents[accent][mode] };
}

/** Colors that never change with theme (photo overlays, splash). */
export const FIXED = {
  onPhoto: '#f3f3ef',
  splashBg: '#08090b',
  black: '#000000',
} as const;

export const MOTION = {
  fast: 180,
  base: 420,
  slow: 700,
} as const;
