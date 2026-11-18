import { BarRace } from './components/bar-race'
import { CountriesTable } from './components/countries-table'
import { BubbleRace, IndexedLines } from './components/growth-charts'
import { KpiCards } from './components/kpi-cards'
import {
  AdditionsChart,
  Movers,
  ShareTreemap,
} from './components/overview-charts'
import { PageShell } from './components/page-shell'
import { PopulationMap } from './components/population-map'

export function PopulationOverview() {
  return (
    <PageShell
      path='/'
      eyebrow='Latin America & the Caribbean · 2010–2019'
      title='A decade of population change'
      subtitle='56.5 million more people across 42 countries and territories, but growth is slowing, and a few places are shrinking.'
    >
      <KpiCards />
      <BarRace />
      <div className='grid gap-4 lg:grid-cols-7'>
        <div className='lg:col-span-4'>
          <AdditionsChart />
        </div>
        <div className='lg:col-span-3'>
          <Movers />
        </div>
      </div>
      <ShareTreemap />
    </PageShell>
  )
}

export function PopulationMapPage() {
  return (
    <PageShell
      path='/map'
      eyebrow='Geography'
      title='Growth across the map'
      subtitle='Press play to watch the decade unfold. Central America grew fastest; Puerto Rico and Venezuela went the other way.'
    >
      <PopulationMap />
    </PageShell>
  )
}

export function PopulationGrowthPage() {
  return (
    <PageShell
      path='/growth'
      eyebrow='Momentum'
      title='Who is growing, and how fast'
      subtitle='Big countries are not always the fast ones. Compare size against speed, then follow six countries on a common scale.'
    >
      <BubbleRace />
      <IndexedLines />
    </PageShell>
  )
}

export function PopulationCountriesPage() {
  return (
    <PageShell
      path='/countries'
      eyebrow='Data'
      title='Country by country'
      subtitle='Every figure behind the charts: search, sort, filter by subregion, or download the full table.'
    >
      <CountriesTable />
    </PageShell>
  )
}
