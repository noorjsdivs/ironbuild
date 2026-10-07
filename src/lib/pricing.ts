import type { CartLine, Order, Product } from '@/data/types';

export type ShippingRates = { std: number; exp: number };

export const minPrice = (p: Product) => Math.min(...p.prices);

export const hasMultiplePrices = (p: Product) => new Set(p.prices).size > 1;

export function lineSubtotal(lines: CartLine[], byId: (id: string) => Product | undefined) {
  return lines.reduce((a, l) => a + (byId(l.id)?.prices[l.s] ?? 0) * l.q, 0);
}

export function standardShipping(sub: number, freeAt: number, rates: ShippingRates) {
  return sub >= freeAt ? 0 : rates.std;
}

export function orderTotal(o: Order, byId: (id: string) => Product | undefined, freeAt: number, rates: ShippingRates) {
  const sub = lineSubtotal(o.items, byId);
  return sub + orderShipping(o, sub, freeAt, rates);
}

export function orderShipping(o: Order, sub: number, freeAt: number, rates: ShippingRates) {
  return o.ship === 'exp' ? rates.exp : standardShipping(sub, freeAt, rates);
}
