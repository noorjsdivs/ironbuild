import type { StateCreator } from 'zustand';

import { SEED_ORDERS, SEED_PRODUCTS } from '@/data/catalog';
import type { Address, CartLine, Category, Discount, Order, PaymentCard, Product, User } from '@/data/types';
import type { AccentKey, ThemeMode } from '@/theme/tokens';

/* ───────────────────────── Preferences ───────────────────────── */

export type PrefsSlice = {
  theme: ThemeMode;
  accent: AccentKey;
  reducedMotion: boolean;
  hasSeenIntro: boolean;
  setTheme: (t: ThemeMode) => void;
  setAccent: (a: AccentKey) => void;
  toggleReducedMotion: () => void;
  markIntroSeen: () => void;
};

/* ───────────────────────── Session ───────────────────────── */

export type SessionSlice = {
  user: User | null;
  signIn: (user: User) => void;
  signOut: () => void;
  updateUser: (patch: Partial<User>) => void;
};

/* ───────────────────────── Cart & wishlist ───────────────────────── */

export type CartSlice = {
  cart: CartLine[];
  saved: string[];
  addToCart: (id: string, s: number, q: number) => void;
  changeQty: (id: string, s: number, delta: number) => void;
  removeLine: (id: string, s: number) => void;
  clearCart: () => void;
  toggleSaved: (id: string) => void;
};

/* ───────────────────────── Account ───────────────────────── */

export type NotifPrefs = { ship: boolean; promo: boolean; stock: boolean; review: boolean };

export type AccountSlice = {
  addresses: Address[];
  defaultAddressId: string | null;
  cards: PaymentCard[];
  defaultCardId: string | null;
  notifPrefs: NotifPrefs;
  setDefaultAddress: (id: string) => void;
  addAddress: (a: Omit<Address, 'id'>) => void;
  removeAddress: (id: string) => void;
  setDefaultCard: (id: string) => void;
  addCard: (c: Omit<PaymentCard, 'id'>) => void;
  removeCard: (id: string) => void;
  toggleNotifPref: (k: keyof NotifPrefs) => void;
};

/* ───────────────────────── Store back office ───────────────────────── */

export type PayMethods = { card: boolean; apple: boolean; cod: boolean };
export type AdminNotifs = { order: boolean; low: boolean; weekly: boolean };
export type ProductDraft = { name: string; price: number; stock: number; cat: Category; active: boolean };

export type CatalogSlice = {
  products: Product[];
  orders: Order[];
  hiddenCats: Category[];
  freeAt: number;
  rates: { std: number; exp: number };
  zones: string[];
  discounts: Discount[];
  pays: PayMethods;
  adminNotifs: AdminNotifs;
  storeInfo: { name: string; email: string };
  addOrder: (o: Order) => void;
  advanceOrder: (no: string, stamp: string) => void;
  cancelOrder: (no: string) => void;
  saveProduct: (id: string | null, d: ProductDraft) => string;
  deleteProduct: (id: string) => void;
  adjustStock: (id: string, delta: number) => void;
  toggleCategory: (c: Category) => void;
  setFreeAt: (v: number) => void;
  setRate: (k: 'std' | 'exp', v: number) => void;
  toggleZone: (z: string) => void;
  addDiscount: (code: string, pct: number) => void;
  toggleDiscount: (code: string) => void;
  togglePay: (k: keyof PayMethods) => void;
  toggleAdminNotif: (k: keyof AdminNotifs) => void;
  setStoreInfo: (patch: Partial<{ name: string; email: string }>) => void;
};

/* ───────────────────────── Journal & browsing ───────────────────────── */

export type ContentSlice = {
  savedArticles: string[];
  /** Most recent first, capped at 10. */
  recentlyViewed: string[];
  toggleArticle: (id: string) => void;
  markViewed: (productId: string) => void;
  newsletter: string | null;
  subscribe: (email: string) => void;
};

export type AppState = PrefsSlice & SessionSlice & CartSlice & AccountSlice & CatalogSlice & ContentSlice;

type Slice<T> = StateCreator<AppState, [['zustand/persist', unknown]], [], T>;

export const createPrefs: Slice<PrefsSlice> = (set) => ({
  theme: 'dark',
  accent: 'volt',
  reducedMotion: false,
  hasSeenIntro: false,
  setTheme: (theme) => set({ theme }),
  setAccent: (accent) => set({ accent }),
  toggleReducedMotion: () => set((s) => ({ reducedMotion: !s.reducedMotion })),
  markIntroSeen: () => set({ hasSeenIntro: true }),
});

