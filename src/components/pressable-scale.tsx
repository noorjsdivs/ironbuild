import * as Haptics from 'expo-haptics';
import type { Ref } from 'react';
import { Pressable, type PressableProps, type StyleProp, type View, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { useMotion } from '@/theme/use-theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type PressableScaleProps = Omit<PressableProps, 'style'> & {
  ref?: Ref<View>;
  style?: StyleProp<ViewStyle>;
  /** Scale while pressed (CSS `style-active="transform:scale(.94)"`). */
  scaleTo?: number;
  haptic?: 'light' | 'medium' | 'selection' | false;
};

export function haptic(kind: 'light' | 'medium' | 'selection' | 'success' | 'warning') {
  if (kind === 'selection') return void Haptics.selectionAsync();
  if (kind === 'success') return void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  if (kind === 'warning') return void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  void Haptics.impactAsync(kind === 'medium' ? Haptics.ImpactFeedbackStyle.Medium : Haptics.ImpactFeedbackStyle.Light);
}

/** Pressable with the prototype's press-down scale and an optional haptic tick. */
export function PressableScale({
  ref,
  scaleTo = 0.96,
  haptic: hapticKind = false,
  style,
  onPressIn,
  onPressOut,
  onPress,
  ...rest
}: PressableScaleProps) {
  const { reduced } = useMotion();
  const scale = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: scale.get() }] }));

  return (
    <AnimatedPressable
      ref={ref}
      accessibilityRole="button"
      onPressIn={(e) => {
        if (!reduced) scale.set(withTiming(scaleTo, { duration: 150 }));
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        scale.set(withTiming(1, { duration: 150 }));
        onPressOut?.(e);
      }}
      onPress={(e) => {
        if (hapticKind) haptic(hapticKind);
        onPress?.(e);
      }}
      style={[style, anim]}
      {...rest}
    />
  );
}
