import { Stack } from "expo-router";
import "~/global.css";
import { useTheme } from "~/hooks/use-theme";
import { DatabaseProvider } from "~/providers/database";
import { QueryProvider } from "~/providers/react-query";

export default function RootLayout() {
  useTheme();

  return (
    <QueryProvider>
      <DatabaseProvider>
        <Stack />
      </DatabaseProvider>
    </QueryProvider>
  );
}
