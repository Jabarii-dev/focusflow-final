import { Link, useLocation } from "react-router"
import { 
  Bell, 
  Globe, 
  Search, 
  LayoutDashboard, 
  Settings, 
  DollarSign, 
  BarChart, 
  MoreHorizontal,
  Hourglass,
  Calendar,
  Layers,
  HelpCircle,
  Keyboard,
  MessageSquare,
  LogOut
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "react-hot-toast"
import { useAuthActions } from "@convex-dev/auth/react"
import { useProfile } from "@/hooks/use-profile"


export function Navbar() {
  const { setOpenMobile } = useSidebar()
  const { signOut } = useAuthActions()
  const { name } = useProfile()

  const handleSignOut = async () => {
    await signOut()
    toast.success("Signed out successfully")
  }

  return (
    <header className="flex h-[56px] items-center justify-between border-b bg-background px-4 sticky top-0 z-40">
      {/* Left: Logo */}
      <div className="flex items-center gap-4">
        <SidebarTrigger 
          className="md:hidden" 
          onMouseEnter={() => setOpenMobile(true)}
        />
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-600/20">
            <LayoutDashboard className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">FocusFlow</span>
        </div>
      </div>

      {/* Center: Menu */}
      <nav className="hidden md:flex items-center gap-2 lg:gap-6 px-2">
        <NavItem icon={LayoutDashboard} label="Dashboard" to="/" />
        <NavItem icon={Hourglass} label="Procrastination Analyzer" to="/procrastination" />
        <NavItem icon={Calendar} label="Calendar" to="/calendar" />
        <NavItem icon={Layers} label="Task Decomposer" to="/task-decomposer" />
        <NavItem icon={DollarSign} label="Distraction Cost" to="/distraction-cost" />
        <NavItem icon={BarChart} label="Analytics" to="/analytics" />
        <NavItem icon={Bell} label="Notifications" to="/notifications" />
        <NavItem icon={Settings} label="Settings" to="/settings" />
        
        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-lg hover:bg-muted transition-colors md:h-8 md:w-8 lg:h-9 lg:w-9"
                >
                  <MoreHorizontal className="h-4 w-4 lg:h-5 lg:w-5 stroke-1.5" />
                  <span className="sr-only">More</span>
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>More</p>
            </TooltipContent>
          </Tooltip>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => toast.success("Opening Help Center...")}>
              <HelpCircle className="mr-2 h-4 w-4" />
              <span>Help Center</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toast("Keyboard Shortcuts: Ctrl+K")}>
              <Keyboard className="mr-2 h-4 w-4" />
              <span>Keyboard Shortcuts</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toast("Thanks for your feedback!")}>
              <MessageSquare className="mr-2 h-4 w-4" />
              <span>Give Feedback</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>

      {/* Right: Controls */}
      <div className="flex items-center gap-4">
        <div className="relative hidden lg:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-64 rounded-full bg-muted/50 pl-9 focus-visible:ring-1"
          />
        </div>
        
        {/* Removed duplicate Bell from here as it's now in the center menu */}

        <Button variant="ghost" size="icon">
          <Globe className="h-5 w-5" />
        </Button>

        <div className="flex items-center gap-2 pl-2 border-l">
          <div className="text-right hidden xl:block">
            <p className="text-sm font-medium leading-none">{name}</p>
            <p className="text-xs text-muted-foreground">Admin</p>
          </div>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt={name} />
            <AvatarFallback>{name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}

function NavItem({ icon: Icon, label, active: explicitActive, to }: { icon: any, label: string, active?: boolean, to?: string }) {
  const location = useLocation()
  const isActive = explicitActive || (to && location.pathname === to)

  if (to) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            asChild
            variant="ghost"
            size="icon"
            className={cn(
              "rounded-lg hover:bg-muted transition-colors md:h-8 md:w-8 lg:h-9 lg:w-9",
              isActive && "text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700"
            )}
          >
            <Link to={to}>
              <Icon className={cn("h-4 w-4 lg:h-5 lg:w-5", isActive ? "stroke-2" : "stroke-1.5")} />
              <span className="sr-only">{label}</span>
            </Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    )
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "rounded-lg hover:bg-muted transition-colors md:h-8 md:w-8 lg:h-9 lg:w-9",
            isActive && "text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700"
          )}
        >
          <Icon className={cn("h-4 w-4 lg:h-5 lg:w-5", isActive ? "stroke-2" : "stroke-1.5")} />
          <span className="sr-only">{label}</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  )
}
