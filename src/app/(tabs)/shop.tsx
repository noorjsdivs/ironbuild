import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useShallow } from 'zustand/react/shallow';

import { EmptyState, Photo, SearchBox } from '@/components/blocks';
import { ScreenStatusBar, TABBAR_SPACE, TOP_GAP } from '@/components/chrome';
import { Chip } from '@/components/controls';
import { Glass } from '@/components/glass';
import { Icon } from '@/components/icon';
import { PressableScale } from '@/components/pressable-scale';
import { ProductGrid } from '@/components/product-grid';
import { CAT_IMG } from '@/data/catalog';
import { activeFilterCount, useShopResults } from '@/hooks/use-shop-results';
import { cnt } from '@/lib/format';
import { useLiveProducts, useVisibleCats } from '@/store/app-store';
import { useUI } from '@/store/ui-store';
import { font } from '@/theme/fonts';
import { enter } from '@/theme/motion';
import { useMotion, useTheme } from '@/theme/use-theme';

export default function ShopScreen() {
  const { c } = useTheme();
  const { reduced } = useMotion();
  const insets = useSafeAreaInsets();
  const cats = useVisibleCats();
  const live = useLiveProducts();
  const { cat, q, filters, setCat, setQuery, resetBrowse, searchFocus } = useUI(
    useShallow((s) => ({
      cat: s.cat,
      q: s.q,
      filters: s.filters,
      setCat: s.setCat,
      setQuery: s.setQuery,
      resetBrowse: s.resetBrowse,
      searchFocus: s.searchFocus,
    })),
  );
  const list = useShopResults();
  const fCount = activeFilterCount(filters);
  const browse = cat === 'All' && !q.trim() && !fCount;
  const inputRef = useRef<TextInput>(null);
  const scrollRef = useRef<ScrollView>(null);
  const chipsRef = useRef<ScrollView>(null);
  const chipX = useRef<Record<string, number>>({});

  // Keep the active category chip in view (e.g. when arriving from a Home banner).
  useEffect(() => {
    const x = chipX.current[cat];
    if (x !== undefined) chipsRef.current?.scrollTo({ x: Math.max(0, x - 20), animated: !reduced });
  }, [cat, reduced]);

  useEffect(() => {
    if (!searchFocus) return;
    const t = setTimeout(() => inputRef.current?.focus(), reduced ? 0 : 420);
    return () => clearTimeout(t);
  }, [searchFocus, reduced]);

  const pickCat = (next: typeof cat) => {
    setCat(next);
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <ScreenStatusBar />
      <ScrollView
        ref={scrollRef}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={{ paddingTop: insets.top + TOP_GAP, paddingBottom: TABBAR_SPACE }}
        showsVerticalScrollIndicator={false}>
        <Animated.View
          entering={enter(0, reduced)}
          style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 6 }}>
          <Text accessibilityRole="header" numberOfLines={1} style={[font.display(800, 36), { color: c.text1, flexShrink: 1 }]}>
            {cat === 'All' ? 'Shop' : cat}
          </Text>
          <Text style={[font.mono(500, 11), { color: c.text3 }]}>{cnt(list.length, 'item')}</Text>
        </Animated.View>

        <Animated.View entering={enter(1, reduced)} style={{ flexDirection: 'row', gap: 10, marginTop: 14, marginHorizontal: 20 }}>
          <SearchBox
            inputRef={inputRef}
            value={q}
            onChangeText={setQuery}
            placeholder="Search gear"
            height={50}
            right={
              q ? (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Clear search"
                  onPress={() => setQuery('')}
                  style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: c.surface2, alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="close" size={18} color={c.text1} />
                </Pressable>
              ) : null
            }
          />
          <PressableScale
            scaleTo={0.9}
            haptic="light"
            accessibilityLabel={fCount ? `Filters, ${fCount} active` : 'Filters'}
            onPress={() => router.push('/filters')}
            style={{ width: 50, height: 50, borderRadius: 16, backgroundColor: c.accent, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="tune" size={23} color={c.accentInk} />
            {fCount > 0 ? (
              <View
                style={{
                  position: 'absolute',
                  top: -5,
                  right: -5,
                  minWidth: 20,
                  height: 20,
                  paddingHorizontal: 5,
                  borderRadius: 10,
                  backgroundColor: c.text1,
                  borderWidth: 2,
                  borderColor: c.bg,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text style={[font.mono(700, 10), { color: c.bg }]}>{fCount}</Text>
              </View>
            ) : null}
          </PressableScale>
        </Animated.View>

        <Animated.View entering={enter(2, reduced)}>
          <ScrollView
            ref={chipsRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8, paddingHorizontal: 20, paddingTop: 14, paddingBottom: 2 }}>
            {(['All', ...cats] as const).map((label) => (
              <View
                key={label}
                onLayout={(e) => {
                  chipX.current[label] = e.nativeEvent.layout.x;
                  if (label === cat && label !== 'All') chipsRef.current?.scrollTo({ x: Math.max(0, e.nativeEvent.layout.x - 20), animated: false });
                }}>
                <Chip label={label} on={cat === label} onPress={() => pickCat(label)} />
              </View>
            ))}
          </ScrollView>
        </Animated.View>

        {browse ? (
          <>
            <Animated.View entering={enter(3, reduced)}>
              <Text accessibilityRole="header" style={[font.display(700, 22), { color: c.text1, paddingHorizontal: 20, marginTop: 22, marginBottom: 12 }]}>
                Browse categories
              </Text>
            </Animated.View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, paddingHorizontal: 20 }}>
              {cats.map((cc, i) => (
                <Animated.View key={cc} entering={enter(4 + i, reduced)} style={{ width: '48.5%', flexGrow: 1 }}>
                  <PressableScale
                    scaleTo={0.97}
                    onPress={() => pickCat(cc)}
                    accessibilityLabel={cc}
                    style={{ height: 104, borderRadius: 18, borderWidth: 1, borderColor: c.line, overflow: 'hidden' }}>
                    <Photo uri={CAT_IMG[cc]} style={{ position: 'absolute', inset: 0 }} />
                    <Glass
                      style={{
                        position: 'absolute',
                        left: 8,
                        right: 8,
                        bottom: 8,
                        paddingVertical: 8,
                        paddingHorizontal: 10,
                        borderRadius: 11,
                        borderWidth: 1,
                        borderColor: c.glassLine,
                        gap: 2,
                      }}>
                      <Text numberOfLines={1} style={[font.display(700, 17), { color: c.text1 }]}>
                        {cc}
                      </Text>
                      <Text style={[font.mono(500, 9.5), { color: c.text2 }]}>{cnt(live.filter((p) => p.cat === cc).length, 'item')}</Text>
                    </Glass>
                  </PressableScale>
                </Animated.View>
              ))}
            </View>
            <Text accessibilityRole="header" style={[font.display(700, 22), { color: c.text1, paddingHorizontal: 20, marginTop: 26, marginBottom: 12 }]}>
              All gear
            </Text>
          </>
        ) : (
          <View style={{ height: 16 }} />
        )}

        {list.length === 0 ? (
          <EmptyState
            title="No gear found"
            body="Nothing matches those filters. Try a broader search."
            cta="Clear filters"
            onCta={resetBrowse}
            style={{ marginTop: 24, marginHorizontal: 20, paddingVertical: 28 }}
          />
        ) : (
          <ProductGrid key={`${cat}|${filters.sort}|${filters.max}|${filters.sale}`} products={list} stagger={browse ? 9 : 1} />
        )}
      </ScrollView>
    </View>
  );
}
