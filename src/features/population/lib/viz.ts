import { useTheme } from '@/context/theme-provider'
import type { Subregion } from './stats'

/**
 * Chart tokens. Categorical slots, sequential blue ramp and the blue↔red
 * diverging pair come from a colour-blind-validated palette; light and dark
 * are each stepped for their own surface (not an automatic flip).
 */
const LIGHT = {
  mode: 'light' as 'light' | 'dark',
  text: '#0b0b0b',
  text2: '#52514e',
  muted: '#898781',
  grid: '#e1e0d9',
  axis: '#c3c2b7',
  surface: '#ffffff',
  noData: '#e6e5e0',
  series: [
    '#2a78d6',
    '#eb6834',
    '#1baf7a',
    '#eda100',
    '#e87ba4',
    '#008300',
    '#6250d6',
    '#e34948',
  ],
  subregion: {
    south: '#2a78d6',
    central: '#eb6834',
    caribbean: '#1baf7a',
  } as Record<Subregion, string>,
  // sequential blue, light → dark
  seq: [
    '#cde2fb',
    '#9ec5f4',
    '#6da7ec',
    '#3987e5',
    '#256abf',
    '#184f95',
    '#0d366b',
  ],
  // diverging: red (decline) … gray … blue (growth)
  div: [
    '#a62b2b',
    '#e34948',
    '#f2a6a5',
    '#f0efec',
    '#9ec5f4',
    '#3987e5',
    '#184f95',
  ],
}

const DARK: typeof LIGHT = {
  mode: 'dark',
  text: '#f0efec',
  text2: '#c3c2b7',
  muted: '#898781',
  grid: '#2c2c2a',
  axis: '#383835',
  surface: '#08111f',
  noData: '#2a2a28',
  series: [
    '#3987e5',
    '#d95926',
    '#199e70',
    '#c98500',
    '#d55181',
    '#0ca30c',
    '#9085e9',
    '#e66767',
  ],
  subregion: {
    south: '#3987e5',
    central: '#d95926',
    caribbean: '#199e70',
  },
  seq: [
    '#1b2b44',
    '#104281',
    '#184f95',
    '#256abf',
    '#3987e5',
    '#6da7ec',
    '#b7d3f6',
  ],
  div: [
    '#f28b8a',
    '#e66767',
    '#7a3434',
    '#383835',
    '#1c4a85',
    '#3987e5',
    '#9ec5f4',
  ],
}

export type VizTheme = typeof LIGHT

export function useViz(): VizTheme {
  const { resolvedTheme } = useTheme()
  return resolvedTheme === 'dark' ? DARK : LIGHT
}

export const FONT =
  'Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif'

/** Tooltip shell shared by every ECharts chart. */
export const tooltipBase = (t: VizTheme) => ({
  backgroundColor: t.mode === 'light' ? '#ffffff' : '#0f172a',
  borderColor:
    t.mode === 'light' ? 'rgba(11,11,11,0.10)' : 'rgba(255,255,255,0.10)',
  borderWidth: 1,
  padding: [8, 12],
  textStyle: { color: t.text, fontFamily: FONT, fontSize: 12 },
  extraCssText:
    'border-radius:10px;box-shadow:0 8px 24px -8px rgba(0,0,0,.25);',
})

export const swatch = (color: string) =>
  `<span style="display:inline-block;width:8px;height:8px;border-radius:2px;background:${color};margin-right:6px"></span>`
