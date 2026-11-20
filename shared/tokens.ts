/** DigProg shared tokens — import from Remotion + site */
export const digprog = {
  blue: "#2457E6",
  blueDeep: "#102A56",
  blueBright: "#7EA6FF",
  orange: "#FF8A3D",
  orangeDark: "#A83B08",
  bg: "#F6F8FC",
  surface: "#FFFFFF",
  videoDark: "#0B1730",
  text: "#13233D",
  textSecondary: "#52627A",
  textLight: "#F7FAFF",
  success: "#15803D",
  error: "#B91C1C",
  line: "#D5DCE8",
  customer: "#2457E6",
  offer: "#FF8A3D",
  delivery: "#102A56",
  font: 'Manrope, system-ui, -apple-system, "Segoe UI", sans-serif',
  mono: '"IBM Plex Mono", ui-monospace, Menlo, monospace',
} as const;

export type DigProgTokens = typeof digprog;
