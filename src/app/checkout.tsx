import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useShallow } from 'zustand/react/shallow';

import { Card, SectionLabel, SummaryRow } from '@/components/blocks';
import { Button } from '@/components/button';
import { BottomBar, HEADER_SPACE, ScreenHeader, ScreenStatusBar } from '@/components/chrome';
import { RadioCard } from '@/components/controls';
import { Icon } from '@/components/icon';
import { haptic } from '@/components/pressable-scale';
import { cnt, firstName, money } from '@/lib/format';
import { orders } from '@/services/api';
import { useApp, useCartTotals } from '@/store/app-store';
import { toast } from '@/store/ui-store';
import { font } from '@/theme/fonts';
import { enter } from '@/theme/motion';
import { useMotion, useTheme } from '@/theme/use-theme';

type PayKey = 'card' | 'apple' | 'cod';
type Method = { key: PayKey; title: string; sub: string; label: string };

export default function CheckoutScreen() {
  const { c } = useTheme();
  const { reduced } = useMotion();
  const insets = useSafeAreaInsets();
  const { user, pays, rates, addresses, defaultAddressId, cards, defaultCardId } = useApp(
    useShallow((s) => ({
      user: s.user,
      rates: s.rates,
      pays: s.pays,
      addresses: s.addresses,
      defaultAddressId: s.defaultAddressId,
      cards: s.cards,
      defaultCardId: s.defaultCardId,
    })),
  );
  const [express, setExpress] = useState(false);
  const card = cards.find((k) => k.id === defaultCardId) ?? cards[0];
  const brand = card ? (card.brand === 'VISA' ? 'Visa' : card.brand) : '';
  const methods: Method[] = [];
  if (pays.card && card) methods.push({ key: 'card', title: brand, sub: card.num, label: `${brand} ${card.num}` });
  if (pays.apple) methods.push({ key: 'apple', title: 'Apple Pay', sub: user ? `${firstName(user.name)}’s iPhone` : 'This iPhone', label: 'Apple Pay' });
  if (pays.cod) methods.push({ key: 'cod', title: 'Cash on delivery', sub: '+$0', label: 'Cash on delivery' });
  const [payKey, setPayKey] = useState<PayKey>(methods[0]?.key ?? 'card');
  const [paying, setPaying] = useState(false);
  const t = useCartTotals(express);
  const addr = addresses.find((a) => a.id === defaultAddressId) ?? addresses[0];
  const method = methods.find((m) => m.key === payKey) ?? methods[0];

  const pay = async () => {
    if (paying || !t.count) return;
    if (!method) return toast('No payment method', 'Enable one in the admin console');
    if (!addr) return toast('Add an address', 'We need somewhere to deliver');
    setPaying(true);
    try {
      const order = await orders.place({ express, payLabel: method.label });
      haptic('success');
      router.replace({ pathname: '/order-placed', params: { no: order.no } });
    } finally {
      setPaying(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <ScreenStatusBar />
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + HEADER_SPACE, paddingHorizontal: 20, paddingBottom: 160, gap: 10 }}
        showsVerticalScrollIndicator={false}>
        <Animated.View entering={enter(0, reduced)} style={{ gap: 10 }}>
          <SectionLabel>Deliver to</SectionLabel>
          <Card style={{ padding: 16, flexDirection: 'row', gap: 12, alignItems: 'flex-start' }}>
            <View style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: c.accentSoft, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="location_on" size={23} filled color={c.accentText} />
            </View>
            <View style={{ flex: 1, gap: 3 }}>
              <Text style={[font.body(600, 14.5), { color: c.text1 }]}>{user?.name ?? 'Guest'}</Text>
              <Text style={[font.body(400, 13, { lh: 1.45 }), { color: c.text2 }]}>
                {addr ? `${addr.l1}\n${addr.l2}` : 'No address saved\nAdd one in Addresses'}
              </Text>
            </View>
            <Button label="Change" variant="outline" height={34} radius={10} weight={600} fontSize={12.5} style={{ paddingHorizontal: 12 }} onPress={() => router.push('/account/addresses')} />
          </Card>
        </Animated.View>

        <SectionLabel style={{ marginTop: 12 }}>Delivery</SectionLabel>
        <View accessibilityRole="radiogroup" style={{ gap: 10 }}>
          {[
            { exp: false, title: 'Standard', sub: '3–5 business days', price: t.std ? money(t.std) : 'Free' },
            { exp: true, title: 'Express', sub: 'Next day, before 12 PM', price: money(rates.exp) },
          ].map((o, i) => (
            <Animated.View key={o.title} entering={enter(1 + i, reduced)}>
              <RadioCard on={express === o.exp} onPress={() => setExpress(o.exp)} title={o.title} sub={o.sub} right={o.price} />
            </Animated.View>
          ))}
        </View>

        <SectionLabel style={{ marginTop: 12 }}>Payment</SectionLabel>
        <View accessibilityRole="radiogroup" style={{ gap: 10 }}>
          {methods.map((m, i) => (
            <Animated.View key={m.key} entering={enter(3 + i, reduced)}>
              <RadioCard on={payKey === m.key} onPress={() => setPayKey(m.key)} title={m.title} right={m.sub} rightMuted />
            </Animated.View>
          ))}
        </View>

        <Animated.View entering={enter(6, reduced)}>
          <Card style={{ marginTop: 12, padding: 16, gap: 10 }}>
            <SummaryRow label={cnt(t.count, 'item')} value={money(t.sub)} />
            <SummaryRow label="Shipping" value={t.ship ? money(t.ship) : 'Free'} />
          </Card>
        </Animated.View>
      </ScrollView>

      <ScreenHeader title="Checkout" />
      <BottomBar>
        <Button
          height={58}
          icon="lock"
          label={`Pay ${money(t.total)}`}
          loading={paying}
          loadingLabel="Processing…"
          dimmed={!t.count}
          onPress={pay}
        />
      </BottomBar>
    </View>
  );
}
