import { router, useFocusEffect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useState, type ReactNode } from 'react';
import { Pressable, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FIXED } from '@/theme/tokens';
import { font } from '@/theme/fonts';
import { useTheme } from '@/theme/use-theme';

import { Glass } from './glass';
import { Icon } from './icon';
import { PressableScale } from './pressable-scale';

/** Gap between the safe-area top and the first row of content. */
export const TOP_GAP = 6;
/** Content offset below a pinned glass header (prototype: 112 − 52). */
export const HEADER_SPACE = 60;
/** Bottom inset reserved for the floating tab bar (prototype: 124). */
export const TABBAR_SPACE = 124;

export function useBottomGap(min = 16) {
  const insets = useSafeAreaInsets();
  return Math.max(insets.bottom, min);
}

/** Status bar that only applies while its screen is focused. */
export function useScreenFocused() {
  const [focused, setFocused] = useState(false);
  useFocusEffect(
    useCallback(() => {
      setFocused(true);
      return () => setFocused(false);
    }, []),
  );
  return focused;
}

export function ScreenStatusBar({ style }: { style?: 'light' | 'dark' }) {
  const focused = useScreenFocused();
  const { isDark } = useTheme();
  if (!focused) return null;
  return <StatusBar style={style ?? (isDark ? 'light' : 'dark')} animated />;
}

export function goBack() {
  if (router.canGoBack()) router.back();
  else router.replace('/');
}

/** 44px round back button. `overPhoto` uses the dark glass variant. */
export function BackButton({ overPhoto, onPress, size = 44 }: { overPhoto?: boolean; onPress?: () => void; size?: number }) {
  const { c } = useTheme();
  const content = <Icon name="arrow_back" size={overPhoto ? 23 : 22} color={overPhoto ? FIXED.onPhoto : c.text1} />;
  const common: ViewStyle = { width: size, height: size, borderRadius: size / 2, alignItems: 'center', justifyContent: 'center' };
  return (
    <PressableScale onPress={onPress ?? goBack} scaleTo={0.9} accessibilityLabel="Back" hitSlop={6}>
      {overPhoto ? (
        <Glass forceDark style={[common, { borderWidth: 1, borderColor: 'rgba(255,255,255,0.14)' }]}>
          {content}
        </Glass>
      ) : (
        <View style={[common, { borderWidth: 1, borderColor: c.line, backgroundColor: c.surface1 }]}>{content}</View>
      )}
    </PressableScale>
  );
}

/** Pinned glass header used by every pushed screen (back + display title). */
export function ScreenHeader({ title, right, onBack }: { title: string; right?: ReactNode; onBack?: () => void }) {
  const { c } = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <Glass
      tone="strong"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 3,
        paddingTop: insets.top + 4,
        paddingHorizontal: 16,
        paddingBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
      }}>
      <BackButton onPress={onBack} />
      <Text accessibilityRole="header" numberOfLines={1} style={[font.display(800, 26), { color: c.text1, flex: 1 }]}>
        {title}
      </Text>
      {right}
    </Glass>
  );
}

/** Frosted bar pinned to the bottom edge (detail add-to-cart, checkout pay). */
export function BottomBar({ children, style }: { children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const { c } = useTheme();
  const bottom = useBottomGap(20);
  return (
    <Glass
      tone="strong"
      style={[
        {
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 3,
          paddingTop: 14,
          paddingHorizontal: 20,
          paddingBottom: bottom,
          borderTopWidth: 1,
          borderTopColor: c.glassLine,
        },
        style,
      ]}>
      {children}
    </Glass>
  );
}

/** Floating full-width CTA over the content (Save changes, Add card…). */
export function FloatingCTA({ children }: { children: ReactNode }) {
  const bottom = useBottomGap(24);
  return <View style={{ position: 'absolute', left: 20, right: 20, bottom: Math.max(24, bottom - 8), zIndex: 3 }}>{children}</View>;
}

/** Text button in accent color ("Forgot password?", "Reset"). */
export function LinkButton({ label, onPress, style, mono }: { label: string; onPress: () => void; style?: StyleProp<ViewStyle>; mono?: boolean }) {
  const { c } = useTheme();
  return (
    <Pressable accessibilityRole="button" onPress={onPress} hitSlop={8} style={[{ paddingVertical: 4 }, style]}>
      <Text style={[mono ? font.mono(600, 11, { ls: 0.06, upper: true }) : font.body(600, 13), { color: c.accentText }]}>{label}</Text>
    </Pressable>
  );
}
