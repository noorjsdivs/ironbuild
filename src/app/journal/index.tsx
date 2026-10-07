import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';

import { EmptyState } from '@/components/blocks';
import { Chip } from '@/components/controls';
import { ArticleRow, FeaturedArticleCard } from '@/components/journal';
import { PushedScreen } from '@/components/screen';
import { ARTICLES, JOURNAL_CATS, type JournalCategory } from '@/data/journal';
import { cnt } from '@/lib/format';
import { useApp } from '@/store/app-store';
import { font } from '@/theme/fonts';
import { enter } from '@/theme/motion';
import { useMotion, useTheme } from '@/theme/use-theme';

type Filter = 'All' | 'Saved' | JournalCategory;

export default function JournalScreen() {
  const { c } = useTheme();
  const { reduced } = useMotion();
  const saved = useApp((s) => s.savedArticles);
  const [filter, setFilter] = useState<Filter>('All');

  const featured = ARTICLES.find((a) => a.featured) ?? ARTICLES[0];
  const list = ARTICLES.filter((a) =>
    filter === 'All' ? a.id !== featured.id : filter === 'Saved' ? saved.includes(a.id) : a.cat === filter,
  );

  return (
    <PushedScreen title="Journal" contentStyle={{ paddingHorizontal: 0, gap: 14 }}>
      <Animated.View entering={enter(0, reduced)} style={{ paddingHorizontal: 20, gap: 6 }}>
        <Text style={[font.eyebrow(), { color: c.accentText }]}>Training journal</Text>
        <Text style={[font.body(400, 14, { lh: 1.5 }), { color: c.text2 }]}>
          Programs, gear guides and recovery advice from the coaches who test everything we sell.
        </Text>
      </Animated.View>

      {filter === 'All' ? (
        <Animated.View entering={enter(1, reduced)} style={{ paddingHorizontal: 20 }}>
          <FeaturedArticleCard article={featured} height={320} />
        </Animated.View>
      ) : null}

      <Animated.View entering={enter(2, reduced)}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingHorizontal: 20 }}>
          {(['All', ...JOURNAL_CATS, 'Saved'] as Filter[]).map((f) => (
            <Chip key={f} label={f === 'Saved' ? `Saved${saved.length ? ` · ${saved.length}` : ''}` : f} on={filter === f} onPress={() => setFilter(f)} />
          ))}
        </ScrollView>
      </Animated.View>

      <View style={{ paddingHorizontal: 20, gap: 4 }}>
        <Text style={[font.display(700, 22), { color: c.text1 }]}>{filter === 'All' ? 'Latest stories' : filter}</Text>
        <Text style={[font.mono(500, 10.5), { color: c.text3 }]}>{cnt(list.length, 'story', 'stories')}</Text>
      </View>

      {list.length === 0 ? (
        <EmptyState
          icon="bookmark"
          iconColor={c.text3}
          title={filter === 'Saved' ? 'No saved stories' : 'Nothing here yet'}
          body={filter === 'Saved' ? 'Tap the bookmark on any story to read it later.' : 'New stories land every week.'}
          style={{ marginHorizontal: 20 }}
        />
      ) : (
        <View key={filter} style={{ gap: 10, paddingHorizontal: 20 }}>
          {list.map((a, i) => (
            <Animated.View key={a.id} entering={enter(3 + i, reduced)} layout={reduced ? undefined : LinearTransition}>
              <ArticleRow article={a} />
            </Animated.View>
          ))}
        </View>
      )}
    </PushedScreen>
  );
}
