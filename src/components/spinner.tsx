import { useEffect } from 'react';
import Animated, { cancelAnimation, Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

/** 18px ring with a transparent right edge, rotating every 700ms. */
export function Spinner({ color, size = 18 }: { color: string; size?: number }) {
  const r = useSharedValue(0);
  useEffect(() => {
    r.set(withRepeat(withTiming(360, { duration: 700, easing: Easing.linear }), -1, false));
    return () => cancelAnimation(r);
  }, [r]);
  const style = useAnimatedStyle(() => ({ transform: [{ rotate: `${r.get()}deg` }] }));
  return (
    <Animated.View
      accessibilityRole="progressbar"
      style={[
        { width: size, height: size, borderRadius: size / 2, borderWidth: 2.5, borderColor: color, borderRightColor: 'transparent' },
        style,
      ]}
    />
  );
}
