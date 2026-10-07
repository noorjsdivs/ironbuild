import { useMemo } from 'react';

import type { Product } from '@/data/types';
import { minPrice } from '@/lib/pricing';
import { useLiveProducts } from '@/store/app-store';
import { useUI, type ShopFilters } from '@/store/ui-store';

const SORTERS: ((a: Product, b: Product) => number)[] = [
  (a, b) => b.reviews - a.reviews,
  (a, b) => minPrice(a) - minPrice(b),
  (a, b) => minPrice(b) - minPrice(a),
];

export const SORT_LABELS = ['Most popular', 'Price: low to high', 'Price: high to low'] as const;

export function activeFilterCount(f: ShopFilters) {
  return (f.sort ? 1 : 0) + (f.max < 1000 ? 1 : 0) + (f.sale ? 1 : 0);
}

/** Products matching the current category, query and the given filters. */
export function useShopResults(filters?: ShopFilters) {
  const live = useLiveProducts();
  const cat = useUI((s) => s.cat);
  const q = useUI((s) => s.q);
  const current = useUI((s) => s.filters);
  const f = filters ?? current;

  return useMemo(() => {
    const ql = q.trim().toLowerCase();
    return live
      .filter(
        (p) =>
          (cat === 'All' || p.cat === cat) &&
          (!ql || `${p.name} ${p.cat}`.toLowerCase().includes(ql)) &&
          minPrice(p) <= f.max &&
          (!f.sale || !!p.was),
      )
      .sort(SORTERS[f.sort]);
  }, [live, cat, q, f]);
}
