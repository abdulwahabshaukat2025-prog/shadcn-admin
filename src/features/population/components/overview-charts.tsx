import { useMemo } from 'react'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { BarList } from '@/components/tremor/bar-list'
import {
  COUNTRIES,
  LAST,
  REGION_TOTAL,
  SUBREGIONS,
  YEARS,
  byCode,
  countryGrowth,
  fmtCompact,
  fmtInt,
  fmtPct,
  fmtSigned,
  growthPct,
  subregionTotals,
  yearlyAdditions,
} from '../lib/stats'
import { FONT, swatch, tooltipBase, useViz } from '../lib/viz'
import { EChart, type EChartsOption } from './echart'

/* ---------------- People added each year, stacked by subregion ---------------- */

export function AdditionsChart() {
  const t = useViz()
  const option = useMemo<EChartsOption>(() => {
    const years = YEARS.slice(1).map(String)
    return {
      animationDuration: 1200,
      animationEasing: 'cubicOut',
      animationDelay: (i: number) => i * 70,
      grid: { top: 52, bottom: 8, left: 4, right: 8, containLabel: true },
      legend: {
        top: 0,
        left: 0,
        icon: 'roundRect',
        itemWidth: 10,
        itemHeight: 10,
        textStyle: { color: t.text2, fontFamily: FONT, fontSize: 12 },
      },
      tooltip: {
        ...tooltipBase(t),
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
          shadowStyle: {
            color:
              t.mode === 'light'
                ? 'rgba(0,0,0,0.04)'
                : 'rgba(255,255,255,0.05)',
          },
        },
        formatter: (
          ps: {
            seriesName: string
            value: number
            color: string
            axisValue: string
          }[]
        ) => {
          const tot = ps.reduce((s, p) => s + p.value, 0)
          return (
            `<b>${ps[0].axisValue}</b> · ${fmtCompact(tot, 2)} added<br/>` +
            ps
              .slice()
              .reverse()
              .map(
                (p) =>
                  `${swatch(p.color)}${p.seriesName}: <b>${fmtCompact(p.value, 2)}</b>`
              )
              .join('<br/>')
          )
        },
      },
      xAxis: {
        type: 'category',
        data: years,
        axisTick: { show: false },
        axisLine: { lineStyle: { color: t.axis } },
        axisLabel: { color: t.muted, fontFamily: FONT },
      },
      yAxis: {
        type: 'value',
        splitNumber: 3,
        axisLabel: {
          color: t.muted,
          fontFamily: FONT,
          formatter: (v: number) => fmtCompact(v, 0),
        },
        splitLine: { lineStyle: { color: t.grid } },
      },
      series: SUBREGIONS.map((s, si) => ({
        name: s.label,
        type: 'bar',
        stack: 'total',
        barWidth: '58%',
        itemStyle: {
          color: t.subregion[s.id],
          borderColor: t.surface,
          borderWidth: 1,
          borderRadius: si === SUBREGIONS.length - 1 ? [4, 4, 0, 0] : 0,
        },
        emphasis: { focus: 'series' },
        data: yearlyAdditions(subregionTotals(s.id)),
      })),
    }
  }, [t])

  const adds = yearlyAdditions(REGION_TOTAL)
  return (
    <Card className='h-full'>
      <CardHeader>
        <CardTitle>People added each year</CardTitle>
        <CardDescription>
          Net change in population (people), by subregion. Yearly gains shrank
          from {fmtCompact(adds[0], 2)} in 2011 to{' '}
          {fmtCompact(adds[adds.length - 1], 2)} in 2019.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <EChart
          option={option}
          className='h-72'
          ariaLabel='Stacked bar chart of people added each year from 2011 to 2019 by subregion'
        />
      </CardContent>
    </Card>
  )
}

/* ---------------- Share treemap ---------------- */

