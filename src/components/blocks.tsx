import { Image, type ImageStyle } from 'expo-image';
import type { ReactNode, Ref } from 'react';
import { Pressable, Text, TextInput, View, type StyleProp, type TextInputProps, type ViewStyle } from 'react-native';

import { withAlpha } from '@/lib/color';
import { font } from '@/theme/fonts';
import { useTheme } from '@/theme/use-theme';

import { Button } from './button';
import { SwitchKnob } from './controls';
import { Icon, type IconName } from './icon';
import { haptic } from './pressable-scale';

/** Product / banner photo with disk caching and a soft fade-in. */
export function Photo({ uri, style, contentFit = 'cover' }: { uri: string; style?: StyleProp<ImageStyle>; contentFit?: 'cover' | 'contain' }) {
  return <Image source={{ uri }} style={style} contentFit={contentFit} transition={200} cachePolicy="memory-disk" recyclingKey={uri} />;
}

/** Small uppercase mono label above a group ("MY ACCOUNT", "DELIVERY"). */
export function SectionLabel({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const { c } = useTheme();
  return (
    <View style={style}>
      <Text accessibilityRole="header" style={[font.eyebrow(), { color: c.text3 }]}>
        {children}
      </Text>
    </View>
  );
}

/** Display-face section heading with an optional right action ("SEE ALL →"). */
export function SectionHeader({
  title,
  action,
  onAction,
  meta,
  size = 22,
  style,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
  meta?: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const { c } = useTheme();
  return (
    <View style={[{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' }, style]}>
      <Text accessibilityRole="header" style={[font.display(700, size), { color: c.text1 }]}>
        {title}
      </Text>
      {action ? (
        <Pressable accessibilityRole="button" onPress={onAction} hitSlop={10} style={{ paddingVertical: 6 }}>
          <Text style={[font.mono(600, 11, { ls: 0.06, upper: true }), { color: c.accentText }]}>{action}</Text>
        </Pressable>
      ) : meta ? (
        <Text style={[font.mono(500, 10.5), { color: c.text3 }]}>{meta}</Text>
      ) : null}
    </View>
  );
}

/** Rounded surface-1 container with a hairline border. */
export function Card({ children, style, radius = 18 }: { children: ReactNode; style?: StyleProp<ViewStyle>; radius?: number }) {
  const { c } = useTheme();
  return (
    <View style={[{ borderRadius: radius, borderWidth: 1, borderColor: c.line, backgroundColor: c.surface1, overflow: 'hidden' }, style]}>
      {children}
    </View>
  );
}

/** Settings-style list row with icon tile, title, subtitle and chevron. */
export function MenuRow({
  icon,
  title,
  sub,
  badge,
  onPress,
  last,
  tile = 'surface',
}: {
  icon?: IconName;
  title: string;
  sub?: string;
  badge?: string;
  onPress: () => void;
  last?: boolean;
  tile?: 'surface' | 'accent';
}) {
  const { c } = useTheme();
  const accentTile = tile === 'accent';
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 13,
        paddingHorizontal: 14,
        borderBottomWidth: last ? 0 : 1,
        borderBottomColor: c.line,
        backgroundColor: pressed ? c.surface2 : 'transparent',
      })}>
      {icon ? (
        <View
          style={{
            width: accentTile ? 40 : 36,
            height: accentTile ? 40 : 36,
            borderRadius: accentTile ? 12 : 11,
            backgroundColor: accentTile ? c.accentSoft : c.surface2,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Icon name={icon} size={accentTile ? 22 : 20} color={accentTile ? c.accentText : c.text1} />
        </View>
      ) : null}
      <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
        <Text style={[font.body(600, accentTile ? 14.5 : 14), { color: c.text1 }]}>{title}</Text>
        {sub ? (
          <Text numberOfLines={1} style={[font.body(400, 12), { color: c.text2 }]}>
            {sub}
          </Text>
        ) : null}
      </View>
      {badge ? <Pill label={badge} bg={c.accentSoft} fg={c.accentText} /> : null}
      <Icon name="chevron_right" size={20} color={c.text3} />
    </Pressable>
  );
}

/** Row with title/subtitle and a trailing switch (whole row toggles). */
export function ToggleRow({
  title,
  sub,
  on,
  onToggle,
  last,
  compact,
}: {
  title: string;
  sub?: string;
  on: boolean;
  onToggle: () => void;
  last?: boolean;
  compact?: boolean;
}) {
  const { c } = useTheme();
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: on }}
      accessibilityLabel={title}
      onPress={() => {
        haptic('selection');
        onToggle();
      }}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        paddingVertical: compact ? 12 : 14,
        paddingHorizontal: 14,
        borderBottomWidth: last ? 0 : 1,
        borderBottomColor: c.line,
      }}>
      <View style={{ flex: 1, gap: 3 }}>
        <Text style={[font.body(600, compact ? 13.5 : 14), { color: c.text1 }]}>{title}</Text>
        {sub ? <Text style={[font.body(400, 12), { color: c.text2 }]}>{sub}</Text> : null}
      </View>
      <SwitchKnob on={on} />
    </Pressable>
  );
}

