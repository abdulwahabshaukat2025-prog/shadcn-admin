import {
  COUNTRIES,
  YEARS,
  type CountrySeries,
  type Subregion,
} from '../data/population'

export { COUNTRIES, YEARS }
export type { CountrySeries, Subregion }

export const FIRST = 0
export const LAST = YEARS.length - 1

export const SUBREGIONS: { id: Subregion; label: string; short: string }[] = [
  { id: 'south', label: 'South America', short: 'South Am.' },
  { id: 'central', label: 'Central America & Mexico', short: 'Central Am.' },
  { id: 'caribbean', label: 'Caribbean', short: 'Caribbean' },
]

export const subregionLabel = (id: Subregion) =>
  SUBREGIONS.find((s) => s.id === id)!.label

/** Sum of every country for each year. */
export const REGION_TOTAL: number[] = YEARS.map((_, i) =>
  COUNTRIES.reduce((sum, c) => sum + c.values[i], 0)
)

export const subregionTotals = (id: Subregion): number[] =>
  YEARS.map((_, i) =>
    COUNTRIES.filter((c) => c.subregion === id).reduce(
      (sum, c) => sum + c.values[i],
      0
    )
  )

/** Year-over-year additions; index 0 is the change from 2010 to 2011. */
export const yearlyAdditions = (series: number[]) =>
  series.slice(1).map((v, i) => v - series[i])

export const growthPct = (from: number, to: number) => (to / from - 1) * 100

/** Compound annual growth rate in % over the series. */
export const cagr = (series: number[]) =>
  (Math.pow(series[series.length - 1] / series[0], 1 / (series.length - 1)) -
    1) *
  100

export const countryGrowth = (c: CountrySeries) =>
  growthPct(c.values[FIRST], c.values[LAST])

export const byCode = Object.fromEntries(COUNTRIES.map((c) => [c.code, c]))

/* ---------- formatting ---------- */

const nf = new Intl.NumberFormat('en-US')

export const fmtInt = (n: number) => nf.format(Math.round(n))

/** 646.4M, 11.3M, 390K, 38,191 */
export function fmtCompact(n: number, digits = 1) {
  const a = Math.abs(n)
  if (a >= 1e9) return `${(n / 1e9).toFixed(digits)}B`
  if (a >= 1e6) return `${(n / 1e6).toFixed(digits)}M`
  if (a >= 1e5) return `${Math.round(n / 1e3)}K`
  return fmtInt(n)
}

export const fmtSigned = (n: number, f: (n: number) => string = fmtCompact) =>
  `${n > 0 ? '+' : n < 0 ? '−' : ''}${f(Math.abs(n))}`

export const fmtPct = (n: number, digits = 1, signed = true) =>
  `${signed && n > 0 ? '+' : n < 0 ? '−' : ''}${Math.abs(n).toFixed(digits)}%`
