import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { FadeOut, LinearTransition } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Card, EmptyState, Photo, SummaryRow } from '@/components/blocks';
import { Button } from '@/components/button';
import { ScreenStatusBar, TABBAR_SPACE, TOP_GAP } from '@/components/chrome';
import { Stepper } from '@/components/controls';
import { Icon } from '@/components/icon';
import { openProduct } from '@/components/product-card';
import { ProgressBar } from '@/components/progress-bar';
import { cnt, money } from '@/lib/format';
import { useApp, useCartTotals, useProductLookup } from '@/store/app-store';
import { useUI } from '@/store/ui-store';
import { font } from '@/theme/fonts';
import { enter } from '@/theme/motion';
import { useMotion, useTheme } from '@/theme/use-theme';

export default function CartScreen() {
  const { c } = useTheme();
  const { reduced } = useMotion();
  const insets = useSafeAreaInsets();
  const cart = useApp((s) => s.cart);
  const changeQty = useApp((s) => s.changeQty);
  const removeLine = useApp((s) => s.removeLine);
  const byId = useProductLookup();
  const t = useCartTotals();
  const setCat = useUI((s) => s.setCat);

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <ScreenStatusBar />
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + TOP_GAP, paddingBottom: TABBAR_SPACE }} showsVerticalScrollIndicator={false}>
        <Animated.View
          entering={enter(0, reduced)}
          style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 6 }}>
          <Text accessibilityRole="header" style={[font.display(800, 36), { color: c.text1 }]}>
            Cart
          </Text>
          <Text style={[font.mono(500, 11), { color: c.text3 }]}>{cnt(t.count, 'item')}</Text>
        </Animated.View>

        {cart.length === 0 ? (
          <EmptyState
            icon="shopping_cart"
            title="Your cart is empty"
            body={`Free shipping on orders over ${money(t.freeAt)}.`}
            cta="Browse gear"
            onCta={() => {
              setCat('All');
              router.navigate('/shop');
            }}
            style={{ marginTop: 40, marginHorizontal: 20 }}
          />
        ) : (
          <>
            <Animated.View entering={enter(1, reduced)}>
              <Card style={{ marginTop: 16, marginHorizontal: 20, paddingVertical: 14, paddingHorizontal: 16, gap: 10 }}>
                <Text style={[font.body(500, 13), { color: c.text2 }]}>
                  {t.sub >= t.freeAt ? 'Free shipping unlocked' : `Add ${money(t.freeAt - t.sub)} more for free shipping`}
                </Text>
                <ProgressBar pct={(t.sub / Math.max(1, t.freeAt)) * 100} />
              </Card>
            </Animated.View>

            <View style={{ gap: 10, paddingTop: 14, paddingHorizontal: 20 }}>
              {cart.map((l, i) => {
                const p = byId(l.id);
                if (!p) return null;
                return (
                  <Animated.View
                    key={l.id + l.s}
                    entering={enter(2 + i, reduced, 'right')}
                    exiting={reduced ? undefined : FadeOut.duration(200)}
                    layout={reduced ? undefined : LinearTransition.duration(300)}>
                    <Card radius={20} style={{ flexDirection: 'row', gap: 12, padding: 8 }}>
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={`Open ${p.name}`}
                        onPress={() => openProduct(p.id)}
                        style={{ width: 84, height: 84, borderRadius: 14, overflow: 'hidden', backgroundColor: c.surface2 }}>
                        <Photo uri={p.img} style={{ width: '100%', height: '100%' }} />
                      </Pressable>
                      <View style={{ flex: 1, minWidth: 0, justifyContent: 'space-between', paddingVertical: 2 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}>
                          <View style={{ flex: 1, minWidth: 0, gap: 3 }}>
                            <Text style={[font.body(600, 14.5, { lh: 1.25 }), { color: c.text1 }]}>{p.short}</Text>
                            <Text style={[font.mono(500, 10.5), { color: c.text3 }]}>{p.sizes[l.s]}</Text>
                          </View>
                          <Pressable
                            accessibilityRole="button"
                            accessibilityLabel={`Remove ${p.short}`}
                            onPress={() => removeLine(l.id, l.s)}
                            hitSlop={6}
                            style={{ width: 30, height: 30, borderRadius: 10, backgroundColor: c.surface2, alignItems: 'center', justifyContent: 'center' }}>
                            <Icon name="close" size={17} color={c.text1} />
                          </Pressable>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Text style={[font.num(700, 22), { color: c.text1 }]}>{money(p.prices[l.s] * l.q)}</Text>
                          <Stepper value={l.q} onInc={() => changeQty(l.id, l.s, 1)} onDec={() => changeQty(l.id, l.s, -1)} label={p.short} />
                        </View>
                      </View>
                    </Card>
                  </Animated.View>
                );
              })}
            </View>

            <Animated.View entering={enter(2, reduced)} layout={reduced ? undefined : LinearTransition.duration(300)}>
              <Card radius={20} style={{ marginTop: 16, marginHorizontal: 20, padding: 16, gap: 10 }}>
                <SummaryRow label="Subtotal" value={money(t.sub)} />
                <SummaryRow label="Standard shipping" value={t.std ? money(t.std) : 'Free'} />
                <View style={{ height: 1, backgroundColor: c.line }} />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <Text style={[font.body(600, 15), { color: c.text1 }]}>Total</Text>
                  <Text style={[font.num(800, 28), { color: c.text1 }]}>{money(t.sub + t.std)}</Text>
                </View>
                <Button label="Checkout" trailingIcon="arrow_forward" style={{ marginTop: 4 }} onPress={() => router.push('/checkout')} />
              </Card>
            </Animated.View>
          </>
        )}
      </ScrollView>
    </View>
  );
}
