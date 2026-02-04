import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Zap,
  CheckCircle2,
  BarChart3,
  AlertOctagon,
  Settings,
  Bell,
  Check,
  Clock,
  Trash2,
  Archive,
  MoreVertical
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useI18n } from "@/hooks/use-i18n"

type NotificationType = "focus" | "task" | "summary" | "blocker" | "system"

interface Notification {
  id: string
  title: string
  message: string
  time: string
  read: boolean
  type: NotificationType
}

const initialNotifications: Notification[] = [
  {
    id: "1",
    title: "Focus Session Complete",
    message: "You completed a 45-minute deep work session. Great job maintaining focus!",
    time: "2 mins ago",
    read: false,
    type: "focus"
  },
  {
    id: "2",
    title: "Task Deadline Approaching",
    message: "The 'Q3 Roadmap Planning' task is due in 2 hours.",
    time: "1 hour ago",
    read: false,
    type: "task"
  },
  {
    id: "3",
    title: "High Distraction Alert",
    message: "We detected frequent context switching. Consider enabling Strict Mode.",
    time: "3 hours ago",
    read: true,
    type: "blocker"
  },
  {
    id: "4",
    title: "Daily Productivity Summary",
    message: "You completed 12 tasks yesterday and spent 5h in deep work.",
    time: "Yesterday",
    read: true,
    type: "summary"
  },
  {
    id: "5",
    title: "Blocker Resolved",
    message: "The dependency for 'API Integration' has been marked as complete.",
    time: "Yesterday",
    read: true,
    type: "task"
  },
  {
    id: "6",
    title: "System Maintenance",
    message: "FocusFlow will be undergoing scheduled maintenance tonight at 2 AM.",
    time: "2 days ago",
    read: true,
    type: "system"
  }
]

export default function NotificationsPage() {
  const { t } = useI18n()
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)
  const [activeTab, setActiveTab] = useState("all")

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id))
  }

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case "focus": return <Zap className="h-4 w-4 text-amber-500" />
      case "task": return <CheckCircle2 className="h-4 w-4 text-blue-500" />
      case "blocker": return <AlertOctagon className="h-4 w-4 text-red-500" />
      case "summary": return <BarChart3 className="h-4 w-4 text-purple-500" />
      case "system": return <Settings className="h-4 w-4 text-slate-500" />
      default: return <Bell className="h-4 w-4 text-slate-500" />
    }
  }

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === "unread") return !n.read
    if (activeTab === "archived") return false // Placeholder for archived logic
    return true
  })

  return (
    <DashboardLayout>
      <div className="container mx-auto max-w-4xl px-4 py-4 md:py-8">
        <div className="mb-6 md:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">{t('notifications')}</h1>
            <p className="mt-1 text-sm md:text-base text-muted-foreground">{t('stayUpdated')}</p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button variant="outline" size="sm" onClick={markAllAsRead} disabled={unreadCount === 0} className="w-full sm:w-auto">
              <Check className="mr-2 h-4 w-4" />
              {t('markAllRead')}
            </Button>
          </div>
        </div>

        <div className="grid gap-6">
          <Card className="shadow-sm">
            <CardHeader className="pb-3 border-b">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
                  <TabsList className="flex flex-wrap h-auto w-full md:w-auto p-1 gap-1">
                    <TabsTrigger value="all" className="flex-1 md:flex-none min-w-[80px]">{t('all')}</TabsTrigger>
                    <TabsTrigger value="unread" className="relative flex-1 md:flex-none min-w-[80px]">
                      {t('unread')}
                      {unreadCount > 0 && (
                        <Badge variant="destructive" className="ml-2 h-5 w-5 rounded-full px-0 flex items-center justify-center text-[10px]">
                          {unreadCount}
                        </Badge>
                      )}
                    </TabsTrigger>
                    <TabsTrigger value="archived">{t('archived')}</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[500px] md:h-[600px]">
                {filteredNotifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="rounded-full bg-muted p-4">
                      <Bell className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-foreground">{t('noNotifications')}</h3>
                    <p className="mt-2 text-sm text-muted-foreground max-w-xs">
                      {t('caughtUp')}
                    </p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredNotifications.map((notification) => (
                      <div 
                        key={notification.id} 
                        className={cn(
                          "flex items-start gap-4 p-4 transition-colors hover:bg-muted/50",
                          !notification.read && "bg-primary/5"
                        )}
                      >
                        <div className={cn(
                          "mt-1 flex h-9 w-9 items-center justify-center rounded-full border shadow-sm",
                          !notification.read ? "bg-card border-primary/20" : "bg-muted/50 border-border"
                        )}>
                          {getIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <p className={cn("text-sm font-medium leading-none", !notification.read ? "text-foreground" : "text-muted-foreground")}>
                              {notification.title}
                            </p>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {notification.time}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {notification.message}
                          </p>
                        </div>

                        <div className="flex items-center">
                          {!notification.read && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
                              onClick={() => markAsRead(notification.id)}
                              title={t('markAsRead')}
                            >
                              <span className="h-2 w-2 rounded-full bg-primary" />
                            </Button>
                          )}
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => markAsRead(notification.id)}>
                                <Check className="mr-2 h-4 w-4" /> {t('markAsRead')}
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Archive className="mr-2 h-4 w-4" /> {t('archive')}
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => deleteNotification(notification.id)}>
                                <Trash2 className="mr-2 h-4 w-4" /> {t('delete')}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
