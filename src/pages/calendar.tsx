import { useState, useMemo, useEffect, useRef } from "react"
import { Calendar } from "@/components/ui/calendar"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Settings2 } from "lucide-react"
import { CalendarMetrics } from "@/components/calendar/calendar-metrics"
import { FocusSessionWidget } from "@/components/calendar/focus-session-widget"
import { UpcomingList } from "@/components/calendar/upcoming-list"
import { DailyTimeline, Event } from "@/components/calendar/daily-timeline"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { addDays, addWeeks, subDays, subWeeks, startOfWeek, endOfWeek, format, isSameDay } from "date-fns"
import toast from 'react-hot-toast'
import { SettingsPanel, CalendarSettings } from "@/components/calendar/settings-panel"
import { useMutation } from "convex/react"
import { api } from "../../convex/_generated/api"

const colorPreviewMap: Record<string, string> = {
  blue: "bg-blue-500",
  indigo: "bg-indigo-500",
  violet: "bg-violet-500",
  emerald: "bg-emerald-500",
  rose: "bg-rose-500",
}

export default function CalendarPage() {
  const [date, setDate] = useState<Date>(new Date())
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const logEvent = useMutation(api.activity.logEvent)

  // Calendar Settings
  const [settings, setSettings] = useState<CalendarSettings>({
    workingHours: { start: 9, end: 17 },
    defaultDuration: 60,
    showWeekends: true,
    snapInterval: 30,
    defaultColor: 'blue'
  })

  // Mock initial events
  const [events, setEvents] = useState<Event[]>([
    {
      id: 1,
      title: "Deep Work: Project Alpha",
      date: new Date(),
      time: "10:00 AM - 12:00 PM",
      startHour: 10,
      duration: 2,
      color: "blue",
      tags: ["High Priority", "Dev"],
    },
    {
      id: 2,
      title: "Lunch & Recharge",
      date: new Date(),
      time: "12:00 PM - 1:00 PM",
      startHour: 12,
      duration: 1,
      color: "emerald",
      tags: ["Personal"],
    },
    {
      id: 3,
      title: "Team Sync",
      date: addDays(new Date(), 1),
      time: "2:00 PM - 3:00 PM",
      startHour: 14,
      duration: 1,
      color: "indigo",
      tags: ["Meeting"],
    }
  ])

  // Timer State
  const [activeEventId, setActiveEventId] = useState<number | null>(null)
  const [timerState, setTimerState] = useState({
    isRunning: false,
    timeLeft: 25 * 60 // Default 25 mins
  })
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const [sessionCompleted, setSessionCompleted] = useState(false)

  const activeEvent = useMemo(() => 
    events.find(e => e.id === activeEventId) || null
  , [events, activeEventId])

  // Timer Logic
  useEffect(() => {
    if (timerState.isRunning && timerState.timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimerState(prev => {
          if (prev.timeLeft <= 1) {
            clearInterval(timerRef.current!)
            setSessionCompleted(true)
            return { isRunning: false, timeLeft: 0 }
          }
          return { ...prev, timeLeft: prev.timeLeft - 1 }
        })
      }, 1000)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [timerState.isRunning])

  // Handle session completion logging
  useEffect(() => {
    if (sessionCompleted) {
      toast.success("Focus session completed!")
      if (activeEvent) {
        logEvent({
          type: "focus",
          label: activeEvent.title,
          minutes: Math.round(activeEvent.duration * 60),
        })
      }
      setSessionCompleted(false)
    }
  }, [sessionCompleted, activeEvent, logEvent])

  const handleToggleTimer = () => {
    setTimerState(prev => ({ ...prev, isRunning: !prev.isRunning }))
  }

  const handleCompleteSession = () => {
    setTimerState({ isRunning: false, timeLeft: 0 })
    setActiveEventId(null)
    toast.success("Session marked as complete")
  }

  const handleStartSession = (event: Event) => {
    setActiveEventId(event.id)
    // Calculate time left based on event duration or default to 25m pomodoro?
    // Let's default to event duration in seconds, but capped at something reasonable or just use event duration.
    // Ideally focus session is a part of the event. Let's start with 25m focus block by default or event duration.
    // Let's use event duration for now.
    const durationSeconds = event.duration * 60 * 60
    setTimerState({
      isRunning: true,
      timeLeft: durationSeconds
    })
    toast.success(`Started session: ${event.title}`)
  }

  // Form State
  const [editingEventId, setEditingEventId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    startTime: "09:00",
    durationHours: "1",
    durationMinutes: "0",
    tag: "Work",
    color: "blue" as Event['color']
  })

  // Navigation Handlers
  const handlePrev = () => {
    if (viewMode === 'day') {
      setDate(prev => subDays(prev, 1))
    } else {
      setDate(prev => subWeeks(prev, 1))
    }
  }

  const handleNext = () => {
    if (viewMode === 'day') {
      setDate(prev => addDays(prev, 1))
    } else {
      setDate(prev => addWeeks(prev, 1))
    }
  }

  const handleSync = () => {
    setDate(new Date())
    toast.success("Calendar synced", {
      style: {
        background: '#333',
        color: '#fff',
        border: '1px solid rgba(255,255,255,0.1)'
      },
      iconTheme: {
        primary: '#10b981',
        secondary: '#fff',
      },
    })
  }

  // Event Handlers
  const handleEventUpdate = (updatedEvent: Event) => {
    setEvents(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e))
  }

  const handleEventDelete = (eventId: number) => {
    setEvents(prev => prev.filter(e => e.id !== eventId))
    if (activeEventId === eventId) {
      setActiveEventId(null)
      setTimerState(prev => ({ ...prev, isRunning: false }))
    }
    toast.success("Event deleted")
  }

  const handleEventEdit = (event: Event) => {
    setEditingEventId(event.id)
    
    // Parse start hour back to HH:MM
    const h = Math.floor(event.startHour)
    const m = Math.round((event.startHour - h) * 60)
    const startTime = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
    
    const durH = Math.floor(event.duration)
    const durM = Math.round((event.duration - durH) * 60)

    setFormData({
      title: event.title,
      startTime,
      durationHours: durH.toString(),
      durationMinutes: durM.toString(),
      tag: event.tags?.[0] || "Work",
      color: event.color
    })
    setIsDialogOpen(true)
  }

  const handleOpenNewEvent = () => {
    setEditingEventId(null)
    const durH = Math.floor(settings.defaultDuration / 60)
    const durM = settings.defaultDuration % 60
    
    setFormData({
      title: "",
      startTime: "09:00",
      durationHours: durH.toString(),
      durationMinutes: durM.toString(),
      tag: "Work",
      color: settings.defaultColor
    })
    setIsDialogOpen(true)
  }

  const handleSaveEvent = () => {
    if (!formData.title) {
      toast.error("Please enter a title")
      return
    }

    // Parse start time to hours
    const [hours, minutes] = formData.startTime.split(':').map(Number)
    const startHour = hours + minutes / 60
    
    // Format time string
    const startTimeDate = new Date()
    startTimeDate.setHours(hours, minutes)
    const endTimeDate = new Date(startTimeDate.getTime() + (Number(formData.durationHours) * 60 + Number(formData.durationMinutes)) * 60000)
    
    const timeString = `${format(startTimeDate, 'h:mm a')} - ${format(endTimeDate, 'h:mm a')}`
    const duration = Number(formData.durationHours) + Number(formData.durationMinutes) / 60

    if (editingEventId) {
      // Update existing
      setEvents(prev => prev.map(e => {
        if (e.id === editingEventId) {
          return {
            ...e,
            title: formData.title,
            time: timeString,
            startHour,
            duration,
            color: formData.color,
            tags: [formData.tag]
          }
        }
        return e
      }))
      toast.success("Event updated")
    } else {
      // Create new
      const event: Event = {
        id: Date.now(),
        title: formData.title,
        date: date, // Create on currently selected date
        time: timeString,
        startHour,
        duration,
        color: formData.color,
        tags: [formData.tag]
      }
      setEvents(prev => [...prev, event])
      toast.success("Event created")
    }

    setIsDialogOpen(false)
  }

  // Metrics Calculation
  const metrics = useMemo(() => {
    let relevantEvents = events
    
    if (viewMode === 'day') {
      relevantEvents = events.filter(e => isSameDay(e.date, date))
    } else {
      const start = startOfWeek(date)
      const end = endOfWeek(date)
      relevantEvents = events.filter(e => e.date >= start && e.date <= end)
    }

    const totalMinutes = relevantEvents.reduce((acc, curr) => acc + (curr.duration * 60), 0)
    const hours = Math.floor(totalMinutes / 60)
    const mins = Math.round(totalMinutes % 60)
    const totalFocus = `${hours}h ${mins}m`

    const focusEvents = relevantEvents.filter(e => 
      e.tags?.includes('High Priority') || 
      e.tags?.includes('Dev') || 
      e.tags?.includes('Deep Work') ||
      e.color === 'blue' || 
      e.color === 'violet'
    )
    const focusMinutes = focusEvents.reduce((acc, curr) => acc + (curr.duration * 60), 0)
    
    const efficiencyVal = totalMinutes > 0 ? Math.round((focusMinutes / totalMinutes) * 100) : 0
    const efficiency = `${efficiencyVal}%`

    const scheduleCount = `${relevantEvents.length}`

    return { totalFocus, efficiency, scheduleCount }
  }, [events, date, viewMode])

  // Filtered Events for Display
  const currentEvents = useMemo(() => {
    if (viewMode === 'day') {
      return events.filter(e => isSameDay(e.date, date))
    }
    return events 
  }, [events, date, viewMode])

  // Upcoming Events (future events today or later)
  const upcomingEvents = useMemo(() => {
    const now = new Date()
    return events
      .filter(e => e.date >= now || (isSameDay(e.date, now) && e.startHour > now.getHours()))
      .sort((a, b) => a.date.getTime() - b.date.getTime() || a.startHour - b.startHour)
  }, [events])

  const nextEvent = upcomingEvents[0] || null

  // Week Days
  const weekDays = useMemo(() => {
    const start = startOfWeek(date, { weekStartsOn: 1 }) // Monday start
    const days = Array.from({ length: 7 }, (_, i) => addDays(start, i))
    
    if (!settings.showWeekends) {
      return days.filter(d => {
        const day = d.getDay()
        return day !== 0 && day !== 6 // 0 is Sunday, 6 is Saturday
      })
    }
    return days
  }, [date, settings.showWeekends])

  return (
    <DashboardLayout>
      <div className="space-y-3 pb-3">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <h1 className="text-lg font-light tracking-wide text-foreground">
              CALENDAR
            </h1>
            <p className="text-[10px] text-muted-foreground/80 font-light">
              Manage your schedule and focus blocks
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSync}
              className="border-white/10 bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground h-8 text-xs"
            >
              <CalendarIcon className="mr-2 h-3 w-3" />
              Sync
            </Button>
            <Button 
              size="sm" 
              onClick={handleOpenNewEvent}
              className="bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.2)] h-8 text-xs"
            >
              <Plus className="mr-2 h-3 w-3" />
              New Block
            </Button>
          </div>
        </div>

        {/* Metrics Row */}
        <CalendarMetrics 
          totalFocus={metrics.totalFocus}
          efficiency={metrics.efficiency}
          scheduleCount={metrics.scheduleCount}
        />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          {/* Main Calendar Area */}
          <div className="lg:col-span-8 xl:col-span-9 flex flex-col gap-3">
            
            {/* Timeline Card */}
            <div className="relative h-auto min-h-[780px] rounded-2xl border border-white/5 bg-background/40 backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden">
              {/* Header of Timeline */}
              <div className="flex items-center justify-between border-b border-white/5 p-3 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col">
                    <h2 className="text-xl font-light text-foreground tracking-tight">
                      {viewMode === 'day' ? date.getDate() : `Week ${format(date, 'w')}`}
                    </h2>
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                      {viewMode === 'day' 
                        ? format(date, 'EEEE, MMMM yyyy') 
                        : `${format(startOfWeek(date, { weekStartsOn: 1 }), 'MMM d')} - ${format(endOfWeek(date, { weekStartsOn: 1 }), 'MMM d')}`
                      }
                    </span>
                  </div>
                  <div className="h-6 w-[1px] bg-white/10" />
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={handlePrev} className="h-7 w-7 text-muted-foreground hover:text-foreground">
                      <ChevronLeft className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={handleNext} className="h-7 w-7 text-muted-foreground hover:text-foreground">
                      <ChevronRight className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                   <div className="flex bg-white/5 rounded-lg p-0.5 border border-white/5">
                     <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setViewMode('day')}
                        className={`text-[10px] font-medium h-6 px-2 rounded-md transition-all ${viewMode === 'day' ? 'bg-white/10 text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                      >
                       Day
                     </Button>
                     <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setViewMode('week')}
                        className={`text-[10px] font-medium h-6 px-2 rounded-md transition-all ${viewMode === 'week' ? 'bg-white/10 text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                      >
                       Week
                     </Button>
                   </div>
                   <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 ml-1"
                    onClick={() => setIsSettingsOpen(true)}
                  >
                     <Settings2 className="h-3 w-3" />
                   </Button>
                </div>
              </div>

              {/* Content Split: DatePicker + Timeline */}
              <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
                {/* Left: Mini Calendar */}
                <div className="md:w-64 border-r border-white/5 bg-white/[0.01] p-3 hidden md:block shrink-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(d) => d && setDate(d)}
                    className="rounded-xl border border-white/5 bg-background/50 p-2 shadow-inner scale-90 origin-top-left"
                  />
                  
                  <div className="mt-2 space-y-2">
                    <h4 className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1">
                      Calendars
                    </h4>
                    <div className="space-y-1">
                      {['Work', 'Personal', 'Focus'].map(cal => (
                        <div key={cal} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground cursor-pointer group">
                          <div className={`h-1.5 w-1.5 rounded-full ${cal === 'Focus' ? 'bg-blue-500' : cal === 'Work' ? 'bg-emerald-500' : 'bg-violet-500'} ring-2 ring-transparent group-hover:ring-white/20 transition-all`} />
                          {cal}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: Timeline */}
                <div className="flex-1 relative overflow-y-auto overflow-x-hidden">
                   {viewMode === 'day' ? (
                     <DailyTimeline 
                      events={currentEvents} 
                      startHour={settings.workingHours.start}
                      endHour={settings.workingHours.end}
                      snapInterval={settings.snapInterval}
                      onEventUpdate={handleEventUpdate}
                      onEventDelete={handleEventDelete}
                      onEventEdit={handleEventEdit}
                      onEventSelect={handleStartSession}
                     />
                   ) : (
                     <div className="flex h-full divide-x divide-white/5 min-w-[800px]">
                       {weekDays.map((day, i) => {
                         const dayEvents = events.filter(e => isSameDay(e.date, day))
                         const isToday = isSameDay(day, new Date())
                         return (
                           <div key={day.toString()} className="flex-1 min-w-[120px] bg-background/20">
                             <div className={`text-center p-2 border-b border-white/5 sticky top-0 z-10 bg-background/95 backdrop-blur-sm ${isToday ? 'bg-blue-500/5' : ''}`}>
                               <div className={`text-[10px] uppercase font-medium ${isToday ? 'text-blue-400' : 'text-muted-foreground'}`}>
                                 {format(day, 'EEE')}
                               </div>
                               <div className={`text-sm font-light ${isToday ? 'text-blue-100' : 'text-foreground'}`}>
                                 {format(day, 'd')}
                               </div>
                             </div>
                             <div className="relative h-[600px]">
                               <DailyTimeline 
                                events={dayEvents} 
                                showTimeLabels={i === 0} 
                                startHour={settings.workingHours.start}
                                endHour={settings.workingHours.end}
                                snapInterval={settings.snapInterval}
                              />
                             </div>
                           </div>
                         )
                       })}
                     </div>
                   )}
                </div>
              </div>
            </div>
          </div>

          {/* Side Panel */}
          <div className="lg:col-span-4 xl:col-span-3 space-y-3">
            <FocusSessionWidget 
              activeEvent={activeEvent}
              nextEvent={nextEvent}
              timerState={timerState}
              onToggleTimer={handleToggleTimer}
              onCompleteSession={handleCompleteSession}
              onStartSession={handleStartSession}
            />
            <div className="rounded-2xl border border-white/5 bg-background/40 backdrop-blur-xl p-3 shadow-lg">
              <UpcomingList events={upcomingEvents} />
            </div>
          </div>
        </div>
      </div>

      {/* New/Edit Block Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-[#0A0A0A] border-white/10 text-foreground">
          <DialogHeader>
            <DialogTitle className="text-lg font-light tracking-wide">
              {editingEventId ? "Edit Block" : "New Block"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title" className="text-xs text-muted-foreground">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="bg-white/5 border-white/10 text-sm"
                placeholder="e.g. Deep Work"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="start-time" className="text-xs text-muted-foreground">Start Time</Label>
                <Input
                  id="start-time"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="bg-white/5 border-white/10 text-sm"
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-xs text-muted-foreground">Duration</Label>
                <div className="flex gap-2">
                  <Select 
                    value={formData.durationHours} 
                    onValueChange={(v) => setFormData({ ...formData, durationHours: v })}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-sm">
                      <SelectValue placeholder="Hours" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#111] border-white/10">
                      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(h => (
                        <SelectItem key={h} value={h.toString()}>{h}h</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select 
                    value={formData.durationMinutes} 
                    onValueChange={(v) => setFormData({ ...formData, durationMinutes: v })}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-sm">
                      <SelectValue placeholder="Mins" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#111] border-white/10">
                      {[0, 15, 30, 45].map(m => (
                        <SelectItem key={m} value={m.toString()}>{m}m</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="grid gap-2">
                <Label className="text-xs text-muted-foreground">Tag</Label>
                <Select 
                    value={formData.tag} 
                    onValueChange={(v) => setFormData({ ...formData, tag: v })}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-sm">
                      <SelectValue placeholder="Select tag" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#111] border-white/10">
                      {['Work', 'Personal', 'Dev', 'Meeting', 'Health'].map(t => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
               </div>
               <div className="grid gap-2">
                <Label className="text-xs text-muted-foreground">Color</Label>
                <Select 
                    value={formData.color} 
                    onValueChange={(v) => setFormData({ ...formData, color: v as any })}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-sm">
                      <SelectValue placeholder="Select color" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#111] border-white/10">
                      {['blue', 'indigo', 'violet', 'emerald', 'rose'].map(c => (
                        <SelectItem key={c} value={c}>
                          <div className="flex items-center gap-2">
                             <div className={`w-3 h-3 rounded-full ${colorPreviewMap[c]}`} />
                             <span className="capitalize">{c}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
               </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-white/10 hover:bg-white/5">Cancel</Button>
            <Button onClick={handleSaveEvent} className="bg-blue-600 hover:bg-blue-500">
              {editingEventId ? "Save Changes" : "Create Block"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="sm:max-w-[425px] bg-[#0A0A0A] border-white/10 text-foreground">
          <DialogHeader>
            <DialogTitle className="text-lg font-light tracking-wide">
              Calendar Settings
            </DialogTitle>
          </DialogHeader>
          <SettingsPanel 
            settings={settings}
            onSettingsChange={setSettings}
          />
          <DialogFooter>
            <Button onClick={() => setIsSettingsOpen(false)} className="w-full bg-white/5 hover:bg-white/10 border border-white/10">
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
