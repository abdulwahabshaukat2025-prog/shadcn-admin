import { useEffect, useRef } from 'react'
import {
  ArrowDownRight,
  ArrowUpRight,
  Globe2,
  TrendingUp,
  UserPlus,
  Users,
} from 'lucide-react'
import { animate, motion, useInView } from 'motion/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CategoryBar } from '@/components/tremor/category-bar'
import { SparkAreaChart, SparkBarChart } from '@/components/tremor/spark-chart'
import {
  LAST,
  REGION_TOTAL,
  YEARS,
  byCode,
  fmtPct,
  growthPct,
  yearlyAdditions,
} from '../lib/stats'

/** Number that counts up from 0 the first time it scrolls into view. */
export function CountUp({
  value,
  format,
  duration = 1.6,
}: {
  value: number
  format: (n: number) => string
  duration?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  useEffect(() => {
    if (!inView || !ref.current) return
    const node = ref.current
    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => (node.textContent = format(v)),
    })
    return () => controls.stop()
  }, [inView, value, format, duration])
  return (
    <span ref={ref} className='tabular-nums'>
      {format(0)}
    </span>
  )
}

function Delta({ value, label }: { value: number; label: string }) {
  const up = value >= 0
  const Icon = up ? ArrowUpRight : ArrowDownRight
  return (
    <p className='flex items-center gap-1 text-xs text-muted-foreground'>
      <span
        className={
          up
            ? 'inline-flex items-center font-medium text-[#006300] dark:text-[#0ca30c]'
            : 'inline-flex items-center font-medium text-red-600 dark:text-red-400'
        }
      >
        <Icon className='size-3.5' aria-hidden />
        {fmtPct(value)}
      </span>
      {label}
    </p>
  )
}

const additions = yearlyAdditions(REGION_TOTAL)
const rates = additions.map((a, i) => (a / REGION_TOTAL[i]) * 100)
const brazil = byCode.BRA.values[LAST]
const mexico = byCode.MEX.values[LAST]
const total = REGION_TOTAL[LAST]

const millions = (n: number) => `${(n / 1e6).toFixed(1)}M`

const cards = [
  {
    title: 'Population, 2019',
    icon: Users,
    value: total,
    format: millions,
    foot: (
      <Delta value={growthPct(REGION_TOTAL[0], total)} label='since 2010' />
    ),
    chart: (
      <SparkAreaChart
        data={YEARS.map((y, i) => ({ year: y, value: REGION_TOTAL[i] }))}
        index='year'
        categories={['value']}
        colors={['south']}
        autoMinValue
        className='h-10 w-full'
      />
    ),
  },
  {
    title: 'People added, 2010–19',
    icon: UserPlus,
    value: total - REGION_TOTAL[0],
    format: (n: number) => `+${millions(n)}`,
    foot: (
      <p className='text-xs text-muted-foreground'>
        ≈ {((total - REGION_TOTAL[0]) / 9 / 1e6).toFixed(1)}M new residents a
        year
      </p>
    ),
    chart: (
      <SparkBarChart
        data={additions.map((v, i) => ({ year: YEARS[i + 1], value: v }))}
        index='year'
        categories={['value']}
        colors={['south']}
        autoMinValue
        className='h-10 w-full'
      />
    ),
  },
  {
    title: 'Annual growth rate, 2019',
    icon: TrendingUp,
    value: rates[rates.length - 1],
    format: (n: number) => `${n.toFixed(2)}%`,
    foot: (
      <p className='flex items-center gap-1 text-xs text-muted-foreground'>
        <ArrowDownRight className='size-3.5' aria-hidden />
        slowing from {rates[0].toFixed(2)}% in 2011
      </p>
    ),
    chart: (
      <SparkAreaChart
        data={rates.map((v, i) => ({ year: YEARS[i + 1], value: v }))}
        index='year'
        categories={['value']}
        colors={['central']}
        autoMinValue
        className='h-10 w-full'
      />
    ),
  },
  {
    title: 'Brazil + Mexico share',
    icon: Globe2,
    value: ((brazil + mexico) / total) * 100,
    format: (n: number) => `${n.toFixed(1)}%`,
    foot: (
      <p className='text-xs text-muted-foreground'>
        of everyone in the region lives in two countries
      </p>
    ),
    chart: (
      <div className='pt-3'>
        <CategoryBar
          values={[
            +((brazil / total) * 100).toFixed(1),
            +((mexico / total) * 100).toFixed(1),
            +(((total - brazil - mexico) / total) * 100).toFixed(1),
          ]}
          colors={['south', 'central', 'gray']}
          showLabels={false}
        />
        <div className='mt-2 flex justify-between text-[11px] text-muted-foreground'>
          <span>Brazil {((brazil / total) * 100).toFixed(1)}%</span>
          <span>Mexico {((mexico / total) * 100).toFixed(1)}%</span>
          <span>40 others</span>
        </div>
      </div>
    ),
  },
]

export function KpiCards() {
  return (
    <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
      {cards.map((c, i) => (
        <motion.div
          key={c.title}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 * i, duration: 0.5, ease: 'easeOut' }}
        >
          <Card className='h-full gap-3 overflow-hidden py-5'>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 px-5 pb-0'>
              <CardTitle className='text-sm font-medium text-muted-foreground'>
                {c.title}
              </CardTitle>
              <c.icon className='size-4 text-muted-foreground' aria-hidden />
            </CardHeader>
            <CardContent className='space-y-1 px-5'>
              <div className='text-3xl font-semibold tracking-tight'>
                <CountUp value={c.value} format={c.format} />
              </div>
              {c.foot}
              <div className='pt-2'>{c.chart}</div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
