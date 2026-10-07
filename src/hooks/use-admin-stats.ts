import { useMemo } from 'react';

import { orderTotal } from '@/lib/pricing';
import { useApp, useProductLookup } from '@/store/app-store';

/** Revenue and fulfilment figures derived from non-cancelled orders. */
export function useAdminStats() {
  const orders = useApp((s) => s.orders);
  const products = useApp((s) => s.products);
  const freeAt = useApp((s) => s.freeAt);
  const rates = useApp((s) => s.rates);
  const byId = useProductLookup();

  return useMemo(() => {
    const active = orders.filter((o) => o.step < 4);
    const totalOf = (o: (typeof orders)[number]) => orderTotal(o, byId, freeAt, rates);
    const revenue = active.reduce((a, o) => a + totalOf(o), 0);
    const low = products.filter((p) => p.stock <= 5);
    const fresh = orders.filter((o) => o.step === 0).length;
    return { active, revenue, low, fresh, totalOf, byId };
  }, [orders, products, freeAt, rates, byId]);
}
