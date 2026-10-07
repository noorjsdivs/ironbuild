import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CUSTOMERS } from '@/data/catalog';
import type { Order } from '@/data/types';
import { cnt, initials, money } from '@/lib/format';
import { orderTotal } from '@/lib/pricing';
import { statusOf } from '@/lib/status';
import { useApp, useProductLookup } from '@/store/app-store';
import { font } from '@/theme/fonts';
import { useTheme } from '@/theme/use-theme';

import { Photo, StatusPill } from './blocks';
import { BackButton, ScreenStatusBar, TABBAR_SPACE } from './chrome';
import { Glass } from './glass';
import { Icon, type IconName } from './icon';
import { PressableScale } from './pressable-scale';

export const exitAdmin = () => router.dismissTo('/profile');

export const editProduct = (id: string) => router.push({ pathname: '/admin/product/[id]', params: { id } });

/** Pinned admin header: IB tile (or back), "ADMIN CONSOLE" eyebrow, title, Store button. */
export function AdminHeader({ title, back }: { title: string; back?: boolean }) {
  const { c } = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <Glass
      tone="strong"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 20,
        paddingTop: insets.top + 4,
        paddingBottom: 8,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: c.glassLine,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
      }}>
      {back ? (
        <BackButton size={40} />
      ) : (
        <View style={{ width: 40, height: 40, borderRadius: 13, backgroundColor: c.accent, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={[font.num(800, 14), { color: c.accentInk }]}>IB</Text>
        </View>
      )}
      <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
        <Text style={[font.mono(500, 9.5, { ls: 0.1, upper: true }), { color: c.accentText }]}>Admin console</Text>
        <Text accessibilityRole="header" numberOfLines={1} style={[font.display(700, 17), { color: c.text1 }]}>
          {title}
        </Text>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Exit admin"
        onPress={exitAdmin}
        style={{ height: 36, paddingHorizontal: 12, borderRadius: 11, borderWidth: 1, borderColor: c.lineStrong, justifyContent: 'center' }}>
        <Text style={[font.body(600, 12), { color: c.text1 }]}>Store</Text>
      </Pressable>
    </Glass>
  );
}

/** Admin page scaffold: header, scroll body, optional bottom bar. */
export function AdminScreen({
  title,
  back,
  children,
  footer,
  contentStyle,
  bottomSpace = back ? 40 : TABBAR_SPACE,
}: {
  title: string;
  back?: boolean;
  children: ReactNode;
  footer?: ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
  bottomSpace?: number;
}) {
  const { c } = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: c.bg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScreenStatusBar />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[{ paddingTop: insets.top + 68, paddingHorizontal: 20, paddingBottom: bottomSpace + insets.bottom, gap: 14 }, contentStyle]}>
        {children}
      </ScrollView>
      <AdminHeader title={title} back={back} />
      {footer}
    </KeyboardAvoidingView>
  );
}

/** Big display page title with optional right element. */
export function PageTitle({ title, right }: { title: string; right?: ReactNode }) {
  const { c } = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <Text accessibilityRole="header" style={[font.display(800, 32), { color: c.text1 }]}>
        {title}
      </Text>
      {right}
    </View>
  );
}

/** Small stat tile: mono label, big display value. */
export function StatTile({ label, value, color, icon, iconColor, onPress, selected }: { label: string; value: string; color?: string; icon?: IconName; iconColor?: string; onPress?: () => void; selected?: boolean }) {
  const { c } = useTheme();
  const body = (
    <>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        {icon ? <Icon name={icon} size={14} color={iconColor ?? c.text3} /> : null}
        <Text numberOfLines={1} style={[font.mono(500, 9, { ls: 0.08, upper: true }), { color: c.text3 }]}>
          {label}
        </Text>
      </View>
      <Text numberOfLines={1} adjustsFontSizeToFit style={[font.num(800, 22), { color: color ?? c.text1 }]}>
        {value}
      </Text>
    </>
  );
  const style: ViewStyle = { flex: 1, padding: 12, borderRadius: 16, borderWidth: selected === undefined ? 1 : 1.5, borderColor: selected ? c.accent : c.line, backgroundColor: c.surface1, gap: 6 };
  return onPress ? (
    <Pressable accessibilityRole="button" accessibilityState={{ selected }} onPress={onPress} style={style}>
      {body}
    </Pressable>
  ) : (
    <View style={style}>{body}</View>
  );
}

