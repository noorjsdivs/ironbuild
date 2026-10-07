import { LinearGradient } from 'expo-linear-gradient';
import { Redirect, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, Share, Text, View, useWindowDimensions } from 'react-native';
import Animated, { interpolate, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Photo } from '@/components/blocks';
import { BackButton, ScreenStatusBar } from '@/components/chrome';
import { Glass } from '@/components/glass';
import { Icon } from '@/components/icon';
import { ArticleCard, BookmarkButton, CatTag } from '@/components/journal';
import { haptic, PressableScale } from '@/components/pressable-scale';
import { openProduct, QuickAdd } from '@/components/product-card';
import { ARTICLES, type ArticleBlock } from '@/data/journal';
import { initials, money } from '@/lib/format';
import { hasMultiplePrices, minPrice } from '@/lib/pricing';
import { useProduct } from '@/store/app-store';
import { font } from '@/theme/fonts';
import { enter } from '@/theme/motion';
import { FIXED } from '@/theme/tokens';
import { useMotion, useTheme } from '@/theme/use-theme';

const HERO_H = 380;

/** Product embedded in an article: tap to open, "+" to quick add. */
function ProductEmbed({ id }: { id: string }) {
  const { c } = useTheme();
  const p = useProduct(id);
  if (!p || !p.active) return null;
  return (
    <PressableScale
      scaleTo={0.98}
      onPress={() => openProduct(p.id)}
      accessibilityLabel={`${p.name}, from ${money(minPrice(p))}`}
      style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 8, paddingRight: 12, borderRadius: 18, borderWidth: 1, borderColor: c.line, backgroundColor: c.surface1, marginVertical: 6 }}>
      <View style={{ width: 64, height: 64, borderRadius: 13, overflow: 'hidden', backgroundColor: c.surface2 }}>
        <Photo uri={p.img} style={{ width: '100%', height: '100%' }} />
      </View>
      <View style={{ flex: 1, minWidth: 0, gap: 3 }}>
        <Text style={[font.mono(500, 9.5, { ls: 0.08, upper: true }), { color: c.text3 }]}>Featured gear</Text>
        <Text numberOfLines={1} style={[font.body(600, 14.5), { color: c.text1 }]}>
          {p.name}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 5 }}>
          {hasMultiplePrices(p) ? <Text style={[font.mono(500, 9), { color: c.text3 }]}>FROM</Text> : null}
          <Text style={[font.num(700, 18), { color: c.text1 }]}>{money(minPrice(p))}</Text>
        </View>
      </View>
      <QuickAdd product={p} />
    </PressableScale>
  );
}

function Block({ block: b }: { block: ArticleBlock }) {
  const { c } = useTheme();
  switch (b.type) {
    case 'p':
      return <Text style={[font.body(400, 16, { lh: 1.65 }), { color: c.text2 }]}>{b.text}</Text>;
    case 'h':
      return (
        <Text accessibilityRole="header" style={[font.display(800, 26), { color: c.text1, marginTop: 10 }]}>
          {b.text}
        </Text>
      );
    case 'list':
      return (
        <View style={{ gap: 10 }}>
          {b.items.map((item, i) => (
            <View key={i} style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ width: 24, height: 24, borderRadius: 8, backgroundColor: c.accentSoft, alignItems: 'center', justifyContent: 'center', marginTop: 1 }}>
                <Text style={[font.mono(700, 11), { color: c.accentText }]}>{i + 1}</Text>
              </View>
              <Text style={[font.body(400, 15.5, { lh: 1.55 }), { flex: 1, color: c.text2 }]}>{item}</Text>
            </View>
          ))}
        </View>
      );
    case 'tip':
      return (
        <View style={{ flexDirection: 'row', gap: 12, padding: 16, borderRadius: 18, backgroundColor: c.accentSoft, borderWidth: 1, borderColor: c.accent }}>
          <Icon name="lightbulb" size={22} filled color={c.accentText} />
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={[font.mono(600, 10.5, { ls: 0.08, upper: true }), { color: c.accentText }]}>{`Coach tip · ${b.title}`}</Text>
            <Text style={[font.body(500, 14.5, { lh: 1.5 }), { color: c.text1 }]}>{b.text}</Text>
          </View>
        </View>
      );
    case 'quote':
      return (
        <View style={{ paddingLeft: 16, borderLeftWidth: 3, borderLeftColor: c.accent, gap: 8, marginVertical: 4 }}>
          <Icon name="format_quote" size={28} filled color={c.accentText} />
          <Text style={[font.display(700, 24, { lh: 1.1, upper: false }), { color: c.text1 }]}>{b.text}</Text>
          <Text style={[font.mono(500, 10.5, { ls: 0.06, upper: true }), { color: c.text3 }]}>{`— ${b.by}`}</Text>
        </View>
      );
    case 'product':
      return <ProductEmbed id={b.id} />;
  }
}

