import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { useTheme } from '@/theme/use-theme';

const THUMB = 24;

/** Accent range slider (CSS `<input type=range accent-color>`). */
export function Slider({
  min,
  max,
  step,
  value,
  onChange,
  label,
}: {
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
  label: string;
}) {
  const { c } = useTheme();
  const [w, setW] = useState(0);
  const x = useSharedValue(0);
  const span = Math.max(1, w - THUMB);

  useEffect(() => {
    x.set(((value - min) / (max - min)) * span);
  }, [value, min, max, span, x]);

  const emit = (px: number) => {
    const raw = min + (px / span) * (max - min);
    onChange(Math.min(max, Math.max(min, Math.round(raw / step) * step)));
  };

  const pan = Gesture.Pan()
    .activeOffsetX([-4, 4])
    .failOffsetY([-12, 12])
    .onBegin((e) => {
      x.set(Math.min(span, Math.max(0, e.x - THUMB / 2)));
      scheduleOnRN(emit, x.get());
    })
    .onUpdate((e) => {
      x.set(Math.min(span, Math.max(0, e.x - THUMB / 2)));
      scheduleOnRN(emit, x.get());
    });

  const thumb = useAnimatedStyle(() => ({ transform: [{ translateX: x.get() }] }));
  const fill = useAnimatedStyle(() => ({ width: x.get() + THUMB / 2 }));

  return (
    <GestureDetector gesture={pan}>
      <View
        accessible
        accessibilityRole="adjustable"
        accessibilityLabel={label}
        accessibilityValue={{ min, max, now: value }}
        accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
        onAccessibilityAction={(e) => onChange(Math.min(max, Math.max(min, value + (e.nativeEvent.actionName === 'increment' ? step * 5 : -step * 5))))}
        onLayout={(e) => setW(e.nativeEvent.layout.width)}
        style={{ height: 32, justifyContent: 'center' }}>
        <View style={{ height: 4, borderRadius: 2, backgroundColor: c.surface2 }}>
          <Animated.View style={[{ height: 4, borderRadius: 2, backgroundColor: c.accent }, fill]} />
        </View>
        <Animated.View
          style={[
            {
              position: 'absolute',
              left: 0,
              width: THUMB,
              height: THUMB,
              borderRadius: THUMB / 2,
              backgroundColor: c.accent,
              borderWidth: 3,
              borderColor: c.surface1,
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            },
            thumb,
          ]}
        />
      </View>
    </GestureDetector>
  );
}
