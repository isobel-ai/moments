/** Typography scale for the moments platform. */

export const typography = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    semibold: 'System',
    bold: 'System',
  },
  size: {
    caption: 12,
    body: 16,
    bodyLarge: 18,
    title: 22,
    heading: 28,
    display: 34,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
  },
  weight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
} as const;

export type Typography = typeof typography;
