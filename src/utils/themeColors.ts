export const colors = {
  background: "var(--background)",
  card: "var(--card)",
  surface: "var(--surface)",
  border: "var(--border)",
  ring: "var(--ring)",
  muted: "var(--muted)",
  foreground: "var(--foreground)",
  accent: "var(--accent)"
} as const;

export type ThemeColors = typeof colors;
