import { useEffect } from "react";
import { Uniwind } from "uniwind";
import { useThemeStore } from "~/stores/theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const preference = useThemeStore((s) => s.preference);

  useEffect(() => {
    Uniwind.setTheme(preference);
  }, [preference]);

  return <>{children}</>;
}
