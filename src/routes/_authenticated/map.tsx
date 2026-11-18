import { createFileRoute } from '@tanstack/react-router'
import { PopulationMapPage } from '@/features/population'

export const Route = createFileRoute('/_authenticated/map')({
  component: PopulationMapPage,
})
