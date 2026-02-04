import { Link, useLocation } from "react-router"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { 
  LayoutDashboard, 
  PieChart, 
  Settings, 
  Hourglass, 
  Layers, 
  DollarSign,
  Calendar,
  Bell
} from "lucide-react"
import { useI18n } from "@/hooks/use-i18n"

export function AppSidebar() {
  const { pathname } = useLocation()
  const { t } = useI18n()

  // Menu items.
  const items = [
    {
      title: t('dashboard'),
      url: "/",
      icon: LayoutDashboard,
    },
    {
      title: t('calendar'),
      url: "/calendar",
      icon: Calendar,
    },
    {
      title: t('notifications'),
      url: "/notifications",
      icon: Bell,
    },
    {
      title: t('analytics'),
      url: "/analytics",
      icon: PieChart,
    },
    {
      title: t('settings'),
      url: "/settings",
      icon: Settings,
    },
  ]

  const tools = [
    {
      title: t('procrastinationAnalyzer'),
      url: "/procrastination",
      icon: Hourglass,
    },
    {
      title: t('taskDecomposer'),
      url: "/task-decomposer",
      icon: Layers,
    },
    {
      title: t('distractionCost'),
      url: "/distraction-cost",
      icon: DollarSign,
    },
  ]

  const isActive = (url: string) => {
    return url === "/" ? pathname === "/" : pathname.startsWith(url)
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="flex items-center justify-center py-4">
        <div className="flex items-center gap-2 font-bold text-xl px-2">
          <div className="bg-blue-600 text-white p-1 rounded-md shadow shadow-blue-600/20">
            <LayoutDashboard className="size-5" />
          </div>
          <span className="group-data-[collapsible=icon]:hidden">FocusFlow</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t('platform')}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>{t('tools')}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {tools.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="text-xs text-muted-foreground group-data-[collapsible=icon]:hidden text-center">
          {t('copyright')}
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
