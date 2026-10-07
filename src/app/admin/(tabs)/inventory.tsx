import { useState } from 'react';
import { Text, View } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';

import { AdminScreen, PageTitle, StatTile } from '@/components/admin';
import { Photo } from '@/components/blocks';
import { Stepper } from '@/components/controls';
import { stockOf } from '@/lib/status';
import { useApp } from '@/store/app-store';
import { font } from '@/theme/fonts';
import { enter } from '@/theme/motion';
import { useMotion, useTheme } from '@/theme/use-theme';

type Filter = 'all' | 'low' | 'out';

export default function AdminInventory() {
  const { c } = useTheme();
  const { reduced } = useMotion();
  const products = useApp((s) => s.products);
  const adjustStock = useApp((s) => s.adjustStock);
  const [filter, setFilter] = useState<Filter>('all');
  const low = products.filter((p) => p.stock > 0 && p.stock <= 5);
  const out = products.filter((p) => p.stock <= 0);
  const rows = filter === 'low' ? low : filter === 'out' ? out : products;
  const pick = (f: Filter) => setFilter((cur) => (cur === f ? 'all' : f));

  return (
    <AdminScreen title="Inventory">
      <Animated.View entering={enter(0, reduced)}>
        <PageTitle title="Inventory" />
      </Animated.View>
      <Animated.View entering={enter(1, reduced)} style={{ flexDirection: 'row', gap: 8 }}>
        <StatTile label="Total" value={String(products.length)} selected={filter === 'all'} onPress={() => pick('all')} />
        <StatTile label="Low" value={String(low.length)} color={c.warn} selected={filter === 'low'} onPress={() => pick('low')} />
        <StatTile label="Out" value={String(out.length)} color={c.err} selected={filter === 'out'} onPress={() => pick('out')} />
      </Animated.View>
      <View key={filter} style={{ gap: 8 }}>
        {rows.map((p, i) => {
          const s = stockOf(p, c);
          return (
            <Animated.View
              key={p.id}
              entering={enter(2 + i, reduced)}
              layout={reduced ? undefined : LinearTransition}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 8, borderRadius: 16, borderWidth: 1, borderColor: c.line, backgroundColor: c.surface1 }}>
              <View style={{ width: 48, height: 48, borderRadius: 12, overflow: 'hidden', backgroundColor: c.surface2 }}>
                <Photo uri={p.img} style={{ width: '100%', height: '100%' }} />
              </View>
              <View style={{ flex: 1, minWidth: 0, gap: 3 }}>
                <Text numberOfLines={1} style={[font.body(600, 13.5), { color: c.text1 }]}>
                  {p.name}
                </Text>
                <Text style={[font.mono(500, 10), { color: s.color }]}>{s.label}</Text>
              </View>
              <Stepper value={p.stock} size={36} minWidth={30} label={`stock for ${p.name}`} onInc={() => adjustStock(p.id, 1)} onDec={() => adjustStock(p.id, -1)} />
            </Animated.View>
          );
        })}
      </View>
    </AdminScreen>
  );
}
