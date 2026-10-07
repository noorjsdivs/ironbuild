import { Text, type StyleProp, type TextStyle } from 'react-native';

/**
 * Material Symbols Rounded (wght 500), subset to the glyphs the app uses.
 * Two static instances are bundled: outline (FILL 0) and filled (FILL 1).
 * To add an icon, re-download both fonts with the new name in `icon_names`
 * and add its codepoint here.
 */
const GLYPHS = {
  add: 0xe145,
  arrow_back: 0xe5c4,
  arrow_forward: 0xe5c8,
  assignment_return: 0xe860,
  auto_stories: 0xe666,
  bar_chart: 0xe26b,
  block: 0xe14b,
  bolt: 0xea0b,
  bookmark: 0xe866,
  call: 0xe0b0,
  cancel: 0xe5c9,
  category: 0xe574,
  chat: 0xe0b7,
  check: 0xe5ca,
  check_circle: 0xe86c,
  chevron_right: 0xe409,
  close: 0xe14c,
  credit_card: 0xe870,
  dashboard: 0xe871,
  delete: 0xe872,
  edit: 0xe3c9,
  favorite: 0xe87d,
  fitness_center: 0xeb43,
  format_quote: 0xe244,
  grid_view: 0xe9b0,
  group: 0xe7ef,
  help: 0xe887,
  history: 0xe28e,
  home: 0xe88a,
  inbox: 0xe156,
  info: 0xe88e,
  inventory_2: 0xe1a1,
  ios_share: 0xe6b8,
  language: 0xe894,
  lightbulb: 0xe0f0,
  local_fire_department: 0xef55,
  local_shipping: 0xe558,
  location_on: 0xe0c8,
  lock: 0xe897,
  lock_reset: 0xeade,
  mail: 0xe158,
  more_horiz: 0xe5d3,
  notifications: 0xe7f4,
  payments: 0xef63,
  pending_actions: 0xf1bb,
  person: 0xe7fd,
  phone_iphone: 0xe325,
  quiz: 0xf04c,
  receipt_long: 0xef6e,
  remove: 0xe15b,
  schedule: 0xe8b5,
  search: 0xe8b6,
  sell: 0xf05b,
  settings: 0xe8b8,
  shopping_bag: 0xf1cc,
  shopping_cart: 0xe8cc,
  star: 0xe838,
  tune: 0xe429,
  verified: 0xef76,
  warehouse: 0xebb8,
  work: 0xe8f9,
} as const;

export type IconName = keyof typeof GLYPHS;

type Props = {
  name: IconName;
  size?: number;
  color?: string;
  filled?: boolean;
  style?: StyleProp<TextStyle>;
};

export function Icon({ name, size = 24, color, filled = false, style }: Props) {
  return (
    <Text
      accessible={false}
      allowFontScaling={false}
      style={[
        {
          fontFamily: filled ? 'MaterialSymbolsRoundedFilled' : 'MaterialSymbolsRounded',
          fontSize: size,
          lineHeight: size,
          width: size,
          height: size,
          textAlign: 'center',
          includeFontPadding: false,
          color,
        },
        style,
      ]}>
      {String.fromCodePoint(GLYPHS[name])}
    </Text>
  );
}
