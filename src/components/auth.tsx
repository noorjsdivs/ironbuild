import type { Href } from 'expo-router';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useState, type ReactNode, type Ref } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View, type TextInputProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { User } from '@/data/types';
import { useApp } from '@/store/app-store';
import { toast, useUI } from '@/store/ui-store';
import { font } from '@/theme/fonts';
import { FIXED } from '@/theme/tokens';
import { useTheme } from '@/theme/use-theme';

import { Photo } from './blocks';
import { BackButton, ScreenStatusBar } from './chrome';
import { Icon, type IconName } from './icon';
import { Wordmark } from './wordmark';

/** Signs the user in, closes the auth modal and returns to the last tab. */
export function finishAuth(user: User, title: string, sub: string) {
  useApp.getState().signIn(user);
  router.dismissTo(useUI.getState().lastTabPath as Href);
  setTimeout(() => toast(title, sub), 200);
}

/** Photo header + scrolling form shared by every auth screen. */
export function AuthShell({
  photo,
  eyebrow,
  title,
  back = true,
  children,
}: {
  photo: string;
  eyebrow: string;
  title: string;
  back?: boolean;
  children: ReactNode;
}) {
  const { c } = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: c.bg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScreenStatusBar style="light" />
      <ScrollView
        bounces={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}>
        <View style={{ height: 248 + insets.top, overflow: 'hidden' }}>
          <Photo uri={photo} style={{ position: 'absolute', inset: 0 }} />
          <LinearGradient colors={['rgba(0,0,0,0.25)', 'transparent', c.bg]} locations={[0, 0.35, 1]} style={{ position: 'absolute', inset: 0 }} />
          <Wordmark size={22} color={FIXED.onPhoto} accent={c.accent} style={{ position: 'absolute', top: insets.top + 10, left: 24 }} />
          {back ? (
            <View style={{ position: 'absolute', top: insets.top + 2, right: 16 }}>
              <BackButton overPhoto />
            </View>
          ) : null}
          <View style={{ position: 'absolute', left: 24, right: 24, bottom: 4, gap: 8 }}>
            <Text style={[font.mono(500, 10.5, { ls: 0.1, upper: true }), { color: c.accentText }]}>{eyebrow}</Text>
            <Text accessibilityRole="header" style={[font.display(800, 44, { lh: 0.92 }), { color: c.text1 }]}>
              {title}
            </Text>
          </View>
        </View>
        <View style={{ flex: 1, paddingTop: 14, paddingHorizontal: 24, paddingBottom: Math.max(insets.bottom, 24) + 16, gap: 12 }}>{children}</View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

type InputProps = TextInputProps & {
  icon: IconName;
  invalid?: boolean;
  valid?: boolean;
  /** Adds a Show/Hide toggle for passwords. */
  secureToggle?: boolean;
  /** Trailing status icon (confirm-password match). */
  status?: 'ok' | 'bad' | null;
  inputRef?: Ref<TextInput>;
};

/** 54px icon-leading input with error / success border states. */
export function AuthInput({ icon, invalid, valid, secureToggle, status, inputRef, style, onFocus, onBlur, secureTextEntry, ...rest }: InputProps) {
  const { c } = useTheme();
  const [focused, setFocused] = useState(false);
  const [shown, setShown] = useState(false);
  const border = invalid || status === 'bad' ? c.err : valid || status === 'ok' ? c.ok : focused ? c.lineStrong : c.line;
  return (
    <View style={{ justifyContent: 'center' }}>
      <View pointerEvents="none" style={{ position: 'absolute', left: 16, zIndex: 1 }}>
        <Icon name={icon} size={20} color={c.text3} />
      </View>
      <TextInput
        {...rest}
        ref={inputRef}
        placeholderTextColor={c.text3}
        selectionColor={c.accentText}
        secureTextEntry={secureToggle ? !shown : secureTextEntry}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        style={[
          font.body(500, 15),
          {
            height: 54,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: border,
            backgroundColor: c.surface1,
            color: c.text1,
            paddingLeft: 48,
            paddingRight: secureToggle ? 70 : status ? 48 : 16,
          },
          style,
        ]}
      />
      {secureToggle ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={shown ? 'Hide password' : 'Show password'}
          onPress={() => setShown((v) => !v)}
          style={{ position: 'absolute', right: 6, height: 40, paddingHorizontal: 12, borderRadius: 11, justifyContent: 'center' }}>
          <Text style={[font.body(600, 12), { color: c.text2 }]}>{shown ? 'Hide' : 'Show'}</Text>
        </Pressable>
      ) : status ? (
        <View pointerEvents="none" style={{ position: 'absolute', right: 16 }}>
          <Icon name={status === 'ok' ? 'check_circle' : 'cancel'} size={20} filled color={status === 'ok' ? c.ok : c.err} />
        </View>
      ) : null}
    </View>
  );
}

/** Plain text link row ("New here? Create account"). */
export function AuthLink({ lead, label, onPress, align = 'center' }: { lead?: string; label: string; onPress: () => void; align?: 'center' | 'flex-start' | 'flex-end' }) {
  const { c } = useTheme();
  return (
    <Pressable accessibilityRole="link" onPress={onPress} hitSlop={8} style={{ alignSelf: align, paddingVertical: 6 }}>
      <Text style={[font.body(lead ? 500 : 600, 13.5), { color: c.text2 }]}>
        {lead ? `${lead} ` : null}
        {lead ? <Text style={[font.body(600, 13.5), { color: c.accentText }]}>{label}</Text> : label}
      </Text>
    </Pressable>
  );
}
