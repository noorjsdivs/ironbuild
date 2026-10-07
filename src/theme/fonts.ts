import { BarlowCondensed_600SemiBold } from '@expo-google-fonts/barlow-condensed/600SemiBold';
import { BarlowCondensed_700Bold } from '@expo-google-fonts/barlow-condensed/700Bold';
import { BarlowCondensed_800ExtraBold } from '@expo-google-fonts/barlow-condensed/800ExtraBold';
import { DMSans_400Regular } from '@expo-google-fonts/dm-sans/400Regular';
import { DMSans_500Medium } from '@expo-google-fonts/dm-sans/500Medium';
import { DMSans_600SemiBold } from '@expo-google-fonts/dm-sans/600SemiBold';
import { DMSans_700Bold } from '@expo-google-fonts/dm-sans/700Bold';
import { JetBrainsMono_500Medium } from '@expo-google-fonts/jetbrains-mono/500Medium';
import { JetBrainsMono_600SemiBold } from '@expo-google-fonts/jetbrains-mono/600SemiBold';
import { JetBrainsMono_700Bold } from '@expo-google-fonts/jetbrains-mono/700Bold';
import { Platform, type TextStyle } from 'react-native';

/** Every font file the app needs; passed to `useFonts` in the root layout. */
export const FONT_ASSETS = {
  BarlowCondensed_600SemiBold,
  BarlowCondensed_700Bold,
  BarlowCondensed_800ExtraBold,
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_600SemiBold,
  DMSans_700Bold,
  JetBrainsMono_500Medium,
  JetBrainsMono_600SemiBold,
  JetBrainsMono_700Bold,
  MaterialSymbolsRounded: require('@/assets/fonts/MaterialSymbolsRounded.ttf'),
  MaterialSymbolsRoundedFilled: require('@/assets/fonts/MaterialSymbolsRoundedFilled.ttf'),
};

const FAMILY = {
  display: {
    600: 'BarlowCondensed_600SemiBold',
    700: 'BarlowCondensed_700Bold',
    800: 'BarlowCondensed_800ExtraBold',
  },
  body: {
    400: 'DMSans_400Regular',
    500: 'DMSans_500Medium',
    600: 'DMSans_600SemiBold',
    700: 'DMSans_700Bold',
  },
  mono: {
    500: 'JetBrainsMono_500Medium',
    600: 'JetBrainsMono_600SemiBold',
    700: 'JetBrainsMono_700Bold',
  },
} as const;

type Opts = {
  /** Line height as a multiple of size (CSS `font: … 32px/1`). */
  lh?: number;
  /** Letter spacing in em (CSS `letter-spacing:.08em`). */
  ls?: number;
  upper?: boolean;
};

const androidTight: TextStyle = Platform.OS === 'android' ? { includeFontPadding: false } : {};

function build(fontFamily: string, size: number, o: Opts = {}): TextStyle {
  return {
    fontFamily,
    fontSize: size,
    ...(o.lh ? { lineHeight: Math.round(size * o.lh * 10) / 10 } : null),
    ...(o.ls ? { letterSpacing: size * o.ls } : null),
    ...(o.upper ? { textTransform: 'uppercase' } : null),
    ...androidTight,
  };
}

/**
 * Typography helpers mirroring the prototype's three families:
 * Barlow Condensed (display), DM Sans (body), JetBrains Mono (labels/data).
 */
export const font = {
  display: (weight: keyof typeof FAMILY.display, size: number, o: Opts = {}) =>
    build(FAMILY.display[weight], size, { upper: true, lh: 1, ...o }),
  /** Display face without forced uppercase — for prices and numbers. */
  num: (weight: keyof typeof FAMILY.display, size: number, o: Opts = {}) =>
    build(FAMILY.display[weight], size, { lh: 1, ...o }),
  body: (weight: keyof typeof FAMILY.body, size: number, o: Opts = {}) => build(FAMILY.body[weight], size, o),
  mono: (weight: keyof typeof FAMILY.mono, size: number, o: Opts = {}) => build(FAMILY.mono[weight], size, o),
  /** The ubiquitous small uppercase mono eyebrow label. */
  eyebrow: (size = 10.5, ls = 0.08) => build(FAMILY.mono[500], size, { ls, upper: true }),
};
