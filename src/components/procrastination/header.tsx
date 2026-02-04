import { Badge } from "@/components/ui/badge"
import { Hourglass } from "lucide-react"
import { cn } from "@/lib/utils"

interface HeaderProps {
  systemStatus?: "stable" | "warning" | "critical";
  analyzingLabel?: string;
}

export function Header({ systemStatus = "stable", analyzingLabel = "ANALYZING" }: HeaderProps) {
  const statusColor = {
    stable: "text-emerald-400",
    warning: "text-yellow-400",
    critical: "text-red-400",
  }
  
  const statusBg = {
    stable: "bg-emerald-500",
    warning: "bg-yellow-500",
    critical: "bg-red-500",
  }

  const statusShadow = {
    stable: "shadow-[0_0_8px_rgba(16,185,129,0.5)]",
    warning: "shadow-[0_0_8px_rgba(234,179,8,0.5)]",
    critical: "shadow-[0_0_8px_rgba(239,68,68,0.5)]",
  }

  return (
    <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-6 gap-4">
      <div className="flex items-center gap-3 bg-slate-900/50 border border-slate-800 p-2 pr-6 rounded-xl backdrop-blur-sm">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
          <Hourglass className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-lg font-medium tracking-tight text-slate-200 leading-none">
            Procrastination Analyzer
          </h1>
          <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest mt-1">
            Activity Monitor
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-6 pl-2 md:pl-0">
        <div className="hidden md:block text-right">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">System Status</p>
          <div className="flex items-center justify-end gap-2">
            <div className={cn("size-1.5 rounded-full", statusBg[systemStatus], statusShadow[systemStatus])} />
            <p className={cn("text-xs font-mono uppercase", statusColor[systemStatus])}>{systemStatus}</p>
          </div>
        </div>
        <div className="h-10 w-px bg-white/10 hidden md:block" />
        <Badge variant="outline" className="h-9 border-blue-500/20 text-blue-300 bg-blue-500/5 px-4 font-mono tracking-wider hover:bg-blue-500/10 transition-colors">
          <span className="relative flex h-2 w-2 mr-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          {analyzingLabel.toUpperCase()}
        </Badge>
      </div>
    </div>
  )
}
