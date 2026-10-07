import { router } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { AdminScreen } from '@/components/admin';
import { SearchBox, StatusPill } from '@/components/blocks';
import { PressableScale } from '@/components/pressable-scale';
import { CUSTOMERS } from '@/data/catalog';
import { useAdminStats } from '@/hooks/use-admin-stats';
import { initials, money } from '@/lib/format';
import { tierColor } from '@/lib/status';
import { font } from '@/theme/fonts';
import { enter } from '@/theme/motion';
import { useMotion, useTheme } from '@/theme/use-theme';

export default function AdminCustomers() {
  const { c } = useTheme();
  const { reduced } = useMotion();
  const { active, totalOf } = useAdminStats();
  const [q, setQ] = useState('');
  const ql = q.trim().toLowerCase();
  const list = CUSTOMERS.filter((x) => !ql || `${x.name} ${x.email}`.toLowerCase().includes(ql));

  return (
    <AdminScreen title="Customers" back>
      <Animated.View entering={enter(0, reduced)} style={{ flexDirection: 'row' }}>
        <SearchBox value={q} onChangeText={setQ} placeholder="Search customers" />
      </Animated.View>
      <View style={{ gap: 8 }}>
        {list.map((cu, i) => {
          const spent = active.filter((o) => o.cid === cu.id).reduce((a, o) => a + totalOf(o), 0);
          return (
            <Animated.View key={cu.id} entering={enter(1 + i, reduced)}>
              <PressableScale
                scaleTo={0.98}
                onPress={() => router.push({ pathname: '/admin/customer/[id]', params: { id: cu.id } })}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, paddingHorizontal: 14, borderRadius: 16, borderWidth: 1, borderColor: c.line, backgroundColor: c.surface1 }}>
                <View style={{ width: 40, height: 40, borderRadius: 13, backgroundColor: c.surface2, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={[font.mono(700, 12), { color: c.text1 }]}>{initials(cu.name)}</Text>
                </View>
                <View style={{ flex: 1, minWidth: 0, gap: 3 }}>
                  <Text style={[font.body(600, 14), { color: c.text1 }]}>{cu.name}</Text>
                  <Text numberOfLines={1} style={[font.body(400, 12), { color: c.text2 }]}>
                    {cu.email}
                  </Text>
                </View>
                <View style={{ alignItems: 'flex-end', gap: 4 }}>
                  <Text style={[font.num(700, 15), { color: c.text1 }]}>{money(spent)}</Text>
                  <StatusPill label={cu.tier} color={tierColor(cu.tier, c)} size="xs" />
                </View>
              </PressableScale>
            </Animated.View>
          );
        })}
      </View>
    </AdminScreen>
  );
}
