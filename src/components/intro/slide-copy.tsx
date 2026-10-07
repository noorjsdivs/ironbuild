import { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';

import { font } from '@/theme/fonts';
import { EASE_IO, EASE_OUT, EASE_OUT_STRONG } from '@/theme/motion';
import { FIXED } from '@/theme/tokens';
import { useTheme } from '@/theme/use-theme';

const LINE = 56;

/** Position of a slide relative to the active one: -1 above, 0 shown, 1 below. */
type Pos = -1 | 0 | 1;

function MaskedLine({ text, pos, delay, accent }: { text: string; pos: Pos; delay: number; accent?: boolean }) {
  const { c } = useTheme();
  const y = useSharedValue(pos);
  useEffect(() => {
    const on = pos === 0;
    y.set(withDelay(on ? delay : 0, withTiming(pos, { duration: on ? 820 : 520, easing: on ? EASE_OUT_STRONG : EASE_IO })));
  }, [pos, delay, y]);
  const style = useAnimatedStyle(() => ({ transform: [{ translateY: y.get() * LINE * 1.1 }] }));
  return (
    <View style={{ height: LINE, overflow: 'hidden' }}>
      <Animated.Text style={[font.display(800, 58, { lh: 0.9 }), { color: accent ? c.accent : FIXED.onPhoto, paddingTop: 4 }, style]}>{text}</Animated.Text>
    </View>
  );
}

/** Two-line onboarding headline; each line slides through its own mask. */
export function SlideHeadline({ l0, l1, pos, moved }: { l0: string; l1: string; pos: Pos; moved: boolean }) {
  return (
    <View style={{ position: 'absolute', inset: 0 }} accessibilityElementsHidden={pos !== 0} importantForAccessibility={pos === 0 ? 'auto' : 'no-hide-descendants'}>
      <MaskedLine text={l0} pos={pos} delay={moved ? 140 : 60} />
      <MaskedLine text={l1} pos={pos} delay={moved ? 220 : 160} accent />
    </View>
  );
}

/** Cross-fading text (eyebrow / subtitle) for the active slide. */
export function FadeCopy({ text, on, kind }: { text: string; on: boolean; kind: 'eyebrow' | 'sub' }) {
  const op = useSharedValue(on ? 1 : 0);
  useEffect(() => {
    op.set(withDelay(on ? (kind === 'sub' ? 300 : 180) : 0, withTiming(on ? 1 : 0, { duration: on ? 520 : 240, easing: EASE_OUT })));
  }, [on, op, kind]);
  const style = useAnimatedStyle(() => ({
    opacity: op.get(),
    transform: kind === 'sub' ? [{ translateY: (1 - op.get()) * 10 }] : [],
  }));
  return (
    <Animated.View style={[{ position: 'absolute', inset: 0 }, style]} importantForAccessibility={on ? 'auto' : 'no-hide-descendants'}>
      <Text
        numberOfLines={kind === 'sub' ? 3 : 1}
        style={
          kind === 'sub'
            ? [font.body(400, 14.5, { lh: 1.55 }), { color: 'rgba(243,243,239,0.72)', maxWidth: 320 }]
            : [font.mono(500, 10.5, { ls: 0.1, upper: true, lh: 1.33 }), { color: 'rgba(243,243,239,0.7)' }]
        }>
        {text}
      </Text>
    </Animated.View>
  );
}
