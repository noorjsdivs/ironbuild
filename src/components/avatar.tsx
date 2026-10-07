import { Text, View } from 'react-native';

import { font } from '@/theme/fonts';
import { useTheme } from '@/theme/use-theme';

import { Photo } from './blocks';

/** Rounded-square accent avatar with initial, or the user's photo. */
export function Avatar({ name, photo, size = 64, radius = 22 }: { name?: string; photo?: string; size?: number; radius?: number }) {
  const { c } = useTheme();
  return (
    <View
      accessibilityRole="image"
      accessibilityLabel={name ? `${name} avatar` : 'Guest'}
      style={{ width: size, height: size, borderRadius: radius, backgroundColor: c.accent, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      {photo ? (
        <Photo uri={photo} style={{ width: '100%', height: '100%' }} />
      ) : (
        <Text style={[font.num(800, size * 0.4), { color: c.accentInk }]}>{name ? name.trim()[0]?.toUpperCase() : '?'}</Text>
      )}
    </View>
  );
}
