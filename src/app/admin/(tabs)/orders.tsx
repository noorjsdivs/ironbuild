import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { AdminScreen, OrderRow, PageTitle, StatTile } from '@/components/admin';
import { EmptyState } from '@/components/blocks';
import { Chip } from '@/components/controls';
import { STATUS } from '@/data/catalog';
import { useAdminStats } from '@/hooks/use-admin-stats';
import { cnt, money } from '@/lib/format';
import { useApp } from '@/store/app-store';
import { font } from '@/theme/fonts';
import { enter } from '@/theme/motion';
import { useMotion, useTheme } from '@/theme/use-theme';

export default function AdminOrders() {
  const { c } = useTheme();
  const { reduced } = useMotion();
  const orders = useApp((s) => s.orders);
  const { revenue } = useAdminStats();
  const [filter, setFilter] = useState<'all' | number>('all');
  const list = orders.filter((o) => filter === 'all' || o.step === filter);

  return (
    <AdminScreen title="Orders" contentStyle={{ paddingHorizontal: 0 }}>
      <Animated.View entering={enter(0, reduced)} style={{ paddingHorizontal: 20 }}>
        <PageTitle title="Orders" right={<Text style={[font.mono(500, 11), { color: c.text3 }]}>{cnt(orders.length, 'order')}</Text>} />
      </Animated.View>
      <Animated.View entering={enter(1, reduced)} style={{ flexDirection: 'row', gap: 8, paddingHorizontal: 20 }}>
        <StatTile label="Open" value={String(orders.filter((o) => o.step < 3).length)} icon="pending_actions" iconColor={c.info} />
        <StatTile label="Shipping" value={String(orders.filter((o) => o.step === 2).length)} icon="local_shipping" iconColor={c.accentText} />
        <StatTile label="Revenue" value={money(revenue)} icon="payments" iconColor={c.ok} />
      </Animated.View>
      <Animated.View entering={enter(2, reduced)}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingHorizontal: 20 }}>
          <Chip label="All" count={orders.length} height={36} on={filter === 'all'} onPress={() => setFilter('all')} />
          {STATUS.map((label, i) => (
            <Chip key={label} label={label} count={orders.filter((o) => o.step === i).length} height={36} on={filter === i} onPress={() => setFilter(i)} />
          ))}
        </ScrollView>
      </Animated.View>
      {list.length === 0 ? (
        <EmptyState icon="inbox" iconColor={c.text3} title="Nothing here" body="No orders match this status." style={{ marginTop: 18, marginHorizontal: 20 }} />
      ) : (
        <View key={String(filter)} style={{ gap: 8, paddingHorizontal: 20 }}>
          {list.map((o, i) => (
            <Animated.View key={o.no} entering={enter(3 + i, reduced)}>
              <OrderRow order={o} variant="full" />
            </Animated.View>
          ))}
        </View>
      )}
    </AdminScreen>
  );
}