export default function ArticleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { c } = useTheme();
  const { reduced } = useMotion();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const y = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((e) => {
    y.set(e.contentOffset.y);
  });
  const heroStyle = useAnimatedStyle(() => {
    const v = y.get();
    return {
      transform: [
        { translateY: v < 0 ? v : v * 0.45 },
        { scale: v < 0 ? 1 + -v / HERO_H : 1 },
      ],
    };
  });
  const barStyle = useAnimatedStyle(() => ({ opacity: interpolate(y.get(), [HERO_H - 160, HERO_H - 80], [0, 1], 'clamp') }));

  const a = ARTICLES.find((x) => x.id === id);
  if (!a) return <Redirect href="/journal" />;
  const related = ARTICLES.filter((x) => x.id !== a.id && (x.cat === a.cat || x.featured)).slice(0, 4);
  const more = related.length ? related : ARTICLES.filter((x) => x.id !== a.id).slice(0, 4);

  const share = () => {
    haptic('light');
    void Share.share({ title: a.title, message: `${a.title} — IRONBUILD Journal\nironbuild://journal/${a.id}` });
  };

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <ScreenStatusBar style="light" />
      <Animated.ScrollView onScroll={onScroll} scrollEventThrottle={16} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}>
        <View style={{ height: HERO_H, overflow: 'visible' }}>
          <Animated.View style={[{ position: 'absolute', top: 0, left: 0, width, height: HERO_H }, heroStyle]}>
            <Photo uri={a.img} style={{ width: '100%', height: '100%' }} />
            <LinearGradient colors={['rgba(0,0,0,0.45)', 'transparent', c.bg]} locations={[0, 0.4, 1]} style={{ position: 'absolute', inset: 0 }} />
          </Animated.View>
        </View>

        <View style={{ marginTop: -96, paddingHorizontal: 20, gap: 14, backgroundColor: 'transparent' }}>
          <Animated.View entering={enter(0, reduced)}>
            <CatTag label={a.cat} onPhoto />
          </Animated.View>
          <Animated.Text entering={enter(1, reduced)} accessibilityRole="header" style={[font.display(800, 38, { lh: 0.95 }), { color: c.text1 }]}>
            {a.title}
          </Animated.Text>
          <Animated.Text entering={enter(2, reduced)} style={[font.body(500, 16, { lh: 1.5 }), { color: c.text1 }]}>
            {a.excerpt}
          </Animated.Text>
          <Animated.View
            entering={enter(3, reduced)}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, borderTopWidth: 1, borderBottomWidth: 1, borderColor: c.line }}>
            <View style={{ width: 40, height: 40, borderRadius: 13, backgroundColor: c.accent, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={[font.mono(700, 12), { color: c.accentInk }]}>{initials(a.author.name)}</Text>
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Text style={[font.body(600, 14), { color: c.text1 }]}>{a.author.name}</Text>
                <Icon name="verified" size={15} filled color={c.accentText} />
              </View>
              <Text style={[font.body(400, 12), { color: c.text2 }]}>{a.author.role}</Text>
            </View>
            <View style={{ alignItems: 'flex-end', gap: 2 }}>
              <Text style={[font.mono(500, 10.5), { color: c.text3 }]}>{a.date}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Icon name="schedule" size={13} color={c.text3} />
                <Text style={[font.mono(500, 10.5), { color: c.text3 }]}>{`${a.mins} min`}</Text>
              </View>
            </View>
          </Animated.View>

          <Animated.View entering={enter(4, reduced)} style={{ gap: 16, paddingTop: 4 }}>
            {a.body.map((b, i) => (
              <Block key={i} block={b} />
            ))}
          </Animated.View>

          <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
            <Pressable
              accessibilityRole="button"
              onPress={share}
              style={{ flex: 1, height: 50, borderRadius: 16, borderWidth: 1, borderColor: c.lineStrong, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <Icon name="ios_share" size={19} color={c.text1} />
              <Text style={[font.body(600, 14), { color: c.text1 }]}>Share story</Text>
            </Pressable>
          </View>
        </View>

        <View style={{ marginTop: 32, gap: 12 }}>
          <Text style={[font.display(700, 22), { color: c.text1, paddingHorizontal: 20 }]}>Keep reading</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingHorizontal: 20 }}>
            {more.map((x) => (
              <ArticleCard key={x.id} article={x} width={220} />
            ))}
          </ScrollView>
        </View>
      </Animated.ScrollView>

      {/* Pinned bar fades in once the hero scrolls away */}
      <Animated.View pointerEvents="none" style={[{ position: 'absolute', top: 0, left: 0, right: 0, height: insets.top + 56 }, barStyle]}>
        <Glass tone="strong" style={{ flex: 1, borderBottomWidth: 1, borderBottomColor: c.glassLine }} />
      </Animated.View>
      <View style={{ position: 'absolute', top: insets.top + 4, left: 16, right: 16, flexDirection: 'row', justifyContent: 'space-between' }}>
        <BackButton overPhoto />
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <BookmarkButton id={a.id} size={44} overPhoto />
          <Pressable accessibilityRole="button" accessibilityLabel="Share story" onPress={share}>
            <Glass forceDark style={{ width: 44, height: 44, borderRadius: 22, borderWidth: 1, borderColor: 'rgba(255,255,255,0.14)', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="ios_share" size={21} color={FIXED.onPhoto} />
            </Glass>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
