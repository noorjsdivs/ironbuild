import { router } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EmptyState, Photo } from '@/components/blocks';
import { ScreenStatusBar, TABBAR_SPACE, TOP_GAP } from '@/components/chrome';
import { PressableScale } from '@/components/pressable-scale';
import { openProduct, QuickAdd, SaveHeart } from '@/components/product-card';
import { cnt, money } from '@/lib/format';
import { minPrice } from '@/lib/pricing';
import { useApp } from '@/store/app-store';
import { useUI } from '@/store/ui-store';
import { font } from '@/theme/fonts';
import { enter } from '@/theme/motion';
import { useMotion, useTheme } from '@/theme/use-theme';

export default function WishlistScreen() {
  const { c } = useTheme();
  const { reduced } = useMotion();
  const insets = useSafeAreaInsets();
  const saved = useApp((s) => s.saved);
  const products = useApp((s) => s.products);
  const setCat = useUI((s) => s.setCat);
  const items = saved.map((id) => products.find((p) => p.id === id)).filter((p) => p !== undefined);

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <ScreenStatusBar />
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + TOP_GAP, paddingBottom: TABBAR_SPACE }} showsVerticalScrollIndicator={false}>
        <Animated.View
          entering={enter(0, reduced)}
          style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 6, paddingBottom: 18 }}>
          <Text accessibilityRole="header" style={[font.display(800, 36), { color: c.text1 }]}>
            Wishlist
          </Text>
          <Text style={[font.mono(500, 11), { color: c.text3 }]}>{cnt(items.length, 'item')}</Text>
        </Animated.View>

        {items.length === 0 ? (
          <EmptyState
            icon="favorite"
            iconColor={c.text1}
            title="Nothing saved yet"
            body="Tap the heart on any product to keep it here."
            cta="Browse gear"
            onCta={() => {
              setCat('All');
              router.navigate('/shop');
            }}
            style={{ marginTop: 22, marginHorizontal: 20 }}
          />
        ) : null}

        <View style={{ gap: 10, paddingHorizontal: 20 }}>
          {items.map((p, i) => (
            <Animated.View key={p.id} entering={enter(1 + i, reduced)} layout={reduced ? undefined : LinearTransition.duration(300)}>
              <PressableScale
                scaleTo={0.98}
                onPress={() => openProduct(p.id)}
                accessibilityLabel={`${p.name}, ${money(minPrice(p))}`}
                style={{ flexDirection: 'row', gap: 12, alignItems: 'center', padding: 8, borderRadius: 20, backgroundColor: c.surface1, borderWidth: 1, borderColor: c.line }}>
                <View style={{ width: 88, height: 88, borderRadius: 14, overflow: 'hidden', backgroundColor: c.surface2 }}>
                  <Photo uri={p.img} style={{ width: '100%', height: '100%' }} />
                </View>
                <View style={{ flex: 1, minWidth: 0, gap: 4 }}>
                  <Text style={[font.mono(500, 9.5, { ls: 0.08, upper: true }), { color: c.text3 }]}>{p.cat}</Text>
                  <Text style={[font.body(600, 15, { lh: 1.25 }), { color: c.text1 }]}>{p.short}</Text>
                  <Text style={[font.num(700, 22), { color: c.text1 }]}>{money(minPrice(p))}</Text>
                </View>
                <View style={{ gap: 8, paddingRight: 4 }}>
                  <SaveHeart id={p.id} size={38} variant="tile" />
                  <QuickAdd product={p} size={38} radius={12} label="Add to cart" />
                </View>
              </PressableScale>
            </Animated.View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
