import * as Linking from 'expo-linking';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';

import { AdminScreen } from '@/components/admin';
import { Card, Photo, StatusPill, SummaryRow } from '@/components/blocks';
import { Button } from '@/components/button';
import { BottomBar } from '@/components/chrome';
import { Icon, type IconName } from '@/components/icon';
import { haptic, PressableScale } from '@/components/pressable-scale';
import { CUSTOMERS, STATUS, STEP_ICONS, STEPS } from '@/data/catalog';
import { withAlpha } from '@/lib/color';
import { clock, cnt, initials, money } from '@/lib/format';
import { lineSubtotal, orderShipping, orderTotal } from '@/lib/pricing';
import { statusOf } from '@/lib/status';
import { useApp, useProductLookup } from '@/store/app-store';
import { toast } from '@/store/ui-store';
import { font } from '@/theme/fonts';
import { EASE_OUT, EASE_SPRING, enter } from '@/theme/motion';
import { useMotion, useTheme } from '@/theme/use-theme';

const NEXT_ICON: IconName[] = ['inventory_2', 'local_shipping', 'home'];
const ACTIVITY_ICON: IconName[] = ['receipt_long', 'inventory_2', 'local_shipping', 'home'];

function StepDot({ i, step }: { i: number; step: number }) {
  const { c } = useTheme();
  const { ms } = useMotion();
  const canc = step === 4;
  const done = !canc && i <= step;
  const cur = !canc && i === step && i < 3;
  const s = useSharedValue(0.6);
  const line = useSharedValue(0);
  useEffect(() => {
    s.set(withDelay(ms(120 + i * 160), withTiming(1, { duration: ms(500), easing: EASE_SPRING })));
    line.set(withDelay(ms(200 + i * 160), withTiming(!canc && i < step ? 1 : 0, { duration: ms(600), easing: EASE_OUT })));
  }, [s, line, i, step, canc, ms]);
  const dot = useAnimatedStyle(() => ({ transform: [{ scale: s.get() }] }));
  const fill = useAnimatedStyle(() => ({ width: `${line.get() * 100}%` }));
  return (
    <View style={{ flex: 1, alignItems: 'center', gap: 8 }}>
      {i < 3 ? (
        <View style={{ position: 'absolute', top: 15, left: '50%', right: '-50%', height: 2, backgroundColor: c.surface2 }}>
          <Animated.View style={[{ height: '100%', backgroundColor: c.accent }, fill]} />
        </View>
      ) : null}
      <Animated.View
        style={[
          {
            width: 32,
            height: 32,
            borderRadius: 16,
            borderWidth: 2,
            borderColor: done ? c.accent : c.lineStrong,
            backgroundColor: done ? c.accent : c.surface1,
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: cur ? `0 0 0 6px ${c.accentSoft}` : undefined,
          },
          dot,
        ]}>
        <Icon name={STEP_ICONS[i]} size={16} filled={done} color={done ? c.accentInk : c.text3} />
      </Animated.View>
      <Text style={[font.mono(600, 9.5, { ls: 0.04, upper: true }), { color: done ? c.text1 : c.text3, textAlign: 'center' }]}>{STATUS[i]}</Text>
    </View>
  );
}

