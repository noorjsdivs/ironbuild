import type { Category, Product } from './types';

/**
 * Long-form product content (PDP). Kept separate from the catalog rows so
 * list screens stay light; in production this is a per-product API call.
 */
export type ProductDetail = {
  highlights: string[];
  inBox: string[];
  specs: [string, string][];
  warranty: string;
  care: string;
  /** Eligible for white-glove assembly. */
  assembly?: boolean;
  /** Apparel-style sizing → shows a size guide. */
  sizeGuide?: [string, string][];
  /** Product ids frequently bought together. */
  pairs: string[];
};

const D: Record<string, ProductDetail> = {
  hex: {
    highlights: ['Anti-roll hex heads protect floors and keep sets tidy', 'Knurled chrome handle with a 32 mm grip', 'Odour-reduced virgin rubber, no flaking', 'Sold in matched pairs, ±2% accuracy'],
    inBox: ['2 × hex dumbbells (selected weight)', 'Care card'],
    specs: [['Head', 'Cast iron, rubber encased'], ['Handle', 'Chrome steel, medium knurl'], ['Handle Ø', '32 mm'], ['Accuracy', '±2% per pair'], ['Weights', '5–25 kg'], ['Finish', 'Matte black, white numerals']],
    warranty: '10-year structural warranty against cracking or loose heads.',
    care: 'Wipe with a damp cloth after use. Avoid solvent cleaners on the rubber.',
    pairs: ['bench', 'gloves'],
  },
  kb: {
    highlights: ['Identical 33 cm height at every weight', 'Colour-coded to international competition standard', 'Single-cast steel, no seams or welds', 'Smooth 35 mm handle built for high-rep sets'],
    inBox: ['1 × competition kettlebell', 'Protective base pad'],
    specs: [['Body', 'Single-cast steel'], ['Height', '33 cm at every weight'], ['Handle Ø', '35 mm'], ['Base', 'Flat, 210 mm'], ['Coating', 'Powder coat, colour-coded'], ['Weights', '8–32 kg']],
    warranty: 'Lifetime warranty against casting defects.',
    care: 'Store dry. Chalk residue wipes off with a stiff brush.',
    pairs: ['bands', 'gloves'],
  },
  bar: {
    highlights: ['190k PSI tensile shaft, built to stay straight', 'Needle-bearing sleeves for quiet, fast spin', 'Dual knurl marks for power and Olympic lifts', 'Hard-chrome sleeves resist scratches and rust'],
    inBox: ['1 × Olympic barbell', '2 × spring collars'],
    specs: [['Tensile', '190,000 PSI'], ['Shaft Ø', '28 mm (20 kg) · 25 mm (15 kg)'], ['Length', '2.2 m / 2.01 m'], ['Sleeves', 'Needle bearing, hard chrome'], ['Knurl', 'Medium, dual marks, no centre'], ['Load', 'Up to 680 kg']],
    warranty: 'Lifetime warranty against bending under normal use.',
    care: 'Brush the knurl monthly and oil the sleeves with 3-in-1 oil every few months.',
    pairs: ['plates', 'rack'],
  },
  plates: {
    highlights: ['Virgin rubber bumpers with low dead-bounce', 'Stainless steel hub fits every 50 mm sleeve', '±1% weight accuracy, calibrated per plate', 'Full-size 450 mm diameter for floor pulls'],
    inBox: ['Bumper plates in pairs (selected set)', 'Weight breakdown card'],
    specs: [['Material', 'Virgin rubber'], ['Hub', 'Stainless steel, 50.4 mm'], ['Diameter', '450 mm'], ['Accuracy', '±1%'], ['Durometer', '88 Shore A'], ['Set 100 kg', '2×5, 2×10, 2×15, 2×20']],
    warranty: '5-year warranty against hub separation or cracking.',
    care: 'Drop from overhead onto a platform or rubber flooring only.',
    pairs: ['bar', 'rack'],
  },
  bench: {
    highlights: ['Flat, incline and decline in one frame', '7 back positions and 3 seat positions', 'Zero-wobble stance, rated to 350 kg', 'Front wheels and rear handle for easy moving'],
    inBox: ['Bench frame', 'Back and seat pads', 'Leg-hold attachment', 'Hardware & tools'],
    specs: [['Positions', '7 back · 3 seat'], ['Capacity', '350 kg'], ['Pad', '65 mm high-density foam'], ['Footprint', '1.4 × 0.65 m'], ['Height', '43 cm flat'], ['Weight', '28 kg']],
    warranty: '10-year frame, 2-year upholstery.',
    care: 'Clean pads with mild soap. Check bolts every three months.',
    assembly: true,
    pairs: ['hex', 'rack'],
  },
  rack: {
    highlights: ['11-gauge steel uprights with numbered holes', 'Pull-up bar and safety spotter arms included', 'Westside 2" hole spacing through the bench zone', 'Bolt-down or free-standing installation'],
    inBox: ['Rack frame', '2 × J-cups', '2 × safety arms', 'Pull-up bar', 'Hardware & instructions'],
    specs: [['Steel', '11-gauge, 75 × 75 mm'], ['Height', '2.1 m / 2.3 m'], ['Footprint', '1.2 × 1.3 m'], ['Capacity', '450 kg'], ['Hole spacing', '50 mm (Westside)'], ['Weight', '96 kg']],
    warranty: 'Lifetime frame warranty.',
    care: 'Touch up chips with the included paint pen to prevent rust.',
    assembly: true,
    pairs: ['bar', 'plates'],
  },
  bike: {
    highlights: ['Unlimited fan resistance that scales with effort', 'Moving handles for full-body conditioning', 'Console tracks watts, RPM, calories and intervals', 'Wind guard keeps airflow off your face'],
    inBox: ['Air bike', 'Console & batteries', 'Wind guard', 'Hardware'],
    specs: [['Resistance', 'Air fan, unlimited'], ['Max user', '160 kg'], ['Console', 'Watts · RPM · intervals'], ['Footprint', '1.3 × 0.7 m'], ['Seat', '4-way adjustable'], ['Weight', '59 kg']],
    warranty: '5-year frame, 2-year parts.',
    care: 'Wipe sweat from the frame after each session. Lube the chain twice a year.',
    assembly: true,
    pairs: ['rower', 'whey'],
  },
  rower: {
    highlights: ['16 levels of silent magnetic resistance', 'Folds upright to under 0.6 m²', 'Smooth aluminium rail with a 1.4 m stroke', 'Bluetooth console pairs with training apps'],
    inBox: ['Rower', 'Console & batteries', 'Phone holder', 'Hardware'],
    specs: [['Resistance', 'Magnetic, 16 levels'], ['Rail', 'Aluminium, 1.4 m'], ['Folded', '0.6 m²'], ['Max user', '150 kg'], ['Console', 'Bluetooth, app-ready'], ['Weight', '38 kg']],
    warranty: '5-year frame, 2-year parts.',
    care: 'Wipe the rail before each session to keep the seat rollers smooth.',
    assembly: true,
    pairs: ['bike', 'bands'],
  },
  bands: {
    highlights: ['Layered latex resists snapping and rolling', 'Four resistances from warm-up to banded deadlifts', 'Long 104 cm loop for pull-up assistance', 'Packs into the included mesh bag'],
    inBox: ['Loop band(s) (selected resistance)', 'Mesh carry bag', 'Exercise guide'],
    specs: [['Material', 'Layered natural latex'], ['Length', '104 cm loop'], ['Light', '5–15 kg'], ['Medium', '15–35 kg'], ['Heavy', '25–55 kg'], ['Width', '13–45 mm']],
    warranty: '1-year warranty against snapping under normal use.',
    care: 'Keep out of direct sunlight. Inspect for nicks before heavy use.',
    pairs: ['kb', 'gloves'],
  },
  belt: {
    highlights: ['Single-ply 10 mm leather, competition legal', 'Quick-release steel lever, no fiddly prongs', 'Uniform 10 cm width front to back', 'Breaks in within a few weeks of use'],
    inBox: ['Lever belt (selected size)', 'Lever screwdriver'],
    specs: [['Leather', '10 mm, single ply'], ['Width', '10 cm'], ['Buckle', 'Steel lever'], ['Suede', 'Both sides'], ['Federations', 'IPF, USAPL approved'], ['Weight', '1.1 kg']],
    warranty: '2-year warranty on stitching and hardware.',
    care: 'Condition the leather twice a year. Let it air dry away from heat.',
    sizeGuide: [['S', '61–76 cm waist'], ['M', '71–86 cm waist'], ['L', '81–102 cm waist'], ['XL', '97–117 cm waist']],
    pairs: ['bar', 'gloves'],
  },
  gloves: {
    highlights: ['Silicone palm grip that works with or without chalk', 'Half-finger cut keeps feel on the bar', 'Wrap wrist strap for extra support', 'Machine washable, quick drying'],
    inBox: ['1 pair lifting gloves (selected size)'],
    specs: [['Palm', 'Silicone print'], ['Back', 'Breathable mesh'], ['Wrist', 'Wrap strap, hook & loop'], ['Cut', 'Half finger'], ['Care', 'Machine wash 30°C'], ['Weight', '90 g']],
    warranty: '6-month warranty against seam failure.',
    care: 'Machine wash cold, fasten straps first, air dry.',
    sizeGuide: [['S', '17–19 cm hand'], ['M', '19–21 cm hand'], ['L', '21–23 cm hand'], ['XL', '23–25 cm hand']],
    pairs: ['belt', 'bands'],
  },
  whey: {
    highlights: ['27 g protein and under 1 g sugar per scoop', 'Cold-filtered isolate, mixes clean with a shaker', 'Third-party tested for every batch', 'No artificial colours or fillers'],
    inBox: ['2 kg resealable pouch', 'Measuring scoop'],
    specs: [['Protein', '27 g / serving'], ['Calories', '110 kcal'], ['Sugar', '< 1 g'], ['Servings', '66'], ['Source', 'Grass-fed milk isolate'], ['Testing', 'Batch-tested, Informed Sport']],
    warranty: 'Satisfaction guarantee: return unopened within 30 days.',
    care: 'Store sealed in a cool, dry place. Best before printed on the pouch.',
    pairs: ['creatine', 'bands'],
  },
  creatine: {
    highlights: ['Pure micronised creatine monohydrate', 'Unflavoured, dissolves fully in water', '5 g daily dose, no loading phase needed', 'Batch-tested for purity'],
    inBox: ['Tub (selected size)', 'Measuring scoop'],
    specs: [['Form', 'Micronised monohydrate'], ['Dose', '5 g'], ['Servings', '60 / 100'], ['Flavour', 'Unflavoured'], ['Additives', 'None'], ['Testing', 'Batch-tested']],
    warranty: 'Satisfaction guarantee: return unopened within 30 days.',
    care: 'Keep the lid closed to avoid clumping.',
    pairs: ['whey', 'gloves'],
  },
};

