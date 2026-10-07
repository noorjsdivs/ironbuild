import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { EmptyState, StatusPill } from '@/components/blocks';
import { Icon } from '@/components/icon';
import { PushedScreen } from '@/components/screen';
import { ME } from '@/data/catalog';
import { cnt, money } from '@/lib/format';
import { orderTotal } from '@/lib/pricing';
import { statusOf } from '@/lib/status';
import { useApp, useProductLookup } from '@/store/app-store';
import { font } from '@/theme/fonts';
import { enter } from '@/theme/motion';
import { useMotion, useTheme } from '@/theme/use-theme';

export default function MyOrdersScreen() {
  const { c } = useTheme();
  const { reduced } = useMotion();
  const orders = useApp((s) => s.orders);
  const freeAt = useApp((s) => s.freeAt);
  const rates = useApp((s) => s.rates);
  const byId = useProductLookup();
  const mine = orders.filter((o) => o.cid === ME);

  return (
    <PushedScreen title="My orders">
      {mine.length === 0 ? (
        <EmptyState icon="receipt_long" iconColor={c.text3} title="No orders yet" body="Your purchases will show up here." style={{ marginTop: 24 }} />
      ) : null}
      {mine.map((o, i) => {
        const st = statusOf(o.step, c);
        const n = o.items.reduce((a, b) => a + b.q, 0);
        return (
          <Animated.View key={o.no} entering={enter(i, reduced)}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Order ${o.no}, ${st.label}`}
              onPress={() => router.push({ pathname: '/track/[no]', params: { no: o.no } })}
              style={({ pressed }) => ({
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                padding: 14,
                borderRadius: 18,
                borderWidth: 1,
                borderColor: c.line,
                backgroundColor: pressed ? c.surface2 : c.surface1,
              })}>
              <View style={{ flex: 1, gap: 4 }}>
                <Text style={[font.mono(600, 14), { color: c.text1 }]}>{o.no}</Text>
                <Text style={[font.body(400, 12.5), { color: c.text2 }]}>
                  {`${o.date} · ${cnt(n, 'item')} · ${money(orderTotal(o, byId, freeAt, rates))}`}
                </Text>
              </View>
              <StatusPill label={st.label} color={st.color} size="md" />
              <Icon name="chevron_right" size={20} color={c.text3} />
            </Pressable>
          </Animated.View>
        );
      })}
    </PushedScreen>
  );
}
