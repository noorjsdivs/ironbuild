import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import Animated, { FadeIn, LinearTransition, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { CAT_HERO } from '@/data/catalog';
import { ratingBreakdown, reviewsFor, type ProductDetail } from '@/data/product-details';
import type { Product } from '@/data/types';
import { addDays, cnt, money, shortDate } from '@/lib/format';
import { useApp, useLiveProducts } from '@/store/app-store';
import { toast, useUI } from '@/store/ui-store';
import { font } from '@/theme/fonts';
import { EASE_OUT } from '@/theme/motion';
import { useMotion, useTheme } from '@/theme/use-theme';

import { Card, Photo, Pill } from './blocks';
import { Button } from './button';
import { Checkbox, Segmented } from './controls';
import { Glass } from './glass';
import { Icon, type IconName } from './icon';
import { ProgressBar } from './progress-bar';
import { haptic, PressableScale } from './pressable-scale';

/* ───────────────────────── Gallery ───────────────────────── */

export const GALLERY_H = 440;

/** Paging gallery with a counter pill and tappable thumbnails. */
export function ProductGallery({ product: p }: { product: Product }) {
  const { c } = useTheme();
  const { width } = useWindowDimensions();
  const ref = useRef<ScrollView>(null);
  const [view, setView] = useState(0);
  const views = [
    { img: p.img, zoom: 1, label: 'Product' },
    { img: p.img, zoom: 1.8, label: 'Detail' },
    { img: CAT_HERO[p.cat], zoom: 1, label: 'In use' },
  ];
  const pick = (i: number) => {
    haptic('selection');
    setView(i);
    ref.current?.scrollTo({ x: i * width, animated: true });
  };

  return (
    <View style={{ height: GALLERY_H, backgroundColor: c.surface1, borderBottomLeftRadius: 34, borderBottomRightRadius: 34, overflow: 'hidden' }}>
      <ScrollView
        ref={ref}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => setView(Math.round(e.nativeEvent.contentOffset.x / width))}>
        {views.map((v, i) => (
          <View key={i} accessibilityRole="image" accessibilityLabel={`${p.name}, ${v.label.toLowerCase()} view`} style={{ width, height: GALLERY_H, overflow: 'hidden' }}>
            <Photo uri={v.img} style={{ width: '100%', height: '100%', transform: [{ scale: v.zoom }] }} />
          </View>
        ))}
      </ScrollView>
      <LinearGradient pointerEvents="none" colors={['rgba(0,0,0,0.5)', 'transparent']} style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 120 }} />
      <LinearGradient pointerEvents="none" colors={['transparent', 'rgba(0,0,0,0.45)']} style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 120 }} />

      <View style={{ position: 'absolute', left: 16, right: 16, bottom: 18, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {views.map((v, i) => {
            const on = i === view;
            return (
              <Pressable
                key={i}
                accessibilityRole="button"
                accessibilityLabel={`Show ${v.label.toLowerCase()} photo`}
                accessibilityState={{ selected: on }}
                onPress={() => pick(i)}
                style={{ width: 52, height: 52, borderRadius: 14, overflow: 'hidden', borderWidth: 2, borderColor: on ? c.accent : 'rgba(255,255,255,0.25)', opacity: on ? 1 : 0.75 }}>
                <Photo uri={v.img} style={{ width: '100%', height: '100%', transform: [{ scale: v.zoom }] }} />
              </Pressable>
            );
          })}
        </View>
        <Glass forceDark style={{ paddingVertical: 6, paddingHorizontal: 10, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.14)' }}>
          <Text style={[font.mono(600, 11), { color: '#f3f3ef' }]}>{`${view + 1} / ${views.length}`}</Text>
        </Glass>
      </View>
    </View>
  );
}

/* ───────────────────────── Price ───────────────────────── */

export function PriceBlock({ product: p, size, qty, onReviews }: { product: Product; size: number; qty: number; onReviews: () => void }) {
  const { c } = useTheme();
  const price = p.prices[size] ?? p.prices[0];
  const was = p.was?.[size];
  const save = was ? was - price : 0;
  return (
    <View style={{ gap: 8 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8 }}>
          <Text style={[font.num(800, 38), { color: c.text1 }]}>{money(price)}</Text>
          {was ? <Text style={[font.mono(500, 14), { color: c.text3, textDecorationLine: 'line-through' }]}>{money(was)}</Text> : null}
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Rated ${p.rating} from ${p.reviews} reviews. Show reviews`}
          onPress={onReviews}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 6, paddingHorizontal: 10, borderRadius: 12, backgroundColor: c.surface1, borderWidth: 1, borderColor: c.line }}>
          <Icon name="star" size={17} filled color={c.accentText} />
          <Text style={[font.body(700, 13.5), { color: c.text1 }]}>{p.rating}</Text>
          <Text style={[font.body(500, 12), { color: c.text3, textDecorationLine: 'underline' }]}>{`${p.reviews.toLocaleString('en-US')} reviews`}</Text>
        </Pressable>
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
        {save ? <Pill label={`Save ${money(save)} · ${Math.round((save / (was ?? 1)) * 100)}% off`} bg={c.accent} fg={c.accentInk} /> : null}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Icon name="payments" size={16} color={c.text2} />
          <Text style={[font.body(500, 12.5), { color: c.text2 }]}>
            or 4 interest-free payments of <Text style={{ color: c.text1, fontFamily: font.body(700, 12).fontFamily }}>{money((price * qty) / 4)}</Text>
          </Text>
        </View>
      </View>
    </View>
  );
}

/* ───────────────────────── Stock ───────────────────────── */

export function StockMeter({ stock }: { stock: number }) {
  const { c } = useTheme();
  if (stock <= 0) {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: c.err }} />
        <Text style={[font.body(600, 13), { color: c.err }]}>Out of stock · we’ll restock soon</Text>
      </View>
    );
  }
  if (stock > 10) {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: c.ok }} />
        <Text style={[font.body(600, 13), { color: c.ok }]}>In stock · ships today from Brooklyn</Text>
      </View>
    );
  }
  return (
    <View style={{ gap: 8, padding: 12, borderRadius: 14, backgroundColor: c.surface1, borderWidth: 1, borderColor: c.line }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <Icon name="local_fire_department" size={17} filled color={c.warn} />
        <Text style={[font.body(600, 13), { color: c.warn }]}>{`Only ${stock} left · selling fast`}</Text>
      </View>
      <ProgressBar pct={Math.max(8, (stock / 20) * 100)} height={5} color={c.warn} />
    </View>
  );
}

/* ───────────────────────── Options ───────────────────────── */

export function OptionPicker({
  product: p,
  size,
  onChange,
  detail,
}: {
  product: Product;
  size: number;
  onChange: (i: number) => void;
  detail: ProductDetail;
}) {
  const { c } = useTheme();
  const [guide, setGuide] = useState(false);
  const priced = new Set(p.prices).size > 1;
  if (p.sizes.length < 2) return null;
  return (
    <View style={{ gap: 10 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <Text style={[font.eyebrow(), { color: c.text3 }]}>
          {`${p.opt} · `}
          <Text style={{ color: c.text1 }}>{p.sizes[size]}</Text>
        </Text>
        {detail.sizeGuide ? (
          <Pressable accessibilityRole="button" onPress={() => setGuide((g) => !g)} hitSlop={8}>
            <Text style={[font.mono(600, 11, { ls: 0.06, upper: true }), { color: c.accentText }]}>{guide ? 'Hide guide' : 'Size guide'}</Text>
          </Pressable>
        ) : null}
      </View>
      <View accessibilityRole="radiogroup" style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {p.sizes.map((z, i) => {
          const on = i === size;
          return (
            <PressableScale
              key={z}
              scaleTo={0.93}
              haptic="selection"
              accessibilityRole="radio"
              accessibilityState={{ checked: on }}
              accessibilityLabel={`${z}, ${money(p.prices[i])}`}
              onPress={() => onChange(i)}
              style={{
                minHeight: priced ? 56 : 44,
                minWidth: 68,
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderRadius: 14,
                borderWidth: 1.5,
                borderColor: on ? c.accent : c.line,
                backgroundColor: on ? c.accent : c.surface1,
                alignItems: 'center',
                justifyContent: 'center',
                gap: 3,
              }}>
              <Text style={[font.mono(600, 12.5), { color: on ? c.accentInk : c.text1 }]}>{z}</Text>
              {priced ? <Text style={[font.mono(500, 10.5), { color: on ? c.accentInk : c.text3, opacity: on ? 0.75 : 1 }]}>{money(p.prices[i])}</Text> : null}
            </PressableScale>
          );
        })}
      </View>
      {guide && detail.sizeGuide ? (
        <Animated.View entering={FadeIn.duration(220)}>
          <Card radius={14}>
            {detail.sizeGuide.map(([k, v], i) => (
              <View key={k} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, paddingHorizontal: 14, borderBottomWidth: i === detail.sizeGuide!.length - 1 ? 0 : 1, borderBottomColor: c.line }}>
                <Text style={[font.mono(600, 12.5), { color: c.text1 }]}>{k}</Text>
                <Text style={[font.body(500, 13), { color: c.text2 }]}>{v}</Text>
              </View>
            ))}
          </Card>
        </Animated.View>
      ) : null}
    </View>
  );
}

/* ───────────────────────── Delivery ───────────────────────── */

function addBusinessDays(d: Date, n: number) {
  let out = new Date(d);
  let left = n;
  while (left > 0) {
    out = addDays(out, 1);
    if (out.getDay() !== 0 && out.getDay() !== 6) left--;
  }
  return out;
}

export function DeliveryCard({ price, detail }: { price: number; detail: ProductDetail }) {
  const { c } = useTheme();
  const freeAt = useApp((s) => s.freeAt);
  const expRate = useApp((s) => s.rates.exp);
  const addr = useApp((s) => s.addresses.find((a) => a.id === s.defaultAddressId) ?? s.addresses[0]);
  const now = new Date();
  const city = addr?.l2.split(',')[0] ?? 'your door';
  const rows: { icon: IconName; title: string; sub: string }[] = [
    {
      icon: 'local_shipping',
      title: `${price >= freeAt ? 'Free delivery' : 'Delivery'} by ${shortDate(addBusinessDays(now, 3))}`,
      sub: `To ${city} · Express tomorrow for ${money(expRate)}`,
    },
    ...(detail.assembly ? [{ icon: 'fitness_center' as IconName, title: 'Pro assembly available', sub: 'Our crew sets it up in the room you train in' }] : []),
    { icon: 'assignment_return', title: '30-day free returns', sub: 'Changed your mind? Send it back, no questions' },
  ];
  return (
    <Card radius={18}>
      {rows.map((r, i) => (
        <View key={r.title} style={{ flexDirection: 'row', gap: 12, alignItems: 'center', padding: 14, borderBottomWidth: i === rows.length - 1 ? 0 : 1, borderBottomColor: c.line }}>
          <View style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: c.accentSoft, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name={r.icon} size={20} color={c.accentText} />
          </View>
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={[font.body(600, 14), { color: c.text1 }]}>{r.title}</Text>
            <Text style={[font.body(400, 12.5), { color: c.text2 }]}>{r.sub}</Text>
          </View>
        </View>
      ))}
    </Card>
  );
}

/* ───────────────────────── Tabs ───────────────────────── */

export type PdpTab = 'overview' | 'specs' | 'reviews';

function Overview({ product: p, detail }: { product: Product; detail: ProductDetail }) {
  const { c } = useTheme();
  return (
    <View style={{ gap: 18 }}>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {p.specs.map(([k, v]) => (
          <View key={k} style={{ flex: 1, padding: 12, borderRadius: 14, backgroundColor: c.surface1, borderWidth: 1, borderColor: c.line, gap: 6 }}>
            <Text style={[font.mono(500, 9, { ls: 0.08, upper: true }), { color: c.text3 }]}>{k}</Text>
            <Text style={[font.body(600, 13, { lh: 1.25 }), { color: c.text1 }]}>{v}</Text>
          </View>
        ))}
      </View>
      <Text style={[font.body(400, 15, { lh: 1.65 }), { color: c.text2 }]}>{p.desc}</Text>
      <View style={{ gap: 10 }}>
        <Text style={[font.display(700, 20), { color: c.text1 }]}>Why lifters love it</Text>
        {detail.highlights.map((h) => (
          <View key={h} style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-start' }}>
            <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: c.accent, alignItems: 'center', justifyContent: 'center', marginTop: 1 }}>
              <Icon name="check" size={15} color={c.accentInk} />
            </View>
            <Text style={[font.body(500, 14.5, { lh: 1.5 }), { flex: 1, color: c.text1 }]}>{h}</Text>
          </View>
        ))}
      </View>
      <View style={{ gap: 10, padding: 14, borderRadius: 18, backgroundColor: c.surface1, borderWidth: 1, borderColor: c.line }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Icon name="inventory_2" size={18} color={c.accentText} />
          <Text style={[font.eyebrow(), { color: c.text3 }]}>In the box</Text>
        </View>
        {detail.inBox.map((x) => (
          <View key={x} style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <View style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: c.text3 }} />
            <Text style={[font.body(500, 14), { color: c.text1 }]}>{x}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function Specs({ product: p, detail }: { product: Product; detail: ProductDetail }) {
  const { c } = useTheme();
  const rows: [string, string][] = [['SKU', p.sku], ['Category', p.cat], ...(detail.specs.length ? detail.specs : p.specs)];
  return (
    <Card radius={18}>
      {rows.map(([k, v], i) => (
        <View
          key={k}
          style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 16, paddingVertical: 13, paddingHorizontal: 14, borderBottomWidth: i === rows.length - 1 ? 0 : 1, borderBottomColor: c.line }}>
          <Text style={[font.mono(500, 11, { ls: 0.06, upper: true }), { color: c.text3, flexShrink: 0 }]}>{k}</Text>
          <Text style={[font.body(600, 13.5), { color: c.text1, flex: 1, textAlign: 'right' }]}>{v}</Text>
        </View>
      ))}
    </Card>
  );
}

function Stars({ value, size = 14 }: { value: number; size?: number }) {
  const { c } = useTheme();
  return (
    <View style={{ flexDirection: 'row', gap: 1 }} accessibilityLabel={`${value} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Icon key={i} name="star" size={size} filled color={i < Math.round(value) ? c.accentText : c.surface2} />
      ))}
    </View>
  );
}

