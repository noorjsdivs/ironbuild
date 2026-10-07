import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider, router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { useEffect, useMemo } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { FlyToCart, ToastHost } from '@/components/overlays';
import { useApp, useHydrated } from '@/store/app-store';
import { FONT_ASSETS } from '@/theme/fonts';
import { useTheme } from '@/theme/use-theme';

void SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({ fade: true, duration: 300 });

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts(FONT_ASSETS);
  const hydrated = useHydrated();
  const ready = (fontsLoaded || !!fontError) && hydrated;
  const { c, isDark } = useTheme();
  const user = useApp((s) => s.user);

  useEffect(() => {
    void SystemUI.setBackgroundColorAsync(c.bg);
  }, [c.bg]);

  useEffect(() => {
    if (!ready) return;
    if (useApp.getState().hasSeenIntro) {
      void SplashScreen.hideAsync();
    } else {
      // The intro hides the native splash itself once its first frame is up.
      router.push('/welcome');
    }
  }, [ready]);

  const navTheme = useMemo(() => {
    const base = isDark ? DarkTheme : DefaultTheme;
    return {
      ...base,
      colors: { ...base.colors, background: c.bg, card: c.surface1, text: c.text1, border: c.line, primary: c.accent },
    };
  }, [isDark, c]);

  if (!ready) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: c.bg }}>
      <ThemeProvider value={navTheme}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <View style={{ flex: 1 }}>
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: c.bg } }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen
              name="welcome"
              options={{ presentation: 'fullScreenModal', animation: 'fade', gestureEnabled: false, contentStyle: { backgroundColor: '#08090b' } }}
            />
            <Stack.Screen name="(auth)" options={{ presentation: 'fullScreenModal', animation: 'fade_from_bottom' }} />
            <Stack.Screen name="product/[id]" options={{ animation: 'fade' }} />
            <Stack.Screen
              name="filters"
              options={{
                presentation: 'formSheet',
                sheetAllowedDetents: 'fitToContents',
                sheetGrabberVisible: true,
                sheetCornerRadius: 30,
                contentStyle: { backgroundColor: c.bg },
              }}
            />
            <Stack.Screen name="checkout" />
            <Stack.Screen name="order-placed" options={{ animation: 'slide_from_bottom', gestureEnabled: false }} />
            <Stack.Screen name="track/[no]" />
            <Stack.Screen name="journal/index" />
            <Stack.Screen name="journal/[id]" />
            <Stack.Screen name="account" />
            <Stack.Protected guard={!!user}>
              <Stack.Screen name="admin" options={{ animation: 'slide_from_right' }} />
            </Stack.Protected>
          </Stack>
          <FlyToCart />
          <ToastHost />
        </View>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
