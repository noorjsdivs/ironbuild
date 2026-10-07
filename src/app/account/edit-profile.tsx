import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Avatar } from '@/components/avatar';
import { Card, Field } from '@/components/blocks';
import { Button } from '@/components/button';
import { FloatingCTA } from '@/components/chrome';
import { Icon } from '@/components/icon';
import { PushedScreen } from '@/components/screen';
import { isEmail } from '@/lib/format';
import { auth } from '@/services/api';
import { useApp } from '@/store/app-store';
import { toast } from '@/store/ui-store';
import { font } from '@/theme/fonts';
import { useTheme } from '@/theme/use-theme';

export default function EditProfileScreen() {
  const { c } = useTheme();
  const user = useApp((s) => s.user);
  const updateUser = useApp((s) => s.updateUser);
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '+1 (718) 555-0142');

  const save = () => {
    if (email && !isEmail(email)) return toast('Check your email', 'That address doesn’t look right');
    const nm = name.trim() || user?.name || 'Sam Rivera';
    updateUser({ name: nm, email: email.trim(), phone: phone.trim() });
    router.back();
    toast('Profile updated', nm);
  };

  return (
    <PushedScreen
      title="Edit profile"
      footerSpace={70}
      footer={
        <FloatingCTA>
          <Button label="Save changes" height={54} radius={16} weight={600} glow onPress={save} />
        </FloatingCTA>
      }>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingTop: 4, paddingBottom: 8 }}>
        <Avatar name={name || user?.name} photo={user?.photo} size={72} radius={24} />
        <Button
          label="Change photo"
          variant="outline"
          height={40}
          radius={12}
          weight={600}
          fontSize={13}
          style={{ paddingHorizontal: 14 }}
          onPress={() => toast('Photo picker', 'Choose from library or camera')}
        />
      </View>
      <Field label="Full name" value={name} onChangeText={setName} autoComplete="name" textContentType="name" returnKeyType="next" />
      <Field
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        textContentType="emailAddress"
      />
      <Field label="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" autoComplete="tel" textContentType="telephoneNumber" />
      <Card style={{ marginTop: 8 }}>
        <Pressable
          accessibilityRole="button"
          onPress={async () => {
            await auth.sendResetCode(email);
            toast('Reset link sent', `Check ${email}`);
          }}
          style={{ padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={[font.body(600, 14), { color: c.text1 }]}>Change password</Text>
          <Icon name="chevron_right" size={20} color={c.text3} />
        </Pressable>
      </Card>
    </PushedScreen>
  );
}
