import { useMemo } from 'react';
import { useReducedMotion } from 'react-native-reanimated';

import { useApp } from '@/store/app-store';

import { buildPalette } from './tokens';

export function useTheme() {
  const mode = useApp((s) => s.theme);
  const accent = useApp((s) => s.accent);
  const c = useMemo(() => buildPalette(mode, accent), [mode, accent]);
  return { c, mode, accent, isDark: mode === 'dark' };
}

/**
 * Motion scale: 1 normally, 0 when the user turned on "Reduce motion"
 * in-app or at the OS level. Multiply every duration by this.
 */
export function useMotion() {
  const appReduced = useApp((s) => s.reducedMotion);
  const osReduced = useReducedMotion();
  const reduced = appReduced || osReduced;
  return useMemo(() => ({ reduced, ms: (x: number) => (reduced ? 0 : x) }), [reduced]);
}
