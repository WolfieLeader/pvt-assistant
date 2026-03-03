export const PIN_LENGTH = 6;
export const INITIAL_ATTEMPTS = 5;
export const RETRY_ATTEMPTS = 3;
export const LOCKOUT_STAGES_MS = [10_000, 30_000, 60_000, 120_000] as const;
export const LOCK_GRACE_MS = 300_000;

export const RECOVERY_QUESTIONS = [
  { id: 0, label: "What city was your mother born in?" },
  { id: 1, label: "What was the name of your first pet?" },
  { id: 2, label: "What street did you grow up on?" },
  { id: 3, label: "Who was your favorite teacher?" },
  { id: 4, label: "What was the name of your first school?" },
  { id: 5, label: "What is your oldest sibling's middle name?" },
  { id: 6, label: "In what city did you get your first job?" },
  { id: 7, label: "What was the make of your first car?" },
] as const;
