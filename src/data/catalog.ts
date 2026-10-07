import type { Category, Customer, HeroSlide, Order, OrderStep, Product } from './types';

/**
 * Seed data for the store. In production this comes from the commerce API;
 * the shapes in `types.ts` are the contract the UI depends on.
 */

const u = (id: string, w = 800) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=72`;

export const PHOTO = {
  hex: u('photo-1685633224688-6a77675eb119'),
  kb: u('photo-1566568531155-07244e00963d'),
  bar: u('photo-1620188526357-ff08e03da266'),
  plates: u('photo-1521805103424-d8f8430e8933'),
  bench: u('photo-1623874514711-0f321325f318'),
  rack: u('photo-1534438327276-14e5300c3a48'),
  bike: u('photo-1637430308606-86576d8fef3c'),
  rower: u('photo-1593079831268-3381b0db4a77'),
  bands: u('photo-1584827386916-b5351d3ba34b'),
  belt: u('photo-1517838277536-f5f99be501cd'),
  gloves: u('photo-1581009137042-c552e485697a'),
  whey: u('photo-1693996045300-521e9d08cabc'),
  creatine: u('photo-1593095948071-474c5cc2989d'),
} as const;

export const BANNER = {
  hero1: u('photo-1541534741688-6078c6bfb5c5', 1000),
  hero2: u('photo-1632077804406-188472f1a810', 1000),
  hero3: u('photo-1571902943202-507ec2618e8f', 1000),
  splash: u('photo-1517836357463-d25dfeac3438', 1000),
  login: u('photo-1605296867304-46d5465a13f1', 1000),
  register: u('photo-1581009146145-b5ef050c2e1e', 1000),
  forgot: u('photo-1590487988256-9ed24133863e', 1000),
  verify: u('photo-1526506118085-60ce8714f8c5', 1000),
} as const;

export const CATS: Category[] = [
  'Dumbbells',
  'Kettlebells',
  'Barbells & Plates',
  'Racks & Benches',
  'Cardio',
  'Bands',
  'Accessories',
  'Supplements',
];

export const CAT_IMG: Record<Category, string> = {
  Dumbbells: PHOTO.hex,
  Kettlebells: PHOTO.kb,
  'Barbells & Plates': PHOTO.plates,
  'Racks & Benches': PHOTO.rack,
  Cardio: PHOTO.bike,
  Bands: PHOTO.bands,
  Accessories: PHOTO.belt,
  Supplements: PHOTO.whey,
};

/** Lifestyle shot used as the third gallery view on product detail. */
export const CAT_HERO: Record<Category, string> = {
  Dumbbells: BANNER.splash,
  Kettlebells: BANNER.hero2,
  'Barbells & Plates': BANNER.hero1,
  'Racks & Benches': BANNER.hero3,
  Cardio: BANNER.hero3,
  Bands: BANNER.register,
  Accessories: BANNER.login,
  Supplements: BANNER.forgot,
};

type SeedRow = [
  id: keyof typeof PHOTO,
  name: string,
  short: string,
  cat: Category,
  opt: string,
  sizes: string[],
  prices: number[],
  was: number[] | null,
  def: number,
  tag: string,
  rating: number,
  reviews: number,
  stock: number,
  desc: string,
  specs: [string, string][],
];

const SEED: SeedRow[] = [
  ['hex', 'Rubber Hex Dumbbells', 'Hex Dumbbells', 'Dumbbells', 'Weight · per pair', ['5 kg', '10 kg', '15 kg', '20 kg', '25 kg'], [49, 79, 109, 129, 159], null, 3, 'Bestseller', 4.8, 412, 24, "Cast-iron heads sealed in dense rubber so they won't roll or mark your floor. Medium-knurl chrome handle, sold as a pair.", [['Material', 'Iron + rubber'], ['Handle', 'Ø 32 mm'], ['Sold as', 'Pair']]],
  ['kb', 'Competition Kettlebell', 'Comp Kettlebell', 'Kettlebells', 'Weight', ['8 kg', '12 kg', '16 kg', '24 kg', '32 kg'], [49, 59, 69, 89, 119], null, 2, 'New', 4.9, 268, 8, 'Identical dimensions at every weight, so your rack position never changes as you progress. Colour-coded, single-cast steel.', [['Body', 'Cast steel'], ['Handle', 'Ø 35 mm'], ['Base', 'Flat 210 mm']]],
  ['bar', 'Olympic Barbell', 'Olympic Barbell', 'Barbells & Plates', 'Bar weight', ['15 kg', '20 kg'], [329, 349], null, 1, '', 4.7, 189, 3, '190k PSI shaft with dual knurl marks and needle-bearing sleeves for fast, quiet spin under heavy cleans.', [['Tensile', '190k PSI'], ['Sleeves', 'Bearing'], ['Length', '2.2 m']]],
  ['plates', 'Bumper Plate Set', 'Bumper Plates', 'Barbells & Plates', 'Set', ['70 kg', '100 kg', '140 kg'], [259, 349, 469], [329, 449, 599], 1, '−21%', 4.8, 301, 12, 'Virgin rubber bumpers with a stainless hub. Low bounce, ±1% weight accuracy, built to be dropped.', [['Rubber', 'Virgin'], ['Hub', 'Stainless'], ['Accuracy', '±1%']]],
  ['bench', 'Adjustable FID Bench', 'FID Bench', 'Racks & Benches', 'Model', ['Standard'], [299], null, 0, '', 4.6, 154, 0, 'Flat, incline and decline in one frame. Seven back and three seat positions, zero wobble at 350 kg.', [['Positions', '7 + 3'], ['Capacity', '350 kg'], ['Weight', '28 kg']]],
  ['rack', 'PR-1 Power Rack', 'Power Rack', 'Racks & Benches', 'Height', ['2.1 m', '2.3 m'], [899, 949], null, 0, 'Free install', 4.9, 97, 5, '11-gauge steel uprights with laser-cut numbered holes. Pull-up bar and safety spotter arms included.', [['Steel', '11-gauge'], ['Footprint', '1.2×1.3 m'], ['Capacity', '450 kg']]],
  ['bike', 'Air Assault Bike', 'Air Bike', 'Cardio', 'Model', ['Standard'], [749], null, 0, '', 4.7, 211, 7, 'Unlimited fan resistance that scales with your effort. Moving arms, steel frame and a console that tracks watts.', [['Resistance', 'Air'], ['Max user', '160 kg'], ['Console', 'Watts · RPM']]],
  ['rower', 'Magnetic Rowing Machine', 'Mag Rower', 'Cardio', 'Model', ['Standard'], [599], null, 0, '', 4.6, 128, 2, '16 levels of silent magnetic resistance and a folding rail that stores upright in under a square metre.', [['Levels', '16'], ['Folded', '0.6 m²'], ['Max user', '150 kg']]],
  ['bands', 'Loop Resistance Bands', 'Loop Bands', 'Bands', 'Resistance', ['Light', 'Medium', 'Heavy', 'Set of 3'], [15, 19, 25, 49], null, 3, '', 4.5, 640, 120, "Layered latex loops for warm-ups, assisted pull-ups and banded lifts. They won't snap, roll or pinch.", [['Latex', 'Layered'], ['Length', '104 cm'], ['Range', '5–55 kg']]],
  ['belt', '10 mm Lever Belt', 'Lever Belt', 'Accessories', 'Size', ['S', 'M', 'L', 'XL'], [79, 79, 79, 79], null, 1, '', 4.8, 233, 34, 'Single-ply 10 mm leather with a quick-release steel lever. Competition legal, breaks in within weeks.', [['Leather', '10 mm'], ['Width', '10 cm'], ['Buckle', 'Lever']]],
  ['gloves', 'Grip Lifting Gloves', 'Lifting Gloves', 'Accessories', 'Size', ['S', 'M', 'L', 'XL'], [25, 25, 25, 25], null, 2, '', 4.4, 356, 60, 'Half-finger gloves with silicone palm grip and a wrap wrist strap. Machine washable.', [['Palm', 'Silicone'], ['Wrist', 'Wrap strap'], ['Care', 'Washable']]],
  ['whey', 'Whey Isolate 2 kg', 'Whey Isolate', 'Supplements', 'Flavour', ['Chocolate', 'Vanilla', 'Plain'], [59, 59, 55], null, 0, 'New', 4.7, 892, 48, 'Cold-filtered isolate with 27 g protein per scoop and nothing you can’t pronounce. Mixes clean with a shake.', [['Protein', '27 g'], ['Servings', '66'], ['Tested', 'Per batch']]],
  ['creatine', 'Creatine Monohydrate', 'Creatine', 'Supplements', 'Size', ['300 g', '500 g'], [19, 29], null, 1, '', 4.9, 1204, 90, 'Micronised, unflavoured creatine monohydrate. 5 g per day, dissolves fully in water or your shake.', [['Dose', '5 g'], ['Servings', '60 / 100'], ['Form', 'Micronised']]],
];

export const SEED_PRODUCTS: Product[] = SEED.map((a, i) => ({
  id: a[0],
  name: a[1],
  short: a[2],
  cat: a[3],
  opt: a[4],
  sizes: a[5],
  prices: a[6],
  was: a[7],
  def: a[8],
  tag: a[9],
  rating: a[10],
  reviews: a[11],
  stock: a[12],
  desc: a[13],
  specs: a[14],
  img: PHOTO[a[0]],
  sku: 'IB-' + String(1040 + i * 17),
  active: true,
}));

export const HERO: HeroSlide[] = [
  { eyebrow: 'Iron season · ends Sun', title: 'Up to 30% off plates', cta: 'Shop plates', cat: 'Barbells & Plates', img: BANNER.hero1 },
  { eyebrow: 'New drop', title: 'Competition kettlebells', cta: 'View', product: 'kb', img: BANNER.hero2 },
  { eyebrow: 'Home gym bundle', title: 'Rack, bar & plates', cta: 'Build yours', cat: 'Racks & Benches', img: BANNER.hero3 },
];

export const TRENDING_IDS = ['hex', 'kb', 'plates', 'rack', 'whey', 'bands'];

export const ONBOARDING = [
  { img: BANNER.splash, eb: 'Home & pro gym equipment', l0: 'Lift heavier.', l1: 'Buy smarter.', sub: 'Dumbbells to power racks — 300+ pieces, tested by coaches before they reach you.' },
  { img: BANNER.hero3, eb: 'White-glove delivery', l0: 'Heavy gear.', l1: 'Zero hassle.', sub: 'Racks, benches and cardio delivered to the room you train in, assembled by pros.' },
  { img: BANNER.hero1, eb: 'Live order tracking', l0: 'Order it.', l1: 'Lift it.', sub: 'Follow every order from our warehouse to your floor. 30-day returns, no questions.' },
];

/** The signed-in shopper is customer c1 in the seed data. */
export const ME = 'c1';

export const CUSTOMERS: Customer[] = (
  [
    ['c1', 'Sam Rivera', 'sam.rivera@mail.com', 'Brooklyn, NY', 'VIP'],
    ['c2', 'Jordan Lee', 'jordan.lee@mail.com', 'Austin, TX', 'Active'],
    ['c3', 'Sofia Ramirez', 'sofia.r@mail.com', 'Miami, FL', 'Active'],
    ['c4', 'Ethan Brooks', 'ethan.b@mail.com', 'Seattle, WA', 'VIP'],
    ['c5', 'Maya Chen', 'maya.chen@mail.com', 'San Jose, CA', 'New'],
    ['c6', 'Liam Carter', 'liam.c@mail.com', 'Denver, CO', 'Active'],
    ['c7', 'Ava Patel', 'ava.patel@mail.com', 'Chicago, IL', 'Active'],
    ['c8', 'Noah Kim', 'noah.kim@mail.com', 'Portland, OR', 'New'],
  ] as const
).map(([id, name, email, city, tier]) => ({ id, name, email, city, tier }));

type OrderRow = [string, string, string, OrderStep, [string, number, number][], 'std' | 'exp', string, string[]];

const ORDER_ROWS: OrderRow[] = [
  ['IB-20418', 'c5', 'Sep 29', 0, [['kb', 2, 1]], 'exp', 'Apple Pay', ['Sep 29, 10:12']],
  ['IB-20411', 'c2', 'Sep 29', 1, [['hex', 3, 1], ['bands', 3, 1]], 'std', 'Visa •••• 4417', ['Sep 29, 08:40', 'Sep 29, 15:10']],
  ['IB-20404', 'c8', 'Sep 28', 2, [['belt', 1, 1]], 'std', 'PayPal', ['Sep 28, 11:02', 'Sep 28, 17:30', 'Sep 29, 07:15']],
  ['IB-20397', 'c4', 'Sep 28', 2, [['rack', 0, 1], ['bar', 1, 1]], 'std', 'Amex •••• 3005', ['Sep 28, 09:20', 'Sep 28, 16:05', 'Sep 30, 06:40']],
  ['IB-20384', 'c7', 'Sep 25', 3, [['bike', 0, 1]], 'exp', 'Visa •••• 9012', ['Sep 25, 12:00', 'Sep 25, 18:30', 'Sep 26, 07:10', 'Sep 26, 11:45']],
  ['IB-20391', 'c1', 'Sep 24', 3, [['plates', 1, 1], ['whey', 0, 1], ['creatine', 1, 1]], 'std', 'Visa •••• 4242', ['Sep 24, 10:12', 'Sep 24, 17:40', 'Sep 27, 08:05', 'Sep 27, 14:22']],
  ['IB-20377', 'c3', 'Sep 22', 3, [['gloves', 2, 1], ['bands', 0, 2]], 'std', 'PayPal', ['Sep 22, 14:30', 'Sep 23, 09:00', 'Sep 25, 07:50', 'Sep 25, 13:10']],
  ['IB-20370', 'c6', 'Sep 20', 4, [['rower', 0, 1]], 'std', 'Visa •••• 5521', ['Sep 20, 09:00']],
];

export const SEED_ORDERS: Order[] = ORDER_ROWS.map((o) => ({
  no: o[0],
  cid: o[1],
  date: o[2],
  step: o[3],
  items: o[4].map(([id, s, q]) => ({ id, s, q })),
  ship: o[5],
  pay: o[6],
  times: o[7],
  etaShort: o[3] >= 3 ? (o[7][3] ?? o[2]) : 'Oct 3',
}));

export const STATUS = ['Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled'] as const;
export const STEPS = ['Order confirmed', 'Packed at warehouse', 'Out for delivery', 'Delivered'] as const;
export const STEP_ICONS = ['check', 'inventory_2', 'local_shipping', 'home'] as const;
export const WEEK: [string, number][] = [
  ['Thu', 1240],
  ['Fri', 2310],
  ['Sat', 3120],
  ['Sun', 1870],
  ['Mon', 980],
  ['Tue', 2640],
  ['Wed', 2210],
];

export const STAFF = [
  ['Sam Rivera', 'Owner', 'Online now'],
  ['Priya Nair', 'Admin', '2 h ago'],
  ['Diego Alvarez', 'Fulfillment', 'Yesterday'],
  ['Hannah Wolfe', 'Support', '3 days ago'],
] as const;

export const ZONES = ['US', 'Canada', 'UK', 'EU', 'Australia'] as const;

export const SUPPORT_EMAIL = 'support@ironbuild.example';