export const createSession: Slice<SessionSlice> = (set) => ({
  user: null,
  signIn: (user) => set({ user }),
  signOut: () => set({ user: null }),
  updateUser: (patch) => set((s) => (s.user ? { user: { ...s.user, ...patch } } : {})),
});

export const createCart: Slice<CartSlice> = (set) => ({
  cart: [
    { id: 'kb', s: 3, q: 1 },
    { id: 'whey', s: 0, q: 1 },
  ],
  saved: ['bar', 'belt', 'rower'],
  addToCart: (id, s, q) =>
    set((st) => {
      const i = st.cart.findIndex((c) => c.id === id && c.s === s);
      if (i < 0) return { cart: [...st.cart, { id, s, q }] };
      return { cart: st.cart.map((c, k) => (k === i ? { ...c, q: c.q + q } : c)) };
    }),
  changeQty: (id, s, delta) =>
    set((st) => ({
      cart: st.cart.map((c) => (c.id === id && c.s === s ? { ...c, q: c.q + delta } : c)).filter((c) => c.q > 0),
    })),
  removeLine: (id, s) => set((st) => ({ cart: st.cart.filter((c) => !(c.id === id && c.s === s)) })),
  clearCart: () => set({ cart: [] }),
  toggleSaved: (id) =>
    set((st) => ({ saved: st.saved.includes(id) ? st.saved.filter((x) => x !== id) : [...st.saved, id] })),
});

const uid = (prefix: string) => prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

export const createAccount: Slice<AccountSlice> = (set) => ({
  addresses: [
    { id: 'a1', label: 'Home', icon: 'home', l1: '214 Foundry St, Apt 3B', l2: 'Brooklyn, NY 11201' },
    { id: 'a2', label: 'Gym', icon: 'fitness_center', l1: '88 Atlantic Ave', l2: 'Brooklyn, NY 11217' },
  ],
  defaultAddressId: 'a1',
  cards: [
    { id: 'k1', brand: 'VISA', bg: '#1a1f71', num: '•••• 4242', sub: 'Expires 08/27' },
    { id: 'k2', brand: 'MC', bg: '#222222', num: '•••• 8810', sub: 'Expires 02/26' },
  ],
  defaultCardId: 'k1',
  notifPrefs: { ship: true, promo: false, stock: true, review: true },
  setDefaultAddress: (id) => set({ defaultAddressId: id }),
  addAddress: (a) =>
    set((s) => {
      const id = uid('a');
      return { addresses: [...s.addresses, { ...a, id }], defaultAddressId: s.defaultAddressId ?? id };
    }),
  removeAddress: (id) =>
    set((s) => {
      const addresses = s.addresses.filter((x) => x.id !== id);
      return { addresses, defaultAddressId: s.defaultAddressId === id ? (addresses[0]?.id ?? null) : s.defaultAddressId };
    }),
  setDefaultCard: (id) => set({ defaultCardId: id }),
  addCard: (c) =>
    set((s) => {
      const id = uid('k');
      return { cards: [...s.cards, { ...c, id }], defaultCardId: s.defaultCardId ?? id };
    }),
  removeCard: (id) =>
    set((s) => {
      const cards = s.cards.filter((x) => x.id !== id);
      return { cards, defaultCardId: s.defaultCardId === id ? (cards[0]?.id ?? null) : s.defaultCardId };
    }),
  toggleNotifPref: (k) => set((s) => ({ notifPrefs: { ...s.notifPrefs, [k]: !s.notifPrefs[k] } })),
});

