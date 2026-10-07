import { Pressable, Text, View } from 'react-native';
import Animated, { FadeOut, LinearTransition } from 'react-native-reanimated';

import { Card, Pill, StatusPill } from '@/components/blocks';
import { Button } from '@/components/button';
import { FloatingCTA } from '@/components/chrome';
import { Icon } from '@/components/icon';
import { haptic } from '@/components/pressable-scale';
import { PushedScreen } from '@/components/screen';
import { useApp } from '@/store/app-store';
import { toast } from '@/store/ui-store';
import { font } from '@/theme/fonts';
import { enter } from '@/theme/motion';
import { useMotion, useTheme } from '@/theme/use-theme';

export default function PaymentMethodsScreen() {
  const { c } = useTheme();
  const { reduced } = useMotion();
  const cards = useApp((s) => s.cards);
  const defaultId = useApp((s) => s.defaultCardId);
  const setDefault = useApp((s) => s.setDefaultCard);
  const addCard = useApp((s) => s.addCard);
  const removeCard = useApp((s) => s.removeCard);

  return (
    <PushedScreen
      title="Payment methods"
      footerSpace={70}
      footer={
        <FloatingCTA>
          <Button
            label="Add card"
            height={54}
            radius={16}
            weight={600}
            glow
            onPress={() => {
              // Card entry belongs to the payment provider's secure sheet
              // (e.g. Stripe PaymentSheet); a demo card stands in here.
              addCard({ brand: 'AMEX', bg: '#2e77bc', num: '•••• 1007', sub: 'Expires 11/28' });
              toast('Card added', 'Amex •••• 1007');
            }}
          />
        </FloatingCTA>
      }>
      {cards.map((k, i) => {
        const on = k.id === defaultId;
        return (
          <Animated.View key={k.id} entering={enter(i, reduced)} exiting={reduced ? undefined : FadeOut} layout={reduced ? undefined : LinearTransition}>
            <Pressable
              accessibilityRole="radio"
              accessibilityState={{ checked: on }}
              accessibilityLabel={`${k.brand} ending ${k.num.slice(-4)}`}
              onPress={() => {
                haptic('selection');
                setDefault(k.id);
              }}
              style={{ flexDirection: 'row', gap: 12, alignItems: 'center', padding: 14, borderRadius: 18, borderWidth: 1.5, borderColor: on ? c.accent : c.line, backgroundColor: c.surface1 }}>
              <View style={{ width: 46, height: 32, borderRadius: 8, backgroundColor: k.bg, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={[font.mono(700, 10, { ls: 0.04 }), { color: '#fff' }]}>{k.brand}</Text>
              </View>
              <View style={{ flex: 1, minWidth: 0, gap: 3 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Text style={[font.mono(600, 14.5), { color: c.text1 }]}>{k.num}</Text>
                  {on ? <Pill label="Default" bg={c.accentSoft} fg={c.accentText} size="xs" /> : null}
                </View>
                <Text style={[font.body(400, 12.5), { color: c.text2 }]}>{k.sub}</Text>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Remove card ${k.num}`}
                hitSlop={6}
                onPress={() => {
                  removeCard(k.id);
                  toast('Card removed', k.num);
                }}
                style={{ width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="delete" size={20} color={c.text3} />
              </Pressable>
            </Pressable>
          </Animated.View>
        );
      })}
      <Card style={{ marginTop: 8, padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <View style={{ gap: 3 }}>
          <Text style={[font.body(600, 14), { color: c.text1 }]}>Apple Pay</Text>
          <Text style={[font.body(400, 12), { color: c.text2 }]}>Set up on this iPhone</Text>
        </View>
        <StatusPill label="Active" color={c.ok} />
      </Card>
    </PushedScreen>
  );
}
