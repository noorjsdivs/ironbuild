import { View } from 'react-native';
import Animated from 'react-native-reanimated';

import type { Product } from '@/data/types';
import { enter } from '@/theme/motion';
import { useMotion } from '@/theme/use-theme';

import { ProductCard } from './product-card';

/** Two-column card grid with staggered entrances. */
export function ProductGrid({ products, stagger = 0 }: { products: Product[]; stagger?: number }) {
  const { reduced } = useMotion();
  const rows: Product[][] = [];
  for (let i = 0; i < products.length; i += 2) rows.push(products.slice(i, i + 2));

  return (
    <View style={{ gap: 12, paddingHorizontal: 20 }}>
      {rows.map((row, r) => (
        <View key={row[0].id} style={{ flexDirection: 'row', gap: 12 }}>
          {row.map((p, k) => (
            <Animated.View key={p.id} entering={enter(stagger + r * 2 + k, reduced)} style={{ flex: 1 }}>
              <ProductCard product={p} />
            </Animated.View>
          ))}
          {row.length === 1 ? <View style={{ flex: 1 }} /> : null}
        </View>
      ))}
    </View>
  );
}
