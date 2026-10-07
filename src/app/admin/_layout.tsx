import { Stack } from 'expo-router';

import { useTheme } from '@/theme/use-theme';

export default function AdminLayout() {
  const { c } = useTheme();
  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: c.bg } }} />;
}
