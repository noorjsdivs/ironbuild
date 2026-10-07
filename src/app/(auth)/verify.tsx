import { useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { AuthShell, finishAuth } from '@/components/auth';
import { Button } from '@/components/button';
import { haptic } from '@/components/pressable-scale';
import { BANNER } from '@/data/catalog';
import { auth } from '@/services/api';
import { toast } from '@/store/ui-store';
import { font } from '@/theme/fonts';
import { useTheme } from '@/theme/use-theme';

const LEN = 6;
const RESEND_S = 30;

export default function VerifyScreen() {
  const { c } = useTheme();
  const { from, email = '', name = '' } = useLocalSearchParams<{ from?: 'register' | 'forgot'; email?: string; name?: string }>();
  const [code, setCode] = useState('');
  const [focused, setFocused] = useState(true);
  const [busy, setBusy] = useState(false);
  const [resendIn, setResendIn] = useState(RESEND_S);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  const verify = async (value = code) => {
    if (busy || value.length < LEN) return;
    setBusy(true);
    try {
      const ok = await auth.verifyCode(email, value);
      if (!ok) {
        haptic('warning');
        setCode('');
        return toast('That code didn’t work', 'Check the email and try again');
      }
      const user = { name: name.trim() || 'Sam Rivera', email: email.trim() || 'sam.rivera@mail.com' };
      if (from === 'register') finishAuth(user, 'Account created', 'Welcome to IRONBUILD');
      else finishAuth(user, 'Password reset', 'You’re signed in on this device');
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell photo={BANNER.verify} eyebrow="One more step" title="Check your inbox">
      <Text style={[font.body(400, 14, { lh: 1.5 }), { color: c.text2 }]}>
        {`We sent a 6-digit code to ${email || 'your email'}. It expires in 10 minutes.`}
      </Text>

      <Pressable accessibilityLabel="Verification code" onPress={() => inputRef.current?.focus()} style={{ marginTop: 4 }}>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {Array.from({ length: LEN }, (_, i) => {
            const ch = code[i] ?? '';
            const active = focused && (i === code.length || (i === LEN - 1 && code.length === LEN));
            return (
              <View
                key={i}
                style={{
                  flex: 1,
                  height: 62,
                  borderRadius: 16,
                  borderWidth: 1.5,
                  borderColor: active ? c.accent : ch ? c.lineStrong : c.line,
                  backgroundColor: c.surface1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text style={[font.mono(700, 24), { color: c.text1 }]}>{ch}</Text>
              </View>
            );
          })}
        </View>
        {/* One real input behind the boxes: supports paste and iOS/Android OTP autofill. */}
        <TextInput
          ref={inputRef}
          value={code}
          onChangeText={(v) => {
            const next = v.replace(/\D/g, '').slice(0, LEN);
            setCode(next);
            if (next.length === LEN) void verify(next);
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          autoFocus
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          autoComplete="one-time-code"
          maxLength={LEN}
          caretHidden
          style={{ position: 'absolute', inset: 0, opacity: 0.011, color: 'transparent' }}
        />
      </Pressable>

      <Button label="Verify" loading={busy} loadingLabel="Verifying…" dimmed={code.length < LEN} onPress={() => verify()} />

      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6 }}>
        {resendIn > 0 ? (
          <Text style={[font.body(500, 13.5), { color: c.text2 }]}>
            Resend in <Text style={font.mono(500, 13.5)}>{`0:${String(resendIn).padStart(2, '0')}`}</Text>
          </Text>
        ) : (
          <Pressable
            accessibilityRole="button"
            onPress={async () => {
              setResendIn(RESEND_S);
              await auth.sendResetCode(email);
              toast('Code resent', 'Check your inbox');
            }}
            style={{ paddingVertical: 4 }}>
            <Text style={[font.body(600, 13.5), { color: c.accentText }]}>Resend code</Text>
          </Pressable>
        )}
      </View>
    </AuthShell>
  );
}