function Reviews({ product: p }: { product: Product }) {
  const { c } = useTheme();
  const reviews = reviewsFor(p);
  const dist = ratingBreakdown(p.rating);
  return (
    <View style={{ gap: 12 }}>
      <Card radius={20} style={{ padding: 16, flexDirection: 'row', gap: 18, alignItems: 'center' }}>
        <View style={{ alignItems: 'center', gap: 4, width: 92 }}>
          <Text style={[font.num(800, 52), { color: c.text1 }]}>{p.rating.toFixed(1)}</Text>
          <Stars value={p.rating} />
          <Text style={[font.mono(500, 10), { color: c.text3, textAlign: 'center' }]}>{cnt(p.reviews, 'review')}</Text>
        </View>
        <View style={{ flex: 1, gap: 6 }}>
          {dist.map((pct, i) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={[font.mono(600, 11), { color: c.text2, width: 10 }]}>{5 - i}</Text>
              <ProgressBar pct={pct} height={6} delay={i * 60} style={{ flex: 1 }} />
              <Text style={[font.mono(500, 10.5), { color: c.text3, width: 32, textAlign: 'right' }]}>{`${pct}%`}</Text>
            </View>
          ))}
        </View>
      </Card>
      {reviews.map((r) => (
        <Card key={r.name + r.date} radius={18} style={{ padding: 14, gap: 8 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Stars value={r.rating} size={15} />
            <Text style={[font.mono(500, 10.5), { color: c.text3 }]}>{r.date}</Text>
          </View>
          <Text style={[font.body(700, 14.5), { color: c.text1 }]}>{r.title}</Text>
          <Text style={[font.body(400, 14, { lh: 1.5 }), { color: c.text2 }]}>{r.text}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 }}>
            <Text style={[font.body(600, 12.5), { color: c.text1 }]}>{r.name}</Text>
            <Icon name="verified" size={14} filled color={c.ok} />
            <Text style={[font.mono(500, 9.5, { ls: 0.06, upper: true }), { color: c.ok }]}>Verified buyer</Text>
          </View>
        </Card>
      ))}
      <Button label="Write a review" variant="outline" icon="edit" height={48} radius={14} weight={600} fontSize={14} onPress={() => toast('Thanks for lifting with us', 'Reviews open once your order is delivered', undefined)} />
    </View>
  );
}