export const createCatalog: Slice<CatalogSlice> = (set, get) => ({
  products: SEED_PRODUCTS,
  orders: SEED_ORDERS,
  hiddenCats: [],
  freeAt: 150,
  rates: { std: 19, exp: 25 },
  zones: ['US', 'Canada'],
  discounts: [
    { code: 'IRON10', desc: '10% off entire order', used: 342, limit: 1000, on: true },
    { code: 'RACK20', desc: '20% off racks & benches', used: 88, limit: 500, on: true },
    { code: 'FREESHIP', desc: 'Free express shipping', used: 1204, limit: 0, on: true },
    { code: 'SUMMER15', desc: '15% off supplements', used: 500, limit: 500, on: false },
  ],
  pays: { card: true, apple: true, cod: false },
  adminNotifs: { order: true, low: true, weekly: false },
  storeInfo: { name: 'IRONBUILD', email: 'support@ironbuild.example' },

  addOrder: (o) => set((s) => ({ orders: [o, ...s.orders] })),
  advanceOrder: (no, stamp) =>
    set((s) => ({
      orders: s.orders.map((o) =>
        o.no === no && o.step < 3 ? { ...o, step: (o.step + 1) as Order['step'], times: [...o.times, stamp] } : o,
      ),
    })),
  cancelOrder: (no) => set((s) => ({ orders: s.orders.map((o) => (o.no === no ? { ...o, step: 4 } : o)) })),

  saveProduct: (id, d) => {
    const short = d.name.trim().split(/\s+/).slice(0, 2).join(' ');
    if (id) {
      set((s) => ({
        products: s.products.map((p) => {
          if (p.id !== id) return p;
          const delta = d.price - Math.min(...p.prices);
          return { ...p, name: d.name.trim(), short, stock: d.stock, cat: d.cat, active: d.active, prices: p.prices.map((x) => x + delta) };
        }),
      }));
      return id;
    }
    const newId = uid('p');
    const { products } = get();
    const product: Product = {
      id: newId,
      name: d.name.trim(),
      short,
      cat: d.cat,
      opt: 'Model',
      sizes: ['Standard'],
      prices: [d.price],
      was: null,
      def: 0,
      tag: 'New',
      rating: 5,
      reviews: 0,
      stock: d.stock,
      desc: 'Freshly added. Description coming soon.',
      specs: [
        ['Status', 'New'],
        ['Category', d.cat],
        ['SKU', 'Pending'],
      ],
      img: SEED_PRODUCTS.find((p) => p.cat === d.cat)?.img ?? SEED_PRODUCTS[0].img,
      sku: 'IB-' + (1300 + products.length),
      active: d.active,
    };
    set({ products: [...products, product] });
    return newId;
  },
  deleteProduct: (id) =>
    set((s) => ({
      products: s.products.filter((p) => p.id !== id),
      cart: s.cart.filter((c) => c.id !== id),
      saved: s.saved.filter((x) => x !== id),
    })),
  adjustStock: (id, delta) =>
    set((s) => ({ products: s.products.map((p) => (p.id === id ? { ...p, stock: Math.max(0, p.stock + delta) } : p)) })),
  toggleCategory: (c) =>
    set((s) => ({ hiddenCats: s.hiddenCats.includes(c) ? s.hiddenCats.filter((x) => x !== c) : [...s.hiddenCats, c] })),
  setFreeAt: (v) => set({ freeAt: Math.max(0, v) }),
  setRate: (k, v) => set((s) => ({ rates: { ...s.rates, [k]: Math.max(0, v) } })),
  toggleZone: (z) => set((s) => ({ zones: s.zones.includes(z) ? s.zones.filter((x) => x !== z) : [...s.zones, z] })),
  addDiscount: (code, pct) =>
    set((s) => ({ discounts: [{ code, desc: `${pct}% off entire order`, used: 0, limit: 500, on: true }, ...s.discounts] })),
  toggleDiscount: (code) => set((s) => ({ discounts: s.discounts.map((d) => (d.code === code ? { ...d, on: !d.on } : d)) })),
  togglePay: (k) => set((s) => ({ pays: { ...s.pays, [k]: !s.pays[k] } })),
  toggleAdminNotif: (k) => set((s) => ({ adminNotifs: { ...s.adminNotifs, [k]: !s.adminNotifs[k] } })),
  setStoreInfo: (patch) => set((s) => ({ storeInfo: { ...s.storeInfo, ...patch } })),
});

export const createContent: Slice<ContentSlice> = (set) => ({
  savedArticles: [],
  recentlyViewed: [],
  newsletter: null,
  toggleArticle: (id) =>
    set((s) => ({ savedArticles: s.savedArticles.includes(id) ? s.savedArticles.filter((x) => x !== id) : [id, ...s.savedArticles] })),
  markViewed: (productId) =>
    set((s) => (s.recentlyViewed[0] === productId ? {} : { recentlyViewed: [productId, ...s.recentlyViewed.filter((x) => x !== productId)].slice(0, 10) })),
  subscribe: (email) => set({ newsletter: email.trim().toLowerCase() }),
});
