import { Text, TextInput, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { AdminScreen } from '@/components/admin';
import { Card, SectionLabel, ToggleRow } from '@/components/blocks';
import { Segmented } from '@/components/controls';
import { STAFF } from '@/data/catalog';
import { initials } from '@/lib/format';
import { useApp } from '@/store/app-store';
import type { AdminNotifs, PayMethods } from '@/store/slices';
import { font } from '@/theme/fonts';
import { enter } from '@/theme/motion';
import type { ThemeMode } from '@/theme/tokens';
import { useMotion, useTheme } from '@/theme/use-theme';

const PAYS: [keyof PayMethods, string][] = [
  ['card', 'Credit & debit cards'],
  ['apple', 'Apple Pay'],
  ['cod', 'Cash on delivery'],
];
const NOTIFS: [keyof AdminNotifs, string][] = [
  ['order', 'New order'],
  ['low', 'Low stock alerts'],
  ['weekly', 'Weekly summary'],
];

function InlineField({ label, value, onChangeText, last, keyboardType }: { label: string; value: string; onChangeText: (v: string) => void; last?: boolean; keyboardType?: 'email-address' }) {
  const { c } = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, paddingHorizontal: 14, borderBottomWidth: last ? 0 : 1, borderBottomColor: c.line }}>
      <Text style={[font.body(600, 13.5), { color: c.text1 }]}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        autoCapitalize={keyboardType ? 'none' : 'sentences'}
        selectionColor={c.accentText}
        style={[font.body(500, 14), { flex: 1, minWidth: 0, textAlign: 'right', color: c.text1, padding: 0 }]}
      />
    </View>
  );
}

export default function AdminSettings() {
  const { c, mode } = useTheme();
  const { reduced } = useMotion();
  const storeInfo = useApp((s) => s.storeInfo);
  const pays = useApp((s) => s.pays);
  const notifs = useApp((s) => s.adminNotifs);
  const setStoreInfo = useApp((s) => s.setStoreInfo);
  const togglePay = useApp((s) => s.togglePay);
  const toggleNotif = useApp((s) => s.toggleAdminNotif);
  const setTheme = useApp((s) => s.setTheme);

  return (
    <AdminScreen title="Settings" back contentStyle={{ gap: 10 }}>
      <Animated.View entering={enter(0, reduced)} style={{ gap: 10 }}>
        <SectionLabel>Store</SectionLabel>
        <Card>
          <InlineField label="Name" value={storeInfo.name} onChangeText={(name) => setStoreInfo({ name })} />
          <InlineField label="Support email" value={storeInfo.email} onChangeText={(email) => setStoreInfo({ email })} keyboardType="email-address" last />
        </Card>
      </Animated.View>
      <Animated.View entering={enter(1, reduced)} style={{ gap: 10, marginTop: 8 }}>
        <SectionLabel>Payments</SectionLabel>
        <Card>
          {PAYS.map(([k, l], i) => (
            <ToggleRow key={k} title={l} on={pays[k]} onToggle={() => togglePay(k)} last={i === PAYS.length - 1} compact />
          ))}
        </Card>
      </Animated.View>
      <Animated.View entering={enter(2, reduced)} style={{ gap: 10, marginTop: 8 }}>
        <SectionLabel>Notifications</SectionLabel>
        <Card>
          {NOTIFS.map(([k, l], i) => (
            <ToggleRow key={k} title={l} on={notifs[k]} onToggle={() => toggleNotif(k)} last={i === NOTIFS.length - 1} compact />
          ))}
        </Card>
      </Animated.View>
      <Animated.View entering={enter(3, reduced)} style={{ gap: 10, marginTop: 8 }}>
        <SectionLabel>Staff</SectionLabel>
        <Card>
          {STAFF.map(([name, role, seen], i) => (
            <View key={name} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, paddingHorizontal: 14, borderBottomWidth: i === STAFF.length - 1 ? 0 : 1, borderBottomColor: c.line }}>
              <View style={{ width: 36, height: 36, borderRadius: 11, backgroundColor: c.surface2, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={[font.mono(700, 11), { color: c.text1 }]}>{initials(name)}</Text>
              </View>
              <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
                <Text style={[font.body(600, 13.5), { color: c.text1 }]}>{name}</Text>
                <Text style={[font.body(400, 11.5), { color: c.text2 }]}>{seen}</Text>
              </View>
              <View style={{ paddingVertical: 4, paddingHorizontal: 8, borderRadius: 7, backgroundColor: c.surface2 }}>
                <Text style={[font.mono(600, 9.5, { ls: 0.04, upper: true }), { color: c.text2 }]}>{role}</Text>
              </View>
            </View>
          ))}
        </Card>
      </Animated.View>
      <Animated.View entering={enter(4, reduced)}>
        <Card style={{ marginTop: 8, padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <Text style={[font.body(600, 14), { color: c.text1 }]}>Theme</Text>
          <Segmented<ThemeMode>
            width={160}
            height={38}
            value={mode}
            onChange={setTheme}
            options={[
              { value: 'dark', label: 'Dark' },
              { value: 'light', label: 'Light' },
            ]}
          />
        </Card>
      </Animated.View>
    </AdminScreen>
  );
}
