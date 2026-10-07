import { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';

import { STEP_ICONS, STEPS } from '@/data/catalog';
import type { Order } from '@/data/types';
import { font } from '@/theme/fonts';
import { EASE_OUT, EASE_SPRING, enter } from '@/theme/motion';
import { useMotion, useTheme } from '@/theme/use-theme';

import { Icon } from './icon';
import { PulseRing } from './pulse-ring';

const NOTES = [
  'We’ve received your order and reserved your gear.',
  'Your items are boxed and waiting for the courier.',
  'Your courier is on the way — track the van on the map above.',
  '',
];

function Step({ order, i }: { order: Order; i: number }) {
  const { c } = useTheme();
  const { reduced, ms } = useMotion();
  const canc = order.step === 4;
  const done = !canc && i <= order.step;
  const current = !canc && i === order.step && order.step < 3;
  const lineFull = !canc && i < order.step;
  const dot = useSharedValue(reduced ? 1 : 0.5);
  const line = useSharedValue(0);

  useEffect(() => {
    dot.set(withDelay(ms(150 + i * 180), withTiming(1, { duration: ms(520), easing: EASE_SPRING })));
    line.set(withDelay(ms(260 + i * 180), withTiming(lineFull ? 1 : 0, { duration: ms(500), easing: EASE_OUT })));
  }, [dot, line, i, lineFull, ms]);

  const dotStyle = useAnimatedStyle(() => ({ transform: [{ scale: dot.get() }] }));
  const lineStyle = useAnimatedStyle(() => ({ height: `${line.get() * 100}%` }));
  const time = order.times[i] ?? (i === order.step + 1 && !canc ? 'Up next' : 'Pending');

  return (
    <Animated.View entering={enter(1 + i, reduced, 'left')} style={{ flexDirection: 'row', gap: 14 }}>
      <View style={{ alignItems: 'center', width: 40 }}>
        <Animated.View
          style={[
            {
              width: 40,
              height: 40,
              borderRadius: 20,
              borderWidth: 2,
              borderColor: done ? c.accent : c.lineStrong,
              backgroundColor: done ? c.accent : c.surface1,
              alignItems: 'center',
              justifyContent: 'center',
            },
            dotStyle,
          ]}>
          {current ? <PulseRing size={40} /> : null}
          <Icon name={STEP_ICONS[i]} size={19} filled={done} color={done ? c.accentInk : c.text3} />
        </Animated.View>
        {i < 3 ? (
          <View style={{ flex: 1, width: 2, minHeight: 30, backgroundColor: c.surface2, overflow: 'hidden' }}>
            <Animated.View style={[{ width: '100%', backgroundColor: c.accent }, lineStyle]} />
          </View>
        ) : null}
      </View>
      <View style={{ flex: 1, gap: 3, paddingTop: 9, paddingBottom: 22 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', gap: 10 }}>
          <Text style={[font.body(600, 15), { color: done ? c.text1 : c.text3, flexShrink: 1 }]}>{STEPS[i]}</Text>
          <Text style={[font.mono(500, 10.5), { color: c.text3 }]}>{time}</Text>
        </View>
        {current ? <Text style={[font.body(400, 12.5, { lh: 1.45 }), { color: c.text2 }]}>{NOTES[i]}</Text> : null}
      </View>
    </Animated.View>
  );
}

/** Vertical delivery timeline with filling connector lines and a pulsing current step. */
export function OrderTimeline({ order }: { order: Order }) {
  return (
    <View accessibilityRole="list">
      {STEPS.map((_, i) => (
        <Step key={i} order={order} i={i} />
      ))}
    </View>
  );
}
