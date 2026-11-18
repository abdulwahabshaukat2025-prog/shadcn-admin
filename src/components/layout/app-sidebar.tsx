import { useLayout } from '@/context/layout-provider'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { AppTitle } from './app-title'
import { sidebarData } from './data/sidebar-data'
import { NavGroup } from './nav-group'

export function AppSidebar() {
  const { collapsible, variant } = useLayout()
  return (
    <Sidebar collapsible={collapsible} variant={variant}>
      <SidebarHeader>
        <AppTitle />
      </SidebarHeader>
      <SidebarContent>
        {sidebarData.navGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <div className='rounded-lg border bg-sidebar-accent/40 p-3 text-xs leading-relaxed text-muted-foreground group-data-[collapsible=icon]:hidden'>
          <p className='font-medium text-sidebar-foreground'>Data source</p>
          World Bank, World Development Indicators. 42 countries &amp;
          territories, 2010–2019.
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
