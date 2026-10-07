import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';

import type { Product } from '@/data/types';
import { useAddToCart } from '@/hooks/use-add-to-cart';
import { money } from '@/lib/format';
import { hasMultiplePrices, minPrice } from '@/lib/pricing';
import { useApp } from '@/store/app-store';
import { font } from '@/theme/fonts';
import { EASE_SPRING } from '@/theme/motion';
import { useMotion, useTheme } from '@/theme/use-theme';

import { Photo } from './blocks';
import { Glass } from './glass';
import { Icon } from './icon';
import { haptic, PressableScale } from './pressable-scale';

/** Heart that pops (scale 1.35 → 1) on toggle. */
export function SaveHeart({
  id,
  size = 34,
  iconSize = 20,
  variant = 'glass',
}: {
  id: string;
  size?: number;
  iconSize?: number;
  variant?: 'glass' | 'tile' | 'photo';
}) {
  const { c } = useTheme();
  const { ms } = useMotion();
  const saved = useApp((s) => s.saved.includes(id));
  const toggle = useApp((s) => s.toggleSaved);
  const pop = useSharedValue(1);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    pop.set(withSequence(withTiming(1.35, { duration: ms(130) }), withTiming(1, { duration: ms(320), easing: EASE_SPRING })));
  }, [saved, pop, ms]);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: pop.get() }] }));

  const icon = <Icon name="favorite" size={iconSize} filled={saved} color={saved ? c.accentText : variant === 'photo' ? '#f3f3ef' : c.text1} />;
  const box = { width: size, height: size, alignItems: 'center', justifyContent: 'center' } as const;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={saved ? 'Remove from wishlist' : 'Save to wishlist'}
      accessibilityState={{ selected: saved }}
      hitSlop={6}
      onPress={(e) => {
        e.stopPropagation();
        haptic('light');
        toggle(id);
      }}>
      <Animated.View style={anim}>
        {variant === 'tile' ? (
          <View style={[box, { borderRadius: 12, borderWidth: 1, borderColor: c.line, backgroundColor: c.bg }]}>{icon}</View>
        ) : (
          <Glass forceDark={variant === 'photo'} style={[box, { borderRadius: size / 2, borderWidth: 1, borderColor: c.glassLine }]}>
            {icon}
          </Glass>
        )}
      </Animated.View>
    </Pressable>
  );
}

/** Square accent "+" button that triggers fly-to-cart. */
export function QuickAdd({ product, size = 34, radius = 11, label = 'Quick add' }: { product: Product; size?: number; radius?: number; label?: string }) {
  const { c } = useTheme();
  const ref = useRef<View>(null);
  const add = useAddToCart();
  return (
    <PressableScale
      ref={ref}
      scaleTo={0.85}
      accessibilityLabel={`${label}: ${product.short}`}
      onPress={(e) => {
        e.stopPropagation();
        void add(product, product.def, 1, ref.current);
      }}
      style={{ width: size, height: size, borderRadius: radius, backgroundColor: c.accent, alignItems: 'center', justifyContent: 'center' }}>
      <Icon name="add" size={20} color={c.accentInk} />
    </PressableScale>
  );
}

export const openProduct = (id: string) => router.push({ pathname: '/product/[id]', params: { id } });

/** Two-up grid card: square photo, tag, heart, category, name, price, quick add. */
export function ProductCard({ product: p }: { product: Product }) {
  const { c } = useTheme();
  return (
    <PressableScale
      scaleTo={0.98}
      onPress={() => openProduct(p.id)}
      accessibilityLabel={`${p.name}, from ${money(minPrice(p))}`}
      style={{ flex: 1, backgroundColor: c.surface1, borderWidth: 1, borderColor: c.line, borderRadius: 20, padding: 6, paddingBottom: 12, gap: 10 }}>
      <View style={{ aspectRatio: 1, borderRadius: 15, overflow: 'hidden', backgroundColor: c.surface2 }}>
        <Photo uri={p.img} style={{ width: '100%', height: '100%' }} />
        {p.tag ? (
          <View style={{ position: 'absolute', top: 8, left: 8, paddingVertical: 5, paddingHorizontal: 8, borderRadius: 8, backgroundColor: c.accent }}>
            <Text style={[font.mono(600, 9.5, { ls: 0.04, upper: true }), { color: c.accentInk }]}>{p.tag}</Text>
          </View>
        ) : null}
        <View style={{ position: 'absolute', top: 6, right: 6 }}>
          <SaveHeart id={p.id} />
        </View>
      </View>
      <View style={{ paddingHorizontal: 6, gap: 3 }}>
        <Text numberOfLines={1} style={[font.mono(500, 9.5, { ls: 0.08, upper: true, lh: 1.2 }), { color: c.text3 }]}>
          {p.cat}
        </Text>
        <Text numberOfLines={2} style={[font.body(600, 14, { lh: 1.25 }), { color: c.text1 }]}>
          {p.short}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 5, flexShrink: 1 }}>
            {hasMultiplePrices(p) ? <Text style={[font.mono(500, 9), { color: c.text3 }]}>FROM</Text> : null}
            <Text style={[font.num(700, 22), { color: c.text1 }]}>{money(minPrice(p))}</Text>
            {p.was ? (
              <Text style={[font.mono(500, 10.5), { color: c.text3, textDecorationLine: 'line-through' }]}>{money(Math.min(...p.was))}</Text>
            ) : null}
          </View>
          <QuickAdd product={p} />
        </View>
      </View>
    </PressableScale>
  );
}
