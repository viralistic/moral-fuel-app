import type { TextStyle } from 'react-native';

/**
 * Brand palette (see styling/STYLE_GUIDE.md). Screens use the semantic colors below, never these
 * directly. The brand is dark-only: one calm charcoal canvas, white type, and a single ember accent.
 */
export const palette = {
  night: '#1F1E1F',
  ink: '#171617',
  graphite: '#262526',
  slate: '#2C2B2C',
  smoke: '#333233',
  steel: '#3A393A',
  iron: '#6E6C6E',
  ash: '#A3A1A3',
  chalk: '#F5F3F5',
  white: '#FFFFFF',
  ember: '#E2572B',
  emberLight: '#EE7748',
  emberDeep: '#3A2520',
  coral: '#F28B7B',
} as const;

export interface ColorTokens {
  /** The page canvas. */
  background: string;
  /** Cards and grouped rows. */
  surface: string;
  /** The one featured card on a screen (today's lesson, the action to live). */
  surfaceRaised: string;
  /** Pressed rows, icon wells, quiet panels. */
  surfaceMuted: string;
  /** A selected option or filled track. */
  selected: string;
  /** Hairlines and card edges (decorative). */
  border: string;
  /** Outlines that mark a control: inputs, outline buttons, progress tracks (3:1 on the canvas). */
  borderStrong: string;
  text: string;
  textMuted: string;
  /** Filled buttons, done markers and progress fills: white on charcoal. */
  primary: string;
  onPrimary: string;
  /** Ember: indicators, rules, dots and icons. Use sparingly, one focal point per screen. */
  accent: string;
  /** Ember for text, readable on every surface. */
  accentText: string;
  /** A faint ember wash behind accent icons. */
  accentSoft: string;
  /** The giant logotype watermark, just darker than the canvas. */
  watermark: string;
  danger: string;
  focus: string;
}

export const colors: ColorTokens = {
  background: palette.night,
  surface: palette.graphite,
  surfaceRaised: palette.slate,
  surfaceMuted: palette.smoke,
  selected: palette.smoke,
  border: palette.steel,
  borderStrong: palette.iron,
  text: palette.white,
  textMuted: palette.ash,
  primary: palette.chalk,
  onPrimary: palette.night,
  accent: palette.ember,
  accentText: palette.emberLight,
  accentSoft: palette.emberDeep,
  watermark: palette.ink,
  danger: palette.coral,
  focus: palette.ember,
};

export const spacing = { xxs: 4, xs: 8, sm: 12, md: 16, lg: 24, xl: 32, xxl: 48 } as const;
export const radius = { sm: 10, md: 14, lg: 18, pill: 999 } as const;

/** Readable column width on tablets and the web. */
export const MAX_CONTENT_WIDTH = 640;

/**
 * Font families, loaded in src/app/_layout.tsx. Custom fonts ignore fontWeight on Android, so a
 * weight is always chosen by family name, never with fontWeight.
 */
export const fonts = {
  /** Tomorrow: headings and big numbers. */
  display: 'Tomorrow_600SemiBold',
  /** Poppins: everything else. */
  light: 'Poppins_300Light',
  lightItalic: 'Poppins_300Light_Italic',
  regular: 'Poppins_400Regular',
  medium: 'Poppins_500Medium',
  semibold: 'Poppins_600SemiBold',
} as const;

export type TextVariant =
  | 'display'
  | 'title'
  | 'heading'
  | 'quote'
  | 'scripture'
  | 'body'
  | 'bodyStrong'
  | 'small'
  | 'caption'
  | 'overline';

export const typography: Record<TextVariant, TextStyle> = {
  display: { fontFamily: fonts.display, fontSize: 34, lineHeight: 40, letterSpacing: 0.6 },
  title: { fontFamily: fonts.display, fontSize: 26, lineHeight: 32, letterSpacing: 0.4 },
  heading: { fontFamily: fonts.display, fontSize: 20, lineHeight: 26, letterSpacing: 0.3 },
  quote: { fontFamily: fonts.lightItalic, fontSize: 18, lineHeight: 28 },
  scripture: { fontFamily: fonts.regular, fontSize: 17, lineHeight: 29 },
  body: { fontFamily: fonts.regular, fontSize: 16, lineHeight: 25 },
  bodyStrong: { fontFamily: fonts.medium, fontSize: 16, lineHeight: 25 },
  small: { fontFamily: fonts.light, fontSize: 14, lineHeight: 21 },
  caption: { fontFamily: fonts.regular, fontSize: 13, lineHeight: 18 },
  overline: { fontFamily: fonts.medium, fontSize: 12, lineHeight: 16, letterSpacing: 1.6, textTransform: 'uppercase' },
};
