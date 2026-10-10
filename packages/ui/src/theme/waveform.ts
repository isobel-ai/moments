import type { WaveformBar } from '../components/Waveform';

/**
 * Deterministic pseudo-random generator so waveform bars are stable across
 * renders and platforms.
 */
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Builds a wavy two-lobe waveform silhouette of `count` bars. Heights follow a
 * gentle sine envelope with a deterministic jitter, matching the design's
 * "wavy overall silhouette".
 */
export function makeWaveformBars(
  count: number,
  maxHeight: number,
  seed = 1,
  color = '#3156B8',
): WaveformBar[] {
  const rand = mulberry32(seed);
  const bars: WaveformBar[] = [];
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    // Two-lobe envelope: peaks around 0.3 and 0.7.
    const envelope =
      Math.sin(t * Math.PI * 2) * 0.5 + Math.sin(t * Math.PI * 4) * 0.2;
    const base = 0.35 + Math.abs(envelope) * 0.55;
    const jitter = rand() * 0.25;
    const h = Math.max(4, Math.min(1, base + jitter)) * maxHeight;
    bars.push({ h, c: color });
  }
  return bars;
}

/**
 * Builds a flat, mostly-uniform mini waveform for compact player cards.
 */
export function makeMiniBars(
  count: number,
  maxHeight: number,
  seed = 1,
  color = '#3156B8',
): WaveformBar[] {
  const rand = mulberry32(seed);
  const bars: WaveformBar[] = [];
  for (let i = 0; i < count; i++) {
    const h = Math.max(4, (0.4 + rand() * 0.6) * maxHeight);
    bars.push({ h, c: color });
  }
  return bars;
}
