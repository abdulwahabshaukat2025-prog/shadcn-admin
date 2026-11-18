import { useEffect, useState } from 'react'
import { Maximize2, Minimize2 } from 'lucide-react'
import { motion } from 'motion/react'
import { Button } from '@/components/ui/button'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { TopNav } from '@/components/layout/top-nav'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'

const NAV = [
  { title: 'Overview', href: '/' },
  { title: 'Map', href: '/map' },
  { title: 'Growth', href: '/growth' },
  { title: 'Countries', href: '/countries' },
]

function PresentButton() {
  const [full, setFull] = useState(false)
  useEffect(() => {
    const on = () => setFull(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', on)
    return () => document.removeEventListener('fullscreenchange', on)
  }, [])
  return (
    <Button
      size='sm'
      variant={full ? 'secondary' : 'default'}
      onClick={() =>
        full
          ? document.exitFullscreen()
          : document.documentElement.requestFullscreen?.()
      }
    >
      {full ? (
        <Minimize2 className='size-4' />
      ) : (
        <Maximize2 className='size-4' />
      )}
      <span className='hidden sm:inline'>{full ? 'Exit' : 'Present'}</span>
    </Button>
  )
}

export function PageShell({
  path,
  eyebrow,
  title,
  subtitle,
  children,
}: {
  path: string
  eyebrow: string
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <>
      <Header>
        <TopNav
          links={NAV.map((n) => ({ ...n, isActive: n.href === path }))}
          className='me-auto'
        />
        <Search />
        <ThemeSwitch />
        <ConfigDrawer />
        <PresentButton />
      </Header>

      <Main className='space-y-6'>
        <section className='relative overflow-hidden rounded-2xl border bg-card px-6 py-7 sm:px-8'>
          <div
            aria-hidden
            className='pointer-events-none absolute inset-0 opacity-70 dark:opacity-60'
            style={{
              background:
                'radial-gradient(600px circle at 0% 0%, rgba(42,120,214,.16), transparent 60%), radial-gradient(500px circle at 100% 0%, rgba(235,104,52,.14), transparent 60%), radial-gradient(500px circle at 70% 120%, rgba(27,175,122,.14), transparent 60%)',
            }}
          />
          <motion.div
            aria-hidden
            className='pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-[conic-gradient(from_0deg,#2a78d6,#1baf7a,#eb6834,#2a78d6)] opacity-20 blur-3xl'
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          />
          <div className='relative'>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className='text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase'
            >
              {eyebrow}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className='mt-2 text-3xl font-bold tracking-tight text-balance sm:text-4xl'
            >
              {title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.12 }}
              className='mt-2 max-w-3xl text-sm text-pretty text-muted-foreground sm:text-base'
            >
              {subtitle}
            </motion.p>
          </div>
        </section>

        {children}

        <footer className='pb-4 text-xs text-muted-foreground'>
          Source: World Bank, World Development Indicators — “Population, total”
          (SP.POP.TOTL), mid-year estimates, data last updated 1 July 2020.
          Licensed under{' '}
          <a
            className='underline underline-offset-2 hover:text-foreground'
            href='https://datacatalog.worldbank.org/public-licenses#cc-by'
            target='_blank'
            rel='noreferrer'
          >
            CC BY 4.0
          </a>
          . 42 countries and territories of Latin America and the Caribbean.
        </footer>
      </Main>
    </>
  )
}
