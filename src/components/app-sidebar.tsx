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

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Calendar",
    url: "/calendar",
    icon: Calendar,
  },
  {
    title: "Notifications",
    url: "/notifications",
    icon: Bell,
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: PieChart,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
]

const tools = [
  {
    title: "Procrastination Analyzer",
    url: "/procrastination",
    icon: Hourglass,
  },
  {
    title: "Task Decomposer",
    url: "/task-decomposer",
    icon: Layers,
  },
  {
    title: "Distraction Cost",
    url: "/distraction-cost",
    icon: DollarSign,
  },
]

export function AppSidebar() {
  const { pathname } = useLocation()

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
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
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
          <SidebarGroupLabel>Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {tools.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
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
          © 2026 FocusFlow Inc.
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
