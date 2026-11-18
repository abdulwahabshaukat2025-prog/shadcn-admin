import { useMemo, useRef, useState } from 'react'
import { RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  COUNTRIES,
  REGION_TOTAL,
  SUBREGIONS,
  YEARS,
  byCode,
  fmtCompact,
  fmtInt,
  fmtPct,
  subregionLabel,
} from '../lib/stats'
import { FONT, swatch, tooltipBase, useViz } from '../lib/viz'
import { EChart, type EChartsOption } from './echart'
import { PlayerControls, useYearPlayer } from './year-player'

/* ---------------- Size vs speed (animated bubbles) ---------------- */

const yoy = (v: number[], i: number) => (v[i] / v[i - 1] - 1) * 100
const allRates = COUNTRIES.flatMap((c) =>
  YEARS.slice(1).map((_, k) => yoy(c.values, k + 1))
)
const Y_MIN = Math.floor(Math.min(...allRates))
const Y_MAX = Math.ceil(Math.max(...allRates))
const LABELLED = new Set([
  'BRA',
  'MEX',
  'COL',
  'ARG',
  'PER',
  'VEN',
  'GTM',
  'HTI',
  'CUB',
  'PRI',
  'BLZ',
  'URY',
  'HND',
  'PAN',
])

export function BubbleRace() {
  const t = useViz()
  const stageRef = useRef<HTMLDivElement>(null)
  const player = useYearPlayer(stageRef, { start: 1, intervalMs: 1400 })

  const option = useMemo<EChartsOption>(() => {
    const i = player.index
    return {
      animationDurationUpdate: 1200,
      animationEasingUpdate: 'cubicInOut',
      grid: { top: 40, bottom: 44, left: 8, right: 24, containLabel: true },
      tooltip: {
        ...tooltipBase(t),
        trigger: 'item',
        formatter: (p: { data: { code: string }; color: string }) => {
          const c = byCode[p.data.code]
          return `${swatch(p.color)}<b>${c.name}</b> · ${YEARS[i]}<br/><span style="color:${t.text2}">${subregionLabel(c.subregion)}</span><br/>Population: <b>${fmtInt(c.values[i])}</b><br/>Growth that year: <b>${fmtPct(yoy(c.values, i), 2)}</b>`
        },
      },
      xAxis: {
        type: 'log',
        name: 'Population (people, log scale)',
        nameLocation: 'middle',
        nameGap: 28,
        nameTextStyle: { color: t.text2, fontFamily: FONT, fontSize: 12 },
        min: 2e4,
        max: 4e8,
        axisLine: { lineStyle: { color: t.axis } },
        axisLabel: {
          color: t.muted,
          fontFamily: FONT,
          formatter: (v: number) => fmtCompact(v, 0),
        },
        splitLine: { lineStyle: { color: t.grid } },
      },
      yAxis: {
        type: 'value',
        name: 'Growth that year (%)',
        nameTextStyle: {
          color: t.text2,
          fontFamily: FONT,
          fontSize: 12,
          align: 'left',
        },
        min: Y_MIN,
        max: Y_MAX,
        axisLabel: {
          color: t.muted,
          fontFamily: FONT,
          formatter: (v: number) => `${v}%`,
        },
        splitLine: { lineStyle: { color: t.grid } },
      },
      graphic: [
        {
          type: 'text',
          right: 40,
          top: 24,
          z: 0,
          style: {
            text: String(YEARS[i]),
            font: `700 72px ${FONT}`,
            fill: t.text,
            opacity: 0.1,
          },
        },
      ],
      series: SUBREGIONS.map((s) => ({
        name: s.label,
        type: 'scatter',
        itemStyle: {
          color: t.subregion[s.id],
          opacity: 0.85,
          borderColor: t.surface,
          borderWidth: 1.5,
        },
        emphasis: { focus: 'self', itemStyle: { opacity: 1 } },
        labelLayout: { hideOverlap: true },
        markLine:
          s.id === 'south'
            ? {
                silent: true,
                symbol: 'none',
                lineStyle: { color: t.text2, type: 'dashed', width: 1 },
                label: {
                  formatter: 'no growth',
                  color: t.muted,
                  fontFamily: FONT,
                  position: 'insideEndTop',
                },
                data: [{ yAxis: 0 }],
              }
            : undefined,
        data: COUNTRIES.filter((c) => c.subregion === s.id).map((c) => ({
          name: c.code,
          code: c.code,
          value: [c.values[i], yoy(c.values, i)],
          symbolSize: Math.max(7, Math.sqrt(c.values[i]) / 260),
          label: {
            show: LABELLED.has(c.code),
            position: 'top',
            formatter: c.name,
            color: t.text,
            fontFamily: FONT,
            fontSize: 11,
            fontWeight: 500,
          },
        })),
      })),
    }
  }, [t, player.index])

  return (
    <Card className='overflow-hidden'>
      <CardHeader>
        <CardTitle className='text-lg'>Size vs. speed</CardTitle>
        <CardDescription>
          Each bubble is a country (bubble area = population). Watch Venezuela
          fall below the line after 2015 while Central America keeps the fastest
          pace.
        </CardDescription>
      </CardHeader>
      <CardContent ref={stageRef} className='space-y-3'>
        <div className='flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground'>
          {SUBREGIONS.map((s) => (
            <span key={s.id} className='inline-flex items-center gap-1.5'>
              <span
                className='size-2.5 rounded-full'
                style={{ background: t.subregion[s.id] }}
              />
              {s.label}
            </span>
          ))}
        </div>
        <EChart
          option={option}
          className='h-[480px]'
          ariaLabel={`Animated bubble chart of population versus annual growth rate by country, ${player.year}`}
        />
        <PlayerControls player={player} />
      </CardContent>
    </Card>
  )
}

