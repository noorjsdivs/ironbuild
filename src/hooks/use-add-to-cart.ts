import { router } from 'expo-router';
import { useCallback } from 'react';
import type { View } from 'react-native';

import { haptic } from '@/components/pressable-scale';
import type { Product } from '@/data/types';
import { useApp } from '@/store/app-store';
import { useUI, type Rect } from '@/store/ui-store';
import { useMotion } from '@/theme/use-theme';

export const measure = (el: View | null) =>
  new Promise<Rect | null>((resolve) => {
    if (!el) return resolve(null);
    el.measureInWindow((x, y, w, h) => resolve(w || h ? { x, y, w, h } : null));
  });

/**
 * Adds a line to the cart and plays the prototype's fly-to-cart effect:
 * a "+1" dot arcs from the tapped button to the cart icon, the badge bumps,
 * and a toast offers a shortcut to the cart.
 */
export function useAddToCart() {
  const addToCart = useApp((s) => s.addToCart);
  const { reduced } = useMotion();

  return useCallback(
    async (p: Product, s: number, q: number, from?: View | null, to?: View | null) => {
      const ui = useUI.getState();
      if (p.stock <= 0) {
        haptic('warning');
        ui.showToast({ title: 'Out of stock', sub: `${p.short} is not available right now`, icon: 'block' });
        return;
      }
      addToCart(p.id, s, q);

      const done = () => {
        const st = useUI.getState();
        st.bumpCart();
        haptic('success');
        st.showToast({
          title: 'Added to cart',
          sub: `${p.short} · ${p.sizes[s]}${q > 1 ? ' × ' + q : ''}`,
          action: { label: 'View', onPress: () => router.navigate('/cart') },
        });
      };

      if (reduced || !from) return done();
      const [a, b] = await Promise.all([measure(from), to ? measure(to) : Promise.resolve(ui.cartTarget)]);
      if (!a || !b) return done();
      ui.startFly(a, b, done);
    },
    [addToCart, reduced],
  );
}
