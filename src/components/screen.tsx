import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/theme/use-theme';

import { HEADER_SPACE, ScreenHeader, ScreenStatusBar } from './chrome';

/**
 * Standard pushed screen: pinned glass header with back button, a
 * keyboard-aware scroll body and an optional floating footer.
 */
export function PushedScreen({
  title,
  children,
  footer,
  contentStyle,
  footerSpace = 0,
}: {
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
  /** Extra bottom padding so content clears a floating footer. */
  footerSpace?: number;
}) {
  const { c } = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: c.bg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScreenStatusBar />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          { paddingTop: insets.top + HEADER_SPACE, paddingHorizontal: 20, paddingBottom: 40 + footerSpace + insets.bottom, gap: 10 },
          contentStyle,
        ]}>
        {children}
      </ScrollView>
      <ScreenHeader title={title} />
      {footer}
    </KeyboardAvoidingView>
  );
}
