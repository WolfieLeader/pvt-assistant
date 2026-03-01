import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from "@expo-google-fonts/inter";
import { useFonts as useExpoFonts } from "expo-font";

export const useFonts = () => {
  const [fontsLoaded, fontsError] = useExpoFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });
  return { fontsLoaded, fontsError } as const;
};