/** Small rounded status pill ("SHIPPED", "DEFAULT", "12 left"). */
export function Pill({
  label,
  bg,
  fg,
  dot,
  size = 'sm',
  upper = true,
}: {
  label: string;
  bg: string;
  fg: string;
  dot?: boolean;
  size?: 'xs' | 'sm' | 'md';
  upper?: boolean;
}) {
  const pad = size === 'xs' ? { paddingVertical: 3, paddingHorizontal: 7, borderRadius: 6 } : size === 'md' ? { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 9 } : { paddingVertical: 4, paddingHorizontal: 8, borderRadius: 7 };
  const fs = size === 'xs' ? 9 : size === 'md' ? 10 : 9.5;
  return (
    <View style={[{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: bg }, pad, dot && { paddingLeft: pad.paddingHorizontal - 2 }]}>
      {dot ? <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: fg }} /> : null}
      <Text style={[font.mono(600, fs, { ls: upper ? 0.04 : 0, upper }), { color: fg }]}>{label}</Text>
    </View>
  );
}

/** Tinted status pill: `color` at 16% opacity behind `color` text. */
export function StatusPill({ label, color, dot, size, upper }: { label: string; color: string; dot?: boolean; size?: 'xs' | 'sm' | 'md'; upper?: boolean }) {
  return <Pill label={label} bg={withAlpha(color, 0.16)} fg={color} dot={dot} size={size} upper={upper} />;
}

/** Dashed empty-state panel with optional CTA. */
export function EmptyState({
  icon,
  iconColor,
  iconFilled,
  title,
  body,
  cta,
  onCta,
  style,
}: {
  icon?: IconName;
  iconColor?: string;
  iconFilled?: boolean;
  title: string;
  body: string;
  cta?: string;
  onCta?: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  const { c } = useTheme();
  return (
    <View
      style={[
        {
          paddingVertical: 32,
          paddingHorizontal: 20,
          borderRadius: 24,
          borderWidth: 1,
          borderStyle: 'dashed',
          borderColor: c.lineStrong,
          alignItems: 'center',
          gap: 10,
        },
        style,
      ]}>
      {icon ? <Icon name={icon} size={48} color={iconColor ?? c.accentText} filled={iconFilled} /> : null}
      <Text style={[font.display(800, 28), { color: c.text1, textAlign: 'center' }]}>{title}</Text>
      <Text style={[font.body(400, 14, { lh: 1.5 }), { color: c.text2, maxWidth: 240, textAlign: 'center' }]}>{body}</Text>
      {cta ? <Button label={cta} onPress={onCta} height={44} radius={14} weight={600} fontSize={14} style={{ marginTop: 6, paddingHorizontal: 18 }} /> : null}
    </View>
  );
}

/** Boxed field with an uppercase mono label above the input. */
export function Field({ label, ...input }: { label: string } & TextInputProps) {
  const { c } = useTheme();
  return (
    <View style={{ gap: 6, paddingVertical: 12, paddingHorizontal: 14, borderRadius: 16, borderWidth: 1, borderColor: c.line, backgroundColor: c.surface1 }}>
      <Text style={[font.mono(500, 10.5, { ls: 0.06, upper: true }), { color: c.text3 }]}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={c.text3}
        selectionColor={c.accentText}
        style={[font.body(500, 15), { color: c.text1, padding: 0 }]}
        {...input}
      />
    </View>
  );
}

/** Search box used in Shop and admin lists. */
export function SearchBox({
  value,
  onChangeText,
  placeholder,
  height = 46,
  right,
  inputRef,
  autoFocus,
}: {
  value: string;
  onChangeText: (v: string) => void;
  placeholder: string;
  height?: number;
  right?: ReactNode;
  inputRef?: Ref<TextInput>;
  autoFocus?: boolean;
}) {
  const { c } = useTheme();
  const big = height >= 50;
  return (
    <View
      style={{
        flex: 1,
        minWidth: 0,
        height,
        borderRadius: big ? 16 : 14,
        backgroundColor: c.surface1,
        borderWidth: 1,
        borderColor: c.line,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingLeft: 14,
        paddingRight: right ? 6 : 14,
      }}>
      <Icon name="search" size={big ? 23 : 20} color={c.text3} />
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={c.text3}
        selectionColor={c.accentText}
        returnKeyType="search"
        autoCorrect={false}
        autoFocus={autoFocus}
        accessibilityLabel={placeholder}
        style={[font.body(500, big ? 15 : 14), { flex: 1, minWidth: 0, height: '100%', color: c.text1, padding: 0 }]}
      />
      {right}
    </View>
  );
}

/** Label / mono value row used in order summaries. */
export function SummaryRow({ label, value, size = 14 }: { label: string; value: string; size?: number }) {
  const { c } = useTheme();
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
      <Text style={[font.body(500, size), { color: c.text2 }]}>{label}</Text>
      <Text style={[font.mono(500, size), { color: c.text1 }]}>{value}</Text>
    </View>
  );
}

/**
 * Dashed hairline. Native dashed borders only render when all four sides
 * match, so a one-sided dashed rule is drawn as a row of short segments.
 */
export function DashedDivider({ color, dash = 5, gap = 4 }: { color?: string; dash?: number; gap?: number }) {
  const { c } = useTheme();
  return (
    <View accessible={false} style={{ height: 1, flexDirection: 'row', overflow: 'hidden', gap }}>
      {Array.from({ length: 80 }, (_, i) => (
        <View key={i} style={{ width: dash, height: 1, backgroundColor: color ?? c.lineStrong }} />
      ))}
    </View>
  );
}
