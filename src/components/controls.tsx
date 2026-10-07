import { useEffect, useState } from 'react';
import { Pressable, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { font } from '@/theme/fonts';
import { EASE_SPRING } from '@/theme/motion';
import { useMotion, useTheme } from '@/theme/use-theme';

import { Icon } from './icon';
import { haptic, PressableScale } from './pressable-scale';

/* ───────────────────────── Switch ───────────────────────── */

/** 48×28 switch track with a 22px knob that springs across. */
export function SwitchKnob({ on }: { on: boolean }) {
  const { c } = useTheme();
  const { ms } = useMotion();
  const x = useSharedValue(on ? 20 : 0);
  useEffect(() => {
    x.set(withTiming(on ? 20 : 0, { duration: ms(300), easing: EASE_SPRING }));
  }, [on, x, ms]);
  const knob = useAnimatedStyle(() => ({ transform: [{ translateX: x.get() }] }));
  return (
    <View style={{ width: 48, height: 28, borderRadius: 14, padding: 3, backgroundColor: on ? c.accent : c.surface2 }}>
      <Animated.View style={[{ width: 22, height: 22, borderRadius: 11, backgroundColor: on ? c.accentInk : c.text2 }, knob]} />
    </View>
  );
}

/** A bare switch control (no label row). */
export function Switch({ on, onToggle, label }: { on: boolean; onToggle: () => void; label: string }) {
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={label}
      accessibilityState={{ checked: on }}
      hitSlop={8}
      onPress={() => {
        haptic('selection');
        onToggle();
      }}>
      <SwitchKnob on={on} />
    </Pressable>
  );
}

/* ───────────────────────── Chip ───────────────────────── */

export function Chip({
  label,
  on,
  onPress,
  height = 38,
  count,
}: {
  label: string;
  on: boolean;
  onPress: () => void;
  height?: number;
  count?: number;
}) {
  const { c } = useTheme();
  return (
    <PressableScale
      onPress={onPress}
      haptic="selection"
      scaleTo={0.94}
      accessibilityState={{ selected: on }}
      style={{
        height,
        paddingLeft: count === undefined ? 15 : 12,
        paddingRight: count === undefined ? 15 : 6,
        borderRadius: height / 2,
        borderWidth: 1,
        borderColor: on ? c.accent : c.line,
        backgroundColor: on ? c.accent : c.surface1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
      }}>
      <Text style={[font.body(600, count === undefined ? 13 : 12.5), { color: on ? c.accentInk : c.text1 }]}>{label}</Text>
      {count !== undefined && (
        <View
          style={{
            minWidth: 22,
            height: 22,
            paddingHorizontal: 6,
            borderRadius: 11,
            backgroundColor: on ? c.accentInk : c.surface2,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={[font.mono(700, 10), { color: on ? c.accent : c.text2 }]}>{count}</Text>
        </View>
      )}
    </PressableScale>
  );
}

/* ───────────────────────── Stepper ───────────────────────── */

export function Stepper({
  value,
  onInc,
  onDec,
  size = 34,
  minWidth = 20,
  surface,
  label = 'quantity',
}: {
  value: string | number;
  onInc: () => void;
  onDec: () => void;
  size?: number;
  minWidth?: number;
  surface?: 'bg' | 'surface1';
  label?: string;
}) {
  const { c } = useTheme();
  const iconSize = size >= 44 ? 19 : size >= 40 ? 17 : 17;
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        height: size,
        borderRadius: size >= 44 ? 14 : 11,
        backgroundColor: surface === 'surface1' ? c.surface1 : c.bg,
        borderWidth: 1,
        borderColor: c.line,
      }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Decrease ${label}`}
        onPress={() => {
          haptic('selection');
          onDec();
        }}
        style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="remove" size={iconSize} color={c.text1} />
      </Pressable>
      <Text
        accessibilityLiveRegion="polite"
        style={[font.mono(600, size >= 44 ? 15 : 13), { minWidth, textAlign: 'center', color: c.text1 }]}>
        {value}
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Increase ${label}`}
        onPress={() => {
          haptic('selection');
          onInc();
        }}
        style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="add" size={iconSize} color={c.text1} />
      </Pressable>
    </View>
  );
}

