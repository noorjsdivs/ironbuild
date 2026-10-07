import { router } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Photo, SectionHeader } from '@/components/blocks';
import { ScreenStatusBar, TABBAR_SPACE, TOP_GAP } from '@/components/chrome';
import { HeroCarousel } from '@/components/hero-carousel';
import {
  DealOfTheDay,
  HomeFooter,
  JournalHeader,
  JournalSection,
  NewsletterCard,
  PerksStrip,
  ProductRail,
  RecentRail,
  ReviewsRail,
} from '@/components/home-sections';
import { Icon } from '@/components/icon';
import { PressableScale } from '@/components/pressable-scale';
import { ProductGrid } from '@/components/product-grid';
import { Wordmark } from '@/components/wordmark';
import { CAT_IMG, TRENDING_IDS } from '@/data/catalog';
import { ARTICLES } from '@/data/journal';
import { cnt, firstName, greeting } from '@/lib/format';
import { useApp, useLiveProducts, useVisibleCats } from '@/store/app-store';
import { useUI } from '@/store/ui-store';
import { font } from '@/theme/fonts';
import { enter } from '@/theme/motion';
import { useMotion, useTheme } from '@/theme/use-theme';

export default function HomeScreen() {
  const { c } = useTheme();
  const { reduced } = useMotion();
  const insets = useSafeAreaInsets();
  const user = useApp((s) => s.user);
  const live = useLiveProducts();
  const cats = useVisibleCats();
  const setCat = useUI((s) => s.setCat);
  const requestSearchFocus = useUI((s) => s.requestSearchFocus);

  const recentIds = useApp((s) => s.recentlyViewed);

  const trending = TRENDING_IDS.map((id) => live.find((p) => p.id === id)).filter((p) => p !== undefined);
  // Newest first: tagged "New", then most recently added to the catalog.
  const newArrivals = [...live.filter((p) => p.tag === 'New'), ...[...live].reverse().filter((p) => p.tag !== 'New')].slice(0, 6);
  const recent = recentIds.map((id) => live.find((p) => p.id === id)).filter((p) => p !== undefined).slice(0, 6);
  const featured = ARTICLES.find((a) => a.featured) ?? ARTICLES[0];
  const stories = ARTICLES.filter((a) => a.id !== featured.id).slice(0, 5);
  const shopCat = (cat: (typeof cats)[number] | 'All') => {
    setCat(cat);
    router.navigate('/shop');
  };

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <ScreenStatusBar />
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + TOP_GAP, paddingBottom: TABBAR_SPACE }}
        showsVerticalScrollIndicator={false}>
        <Animated.View entering={enter(0, reduced)} style={{ paddingHorizontal: 20, paddingTop: 6, gap: 4 }}>
          <Text style={[font.mono(500, 10.5, { ls: 0.08, upper: true, lh: 1 }), { color: c.text3 }]}>
            {user ? `${greeting()}, ${firstName(user.name)}` : 'Welcome to'}
          </Text>
          <Wordmark size={32} />
        </Animated.View>

        <Animated.View entering={enter(1, reduced)} style={{ marginTop: 16, marginHorizontal: 20 }}>
          <PressableScale
            scaleTo={0.98}
            accessibilityLabel="Search products"
            onPress={() => {
              setCat('All');
              requestSearchFocus();
              router.navigate('/shop');
            }}
            style={{
              height: 50,
              borderRadius: 16,
              backgroundColor: c.surface1,
              borderWidth: 1,
              borderColor: c.line,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
              paddingLeft: 14,
              paddingRight: 8,
            }}>
            <Icon name="search" size={23} color={c.text3} />
            <Text style={[font.body(500, 14.5), { flex: 1, color: c.text3 }]}>Search dumbbells, racks, whey…</Text>
            <View style={{ width: 36, height: 36, borderRadius: 11, backgroundColor: c.accent, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="tune" size={20} color={c.accentInk} />
            </View>
          </PressableScale>
        </Animated.View>

        <Animated.View entering={enter(2, reduced)} style={{ marginTop: 16, marginHorizontal: 20 }}>
          <HeroCarousel />
        </Animated.View>

        <Animated.View entering={enter(3, reduced)} style={{ marginTop: 18 }}>
          <PerksStrip />
        </Animated.View>

        <Animated.View entering={enter(3, reduced)}>
          <SectionHeader title="Shop by category" action="See all →" onAction={() => shopCat('All')} style={{ paddingHorizontal: 20, marginTop: 24, marginBottom: 12 }} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingHorizontal: 20 }}>
            {cats.map((cat) => (
              <PressableScale
                key={cat}
                scaleTo={0.95}
                onPress={() => shopCat(cat)}
                accessibilityLabel={cat}
                style={{ width: 112, gap: 8, padding: 6, paddingBottom: 10, borderRadius: 18, borderWidth: 1, borderColor: c.line, backgroundColor: c.surface1 }}>
                <View style={{ height: 76, borderRadius: 13, overflow: 'hidden', backgroundColor: c.surface2 }}>
                  <Photo uri={CAT_IMG[cat]} style={{ width: '100%', height: '100%' }} />
                </View>
                <Text numberOfLines={2} style={[font.body(600, 13, { lh: 1.2 }), { paddingHorizontal: 4, color: c.text1, minHeight: 31 }]}>
                  {cat}
                </Text>
                <Text style={[font.mono(500, 10), { paddingHorizontal: 4, color: c.text3 }]}>{cnt(live.filter((p) => p.cat === cat).length, 'item')}</Text>
              </PressableScale>
            ))}
          </ScrollView>
        </Animated.View>

        <Animated.View entering={enter(4, reduced)} style={{ marginTop: 26, marginHorizontal: 20 }}>
          <DealOfTheDay />
        </Animated.View>

        <Animated.View entering={enter(4, reduced)}>
          <SectionHeader title="Trending now" meta="Updated hourly" style={{ paddingHorizontal: 20, marginTop: 26, marginBottom: 12 }} />
        </Animated.View>
        <ProductGrid products={trending} stagger={5} />

        <SectionHeader title="Just landed" action="Shop new →" onAction={() => shopCat('All')} style={{ paddingHorizontal: 20, marginTop: 30, marginBottom: 12 }} />
        <ProductRail products={newArrivals} />

        {recent.length ? (
          <>
            <SectionHeader title="Recently viewed" meta={cnt(recent.length, 'item')} style={{ paddingHorizontal: 20, marginTop: 30, marginBottom: 12 }} />
            <RecentRail products={recent} />
          </>
        ) : null}

        <JournalHeader />
        <JournalSection featured={featured} rest={stories} />

        <SectionHeader title="Loved by lifters" meta="4.8 ★ · 12k reviews" style={{ paddingHorizontal: 20, marginTop: 30, marginBottom: 12 }} />
        <ReviewsRail />

        <View style={{ marginTop: 30, marginHorizontal: 20, gap: 24 }}>
          <NewsletterCard />
          <HomeFooter />
        </View>
      </ScrollView>
    </View>
  );
}
