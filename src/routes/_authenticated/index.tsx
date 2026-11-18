import { createFileRoute } from '@tanstack/react-router'
import { PopulationOverview } from '@/features/population'

export const Route = createFileRoute('/_authenticated/')({
  component: PopulationOverview,
})
