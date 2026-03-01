import { useFonts } from "~/hooks/use-load-fonts";
import { useMigrations } from "~/hooks/use-migrations";

export const useAppReady = () => {
  const { fontsLoaded, fontsError } = useFonts();
  const { migrationsSuccess, migrationsError } = useMigrations();

  return {
    ready: fontsLoaded && migrationsSuccess,
    error: fontsError ?? migrationsError,
  } as const;
};
