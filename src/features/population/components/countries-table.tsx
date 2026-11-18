import { useMemo, useState } from 'react'
import {
  ArrowDown,
  ArrowDownRight,
  ArrowUp,
  ArrowUpRight,
  ChevronsUpDown,
  Download,
  Minus,
  Search,
} from 'lucide-react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SparkAreaChart } from '@/components/tremor/spark-chart'
import { flagUrl } from '../lib/flags'
import {
  COUNTRIES,
  LAST,
  REGION_TOTAL,
  SUBREGIONS,
  YEARS,
  cagr,
  countryGrowth,
  fmtInt,
  fmtPct,
  fmtSigned,
  subregionLabel,
  type CountrySeries,
  type Subregion,
} from '../lib/stats'
import { useViz } from '../lib/viz'

type SortKey =
  | 'name'
  | 'pop2010'
  | 'pop2019'
  | 'change'
  | 'growth'
  | 'cagr'
  | 'share'

const rankIn = (i: number) => {
  const order = [...COUNTRIES].sort((a, b) => b.values[i] - a.values[i])
  return (c: CountrySeries) => order.indexOf(c) + 1
}
const rank2010 = rankIn(0)
const rank2019 = rankIn(LAST)

const rows = COUNTRIES.map((c) => ({
  c,
  pop2010: c.values[0],
  pop2019: c.values[LAST],
  change: c.values[LAST] - c.values[0],
  growth: countryGrowth(c),
  cagr: cagr(c.values),
  share: (c.values[LAST] / REGION_TOTAL[LAST]) * 100,
  rank: rank2019(c),
  rankMove: rank2010(c) - rank2019(c),
}))

const COLUMNS: { key: SortKey; label: string; className?: string }[] = [
  { key: 'name', label: 'Country' },
  { key: 'pop2010', label: '2010', className: 'text-right' },
  { key: 'pop2019', label: '2019', className: 'text-right' },
  {
    key: 'change',
    label: 'Change (people)',
    className: 'text-right hidden md:table-cell',
  },
  { key: 'growth', label: 'Change %', className: 'text-right' },
  {
    key: 'cagr',
    label: 'Avg. / yr',
    className: 'text-right hidden lg:table-cell',
  },
  {
    key: 'share',
    label: 'Share',
    className: 'text-right hidden sm:table-cell',
  },
]

function downloadCsv() {
  const head = ['Country', 'ISO3', 'Subregion', ...YEARS.map(String)]
  const body = COUNTRIES.map((c) =>
    [
      `"${c.name}"`,
      c.code,
      `"${subregionLabel(c.subregion)}"`,
      ...c.values,
    ].join(',')
  )
  const blob = new Blob([[head.join(','), ...body].join('\n')], {
    type: 'text/csv',
  })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = 'latin-america-population-2010-2019.csv'
  a.click()
  URL.revokeObjectURL(a.href)
}

