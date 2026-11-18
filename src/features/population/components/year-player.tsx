import { useCallback, useEffect, useState } from 'react'
import { Pause, Play, RotateCcw } from 'lucide-react'
import { inView } from 'motion'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { YEARS } from '../lib/stats'

/**
 * Drives a year-by-year animation. Starts playing the first time the chart
 * scrolls into view, stops on the last year, and can be scrubbed.
 */
export function useYearPlayer(
  target: React.RefObject<HTMLElement | null>,
  { start = 0, intervalMs = 1400 }: { start?: number; intervalMs?: number } = {}
) {
  const [index, setIndex] = useState(start)
  const [playing, setPlaying] = useState(false)

  // Start playing the first time the chart is at least 40% on screen.
  useEffect(() => {
    if (!target.current) return
    const stop = inView(
      target.current,
      () => {
        setPlaying(true)
        stop()
      },
      { amount: 0.4 }
    )
    return stop
  }, [target])

  useEffect(() => {
    if (!playing) return
    const id = window.setInterval(() => {
      setIndex((i) => {
        if (i >= YEARS.length - 1) {
          setPlaying(false)
          return i
        }
        return i + 1
      })
    }, intervalMs)
    return () => window.clearInterval(id)
  }, [playing, intervalMs])

  const toggle = useCallback(() => {
    setIndex((i) => (i >= YEARS.length - 1 && !playing ? start : i))
    setPlaying((p) => !p)
  }, [playing, start])

  const replay = useCallback(() => {
    setIndex(start)
    setPlaying(true)
  }, [start])

  const seek = useCallback((i: number) => {
    setPlaying(false)
    setIndex(i)
  }, [])

  return { index, year: YEARS[index], playing, toggle, replay, seek, start }
}

type Player = ReturnType<typeof useYearPlayer>

export function PlayerControls({
  player,
  className,
}: {
  player: Player
  className?: string
}) {
  const { index, playing, toggle, replay, seek, start } = player
  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      <Button
        size='icon'
        variant='secondary'
        className='size-8 rounded-full'
        onClick={toggle}
        aria-label={playing ? 'Pause animation' : 'Play animation'}
      >
        {playing ? <Pause className='size-4' /> : <Play className='size-4' />}
      </Button>
      <Button
        size='icon'
        variant='ghost'
        className='size-8 rounded-full'
        onClick={replay}
        aria-label='Replay from the start'
      >
        <RotateCcw className='size-4' />
      </Button>
      <div
        className='flex flex-1 items-center gap-1'
        role='group'
        aria-label='Select year'
      >
        {YEARS.map((y, i) =>
          i < start ? null : (
            <button
              key={y}
              type='button'
              onClick={() => seek(i)}
              aria-pressed={i === index}
              className='group relative flex h-8 flex-1 flex-col items-center justify-center rounded-md text-[11px] text-muted-foreground tabular-nums transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none'
            >
              <span
                className={cn(
                  'mb-1 h-1 w-full rounded-full bg-muted transition-colors duration-500',
                  i <= index && 'bg-primary/70',
                  i === index && 'bg-primary'
                )}
              />
              <span
                className={cn(
                  'hidden sm:block',
                  i === index && 'font-semibold text-foreground'
                )}
              >
                {y}
              </span>
            </button>
          )
        )}
      </div>
    </div>
  )
}
