import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMemo, useSyncExternalStore } from 'react';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';

import { CATS } from '@/data/catalog';
import type { Product } from '@/data/types';
import { lineSubtotal, standardShipping } from '@/lib/pricing';

import {
  createAccount,
  createCart,
  createCatalog,
  createContent,
  createPrefs,
  createSession,
  type AppState,
} from './slices';

export const useApp = create<AppState>()(
  persist(
    (...a) => ({
      ...createPrefs(...a),
      ...createSession(...a),
      ...createCart(...a),
      ...createAccount(...a),
      ...createCatalog(...a),
      ...createContent(...a),
    }),
    {
      name: 'ironbuild-app',
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
      // Persist data only; actions are recreated on every launch.
      partialize: (s) =>
        Object.fromEntries(Object.entries(s).filter(([, v]) => typeof v !== 'function')) as Partial<AppState>,
    },
  ),
);

/** True once the persisted state has been read from disk. */
export function useHydrated() {
  return useSyncExternalStore(
    (cb) => useApp.persist.onFinishHydration(cb),
    () => useApp.persist.hasHydrated(),
    () => false,
  );
}

/* ───────────────────────── Selectors ───────────────────────── */

export function useProductLookup() {
  const products = useApp((s) => s.products);
  return useMemo(() => {
    const map = new Map(products.map((p) => [p.id, p]));
    return (id: string): Product | undefined => map.get(id);
  }, [products]);
}

export function useProduct(id: string | undefined) {
  return useApp((s) => s.products.find((p) => p.id === id));
}

/** Categories visible in the storefront. */
export function useVisibleCats() {
  const hidden = useApp((s) => s.hiddenCats);
  return useMemo(() => CATS.filter((c) => !hidden.includes(c)), [hidden]);
}

/** Products a shopper can see: published and in a visible category. */
export function useLiveProducts() {
  const products = useApp((s) => s.products);
  const cats = useVisibleCats();
  return useMemo(() => products.filter((p) => p.active && cats.includes(p.cat)), [products, cats]);
}

export function useCartTotals(express = false) {
  const { cart, freeAt, rates } = useApp(useShallow((s) => ({ cart: s.cart, freeAt: s.freeAt, rates: s.rates })));
  const byId = useProductLookup();
  return useMemo(() => {
    const sub = lineSubtotal(cart, byId);
    const count = cart.reduce((a, c) => a + c.q, 0);
    const std = standardShipping(sub, freeAt, rates);
    const ship = express ? rates.exp : std;
    return { sub, count, std, ship, total: sub + ship, freeAt };
  }, [cart, byId, freeAt, rates, express]);
}

export function useCartCount() {
  return useApp((s) => s.cart.reduce((a, c) => a + c.q, 0));
}