/** Overview / Specs / Reviews segmented section. */
export function DetailTabs({ product, detail, tab, onTab }: { product: Product; detail: ProductDetail; tab: PdpTab; onTab: (t: PdpTab) => void }) {
  const { reduced } = useMotion();
  return (
    <View style={{ gap: 16 }}>
      <Segmented<PdpTab>
        height={42}
        value={tab}
        onChange={onTab}
        options={[
          { value: 'overview', label: 'Overview' },
          { value: 'specs', label: 'Specs' },
          { value: 'reviews', label: `Reviews · ${product.reviews > 999 ? `${(product.reviews / 1000).toFixed(1)}k` : product.reviews}` },
        ]}
      />
      <Animated.View key={tab} entering={reduced ? undefined : FadeIn.duration(260)}>
        {tab === 'overview' ? <Overview product={product} detail={detail} /> : tab === 'specs' ? <Specs product={product} detail={detail} /> : <Reviews product={product} />}
      </Animated.View>
    </View>
  );
}

/* ───────────────────────── Accordion ───────────────────────── */

function AccordionRow({ icon, title, children, last }: { icon: IconName; title: string; children: string; last?: boolean }) {
  const { c } = useTheme();
  const { ms, reduced } = useMotion();
  const [open, setOpen] = useState(false);
  const rot = useSharedValue(0);
  useEffect(() => {
    rot.set(withTiming(open ? 90 : 0, { duration: ms(260), easing: EASE_OUT }));
  }, [open, rot, ms]);
  const chevron = useAnimatedStyle(() => ({ transform: [{ rotate: `${rot.get()}deg` }] }));
  return (
    <Animated.View layout={reduced ? undefined : LinearTransition.duration(240)} style={{ borderBottomWidth: last ? 0 : 1, borderBottomColor: c.line }}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        onPress={() => {
          haptic('selection');
          setOpen((o) => !o);
        }}
        style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 }}>
        <Icon name={icon} size={20} color={c.text2} />
        <Text style={[font.body(600, 14), { flex: 1, color: c.text1 }]}>{title}</Text>
        <Animated.View style={chevron}>
          <Icon name="chevron_right" size={20} color={c.text3} />
        </Animated.View>
      </Pressable>
      {open ? (
        <Animated.View entering={reduced ? undefined : FadeIn.duration(220)} style={{ paddingHorizontal: 14, paddingBottom: 14, paddingLeft: 46 }}>
          <Text style={[font.body(400, 13.5, { lh: 1.55 }), { color: c.text2 }]}>{children}</Text>
        </Animated.View>
      ) : null}
    </Animated.View>
  );
}

