import { create } from 'zustand';

import type { Category } from '@/data/types';

export type Rect = { x: number; y: number; w: number; h: number };

export type Toast = {
  id: number;
  title: string;
  sub?: string;
  action?: { label: string; onPress: () => void };
  /** Leading icon; defaults to a check mark. */
  icon?: 'check' | 'block' | 'info';
};

export type ShopFilters = { sort: 0 | 1 | 2; max: number; sale: boolean };
export const DEFAULT_FILTERS: ShopFilters = { sort: 0, max: 1000, sale: false };

type UIState = {
  toast: Toast | null;
  showToast: (t: Omit<Toast, 'id'>) => void;
  hideToast: () => void;

  /** Fly-to-cart: the dot animates from `from` to `to`, then `onDone` fires. */
  fly: { id: number; from: Rect; to: Rect; onDone?: () => void } | null;
  startFly: (from: Rect, to: Rect, onDone?: () => void) => void;
  endFly: () => void;

  /** Window rect of the cart icon in the tab bar (fly-to-cart target). */
  cartTarget: Rect | null;
  setCartTarget: (r: Rect) => void;
  /** Increments to trigger the cart badge "bump". */
  cartBump: number;
  bumpCart: () => void;

  /** Storefront browsing state, shared by Home → Shop → Filters sheet. */
  cat: Category | 'All';
  q: string;
  filters: ShopFilters;
  setCat: (c: Category | 'All') => void;
  setQuery: (q: string) => void;
  setFilters: (f: ShopFilters) => void;
  resetBrowse: () => void;
  /** Increments to ask the Shop screen to focus its search field. */
  searchFocus: number;
  requestSearchFocus: () => void;
  /** Last storefront tab path — where auth returns to when it closes. */
  lastTabPath: string;
  setLastTabPath: (p: string) => void;
};

let seq = 0;

export const useUI = create<UIState>()((set) => ({
  toast: null,
  showToast: (t) => set({ toast: { ...t, id: ++seq } }),
  hideToast: () => set({ toast: null }),

  fly: null,
  startFly: (from, to, onDone) => set({ fly: { id: ++seq, from, to, onDone } }),
  endFly: () => set({ fly: null }),

  cartTarget: null,
  setCartTarget: (cartTarget) => set({ cartTarget }),
  cartBump: 0,
  bumpCart: () => set((s) => ({ cartBump: s.cartBump + 1 })),

  cat: 'All',
  q: '',
  filters: DEFAULT_FILTERS,
  setCat: (cat) => set({ cat }),
  setQuery: (q) => set({ q }),
  setFilters: (filters) => set({ filters }),
  resetBrowse: () => set({ cat: 'All', q: '', filters: DEFAULT_FILTERS }),
  searchFocus: 0,
  requestSearchFocus: () => set((s) => ({ searchFocus: s.searchFocus + 1 })),
  lastTabPath: '/',
  setLastTabPath: (lastTabPath) => set({ lastTabPath }),
}));

/** Imperative helper usable outside React components. */
export const toast = (title: string, sub?: string, action?: Toast['action']) =>
  useUI.getState().showToast({ title, sub, action });
