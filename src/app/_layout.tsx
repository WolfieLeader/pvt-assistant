import * as SplashScreen from "expo-splash-screen";
import { Stack } from "expo-router";
import { useEffect } from "react";
import "~/global.css";
import { useAppReady } from "~/hooks/use-app-ready";
import { ThemeProvider } from "~/providers/theme";
import { QueryProvider } from "~/providers/react-query";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { ready, error } = useAppReady();

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  if (error) throw error;
  if (!ready) return null;

  return (
    <ThemeProvider>
      <QueryProvider>
        <Stack />
      </QueryProvider>
    </ThemeProvider>
  );
}
