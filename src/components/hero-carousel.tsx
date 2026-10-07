import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ScrollView, Text, View, useWindowDimensions } from 'react-native';

import { HERO } from '@/data/catalog';
import { useUI } from '@/store/ui-store';
import { font } from '@/theme/fonts';
import { FIXED } from '@/theme/tokens';
import { useTheme } from '@/theme/use-theme';

import { Photo } from './blocks';
import { useScreenFocused } from './chrome';
import { Glass } from './glass';
import { Icon } from './icon';
import { PagerDots } from './pager-dots';
import { openProduct } from './product-card';
import { PressableScale } from './pressable-scale';

const AUTO_MS = 6000;

/** Swipeable promo banners that auto-advance every 6s unless recently touched. */
export function HeroCarousel() {
  const { c } = useTheme();
  const { width } = useWindowDimensions();
  const slideW = width - 40;
  const ref = useRef<ScrollView>(null);
  const [index, setIndex] = useState(0);
  const indexRef = useRef(0);
  const touchedAt = useRef(0);
  const focused = useScreenFocused();
  const setCat = useUI((s) => s.setCat);

  const go = (i: number) => {
    indexRef.current = i;
    setIndex(i);
    ref.current?.scrollTo({ x: i * slideW, animated: true });
  };

  useEffect(() => {
    if (!focused) return;
    const t = setInterval(() => {
      if (Date.now() - touchedAt.current < AUTO_MS) return;
      const next = (indexRef.current + 1) % HERO.length;
      indexRef.current = next;
      setIndex(next);
      ref.current?.scrollTo({ x: next * slideW, animated: true });
    }, AUTO_MS);
    return () => clearInterval(t);
  }, [focused, slideW]);

  return (
    <View>
      <View style={{ height: 210, borderRadius: 24, overflow: 'hidden', backgroundColor: c.surface1 }}>
        <ScrollView
          ref={ref}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScrollBeginDrag={() => (touchedAt.current = Date.now())}
          onMomentumScrollEnd={(e) => {
            const i = Math.round(e.nativeEvent.contentOffset.x / slideW);
            indexRef.current = i;
            setIndex(i);
          }}>
          {HERO.map((h) => (
            <View key={h.title} style={{ width: slideW, height: 210, padding: 18, justifyContent: 'space-between' }}>
              <Photo uri={h.img} style={{ position: 'absolute', inset: 0 }} />
              <LinearGradient
                colors={['rgba(8,9,11,0.8)', 'rgba(8,9,11,0.4)', 'rgba(8,9,11,0.1)']}
                locations={[0, 0.55, 1]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={{ position: 'absolute', inset: 0 }}
              />
              <View style={{ maxWidth: '62%', gap: 8 }}>
                <Glass forceDark style={{ alignSelf: 'flex-start', paddingVertical: 5, paddingHorizontal: 9, borderRadius: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.14)' }}>
                  <Text style={[font.mono(600, 9.5, { ls: 0.1, upper: true }), { color: FIXED.onPhoto }]}>{h.eyebrow}</Text>
                </Glass>
                <Text style={[font.display(800, 34, { lh: 0.92 }), { color: FIXED.onPhoto }]}>{h.title}</Text>
              </View>
              <PressableScale
                scaleTo={0.94}
                onPress={() => {
                  if (h.product) openProduct(h.product);
                  else if (h.cat) {
                    setCat(h.cat);
                    router.navigate('/shop');
                  }
                }}
                style={{ alignSelf: 'flex-start', height: 38, paddingHorizontal: 14, borderRadius: 12, backgroundColor: c.accent, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={[font.body(600, 13), { color: c.accentInk }]}>{h.cta}</Text>
                <Icon name="arrow_forward" size={18} color={c.accentInk} />
              </PressableScale>
            </View>
          ))}
        </ScrollView>
      </View>
      <PagerDots
        count={HERO.length}
        index={index}
        onPick={(i) => {
          touchedAt.current = Date.now();
          go(i);
        }}
        inactive={c.lineStrong}
        style={{ marginTop: 12 }}
      />
    </View>
  );
}
