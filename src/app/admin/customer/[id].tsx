import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { AdminScreen, OrderRow, StatTile } from '@/components/admin';
import { SectionLabel } from '@/components/blocks';
import { CUSTOMERS } from '@/data/catalog';
import { useAdminStats } from '@/hooks/use-admin-stats';
import { initials, money } from '@/lib/format';
import { useApp } from '@/store/app-store';
import { font } from '@/theme/fonts';
import { enter } from '@/theme/motion';
import { useMotion, useTheme } from '@/theme/use-theme';

export default function AdminCustomerDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { c } = useTheme();
  const { reduced } = useMotion();
  const orders = useApp((s) => s.orders);
  const { totalOf } = useAdminStats();
  const cu = CUSTOMERS.find((x) => x.id === id) ?? CUSTOMERS[0];
  const mine = orders.filter((o) => o.cid === cu.id);
  const spent = mine.filter((o) => o.step < 4).reduce((a, o) => a + totalOf(o), 0);

  return (
    <AdminScreen title="Customer" back>
      <Animated.View entering={enter(0, reduced)} style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
        <View style={{ width: 60, height: 60, borderRadius: 20, backgroundColor: c.accent, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={[font.num(800, 22), { color: c.accentInk }]}>{initials(cu.name)}</Text>
        </View>
        <View style={{ flex: 1, minWidth: 0, gap: 4 }}>
          <Text style={[font.display(800, 26), { color: c.text1 }]}>{cu.name}</Text>
          <Text style={[font.body(400, 12.5), { color: c.text2 }]}>{cu.email}</Text>
          <Text style={[font.mono(500, 10.5), { color: c.text3 }]}>{cu.city}</Text>
        </View>
      </Animated.View>
      <Animated.View entering={enter(1, reduced)} style={{ flexDirection: 'row', gap: 8 }}>
        <StatTile label="Orders" value={String(mine.length)} />
        <StatTile label="Spent" value={money(spent)} />
        <StatTile label="Tier" value={cu.tier} />
      </Animated.View>
      <SectionLabel>Orders</SectionLabel>
      <View style={{ gap: 8, marginTop: -6 }}>
        {mine.map((o, i) => (
          <Animated.View key={o.no} entering={enter(3 + i, reduced)}>
            <OrderRow order={o} variant="customer" />
          </Animated.View>
        ))}
      </View>
    </AdminScreen>
  );
}
