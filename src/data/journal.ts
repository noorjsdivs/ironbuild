import { BANNER, PHOTO } from './catalog';

export type JournalCategory = 'Training' | 'Nutrition' | 'Gear guides' | 'Recovery';

export const JOURNAL_CATS: JournalCategory[] = ['Training', 'Gear guides', 'Nutrition', 'Recovery'];

export type ArticleBlock =
  | { type: 'p'; text: string }
  | { type: 'h'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'tip'; title: string; text: string }
  | { type: 'quote'; text: string; by: string }
  | { type: 'product'; id: string };

export type Article = {
  id: string;
  title: string;
  cat: JournalCategory;
  excerpt: string;
  author: { name: string; role: string };
  date: string;
  mins: number;
  img: string;
  featured?: boolean;
  body: ArticleBlock[];
};

/**
 * Training Journal content. In production this comes from a CMS;
 * blocks keep the renderer simple and let editors embed products.
 */
export const ARTICLES: Article[] = [
  {
    id: 'home-gym-under-2k',
    title: 'Build a complete home gym for under $2,000',
    cat: 'Gear guides',
    excerpt: 'The five pieces that cover 90% of strength training, and the order to buy them in.',
    author: { name: 'Priya Nair', role: 'Head of product' },
    date: 'Oct 4',
    mins: 7,
    img: BANNER.hero3,
    featured: true,
    body: [
      { type: 'p', text: 'Most home gyms fail for one of two reasons: they are built around a machine that only does one thing, or they are bought all at once and never fit the space. Start with versatile free weights and add pieces as your training demands it.' },
      { type: 'h', text: 'The core five' },
      { type: 'list', items: ['Power rack with safeties: your spotter when you train alone', 'Olympic barbell: the single most useful piece you will own', 'Bumper plates: quiet, floor-friendly and droppable', 'Adjustable bench: flat, incline and decline in one footprint', 'A pair of adjustable or hex dumbbells for accessory work'] },
      { type: 'product', id: 'rack' },
      { type: 'tip', title: 'Measure twice', text: 'Allow 30 cm of clearance above your head at the top of a pull-up, and 60 cm either side of the bar sleeves for loading plates.' },
      { type: 'h', text: 'Buy in this order' },
      { type: 'p', text: 'Bar and plates first: you can deadlift, row, clean and press from the floor on day one. Add the rack when you are ready to squat and bench heavy, then the bench. Dumbbells come last because a loaded barbell covers most of the same patterns.' },
      { type: 'product', id: 'plates' },
      { type: 'quote', text: 'A rack, a bar and 100 kg of bumpers will take a beginner further than any machine ever built.', by: 'Diego Alvarez, strength coach' },
    ],
  },
  {
    id: 'progressive-overload',
    title: 'Progressive overload, explained without the jargon',
    cat: 'Training',
    excerpt: 'Why adding a little every week beats chasing a max, and four ways to progress that are not more weight.',
    author: { name: 'Diego Alvarez', role: 'Strength coach' },
    date: 'Oct 1',
    mins: 5,
    img: BANNER.hero1,
    body: [
      { type: 'p', text: 'Your body adapts to exactly the stress you give it, and then stops. Progressive overload is simply the habit of asking for a little more over time so adaptation never stalls.' },
      { type: 'h', text: 'Four levers you can pull' },
      { type: 'list', items: ['Load: add 1–2.5 kg when you hit the top of your rep range', 'Reps: same weight, one more rep per set', 'Sets: add a set every week or two, then reset', 'Quality: slower eccentrics, longer pauses, cleaner range of motion'] },
      { type: 'tip', title: 'The two-rep rule', text: 'If you can do two more reps than your target on the last set for two sessions in a row, it is time to add weight.' },
      { type: 'product', id: 'bar' },
      { type: 'p', text: 'Log every session. Progress you cannot see is progress you will not trust, and a simple notebook is enough.' },
    ],
  },
  {
    id: 'kettlebell-starter',
    title: 'The 20-minute kettlebell session for busy weeks',
    cat: 'Training',
    excerpt: 'One bell, five movements, no excuses. A full-body circuit you can run in the living room.',
    author: { name: 'Hannah Wolfe', role: 'Coach & member support' },
    date: 'Sep 27',
    mins: 4,
    img: BANNER.hero2,
    body: [
      { type: 'p', text: 'When time is short, density wins. This circuit uses a single competition kettlebell and keeps rest short enough to double as conditioning.' },
      { type: 'h', text: 'The circuit, 4 rounds' },
      { type: 'list', items: ['10 two-hand swings', '5 goblet squats', '5 presses each arm', '8 bent-over rows each arm', '30 seconds rest'] },
      { type: 'product', id: 'kb' },
      { type: 'tip', title: 'Pick the right bell', text: 'Most women start with 12 kg and most men with 16 kg. Size up when every round of swings feels snappy.' },
    ],
  },
  {
    id: 'protein-timing',
    title: 'Protein timing matters less than you think',
    cat: 'Nutrition',
    excerpt: 'Total daily intake drives results. Here is how much you need and the easiest ways to hit it.',
    author: { name: 'Sam Rivera', role: 'Founder' },
    date: 'Sep 22',
    mins: 6,
    img: PHOTO.whey,
    body: [
      { type: 'p', text: 'The anabolic window is wider than the internet suggests. For most lifters, getting enough protein across the day matters far more than drinking a shake within minutes of training.' },
      { type: 'h', text: 'How much is enough' },
      { type: 'p', text: 'Aim for roughly 1.6–2.2 g per kilogram of bodyweight, split over three to five meals. A 80 kg lifter needs around 130–175 g a day.' },
      { type: 'list', items: ['Anchor every meal with a palm-sized protein source', 'Keep a shake for days when meals fall short', 'Add creatine: 5 g daily, any time, every day'] },
      { type: 'product', id: 'whey' },
      { type: 'product', id: 'creatine' },
    ],
  },
  {
    id: 'deload-week',
    title: 'Why your best lifters schedule a deload',
    cat: 'Recovery',
    excerpt: 'Planned easy weeks keep joints happy and progress moving. When to take one, and what to do.',
    author: { name: 'Diego Alvarez', role: 'Strength coach' },
    date: 'Sep 18',
    mins: 5,
    img: BANNER.verify,
    body: [
      { type: 'p', text: 'Fatigue builds faster than fitness shows. A deload, a week at reduced volume, lets the two catch up so you come back stronger instead of grinding into a plateau.' },
      { type: 'h', text: 'Signs you need one' },
      { type: 'list', items: ['Warm-ups feel heavy for a week or more', 'Sleep or appetite drops off', 'Nagging aches that do not settle between sessions'] },
      { type: 'tip', title: 'Keep the pattern, drop the volume', text: 'Train the same lifts at the same weight but halve the sets. You keep the skill without the fatigue.' },
      { type: 'product', id: 'bands' },
    ],
  },
  {
    id: 'lifting-belt-guide',
    title: 'Do you actually need a lifting belt?',
    cat: 'Gear guides',
    excerpt: 'What a belt does, when to start wearing one, and how to brace properly with it.',
    author: { name: 'Priya Nair', role: 'Head of product' },
    date: 'Sep 12',
    mins: 4,
    img: BANNER.login,
    body: [
      { type: 'p', text: 'A belt does not hold your back together. It gives your abdominal wall something to push against so you can create more pressure, and more pressure means a stiffer, stronger trunk under load.' },
      { type: 'h', text: 'When to start' },
      { type: 'p', text: 'Learn to brace without one first. Once your squat and deadlift top sets are near bodyweight or above, a belt becomes a useful tool for your heaviest work.' },
      { type: 'product', id: 'belt' },
      { type: 'quote', text: 'Breathe into the belt, not under it. Fill 360 degrees, then lift.', by: 'Hannah Wolfe' },
    ],
  },
];

