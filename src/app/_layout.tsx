import { Poppins_300Light } from '@expo-google-fonts/poppins/300Light';
import { Poppins_300Light_Italic } from '@expo-google-fonts/poppins/300Light_Italic';
import { Poppins_400Regular } from '@expo-google-fonts/poppins/400Regular';
import { Poppins_500Medium } from '@expo-google-fonts/poppins/500Medium';
import { Poppins_600SemiBold } from '@expo-google-fonts/poppins/600SemiBold';
import { Tomorrow_600SemiBold } from '@expo-google-fonts/tomorrow/600SemiBold';
import { useFonts } from 'expo-font';
import { DarkTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';

import { LaunchScreen } from '@/features/launch/launch-screen';
import { configureReminders } from '@/features/reminders/reminders';
import { useWidgetSync } from '@/features/widgets/use-widget-sync';
import { AppStateProvider, useAppState } from '@/state/app-state';
import { JournalProvider } from '@/state/journal';
import { fonts } from '@/theme/tokens';
import { useTheme } from '@/theme/use-theme';
import { useReduceMotion } from '@/ui/motion';

SplashScreen.preventAutoHideAsync();
configureReminders();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    [fonts.display]: Tomorrow_600SemiBold,
    [fonts.light]: Poppins_300Light,
    [fonts.lightItalic]: Poppins_300Light_Italic,
    [fonts.regular]: Poppins_400Regular,
    [fonts.medium]: Poppins_500Medium,
    [fonts.semibold]: Poppins_600SemiBold,
  });
  return (
    <AppStateProvider>
      <JournalProvider>
        {/* A font that fails to load falls back to the system font rather than blocking the app. */}
        <RootNavigator fontsReady={fontsLoaded || !!fontError} />
      </JournalProvider>
    </AppStateProvider>
  );
}

function RootNavigator({ fontsReady }: { fontsReady: boolean }) {
  const { ready, state } = useAppState();
  const { colors } = useTheme();
  const reduceMotion = useReduceMotion();
  const [launched, setLaunched] = useState(false);
  const finishLaunch = useCallback(() => setLaunched(true), []);
  useWidgetSync();

  // The native splash shows the same logo until the fonts for the loader are in.
  useEffect(() => {
    if (fontsReady) SplashScreen.hideAsync();
  }, [fontsReady]);

  if (!fontsReady) return null;
  if (!launched) {
    return (
      <>
        <StatusBar style="light" />
        <LaunchScreen ready={ready} onDone={finishLaunch} />
      </>
    );
  }

  const navigationTheme = {
    ...DarkTheme,
    colors: { ...DarkTheme.colors, background: colors.background, card: colors.background, primary: colors.accent, text: colors.text, border: colors.border },
  };

  return (
    <ThemeProvider value={navigationTheme}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: reduceMotion ? 'none' : 'default',
        }}>
        <Stack.Protected guard={!state.onboardingCompleted}>
          <Stack.Screen name="onboarding" />
        </Stack.Protected>
        <Stack.Protected guard={state.onboardingCompleted}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="lesson/[id]"
            options={{ presentation: 'fullScreenModal', animation: reduceMotion ? 'none' : 'slide_from_bottom' }}
          />
          <Stack.Screen name="journal/[id]" options={{ presentation: 'modal', animation: reduceMotion ? 'none' : 'default' }} />
          <Stack.Screen name="widgets" options={{ presentation: 'modal', animation: reduceMotion ? 'none' : 'default' }} />
          <Stack.Screen name="bible/[lessonId]" options={{ presentation: 'modal', animation: reduceMotion ? 'none' : 'default' }} />
        </Stack.Protected>
      </Stack>
    </ThemeProvider>
  );
}
