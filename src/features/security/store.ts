import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { INITIAL_ATTEMPTS, LOCKOUT_STAGES_MS, RETRY_ATTEMPTS } from "./consts";
import { mmkvStorage } from "~/utils/mmkv";

function getAttemptLimit(lockoutCount: number) {
  return lockoutCount === 0 ? INITIAL_ATTEMPTS : RETRY_ATTEMPTS;
}

function getLockoutDuration(lockoutCount: number) {
  const stage = Math.min(lockoutCount, LOCKOUT_STAGES_MS.length - 1);
  return LOCKOUT_STAGES_MS[stage];
}

type SecurityState = {
  lockEnabled: boolean;
  privacyMode: boolean;
  failedAttempts: number;
  lockoutUntil: number | null;
  lockoutCount: number;
  isLocked: boolean;
  recoveryFailedAttempts: number;
  recoveryLockoutUntil: number | null;
  recoveryLockoutCount: number;

  setLockEnabled: (enabled: boolean) => void;
  togglePrivacyMode: () => void;
  setIsLocked: (locked: boolean) => void;
  recordFailedAttempt: () => void;
  resetFailedAttempts: () => void;
  recordFailedRecoveryAttempt: () => void;
  resetRecoveryAttempts: () => void;
  resetSecurity: () => void;
};

export const useSecurityStore = create<SecurityState>()(
  persist(
    (set, get) => ({
      lockEnabled: false,
      privacyMode: false,
      failedAttempts: 0,
      lockoutUntil: null,
      lockoutCount: 0,
      isLocked: false,
      recoveryFailedAttempts: 0,
      recoveryLockoutUntil: null,
      recoveryLockoutCount: 0,

      setLockEnabled: (lockEnabled) => set({ lockEnabled, isLocked: lockEnabled }),
      togglePrivacyMode: () => set((s) => ({ privacyMode: !s.privacyMode })),
      setIsLocked: (isLocked) => set({ isLocked }),

      recordFailedAttempt: () => {
        const { failedAttempts, lockoutCount } = get();
        const next = failedAttempts + 1;
        const limit = getAttemptLimit(lockoutCount);
        if (next >= limit) {
          set({
            failedAttempts: 0,
            lockoutUntil: Date.now() + getLockoutDuration(lockoutCount),
            lockoutCount: lockoutCount + 1,
          });
        } else {
          set({ failedAttempts: next });
        }
      },

      resetFailedAttempts: () => set({ failedAttempts: 0, lockoutUntil: null, lockoutCount: 0 }),

      recordFailedRecoveryAttempt: () => {
        const { recoveryFailedAttempts, recoveryLockoutCount } = get();
        const next = recoveryFailedAttempts + 1;
        const limit = getAttemptLimit(recoveryLockoutCount);
        if (next >= limit) {
          set({
            recoveryFailedAttempts: 0,
            recoveryLockoutUntil: Date.now() + getLockoutDuration(recoveryLockoutCount),
            recoveryLockoutCount: recoveryLockoutCount + 1,
          });
        } else {
          set({ recoveryFailedAttempts: next });
        }
      },
      resetRecoveryAttempts: () =>
        set({ recoveryFailedAttempts: 0, recoveryLockoutUntil: null, recoveryLockoutCount: 0 }),

      resetSecurity: () =>
        set({
          lockEnabled: false,
          privacyMode: false,
          failedAttempts: 0,
          lockoutUntil: null,
          lockoutCount: 0,
          isLocked: false,
          recoveryFailedAttempts: 0,
          recoveryLockoutUntil: null,
          recoveryLockoutCount: 0,
        }),
    }),
    {
      name: "security",
      storage: createJSONStorage(() => mmkvStorage),
      partialize: ({
        lockEnabled,
        privacyMode,
        failedAttempts,
        lockoutUntil,
        lockoutCount,
        recoveryFailedAttempts,
        recoveryLockoutUntil,
        recoveryLockoutCount,
      }) => ({
        lockEnabled,
        privacyMode,
        failedAttempts,
        lockoutUntil,
        lockoutCount,
        recoveryFailedAttempts,
        recoveryLockoutUntil,
        recoveryLockoutCount,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.lockEnabled) {
          state.isLocked = true;
        }
      },
    },
  ),
);
