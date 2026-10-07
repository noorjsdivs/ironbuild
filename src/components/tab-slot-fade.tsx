import type { TabSlotProps } from 'expo-router/ui';
import { useEffect, type ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Screen } from 'react-native-screens';

import { EASE_OUT } from '@/theme/motion';
import { useMotion } from '@/theme/use-theme';

function FadeIn({ focused, children }: { focused: boolean; children: ReactNode }) {
  const { ms } = useMotion();
  const p = useSharedValue(focused ? 1 : 0);
  useEffect(() => {
    if (focused) {
      p.set(0);
      p.set(withTiming(1, { duration: ms(520), easing: EASE_OUT }));
    }
  }, [focused, p, ms]);
  const style = useAnimatedStyle(() => ({
    opacity: Math.min(1, p.get() * 1.45),
    transform: [{ translateY: (1 - p.get()) * 14 }, { scale: 0.985 + p.get() * 0.015 }],
  }));
  return <Animated.View style={[StyleSheet.absoluteFill, style]}>{children}</Animated.View>;
}

/**
 * Tab screens cross-fade in with a small lift (prototype: translateY 14px,
 * scale .985 → none). Visited tabs stay mounted, like native tab bars.
 */
export const fadeTabRender: NonNullable<TabSlotProps['renderFn']> = (descriptor, { isFocused, loaded, detachInactiveScreens }) => {
  const { lazy = true } = descriptor.options;
  if (lazy && !loaded && !isFocused) return null;
  return (
    <Screen
      key={descriptor.route.key}
      enabled={detachInactiveScreens}
      activityState={isFocused ? 2 : 0}
      style={[StyleSheet.absoluteFill, { zIndex: isFocused ? 1 : 0 }]}>
      <FadeIn focused={isFocused}>{descriptor.render()}</FadeIn>
    </Screen>
  );
};