/* ---------------- Indexed line race (2010 = 100) ---------------- */

const LINES = ['BLZ', 'MEX', 'BRA', 'CUB', 'VEN', 'PRI']

export function IndexedLines() {
  const t = useViz()
  const [run, setRun] = useState(0)

  const option = useMemo<EChartsOption>(() => {
    const series = [
      ...LINES.map((code, k) => ({
        name: byCode[code].name,
        v: byCode[code].values,
        color: t.series[k],
        dashed: false,
      })),
      { name: 'Region total', v: REGION_TOTAL, color: t.muted, dashed: true },
    ]
    return {
      animationDuration: 5000,
      animationEasing: 'linear',
      grid: { top: 40, bottom: 8, left: 4, right: 130, containLabel: true },
      legend: {
        top: 0,
        left: 0,
        icon: 'roundRect',
        itemWidth: 12,
        itemHeight: 4,
        textStyle: { color: t.text2, fontFamily: FONT, fontSize: 12 },
      },
      tooltip: {
        ...tooltipBase(t),
        trigger: 'axis',
        order: 'valueDesc',
        axisPointer: { type: 'line', lineStyle: { color: t.axis } },
        valueFormatter: (v: number) => v.toFixed(1),
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: YEARS.map(String),
        axisTick: { show: false },
        axisLine: { lineStyle: { color: t.axis } },
        axisLabel: { color: t.muted, fontFamily: FONT },
      },
      yAxis: {
        type: 'value',
        min: 80,
        max: 130,
        interval: 10,
        axisLabel: { color: t.muted, fontFamily: FONT },
        splitLine: { lineStyle: { color: t.grid } },
      },
      series: series.map((s) => ({
        name: s.name,
        type: 'line',
        showSymbol: false,
        symbolSize: 8,
        smooth: 0.25,
        lineStyle: {
          width: 2,
          color: s.color,
          type: s.dashed ? 'dashed' : 'solid',
        },
        itemStyle: { color: s.color },
        emphasis: { focus: 'series' },
        endLabel: {
          show: true,
          color: t.text,
          fontFamily: FONT,
          fontSize: 11,
          valueAnimation: true,
          formatter: (p: { seriesName: string; value: number }) =>
            `${p.seriesName}  ${p.value.toFixed(1)}`,
        },
        labelLayout: { moveOverlap: 'shiftY' },
        data: s.v.map((x) => +((x / s.v[0]) * 100).toFixed(2)),
      })),
    }
  }, [t])

  return (
    <Card className='overflow-hidden'>
      <CardHeader className='flex flex-row items-start justify-between gap-3'>
        <div className='space-y-1'>
          <CardTitle className='text-lg'>Diverging paths</CardTitle>
          <CardDescription>
            Population indexed to 2010 = 100, so countries of every size share
            one scale. Belize grew 21%; Puerto Rico lost 14%.
          </CardDescription>
        </div>
        <Button
          variant='outline'
          size='sm'
          onClick={() => setRun((r) => r + 1)}
        >
          <RotateCcw className='size-4' /> Replay
        </Button>
      </CardHeader>
      <CardContent>
        <EChart
          key={run}
          option={option}
          className='h-[420px]'
          ariaLabel='Animated line chart of population indexed to 2010 for six countries and the region'
        />
      </CardContent>
    </Card>
  )
}
