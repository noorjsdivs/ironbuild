import type { Ref } from 'react';
import { Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { withAlpha } from '@/lib/color';
import { font } from '@/theme/fonts';
import { useTheme } from '@/theme/use-theme';

import { Icon, type IconName } from './icon';
import { PressableScale } from './pressable-scale';
import { Spinner } from './spinner';

type Variant = 'primary' | 'outline' | 'surface' | 'danger';

type Props = {
  ref?: Ref<View>;
  label: string;
  onPress?: () => void;
  variant?: Variant;
  /** 56 (CTA), 54 (sticky bar), 46/44 (inline). */
  height?: number;
  radius?: number;
  icon?: IconName;
  /** Icon after the label instead of before. */
  trailingIcon?: IconName;
  loading?: boolean;
  loadingLabel?: string;
  disabled?: boolean;
  /** Visually dimmed but still pressable (prototype uses opacity .5). */
  dimmed?: boolean;
  glow?: boolean;
  weight?: 600 | 700;
  fontSize?: number;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
};

export function Button({
  ref,
  label,
  onPress,
  variant = 'primary',
  height = 56,
  radius = 18,
  icon,
  trailingIcon,
  loading,
  loadingLabel,
  disabled,
  dimmed,
  glow,
  weight = 700,
  fontSize = 15,
  style,
  accessibilityLabel,
}: Props) {
  const { c } = useTheme();
  const fg = variant === 'primary' ? c.accentInk : variant === 'danger' ? c.err : c.text1;
  const bg = variant === 'primary' ? c.accent : variant === 'surface' ? c.surface1 : 'transparent';
  const border = variant === 'primary' ? undefined : { borderWidth: 1, borderColor: c.lineStrong };

  return (
    <PressableScale
      ref={ref}
      onPress={loading ? undefined : onPress}
      disabled={disabled}
      scaleTo={0.97}
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: !!disabled || !!dimmed, busy: !!loading }}
      style={[
        {
          height,
          borderRadius: radius,
          backgroundColor: bg,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          paddingHorizontal: 16,
          opacity: dimmed || disabled ? 0.5 : 1,
        },
        border,
        glow && variant === 'primary'
          ? { boxShadow: `0 10px 30px ${withAlpha(c.accent, 0.35)}` }
          : null,
        style,
      ]}>
      {loading ? <Spinner color={fg} /> : icon ? <Icon name={icon} size={20} color={fg} /> : null}
      <Text style={[font.body(weight === 700 ? 700 : 600, fontSize), { color: fg }]} numberOfLines={1}>
        {loading && loadingLabel ? loadingLabel : label}
      </Text>
      {!loading && trailingIcon ? <Icon name={trailingIcon} size={20} color={fg} /> : null}
    </PressableScale>
  );
}
