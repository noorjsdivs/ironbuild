import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withSequence, withTiming } from 'react-native-reanimated';
import Svg, { Defs, Ellipse, RadialGradient, Stop } from 'react-native-svg';

import { useTheme } from '@/theme/use-theme';

const W = 300;
const H = 110;
const OUT = Easing.bezier(0.2, 0.9, 0.1, 1);
const PLATE_EASE = Easing.bezier(0.25, 1.25, 0.4, 1);

/** [x from the outer edge, width, height, color] — inner plate first. */
type PlateSpec = [number, number, number, string | 'accent'];
const PLATES: PlateSpec[] = [
  [38, 16, 104, 'accent'],
  [24, 14, 86, '#2b2e33'],
  [12, 12, 66, '#3b3f45'],
];

function Plate({ spec, side, i, loaded }: { spec: PlateSpec; side: -1 | 1; i: number; loaded: boolean }) {
  const { c } = useTheme();
  const [x, w, h, bg] = spec;
  const p = useSharedValue(0);
  useEffect(() => {
    p.set(loaded ? withDelay(i * 110, withTiming(1, { duration: 620, easing: PLATE_EASE })) : 0);
  }, [loaded, i, p]);
  const style = useAnimatedStyle(() => ({
    opacity: Math.min(1, p.get() * 3),
    transform: [{ translateX: (1 - p.get()) * side * 160 }, { rotate: `${(1 - p.get()) * side * 8}deg` }],
  }));
  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: side < 0 ? x : W - x - w,
          top: 55 - h / 2,
          width: w,
          height: h,
          borderRadius: 4,
          overflow: 'hidden',
          backgroundColor: bg === 'accent' ? c.accent : bg,
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.08)',
        },
        style,
      ]}>
      <LinearGradient
        colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0)', 'rgba(0,0,0,0.3)']}
        locations={[0, 0.45, 1]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={{ position: 'absolute', inset: 0 }}
      />
    </Animated.View>
  );
}

const steel = (colors: [string, string], horizontal = false) => (
  <LinearGradient colors={colors} start={horizontal ? { x: 0, y: 0.5 } : { x: 0.5, y: 0 }} end={horizontal ? { x: 1, y: 0.5 } : { x: 0.5, y: 1 }} style={{ flex: 1, borderRadius: 3 }} />
);

/**
 * The intro's barbell: the bar extends, plates swing in from both sides,
 * then the bar "slams" (squash + spring) and the accent collars lock on.
 */
export function Barbell({ stage, slam }: { stage: number; slam: number }) {
  const { c } = useTheme();
  const bar = useSharedValue(0);
  const shadow = useSharedValue(0);
  const collars = useSharedValue(0);
  const squash = useSharedValue(0);

  useEffect(() => {
    if (stage >= 1) bar.set(withTiming(1, { duration: 620, easing: OUT }));
    if (stage >= 2) shadow.set(withTiming(1, { duration: 700, easing: OUT }));
    if (stage >= 3) collars.set(withTiming(1, { duration: 260, easing: Easing.bezier(0.5, 0, 1, 0.6) }));
  }, [stage, bar, shadow, collars]);

  useEffect(() => {
    if (!slam) return;
    squash.set(
      withSequence(
        withTiming(1, { duration: 110, easing: Easing.bezier(0.6, 0, 1, 0.6) }),
        withTiming(0, { duration: 650, easing: Easing.bezier(0.3, 1.6, 0.5, 1) }),
      ),
    );
  }, [slam, squash]);

  const bellStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: squash.get() * 8 }, { scaleX: 1 + squash.get() * 0.025 }, { scaleY: 1 - squash.get() * 0.04 }],
  }));
  const barStyle = useAnimatedStyle(() => ({ opacity: Math.min(1, bar.get() * 3), transform: [{ scaleX: bar.get() }] }));
  const shadowStyle = useAnimatedStyle(() => ({ opacity: shadow.get(), transform: [{ scaleX: 0.3 + shadow.get() * 0.7 }] }));
  const leftCollar = useAnimatedStyle(() => ({ opacity: collars.get(), transform: [{ translateX: (1 - collars.get()) * -28 }] }));
  const rightCollar = useAnimatedStyle(() => ({ opacity: collars.get(), transform: [{ translateX: (1 - collars.get()) * 28 }] }));

  return (
    <Animated.View style={[{ width: W, height: H }, bellStyle]}>
      <Animated.View style={[{ position: 'absolute', left: 0, right: 0, top: 88, height: 32 }, shadowStyle]}>
        <Svg width={W} height={32}>
          <Defs>
            <RadialGradient id="shadow" cx="50%" cy="50%" rx="50%" ry="50%">
              <Stop offset="0" stopColor="#000" stopOpacity={0.7} />
              <Stop offset="1" stopColor="#000" stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Ellipse cx={W / 2} cy={16} rx={W / 2 - 10} ry={12} fill="url(#shadow)" />
        </Svg>
      </Animated.View>
      <Animated.View style={[{ position: 'absolute', inset: 0 }, barStyle]}>
        <View style={{ position: 'absolute', left: 0, width: 60, top: 50, height: 10 }}>{steel(['#cfd2d7', '#6f737a'])}</View>
        <View style={{ position: 'absolute', right: 0, width: 60, top: 50, height: 10 }}>{steel(['#cfd2d7', '#6f737a'])}</View>
        <View style={{ position: 'absolute', left: 60, width: 180, top: 52, height: 6 }}>{steel(['#eceef1', '#8a8e95'])}</View>
        <View style={{ position: 'absolute', left: 56, width: 6, top: 43, height: 24 }}>{steel(['#babec4', '#7b7f86'], true)}</View>
        <View style={{ position: 'absolute', left: 238, width: 6, top: 43, height: 24 }}>{steel(['#babec4', '#7b7f86'], true)}</View>
      </Animated.View>
      {([-1, 1] as const).flatMap((side) => PLATES.map((spec, i) => <Plate key={`${side}${i}`} spec={spec} side={side} i={i} loaded={stage >= 2} />))}
      <Animated.View style={[{ position: 'absolute', left: 4, width: 7, top: 45, height: 20, borderRadius: 2, backgroundColor: c.accent }, leftCollar]} />
      <Animated.View style={[{ position: 'absolute', right: 4, width: 7, top: 45, height: 20, borderRadius: 2, backgroundColor: c.accent }, rightCollar]} />
    </Animated.View>
  );
}
