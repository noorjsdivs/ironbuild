import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';

import { DEAL, PERKS, REVIEWS, type Article } from '@/data/journal';
import type { Product } from '@/data/types';
import { withAlpha } from '@/lib/color';
import { isEmail, money } from '@/lib/format';
import { useApp, useProduct } from '@/store/app-store';
import { toast } from '@/store/ui-store';
import { font } from '@/theme/fonts';
import { useTheme } from '@/theme/use-theme';

import { Photo, SectionHeader } from './blocks';
import { Button } from './button';
import { useScreenFocused } from './chrome';
import { Icon } from './icon';
import { ArticleCard, FeaturedArticleCard } from './journal';
import { openProduct, ProductCard, QuickAdd } from './product-card';
import { ProgressBar } from './progress-bar';
import { haptic, PressableScale } from './pressable-scale';
import { Wordmark } from './wordmark';

/* ───────────────────────── Perks ───────────────────────── */

/** Horizontal strip of store promises (delivery, returns, assembly, rating). */
export function PerksStrip() {
  const { c } = useTheme();
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingHorizontal: 20 }}>
      {PERKS.map((p) => (
        <View
          key={p.title}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, paddingLeft: 10, paddingRight: 14, borderRadius: 16, borderWidth: 1, borderColor: c.line, backgroundColor: c.surface1 }}>
          <View style={{ width: 34, height: 34, borderRadius: 11, backgroundColor: c.accentSoft, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name={p.icon} size={19} filled={p.icon === 'star'} color={c.accentText} />
          </View>
          <View style={{ gap: 1 }}>
            <Text style={[font.body(600, 13), { color: c.text1 }]}>{p.title}</Text>
            <Text style={[font.body(400, 11.5), { color: c.text2 }]}>{p.sub}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

/* ───────────────────────── Deal of the day ───────────────────────── */

const secondsToMidnight = () => {
  const now = new Date();
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  return Math.max(0, Math.floor((end.getTime() - now.getTime()) / 1000));
};

function useCountdownToMidnight() {
  const focused = useScreenFocused();
  const [left, setLeft] = useState(secondsToMidnight);
  useEffect(() => {
    if (!focused) return;
    const t = setInterval(() => setLeft(secondsToMidnight()), 1000);
    return () => clearInterval(t);
  }, [focused]);
  const hh = Math.floor(left / 3600);
  const mm = Math.floor((left % 3600) / 60);
  const ss = left % 60;
  return [hh, mm, ss].map((n) => String(n).padStart(2, '0'));
}

function TimeBox({ value, label }: { value: string; label: string }) {
  const { c } = useTheme();
  return (
    <View style={{ alignItems: 'center', gap: 2 }}>
      <View style={{ minWidth: 44, paddingVertical: 6, paddingHorizontal: 6, borderRadius: 10, backgroundColor: c.accentInk, alignItems: 'center' }}>
        <Text style={[font.mono(700, 18), { color: c.accent }]}>{value}</Text>
      </View>
      <Text style={[font.mono(500, 8.5, { ls: 0.08, upper: true }), { color: withAlpha(c.accentInk, 0.7) }]}>{label}</Text>
    </View>
  );
}

/** Accent "Deal of the day" card with a live countdown to midnight. */
export function DealOfTheDay() {
  const { c } = useTheme();
  const p = useProduct(DEAL.id);
  const [hh, mm, ss] = useCountdownToMidnight();
  if (!p || !p.active || !p.was) return null;
  const s = p.def;
  const off = Math.round((1 - p.prices[s] / p.was[s]) * 100);

  return (
    <PressableScale
      scaleTo={0.98}
      onPress={() => openProduct(p.id)}
      accessibilityLabel={`Deal of the day: ${p.name}, ${money(p.prices[s])}, ${off}% off`}
      style={{ borderRadius: 24, backgroundColor: c.accent, overflow: 'hidden', padding: 16, gap: 14 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Icon name="bolt" size={18} filled color={c.accentInk} />
          <Text style={[font.mono(700, 11, { ls: 0.1, upper: true }), { color: c.accentInk }]}>Deal of the day</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 6, alignItems: 'flex-start' }}>
          <TimeBox value={hh} label="hrs" />
          <TimeBox value={mm} label="min" />
          <TimeBox value={ss} label="sec" />
        </View>
      </View>
      <View style={{ flexDirection: 'row', gap: 14, alignItems: 'center' }}>
        <View style={{ width: 112, height: 112, borderRadius: 18, overflow: 'hidden', backgroundColor: withAlpha(c.accentInk, 0.15) }}>
          <Photo uri={p.img} style={{ width: '100%', height: '100%' }} />
          <View style={{ position: 'absolute', top: 6, left: 6, paddingVertical: 4, paddingHorizontal: 7, borderRadius: 7, backgroundColor: c.accentInk }}>
            <Text style={[font.mono(700, 10), { color: c.accent }]}>{`−${off}%`}</Text>
          </View>
        </View>
        <View style={{ flex: 1, gap: 4 }}>
          <Text style={[font.display(800, 24, { lh: 0.95 }), { color: c.accentInk }]}>{p.name}</Text>
          <Text style={[font.body(500, 12.5), { color: withAlpha(c.accentInk, 0.75) }]}>{`${p.sizes[s]} · ${p.opt}`}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8, marginTop: 2 }}>
            <Text style={[font.num(800, 30), { color: c.accentInk }]}>{money(p.prices[s])}</Text>
            <Text style={[font.mono(500, 12), { color: withAlpha(c.accentInk, 0.6), textDecorationLine: 'line-through' }]}>{money(p.was[s])}</Text>
          </View>
        </View>
      </View>
      <View style={{ gap: 6 }}>
        <ProgressBar pct={DEAL.claimed} color={c.accentInk} style={{ backgroundColor: withAlpha(c.accentInk, 0.15) }} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={[font.mono(600, 10.5), { color: c.accentInk }]}>{`${DEAL.claimed}% claimed`}</Text>
          <Text style={[font.mono(500, 10.5), { color: withAlpha(c.accentInk, 0.7) }]}>{`Only ${p.stock} left`}</Text>
        </View>
      </View>
    </PressableScale>
  );
}

/* ───────────────────────── Product rail ───────────────────────── */

/** Horizontal rail of product cards. */
export function ProductRail({ products, width = 168 }: { products: Product[]; width?: number }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingHorizontal: 20 }}>
      {products.map((p) => (
        <View key={p.id} style={{ width }}>
          <ProductCard product={p} />
        </View>
      ))}
    </ScrollView>
  );
}