export default function AdminOrderDetail() {
  const { no } = useLocalSearchParams<{ no: string }>();
  const { c } = useTheme();
  const { reduced } = useMotion();
  const o = useApp((s) => s.orders.find((x) => x.no === no));
  const freeAt = useApp((s) => s.freeAt);
  const rates = useApp((s) => s.rates);
  const advanceOrder = useApp((s) => s.advanceOrder);
  const cancelOrder = useApp((s) => s.cancelOrder);
  const addresses = useApp((s) => s.addresses);
  const byId = useProductLookup();

  if (!o) return <Redirect href="/admin/orders" />;

  const cust = CUSTOMERS.find((x) => x.id === o.cid) ?? CUSTOMERS[0];
  const st = statusOf(o.step, c);
  const sub = lineSubtotal(o.items, byId);
  const shipV = orderShipping(o, sub, freeAt, rates);
  const ship = shipV ? money(shipV) : 'Free';
  const addr1 = cust.id === 'c1' ? (addresses[0]?.l1 ?? '214 Foundry St, Apt 3B') : '48 Market Ave';
  const eta = o.step === 4 ? 'cancelled' : o.step >= 3 ? `delivered ${o.etaShort}` : `ETA ${o.etaShort}`;

  const advance = () => {
    const next = STATUS[o.step + 1];
    haptic('success');
    advanceOrder(o.no, `Today, ${clock(new Date())}`);
    toast('Status updated', `${o.no} → ${next}`);
  };
  const cancel = () =>
    Alert.alert('Cancel this order?', `${o.no} will be cancelled and the customer refunded.`, [
      { text: 'Keep order', style: 'cancel' },
      {
        text: 'Cancel order',
        style: 'destructive',
        onPress: () => {
          haptic('warning');
          cancelOrder(o.no);
          toast('Order cancelled', `${o.no} · refund issued`);
        },
      },
    ]);

  return (
    <AdminScreen
      title="Order"
      back
      bottomSpace={150}
      contentStyle={{ gap: 12 }}
      footer={
        <BottomBar style={{ flexDirection: 'row', gap: 10, paddingTop: 12 }}>
          {o.step < 2 ? (
            <PressableScale
              accessibilityLabel="Cancel order"
              onPress={cancel}
              style={{ width: 54, height: 54, borderRadius: 16, borderWidth: 1, borderColor: c.lineStrong, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="block" size={20} color={c.err} />
            </PressableScale>
          ) : null}
          {o.step < 3 ? (
            <Button
              style={{ flex: 1 }}
              height={54}
              radius={16}
              fontSize={14.5}
              icon={NEXT_ICON[o.step]}
              label={`Mark as ${STATUS[o.step + 1].toLowerCase()}`}
              onPress={advance}
            />
          ) : (
            <View style={{ flex: 1, height: 54, borderRadius: 16, borderWidth: 1, borderStyle: 'dashed', borderColor: c.lineStrong, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <Icon name="check_circle" size={18} color={c.text2} />
              <Text style={[font.body(500, 13), { color: c.text2 }]}>{o.step === 4 ? 'Order cancelled · refund issued' : 'Delivered · nothing left to do'}</Text>
            </View>
          )}
        </BottomBar>
      }>
      <Animated.View entering={enter(0, reduced)}>
        <Card radius={22} style={{ padding: 18, gap: 16 }}>
          <View style={{ position: 'absolute', right: -30, top: -30, width: 150, height: 150, borderRadius: 75, backgroundColor: withAlpha(st.color, 0.08) }} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
            <View style={{ flex: 1, minWidth: 0, gap: 6 }}>
              <Text style={[font.mono(500, 10, { ls: 0.1, upper: true }), { color: c.text3 }]}>Order</Text>
              <Text style={[font.num(800, 34), { color: c.text1 }]}>{o.no}</Text>
              <Text numberOfLines={1} style={[font.mono(500, 11), { color: c.text3 }]}>{`${o.date} · ${o.pay}`}</Text>
            </View>
            <StatusPill label={st.label} color={st.color} dot size="md" />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
            {STEPS.map((_, i) => (
              <StepDot key={i} i={i} step={o.step} />
            ))}
          </View>
        </Card>
      </Animated.View>

      <Animated.View entering={enter(1, reduced)}>
        <PressableScale
          scaleTo={0.98}
          onPress={() => router.push({ pathname: '/admin/customer/[id]', params: { id: cust.id } })}
          style={{ paddingVertical: 12, paddingHorizontal: 14, borderRadius: 18, borderWidth: 1, borderColor: c.line, backgroundColor: c.surface1, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: c.accent, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={[font.mono(700, 13), { color: c.accentInk }]}>{initials(cust.name)}</Text>
          </View>
          <View style={{ flex: 1, minWidth: 0, gap: 3 }}>
            <Text style={[font.body(600, 14.5), { color: c.text1 }]}>{cust.name}</Text>
            <Text numberOfLines={1} style={[font.body(400, 12), { color: c.text2 }]}>
              {cust.email}
            </Text>
          </View>
          {(
            [
              ['mail', `Email ${cust.name}`, () => Linking.openURL(`mailto:${cust.email}?subject=${encodeURIComponent(`Your IRONBUILD order ${o.no}`)}`)],
              ['call', `Call ${cust.name}`, () => Linking.openURL('tel:+17185550142')],
            ] as const
          ).map(([icon, label, onPress]) => (
            <Pressable
              key={icon}
              accessibilityRole="button"
              accessibilityLabel={label}
              onPress={() => void onPress()}
              style={{ width: 38, height: 38, borderRadius: 12, borderWidth: 1, borderColor: c.line, backgroundColor: c.bg, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name={icon} size={18} color={c.text2} />
            </Pressable>
          ))}
        </PressableScale>
      </Animated.View>

      <Animated.View entering={enter(2, reduced)}>
        <Card style={{ padding: 14, flexDirection: 'row', gap: 12, alignItems: 'flex-start' }}>
          <View style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: c.accentSoft, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="local_shipping" size={18} color={c.accentText} />
          </View>
          <View style={{ flex: 1, gap: 3 }}>
            <Text style={[font.body(600, 13.5), { color: c.text1 }]}>{`${o.ship === 'exp' ? 'Express' : 'Standard'} delivery · ${eta}`}</Text>
            <Text style={[font.body(400, 12.5, { lh: 1.45 }), { color: c.text2 }]}>{`${addr1}\n${cust.city}`}</Text>
          </View>
          <Text style={[font.mono(600, 12), { color: c.text2 }]}>{ship}</Text>
        </Card>
      </Animated.View>

      <Animated.View entering={enter(3, reduced)}>
        <Card>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: 12, paddingHorizontal: 14, paddingBottom: 4 }}>
            <Text style={[font.display(700, 16), { color: c.text1 }]}>Items</Text>
            <Text style={[font.mono(500, 10.5), { color: c.text3 }]}>{cnt(o.items.reduce((a, b) => a + b.q, 0), 'item')}</Text>
          </View>
          {o.items.map((it) => {
            const p = byId(it.id);
            if (!p) return null;
            return (
              <View key={it.id + it.s} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, paddingLeft: 10, paddingRight: 14 }}>
                <View style={{ width: 52, height: 52, borderRadius: 13, overflow: 'hidden', backgroundColor: c.surface2 }}>
                  <Photo uri={p.img} style={{ width: '100%', height: '100%' }} />
                </View>
                <View style={{ flex: 1, minWidth: 0, gap: 3 }}>
                  <Text style={[font.body(600, 13.5), { color: c.text1 }]}>{p.short}</Text>
                  <Text style={[font.mono(500, 10.5), { color: c.text3 }]}>{`${p.sizes[it.s]} · ${money(p.prices[it.s])} × ${it.q}`}</Text>
                </View>
                <Text style={[font.num(700, 16), { color: c.text1 }]}>{money(p.prices[it.s] * it.q)}</Text>
              </View>
            );
          })}
          <View style={{ gap: 8, paddingTop: 12, paddingHorizontal: 14, paddingBottom: 14, borderTopWidth: 1, borderTopColor: c.line }}>
            <SummaryRow label="Subtotal" value={money(sub)} size={13} />
            <SummaryRow label="Shipping" value={ship} size={13} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: 6, borderTopWidth: 1, borderStyle: 'dashed', borderTopColor: c.lineStrong }}>
              <Text style={[font.body(600, 14), { color: c.text1 }]}>Total paid</Text>
              <Text style={[font.num(800, 26), { color: c.text1 }]}>{money(orderTotal(o, byId, freeAt, rates))}</Text>
            </View>
          </View>
        </Card>
      </Animated.View>

      <Animated.View entering={enter(4, reduced)}>
        <Card style={{ paddingTop: 14, paddingHorizontal: 14, paddingBottom: 6 }}>
          <Text style={[font.display(700, 16), { color: c.text1, marginBottom: 12 }]}>Activity</Text>
          {o.times.map((t, i) => {
            const lastRow = i === o.times.length - 1;
            return (
              <View key={i} style={{ flexDirection: 'row', gap: 12 }}>
                <View style={{ alignItems: 'center', width: 28 }}>
                  <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: lastRow ? c.accent : c.surface2, alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name={ACTIVITY_ICON[i]} size={15} filled color={lastRow ? c.accentInk : c.text2} />
                  </View>
                  {!lastRow ? <View style={{ flex: 1, width: 2, minHeight: 18, backgroundColor: c.line }} /> : null}
                </View>
                <View style={{ gap: 2, paddingBottom: 14 }}>
                  <Text style={[font.body(600, 13.5), { color: c.text1 }]}>{o.step === 4 && i === 0 ? 'Order placed · later cancelled' : STEPS[i]}</Text>
                  <Text style={[font.mono(500, 10.5), { color: c.text3 }]}>{t}</Text>
                </View>
              </View>
            );
          })}
        </Card>
      </Animated.View>
    </AdminScreen>
  );
}
