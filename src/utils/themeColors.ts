export const colors = {
  dark: {
    background: "#000000",
    card: "#141414",
    surface: "#19191F",
    border: "#292932",
    ring: "#3F3F46",
    muted: "#71717A",
    foreground: "#FAFAFA"
  },
  light: {
    background: "#FFFFFF",
    card: "#DDDDDD",
    surface: "#CCCCCC",
    border: "#BBBBBB",
    ring: "#A1A1AA",
    muted: "#52525B",
    foreground: "#09090B"
  }
} as const;

export type ThemeColors = typeof colors;