export const REVIEWS = [
  { name: 'Jordan L.', city: 'Austin, TX', rating: 5, product: 'Power Rack', text: 'Delivered to my garage and assembled in under an hour. Rock solid at 180 kg.' },
  { name: 'Maya C.', city: 'San Jose, CA', rating: 5, product: 'Comp Kettlebell', text: 'Same handle at every weight was the reason I switched. Finish is perfect.' },
  { name: 'Ethan B.', city: 'Seattle, WA', rating: 4, product: 'Bumper Plates', text: 'Quiet on my apartment floor and the hub fits snug on every bar I own.' },
  { name: 'Ava P.', city: 'Chicago, IL', rating: 5, product: 'Whey Isolate', text: 'Mixes clean, tastes like actual chocolate. Tracking the order was a nice touch.' },
];

export const PERKS = [
  { icon: 'local_shipping', title: 'Free delivery', sub: 'On orders over $150' },
  { icon: 'assignment_return', title: '30-day returns', sub: 'No questions asked' },
  { icon: 'fitness_center', title: 'Pro assembly', sub: 'Racks & cardio' },
  { icon: 'star', title: '4.8 rated', sub: '12k+ reviews' },
] as const;

/** Featured "Deal of the day" product and its claimed progress. */
export const DEAL = { id: 'plates', claimed: 68 };
