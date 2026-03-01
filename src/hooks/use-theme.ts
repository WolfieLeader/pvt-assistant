import { useEffect } from "react";
import { Uniwind, useUniwind } from "uniwind";
import { useThemeStore } from "~/stores/theme";

export function useTheme() {
  const preference = useThemeStore((s) => s.preference);
  const setPreference = useThemeStore((s) => s.setPreference);
  const { theme } = useUniwind();

  useEffect(() => {
    Uniwind.setTheme(preference);
  }, [preference]);

  return {
    preference,
    setPreference,
    theme,
    isDark: theme === "dark",
  };
}
