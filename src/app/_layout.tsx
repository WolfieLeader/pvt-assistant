import { Stack } from "expo-router";
import "~/global.css";
import { useAppReady } from "~/hooks/use-app-ready";
import { ThemeProvider } from "~/providers/theme";
import { QueryProvider } from "~/providers/react-query";

export default function RootLayout() {
  const { ready, error } = useAppReady();
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
