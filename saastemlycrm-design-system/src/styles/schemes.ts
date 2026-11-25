export interface SchemeSwatch {
  base: string;
  primary: string;
  secondary: string;
  accent: string;
}

export interface Scheme {
  id: string;
  label: string;
  light: SchemeSwatch;
  dark: SchemeSwatch;
}

export const SCHEMES: Scheme[] = [
  {
    id: "modern-minimal",
    label: "Modern Minimal",
    light: {
      base: "oklch(1.00 0 0)",
      primary: "oklch(0.62 0.19 259.81)",
      secondary: "oklch(0.97 0.00 264.54)",
      accent: "oklch(0.95 0.03 236.82)",
    },
    dark: {
      base: "oklch(0.20 0 0)",
      primary: "oklch(0.62 0.19 259.81)",
      secondary: "oklch(0.27 0 0)",
      accent: "oklch(0.38 0.14 265.52)",
    },
  },
  {
    id: "t3-chat",
    label: "T3 Chat",
    light: {
      base: "oklch(0.98 0.01 325.64)",
      primary: "oklch(0.53 0.14 355.20)",
      secondary: "oklch(0.87 0.07 334.90)",
      accent: "oklch(0.87 0.07 334.90)",
    },
    dark: {
      base: "oklch(0.24 0.02 307.53)",
      primary: "oklch(0.46 0.19 4.10)",
      secondary: "oklch(0.31 0.03 310.06)",
      accent: "oklch(0.36 0.05 308.49)",
    },
  },
  {
    id: "twitter",
    label: "Twitter",
    light: {
      base: "oklch(1.00 0 0)",
      primary: "oklch(0.67 0.16 245.00)",
      secondary: "oklch(0.19 0.01 248.51)",
      accent: "oklch(0.94 0.02 250.85)",
    },
    dark: {
      base: "oklch(0 0 0)",
      primary: "oklch(0.67 0.16 245.01)",
      secondary: "oklch(0.96 0.00 219.53)",
      accent: "oklch(0.19 0.03 242.55)",
    },
  },
  {
    id: "mocha-mousse",
    label: "Mocha Mousse",
    light: {
      base: "oklch(0.95 0.01 102.46)",
      primary: "oklch(0.61 0.06 44.36)",
      secondary: "oklch(0.75 0.04 80.55)",
      accent: "oklch(0.85 0.04 49.09)",
    },
    dark: {
      base: "oklch(0.27 0.01 48.18)",
      primary: "oklch(0.73 0.05 52.33)",
      secondary: "oklch(0.54 0.05 37.21)",
      accent: "oklch(0.75 0.04 80.55)",
    },
  },
  {
    id: "bubblegum",
    label: "Bubblegum",
    light: {
      base: "oklch(0.94 0.02 345.70)",
      primary: "oklch(0.62 0.18 348.14)",
      secondary: "oklch(0.81 0.07 198.19)",
      accent: "oklch(0.92 0.08 87.67)",
    },
    dark: {
      base: "oklch(0.25 0.03 234.16)",
      primary: "oklch(0.92 0.08 87.67)",
      secondary: "oklch(0.78 0.08 4.13)",
      accent: "oklch(0.67 0.10 356.98)",
    },
  },
  {
    id: "doom-64",
    label: "Doom 64",
    light: {
      base: "oklch(0.85 0 0)",
      primary: "oklch(0.50 0.19 27.48)",
      secondary: "oklch(0.50 0.09 126.19)",
      accent: "oklch(0.59 0.10 245.74)",
    },
    dark: {
      base: "oklch(0.22 0 0)",
      primary: "oklch(0.61 0.21 27.03)",
      secondary: "oklch(0.64 0.15 133.01)",
      accent: "oklch(0.75 0.12 244.75)",
    },
  },
  {
    id: "catppuccin",
    label: "Catppuccin",
    light: {
      base: "oklch(0.96 0.01 264.53)",
      primary: "oklch(0.55 0.25 297.02)",
      secondary: "oklch(0.86 0.01 268.48)",
      accent: "oklch(0.68 0.14 235.38)",
    },
    dark: {
      base: "oklch(0.22 0.03 284.06)",
      primary: "oklch(0.79 0.12 304.77)",
      secondary: "oklch(0.48 0.03 278.64)",
      accent: "oklch(0.85 0.08 210.25)",
    },
  },
  {
    id: "graphite",
    label: "Graphite",
    light: {
      base: "oklch(0.96 0 0)",
      primary: "oklch(0.49 0 0)",
      secondary: "oklch(0.91 0 0)",
      accent: "oklch(0.81 0 0)",
    },
    dark: {
      base: "oklch(0.22 0 0)",
      primary: "oklch(0.71 0 0)",
      secondary: "oklch(0.31 0 0)",
      accent: "oklch(0.37 0 0)",
    },
  },
  {
    id: "perpetuity",
    label: "Perpetuity",
    light: {
      base: "oklch(0.95 0.01 197.01)",
      primary: "oklch(0.56 0.09 203.28)",
      secondary: "oklch(0.92 0.02 196.84)",
      accent: "oklch(0.90 0.03 201.89)",
    },
    dark: {
      base: "oklch(0.21 0.02 224.45)",
      primary: "oklch(0.85 0.13 195.04)",
      secondary: "oklch(0.38 0.06 216.50)",
      accent: "oklch(0.38 0.06 216.50)",
    },
  },
  {
    id: "kodama-grove",
    label: "Kodama Grove",
    light: {
      base: "oklch(0.88 0.05 91.79)",
      primary: "oklch(0.67 0.11 118.91)",
      secondary: "oklch(0.85 0.06 91.15)",
      accent: "oklch(0.84 0.07 90.33)",
    },
    dark: {
      base: "oklch(0.33 0.02 88.07)",
      primary: "oklch(0.68 0.06 132.45)",
      secondary: "oklch(0.44 0.02 84.55)",
      accent: "oklch(0.65 0.07 90.76)",
    },
  },
  {
    id: "cosmic-night",
    label: "Cosmic Night",
    light: {
      base: "oklch(0.97 0.01 286.15)",
      primary: "oklch(0.54 0.18 288.03)",
      secondary: "oklch(0.92 0.04 292.69)",
      accent: "oklch(0.92 0.04 262.14)",
    },
    dark: {
      base: "oklch(0.17 0.02 283.80)",
      primary: "oklch(0.72 0.16 290.40)",
      secondary: "oklch(0.31 0.07 283.46)",
      accent: "oklch(0.34 0.08 280.97)",
    },
  },
  {
    id: "tangerine",
    label: "Tangerine",
    light: {
      base: "oklch(0.94 0.00 236.50)",
      primary: "oklch(0.64 0.17 36.44)",
      secondary: "oklch(0.97 0.00 264.54)",
      accent: "oklch(0.91 0.02 243.82)",
    },
    dark: {
      base: "oklch(0.26 0.03 262.67)",
      primary: "oklch(0.64 0.17 36.44)",
      secondary: "oklch(0.31 0.03 266.71)",
      accent: "oklch(0.34 0.06 267.59)",
    },
  },
  {
    id: "quantum-rose",
    label: "Quantum Rose",
    light: {
      base: "oklch(0.97 0.02 343.93)",
      primary: "oklch(0.60 0.24 0.13)",
      secondary: "oklch(0.92 0.07 326.13)",
      accent: "oklch(0.88 0.08 344.88)",
    },
    dark: {
      base: "oklch(0.18 0.05 313.72)",
      primary: "oklch(0.75 0.23 332.02)",
      secondary: "oklch(0.32 0.09 319.65)",
      accent: "oklch(0.36 0.12 325.77)",
    },
  },
  {
    id: "nature",
    label: "Nature",
    light: {
      base: "oklch(0.97 0.01 80.72)",
      primary: "oklch(0.52 0.13 144.17)",
      secondary: "oklch(0.96 0.02 147.64)",
      accent: "oklch(0.90 0.05 146.04)",
    },
    dark: {
      base: "oklch(0.27 0.03 150.77)",
      primary: "oklch(0.67 0.16 144.21)",
      secondary: "oklch(0.39 0.03 142.99)",
      accent: "oklch(0.58 0.14 144.18)",
    },
  },
  {
    id: "bold-tech",
    label: "Bold Tech",
    light: {
      base: "oklch(1.00 0 0)",
      primary: "oklch(0.61 0.22 292.72)",
      secondary: "oklch(0.96 0.02 295.19)",
      accent: "oklch(0.93 0.03 255.59)",
    },
    dark: {
      base: "oklch(0.21 0.04 265.75)",
      primary: "oklch(0.61 0.22 292.72)",
      secondary: "oklch(0.26 0.09 281.29)",
      accent: "oklch(0.46 0.21 277.02)",
    },
  },
  {
    id: "elegant-luxury",
    label: "Elegant Luxury",
    light: {
      base: "oklch(0.98 0.00 56.38)",
      primary: "oklch(0.47 0.15 24.94)",
      secondary: "oklch(0.96 0.04 89.09)",
      accent: "oklch(0.96 0.06 95.62)",
    },
    dark: {
      base: "oklch(0.22 0.01 56.04)",
      primary: "oklch(0.51 0.19 27.52)",
      secondary: "oklch(0.47 0.12 46.20)",
      accent: "oklch(0.56 0.15 49.00)",
    },
  },
  {
    id: "amber-minimal",
    label: "Amber Minimal",
    light: {
      base: "oklch(1.00 0 0)",
      primary: "oklch(0.77 0.16 70.08)",
      secondary: "oklch(0.97 0.00 264.54)",
      accent: "oklch(0.99 0.02 95.28)",
    },
    dark: {
      base: "oklch(0.20 0 0)",
      primary: "oklch(0.77 0.16 70.08)",
      secondary: "oklch(0.27 0 0)",
      accent: "oklch(0.47 0.12 46.20)",
    },
  },
  {
    id: "supabase",
    label: "Supabase",
    light: {
      base: "oklch(0.99 0 0)",
      primary: "oklch(0.83 0.13 160.91)",
      secondary: "oklch(0.99 0 0)",
      accent: "oklch(0.95 0 0)",
    },
    dark: {
      base: "oklch(0.18 0 0)",
      primary: "oklch(0.44 0.10 156.76)",
      secondary: "oklch(0.26 0 0)",
      accent: "oklch(0.31 0 0)",
    },
  },
  {
    id: "neo-brutalism",
    label: "Neo Brutalism",
    light: {
      base: "oklch(1.00 0 0)",
      primary: "oklch(0.65 0.24 26.97)",
      secondary: "oklch(0.97 0.21 109.77)",
      accent: "oklch(0.56 0.24 260.82)",
    },
    dark: {
      base: "oklch(0 0 0)",
      primary: "oklch(0.70 0.19 23.19)",
      secondary: "oklch(0.97 0.20 109.62)",
      accent: "oklch(0.68 0.18 252.26)",
    },
  },
  {
    id: "solar-dusk",
    label: "Solar Dusk",
    light: {
      base: "oklch(0.99 0.01 84.57)",
      primary: "oklch(0.56 0.15 49.00)",
      secondary: "oklch(0.83 0.08 74.44)",
      accent: "oklch(0.90 0.05 74.99)",
    },
    dark: {
      base: "oklch(0.22 0.01 56.04)",
      primary: "oklch(0.70 0.19 47.60)",
      secondary: "oklch(0.44 0.01 73.64)",
      accent: "oklch(0.36 0.05 229.32)",
    },
  },
  {
    id: "claymorphism",
    label: "Claymorphism",
    light: {
      base: "oklch(0.92 0.00 48.72)",
      primary: "oklch(0.59 0.20 277.12)",
      secondary: "oklch(0.87 0.00 56.37)",
      accent: "oklch(0.94 0.03 321.94)",
    },
    dark: {
      base: "oklch(0.22 0.01 67.44)",
      primary: "oklch(0.68 0.16 276.93)",
      secondary: "oklch(0.34 0.01 59.42)",
      accent: "oklch(0.39 0.01 59.47)",
    },
  },
  {
    id: "cyberpunk",
    label: "Cyberpunk",
    light: {
      base: "oklch(0.98 0.00 247.84)",
      primary: "oklch(0.67 0.29 341.41)",
      secondary: "oklch(0.96 0.02 286.02)",
      accent: "oklch(0.89 0.17 171.27)",
    },
    dark: {
      base: "oklch(0.16 0.04 281.83)",
      primary: "oklch(0.67 0.29 341.41)",
      secondary: "oklch(0.25 0.06 281.14)",
      accent: "oklch(0.89 0.17 171.27)",
    },
  },
  {
    id: "pastel-dreams",
    label: "Pastel Dreams",
    light: {
      base: "oklch(0.97 0.01 314.78)",
      primary: "oklch(0.71 0.16 293.54)",
      secondary: "oklch(0.91 0.05 306.09)",
      accent: "oklch(0.94 0.03 321.94)",
    },
    dark: {
      base: "oklch(0.22 0.01 56.04)",
      primary: "oklch(0.79 0.12 295.75)",
      secondary: "oklch(0.34 0.04 308.85)",
      accent: "oklch(0.39 0.05 304.64)",
    },
  },
  {
    id: "clean-slate",
    label: "Clean Slate",
    light: {
      base: "oklch(0.98 0.00 247.86)",
      primary: "oklch(0.59 0.20 277.12)",
      secondary: "oklch(0.93 0.01 264.53)",
      accent: "oklch(0.93 0.03 272.79)",
    },
    dark: {
      base: "oklch(0.21 0.04 265.75)",
      primary: "oklch(0.68 0.16 276.93)",
      secondary: "oklch(0.34 0.03 260.91)",
      accent: "oklch(0.37 0.03 259.73)",
    },
  },
  {
    id: "caffeine",
    label: "Caffeine",
    light: {
      base: "oklch(0.98 0 0)",
      primary: "oklch(0.43 0.04 41.99)",
      secondary: "oklch(0.92 0.07 74.37)",
      accent: "oklch(0.93 0 0)",
    },
    dark: {
      base: "oklch(0.18 0 0)",
      primary: "oklch(0.92 0.05 66.17)",
      secondary: "oklch(0.32 0.02 63.70)",
      accent: "oklch(0.29 0 0)",
    },
  },
  {
    id: "ocean-breeze",
    label: "Ocean Breeze",
    light: {
      base: "oklch(0.98 0.01 244.25)",
      primary: "oklch(0.72 0.19 149.58)",
      secondary: "oklch(0.95 0.03 236.82)",
      accent: "oklch(0.95 0.05 163.05)",
    },
    dark: {
      base: "oklch(0.21 0.04 265.75)",
      primary: "oklch(0.77 0.15 163.22)",
      secondary: "oklch(0.34 0.03 260.91)",
      accent: "oklch(0.37 0.03 259.73)",
    },
  },
  {
    id: "retro-arcade",
    label: "Retro Arcade",
    light: {
      base: "oklch(0.97 0.03 90.10)",
      primary: "oklch(0.59 0.20 355.89)",
      secondary: "oklch(0.64 0.10 187.38)",
      accent: "oklch(0.58 0.17 39.50)",
    },
    dark: {
      base: "oklch(0.27 0.05 219.82)",
      primary: "oklch(0.59 0.20 355.89)",
      secondary: "oklch(0.64 0.10 187.38)",
      accent: "oklch(0.58 0.17 39.50)",
    },
  },
  {
    id: "midnight-bloom",
    label: "Midnight Bloom",
    light: {
      base: "oklch(0.98 0 0)",
      primary: "oklch(0.57 0.20 283.08)",
      secondary: "oklch(0.82 0.07 249.35)",
      accent: "oklch(0.65 0.06 117.43)",
    },
    dark: {
      base: "oklch(0.23 0.01 264.29)",
      primary: "oklch(0.57 0.20 283.08)",
      secondary: "oklch(0.34 0.18 301.68)",
      accent: "oklch(0.67 0.14 261.34)",
    },
  },
  {
    id: "candyland",
    label: "Candyland",
    light: {
      base: "oklch(0.98 0.00 228.78)",
      primary: "oklch(0.87 0.07 7.09)",
      secondary: "oklch(0.81 0.08 225.75)",
      accent: "oklch(0.97 0.21 109.77)",
    },
    dark: {
      base: "oklch(0.23 0.01 264.29)",
      primary: "oklch(0.80 0.14 349.23)",
      secondary: "oklch(0.74 0.23 142.85)",
      accent: "oklch(0.81 0.08 225.75)",
    },
  },
  {
    id: "northern-lights",
    label: "Northern Lights",
    light: {
      base: "oklch(0.98 0.00 286.38)",
      primary: "oklch(0.65 0.15 150.31)",
      secondary: "oklch(0.67 0.14 261.34)",
      accent: "oklch(0.83 0.11 211.96)",
    },
    dark: {
      base: "oklch(0.23 0.01 264.29)",
      primary: "oklch(0.65 0.15 150.31)",
      secondary: "oklch(0.59 0.10 245.74)",
      accent: "oklch(0.67 0.14 261.34)",
    },
  },
  {
    id: "vintage-paper",
    label: "Vintage Paper",
    light: {
      base: "oklch(0.96 0.02 90.24)",
      primary: "oklch(0.62 0.08 65.54)",
      secondary: "oklch(0.88 0.03 85.57)",
      accent: "oklch(0.83 0.04 88.81)",
    },
    dark: {
      base: "oklch(0.27 0.01 57.65)",
      primary: "oklch(0.73 0.06 66.70)",
      secondary: "oklch(0.38 0.02 57.13)",
      accent: "oklch(0.42 0.03 56.34)",
    },
  },
  {
    id: "sunset-horizon",
    label: "Sunset Horizon",
    light: {
      base: "oklch(0.99 0.01 56.32)",
      primary: "oklch(0.74 0.16 34.71)",
      secondary: "oklch(0.96 0.02 28.90)",
      accent: "oklch(0.83 0.11 58.00)",
    },
    dark: {
      base: "oklch(0.26 0.02 352.40)",
      primary: "oklch(0.74 0.16 34.71)",
      secondary: "oklch(0.36 0.02 342.27)",
      accent: "oklch(0.83 0.11 58.00)",
    },
  },
  {
    id: "starry-night",
    label: "Starry Night",
    light: {
      base: "oklch(0.98 0.00 258.32)",
      primary: "oklch(0.48 0.12 263.38)",
      secondary: "oklch(0.86 0.12 81.01)",
      accent: "oklch(0.69 0.07 234.04)",
    },
    dark: {
      base: "oklch(0.22 0.02 275.84)",
      primary: "oklch(0.48 0.12 263.38)",
      secondary: "oklch(0.91 0.14 95.11)",
      accent: "oklch(0.85 0.05 264.78)",
    },
  },
  {
    id: "claude",
    label: "Claude",
    light: {
      base: "oklch(0.98 0.01 95.10)",
      primary: "oklch(0.62 0.14 39.04)",
      secondary: "oklch(0.92 0.01 92.99)",
      accent: "oklch(0.92 0.01 92.99)",
    },
    dark: {
      base: "oklch(0.27 0.00 106.64)",
      primary: "oklch(0.67 0.13 38.76)",
      secondary: "oklch(0.98 0.01 95.10)",
      accent: "oklch(0.21 0.01 95.42)",
    },
  },
  {
    id: "vercel",
    label: "Vercel",
    light: {
      base: "oklch(0.99 0 0)",
      primary: "oklch(0 0 0)",
      secondary: "oklch(0.94 0 0)",
      accent: "oklch(0.94 0 0)",
    },
    dark: {
      base: "oklch(0 0 0)",
      primary: "oklch(1 0 0)",
      secondary: "oklch(0.25 0 0)",
      accent: "oklch(0.32 0 0)",
    },
  },
  {
    id: "mono",
    label: "Mono",
    light: {
      base: "oklch(1.00 0 0)",
      primary: "oklch(0.56 0 0)",
      secondary: "oklch(0.97 0 0)",
      accent: "oklch(0.97 0 0)",
    },
    dark: {
      base: "oklch(0.14 0 0)",
      primary: "oklch(0.56 0 0)",
      secondary: "oklch(0.27 0 0)",
      accent: "oklch(0.37 0 0)",
    },
  },
];
