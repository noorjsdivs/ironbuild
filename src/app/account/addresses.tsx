import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeOut, LinearTransition } from 'react-native-reanimated';

import { Field, Pill } from '@/components/blocks';
import { Button } from '@/components/button';
import { FloatingCTA } from '@/components/chrome';
import { Icon } from '@/components/icon';
import { haptic } from '@/components/pressable-scale';
import { PushedScreen } from '@/components/screen';
import type { Address } from '@/data/types';
import { useApp } from '@/store/app-store';
import { toast } from '@/store/ui-store';
import { font } from '@/theme/fonts';
import { enter } from '@/theme/motion';
import { useMotion, useTheme } from '@/theme/use-theme';

const iconFor = (label: string): Address['icon'] => (/home/i.test(label) ? 'home' : /work|office/i.test(label) ? 'work' : /gym/i.test(label) ? 'fitness_center' : 'location_on');

export default function AddressesScreen() {
  const { c } = useTheme();
  const { reduced } = useMotion();
  const addresses = useApp((s) => s.addresses);
  const defaultId = useApp((s) => s.defaultAddressId);
  const setDefault = useApp((s) => s.setDefaultAddress);
  const addAddress = useApp((s) => s.addAddress);
  const removeAddress = useApp((s) => s.removeAddress);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({ label: '', l1: '', l2: '' });

  const save = () => {
    if (!draft.l1.trim()) return toast('Street required', 'Enter at least a street address');
    const label = draft.label.trim() || 'Other';
    addAddress({ label, icon: iconFor(label), l1: draft.l1.trim(), l2: draft.l2.trim() || '—' });
    setAdding(false);
    toast('Address saved', label);
  };

  return (
    <PushedScreen
      title="Addresses"
      footerSpace={70}
      footer={
        <FloatingCTA>
          <Button
            label="Add new address"
            height={54}
            radius={16}
            weight={600}
            glow
            onPress={() => {
              setDraft({ label: '', l1: '', l2: '' });
              setAdding(true);
            }}
          />
        </FloatingCTA>
      }>
      {addresses.map((a, i) => {
        const on = a.id === defaultId;
        return (
          <Animated.View key={a.id} entering={enter(i, reduced)} exiting={reduced ? undefined : FadeOut} layout={reduced ? undefined : LinearTransition}>
            <Pressable
              accessibilityRole="radio"
              accessibilityState={{ checked: on }}
              accessibilityLabel={`${a.label}, ${a.l1}`}
              onPress={() => {
                haptic('selection');
                setDefault(a.id);
              }}
              style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start', padding: 14, borderRadius: 18, borderWidth: 1.5, borderColor: on ? c.accent : c.line, backgroundColor: c.surface1 }}>
              <View style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: c.accentSoft, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name={a.icon} size={22} filled color={c.accentText} />
              </View>
              <View style={{ flex: 1, minWidth: 0, gap: 3 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Text style={[font.body(600, 14.5), { color: c.text1 }]}>{a.label}</Text>
                  {on ? <Pill label="Default" bg={c.accentSoft} fg={c.accentText} size="xs" /> : null}
                </View>
                <Text style={[font.body(400, 13, { lh: 1.45 }), { color: c.text2 }]}>{`${a.l1}\n${a.l2}`}</Text>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Remove ${a.label}`}
                hitSlop={6}
                onPress={() => {
                  removeAddress(a.id);
                  toast('Address removed', a.label);
                }}
                style={{ width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="delete" size={20} color={c.text3} />
              </Pressable>
            </Pressable>
          </Animated.View>
        );
      })}
      <Text style={[font.body(400, 12.5), { color: c.text3, paddingHorizontal: 4 }]}>Tap an address to make it the default for checkout.</Text>

      {adding ? (
        <Animated.View entering={enter(0, reduced)} style={{ marginTop: 8, gap: 8, padding: 14, borderRadius: 18, borderWidth: 1, borderColor: c.lineStrong, backgroundColor: c.surface1 }}>
          <Text style={[font.eyebrow(), { color: c.text3 }]}>New address</Text>
          <Field label="Label" value={draft.label} onChangeText={(label) => setDraft((d) => ({ ...d, label }))} placeholder="Home, Work, Gym…" />
          <Field label="Street" value={draft.l1} onChangeText={(l1) => setDraft((d) => ({ ...d, l1 }))} autoComplete="street-address" textContentType="fullStreetAddress" />
          <Field label="City, state, ZIP" value={draft.l2} onChangeText={(l2) => setDraft((d) => ({ ...d, l2 }))} autoComplete="postal-address" />
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Button label="Cancel" variant="outline" height={46} radius={14} weight={600} fontSize={14} style={{ flex: 1 }} onPress={() => setAdding(false)} />
            <Button label="Save address" height={46} radius={14} weight={600} fontSize={14} style={{ flex: 1 }} onPress={save} />
          </View>
        </Animated.View>
      ) : null}
    </PushedScreen>
  );
}
