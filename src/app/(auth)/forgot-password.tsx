import { router } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';

import { AuthInput, AuthLink, AuthShell } from '@/components/auth';
import { Button } from '@/components/button';
import { Card } from '@/components/blocks';
import { Icon } from '@/components/icon';
import { haptic } from '@/components/pressable-scale';
import { BANNER, SUPPORT_EMAIL } from '@/data/catalog';
import { isEmail } from '@/lib/format';
import { auth } from '@/services/api';
import { toast } from '@/store/ui-store';
import { font } from '@/theme/fonts';
import { useTheme } from '@/theme/use-theme';

export default function ForgotPasswordScreen() {
  const { c } = useTheme();
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);

  const send = async () => {
    if (busy) return;
    if (!isEmail(email)) {
      haptic('warning');
      return toast('Check your email', 'Enter the address on your account');
    }
    setBusy(true);
    try {
      await auth.sendResetCode(email);
      router.push({ pathname: '/verify', params: { from: 'forgot', email } });
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell photo={BANNER.forgot} eyebrow="Account recovery" title="Reset your password">
      <Text style={[font.body(400, 14, { lh: 1.5 }), { color: c.text2 }]}>
        Enter the email on your account. We’ll send a 6-digit code to verify it’s you.
      </Text>
      <AuthInput
        icon="mail"
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        textContentType="emailAddress"
        returnKeyType="send"
        onSubmitEditing={send}
        invalid={!!email && !isEmail(email)}
      />
      <Button label="Send code" loading={busy} loadingLabel="Sending…" onPress={send} />
      <Card radius={16} style={{ paddingVertical: 14, paddingHorizontal: 16, flexDirection: 'row', gap: 12, alignItems: 'flex-start' }}>
        <Icon name="info" size={20} color={c.accentText} />
        <Text style={[font.body(400, 13, { lh: 1.5 }), { flex: 1, color: c.text2 }]}>
          {`Codes expire after 10 minutes. If you no longer have access to this email, contact ${SUPPORT_EMAIL}.`}
        </Text>
      </Card>
      <View style={{ marginTop: 'auto', paddingTop: 10 }}>
        <AuthLink label="Back to sign in" onPress={() => router.back()} />
      </View>
    </AuthShell>
  );
}
