import { router } from 'expo-router';
import { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';

import { AdminScreen, editProduct, OrderRow } from '@/components/admin';
import { Card, Photo, SectionHeader, StatusPill } from '@/components/blocks';
import { Icon, type IconName } from '@/components/icon';
import { PressableScale } from '@/components/pressable-scale';
import { WEEK } from '@/data/catalog';
import { useAdminStats } from '@/hooks/use-admin-stats';
import { cnt, longDate, money } from '@/lib/format';
import { stockOf } from '@/lib/status';
import { useApp } from '@/store/app-store';
import { font } from '@/theme/fonts';
import { EASE_OUT, enter } from '@/theme/motion';
import { useMotion, useTheme } from '@/theme/use-theme';

const WMAX = Math.max(...WEEK.map((w) => w[1]));

function Bar({ value, day, i, today }: { value: number; day: string; i: number; today: boolean }) {
  const { c } = useTheme();
  const { ms } = useMotion();
  const h = useSharedValue(4);
  useEffect(() => {
    h.set(withDelay(ms(300 + i * 60), withTiming((value / WMAX) * 100, { duration: ms(800), easing: EASE_OUT })));
  }, [h, i, value, ms]);
  const style = useAnimatedStyle(() => ({ height: `${h.get()}%` }));
  return (
    <View style={{ flex: 1, alignItems: 'center', gap: 6, height: '100%', justifyContent: 'flex-end' }} accessibilityLabel={`${day}: ${money(value)}`}>
      <View style={{ flex: 1, width: '100%', justifyContent: 'flex-end' }}>
        <Animated.View style={[{ width: '100%', borderTopLeftRadius: 7, borderTopRightRadius: 7, borderBottomLeftRadius: 3, borderBottomRightRadius: 3, backgroundColor: today ? c.accent : c.surface2 }, style]} />
      </View>
      <Text style={[font.mono(500, 9.5), { color: c.text3 }]}>{day}</Text>
    </View>
  );
}

export default function AdminDashboard() {
  const { c } = useTheme();
  const { reduced } = useMotion();
  const orders = useApp((s) => s.orders);
  const { active, revenue, low, fresh } = useAdminStats();

  const kpis: { l: string; v: string; d: string; dc: string; icon: IconName }[] = [
    { l: 'Revenue · 30d', v: money(revenue * 3.6), d: '+12.4% vs last month', dc: c.ok, icon: 'payments' },
    { l: 'Orders', v: String(active.length), d: `${cnt(fresh, 'new order')} today`, dc: c.accentText, icon: 'receipt_long' },
    { l: 'Avg order', v: money(revenue / Math.max(1, active.length)), d: '+$18 vs last month', dc: c.ok, icon: 'shopping_bag' },
    { l: 'Low stock', v: String(low.length), d: low.length ? 'Needs reorder' : 'All healthy', dc: low.length ? c.warn : c.ok, icon: 'warehouse' },
  ];

  return (
    <AdminScreen title="Dashboard">
      <Animated.View entering={enter(0, reduced)} style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <Text accessibilityRole="header" style={[font.display(800, 32), { color: c.text1 }]}>
          Today
        </Text>
        <Text style={[font.mono(500, 11), { color: c.text3 }]}>{longDate(new Date())}</Text>
      </Animated.View>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
        {kpis.map((k, i) => (
          <Animated.View key={k.l} entering={enter(1 + i, reduced)} style={{ width: '48.4%', flexGrow: 1 }}>
            <Card style={{ padding: 14, gap: 8 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={[font.mono(500, 9.5, { ls: 0.08, upper: true }), { color: c.text3 }]}>{k.l}</Text>
                <Icon name={k.icon} size={18} color={c.text3} />
              </View>
              <Text numberOfLines={1} adjustsFontSizeToFit style={[font.num(800, 28), { color: c.text1 }]}>
                {k.v}
              </Text>
              <Text numberOfLines={1} style={[font.mono(500, 11), { color: k.dc }]}>
                {k.d}
              </Text>
            </Card>
          </Animated.View>
        ))}
      </View>

      <Animated.View entering={enter(5, reduced)}>
        <Card radius={20} style={{ padding: 16, gap: 14 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <Text style={[font.display(700, 18), { color: c.text1 }]}>Revenue · 7 days</Text>
            <Text style={[font.mono(600, 12), { color: c.accentText }]}>{money(WEEK.reduce((a, w) => a + w[1], 0))}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 8, height: 110 }}>
            {WEEK.map(([d, v], i) => (
              <Bar key={d} day={d} value={v} i={i} today={i === WEEK.length - 1} />
            ))}
          </View>
        </Card>
      </Animated.View>

      <Animated.View entering={enter(6, reduced)}>
        <SectionHeader title="Recent orders" size={18} action="All →" onAction={() => router.navigate('/admin/orders')} style={{ marginTop: 6 }} />
      </Animated.View>
      <View style={{ gap: 8, marginTop: -6 }}>
        {orders.slice(0, 4).map((o, i) => (
          <Animated.View key={o.no} entering={enter(7 + i, reduced)}>
            <OrderRow order={o} />
          </Animated.View>
        ))}
      </View>

      <SectionHeader title="Low stock" size={18} action="Inventory →" onAction={() => router.navigate('/admin/inventory')} style={{ marginTop: 6 }} />
      <View style={{ gap: 8, marginTop: -6 }}>
        {low.slice(0, 4).map((p) => {
          const s = stockOf(p, c);
          return (
            <PressableScale
              key={p.id}
              scaleTo={0.98}
              onPress={() => editProduct(p.id)}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 8, paddingRight: 12, borderRadius: 16, borderWidth: 1, borderColor: c.line, backgroundColor: c.surface1 }}>
              <View style={{ width: 44, height: 44, borderRadius: 12, overflow: 'hidden', backgroundColor: c.surface2 }}>
                <Photo uri={p.img} style={{ width: '100%', height: '100%' }} />
              </View>
              <Text numberOfLines={1} style={[font.body(600, 14), { flex: 1, color: c.text1 }]}>
                {p.name}
              </Text>
              <StatusPill label={s.label} color={s.color} upper={false} />
            </PressableScale>
          );
        })}
      </View>
    </AdminScreen>
  );
}
