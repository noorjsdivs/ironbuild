import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';

import { AdminScreen } from '@/components/admin';
import { Button } from '@/components/button';
import { Switch } from '@/components/controls';
import { haptic } from '@/components/pressable-scale';
import { ProgressBar } from '@/components/progress-bar';
import { useApp } from '@/store/app-store';
import { toast } from '@/store/ui-store';
import { font } from '@/theme/fonts';
import { enter } from '@/theme/motion';
import { useMotion, useTheme } from '@/theme/use-theme';

export default function AdminDiscounts() {
  const { c } = useTheme();
  const { reduced } = useMotion();
  const discounts = useApp((s) => s.discounts);
  const addDiscount = useApp((s) => s.addDiscount);
  const toggleDiscount = useApp((s) => s.toggleDiscount);
  const [code, setCode] = useState('');
  const [pct, setPct] = useState('10');

  const create = () => {
    const clean = code.trim().toUpperCase().replace(/\s+/g, '');
    const n = Math.min(90, Math.max(1, parseInt(pct, 10) || 0));
    if (!clean) return toast('Code required', 'Type a code like LEGDAY20');
    if (discounts.some((d) => d.code === clean)) return toast('Code exists', `${clean} is already set up`);
    addDiscount(clean, n);
    setCode('');
    haptic('success');
    toast('Code created', clean);
  };

  const input = { height: 48, borderRadius: 14, borderWidth: 1, borderColor: c.line, backgroundColor: c.surface1, color: c.text1, paddingHorizontal: 14 } as const;

  return (
    <AdminScreen title="Discounts" back contentStyle={{ gap: 8 }}>
      <Animated.View entering={enter(0, reduced)} style={{ flexDirection: 'row', gap: 8, marginBottom: 6 }}>
        <TextInput
          accessibilityLabel="New discount code"
          value={code}
          onChangeText={(v) => setCode(v.toUpperCase())}
          placeholder="NEW CODE"
          placeholderTextColor={c.text3}
          autoCapitalize="characters"
          autoCorrect={false}
          returnKeyType="done"
          onSubmitEditing={create}
          style={[font.mono(600, 14), input, { flex: 1, minWidth: 0 }]}
        />
        <TextInput
          accessibilityLabel="Percent off"
          value={pct}
          onChangeText={(v) => setPct(v.replace(/\D/g, '').slice(0, 2))}
          keyboardType="number-pad"
          style={[font.mono(600, 14), input, { width: 70, paddingHorizontal: 12 }]}
        />
        <Button label="Create" height={48} radius={14} weight={600} fontSize={13} style={{ paddingHorizontal: 16 }} onPress={create} />
      </Animated.View>
      {discounts.map((d, i) => (
        <Animated.View
          key={d.code}
          entering={enter(1 + i, reduced)}
          layout={reduced ? undefined : LinearTransition}
          style={{ padding: 14, borderRadius: 16, borderWidth: 1, borderColor: c.line, backgroundColor: c.surface1, gap: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={{ flex: 1, minWidth: 0, gap: 3 }}>
              <Text style={[font.mono(700, 15), { color: d.on ? c.text1 : c.text3 }]}>{d.code}</Text>
              <Text style={[font.body(400, 12.5), { color: c.text2 }]}>{d.desc}</Text>
            </View>
            <Switch on={d.on} onToggle={() => toggleDiscount(d.code)} label={`${d.code} active`} />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <ProgressBar pct={d.limit ? (d.used / d.limit) * 100 : 100} height={5} style={{ flex: 1 }} />
            <Text style={[font.mono(500, 10.5), { color: c.text3 }]}>{d.limit ? `${d.used} / ${d.limit}` : `${d.used} used`}</Text>
          </View>
        </Animated.View>
      ))}
    </AdminScreen>
  );
}