/** Compact recently-viewed chips: thumbnail + name + price + quick add. */
export function RecentRail({ products }: { products: Product[] }) {
  const { c } = useTheme();
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingHorizontal: 20 }}>
      {products.map((p) => (
        <PressableScale
          key={p.id}
          scaleTo={0.97}
          onPress={() => openProduct(p.id)}
          accessibilityLabel={`${p.name}, ${money(Math.min(...p.prices))}`}
          style={{ width: 236, flexDirection: 'row', alignItems: 'center', gap: 10, padding: 6, paddingRight: 10, borderRadius: 18, borderWidth: 1, borderColor: c.line, backgroundColor: c.surface1 }}>
          <View style={{ width: 56, height: 56, borderRadius: 13, overflow: 'hidden', backgroundColor: c.surface2 }}>
            <Photo uri={p.img} style={{ width: '100%', height: '100%' }} />
          </View>
          <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
            <Text numberOfLines={1} style={[font.body(600, 13.5), { color: c.text1 }]}>
              {p.short}
            </Text>
            <Text style={[font.num(700, 17), { color: c.text1 }]}>{money(Math.min(...p.prices))}</Text>
          </View>
          <QuickAdd product={p} size={32} radius={10} />
        </PressableScale>
      ))}
    </ScrollView>
  );
}

/* ───────────────────────── Journal ───────────────────────── */

/** Home's journal block: one featured story plus a rail of recent ones. */
export function JournalSection({ featured, rest }: { featured: Article; rest: Article[] }) {
  return (
    <View style={{ gap: 12 }}>
      <View style={{ paddingHorizontal: 20 }}>
        <FeaturedArticleCard article={featured} />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingHorizontal: 20 }}>
        {rest.map((a) => (
          <ArticleCard key={a.id} article={a} />
        ))}
      </ScrollView>
    </View>
  );
}

/* ───────────────────────── Reviews ───────────────────────── */

