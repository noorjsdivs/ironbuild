export type Category =
  | 'Dumbbells'
  | 'Kettlebells'
  | 'Barbells & Plates'
  | 'Racks & Benches'
  | 'Cardio'
  | 'Bands'
  | 'Accessories'
  | 'Supplements';

export type Product = {
  id: string;
  name: string;
  short: string;
  cat: Category;
  /** Label for the option picker, e.g. "Weight · per pair". */
  opt: string;
  sizes: string[];
  prices: number[];
  /** Pre-sale prices, aligned with `prices`. */
  was: number[] | null;
  /** Default option index. */
  def: number;
  tag: string;
  rating: number;
  reviews: number;
  stock: number;
  desc: string;
  specs: [string, string][];
  img: string;
  sku: string;
  active: boolean;
};

export type CartLine = { id: string; s: number; q: number };

/** 0 Confirmed · 1 Packed · 2 Shipped · 3 Delivered · 4 Cancelled */
export type OrderStep = 0 | 1 | 2 | 3 | 4;

export type Order = {
  no: string;
  cid: string;
  date: string;
  step: OrderStep;
  items: CartLine[];
  ship: 'std' | 'exp';
  pay: string;
  times: string[];
  etaShort: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  city: string;
  tier: 'VIP' | 'Active' | 'New';
};

export type User = { name: string; email: string; phone?: string; photo?: string };

export type Address = { id: string; label: string; icon: 'home' | 'work' | 'fitness_center' | 'location_on'; l1: string; l2: string };

export type PaymentCard = { id: string; brand: string; bg: string; num: string; sub: string };

export type Discount = { code: string; desc: string; used: number; limit: number; on: boolean };

export type HeroSlide = {
  eyebrow: string;
  title: string;
  cta: string;
  img: string;
  cat?: Category;
  product?: string;
};
