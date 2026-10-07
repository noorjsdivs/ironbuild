import { Text, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { AdminScreen } from '@/components/admin';
import { Card, SectionLabel } from '@/components/blocks';
import { Chip, Stepper } from '@/components/controls';
import { ZONES } from '@/data/catalog';
import { money } from '@/lib/format';
import { useApp } from '@/store/app-store';
import { font } from '@/theme/fonts';
import { enter } from '@/theme/motion';
import { useMotion, useTheme } from '@/theme/use-theme';

export default function AdminShipping() {
  const { c } = useTheme();
  const { reduced } = useMotion();
  const freeAt = useApp((s) => s.freeAt);
  const rates = useApp((s) => s.rates);
  const zones = useApp((s) => s.zones);
  const setFreeAt = useApp((s) => s.setFreeAt);
  const setRate = useApp((s) => s.setRate);
  const toggleZone = useApp((s) => s.toggleZone);

  const rows = [
    { k: 'std', t: 'Standard', s: '3–5 business days' },
    { k: 'exp', t: 'Express', s: 'Next day before noon' },
  ] as const;

  return (
    <AdminScreen title="Shipping" back>
      <Animated.View entering={enter(0, reduced)}>
        <Card style={{ padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <View style={{ flex: 1, gap: 3 }}>
            <Text style={[font.body(600, 14), { color: c.text1 }]}>Free shipping from</Text>
            <Text style={[font.body(400, 12), { color: c.text2 }]}>Applies to standard delivery</Text>
          </View>
          <Stepper value={money(freeAt)} size={40} minWidth={52} label="free shipping threshold" onInc={() => setFreeAt(freeAt + 10)} onDec={() => setFreeAt(freeAt - 10)} />
        </Card>
      </Animated.View>
      <SectionLabel>Rates</SectionLabel>
      {rows.map((r, i) => (
        <Animated.View key={r.k} entering={enter(2 + i, reduced)}>
          <Card radius={16} style={{ paddingVertical: 14, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <View style={{ flex: 1, gap: 3 }}>
              <Text style={[font.body(600, 14), { color: c.text1 }]}>{r.t}</Text>
              <Text style={[font.body(400, 12), { color: c.text2 }]}>{r.s}</Text>
            </View>
            <Stepper value={money(rates[r.k])} size={36} minWidth={44} label={`${r.t} rate`} onInc={() => setRate(r.k, rates[r.k] + 1)} onDec={() => setRate(r.k, rates[r.k] - 1)} />
          </Card>
        </Animated.View>
      ))}
      <SectionLabel style={{ marginTop: 4 }}>Zones</SectionLabel>
      <Animated.View entering={enter(5, reduced)} style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {ZONES.map((z) => (
          <Chip key={z} label={z} on={zones.includes(z)} onPress={() => toggleZone(z)} />
        ))}
      </Animated.View>
    </AdminScreen>
  );
}
