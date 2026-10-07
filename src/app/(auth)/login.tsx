import type { Href } from 'expo-router';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { AuthInput, AuthLink, AuthShell, finishAuth } from '@/components/auth';
import { Button } from '@/components/button';
import { LinkButton } from '@/components/chrome';
import { Icon, type IconName } from '@/components/icon';
import { BANNER } from '@/data/catalog';
import { isEmail } from '@/lib/format';
import { auth } from '@/services/api';
import { useUI } from '@/store/ui-store';
import { font } from '@/theme/fonts';
import { useTheme } from '@/theme/use-theme';

function SocialButton({ icon, label, onPress, disabled }: { icon: IconName; label: string; onPress: () => void; disabled?: boolean }) {
  const { c } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Continue with ${label}`}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => ({
        flex: 1,
        height: 50,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: c.lineStrong,
        backgroundColor: pressed ? c.surface2 : c.surface1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
      })}>
      <Icon name={icon} size={20} color={c.text1} />
      <Text style={[font.body(600, 14), { color: c.text1 }]}>{label}</Text>
    </Pressable>
  );
}

export default function LoginScreen() {
  const { c } = useTheme();
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [busy, setBusy] = useState(false);
  const pwRef = useRef<TextInput>(null);
  const emailBad = !!email && !isEmail(email);

  const signIn = async (run: () => ReturnType<typeof auth.signIn>) => {
    if (busy) return;
    setBusy(true);
    try {
      const user = await run();
      finishAuth(user, 'Welcome back', `Signed in as ${user.name}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell photo={BANNER.login} eyebrow="Welcome back" title="Sign in to IRONBUILD" back={false}>
      <Text style={[font.body(400, 14, { lh: 1.5 }), { color: c.text2 }]}>Track orders, keep your wishlist and check out in one tap.</Text>
      <AuthInput
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
        invalid={emailBad}
      />
      <AuthInput
        inputRef={pwRef}
        icon="lock"
        value={pw}
        onChangeText={setPw}
        placeholder="Password"
        secureToggle
        autoComplete="current-password"
        textContentType="password"
        returnKeyType="go"
        onSubmitEditing={() => signIn(() => auth.signIn(email, pw))}
      />
      <LinkButton label="Forgot password?" onPress={() => router.push('/forgot-password')} style={{ alignSelf: 'flex-end' }} />
      <Button label="Sign in" loading={busy} loadingLabel="Signing in…" onPress={() => signIn(() => auth.signIn(email, pw))} />
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 6 }}>
        <View style={{ flex: 1, height: 1, backgroundColor: c.lineStrong }} />
        <Text style={[font.mono(500, 10, { ls: 0.1, upper: true }), { color: c.text3 }]}>or continue with</Text>
        <View style={{ flex: 1, height: 1, backgroundColor: c.lineStrong }} />
      </View>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <SocialButton icon="phone_iphone" label="Apple" disabled={busy} onPress={() => signIn(() => auth.socialSignIn('apple'))} />
        <SocialButton icon="language" label="Google" disabled={busy} onPress={() => signIn(() => auth.socialSignIn('google'))} />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: 10 }}>
        <AuthLink lead="New here?" label="Create account" onPress={() => router.push('/register')} />
        <AuthLink label="Skip for now" onPress={() => router.dismissTo(useUI.getState().lastTabPath as Href)} />
      </View>
    </AuthShell>
  );
}
