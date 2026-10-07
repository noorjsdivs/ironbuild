import { useState } from 'react';
import { Text, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { AdminScreen, editProduct, PageTitle } from '@/components/admin';
import { Photo, SearchBox, StatusPill } from '@/components/blocks';
import { Button } from '@/components/button';
import { PressableScale } from '@/components/pressable-scale';
import { money } from '@/lib/format';
import { minPrice } from '@/lib/pricing';
import { stockOf } from '@/lib/status';
import { useApp } from '@/store/app-store';
import { font } from '@/theme/fonts';
import { enter } from '@/theme/motion';
import { useMotion, useTheme } from '@/theme/use-theme';

export default function AdminProducts() {
  const { c } = useTheme();
  const { reduced } = useMotion();
  const products = useApp((s) => s.products);
  const [q, setQ] = useState('');
  const ql = q.trim().toLowerCase();
  const list = products.filter((p) => !ql || `${p.name} ${p.cat} ${p.sku}`.toLowerCase().includes(ql));

  return (
    <AdminScreen title="Products">
      <Animated.View entering={enter(0, reduced)}>
        <PageTitle
          title="Products"
          right={<Button label="New" icon="add" height={38} radius={12} weight={600} fontSize={13} style={{ paddingHorizontal: 14, gap: 6 }} onPress={() => editProduct('new')} />}
        />
      </Animated.View>
      <Animated.View entering={enter(1, reduced)} style={{ flexDirection: 'row' }}>
        <SearchBox value={q} onChangeText={setQ} placeholder="Search products" />
      </Animated.View>
      <View style={{ gap: 8 }}>
        {list.map((p, i) => {
          const s = stockOf(p, c);
          return (
            <Animated.View key={p.id} entering={enter(2 + i, reduced)}>
              <PressableScale
                scaleTo={0.98}
                onPress={() => editProduct(p.id)}
                accessibilityLabel={`${p.name}, ${money(minPrice(p))}, ${s.label}${p.active ? '' : ', unpublished'}`}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 8, paddingRight: 12, borderRadius: 16, borderWidth: 1, borderColor: c.line, backgroundColor: c.surface1 }}>
                <View style={{ width: 52, height: 52, borderRadius: 13, overflow: 'hidden', backgroundColor: c.surface2, opacity: p.active ? 1 : 0.4 }}>
                  <Photo uri={p.img} style={{ width: '100%', height: '100%' }} />
                </View>
                <View style={{ flex: 1, minWidth: 0, gap: 3 }}>
                  <Text numberOfLines={1} style={[font.body(600, 14), { color: c.text1 }]}>
                    {p.name}
                  </Text>
                  <Text numberOfLines={1} style={[font.mono(500, 10.5), { color: c.text3 }]}>{`${p.sku} · ${p.cat}`}</Text>
                </View>
                <View style={{ alignItems: 'flex-end', gap: 4 }}>
                  <Text style={[font.num(700, 16), { color: c.text1 }]}>{money(minPrice(p))}</Text>
                  <StatusPill label={s.label} color={s.color} size="xs" upper={false} />
                </View>
              </PressableScale>
            </Animated.View>
          );
        })}
      </View>
    </AdminScreen>
  );
}
