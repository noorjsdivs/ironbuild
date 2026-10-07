import { Text, View } from 'react-native';
import Animated from 'react-native-reanimated';

import { AdminScreen } from '@/components/admin';
import { Photo } from '@/components/blocks';
import { Switch } from '@/components/controls';
import { CAT_IMG, CATS } from '@/data/catalog';
import { cnt } from '@/lib/format';
import { useApp } from '@/store/app-store';
import { font } from '@/theme/fonts';
import { enter } from '@/theme/motion';
import { useMotion, useTheme } from '@/theme/use-theme';

export default function AdminCategories() {
  const { c } = useTheme();
  const { reduced } = useMotion();
  const hidden = useApp((s) => s.hiddenCats);
  const products = useApp((s) => s.products);
  const toggle = useApp((s) => s.toggleCategory);

  return (
    <AdminScreen title="Categories" back contentStyle={{ gap: 8 }}>
      <Text style={[font.body(400, 13.5, { lh: 1.5 }), { color: c.text2, marginBottom: 6 }]}>
        Hidden categories disappear from the store’s home and shop screens.
      </Text>
      {CATS.map((cat, i) => {
        const on = !hidden.includes(cat);
        return (
          <Animated.View
            key={cat}
            entering={enter(1 + i, reduced)}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 8, paddingRight: 12, borderRadius: 16, borderWidth: 1, borderColor: c.line, backgroundColor: c.surface1 }}>
            <View style={{ width: 48, height: 48, borderRadius: 12, overflow: 'hidden', backgroundColor: c.surface2, opacity: on ? 1 : 0.4 }}>
              <Photo uri={CAT_IMG[cat]} style={{ width: '100%', height: '100%' }} />
            </View>
            <View style={{ flex: 1, minWidth: 0, gap: 3 }}>
              <Text style={[font.body(600, 14), { color: on ? c.text1 : c.text3 }]}>{cat}</Text>
              <Text style={[font.mono(500, 10.5), { color: c.text3 }]}>{cnt(products.filter((p) => p.cat === cat).length, 'product')}</Text>
            </View>
            <Switch on={on} onToggle={() => toggle(cat)} label={`Show ${cat} in store`} />
          </Animated.View>
        );
      })}
    </AdminScreen>
  );
}