export function ShareTreemap() {
  const t = useViz()
  const option = useMemo<EChartsOption>(() => {
    const total = REGION_TOTAL[LAST]
    return {
      animationDuration: 1400,
      animationEasing: 'quinticOut',
      tooltip: {
        ...tooltipBase(t),
        formatter: (p: {
          name: string
          value: number
          color: string
          treePathInfo: { name: string }[]
        }) => {
          const path = p.treePathInfo.map((x) => x.name).filter(Boolean)
          return `${swatch(p.color)}<b>${p.name}</b>${path.length > 1 ? `<br/><span style="color:${t.text2}">${path[0]}</span>` : ''}<br/>${fmtInt(p.value)} people · <b>${((p.value / total) * 100).toFixed(1)}%</b> of region`
        },
      },
      series: [
        {
          type: 'treemap',
          roam: false,
          nodeClick: false,
          breadcrumb: { show: false },
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          itemStyle: {
            borderColor: t.surface,
            borderWidth: 2,
            gapWidth: 2,
            borderRadius: 6,
          },
          upperLabel: { show: false },
          levels: [
            { itemStyle: { borderWidth: 0, gapWidth: 4 } },
            { itemStyle: { gapWidth: 2, borderRadius: 4 } },
          ],
          label: {
            show: true,
            fontFamily: FONT,
            color: '#ffffff',
            fontSize: 12,
            overflow: 'truncate',
            formatter: (p: { name: string; value: number }) =>
              `{n|${p.name}}\n{v|${((p.value / total) * 100).toFixed(1)}%}`,
            rich: {
              n: {
                fontWeight: 600,
                fontSize: 13,
                color: '#fff',
                fontFamily: FONT,
              },
              v: {
                fontSize: 12,
                color: 'rgba(255,255,255,0.85)',
                fontFamily: FONT,
                padding: [3, 0, 0, 0],
              },
            },
          },
          data: SUBREGIONS.map((s) => ({
            name: s.label,
            itemStyle: { color: t.subregion[s.id] },
            children: COUNTRIES.filter((c) => c.subregion === s.id).map(
              (c) => ({
                name: c.name,
                value: c.values[LAST],
                itemStyle: { color: t.subregion[s.id] },
              })
            ),
          })),
        },
      ],
    }
  }, [t])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Who lives where, 2019</CardTitle>
        <CardDescription>
          Each tile is a country, sized by population and grouped by subregion.
          Hover for exact figures.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='mb-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground'>
          {SUBREGIONS.map((s) => {
            const v = subregionTotals(s.id)[LAST]
            return (
              <span key={s.id} className='inline-flex items-center gap-1.5'>
                <span
                  className='size-2.5 rounded-[3px]'
                  style={{ background: t.subregion[s.id] }}
                />
                {s.label} · {((v / REGION_TOTAL[LAST]) * 100).toFixed(1)}%
              </span>
            )
          })}
        </div>
        <EChart
          option={option}
          className='h-[440px]'
          ariaLabel='Treemap of 2019 population share by country and subregion'
        />
      </CardContent>
    </Card>
  )
}

/* ---------------- Movers (Tremor BarList) ---------------- */

const ranked = [...COUNTRIES].sort(
  (a, b) => countryGrowth(b) - countryGrowth(a)
)

export function Movers() {
  const fastest = ranked.slice(0, 7).map((c) => ({
    name: c.name,
    value: +countryGrowth(c).toFixed(1),
    key: c.code,
  }))
  const ven = byCode.VEN.values
  const venPeak = Math.max(...ven)
  const venPeakYear = YEARS[ven.indexOf(venPeak)]
  const shrank = ranked.filter((c) => countryGrowth(c) < 0)
  const against = [
    ...shrank.reverse().map((c) => ({
      name: c.name,
      value: fmtPct(countryGrowth(c)),
      note: `${fmtSigned(c.values[LAST] - c.values[0], fmtInt)} people since 2010`,
    })),
    {
      name: 'Venezuela',
      value: fmtPct(growthPct(venPeak, ven[LAST])),
      note: `from its ${venPeakYear} peak, ${fmtSigned(ven[LAST] - venPeak, (x) => fmtCompact(x, 2))} people`,
    },
  ]
  return (
    <Card className='h-full'>
      <CardHeader>
        <CardTitle>Fastest growers and decliners</CardTitle>
        <CardDescription>Population change, 2010–2019 (%)</CardDescription>
      </CardHeader>
      <CardContent className='space-y-6'>
        <div>
          <p className='mb-2 flex items-center gap-1 text-xs font-medium tracking-wide text-muted-foreground uppercase'>
            <ArrowUpRight className='size-3.5' aria-hidden /> Fastest growing
          </p>
          <BarList
            data={fastest}
            valueFormatter={(v) => fmtPct(v)}
            showAnimation
          />
        </div>
        <div>
          <p className='mb-2 flex items-center gap-1 text-xs font-medium tracking-wide text-muted-foreground uppercase'>
            <ArrowDownRight className='size-3.5' aria-hidden /> Going the other
            way
          </p>
          <ul className='divide-y rounded-lg border'>
            {against.map((a) => (
              <li
                key={a.name + a.note}
                className='flex items-center justify-between gap-3 px-3 py-2'
              >
                <div className='min-w-0'>
                  <p className='truncate text-sm font-medium'>{a.name}</p>
                  <p className='truncate text-xs text-muted-foreground'>
                    {a.note}
                  </p>
                </div>
                <span className='inline-flex shrink-0 items-center gap-0.5 text-sm font-semibold text-red-600 tabular-nums dark:text-red-400'>
                  <ArrowDownRight className='size-3.5' aria-hidden />
                  {a.value}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
