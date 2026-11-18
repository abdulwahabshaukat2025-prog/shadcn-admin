import { createFileRoute } from '@tanstack/react-router'
import { PopulationCountriesPage } from '@/features/population'

export const Route = createFileRoute('/_authenticated/countries')({
  component: PopulationCountriesPage,
})
