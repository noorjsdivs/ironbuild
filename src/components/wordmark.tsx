import { Text, type StyleProp, type TextStyle } from 'react-native';

import { font } from '@/theme/fonts';
import { useTheme } from '@/theme/use-theme';

/** IRON + BUILD wordmark; BUILD takes the accent. */
export function Wordmark({ size = 32, color, accent, style }: { size?: number; color?: string; accent?: string; style?: StyleProp<TextStyle> }) {
  const { c } = useTheme();
  return (
    <Text accessibilityRole="header" accessibilityLabel="IRONBUILD" style={[font.display(800, size, { ls: 0.01 }), { color: color ?? c.text1 }, style]}>
      IRON<Text style={{ color: accent ?? c.accentText }}>BUILD</Text>
    </Text>
  );
}
