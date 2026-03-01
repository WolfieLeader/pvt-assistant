import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { mmkvStorage } from "~/utils/mmkv";

type OnboardingState = {
  completed: boolean;
  setCompleted: (completed: boolean) => void;
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      completed: false,
      setCompleted: (completed) => set({ completed }),
    }),
    {
      name: "onboarding",
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
);