export function CountriesTable() {
  const t = useViz()
  const [query, setQuery] = useState('')
  const [region, setRegion] = useState<'all' | Subregion>('all')
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({
    key: 'pop2019',
    dir: -1,
  })

  const data = useMemo(() => {
    const q = query.trim().toLowerCase()
    return rows
      .filter(
        (r) =>
          (region === 'all' || r.c.subregion === region) &&
          (!q ||
            r.c.name.toLowerCase().includes(q) ||
            r.c.code.toLowerCase().includes(q))
      )
      .sort((a, b) => {
        if (sort.key === 'name')
          return a.c.name.localeCompare(b.c.name) * sort.dir
        return (a[sort.key] - b[sort.key]) * sort.dir
      })
  }, [query, region, sort])

  const toggleSort = (key: SortKey) =>
    setSort((s) =>
      s.key === key
        ? { key, dir: (s.dir * -1) as 1 | -1 }
        : { key, dir: key === 'name' ? 1 : -1 }
    )

  return (
    <Card>
      <CardHeader className='gap-4'>
        <div className='flex flex-col gap-3 md:flex-row md:items-start md:justify-between'>
          <div className='space-y-1'>
            <CardTitle className='text-lg'>
              All {COUNTRIES.length} countries and territories
            </CardTitle>
            <CardDescription>
              Total population (people), mid-year estimates. Click a column to
              sort.
            </CardDescription>
          </div>
          <Button variant='outline' size='sm' onClick={downloadCsv}>
            <Download className='size-4' /> Download CSV
          </Button>
        </div>
        <div className='flex flex-col gap-2 sm:flex-row sm:items-center'>
          <div className='relative sm:w-64'>
            <Search className='absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground' />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder='Search countries…'
              className='pl-8'
              aria-label='Search countries'
            />
          </div>
          <Tabs
            value={region}
            onValueChange={(v) => setRegion(v as 'all' | Subregion)}
          >
            <TabsList className='h-auto flex-wrap'>
              <TabsTrigger value='all'>All</TabsTrigger>
              {SUBREGIONS.map((s) => (
                <TabsTrigger key={s.id} value={s.id}>
                  <span
                    className='size-2 rounded-full'
                    style={{ background: t.subregion[s.id] }}
                  />
                  {s.short}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className='overflow-x-auto rounded-lg border'>
          <Table>
            <TableHeader>
              <TableRow className='hover:bg-transparent'>
                <TableHead className='w-12 text-right'>#</TableHead>
                {COLUMNS.map((col) => (
                  <TableHead
                    key={col.key}
                    className={col.className}
                    aria-sort={
                      sort.key === col.key
                        ? sort.dir === 1
                          ? 'ascending'
                          : 'descending'
                        : 'none'
                    }
                  >
                    <button
                      type='button'
                      onClick={() => toggleSort(col.key)}
                      className={cn(
                        'inline-flex items-center gap-1 rounded hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
                        sort.key === col.key && 'text-foreground'
                      )}
                    >
                      {col.label}
                      {sort.key === col.key ? (
                        sort.dir === 1 ? (
                          <ArrowUp className='size-3.5' />
                        ) : (
                          <ArrowDown className='size-3.5' />
                        )
                      ) : (
                        <ChevronsUpDown className='size-3.5 opacity-40' />
                      )}
                    </button>
                  </TableHead>
                ))}
                <TableHead className='hidden w-32 xl:table-cell'>
                  Trend
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((r, i) => (
                <motion.tr
                  key={r.c.code}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: Math.min(i, 15) * 0.02 }}
                  className='border-b transition-colors hover:bg-muted/50'
                >
                  <TableCell className='text-right text-muted-foreground tabular-nums'>
                    <span className='inline-flex items-center gap-1'>
                      {r.rankMove > 0 ? (
                        <ArrowUpRight
                          className='size-3 text-[#006300] dark:text-[#0ca30c]'
                          aria-label={`up ${r.rankMove}`}
                        />
                      ) : r.rankMove < 0 ? (
                        <ArrowDownRight
                          className='size-3 text-red-600 dark:text-red-400'
                          aria-label={`down ${-r.rankMove}`}
                        />
                      ) : (
                        <Minus
                          className='size-3 opacity-30'
                          aria-label='no change'
                        />
                      )}
                      {r.rank}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className='flex items-center gap-2.5'>
                      <img
                        src={flagUrl(r.c.iso2)}
                        alt=''
                        className='h-4 w-[22px] shrink-0 rounded-[3px] object-cover ring-1 ring-black/10'
                      />
                      <div className='min-w-0'>
                        <p className='truncate font-medium'>{r.c.name}</p>
                        <p className='flex items-center gap-1 text-xs text-muted-foreground'>
                          <span
                            className='size-1.5 rounded-full'
                            style={{ background: t.subregion[r.c.subregion] }}
                          />
                          {subregionLabel(r.c.subregion)}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className='text-right text-muted-foreground tabular-nums'>
                    {fmtInt(r.pop2010)}
                  </TableCell>
                  <TableCell className='text-right font-medium tabular-nums'>
                    {fmtInt(r.pop2019)}
                  </TableCell>
                  <TableCell className='hidden text-right tabular-nums md:table-cell'>
                    {fmtSigned(r.change, fmtInt)}
                  </TableCell>
                  <TableCell className='text-right'>
                    <span
                      className={cn(
                        'inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-xs font-medium tabular-nums',
                        r.growth >= 0
                          ? 'bg-emerald-500/10 text-[#006300] dark:text-[#0ca30c]'
                          : 'bg-red-500/10 text-red-600 dark:text-red-400'
                      )}
                    >
                      {r.growth >= 0 ? (
                        <ArrowUpRight className='size-3' />
                      ) : (
                        <ArrowDownRight className='size-3' />
                      )}
                      {fmtPct(r.growth)}
                    </span>
                  </TableCell>
                  <TableCell className='hidden text-right tabular-nums lg:table-cell'>
                    {fmtPct(r.cagr, 2)}
                  </TableCell>
                  <TableCell className='hidden text-right tabular-nums sm:table-cell'>
                    {r.share < 0.1 ? r.share.toFixed(2) : r.share.toFixed(1)}%
                  </TableCell>
                  <TableCell className='hidden py-1 xl:table-cell'>
                    <SparkAreaChart
                      data={YEARS.map((y, k) => ({
                        year: y,
                        value: r.c.values[k],
                      }))}
                      index='year'
                      categories={['value']}
                      colors={[r.c.subregion]}
                      autoMinValue
                      className='h-8 w-28'
                    />
                  </TableCell>
                </motion.tr>
              ))}
              {data.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={COLUMNS.length + 2}
                    className='h-24 text-center text-muted-foreground'
                  >
                    No countries match “{query}”.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <p className='mt-3 text-xs text-muted-foreground'>
          Arrows beside the rank show movement in the size ranking since 2010.
        </p>
      </CardContent>
    </Card>
  )
}