export function ReviewsRail() {
  const { c } = useTheme();
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} snapToInterval={292} decelerationRate="fast" contentContainerStyle={{ gap: 12, paddingHorizontal: 20 }}>
      {REVIEWS.map((r) => (
        <View key={r.name} style={{ width: 280, padding: 16, borderRadius: 20, borderWidth: 1, borderColor: c.line, backgroundColor: c.surface1, gap: 12 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', gap: 2 }} accessibilityLabel={`${r.rating} out of 5 stars`}>
              {Array.from({ length: 5 }, (_, i) => (
                <Icon key={i} name="star" size={16} filled color={i < r.rating ? c.accentText : c.surface2} />
              ))}
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Icon name="verified" size={14} filled color={c.ok} />
              <Text style={[font.mono(500, 9.5, { ls: 0.06, upper: true }), { color: c.ok }]}>Verified</Text>
            </View>
          </View>
          <Text style={[font.body(500, 14.5, { lh: 1.5 }), { color: c.text1, minHeight: 66 }]}>{`“${r.text}”`}</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTopWidth: 1, borderTopColor: c.line }}>
            <View style={{ gap: 2 }}>
              <Text style={[font.body(600, 13), { color: c.text1 }]}>{r.name}</Text>
              <Text style={[font.body(400, 11.5), { color: c.text2 }]}>{r.city}</Text>
            </View>
            <Text style={[font.mono(500, 10), { color: c.text3 }]}>{r.product}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

/* ───────────────────────── Newsletter ───────────────────────── */

export function NewsletterCard() {
  const { c } = useTheme();
  const subscribed = useApp((s) => s.newsletter);
  const subscribe = useApp((s) => s.subscribe);
  const user = useApp((s) => s.user);
  const [email, setEmail] = useState(user?.email ?? '');

  return (
    <View style={{ borderRadius: 24, overflow: 'hidden', backgroundColor: c.surface1, borderWidth: 1, borderColor: c.line }}>
      <LinearGradient
        colors={[withAlpha(c.accent, 0.22), withAlpha(c.accent, 0)]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ position: 'absolute', inset: 0 }}
      />
      <View style={{ padding: 18, gap: 12 }}>
        <View style={{ width: 40, height: 40, borderRadius: 13, backgroundColor: c.accent, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name={subscribed ? 'check' : 'mail'} size={21} color={c.accentInk} />
        </View>
        <Text style={[font.display(800, 28, { lh: 0.95 }), { color: c.text1 }]}>{subscribed ? 'You’re on the list' : 'Get 10% off your first order'}</Text>
        <Text style={[font.body(400, 14, { lh: 1.5 }), { color: c.text2 }]}>
          {subscribed
            ? `Weekly programs, early drops and member-only deals are headed to ${subscribed}.`
            : 'Join 40,000 lifters getting weekly programs, early access to drops and member-only deals.'}
        </Text>
        {subscribed ? null : (
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <View style={{ flex: 1, height: 50, borderRadius: 15, borderWidth: 1, borderColor: c.line, backgroundColor: c.bg, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, gap: 8 }}>
              <Icon name="mail" size={18} color={c.text3} />
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="you@email.com"
                placeholderTextColor={c.text3}
                selectionColor={c.accentText}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                accessibilityLabel="Email for newsletter"
                style={[font.body(500, 14.5), { flex: 1, color: c.text1, padding: 0 }]}
              />
            </View>
            <Button
              label="Join"
              height={50}
              radius={15}
              weight={600}
              fontSize={14}
              style={{ paddingHorizontal: 18 }}
              onPress={() => {
                if (!isEmail(email)) {
                  haptic('warning');
                  return toast('Check your email', 'That address doesn’t look right');
                }
                subscribe(email);
                haptic('success');
                toast('Welcome to the club', 'Your 10% code is IRON10');
              }}
            />
          </View>
        )}
      </View>
    </View>
  );
}

/* ───────────────────────── Footer ───────────────────────── */

export function HomeFooter() {
  const { c } = useTheme();
  return (
    <View style={{ alignItems: 'center', gap: 6, paddingVertical: 8 }}>
      <Wordmark size={22} color={c.text3} accent={c.text2} />
      <Text style={[font.mono(500, 10, { ls: 0.08, upper: true }), { color: c.text3 }]}>Built for lifters · Brooklyn, NY</Text>
    </View>
  );
}

/** "See all" header pointing at the full journal. */
export function JournalHeader() {
  return <SectionHeader title="Training journal" action="All stories →" onAction={() => router.push('/journal')} style={{ paddingHorizontal: 20, marginTop: 30, marginBottom: 12 }} />;
}

