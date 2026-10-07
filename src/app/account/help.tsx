import Constants from 'expo-constants';
import * as Linking from 'expo-linking';
import { Text } from 'react-native';

import { Card, MenuRow } from '@/components/blocks';
import type { IconName } from '@/components/icon';
import { PushedScreen } from '@/components/screen';
import { SUPPORT_EMAIL } from '@/data/catalog';
import { toast } from '@/store/ui-store';
import { font } from '@/theme/fonts';
import { useTheme } from '@/theme/use-theme';

const ROWS: { icon: IconName; title: string; sub: string; onPress: () => void }[] = [
  { icon: 'quiz', title: 'FAQ', sub: 'Shipping, sizing, assembly', onPress: () => toast('FAQ', 'Shipping, sizing, assembly') },
  { icon: 'assignment_return', title: 'Returns & refunds', sub: '30-day returns on unused gear', onPress: () => toast('Returns & refunds', '30-day returns on unused gear') },
  { icon: 'chat', title: 'Chat with us', sub: 'Usually replies in minutes', onPress: () => toast('Chat with us', 'Usually replies in minutes') },
  { icon: 'mail', title: 'Email support', sub: SUPPORT_EMAIL, onPress: () => void Linking.openURL(`mailto:${SUPPORT_EMAIL}`) },
];

export default function HelpScreen() {
  const { c } = useTheme();
  const version = Constants.expoConfig?.version ?? '1.0.0';
  return (
    <PushedScreen title="Help & support">
      <Card>
        {ROWS.map((r, i) => (
          <MenuRow key={r.title} icon={r.icon} title={r.title} sub={r.sub} onPress={r.onPress} last={i === ROWS.length - 1} />
        ))}
      </Card>
      <Text style={[font.body(400, 12.5, { lh: 1.5 }), { marginTop: 8, color: c.text3, textAlign: 'center' }]}>
        {`IRONBUILD v${version} · Support hours 9–6 ET, Mon–Sat`}
      </Text>
    </PushedScreen>
  );
}
