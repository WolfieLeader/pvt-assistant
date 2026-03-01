import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { mmkvStorage } from "~/utils/mmkv";

type SettingsState = {
  currency: string;
  hourlyRate: number | null;
  setCurrency: (currency: string) => void;
  setHourlyRate: (hourlyRate: number | null) => void;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      currency: "USD",
      hourlyRate: null,
      setCurrency: (currency) => set({ currency }),
      setHourlyRate: (hourlyRate) => set({ hourlyRate }),
    }),
    {
      name: "settings",
      storage: createJSONStorage(() => mmkvStorage),
      partialize: ({ currency, hourlyRate }) => ({ currency, hourlyRate }),
    },
  ),
);
