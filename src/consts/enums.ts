export const INTERVAL_UNIT = { DAILY: 0, WEEKLY: 1, MONTHLY: 2, YEARLY: 3 } as const;
export type IntervalUnit = (typeof INTERVAL_UNIT)[keyof typeof INTERVAL_UNIT];

export const INTERVAL_LABEL: Record<IntervalUnit, string> = {
  [INTERVAL_UNIT.DAILY]: "daily",
  [INTERVAL_UNIT.WEEKLY]: "weekly",
  [INTERVAL_UNIT.MONTHLY]: "monthly",
  [INTERVAL_UNIT.YEARLY]: "yearly",
};

export const PRIORITY = { LOW: 1, MEDIUM: 2, HIGH: 3 } as const;
export type Priority = (typeof PRIORITY)[keyof typeof PRIORITY];

export const PRIORITY_LABEL: Record<Priority, string> = {
  [PRIORITY.LOW]: "low",
  [PRIORITY.MEDIUM]: "medium",
  [PRIORITY.HIGH]: "high",
};
