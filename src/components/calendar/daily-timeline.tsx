import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { DndContext, DragEndEvent, useDraggable, useSensor, useSensors, PointerSensor } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import { Pencil, Trash2, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export interface Event {
  id: number
  title: string
  date: Date
  time: string
  startHour: number
  duration: number // in hours
  color: "blue" | "indigo" | "violet" | "emerald" | "rose"
  tags?: string[]
  isCompleted?: boolean
}

const colorMap = {
  blue: {
    wrapper: "bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/15",
    accent: "bg-blue-500",
    text: "text-blue-100",
    subtext: "text-blue-200/60",
    badge: "bg-blue-500/10 text-blue-200 border-blue-500/20",
  },
  indigo: {
    wrapper: "bg-indigo-500/10 border-indigo-500/20 hover:bg-indigo-500/15",
    accent: "bg-indigo-500",
    text: "text-indigo-100",
    subtext: "text-indigo-200/60",
    badge: "bg-indigo-500/10 text-indigo-200 border-indigo-500/20",
  },
  violet: {
    wrapper: "bg-violet-500/10 border-violet-500/20 hover:bg-violet-500/15",
    accent: "bg-violet-500",
    text: "text-violet-100",
    subtext: "text-violet-200/60",
    badge: "bg-violet-500/10 text-violet-200 border-violet-500/20",
  },
  emerald: {
    wrapper: "bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/15",
    accent: "bg-emerald-500",
    text: "text-emerald-100",
    subtext: "text-emerald-200/60",
    badge: "bg-emerald-500/10 text-emerald-200 border-emerald-500/20",
  },
  rose: {
    wrapper: "bg-rose-500/10 border-rose-500/20 hover:bg-rose-500/15",
    accent: "bg-rose-500",
    text: "text-rose-100",
    subtext: "text-rose-200/60",
    badge: "bg-rose-500/10 text-rose-200 border-rose-500/20",
  },
}

interface DailyTimelineProps {
  events: Event[]
  showTimeLabels?: boolean
  startHour?: number
  endHour?: number
  snapInterval?: number // in minutes
  onEventUpdate?: (event: Event) => void
  onEventDelete?: (eventId: number) => void
  onEventEdit?: (event: Event) => void
  onEventSelect?: (event: Event) => void
}

const ROW_HEIGHT = 76

function DraggableEvent({ 
  event, 
  timelineStartHour,
  onEdit, 
  onDelete,
  onSelect 
}: { 
  event: Event
  timelineStartHour: number
  onEdit?: (e: Event) => void
  onDelete?: (id: number) => void
  onSelect?: (e: Event) => void
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: event.id.toString(),
    data: event,
  })

  const style = {
    transform: CSS.Translate.toString(transform),
    top: (event.startHour - timelineStartHour) * ROW_HEIGHT + 2,
    height: event.duration * ROW_HEIGHT - 4,
    zIndex: isDragging ? 50 : undefined,
  }

  const colorStyles = colorMap[event.color] || colorMap.blue

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "absolute left-1 right-1 rounded-md border backdrop-blur-md transition-shadow duration-200 group overflow-hidden cursor-grab active:cursor-grabbing",
        isDragging ? "shadow-2xl opacity-80 z-50 ring-2 ring-blue-500/50" : "hover:z-20 hover:shadow-lg",
        colorStyles.wrapper
      )}
      {...listeners}
      {...attributes}
      onClick={(e) => {
        e.stopPropagation()
        onSelect?.(event)
      }}
    >
      <div className="flex h-full relative">
        {/* Accent Bar */}
        <div className={cn("w-1 h-full flex-none", colorStyles.accent)} />
        
        {/* Content */}
        <div className="flex-1 p-2.5 flex flex-col min-w-0">
          <div className="flex items-start justify-between gap-2">
            <span className={cn("text-xs font-semibold truncate leading-tight", colorStyles.text)}>
              {event.title}
            </span>
            
            {/* Actions - Visible on Hover */}
            <div className="hidden group-hover:flex items-center gap-1 absolute top-2 right-2 bg-background/50 backdrop-blur-sm rounded-md p-0.5 border border-white/10" onPointerDown={(e) => e.stopPropagation()}>
               <Button 
                variant="ghost" 
                size="icon" 
                className="h-5 w-5 hover:bg-white/10 hover:text-blue-300"
                onClick={(e) => {
                  e.stopPropagation()
                  onSelect?.(event)
                }}
              >
                <Play className="h-3 w-3" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-5 w-5 hover:bg-white/10 hover:text-blue-300"
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit?.(event)
                }}
              >
                <Pencil className="h-3 w-3" />
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-5 w-5 hover:bg-white/10 hover:text-rose-300"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-[#111] border-white/10 text-foreground">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Event?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently remove "{event.title}" from your schedule.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-white/5 border-white/10 hover:bg-white/10 text-foreground">Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      className="bg-rose-600 hover:bg-rose-700 text-white"
                      onClick={(e) => {
                        e.stopPropagation()
                        onDelete?.(event.id)
                      }}
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
          
          <span className={cn("text-[10px] font-medium mt-0.5", colorStyles.subtext)}>
            {event.time}
          </span>

          {event.duration * ROW_HEIGHT > 60 && event.tags && (
            <div className="flex gap-1.5 mt-auto pt-2">
              {event.tags.map(tag => (
                <Badge 
                  key={tag} 
                  variant="outline" 
                  className={cn("text-[9px] px-1.5 py-0 h-4 border-0 rounded-sm font-medium", colorStyles.badge)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function DailyTimeline({ 
  events, 
  showTimeLabels = true,
  startHour = 9,
  endHour = 17,
  snapInterval = 30,
  onEventUpdate,
  onEventDelete,
  onEventEdit,
  onEventSelect
}: DailyTimelineProps) {
  
  // Generate hours array
  const hours = Array.from(
    { length: endHour - startHour + 1 }, 
    (_, i) => startHour + i
  )

  // Current time indicator
  const [currentTime, setCurrentTime] = useState<number | null>(null)

  useEffect(() => {
    // Set mock time 2:15 PM = 14.25
    setCurrentTime(14.25)
  }, [])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event
    if (!onEventUpdate) return

    const draggedEvent = active.data.current as Event
    if (!draggedEvent) return

    // Calculate new start hour based on delta.y
    const pixelsPerMinute = ROW_HEIGHT / 60
    const snapPixels = pixelsPerMinute * snapInterval
    const steps = Math.round(delta.y / snapPixels)
    const hourChange = steps * (snapInterval / 60)
    
    let newStartHour = draggedEvent.startHour + hourChange
    
    // Clamp to bounds
    if (newStartHour < startHour) newStartHour = startHour
    if (newStartHour + draggedEvent.duration > endHour + 1) newStartHour = endHour + 1 - draggedEvent.duration

    if (newStartHour !== draggedEvent.startHour) {
      // Update time string
      const startTotalMinutes = newStartHour * 60
      const endTotalMinutes = (newStartHour + draggedEvent.duration) * 60
      
      const formatTime = (totalMins: number) => {
        const h = Math.floor(totalMins / 60)
        const m = Math.round(totalMins % 60)
        const period = h >= 12 ? 'PM' : 'AM'
        const displayH = h > 12 ? h - 12 : h
        return `${displayH}:${m.toString().padStart(2, '0')} ${period}`
      }

      const newTimeStr = `${formatTime(startTotalMinutes)} - ${formatTime(endTotalMinutes)}`

      onEventUpdate({
        ...draggedEvent,
        startHour: newStartHour,
        time: newTimeStr
      })
    }
  }

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="flex h-auto w-full bg-background/20 pt-2 select-none">
        {/* Time Column */}
        {showTimeLabels && (
          <div className="flex-none w-16 border-r border-white/5 bg-white/[0.01]">
            {hours.map((hour) => (
              <div 
                key={hour} 
                className="relative border-b border-transparent"
                style={{ height: ROW_HEIGHT }}
              >
                <span className="absolute -top-1.5 right-3 text-[10px] font-medium text-muted-foreground/50 tabular-nums tracking-wide">
                  {hour === 0 ? '12 AM' : hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Grid & Events Column */}
        <div className="flex-1 relative">
          {/* Grid Lines */}
          <div className="absolute inset-0 flex flex-col pointer-events-none">
            {hours.map((hour) => (
              <div 
                key={`grid-${hour}`} 
                className="w-full border-t border-white/5 relative"
                style={{ height: ROW_HEIGHT }}
              >
                {/* Internal grid lines based on snapInterval */}
                {snapInterval < 60 && (
                   <>
                     {snapInterval === 30 && (
                       <div className="absolute top-1/2 left-0 right-0 border-t border-dashed border-white/5 w-full" />
                     )}
                     {snapInterval === 15 && (
                       <>
                         <div className="absolute top-1/4 left-0 right-0 border-t border-dashed border-white/[0.03] w-full" />
                         <div className="absolute top-1/2 left-0 right-0 border-t border-dashed border-white/5 w-full" />
                         <div className="absolute top-3/4 left-0 right-0 border-t border-dashed border-white/[0.03] w-full" />
                       </>
                     )}
                   </>
                )}
              </div>
            ))}
          </div>

          {/* Events Layer */}
          <div className="absolute inset-0 w-full">
            {events.map((event) => (
              <DraggableEvent 
                key={event.id} 
                event={event}
                timelineStartHour={startHour}
                onEdit={onEventEdit}
                onDelete={onEventDelete}
                onSelect={onEventSelect}
              />
            ))}

            {/* Current Time Indicator */}
            {currentTime && currentTime >= startHour && currentTime <= endHour + 1 && (
              <div 
                className="absolute left-0 right-0 z-30 pointer-events-none flex items-center"
                style={{ top: (currentTime - startHour) * ROW_HEIGHT }}
              >
                <div className="w-full border-t border-rose-500/50 shadow-[0_0_10px_rgba(244,63,94,0.4)]" />
                <div className="absolute -left-[69px] right-0 flex items-center">
                   <div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)] ml-[65px]" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DndContext>
  )
}