/** Order row used on dashboard, customer detail (compact) and orders list (full). */
export function OrderRow({ order: o, variant = 'compact' }: { order: Order; variant?: 'compact' | 'full' | 'customer' }) {
  const { c } = useTheme();
  const byId = useProductLookup();
  const freeAt = useApp((s) => s.freeAt);
  const rates = useApp((s) => s.rates);
  const cust = CUSTOMERS.find((x) => x.id === o.cid);
  const st = statusOf(o.step, c);
  const n = o.items.reduce((a, b) => a + b.q, 0);
  const total = money(orderTotal(o, byId, freeAt, rates));
  const name = cust?.name ?? 'Customer';
  const open = () => router.push({ pathname: '/admin/order/[no]', params: { no: o.no } });
  const first = byId(o.items[0]?.id ?? '');

  if (variant === 'customer') {
    return (
      <PressableScale scaleTo={0.98} onPress={open} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, paddingHorizontal: 14, borderRadius: 16, borderWidth: 1, borderColor: c.line, backgroundColor: c.surface1 }}>
        <View style={{ flex: 1, gap: 3 }}>
          <Text style={[font.mono(600, 14), { color: c.text1 }]}>{o.no}</Text>
          <Text style={[font.body(400, 12), { color: c.text2 }]}>{`${o.date} · ${cnt(n, 'item')}`}</Text>
        </View>
        <View style={{ alignItems: 'flex-end', gap: 4 }}>
          <Text style={[font.num(700, 16), { color: c.text1 }]}>{total}</Text>
          <StatusPill label={st.label} color={st.color} size="xs" />
        </View>
      </PressableScale>
    );
  }

  const head = (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, width: '100%' }}>
      <View style={{ width: variant === 'full' ? 40 : 38, height: variant === 'full' ? 40 : 38, borderRadius: variant === 'full' ? 13 : 12, backgroundColor: c.surface2, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={[font.mono(700, 12), { color: c.text1 }]}>{initials(name)}</Text>
      </View>
      <View style={{ flex: 1, minWidth: 0, gap: 3 }}>
        <Text numberOfLines={1} style={[font.body(600, variant === 'full' ? 14.5 : 14), { color: c.text1 }]}>
          {name}
        </Text>
        <Text style={[font.mono(500, 10.5), { color: c.text3 }]}>{`${o.no} · ${o.date}`}</Text>
      </View>
      {variant === 'full' ? (
        <StatusPill label={st.label} color={st.color} dot />
      ) : (
        <View style={{ alignItems: 'flex-end', gap: 4 }}>
          <Text style={[font.num(700, 16), { color: c.text1 }]}>{total}</Text>
          <StatusPill label={st.label} color={st.color} size="xs" />
        </View>
      )}
    </View>
  );

  return (
    <PressableScale
      scaleTo={0.98}
      onPress={open}
      accessibilityLabel={`Order ${o.no} from ${name}, ${st.label}, ${total}`}
      style={{ gap: 10, paddingVertical: 12, paddingHorizontal: 14, borderRadius: variant === 'full' ? 18 : 16, borderWidth: 1, borderColor: c.line, backgroundColor: c.surface1 }}>
      {head}
      {variant === 'full' ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: c.line }}>
          <View style={{ flexDirection: 'row' }}>
            {o.items.slice(0, 3).map((it, k) => {
              const p = byId(it.id);
              return (
                <View key={it.id + it.s} style={{ width: 34, height: 34, borderRadius: 10, borderWidth: 2, borderColor: c.surface1, marginLeft: k ? -10 : 0, overflow: 'hidden', backgroundColor: c.surface2 }}>
                  {p ? <Photo uri={p.img} style={{ width: '100%', height: '100%' }} /> : null}
                </View>
              );
            })}
          </View>
          <Text numberOfLines={1} style={[font.body(500, 12), { flex: 1, color: c.text2 }]}>
            {`${first?.short ?? 'Item'}${o.items.length > 1 ? ` + ${o.items.length - 1} more` : ''} · ${cnt(n, 'item')}`}
          </Text>
          <Text style={[font.num(800, 18), { color: c.text1 }]}>{total}</Text>
          <Icon name="chevron_right" size={18} color={c.text3} />
        </View>
      ) : null}
    </PressableScale>
  );
}
