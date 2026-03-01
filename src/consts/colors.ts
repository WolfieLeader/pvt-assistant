export const PRIMARY = {
  50: "#fff1f3",
  100: "#fee5e9",
  200: "#fdcdd8",
  300: "#fca5b8",
  400: "#f97190",
  500: "#f2416c",
  600: "#e01f53",
  700: "#be1344",
  800: "#9f133e",
  900: "#87143a",
  950: "#4d051c",
} as const;

export const SEMANTIC_LIGHT = {
  background: "#fcfcfc",
  card: "#ffffff",
  text: "#1a1a1a",
  muted: "#71717a",
  accent: PRIMARY[500],
  success: "#22c55e",
  danger: "#dc2626",
  border: "#e4e4e7",
} as const;

export const SEMANTIC_DARK = {
  background: "#0a0a0a",
  card: "#161616",
  text: "#f5f5f5",
  muted: "#a1a1aa",
  accent: PRIMARY[400],
  success: "#4ade80",
  danger: "#f87171",
  border: "#27272a",
} as const;
