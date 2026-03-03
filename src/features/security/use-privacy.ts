import { useCallback } from "react";
import { formatAmount as formatAmountRaw } from "~/utils/amount";
import { useSecurityStore } from "./store";

const MASK = "•••";

export function usePrivacy() {
  const privacyMode = useSecurityStore((s) => s.privacyMode);
  const togglePrivacyMode = useSecurityStore((s) => s.togglePrivacyMode);

  const formatAmount = useCallback(
    (cents: number, currency?: string) => {
      if (privacyMode) return MASK;
      return formatAmountRaw(cents, currency);
    },
    [privacyMode],
  );

  const formatHours = useCallback(
    (hours: number) => {
      if (privacyMode) return `${MASK} hrs`;
      return `${hours} hrs`;
    },
    [privacyMode],
  );

  const mask = useCallback(
    (value: string) => {
      if (privacyMode) return MASK;
      return value;
    },
    [privacyMode],
  );

  return { privacyMode, togglePrivacyMode, formatAmount, formatHours, mask } as const;
}