export function InfoAccordion({ detail }: { detail: ProductDetail }) {
  const freeAt = useApp((s) => s.freeAt);
  return (
    <Card radius={18}>
      <AccordionRow icon="local_shipping" title="Shipping & delivery">
        {`Standard delivery in 3–5 business days, free over ${money(freeAt)}. Express arrives next day before noon. Heavy items are delivered to the room of your choice.`}
      </AccordionRow>
      <AccordionRow icon="assignment_return" title="Returns">
        Return unused gear within 30 days for a full refund. We collect large items from your door at no cost.
      </AccordionRow>
      <AccordionRow icon="verified" title="Warranty">
        {detail.warranty}
      </AccordionRow>
      <AccordionRow icon="info" title="Care" last>
        {detail.care}
      </AccordionRow>
    </Card>
  );
}

/* ───────────────────────── Bought together ───────────────────────── */

export function BoughtTogether({ product: p, size, detail }: { product: Product; size: number; detail: ProductDetail }) {
  const { c } = useTheme();
  const live = useLiveProducts();
  const addToCart = useApp((s) => s.addToCart);
  const items = [p, ...detail.pairs.map((id) => live.find((x) => x.id === id)).filter((x): x is Product => !!x && x.stock > 0)];
  const [off, setOff] = useState<string[]>([]);
  if (items.length < 2) return null;
  const sizeOf = (x: Product) => (x.id === p.id ? size : x.def);
  const chosen = items.filter((x) => !off.includes(x.id));
  const total = chosen.reduce((a, x) => a + x.prices[sizeOf(x)], 0);

  return (
    <View style={{ gap: 12 }}>
      <Text style={[font.display(700, 22), { color: c.text1 }]}>Frequently bought together</Text>
      <Card radius={20} style={{ padding: 14, gap: 14 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          {items.map((x, i) => (
            <View key={x.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              {i > 0 ? <Icon name="add" size={18} color={c.text3} /> : null}
              <View style={{ width: 76, height: 76, borderRadius: 14, overflow: 'hidden', backgroundColor: c.surface2, opacity: off.includes(x.id) ? 0.35 : 1 }}>
                <Photo uri={x.img} style={{ width: '100%', height: '100%' }} />
              </View>
            </View>
          ))}
        </View>
        <View style={{ gap: 2 }}>
          {items.map((x) => {
            const on = !off.includes(x.id);
            const isThis = x.id === p.id;
            return (
              <Pressable
                key={x.id}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: on, disabled: isThis }}
                disabled={isThis}
                onPress={() => {
                  haptic('selection');
                  setOff((o) => (o.includes(x.id) ? o.filter((y) => y !== x.id) : [...o, x.id]));
                }}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8 }}>
                <Checkbox on={on} />
                <Text numberOfLines={1} style={[font.body(isThis ? 700 : 500, 13.5), { flex: 1, color: c.text1 }]}>
                  {isThis ? `This item: ${x.short}` : x.short}
                  <Text style={{ color: c.text3 }}>{` · ${x.sizes[sizeOf(x)]}`}</Text>
                </Text>
                <Text style={[font.mono(600, 13), { color: c.text1 }]}>{money(x.prices[sizeOf(x)])}</Text>
              </Pressable>
            );
          })}
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: c.line }}>
          <View style={{ gap: 2 }}>
            <Text style={[font.mono(500, 10, { ls: 0.08, upper: true }), { color: c.text3 }]}>{`Total · ${cnt(chosen.length, 'item')}`}</Text>
            <Text style={[font.num(800, 24), { color: c.text1 }]}>{money(total)}</Text>
          </View>
          <Button
            label={`Add ${chosen.length} to cart`}
            icon="shopping_cart"
            height={48}
            radius={14}
            weight={600}
            fontSize={14}
            style={{ flex: 1 }}
            onPress={() => {
              chosen.forEach((x) => addToCart(x.id, sizeOf(x), 1));
              const ui = useUI.getState();
              ui.bumpCart();
              haptic('success');
              ui.showToast({ title: `Added ${cnt(chosen.length, 'item')}`, sub: chosen.map((x) => x.short).join(' + '), action: { label: 'View', onPress: () => router.navigate('/cart') } });
            }}
          />
        </View>
      </Card>
    </View>
  );
}
