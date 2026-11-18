import {
  Globe2,
  LayoutDashboard,
  Palette,
  Table2,
  TrendingUp,
  Command,
} from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'LatAm Insights',
    email: 'World Bank WDI data',
    avatar: '',
  },
  teams: [
    {
      name: 'LatAm Insights',
      logo: Command,
      plan: 'Population 2010–2019',
    },
  ],
  navGroups: [
    {
      title: 'Population dashboard',
      items: [
        { title: 'Overview', url: '/', icon: LayoutDashboard },
        { title: 'Map', url: '/map', icon: Globe2 },
        { title: 'Growth', url: '/growth', icon: TrendingUp },
        { title: 'Countries', url: '/countries', icon: Table2 },
      ],
    },
    {
      title: 'Preferences',
      items: [
        { title: 'Appearance', url: '/settings/appearance', icon: Palette },
      ],
    },
  ],
}