const FALLBACK: ProductDetail = {
  highlights: ['Tested by IRONBUILD coaches before release', 'Backed by our 30-day return promise', 'Ships from our Brooklyn warehouse'],
  inBox: ['Product as pictured'],
  specs: [],
  warranty: '1-year limited warranty.',
  care: 'Follow the care card included with your order.',
  pairs: [],
};

export function detailsFor(p: Product): ProductDetail {
  const d = D[p.id];
  if (d) return d;
  return { ...FALLBACK, specs: p.specs };
}

/* ───────────────────────── Reviews ───────────────────────── */

export type ProductReview = { name: string; rating: number; date: string; title: string; text: string; size?: string };

const REVIEW_POOL: Record<Category | 'default', ProductReview[]> = {
  Dumbbells: [
    { name: 'Marcus T.', rating: 5, date: 'Sep 30', title: 'No more rolling', text: 'Finally dumbbells that stay put between sets. Knurl is grippy without tearing hands.' },
    { name: 'Lena K.', rating: 5, date: 'Sep 21', title: 'Accurate and solid', text: 'Weighed both on a kitchen scale, within 30 g of each other. Zero smell out of the box.' },
    { name: 'Chris D.', rating: 4, date: 'Sep 12', title: 'Great, just heavy shipping', text: 'Box arrived a bit beaten up but the bells were perfect. Would buy the next pair.' },
  ],
  Kettlebells: [
    { name: 'Maya C.', rating: 5, date: 'Sep 28', title: 'Rack position never changes', text: 'Moving from 16 to 24 kg felt seamless because the bell is the same size. Finish is perfect.' },
    { name: 'Owen R.', rating: 5, date: 'Sep 17', title: 'Comp quality', text: 'Same bells we use at my gym for a lot less. Handle is smooth enough for snatches.' },
    { name: 'Tara S.', rating: 4, date: 'Sep 2', title: 'Love it', text: 'Paint chipped slightly on concrete. Use a mat and it is flawless.' },
  ],
  'Barbells & Plates': [
    { name: 'Ethan B.', rating: 5, date: 'Sep 26', title: 'Quiet and true', text: 'Bumpers are quiet on my apartment floor and every plate fits snug on the bar.' },
    { name: 'Rafael M.', rating: 5, date: 'Sep 19', title: 'Spins like a dream', text: 'The bar spins fast for cleans and the knurl is just right. Zero whip issues at 200 kg.' },
    { name: 'Jess W.', rating: 4, date: 'Sep 8', title: 'Solid set', text: 'Rubber smell faded in a week. Would love a 2.5 kg pair included.' },
  ],
  'Racks & Benches': [
    { name: 'Jordan L.', rating: 5, date: 'Sep 29', title: 'Built like a tank', text: 'Delivered to my garage and assembled in under an hour by the crew. Rock solid at 180 kg.' },
    { name: 'Nia P.', rating: 5, date: 'Sep 15', title: 'Every hole numbered', text: 'Setting safeties is so easy with the numbered holes. Pull-up bar is a great bonus.' },
    { name: 'Ben H.', rating: 4, date: 'Sep 4', title: 'Measure your ceiling', text: 'Fantastic rack, just make sure you check clearance for the 2.3 m version.' },
  ],
  Cardio: [
    { name: 'Ava P.', rating: 5, date: 'Sep 27', title: 'Brutal in the best way', text: 'Ten minutes on this and I am done. Console is simple and the intervals mode is great.' },
    { name: 'Leo G.', rating: 4, date: 'Sep 14', title: 'Loud fan, great workout', text: 'The fan is loud as expected. Assembly service saved me an afternoon.' },
    { name: 'Sara N.', rating: 5, date: 'Sep 3', title: 'Folds away', text: 'Fits in the corner of my flat when folded. Smooth and silent.' },
  ],
  Bands: [
    { name: 'Kim J.', rating: 5, date: 'Sep 24', title: 'Pull-up game changer', text: 'Went from zero to five strict pull-ups using the heavy band. No snapping after months.' },
    { name: 'Dev A.', rating: 4, date: 'Sep 11', title: 'Great for warm-ups', text: 'Light band is perfect for shoulder prep. The bag is handy for the gym.' },
  ],
  Accessories: [
    { name: 'Hannah W.', rating: 5, date: 'Sep 25', title: 'Lever is so fast', text: 'On and off between sets in a second. Broke in after about three weeks.' },
    { name: 'Tom F.', rating: 4, date: 'Sep 9', title: 'Size down if between', text: 'Runs a touch large. Quality is excellent otherwise.' },
  ],
  Supplements: [
    { name: 'Ava P.', rating: 5, date: 'Sep 30', title: 'Tastes like real chocolate', text: 'Mixes clean with just a shaker and no chalky aftertaste.' },
    { name: 'Noah K.', rating: 5, date: 'Sep 18', title: 'Simple and clean', text: 'Exactly what it says on the label. Dissolves fully in water.' },
    { name: 'Priya R.', rating: 4, date: 'Sep 6', title: 'Good value', text: 'Lasts me over two months. Would love a smaller trial size.' },
  ],
  default: [{ name: 'IRONBUILD member', rating: 5, date: 'Oct 1', title: 'Great gear', text: 'Exactly as described and arrived fast.' }],
};

export function reviewsFor(p: Product): ProductReview[] {
  return REVIEW_POOL[p.cat] ?? REVIEW_POOL.default;
}

/** Star distribution (5★ → 1★, percentages) derived from the average rating. */
export function ratingBreakdown(rating: number): number[] {
  const p5 = Math.round(Math.min(95, Math.max(30, 40 + (rating - 4) * 55)));
  const p4 = Math.round((100 - p5) * 0.6);
  const p3 = Math.round((100 - p5 - p4) * 0.6);
  const p2 = Math.round((100 - p5 - p4 - p3) * 0.5);
  return [p5, p4, p3, p2, Math.max(0, 100 - p5 - p4 - p3 - p2)];
}
