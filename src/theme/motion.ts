import { Easing, FadeIn, FadeInDown, FadeInLeft, FadeInRight } from 'react-native-reanimated';

/** CSS `--ease-out: cubic-bezier(.2,.8,.2,1)` */
export const EASE_OUT = Easing.bezier(0.2, 0.8, 0.2, 1);
/** CSS `--ease-spring: cubic-bezier(.34,1.56,.64,1)` — overshoots slightly. */
export const EASE_SPRING = Easing.bezier(0.34, 1.56, 0.64, 1);
/** Long in-out used by the intro. */
export const EASE_IO = Easing.bezier(0.7, 0, 0.2, 1);
export const EASE_OUT_STRONG = Easing.bezier(0.2, 0.9, 0.1, 1);

type From = 'down' | 'left' | 'right' | 'fade';

/**
 * Staggered entrance used on every screen section in the prototype:
 * opacity 500ms + 18px slide 640ms, delayed 60ms + 55ms per index.
 * Returns `undefined` when motion is reduced so nothing animates.
 */
export function enter(i: number, reduced: boolean, from: From = 'down') {
  if (reduced) return undefined;
  const delay = 60 + i * 55;
  const base = from === 'right' ? FadeInRight : from === 'left' ? FadeInLeft : from === 'fade' ? FadeIn : FadeInDown;
  return base.delay(delay).duration(560).easing(EASE_OUT);
}
