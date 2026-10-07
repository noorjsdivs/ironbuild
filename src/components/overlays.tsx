import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scheduleOnRN } from 'react-native-worklets';

import { useUI, type Toast } from '@/store/ui-store';
import { font } from '@/theme/fonts';
import { EASE_OUT, EASE_SPRING } from '@/theme/motion';
import { useMotion, useTheme } from '@/theme/use-theme';

import { Glass } from './glass';
import { Icon } from './icon';

const TOAST_MS = 2600;

/** Top glass toast: springs down, auto-hides after 2.6s, optional action. */
export function ToastHost() {
  const { c } = useTheme();
  const { ms } = useMotion();
  const insets = useSafeAreaInsets();
  const toast = useUI((s) => s.toast);
  const hide = useUI((s) => s.hideToast);
  // Keep the last toast rendered while it animates out.
  const [shown, setShown] = useState<Toast | null>(null);
  const y = useSharedValue(-160);
  const op = useSharedValue(0);

  if (toast && toast !== shown) setShown(toast);

  useEffect(() => {
    if (toast) {
      y.set(withTiming(0, { duration: ms(480), easing: EASE_SPRING }));
      op.set(withTiming(1, { duration: ms(300), easing: EASE_OUT }));
      const t = setTimeout(hide, TOAST_MS);
      return () => clearTimeout(t);
    }
    y.set(withTiming(-160, { duration: ms(480), easing: EASE_SPRING }));
    op.set(withTiming(0, { duration: ms(300), easing: EASE_OUT }));
  }, [toast, hide, y, op, ms]);

  const style = useAnimatedStyle(() => ({ opacity: op.get(), transform: [{ translateY: y.get() }] }));
  if (!shown) return null;

  return (
    <Animated.View
      pointerEvents={toast ? 'box-none' : 'none'}
      accessibilityLiveRegion="polite"
      style={[{ position: 'absolute', top: insets.top + 2, left: 14, right: 14, zIndex: 85 }, style]}>
      <Glass
        tone="strong"
        style={{
          borderRadius: 18,
          borderWidth: 1,
          borderColor: c.glassLine,
          padding: 10,
          paddingLeft: 14,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          boxShadow: '0 16px 40px rgba(0,0,0,0.3)',
        }}>
        <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: c.accent, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name={shown.icon ?? 'check'} size={20} color={c.accentInk} />
        </View>
        <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
          <Text style={[font.body(600, 13.5), { color: c.text1 }]}>{shown.title}</Text>
          {shown.sub ? (
            <Text numberOfLines={1} style={[font.body(400, 12), { color: c.text2 }]}>
              {shown.sub}
            </Text>
          ) : null}
        </View>
        {shown.action ? (
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              hide();
              shown.action?.onPress();
            }}
            style={{ height: 34, paddingHorizontal: 12, borderRadius: 10, backgroundColor: c.text1, justifyContent: 'center' }}>
            <Text style={[font.body(600, 12.5), { color: c.bg }]}>{shown.action.label}</Text>
          </Pressable>
        ) : null}
      </Glass>
    </Animated.View>
  );
}

const FLY_MS = 720;
const DOT = 40;

/**
 * Fly-to-cart: X and Y animate with different curves so the "+1" dot
 * travels an arc (CSS used separate transitions on nested elements).
 */
export function FlyToCart() {
  const { c } = useTheme();
  const fly = useUI((s) => s.fly);
  const end = useUI((s) => s.endFly);
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const s = useSharedValue(1);
  const op = useSharedValue(0);

  useEffect(() => {
    if (!fly) return;
    const fx = fly.from.x + fly.from.w / 2 - DOT / 2;
    const fy = fly.from.y + fly.from.h / 2 - DOT / 2;
    const tx = fly.to.x + fly.to.w / 2 - DOT / 2;
    const ty = fly.to.y + fly.to.h / 2 - DOT / 2;
    const finish = () => {
      fly.onDone?.();
      end();
    };
    x.set(fx);
    y.set(fy);
    s.set(1);
    op.set(1);
    x.set(withTiming(tx, { duration: FLY_MS, easing: Easing.bezier(0.45, 0, 0.55, 1) }));
    s.set(withTiming(0.45, { duration: FLY_MS, easing: EASE_OUT }));
    y.set(
      withTiming(ty, { duration: FLY_MS, easing: Easing.bezier(0.5, -0.6, 0.7, 0.9) }, (ok) => {
        if (ok) scheduleOnRN(finish);
      }),
    );
    op.set(withDelay(FLY_MS, withTiming(0, { duration: 60 })));
  }, [fly, end, x, y, s, op]);

  const style = useAnimatedStyle(() => ({
    opacity: op.get(),
    transform: [{ translateX: x.get() }, { translateY: y.get() }, { scale: s.get() }],
  }));

  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, { zIndex: 80 }]}>
      <Animated.View
        style={[
          {
            position: 'absolute',
            left: 0,
            top: 0,
            width: DOT,
            height: DOT,
            borderRadius: DOT / 2,
            backgroundColor: c.accent,
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(0,0,0,0.35)',
          },
          style,
        ]}>
        <Text style={[font.mono(700, 12), { color: c.accentInk }]}>+1</Text>
      </Animated.View>
    </View>
  );
}
