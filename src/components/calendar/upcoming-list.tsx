import { Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Event } from "./daily-timeline"

interface UpcomingListProps {
  events: Event[]
  onViewAll?: () => void
  limit?: number
}

const colorMap: Record<string, string> = {
  blue: "bg-blue-500",
  indigo: "bg-indigo-500",
  violet: "bg-violet-500",
  emerald: "bg-emerald-500",
  rose: "bg-rose-500",
}

export function UpcomingList({ events, onViewAll, limit }: UpcomingListProps) {
  // Sort events by startHour
  const sortedEvents = [...events].sort((a, b) => a.startHour - b.startHour);
  const displayEvents = limit ? sortedEvents.slice(0, limit) : sortedEvents;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Upcoming
        </h3>
        {onViewAll && (
          <button 
            onClick={onViewAll}
            className="text-[10px] text-blue-400 hover:text-blue-300 transition-colors"
          >
            View All
          </button>
        )}
      </div>
      
      <div className="space-y-2">
        {displayEvents.map((event) => (
          <div 
            key={event.id} 
            className="group flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3 hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300"
          >
            <div className={cn("h-8 w-1 rounded-full shadow-[0_0_10px_currentColor]", colorMap[event.color] || "bg-gray-500")} />
            
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-xs text-foreground truncate group-hover:text-blue-200 transition-colors">
                {event.title}
              </h4>
              <div className="mt-0.5 flex items-center gap-2 text-[10px] text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{event.time}</span>
              </div>
            </div>
            
            <div className="text-[10px] font-medium text-muted-foreground/50 border border-white/5 px-2 py-0.5 rounded-md">
              {event.duration}h
            </div>
          </div>
        ))}
        {displayEvents.length === 0 && (
           <div className="text-[10px] text-muted-foreground p-3 text-center">No upcoming events</div>
        )}
      </div>
    </div>
  )
}
