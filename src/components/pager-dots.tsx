import { useEffect } from 'react';
import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { EASE_OUT } from '@/theme/motion';
import { useMotion, useTheme } from '@/theme/use-theme';

function Dot({ on, onPress, label, w, activeW, inactive }: { on: boolean; onPress: () => void; label: string; w: number; activeW: number; inactive: string }) {
  const { c } = useTheme();
  const { ms } = useMotion();
  const p = useSharedValue(on ? 1 : 0);
  useEffect(() => {
    p.set(withTiming(on ? 1 : 0, { duration: ms(400), easing: EASE_OUT }));
  }, [on, p, ms]);
  const style = useAnimatedStyle(() => ({
    width: w + (activeW - w) * p.get(),
    backgroundColor: interpolateColor(p.get(), [0, 1], [inactive, c.accent]),
  }));
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ selected: on }} onPress={onPress} hitSlop={{ top: 12, bottom: 12, left: 3, right: 3 }}>
      <Animated.View style={[{ height: 6, borderRadius: 3 }, style]} />
    </Pressable>
  );
}

/** Pill pager dots — the active one stretches (6 → 22px) and takes the accent. */
export function PagerDots({
  count,
  index,
  onPick,
  inactive = 'rgba(255,255,255,0.35)',
  size = 6,
  activeSize = 22,
  style,
}: {
  count: number;
  index: number;
  onPick: (i: number) => void;
  inactive?: string;
  size?: number;
  activeSize?: number;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[{ flexDirection: 'row', justifyContent: 'center', gap: 6 }, style]}>
      {Array.from({ length: count }, (_, i) => (
        <Dot key={i} on={i === index} onPress={() => onPick(i)} label={`Slide ${i + 1}`} w={size} activeW={activeSize} inactive={inactive} />
      ))}
    </View>
  );
}
