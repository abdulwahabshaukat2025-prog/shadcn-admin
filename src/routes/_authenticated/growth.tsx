import { createFileRoute } from '@tanstack/react-router'
import { PopulationGrowthPage } from '@/features/population'

export const Route = createFileRoute('/_authenticated/growth')({
  component: PopulationGrowthPage,
})
