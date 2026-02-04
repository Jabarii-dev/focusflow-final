import { AlertTriangle, Shield, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface TriggerCardProps {
  topDistraction?: string | null;
}

export function TriggerCard({ topDistraction }: TriggerCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-amber-500/10 bg-amber-500/[0.02] p-4 transition-all duration-500 hover:bg-amber-500/[0.05] hover:border-amber-500/20 h-full">
      <div className="flex items-start gap-4">
        <div className="flex items-center justify-center size-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 shrink-0 shadow-[0_0_15px_-5px_rgba(245,158,11,0.3)]">
          <AlertTriangle className="size-5" />
        </div>
        <div className="space-y-1">
          <h4 className="font-mono text-[10px] font-medium text-amber-500 tracking-widest uppercase">Trigger Detected</h4>
          <p className="text-xs text-slate-400 leading-relaxed font-medium">
            You frequently switch to <span className="text-white">{topDistraction || "Distractions"}</span> during focus sessions.
          </p>
        </div>
      </div>
    </div>
  )
}

export function InterventionCard({ blockerEnabled, toggleBlocker }: { blockerEnabled?: boolean; toggleBlocker?: () => void }) {
  return (
    <div className={cn(
      "group relative overflow-hidden rounded-2xl border p-4 transition-all duration-500 h-full",
      blockerEnabled 
        ? "border-red-500/20 bg-red-500/[0.02] hover:bg-red-500/[0.05] hover:border-red-500/30" 
        : "border-indigo-500/10 bg-indigo-500/[0.02] hover:bg-indigo-500/[0.05] hover:border-indigo-500/20"
    )}>
      <div className={cn(
        "absolute inset-0 bg-gradient-to-r via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500",
        blockerEnabled ? "from-red-500/5" : "from-indigo-500/5"
      )} />
      
      <div className="relative z-10 flex flex-col h-full justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className={cn(
            "flex items-center justify-center size-10 rounded-xl border shrink-0 transition-all duration-500",
            blockerEnabled 
              ? "bg-red-500/10 border-red-500/20 text-red-500 shadow-[0_0_15px_-5px_rgba(239,68,68,0.3)]" 
              : "bg-indigo-500/10 border-indigo-500/20 text-indigo-400 shadow-[0_0_15px_-5px_rgba(99,102,241,0.3)]"
          )}>
            <Shield className="size-5" />
          </div>
          <div className="space-y-1">
            <h4 className={cn(
              "font-mono text-[10px] font-medium tracking-widest uppercase transition-colors",
              blockerEnabled ? "text-red-400" : "text-indigo-400"
            )}>
              {blockerEnabled ? "Focus Active" : "Intervention"}
            </h4>
            <p className="text-xs text-slate-400 font-medium">
              {blockerEnabled 
                ? "Distractions are blocked. Stay focused." 
                : "Block distraction sites during focus sessions."}
            </p>
          </div>
        </div>
        
        <div className="pl-[56px]">
          <Button 
            size="sm" 
            onClick={toggleBlocker}
            className={cn(
              "w-full border-none shadow-lg font-medium tracking-wide text-[10px] h-8 transition-all duration-300",
              blockerEnabled 
                ? "bg-red-600 hover:bg-red-500 text-white shadow-[0_0_20px_-5px_rgba(220,38,38,0.5)]" 
                : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_20px_-5px_rgba(79,70,229,0.5)]"
            )}
          >
            {blockerEnabled ? "DISABLE BLOCKER" : "ENABLE BLOCKER"} 
            <ArrowRight className={cn("ml-2 size-3 transition-transform duration-300", blockerEnabled && "rotate-180")} />
          </Button>
        </div>
      </div>
    </div>
  )
}

interface InsightsProps {
  topDistraction?: string | null;
  blockerEnabled?: boolean;
  toggleBlocker?: () => void;
}

export function Insights({ topDistraction, blockerEnabled, toggleBlocker }: InsightsProps) {
  return (
    <div className="flex flex-col gap-4 h-full">
      <TriggerCard topDistraction={topDistraction} />
      <InterventionCard blockerEnabled={blockerEnabled} toggleBlocker={toggleBlocker} />
    </div>
  )
}
