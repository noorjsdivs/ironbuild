import { router, Stack } from 'expo-router';
import { View } from 'react-native';

import { EmptyState } from '@/components/blocks';
import { useTheme } from '@/theme/use-theme';

export default function NotFound() {
  const { c } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: c.bg, justifyContent: 'center', padding: 20 }}>
      <Stack.Screen options={{ title: 'Not found' }} />
      <EmptyState icon="search" title="Wrong aisle" body="That page doesn’t exist. Let’s get you back to the gear." cta="Go home" onCta={() => router.replace('/')} />
    </View>
  );
}
