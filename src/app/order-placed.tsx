import { router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, { useAnimatedProps, useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

import { Button } from '@/components/button';
import { ScreenStatusBar, useBottomGap } from '@/components/chrome';
import { money } from '@/lib/format';
import { orderTotal } from '@/lib/pricing';
import { useApp, useProductLookup } from '@/store/app-store';
import { font } from '@/theme/fonts';
import { EASE_OUT, EASE_SPRING, enter } from '@/theme/motion';
import { useMotion, useTheme } from '@/theme/use-theme';

const AnimatedPath = Animated.createAnimatedComponent(Path);

export default function OrderPlacedScreen() {
  const { no } = useLocalSearchParams<{ no: string }>();
  const { c } = useTheme();
  const { reduced, ms } = useMotion();
  const bottom = useBottomGap(24);
  const order = useApp((s) => s.orders.find((o) => o.no === no) ?? s.orders[0]);
  const freeAt = useApp((s) => s.freeAt);
  const rates = useApp((s) => s.rates);
  const byId = useProductLookup();

  const badge = useSharedValue(reduced ? 1 : 0.3);
  const ring = useSharedValue(reduced ? 1 : 0);
  const dash = useSharedValue(reduced ? 0 : 22);

  useEffect(() => {
    badge.set(withDelay(ms(120), withTiming(1, { duration: ms(700), easing: EASE_SPRING })));
    ring.set(withDelay(ms(300), withTiming(1, { duration: ms(1000), easing: EASE_OUT })));
    dash.set(withDelay(ms(500), withTiming(0, { duration: ms(450), easing: EASE_OUT })));
  }, [badge, ring, dash, ms]);

  const badgeStyle = useAnimatedStyle(() => ({ transform: [{ scale: badge.get() }] }));
  const ringStyle = useAnimatedStyle(() => ({ opacity: 0.9 * (1 - ring.get()), transform: [{ scale: 0.8 + 1.1 * ring.get() }] }));
  const pathProps = useAnimatedProps(() => ({ strokeDashoffset: dash.get() }));

  return (
    <View style={{ flex: 1, backgroundColor: c.bg, paddingHorizontal: 24, paddingBottom: bottom + 16 }}>
      <ScreenStatusBar />
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <View style={{ width: 112, height: 112, alignItems: 'center', justifyContent: 'center' }}>
          <Animated.View style={[{ position: 'absolute', inset: 0, borderRadius: 56, borderWidth: 2, borderColor: c.accent }, ringStyle]} />
          <Animated.View style={[{ width: 112, height: 112, borderRadius: 56, backgroundColor: c.accent, alignItems: 'center', justifyContent: 'center' }, badgeStyle]}>
            <Svg width={54} height={54} viewBox="0 0 24 24" fill="none">
              <AnimatedPath
                d="M5 12.5l4.5 4.5L19 7"
                stroke={c.accentInk}
                strokeWidth={2.6}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={22}
                animatedProps={pathProps}
              />
            </Svg>
          </Animated.View>
        </View>
        <Animated.Text entering={enter(3, reduced)} accessibilityRole="header" style={[font.display(800, 46, { lh: 0.95 }), { color: c.text1, marginTop: 12 }]}>
          Order placed
        </Animated.Text>
        <Animated.Text entering={enter(4, reduced)} style={[font.body(400, 15, { lh: 1.5 }), { color: c.text2, maxWidth: 280, textAlign: 'center' }]}>
          {`Arriving ${order?.etaShort ?? 'soon'}. We’ll send updates as your gear moves.`}
        </Animated.Text>
        {order ? (
          <Animated.View entering={enter(5, reduced)} style={{ flexDirection: 'row', gap: 8 }}>
            {[order.no, money(orderTotal(order, byId, freeAt, rates))].map((v) => (
              <View key={v} style={{ paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10, backgroundColor: c.surface1, borderWidth: 1, borderColor: c.line }}>
                <Text style={[font.mono(600, 12), { color: c.text1 }]}>{v}</Text>
              </View>
            ))}
          </Animated.View>
        ) : null}
      </View>
      <Animated.View entering={enter(6, reduced)} style={{ gap: 10 }}>
        <Button label="Track order" height={58} onPress={() => order && router.push({ pathname: '/track/[no]', params: { no: order.no } })} />
        <Button
          label="Continue shopping"
          variant="outline"
          height={52}
          weight={600}
          fontSize={14.5}
          onPress={() => {
            router.dismissAll();
            router.navigate('/');
          }}
        />
      </Animated.View>
    </View>
  );
}
