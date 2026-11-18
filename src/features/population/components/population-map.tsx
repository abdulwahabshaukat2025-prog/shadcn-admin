import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SparkAreaChart } from '@/components/tremor/spark-chart'
import { flagUrl } from '../lib/flags'
import {
  COUNTRIES,
  LAST,
  REGION_TOTAL,
  YEARS,
  byCode,
  cagr,
  fmtCompact,
  fmtInt,
  fmtPct,
  fmtSigned,
  growthPct,
  subregionLabel,
  type CountrySeries,
} from '../lib/stats'
import { FONT, tooltipBase, useViz } from '../lib/viz'
import { EChart, echarts, type EChartsOption } from './echart'
import { PlayerControls, useYearPlayer } from './year-player'

type Mode = 'population' | 'growth'
type View = 'region' | 'caribbean'

const POP_BREAKS = [1e5, 1e6, 5e6, 2e7, 5e7, 1e8]
const GROWTH_MAX = 21

const VIEWS: Record<View, { center: [number, number]; zoom: number }> = {
  region: { center: [-75, -11.5], zoom: 1 },
  caribbean: { center: [-71, 17.5], zoom: 3.4 },
}

function useLatamMap() {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    let alive = true
    import('../data/latam.geo.json').then((geo) => {
      if (!alive) return
      if (!echarts.getMap('latam')) {
        echarts.registerMap('latam', geo.default as never)
      }
      setReady(true)
    })
    return () => {
      alive = false
    }
  }, [])
  return ready
}

export function PopulationMap() {
  const t = useViz()
  const ready = useLatamMap()
  const [mode, setMode] = useState<Mode>('growth')
  const [view, setView] = useState<View>('region')
  const [selected, setSelected] = useState<CountrySeries>(byCode.BRA)
  const stageRef = useRef<HTMLDivElement>(null)
  const player = useYearPlayer(stageRef, { intervalMs: 1100 })

  const option = useMemo<EChartsOption>(() => {
    const i = player.index
    const value = (c: CountrySeries) =>
      mode === 'population' ? c.values[i] : growthPct(c.values[0], c.values[i])

    const visualMap =
      mode === 'population'
        ? {
            type: 'piecewise',
            pieces: [
              { lt: POP_BREAKS[0], label: '< 100K' },
              { gte: POP_BREAKS[0], lt: POP_BREAKS[1], label: '100K – 1M' },
              { gte: POP_BREAKS[1], lt: POP_BREAKS[2], label: '1M – 5M' },
              { gte: POP_BREAKS[2], lt: POP_BREAKS[3], label: '5M – 20M' },
              { gte: POP_BREAKS[3], lt: POP_BREAKS[4], label: '20M – 50M' },
              { gte: POP_BREAKS[4], lt: POP_BREAKS[5], label: '50M – 100M' },
              { gte: POP_BREAKS[5], label: '> 100M' },
            ].map((p, k) => ({ ...p, color: t.seq[k] })),
          }
        : {
            type: 'continuous',
            min: -GROWTH_MAX,
            max: GROWTH_MAX,
            calculable: false,
            itemWidth: 12,
            itemHeight: 140,
            text: [`+${GROWTH_MAX}% grew`, `−${GROWTH_MAX}% shrank`],
            inRange: { color: t.div },
          }

    return {
      animationDurationUpdate: 900,
      animationEasingUpdate: 'cubicInOut',
      tooltip: {
        ...tooltipBase(t),
        trigger: 'item',
        formatter: (p: { name: string }) => {
          const c = byCode[p.name]
          if (!c) {
            return `<b>${p.name === 'GUF' ? 'French Guiana' : 'Falkland Islands'}</b><br/><span style="color:${t.text2}">Not in this dataset</span>`
          }
          return `<b>${c.name}</b> · ${YEARS[i]}<br/><span style="color:${t.text2}">${subregionLabel(c.subregion)}</span><br/>Population: <b>${fmtInt(c.values[i])}</b><br/>Change since 2010: <b>${fmtPct(growthPct(c.values[0], c.values[i]))}</b>`
        },
      },
      visualMap: {
        ...visualMap,
        left: 8,
        bottom: 8,
        orient: 'vertical',
        textStyle: { color: t.text2, fontFamily: FONT, fontSize: 11 },
        itemSymbol: 'roundRect',
        seriesIndex: 0,
      },
      series: [
        {
          type: 'map',
          map: 'latam',
          roam: true,
          scaleLimit: { min: 0.8, max: 12 },
          center: VIEWS[view].center,
          zoom: VIEWS[view].zoom,
          layoutCenter: ['54%', '50%'],
          layoutSize: '100%',
          selectedMode: false,
          itemStyle: {
            areaColor: t.noData,
            borderColor: t.surface,
            borderWidth: 0.6,
          },
          emphasis: {
            label: { show: false },
            itemStyle: {
              areaColor: undefined,
              borderColor: t.text,
              borderWidth: 1.2,
            },
          },
          data: [
            // Areas not in the dataset: hatched so they never read as "no change".
            ...['GUF', 'FLK'].map((name) => ({
              name,
              itemStyle: {
                areaColor: t.noData,
                decal: {
                  symbol: 'rect',
                  symbolSize: 1,
                  color:
                    t.mode === 'light'
                      ? 'rgba(0,0,0,0.18)'
                      : 'rgba(255,255,255,0.18)',
                  dashArrayX: [1, 0],
                  dashArrayY: [1, 3],
                  rotation: -Math.PI / 4,
                },
              },
            })),
            ...COUNTRIES.map((c) => ({
              name: c.code,
              value: value(c),
              itemStyle:
                c.code === selected.code
                  ? { borderColor: t.text, borderWidth: 1.6 }
                  : undefined,
            })),
          ],
        },
      ],
    }
  }, [t, mode, view, player.index, selected.code])

  const onEvents = useMemo(
    () => ({
      click: (p: unknown) => {
        const c = byCode[(p as { name: string }).name]
        if (c) setSelected(c)
      },
    }),
    []
  )

  return (
    <div className='grid gap-4 lg:grid-cols-3'>
      <Card className='overflow-hidden lg:col-span-2'>
        <CardHeader className='flex flex-col gap-3 md:flex-row md:items-start md:justify-between'>
          <div className='space-y-1'>
            <CardTitle className='text-lg'>
              {mode === 'growth'
                ? 'Where the region grew'
                : 'Where people live'}{' '}
              · <span className='tabular-nums'>{player.year}</span>
            </CardTitle>
            <CardDescription>
              {mode === 'growth'
                ? 'Population change since 2010 (%). Blue grew, red shrank.'
                : 'Total population (people), mid-year estimate.'}{' '}
              Click a country for details; scroll or pinch to zoom.
            </CardDescription>
          </div>
          <div className='flex flex-wrap gap-2'>
            <Tabs value={mode} onValueChange={(v) => setMode(v as Mode)}>
              <TabsList>
                <TabsTrigger value='growth'>Growth %</TabsTrigger>
                <TabsTrigger value='population'>Population</TabsTrigger>
              </TabsList>
            </Tabs>
            <Tabs value={view} onValueChange={(v) => setView(v as View)}>
              <TabsList>
                <TabsTrigger value='region'>Region</TabsTrigger>
                <TabsTrigger value='caribbean'>Caribbean</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent ref={stageRef} className='space-y-3'>
          {ready ? (
            <EChart
              option={option}
              onEvents={onEvents}
              className='h-[560px]'
              ariaLabel={`Choropleth map of Latin America and the Caribbean showing ${mode === 'growth' ? 'population change since 2010' : 'population'} in ${player.year}`}
            />
          ) : (
            <Skeleton className='h-[560px] w-full' />
          )}
          <PlayerControls player={player} />
        </CardContent>
      </Card>
      <CountryDetail country={selected} index={player.index} />
    </div>
  )
}

