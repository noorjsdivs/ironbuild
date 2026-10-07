import { BlurView } from 'expo-blur';
import type { ReactNode } from 'react';
import { Platform, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { withAlpha } from '@/lib/color';
import { useTheme } from '@/theme/use-theme';

type Tone = 'glass' | 'strong' | 'nav';

type Props = {
  tone?: Tone;
  /** Force the dark material (e.g. controls floating over photos). */
  forceDark?: boolean;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
  pointerEvents?: 'auto' | 'none' | 'box-none' | 'box-only';
};

/**
 * Frosted-glass surface (CSS `backdrop-filter: blur() saturate()`).
 * iOS uses a native blur tinted with the token color; Android, where a
 * live backdrop blur needs an explicit blur target, falls back to a
 * denser translucent fill so text stays legible.
 */
export function Glass({ tone = 'glass', forceDark, style, children, pointerEvents }: Props) {
  const { c, isDark } = useTheme();
  const dark = forceDark || isDark;
  const tint = forceDark ? 'rgba(26,27,30,0.58)' : tone === 'strong' ? c.glassStrong : tone === 'nav' ? c.navGlass : c.glass;
  const flat = StyleSheet.flatten(style) ?? {};

  if (Platform.OS !== 'ios') {
    const fallback = withAlpha(forceDark ? '#1a1b1e' : tone === 'strong' ? c.bg : c.surface1, tone === 'strong' ? 0.94 : 0.9);
    return (
      <View pointerEvents={pointerEvents} style={[{ backgroundColor: fallback }, style]}>
        {children}
      </View>
    );
  }

  return (
    <View pointerEvents={pointerEvents} style={[{ overflow: 'hidden' }, style]}>
      <BlurView
        intensity={tone === 'nav' ? 60 : 45}
        tint={dark ? 'dark' : 'light'}
        style={[StyleSheet.absoluteFill, { borderRadius: flat.borderRadius }]}
      />
      <View style={[StyleSheet.absoluteFill, { backgroundColor: tint, borderRadius: flat.borderRadius }]} />
      {children}
    </View>
  );
}
