import { STATUS } from '@/data/catalog';
import type { Customer, OrderStep, Product } from '@/data/types';
import type { Palette } from '@/theme/tokens';

export function statusColor(step: OrderStep, c: Palette) {
  return [c.info, c.warn, c.accentText, c.ok, c.err][step];
}

export function statusOf(step: OrderStep, c: Palette) {
  return { label: STATUS[step], color: statusColor(step, c) };
}

/** Inventory badge: Out / N left / N in stock. */
export function stockOf(p: Product, c: Palette) {
  if (p.stock <= 0) return { label: 'Out', color: c.err };
  if (p.stock <= 5) return { label: `${p.stock} left`, color: c.warn };
  return { label: `${p.stock} in stock`, color: c.ok };
}

export const tierColor = (tier: Customer['tier'], c: Palette) => (tier === 'VIP' ? c.accentText : tier === 'New' ? c.info : c.text2);
