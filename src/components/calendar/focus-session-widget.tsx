import { Clock, Play, Pause, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Event } from "./daily-timeline"
import { cn } from "@/lib/utils"

interface FocusSessionWidgetProps {
  activeEvent?: Event | null
  nextEvent?: Event | null
  timerState?: {
    isRunning: boolean
    timeLeft: number // in seconds
  }
  onToggleTimer?: () => void
  onCompleteSession?: () => void
  onStartSession?: (event: Event) => void
}

export function FocusSessionWidget({ 
  activeEvent, 
  nextEvent,
  timerState, 
  onToggleTimer,
  onCompleteSession,
  onStartSession
}: FocusSessionWidgetProps) {
  
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  if (activeEvent && timerState) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-blue-950/40 via-background to-background p-4 shadow-xl">
        {/* Decorative Glow */}
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-blue-600/10 blur-3xl animate-pulse" />
        
        <div className="relative z-10 flex flex-col items-center text-center space-y-4">
          <div className="relative">
             <div className={cn("absolute inset-0 rounded-full bg-blue-500/20 duration-1000", timerState.isRunning && "animate-ping")} />
             <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-b from-blue-500/20 to-blue-600/5 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
              <Clock className="h-5 w-5 text-blue-400" />
            </div>
          </div>
  
          <div className="space-y-1">
            <h3 className="text-[10px] font-semibold uppercase tracking-widest text-blue-300/80">
              Current Session
            </h3>
            <div className="text-3xl font-light tracking-tighter text-white tabular-nums">
              {formatTime(timerState.timeLeft)}
            </div>
            <p className="text-xs text-muted-foreground truncate max-w-[200px] mx-auto">
              {activeEvent.title}
            </p>
          </div>
  
          <div className="flex gap-2 w-full">
            <Button 
              className={cn(
                "flex-1 border-0 shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] h-9 text-xs",
                timerState.isRunning ? "bg-amber-600 hover:bg-amber-500" : "bg-blue-600 hover:bg-blue-500"
              )}
              size="sm"
              onClick={onToggleTimer}
            >
              {timerState.isRunning ? (
                <>
                  <Pause className="mr-2 h-3 w-3 fill-current" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="mr-2 h-3 w-3 fill-current" />
                  Resume
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 border-white/10 hover:bg-white/5 hover:text-emerald-400"
              onClick={onCompleteSession}
              title="Complete Session"
            >
              <CheckCircle2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-blue-950/40 via-background to-background p-4 shadow-xl">
      {/* Decorative Glow */}
      <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-blue-600/10 blur-3xl" />
      
      <div className="relative z-10 flex flex-col items-center text-center space-y-4">
        <div className="relative">
           <div className="absolute inset-0 rounded-full bg-blue-500/20" />
           <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-b from-blue-500/20 to-blue-600/5 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
            <Clock className="h-5 w-5 text-blue-400" />
          </div>
        </div>

        <div className="space-y-1">
          <h3 className="text-[10px] font-semibold uppercase tracking-widest text-blue-300/80">
            Next Session
          </h3>
          {nextEvent ? (
            <>
              <div className="text-3xl font-light tracking-tighter text-white">
                {nextEvent.time.split(' - ')[0]}
              </div>
              <p className="text-xs text-muted-foreground truncate max-w-[200px] mx-auto">
                {nextEvent.title}
              </p>
            </>
          ) : (
            <div className="text-sm text-muted-foreground py-2">
              No upcoming sessions
            </div>
          )}
        </div>

        <Button 
          className="w-full bg-blue-600 hover:bg-blue-500 text-white border-0 shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] h-9 text-xs" 
          size="lg"
          disabled={!nextEvent}
          onClick={() => nextEvent && onStartSession?.(nextEvent)}
        >
          <Play className="mr-2 h-3 w-3 fill-current" />
          Start Focus
        </Button>
      </div>
    </div>
  )
}