/* ───────────────────────── Radio option card ───────────────────────── */

export function RadioDot({ on }: { on: boolean }) {
  const { c } = useTheme();
  const { ms } = useMotion();
  const s = useSharedValue(on ? 1 : 0);
  useEffect(() => {
    s.set(withTiming(on ? 1 : 0, { duration: ms(300), easing: EASE_SPRING }));
  }, [on, s, ms]);
  const dot = useAnimatedStyle(() => ({ transform: [{ scale: s.get() }] }));
  return (
    <View
      style={{
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: on ? c.accent : c.lineStrong,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Animated.View style={[{ width: 10, height: 10, borderRadius: 5, backgroundColor: c.accent }, dot]} />
    </View>
  );
}

export function RadioCard({
  on,
  onPress,
  title,
  sub,
  right,
  rightMuted,
  height,
  style,
}: {
  on: boolean;
  onPress: () => void;
  title: string;
  sub?: string;
  right?: string;
  rightMuted?: boolean;
  height?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const { c } = useTheme();
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked: on }}
      onPress={() => {
        haptic('selection');
        onPress();
      }}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          padding: height ? 0 : 16,
          paddingHorizontal: height ? 14 : 16,
          height,
          borderRadius: height ? 15 : 18,
          borderWidth: 1.5,
          borderColor: on ? c.accent : c.line,
          backgroundColor: on ? c.accentSoft : c.surface1,
        },
        style,
      ]}>
      <RadioDot on={on} />
      <View style={{ flex: 1, gap: 3 }}>
        <Text style={[font.body(600, height ? 14 : 14.5), { color: c.text1 }]}>{title}</Text>
        {sub ? <Text style={[font.body(400, 12.5), { color: c.text2 }]}>{sub}</Text> : null}
      </View>
      {right ? (
        <Text style={rightMuted ? [font.mono(500, 12), { color: c.text3 }] : [font.mono(600, 13), { color: c.text1 }]}>{right}</Text>
      ) : null}
    </Pressable>
  );
}

/* ───────────────────────── Segmented control ───────────────────────── */

/** Pill segmented control with an accent thumb that springs between options. */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  width,
  height = 40,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  width?: number;
  height?: number;
}) {
  const { c } = useTheme();
  const { ms } = useMotion();
  const [w, setW] = useState(width ?? 0);
  const idx = Math.max(0, options.findIndex((o) => o.value === value));
  const seg = w > 0 ? (w - 8) / options.length : 0;
  const x = useSharedValue(idx * seg);
  useEffect(() => {
    x.set(withTiming(idx * seg, { duration: ms(420), easing: EASE_SPRING }));
  }, [idx, seg, x, ms]);
  const thumb = useAnimatedStyle(() => ({ transform: [{ translateX: x.get() }] }));

  return (
    <View
      accessibilityRole="tablist"
      onLayout={(e) => setW(e.nativeEvent.layout.width)}
      style={{ width, flexDirection: 'row', height, padding: 4, borderRadius: height >= 42 ? 13 : 12, backgroundColor: c.surface2 }}>
      {seg > 0 && (
        <Animated.View
          style={[{ position: 'absolute', top: 4, bottom: 4, left: 4, width: seg, borderRadius: 9.5, backgroundColor: c.accent }, thumb]}
        />
      )}
      {options.map((o) => {
        const on = o.value === value;
        return (
          <Pressable
            key={o.value}
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
            onPress={() => {
              haptic('selection');
              onChange(o.value);
            }}
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={[font.body(600, 13), { color: on ? c.accentInk : c.text2 }]}>{o.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

/* ───────────────────────── Checkbox ───────────────────────── */

export function Checkbox({ on }: { on: boolean }) {
  const { c } = useTheme();
  return (
    <View
      style={{
        width: 22,
        height: 22,
        borderRadius: 7,
        borderWidth: 1.5,
        borderColor: on ? c.accent : c.lineStrong,
        backgroundColor: on ? c.accent : 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Icon name="check" size={16} color={c.accentInk} style={{ opacity: on ? 1 : 0 }} />
    </View>
  );
}
