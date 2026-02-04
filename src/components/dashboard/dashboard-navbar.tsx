import { Bell, Globe, LayoutDashboard, PieChart, Search, Settings, Users } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useProfile } from "@/hooks/use-profile"

export function DashboardNavbar() {
  const { name, avatarUrl } = useProfile()

  return (
    <nav className="h-[70px] w-full border-b bg-card px-6 flex items-center justify-between z-50 relative">
      {/* Left: Logo */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
          <div className="h-5 w-5 bg-white rounded-full opacity-80" />
        </div>
        <span className="text-xl font-bold tracking-tight">Surgent</span>
      </div>

      {/* Center: Icon Nav */}
      <div className="flex items-center gap-1 bg-muted/30 p-1 rounded-full border border-border/50">
        <Button variant="ghost" size="icon" className="rounded-full bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary">
          <LayoutDashboard className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-foreground">
          <PieChart className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-foreground">
          <Users className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-foreground">
          <Settings className="h-5 w-5" />
        </Button>
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-[200px] rounded-full pl-9 bg-muted/50 border-transparent focus-visible:bg-background focus-visible:border-ring"
          />
        </div>
        
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground rounded-full">
          <Bell className="h-5 w-5" />
        </Button>
        
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground rounded-full">
          <Globe className="h-5 w-5" />
        </Button>

        <div className="flex items-center gap-3 pl-2 border-l border-border/50">
          <div className="text-right hidden md:block">
            <p className="text-sm font-medium leading-none">{name}</p>
            <p className="text-xs text-muted-foreground">Admin</p>
          </div>
          <Avatar className="h-9 w-9 border-2 border-primary/20">
            <AvatarImage src={avatarUrl} alt={name} className="object-cover" />
            <AvatarFallback className="bg-primary/10 text-primary">{name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </nav>
  )
}
