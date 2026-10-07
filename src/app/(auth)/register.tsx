import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { AuthInput, AuthLink, AuthShell } from '@/components/auth';
import { Button } from '@/components/button';
import { Checkbox } from '@/components/controls';
import { haptic } from '@/components/pressable-scale';
import { BANNER } from '@/data/catalog';
import { isEmail } from '@/lib/format';
import { auth } from '@/services/api';
import { toast } from '@/store/ui-store';
import { font } from '@/theme/fonts';
import { useTheme } from '@/theme/use-theme';

const STRENGTH = ['', 'Weak', 'Good', 'Strong'];

export default function RegisterScreen() {
  const { c } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [terms, setTerms] = useState(false);
  const [busy, setBusy] = useState(false);
  const emailRef = useRef<TextInput>(null);
  const pwRef = useRef<TextInput>(null);
  const pw2Ref = useRef<TextInput>(null);

  const score = pw.length >= 12 ? 3 : pw.length >= 8 ? 2 : pw.length ? 1 : 0;
  const match = pw2 ? (pw2 === pw ? 'ok' : 'bad') : null;
  const valid = terms && pw.length >= 8 && match === 'ok' && isEmail(email);

  const submit = async () => {
    if (busy) return;
    if (!valid) {
      haptic('warning');
      return toast('Almost there', !isEmail(email) ? 'Enter a valid email' : pw.length < 8 ? 'Use 8+ characters' : match !== 'ok' ? 'Passwords don’t match' : 'Accept the terms to continue');
    }
    setBusy(true);
    try {
      await auth.register(name, email, pw);
      router.push({ pathname: '/verify', params: { from: 'register', email, name } });
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell photo={BANNER.register} eyebrow="Join the club" title="Create your account">
      <AuthInput
        icon="person"
        value={name}
        onChangeText={setName}
        placeholder="Full name"
        autoComplete="name"
        textContentType="name"
        returnKeyType="next"
        onSubmitEditing={() => emailRef.current?.focus()}
      />
      <AuthInput
        inputRef={emailRef}
        icon="mail"
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        textContentType="emailAddress"
        returnKeyType="next"
        onSubmitEditing={() => pwRef.current?.focus()}
        invalid={!!email && !isEmail(email)}
      />
      <AuthInput
        inputRef={pwRef}
        icon="lock"
        value={pw}
        onChangeText={setPw}
        placeholder="Password (8+ characters)"
        secureToggle
        autoComplete="new-password"
        textContentType="newPassword"
        returnKeyType="next"
        onSubmitEditing={() => pw2Ref.current?.focus()}
      />
      <AuthInput
        inputRef={pw2Ref}
        icon="lock_reset"
        value={pw2}
        onChangeText={setPw2}
        placeholder="Confirm password"
        secureTextEntry
        autoComplete="new-password"
        textContentType="newPassword"
        status={match}
        returnKeyType="done"
      />
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }} accessibilityLabel={`Password strength: ${STRENGTH[score] || 'none'}`}>
        <View style={{ flex: 1, flexDirection: 'row', gap: 4 }}>
          {[1, 2, 3].map((k) => (
            <View key={k} style={{ flex: 1, height: 4, borderRadius: 2, backgroundColor: score >= k ? [c.surface2, c.err, c.warn, c.ok][score] : c.surface2 }} />
          ))}
        </View>
        <Text style={[font.mono(500, 10.5), { color: c.text3, minWidth: 52, textAlign: 'right' }]}>{STRENGTH[score]}</Text>
      </View>
      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked: terms }}
        onPress={() => {
          haptic('selection');
          setTerms((t) => !t);
        }}
        style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 4 }}>
        <Checkbox on={terms} />
        <Text style={[font.body(400, 13, { lh: 1.4 }), { color: c.text2 }]}>I agree to the Terms and Privacy Policy</Text>
      </Pressable>
      <Button label="Create account" loading={busy} loadingLabel="Creating…" dimmed={!valid} onPress={submit} />
      <View style={{ marginTop: 'auto', paddingTop: 10 }}>
        <AuthLink lead="Already a member?" label="Sign in" onPress={() => (router.canGoBack() ? router.back() : router.replace('/login'))} />
      </View>
    </AuthShell>
  );
}
