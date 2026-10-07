import { useEffect } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';

import { EASE_OUT } from '@/theme/motion';
import { useMotion, useTheme } from '@/theme/use-theme';

/** Thin accent progress track; animates its width whenever `pct` changes. */
export function ProgressBar({
  pct,
  height = 6,
  duration = 700,
  delay = 0,
  color,
  style,
}: {
  pct: number;
  height?: number;
  duration?: number;
  delay?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}) {
  const { c } = useTheme();
  const { ms } = useMotion();
  const w = useSharedValue(0);
  useEffect(() => {
    w.set(withDelay(ms(delay), withTiming(Math.max(0, Math.min(100, pct)), { duration: ms(duration), easing: EASE_OUT })));
  }, [pct, w, ms, duration, delay]);
  const fill = useAnimatedStyle(() => ({ width: `${w.get()}%` }));
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(pct) }}
      style={[{ height, borderRadius: height / 2, backgroundColor: c.surface2, overflow: 'hidden' }, style]}>
      <Animated.View style={[{ height: '100%', borderRadius: height / 2, backgroundColor: color ?? c.accent }, fill]} />
    </View>
  );
}
