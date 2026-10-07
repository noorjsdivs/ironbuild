import { useEffect } from 'react';
import Animated, { cancelAnimation, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

import { EASE_OUT } from '@/theme/motion';
import { useMotion, useTheme } from '@/theme/use-theme';

/** Expanding accent ring (CSS `ib-pulse`): scale 1 → 1.9 while fading out. */
export function PulseRing({ size, duration = 1800, repeat = true }: { size: number; duration?: number; repeat?: boolean }) {
  const { c } = useTheme();
  const { reduced } = useMotion();
  const p = useSharedValue(0);
  useEffect(() => {
    if (reduced) return;
    p.set(repeat ? withRepeat(withTiming(1, { duration, easing: EASE_OUT }), -1, false) : withTiming(1, { duration, easing: EASE_OUT }));
    return () => cancelAnimation(p);
  }, [p, duration, repeat, reduced]);
  const style = useAnimatedStyle(() => ({ opacity: 0.9 * (1 - p.get()), transform: [{ scale: 1 + 0.9 * p.get() }] }));
  if (reduced) return null;
  return (
    <Animated.View
      pointerEvents="none"
      style={[{ position: 'absolute', width: size, height: size, borderRadius: size / 2, borderWidth: 2, borderColor: c.accent }, style]}
    />
  );
}
