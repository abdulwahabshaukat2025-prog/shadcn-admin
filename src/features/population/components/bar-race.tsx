import { useMemo, useRef, useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { flagUrl } from '../lib/flags'
import {
  COUNTRIES,
  SUBREGIONS,
  fmtCompact,
  fmtInt,
  fmtPct,
  fmtSigned,
  subregionLabel,
} from '../lib/stats'
import { FONT, swatch, tooltipBase, useViz } from '../lib/viz'
import { EChart, type EChartsOption } from './echart'
import { PlayerControls, useYearPlayer } from './year-player'

type Metric = 'population' | 'added' | 'growth'

const METRICS: Record<
  Metric,
  {
    label: string
    title: string
    value: (v: number[], i: number) => number
    fmt: (n: number) => string
  }
> = {
  population: {
    label: 'Population',
    title: 'Population (people)',
    value: (v, i) => v[i],
    fmt: (n) => fmtCompact(n, n >= 1e7 ? 1 : 2),
  },
  added: {
    label: 'People added',
    title: 'People added since 2010',
    value: (v, i) => v[i] - v[0],
    fmt: (n) => fmtSigned(n, (x) => fmtCompact(x, 2)),
  },
  growth: {
    label: 'Growth %',
    title: 'Growth since 2010 (%)',
    value: (v, i) => (v[i] / v[0] - 1) * 100,
    fmt: (n) => fmtPct(n),
  },
}

const TOP = 12
const STEP_MS = 1500

export function BarRace() {
  const t = useViz()
  const [metric, setMetric] = useState<Metric>('population')
  const stageRef = useRef<HTMLDivElement>(null)
  const player = useYearPlayer(stageRef, { intervalMs: STEP_MS })
  const m = METRICS[metric]

  // Static part of the option: rebuilt only when theme or metric changes.
  const narrow = typeof window !== 'undefined' && window.innerWidth < 640
  const base = useMemo<EChartsOption>(() => {
    const rich: Record<string, object> = {
      name: {
        color: t.text,
        fontSize: 12,
        fontFamily: FONT,
        padding: [0, 6, 0, 0],
      },
    }
    for (const c of COUNTRIES) {
      rich[`f_${c.code}`] = {
        height: 12,
        width: 16,
        backgroundColor: { image: flagUrl(c.iso2) },
        borderRadius: 2,
      }
    }
    return {
      animationDuration: 0,
      animationDurationUpdate: STEP_MS,
      animationEasing: 'linear',
      animationEasingUpdate: 'linear',
      grid: { top: 8, bottom: 28, left: 8, right: 72, containLabel: true },
      xAxis: {
        type: 'value',
        max: 'dataMax',
        splitNumber: 4,
        axisLabel: {
          hideOverlap: true,
          color: t.muted,
          fontFamily: FONT,
          formatter: (v: number) =>
            metric === 'growth' ? `${v}%` : fmtCompact(v, 0),
        },
        splitLine: { lineStyle: { color: t.grid } },
      },
      yAxis: {
        type: 'category',
        inverse: true,
        max: TOP - 1,
        animationDuration: 300,
        animationDurationUpdate: 300,
        axisLine: { lineStyle: { color: t.axis } },
        axisTick: { show: false },
        axisLabel: {
          fontFamily: FONT,
          formatter: (code: string) => {
            const c = COUNTRIES.find((x) => x.code === code)!
            return `{name|${c.name}} {f_${code}|}`
          },
          rich,
        },
      },
      tooltip: {
        ...tooltipBase(t),
        trigger: 'item',
        formatter: (p: { name: string; value: number; color: string }) => {
          const c = COUNTRIES.find((x) => x.code === p.name)!
          return `${swatch(p.color)}<b>${c.name}</b><br/><span style="color:${t.text2}">${subregionLabel(c.subregion)}</span><br/>${m.title}: <b>${metric === 'population' ? fmtInt(p.value) : m.fmt(p.value)}</b>`
        },
      },
      graphic: [
        {
          id: 'year',
          type: 'text',
          right: 84,
          bottom: 44,
          z: 0,
          style: {
            text: '',
            font: `700 ${narrow ? 36 : 64}px ${FONT}`,
            fill: t.text,
            opacity: 0.12,
          },
        },
      ],
      series: [
        {
          id: 'race',
          type: 'bar',
          realtimeSort: true,
          barCategoryGap: '28%',
          itemStyle: { borderRadius: [0, 4, 4, 0] },
          label: {
            show: true,
            position: 'right',
            valueAnimation: true,
            color: t.text,
            fontFamily: FONT,
            fontWeight: 600,
            fontSize: 12,
            formatter: (p: { value: number }) => m.fmt(p.value),
          },
          data: [],
        },
      ],
    }
  }, [t, metric, m, narrow])

  const option = useMemo<EChartsOption>(
    () => ({
      ...base,
      yAxis: {
        ...(base.yAxis as object),
        data: COUNTRIES.map((c) => c.code),
      },
      graphic: [
        {
          ...(base.graphic as object[])[0],
          style: {
            ...(base.graphic as { style: object }[])[0].style,
            text: String(player.year),
          },
        },
      ],
      series: [
        {
          ...(base.series as object[])[0],
          data: COUNTRIES.map((c) => ({
            name: c.code,
            value: m.value(c.values, player.index),
            itemStyle: { color: t.subregion[c.subregion] },
          })),
        },
      ],
    }),
    [base, player.index, player.year, m, t]
  )

  return (
    <Card className='overflow-hidden'>
      <CardHeader className='flex flex-col gap-3 md:flex-row md:items-start md:justify-between'>
        <div className='space-y-1'>
          <CardTitle className='text-lg'>The decade in motion</CardTitle>
          <CardDescription>
            Top {TOP} countries by {m.title.toLowerCase()}, re-ranked every
            year, 2010–2019
          </CardDescription>
        </div>
        <Tabs value={metric} onValueChange={(v) => setMetric(v as Metric)}>
          <TabsList>
            {(Object.keys(METRICS) as Metric[]).map((k) => (
              <TabsTrigger key={k} value={k}>
                {METRICS[k].label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent ref={stageRef} className='space-y-3'>
        <div className='flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground'>
          {SUBREGIONS.map((s) => (
            <span key={s.id} className='inline-flex items-center gap-1.5'>
              <span
                className='size-2.5 rounded-[3px]'
                style={{ background: t.subregion[s.id] }}
              />
              {s.label}
            </span>
          ))}
        </div>
        <EChart
          option={option}
          className='h-[440px]'
          ariaLabel={`Animated bar chart race of the ${TOP} largest values of ${m.title} by country, ${player.year}`}
        />
        <PlayerControls player={player} />
      </CardContent>
    </Card>
  )
}
