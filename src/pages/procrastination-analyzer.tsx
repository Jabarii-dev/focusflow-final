import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Header } from "@/components/procrastination/header"
import { MetricsGrid } from "@/components/procrastination/metrics-grid"
import { DelayChart } from "@/components/procrastination/delay-chart"
import { Insights } from "@/components/procrastination/insights"
import { TaskList } from "@/components/procrastination/task-list"
import { FooterStats } from "@/components/procrastination/footer-stats"
import { ActivityControls } from "@/components/procrastination/activity-controls"
import { useQuery, useMutation } from "convex/react"
import { api } from "../../convex/_generated/api"
import { useEffect, useRef, useState } from "react"
import { Shield } from "lucide-react"
import { toast } from "react-hot-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export default function ProcrastinationAnalyzerPage() {
  const stats = useQuery(api.activity.getStats)
  const logEvent = useMutation(api.activity.logEvent)
  const lastLogTime = useRef<number>(0)
  const hiddenStartTime = useRef<number | null>(null)
  
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [pendingDuration, setPendingDuration] = useState(0)
  const [blockerEnabled, setBlockerEnabled] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('blockerEnabled') === 'true'
    }
    return false
  })

  useEffect(() => {
    localStorage.setItem('blockerEnabled', String(blockerEnabled))
  }, [blockerEnabled])

  useEffect(() => {
    const handleVisibilityChange = () => {
      const now = Date.now()
      
      if (document.hidden) {
        hiddenStartTime.current = now
      } else {
        // User returned
        if (hiddenStartTime.current) {
          const duration = now - hiddenStartTime.current
          const minutes = Math.floor(duration / 60000)
          
          // Min 1 minute distraction, throttle 2 minutes between logs
          if (minutes >= 1 && (now - lastLogTime.current > 120000)) {
            if (blockerEnabled) {
              logEvent({
                type: "distraction",
                label: "Blocked attempt",
                minutes: minutes,
              })
              lastLogTime.current = Date.now()
              toast.error("Focus Blocker Active: Distraction attempt logged!", {
                icon: "🚫",
                style: {
                  background: "#1e293b",
                  color: "#fff",
                  border: "1px solid #ef4444",
                }
              })
              hiddenStartTime.current = null
            } else {
              setPendingDuration(minutes)
              setIsDialogOpen(true)
            }
          }
          
          if (!blockerEnabled) {
            hiddenStartTime.current = null
          }
        }
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange)
  }, [])

  const handleLogDistraction = (label: string) => {
    logEvent({
      type: "distraction",
      label,
      minutes: pendingDuration,
    })
    lastLogTime.current = Date.now()
    setIsDialogOpen(false)
  }

  return (
    <DashboardLayout>
      <div className="-m-3 md:-m-4 min-h-[calc(100vh-56px)] bg-noise bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0f172a] via-[#020617] to-black p-3 md:p-5 font-sans text-slate-200 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none mix-blend-screen"></div>
        
        <div className="relative z-10 max-w-6xl mx-auto space-y-5">
          <Header 
            systemStatus={stats?.systemStatus}
            analyzingLabel={stats?.analyzingLabel}
          />
          
          <ActivityControls blockerEnabled={blockerEnabled} />

          <div className="space-y-5">
            <MetricsGrid 
              topDistractions={stats?.topDistractions}
              topDistractionTrend={stats?.topDistractionTrend}
              peakHours={stats?.peakHours}
              peakHoursTrend={stats?.peakHoursTrend}
              streakImpact={stats?.streakImpact}
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="lg:col-span-2 min-h-[250px]">
                <DelayChart data={stats?.delayPatterns} />
              </div>
              <div className="lg:col-span-1 min-h-[250px]">
                <Insights 
                  topDistraction={stats?.topDistraction}
                  blockerEnabled={blockerEnabled}
                  toggleBlocker={() => setBlockerEnabled(prev => !prev)}
                />
              </div>
            </div>

            <TaskList tasks={stats?.activeTasks} />
            
            <FooterStats stats={stats} />
          </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md bg-[#0f172a] border-slate-800 text-slate-200">
            <DialogHeader>
              <DialogTitle>Welcome back</DialogTitle>
              <DialogDescription className="text-slate-400">
                You were away for {pendingDuration} minute{pendingDuration !== 1 ? 's' : ''}. What distracted you?
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-3 py-4">
              {["YouTube", "Social Media", "Email", "Other"].map((label) => (
                <Button
                  key={label}
                  variant="outline"
                  className="bg-slate-900 border-slate-700 hover:bg-slate-800 hover:text-white justify-start h-auto py-3 px-4"
                  onClick={() => handleLogDistraction(label)}
                >
                  {label}
                </Button>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        {blockerEnabled && (
          <div className="fixed top-20 right-6 z-50 animate-in slide-in-from-right-10 fade-in duration-300">
            <div className="bg-red-500/10 backdrop-blur-md border border-red-500/50 text-red-400 px-4 py-2 rounded-full shadow-[0_0_20px_rgba(220,38,38,0.2)] font-mono text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <Shield className="size-4 fill-red-500/20" /> 
              <span className="relative top-[1px]">Focus Blocker Active</span>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
