import { Redirect, router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Pressable, Share, Text, View } from 'react-native';
import Animated, { interpolate, useAnimatedRef, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Pill } from '@/components/blocks';
import { Button } from '@/components/button';
import { BackButton, BottomBar, ScreenStatusBar } from '@/components/chrome';
import { Stepper } from '@/components/controls';
import { Glass } from '@/components/glass';
import { ProductRail } from '@/components/home-sections';
import { Icon } from '@/components/icon';
import { haptic } from '@/components/pressable-scale';
import { SaveHeart } from '@/components/product-card';
import {
  BoughtTogether,
  DeliveryCard,
  DetailTabs,
  GALLERY_H,
  InfoAccordion,
  OptionPicker,
  PriceBlock,
  ProductGallery,
  StockMeter,
  type PdpTab,
} from '@/components/product-detail';
import { detailsFor } from '@/data/product-details';
import { useAddToCart } from '@/hooks/use-add-to-cart';
import { money } from '@/lib/format';
import { useApp, useCartCount, useLiveProducts, useProduct } from '@/store/app-store';
import { font } from '@/theme/fonts';
import { enter } from '@/theme/motion';
import { FIXED } from '@/theme/tokens';
import { useMotion, useTheme } from '@/theme/use-theme';

const GLASS_BTN = { width: 44, height: 44, borderRadius: 22, borderWidth: 1, borderColor: 'rgba(255,255,255,0.14)', alignItems: 'center', justifyContent: 'center' } as const;

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const p = useProduct(id);
  const { c } = useTheme();
  const { reduced } = useMotion();
  const insets = useSafeAreaInsets();
  const cartCount = useCartCount();
  const live = useLiveProducts();
  const add = useAddToCart();
  const markViewed = useApp((s) => s.markViewed);
  const [size, setSize] = useState(p?.def ?? 0);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<PdpTab>('overview');
  const [added, setAdded] = useState(false);
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((e) => {
    scrollY.set(e.contentOffset.y);
  });
  // Glass bar with the product name fades in once the gallery scrolls away.
  const barStyle = useAnimatedStyle(() => ({ opacity: interpolate(scrollY.get(), [GALLERY_H - 200, GALLERY_H - 110], [0, 1], 'clamp') }));
  const tabsY = useRef(0);
  const addBtnRef = useRef<View>(null);
  const cartBtnRef = useRef<View>(null);

  useEffect(() => {
    if (p?.id) markViewed(p.id);
  }, [p?.id, markViewed]);

  useEffect(() => {
    if (!added) return;
    const t = setTimeout(() => setAdded(false), 1800);
    return () => clearTimeout(t);
  }, [added]);

  if (!p) return <Redirect href="/shop" />;

  const detail = detailsFor(p);
  const price = p.prices[size] ?? p.prices[0];
  const out = p.stock <= 0;
  const similar = [...live.filter((x) => x.cat === p.cat && x.id !== p.id), ...live.filter((x) => x.cat !== p.cat)].slice(0, 6);

  const showReviews = () => {
    setTab('reviews');
    // tabsY is relative to the padded content block that starts below the gallery.
    scrollRef.current?.scrollTo({ y: Math.max(0, GALLERY_H + 22 + tabsY.current - insets.top - 86), animated: !reduced });
  };
  const share = () => {
    haptic('light');
    void Share.share({ title: p.name, message: `${p.name} — ${money(price)} at IRONBUILD\nironbuild://product/${p.id}` });
  };

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <ScreenStatusBar style="light" />
      <Animated.ScrollView ref={scrollRef} onScroll={onScroll} scrollEventThrottle={16} contentContainerStyle={{ paddingBottom: 150 }} showsVerticalScrollIndicator={false}>
        <ProductGallery product={p} />

        <View style={{ paddingTop: 22, paddingHorizontal: 20, gap: 18 }}>
          <Animated.View entering={enter(1, reduced)} style={{ gap: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={[font.eyebrow(), { color: c.text3 }]}>{p.cat}</Text>
              {p.tag ? <Pill label={p.tag} bg={c.accentSoft} fg={c.accentText} /> : null}
              <View style={{ flex: 1 }} />
              <Text style={[font.mono(500, 10.5), { color: c.text3 }]}>{p.sku}</Text>
            </View>
            <Text accessibilityRole="header" style={[font.display(800, 40, { lh: 0.95 }), { color: c.text1 }]}>
              {p.name}
            </Text>
          </Animated.View>

          <Animated.View entering={enter(2, reduced)}>
            <PriceBlock product={p} size={size} qty={qty} onReviews={showReviews} />
          </Animated.View>

          <Animated.View entering={enter(3, reduced)}>
            <StockMeter stock={p.stock} />
          </Animated.View>

          <View style={{ height: 1, backgroundColor: c.line }} />

          <Animated.View entering={enter(4, reduced)}>
            <OptionPicker product={p} size={size} onChange={setSize} detail={detail} />
          </Animated.View>

          <Animated.View entering={enter(5, reduced)} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ gap: 3 }}>
              <Text style={[font.eyebrow(), { color: c.text3 }]}>Quantity</Text>
              <Text style={[font.body(500, 12), { color: c.text2 }]}>Max 9 per order</Text>
            </View>
            <Stepper value={qty} size={44} minWidth={28} surface="surface1" onInc={() => setQty((q) => Math.min(9, q + 1))} onDec={() => setQty((q) => Math.max(1, q - 1))} />
          </Animated.View>

          <Animated.View entering={enter(6, reduced)}>
            <DeliveryCard price={price * qty} detail={detail} />
          </Animated.View>

          <Animated.View entering={enter(7, reduced)} onLayout={(e) => (tabsY.current = e.nativeEvent.layout.y)} style={{ marginTop: 6 }}>
            <DetailTabs product={p} detail={detail} tab={tab} onTab={setTab} />
          </Animated.View>

          <InfoAccordion detail={detail} />

          <BoughtTogether product={p} size={size} detail={detail} />
        </View>

        {similar.length ? (
          <View style={{ marginTop: 28, gap: 12 }}>
            <Text style={[font.display(700, 22), { color: c.text1, paddingHorizontal: 20 }]}>You might also like</Text>
            <ProductRail products={similar} />
          </View>
        ) : null}
      </Animated.ScrollView>

      <Animated.View pointerEvents="none" style={[{ position: 'absolute', top: 0, left: 0, right: 0, height: insets.top + 56, zIndex: 2 }, barStyle]}>
        <Glass tone="strong" style={{ flex: 1, borderBottomWidth: 1, borderBottomColor: c.glassLine, justifyContent: 'flex-end', paddingBottom: 20, paddingLeft: 72, paddingRight: 160 }}>
          <Text numberOfLines={1} style={[font.display(800, 18), { color: c.text1 }]}>
            {p.short}
          </Text>
        </Glass>
      </Animated.View>

      {/* Floating controls over the gallery */}
      <View style={{ position: 'absolute', top: insets.top + 4, left: 0, right: 0, paddingHorizontal: 16, flexDirection: 'row', justifyContent: 'space-between', zIndex: 3 }}>
        <BackButton overPhoto />
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Pressable accessibilityRole="button" accessibilityLabel="Share product" onPress={share}>
            <Glass forceDark style={GLASS_BTN}>
              <Icon name="ios_share" size={21} color={FIXED.onPhoto} />
            </Glass>
          </Pressable>
          <SaveHeart id={p.id} size={44} iconSize={23} variant="photo" />
          <Pressable
            ref={cartBtnRef}
            accessibilityRole="button"
            accessibilityLabel={`Cart, ${cartCount} items`}
            onPress={() => {
              haptic('light');
              router.navigate('/cart');
            }}>
            <Glass forceDark style={GLASS_BTN}>
              <Icon name="shopping_cart" size={23} color={FIXED.onPhoto} />
            </Glass>
            {cartCount > 0 ? (
              <View style={{ position: 'absolute', top: -3, right: -3, minWidth: 20, height: 20, paddingHorizontal: 5, borderRadius: 10, backgroundColor: c.accent, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={[font.mono(700, 10), { color: c.accentInk }]}>{cartCount}</Text>
              </View>
            ) : null}
          </Pressable>
        </View>
      </View>

      <BottomBar style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
        <View style={{ gap: 3 }}>
          <Text style={[font.mono(500, 10, { ls: 0.08, upper: true }), { color: c.text3 }]}>
            {p.sizes.length > 1 ? `${p.sizes[size]} · Qty ${qty}` : `Qty ${qty}`}
          </Text>
          <Text style={[font.num(800, 28), { color: c.text1 }]}>{money(price * qty)}</Text>
        </View>
        <Button
          ref={addBtnRef}
          style={{ flex: 1 }}
          height={58}
          icon={added ? 'check' : 'shopping_cart'}
          label={out ? 'Out of stock' : added ? 'Added to cart' : 'Add to cart'}
          dimmed={out}
          onPress={() => {
            if (out) return;
            void add(p, size, qty, addBtnRef.current, cartBtnRef.current);
            setAdded(true);
          }}
        />
      </BottomBar>
    </View>
  );
}

