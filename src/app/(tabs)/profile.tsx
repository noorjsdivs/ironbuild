import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useShallow } from 'zustand/react/shallow';

import { Avatar } from '@/components/avatar';
import { Card, MenuRow, Pill, SectionLabel, ToggleRow } from '@/components/blocks';
import { Button } from '@/components/button';
import { ScreenStatusBar, TABBAR_SPACE, TOP_GAP } from '@/components/chrome';
import { Segmented } from '@/components/controls';
import { Icon } from '@/components/icon';
import { haptic } from '@/components/pressable-scale';
import { ME } from '@/data/catalog';
import { cnt } from '@/lib/format';
import { useApp } from '@/store/app-store';
import { toast } from '@/store/ui-store';
import { font } from '@/theme/fonts';
import { enter } from '@/theme/motion';
import { ACCENT_SWATCHES, type ThemeMode } from '@/theme/tokens';
import { useMotion, useTheme } from '@/theme/use-theme';

export default function ProfileScreen() {
  const { c, mode, accent } = useTheme();
  const { reduced } = useMotion();
  const insets = useSafeAreaInsets();
  const s = useApp(
    useShallow((st) => ({
      user: st.user,
      orders: st.orders,
      addresses: st.addresses,
      defaultAddressId: st.defaultAddressId,
      cards: st.cards,
      defaultCardId: st.defaultCardId,
      notifPrefs: st.notifPrefs,
      savedArticles: st.savedArticles,
      reducedMotion: st.reducedMotion,
      setTheme: st.setTheme,
      setAccent: st.setAccent,
      toggleReducedMotion: st.toggleReducedMotion,
      signOut: st.signOut,
    })),
  );
  const user = s.user;
  const myOrders = s.orders.filter((o) => o.cid === ME);
  const defAddr = s.addresses.find((a) => a.id === s.defaultAddressId) ?? s.addresses[0];
  const defCard = s.cards.find((k) => k.id === s.defaultCardId) ?? s.cards[0];
  const enabled = Object.values(s.notifPrefs).filter(Boolean).length;

  const menu = [
    { href: '/account/edit-profile', icon: 'person', title: 'Edit profile', sub: 'Name, email, phone, password' },
    {
      href: '/account/orders',
      icon: 'receipt_long',
      title: 'My orders',
      sub: myOrders.length ? `${myOrders.filter((o) => o.step < 3).length} in progress` : 'No orders yet',
      badge: myOrders.length ? String(myOrders.length) : undefined,
    },
    { href: '/account/addresses', icon: 'location_on', title: 'Addresses', sub: defAddr ? `${defAddr.l1} · default` : 'No address saved' },
    { href: '/account/payments', icon: 'credit_card', title: 'Payment methods', sub: `${defCard?.num ?? 'No card'} · Apple Pay` },
    {
      href: '/journal',
      icon: 'auto_stories',
      title: 'Training journal',
      sub: s.savedArticles.length ? cnt(s.savedArticles.length, 'saved story', 'saved stories') : 'Programs, gear guides, recovery',
      badge: s.savedArticles.length ? String(s.savedArticles.length) : undefined,
    },
    { href: '/account/notifications', icon: 'notifications', title: 'Notifications', sub: `${enabled} of 4 enabled` },
    { href: '/account/help', icon: 'help', title: 'Help & support', sub: 'FAQ, returns, contact us' },
  ] as const;

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <ScreenStatusBar />
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + TOP_GAP, paddingBottom: TABBAR_SPACE, paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}>
        <Animated.View entering={enter(0, reduced)} style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingTop: 6 }}>
          <Avatar name={user?.name} photo={user?.photo} />
          <View style={{ flex: 1, minWidth: 0, gap: 4 }}>
            <Text numberOfLines={1} style={[font.display(800, 28), { color: c.text1 }]}>
              {user?.name ?? 'Guest'}
            </Text>
            <Text numberOfLines={1} style={[font.mono(500, 10.5, { ls: 0.06, upper: true }), { color: c.text3 }]}>
              {user ? `Member since 2024 · ${user.email}` : 'Not signed in'}
            </Text>
          </View>
          {user ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Edit profile"
              onPress={() => router.push('/account/edit-profile')}
              style={{ width: 44, height: 44, borderRadius: 22, borderWidth: 1, borderColor: c.line, backgroundColor: c.surface1, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="edit" size={20} color={c.text1} />
            </Pressable>
          ) : null}
        </Animated.View>

        {!user ? (
          <Animated.View entering={enter(1, reduced)}>
            <Card radius={20} style={{ marginTop: 20, padding: 16, gap: 12 }}>
              <Text style={[font.body(400, 14, { lh: 1.5 }), { color: c.text2 }]}>Sign in to see your orders, saved gear and faster checkout.</Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <Button label="Sign in" height={46} radius={14} weight={600} fontSize={14} style={{ flex: 1 }} onPress={() => router.push('/login')} />
                <Button
                  label="Create account"
                  variant="outline"
                  height={46}
                  radius={14}
                  weight={600}
                  fontSize={14}
                  style={{ flex: 1 }}
                  onPress={() => router.push('/register')}
                />
              </View>
            </Card>
          </Animated.View>
        ) : (
          <Animated.View entering={enter(1, reduced)}>
            <SectionLabel style={{ marginTop: 24 }}>My account</SectionLabel>
            <Card radius={20} style={{ marginTop: 10 }}>
              {menu.map((m, i) => (
                <MenuRow
                  key={m.href}
                  icon={m.icon}
                  title={m.title}
                  sub={m.sub}
                  badge={'badge' in m ? m.badge : undefined}
                  last={i === menu.length - 1}
                  onPress={() => router.push(m.href)}
                />
              ))}
            </Card>
          </Animated.View>
        )}

        <Animated.View entering={enter(2, reduced)}>
          <SectionLabel style={{ marginTop: 24 }}>Appearance</SectionLabel>
          <Card radius={20} style={{ marginTop: 10 }}>
            <View style={{ padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, borderBottomWidth: 1, borderBottomColor: c.line }}>
              <Text style={[font.body(600, 14), { color: c.text1 }]}>Theme</Text>
              <Segmented<ThemeMode>
                width={180}
                value={mode}
                onChange={s.setTheme}
                options={[
                  { value: 'dark', label: 'Dark' },
                  { value: 'light', label: 'Light' },
                ]}
              />
            </View>
            <View style={{ padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, borderBottomWidth: 1, borderBottomColor: c.line }}>
              <Text style={[font.body(600, 14), { color: c.text1 }]}>Accent</Text>
              <View accessibilityRole="radiogroup" style={{ flexDirection: 'row', gap: 10 }}>
                {ACCENT_SWATCHES.map((a) => {
                  const on = a.key === accent;
                  return (
                    <Pressable
                      key={a.key}
                      accessibilityRole="radio"
                      accessibilityLabel={a.label}
                      accessibilityState={{ checked: on }}
                      onPress={() => {
                        haptic('selection');
                        s.setAccent(a.key);
                      }}
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 14,
                        backgroundColor: a.color,
                        boxShadow: on ? `0 0 0 2px ${c.surface1}, 0 0 0 4px ${c.text1}` : undefined,
                      }}
                    />
                  );
                })}
              </View>
            </View>
            <ToggleRow title="Reduce motion" sub="Turns off transitions and the fly-to-cart effect" on={s.reducedMotion} onToggle={s.toggleReducedMotion} last />
          </Card>
        </Animated.View>

        {user ? (
          <Animated.View entering={enter(3, reduced)}>
            <SectionLabel style={{ marginTop: 24 }}>Account</SectionLabel>
            <Card radius={20} style={{ marginTop: 10 }}>
              <Pressable
                accessibilityRole="button"
                onPress={() => router.push('/admin')}
                style={{ padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: c.line }}>
                <View style={{ gap: 3 }}>
                  <Text style={[font.body(600, 14), { color: c.text1 }]}>Admin console</Text>
                  <Text style={[font.body(400, 12), { color: c.text2 }]}>Orders, products, inventory, reports</Text>
                </View>
                <Pill label="Owner" bg={c.accentSoft} fg={c.accentText} />
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={() => {
                  s.signOut();
                  toast('Signed out', 'See you at the next session');
                }}
                style={{ padding: 14 }}>
                <Text style={[font.body(600, 14), { color: c.err }]}>Sign out</Text>
              </Pressable>
            </Card>
          </Animated.View>
        ) : null}
      </ScrollView>
    </View>
  );
}