function CountryDetail({
  country: c,
  index,
}: {
  country: CountrySeries
  index: number
}) {
  const rank =
    [...COUNTRIES].sort((a, b) => b.values[LAST] - a.values[LAST]).indexOf(c) +
    1
  const growth = growthPct(c.values[0], c.values[LAST])
  const up = growth >= 0
  const share = (c.values[LAST] / REGION_TOTAL[LAST]) * 100
  const stats = [
    { label: 'Population 2010', value: fmtInt(c.values[0]) },
    { label: 'Population 2019', value: fmtInt(c.values[LAST]) },
    { label: 'Change', value: fmtSigned(c.values[LAST] - c.values[0], fmtInt) },
    { label: 'Avg. growth / yr', value: fmtPct(cagr(c.values), 2) },
    {
      label: 'Share of region',
      value: `${share < 0.1 ? share.toFixed(2) : share.toFixed(1)}%`,
    },
    { label: 'Size rank', value: `#${rank} of ${COUNTRIES.length}` },
  ]
  return (
    <Card className='overflow-hidden'>
      <AnimatePresence mode='wait'>
        <motion.div
          key={c.code}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className='flex h-full flex-col gap-5'
        >
          <CardHeader>
            <div className='flex items-center gap-3'>
              <img
                src={flagUrl(c.iso2)}
                alt=''
                className='h-9 w-12 rounded-md object-cover shadow-sm ring-1 ring-black/10'
              />
              <div className='min-w-0'>
                <CardTitle className='truncate text-xl'>{c.name}</CardTitle>
                <Badge variant='secondary' className='mt-1'>
                  {subregionLabel(c.subregion)}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className='flex flex-1 flex-col gap-5'>
            <div>
              <p className='text-sm text-muted-foreground'>
                Population in {YEARS[index]}
              </p>
              <p className='text-4xl font-semibold tracking-tight tabular-nums'>
                {fmtCompact(c.values[index], 2)}
              </p>
              <p
                className={
                  up
                    ? 'mt-1 inline-flex items-center gap-1 text-sm font-medium text-[#006300] dark:text-[#0ca30c]'
                    : 'mt-1 inline-flex items-center gap-1 text-sm font-medium text-red-600 dark:text-red-400'
                }
              >
                {up ? (
                  <ArrowUpRight className='size-4' />
                ) : (
                  <ArrowDownRight className='size-4' />
                )}
                {fmtPct(growth)} over 2010–2019
              </p>
            </div>
            <SparkAreaChart
              data={YEARS.map((y, i) => ({ year: y, value: c.values[i] }))}
              index='year'
              categories={['value']}
              colors={[c.subregion]}
              autoMinValue
              className='h-20 w-full'
            />
            <dl className='grid grid-cols-2 gap-x-4 gap-y-3 text-sm'>
              {stats.map((s) => (
                <div key={s.label}>
                  <dt className='text-xs text-muted-foreground'>{s.label}</dt>
                  <dd className='font-medium tabular-nums'>{s.value}</dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </motion.div>
      </AnimatePresence>
    </Card>
  )
}
