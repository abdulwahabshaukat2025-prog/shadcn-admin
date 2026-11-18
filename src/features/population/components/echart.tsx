import { useEffect, useRef } from 'react'
import {
  BarChart,
  LineChart,
  MapChart,
  ScatterChart,
  TreemapChart,
} from 'echarts/charts'
import {
  GeoComponent,
  GraphicComponent,
  GridComponent,
  LegendComponent,
  TimelineComponent,
  TooltipComponent,
  VisualMapComponent,
} from 'echarts/components'
import * as echarts from 'echarts/core'
import { LabelLayout, UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import { cn } from '@/lib/utils'

echarts.use([
  BarChart,
  LineChart,
  MapChart,
  ScatterChart,
  TreemapChart,
  GeoComponent,
  GraphicComponent,
  GridComponent,
  LegendComponent,
  TimelineComponent,
  TooltipComponent,
  VisualMapComponent,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
])

export { echarts }
export type EChartsOption = echarts.EChartsCoreOption
export type EChartsInstance = echarts.ECharts

interface EChartProps {
  option: EChartsOption
  className?: string
  /** Replace the whole option instead of merging (needed when series change shape). */
  notMerge?: boolean
  onReady?: (chart: EChartsInstance) => void
  onEvents?: Record<string, (params: unknown) => void>
  ariaLabel: string
}

/** Thin, resize-aware ECharts host. */
export function EChart({
  option,
  className,
  notMerge = false,
  onReady,
  onEvents,
  ariaLabel,
}: EChartProps) {
  const ref = useRef<HTMLDivElement>(null)
  const chartRef = useRef<EChartsInstance | null>(null)

  useEffect(() => {
    if (!ref.current) return
    const chart = echarts.init(ref.current, undefined, { renderer: 'canvas' })
    chartRef.current = chart
    onReady?.(chart)
    const ro = new ResizeObserver(() => chart.resize())
    ro.observe(ref.current)
    return () => {
      ro.disconnect()
      chart.dispose()
      chartRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    chartRef.current?.setOption(option, { notMerge })
  }, [option, notMerge])

  useEffect(() => {
    const chart = chartRef.current
    if (!chart || !onEvents) return
    for (const [name, fn] of Object.entries(onEvents)) chart.on(name, fn)
    return () => {
      for (const [name, fn] of Object.entries(onEvents)) chart.off(name, fn)
    }
  }, [onEvents])

  return (
    <div
      ref={ref}
      role='img'
      aria-label={ariaLabel}
      className={cn('h-80 w-full', className)}
    />
  )
}
