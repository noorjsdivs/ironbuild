import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import type { Article } from '@/data/journal';
import { useApp } from '@/store/app-store';
import { font } from '@/theme/fonts';
import { FIXED } from '@/theme/tokens';
import { useTheme } from '@/theme/use-theme';

import { Photo } from './blocks';
import { Glass } from './glass';
import { Icon } from './icon';
import { haptic, PressableScale } from './pressable-scale';

export const openArticle = (id: string) => router.push({ pathname: '/journal/[id]', params: { id } });

const meta = (a: Article) => `${a.author.name} · ${a.mins} min read`;

/** Bookmark toggle for an article (persisted). */
export function BookmarkButton({ id, size = 34, overPhoto }: { id: string; size?: number; overPhoto?: boolean }) {
  const { c } = useTheme();
  const saved = useApp((s) => s.savedArticles.includes(id));
  const toggle = useApp((s) => s.toggleArticle);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={saved ? 'Remove bookmark' : 'Bookmark article'}
      accessibilityState={{ selected: saved }}
      hitSlop={6}
      onPress={(e) => {
        e.stopPropagation();
        haptic('light');
        toggle(id);
      }}>
      <Glass forceDark={overPhoto} style={{ width: size, height: size, borderRadius: size / 2, borderWidth: 1, borderColor: overPhoto ? 'rgba(255,255,255,0.14)' : c.glassLine, alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="bookmark" size={size * 0.56} filled={saved} color={saved ? c.accent : overPhoto ? FIXED.onPhoto : c.text1} />
      </Glass>
    </Pressable>
  );
}

/** Small accent category tag. */
export function CatTag({ label, onPhoto }: { label: string; onPhoto?: boolean }) {
  const { c } = useTheme();
  return (
    <View style={{ alignSelf: 'flex-start', paddingVertical: 5, paddingHorizontal: 8, borderRadius: 8, backgroundColor: onPhoto ? c.accent : c.accentSoft }}>
      <Text style={[font.mono(600, 9.5, { ls: 0.06, upper: true }), { color: onPhoto ? c.accentInk : c.accentText }]}>{label}</Text>
    </View>
  );
}

/** Large hero story card: full-bleed photo with title over a gradient. */
export function FeaturedArticleCard({ article: a, height = 280 }: { article: Article; height?: number }) {
  const { c } = useTheme();
  return (
    <PressableScale
      scaleTo={0.98}
      onPress={() => openArticle(a.id)}
      accessibilityLabel={`${a.title}. ${meta(a)}`}
      style={{ height, borderRadius: 24, overflow: 'hidden', backgroundColor: c.surface1 }}>
      <Photo uri={a.img} style={{ position: 'absolute', inset: 0 }} />
      <LinearGradient
        colors={['rgba(8,9,11,0.1)', 'rgba(8,9,11,0.35)', 'rgba(8,9,11,0.92)']}
        locations={[0, 0.4, 1]}
        style={{ position: 'absolute', inset: 0 }}
      />
      <View style={{ position: 'absolute', top: 14, left: 14, right: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <CatTag label={a.featured ? `Featured · ${a.cat}` : a.cat} onPhoto />
        <BookmarkButton id={a.id} overPhoto />
      </View>
      <View style={{ position: 'absolute', left: 18, right: 18, bottom: 18, gap: 8 }}>
        <Text style={[font.display(800, 30, { lh: 0.95 }), { color: FIXED.onPhoto }]}>{a.title}</Text>
        <Text numberOfLines={2} style={[font.body(400, 13.5, { lh: 1.45 }), { color: 'rgba(243,243,239,0.78)' }]}>
          {a.excerpt}
        </Text>
        <Text style={[font.mono(500, 10, { ls: 0.08, upper: true }), { color: 'rgba(243,243,239,0.6)', marginTop: 2 }]}>{meta(a)}</Text>
      </View>
    </PressableScale>
  );
}

/** Rail card: photo on top, category, two-line title, meta. */
export function ArticleCard({ article: a, width = 240 }: { article: Article; width?: number }) {
  const { c } = useTheme();
  return (
    <PressableScale
      scaleTo={0.97}
      onPress={() => openArticle(a.id)}
      accessibilityLabel={`${a.title}. ${meta(a)}`}
      style={{ width, borderRadius: 20, borderWidth: 1, borderColor: c.line, backgroundColor: c.surface1, padding: 6, paddingBottom: 12, gap: 10 }}>
      <View style={{ height: 140, borderRadius: 15, overflow: 'hidden', backgroundColor: c.surface2 }}>
        <Photo uri={a.img} style={{ width: '100%', height: '100%' }} />
        <View style={{ position: 'absolute', top: 8, right: 8 }}>
          <BookmarkButton id={a.id} size={32} overPhoto />
        </View>
      </View>
      <View style={{ paddingHorizontal: 6, gap: 6 }}>
        <Text style={[font.mono(600, 9.5, { ls: 0.08, upper: true }), { color: c.accentText }]}>{a.cat}</Text>
        <Text numberOfLines={2} style={[font.body(600, 15, { lh: 1.3 }), { color: c.text1, minHeight: 39 }]}>
          {a.title}
        </Text>
        <Text style={[font.mono(500, 10), { color: c.text3 }]}>{`${a.mins} min read · ${a.date}`}</Text>
      </View>
    </PressableScale>
  );
}

/** List row: square thumbnail and text, used on the Journal index. */
export function ArticleRow({ article: a }: { article: Article }) {
  const { c } = useTheme();
  return (
    <PressableScale
      scaleTo={0.98}
      onPress={() => openArticle(a.id)}
      accessibilityLabel={`${a.title}. ${meta(a)}`}
      style={{ flexDirection: 'row', gap: 12, alignItems: 'center', padding: 8, borderRadius: 20, borderWidth: 1, borderColor: c.line, backgroundColor: c.surface1 }}>
      <View style={{ width: 96, height: 96, borderRadius: 14, overflow: 'hidden', backgroundColor: c.surface2 }}>
        <Photo uri={a.img} style={{ width: '100%', height: '100%' }} />
      </View>
      <View style={{ flex: 1, minWidth: 0, gap: 5, paddingRight: 4 }}>
        <Text style={[font.mono(600, 9.5, { ls: 0.08, upper: true }), { color: c.accentText }]}>{a.cat}</Text>
        <Text numberOfLines={2} style={[font.body(600, 14.5, { lh: 1.3 }), { color: c.text1 }]}>
          {a.title}
        </Text>
        <Text style={[font.mono(500, 10), { color: c.text3 }]}>{`${a.mins} min · ${a.date}`}</Text>
      </View>
      <BookmarkButton id={a.id} size={34} />
    </PressableScale>
  );
}
