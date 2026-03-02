import { useSettingsStore } from "~/stores/settings";

export const toCents = (dollars: number) => Math.round(dollars * 100);

export const fromCents = (cents: number) => cents / 100;

export const formatAmount = (cents: number, currency?: string) => {
  const curr = currency ?? useSettingsStore.getState().currency;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: curr,
  }).format(fromCents(cents));
};
