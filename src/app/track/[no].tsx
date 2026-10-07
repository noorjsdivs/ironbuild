import { Image } from 'expo-image';
import { Redirect, useLocalSearchParams } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Card, StatusPill } from '@/components/blocks';
import { BackButton, ScreenStatusBar } from '@/components/chrome';
import { Glass } from '@/components/glass';
import { OrderTimeline } from '@/components/order-timeline';
import { ProgressBar } from '@/components/progress-bar';
import { cnt, money } from '@/lib/format';
import { orderTotal } from '@/lib/pricing';
import { statusOf } from '@/lib/status';
import { useApp, useProductLookup } from '@/store/app-store';
import { font } from '@/theme/fonts';
import { enter } from '@/theme/motion';
import { useMotion, useTheme } from '@/theme/use-theme';

export default function TrackOrderScreen() {
  const { no } = useLocalSearchParams<{ no: string }>();
  const { c } = useTheme();
  const { reduced } = useMotion();
  const insets = useSafeAreaInsets();
  const o = useApp((s) => s.orders.find((x) => x.no === no));
  const freeAt = useApp((s) => s.freeAt);
  const rates = useApp((s) => s.rates);
  const byId = useProductLookup();

  if (!o) return <Redirect href="/account/orders" />;

  const st = statusOf(o.step, c);
  const items = o.items.reduce((a, b) => a + b.q, 0);
  const eta = o.step === 4 ? 'Cancelled' : o.step >= 3 ? 'Delivered' : o.etaShort;
  const etaLabel = o.step === 4 ? 'Refund issued' : o.step >= 3 ? `Delivered ${o.etaShort}` : 'Estimated arrival';

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <ScreenStatusBar style="light" />
      <ScrollView contentContainerStyle={{ paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
        <Image
          source={require('@/assets/images/map.png')}
          accessibilityLabel="Map showing the courier route"
          style={{ height: 300 + insets.top, width: '100%' }}
          contentFit="cover"
        />
        <Animated.View entering={enter(0, reduced)} style={{ marginTop: -64, marginHorizontal: 20 }}>
          <Glass style={{ padding: 18, borderRadius: 22, borderWidth: 1, borderColor: c.glassLine, gap: 12, boxShadow: '0 20px 40px rgba(0,0,0,0.18)' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <View style={{ gap: 6 }}>
                <Text style={[font.mono(500, 10, { ls: 0.08, upper: true }), { color: c.text3 }]}>{etaLabel}</Text>
                <Text style={[font.display(800, 34), { color: c.text1 }]}>{eta}</Text>
              </View>
              <StatusPill label={st.label} color={st.color} size="md" />
            </View>
            <ProgressBar pct={(Math.min(o.step, 3) / 3) * 100} duration={900} />
          </Glass>
        </Animated.View>

        <View style={{ paddingTop: 22, paddingHorizontal: 20, paddingBottom: 6 }}>
          <OrderTimeline order={o} />
        </View>

        <Animated.View entering={enter(7, reduced)}>
          <Card style={{ marginTop: 4, marginHorizontal: 20, padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ gap: 3 }}>
              <Text style={[font.mono(600, 14), { color: c.text1 }]}>{o.no}</Text>
              <Text style={[font.body(400, 12.5), { color: c.text2 }]}>{`${o.date} · ${cnt(items, 'item')}`}</Text>
            </View>
            <Text style={[font.num(800, 24), { color: c.text1 }]}>{money(orderTotal(o, byId, freeAt, rates))}</Text>
          </Card>
        </Animated.View>
      </ScrollView>
      <View style={{ position: 'absolute', top: insets.top + 4, left: 16 }}>
        <BackButton overPhoto />
      </View>
    </View>
  );
}
