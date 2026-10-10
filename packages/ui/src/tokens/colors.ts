/**
 * Color palette for the moments platform.
 *
 * The palette is intentionally warm and contemplative — a quiet, sacred
 * space for audio. Dark mode is the default experience.
 */

export const colors = {
  // Core surfaces
  background: '#0E0D0B',
  surface: '#1A1815',
  surfaceElevated: '#24211C',
  surfaceOverlay: 'rgba(14, 13, 11, 0.92)',

  // Text
  text: '#F5F1E8',
  textSecondary: '#B8B0A0',
  textMuted: '#7A7264',

  // Brand — warm amber/gold, evocative of candlelight
  brand: '#E8B44A',
  brandSoft: '#F2CE8A',
  brandDeep: '#B8862B',

  // Accents
  accent: '#7FB8A4',
  accentSoft: '#A9D4C4',

  // Semantic
  success: '#6FBF8B',
  warning: '#E8B44A',
  danger: '#E06C5B',
  info: '#7FB8A4',

  // Borders
  border: '#2E2A23',
  borderStrong: '#3D382E',

  // Audio waveform
  waveform: '#E8B44A',
  waveformPlayed: '#F2CE8A',
  waveformRemaining: '#3D382E',
} as const;

export type Color = keyof typeof colors;
