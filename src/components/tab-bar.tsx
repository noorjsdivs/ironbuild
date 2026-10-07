import { LinearGradient } from 'expo-linear-gradient';
import { usePathname } from 'expo-router';
import { TabTrigger, type TabTriggerSlotProps } from 'expo-router/ui';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { measure } from '@/hooks/use-add-to-cart';
import { firstName } from '@/lib/format';
import { useApp, useCartCount } from '@/store/app-store';
import { useUI } from '@/store/ui-store';
import { font } from '@/theme/fonts';
import { EASE_SPRING } from '@/theme/motion';
import { useMotion, useTheme } from '@/theme/use-theme';

import { Glass } from './glass';
import { Icon, type IconName } from './icon';
import { haptic } from './pressable-scale';

export type TabItem = {
  name: string;
  label: string;
  icon: IconName;
  /** Route prefixes that keep this tab active. */
  match: (path: string) => boolean;
};

type ButtonProps = TabTriggerSlotProps & { item: TabItem; children?: ReactNode };

function TabButton({ item, isFocused, children, onPress, ...rest }: ButtonProps) {
  const { c } = useTheme();
  return (
    <Pressable
      {...rest}
      accessibilityRole="tab"
      accessibilityLabel={item.label}
      accessibilityState={{ selected: isFocused }}
      onPress={(e) => {
        if (!isFocused) haptic('selection');
        onPress?.(e);
      }}
      style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 4 }}>
      {children}
      <Text numberOfLines={1} style={[font.body(600, 10.5, { ls: 0.01 }), { color: isFocused ? c.accentText : c.text2 }]}>
        {item.label}
      </Text>
    </Pressable>
  );
}

function CountBadge({ count, inverse }: { count: number; inverse?: boolean }) {
  const { c } = useTheme();
  const { ms } = useMotion();
  const bump = useUI((s) => s.cartBump);
  const scale = useSharedValue(1);
  useEffect(() => {
    if (!bump || inverse) return;
    scale.set(withSequence(withTiming(1.45, { duration: ms(120) }), withTiming(1, { duration: ms(300), easing: EASE_SPRING })));
  }, [bump, inverse, scale, ms]);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: scale.get() }] }));
  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          top: -6,
          right: -10,
          minWidth: 18,
          height: 18,
          paddingHorizontal: 4,
          borderRadius: 9,
          backgroundColor: inverse ? c.text1 : c.accent,
          alignItems: 'center',
          justifyContent: 'center',
        },
        anim,
      ]}>
      <Text style={[font.mono(700, 9.5), { color: inverse ? c.bg : c.accentInk }]}>{count}</Text>
    </Animated.View>
  );
}

/** The cart icon reports its window position so fly-to-cart can aim at it. */
function CartIcon({ focused }: { focused: boolean }) {
  const { c } = useTheme();
  const count = useCartCount();
  const ref = useRef<View>(null);
  const setTarget = useUI((s) => s.setCartTarget);
  return (
    <View
      ref={ref}
      onLayout={() => {
        // Wait a frame so the bar's entrance transform has settled.
        requestAnimationFrame(() => void measure(ref.current).then((r) => r && setTarget(r)));
      }}>
      <Icon name="shopping_cart" size={24} filled={focused} color={focused ? c.accentText : c.text2} />
      {count > 0 ? <CountBadge count={count} /> : null}
    </View>
  );
}

function ProfileIcon({ focused }: { focused: boolean }) {
  const { c } = useTheme();
  const user = useApp((s) => s.user);
  if (!user) return <Icon name="person" size={24} filled={focused} color={focused ? c.accentText : c.text2} />;
  return (
    <View
      style={{
        width: 26,
        height: 26,
        borderRadius: 13,
        borderWidth: 2,
        borderColor: focused ? c.accent : c.lineStrong,
        backgroundColor: focused ? c.accent : c.surface2,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text style={[font.num(800, 12), { color: focused ? c.accentInk : c.text1 }]}>{user.name.trim()[0]?.toUpperCase()}</Text>
    </View>
  );
}

/**
 * Floating liquid-glass tab bar: 64px pill, inset highlight, and an
 * indicator pill that springs to the active tab.
 */
export function GlassTabBar({ items, variant = 'store', badges }: { items: TabItem[]; variant?: 'store' | 'admin'; badges?: Record<string, number> }) {
  const { c } = useTheme();
  const { ms } = useMotion();
  const insets = useSafeAreaInsets();
  const path = usePathname();
  const user = useApp((s) => s.user);
  const [w, setW] = useState(0);
  const active = Math.max(0, items.findIndex((t) => t.match(path)));
  const itemW = w / items.length;
  const x = useSharedValue(active * itemW);
  useEffect(() => {
    x.set(withTiming(active * itemW, { duration: ms(520), easing: EASE_SPRING }));
  }, [active, itemW, x, ms]);
  const pill = useAnimatedStyle(() => ({ transform: [{ translateX: x.get() }] }));

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: 'absolute',
        left: 14,
        right: 14,
        bottom: Math.max(insets.bottom - 10, 16),
        height: 64,
        borderRadius: 32,
        boxShadow: '0 24px 48px rgba(0,0,0,0.35), 0 2px 8px rgba(0,0,0,0.2)',
      }}>
      <Glass
        tone="nav"
        style={{ flex: 1, borderRadius: 32, borderWidth: 1, borderColor: c.glassLine }}>
        <View
          onLayout={(e) => setW(e.nativeEvent.layout.width)}
          accessibilityRole="tablist"
          style={{ flex: 1, flexDirection: 'row' }}>
          <LinearGradient
            pointerEvents="none"
            colors={['rgba(255,255,255,0.14)', 'rgba(255,255,255,0)', 'rgba(0,0,0,0.08)']}
            locations={[0, 0.45, 1]}
            style={{ position: 'absolute', inset: 0, borderRadius: 32 }}
          />
          {/* inset highlights (CSS inset box-shadows) */}
          <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 24, right: 24, height: 1, backgroundColor: c.navHi }} />
          <View pointerEvents="none" style={{ position: 'absolute', bottom: 0, left: 24, right: 24, height: 1, backgroundColor: c.navLo }} />
          {w > 0 && (
            <Animated.View pointerEvents="none" style={[{ position: 'absolute', top: 0, bottom: 0, left: 0, width: itemW }, pill]}>
              <View
                style={{
                  position: 'absolute',
                  inset: 6,
                  borderRadius: 26,
                  backgroundColor: c.navPill,
                  borderTopWidth: 1,
                  borderTopColor: c.navPillHi,
                  boxShadow: '0 6px 14px rgba(0,0,0,0.18)',
                }}
              />
            </Animated.View>
          )}
          {items.map((item, i) => {
            const focused = i === active;
            const isCart = variant === 'store' && item.name === 'cart';
            const isProfile = variant === 'store' && item.name === 'profile' && !!user;
            const badge = badges?.[item.name] ?? 0;
            return (
              <TabTrigger key={item.name} name={item.name} asChild>
                <TabButton item={isProfile && user ? { ...item, label: firstName(user.name) } : item}>
                  {isCart ? (
                    <CartIcon focused={focused} />
                  ) : isProfile ? (
                    <ProfileIcon focused={focused} />
                  ) : (
                    <View>
                      <Icon name={item.icon} size={24} filled={focused} color={focused ? c.accentText : c.text2} />
                      {badge > 0 ? <CountBadge count={badge} inverse /> : null}
                    </View>
                  )}
                </TabButton>
              </TabTrigger>
            );
          })}
        </View>
      </Glass>
    </View>
  );
}
