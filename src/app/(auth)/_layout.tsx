import { Stack } from 'expo-router';

import { useTheme } from '@/theme/use-theme';

export const unstable_settings = {
  // Deep-linking straight to /register or /verify still puts Login underneath.
  anchor: 'login',
};

export default function AuthLayout() {
  const { c } = useTheme();
  return <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right', contentStyle: { backgroundColor: c.bg } }} />;
}
