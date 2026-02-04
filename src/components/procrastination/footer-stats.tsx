import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

interface FooterStatsProps {
  stats?: {
    focusScore: number;
    completedSessions: number;
    avgSessionMinutes: number;
    distractions: number;
  };
}

export function FooterStats({ stats }: FooterStatsProps) {
  const data = [
    {
      label: "Focus Score",
      value: stats ? `${stats.focusScore}/100` : "--",
      change: stats ? "Live" : "--",
      trend: (stats?.focusScore || 0) > 70 ? "up" : (stats?.focusScore || 0) > 40 ? "neutral" : "down",
    },
    {
      label: "Completed Sessions",
      value: stats?.completedSessions.toString() || "0",
      change: stats ? "Live" : "--",
      trend: "neutral",
    },
    {
      label: "Avg. Session",
      value: stats ? `${stats.avgSessionMinutes}m` : "0m",
      change: stats ? "Live" : "--",
      trend: "neutral",
    },
    {
      label: "Distractions",
      value: stats?.distractions.toString() || "0",
      change: stats ? "Live" : "--",
      trend: (stats?.distractions || 0) > 5 ? "down" : "up", // Less is better
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/5 pt-10 mt-12">
      {data.map((stat, i) => (
        <div key={i} className="flex flex-col gap-2 group cursor-default">
          <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-medium group-hover:text-blue-400 transition-colors duration-300">{stat.label}</p>
          <div className="flex items-baseline gap-3">
            <span className="text-2xl text-white">{stat.value}</span>
            <span className={cn(
              "text-xs flex items-center gap-1 font-medium",
              stat.trend === "up" ? "text-emerald-400" : 
              stat.trend === "down" ? "text-red-400" : "text-slate-500"
            )}>
              {stat.trend === "up" ? <TrendingUp className="size-3" /> :
               stat.trend === "down" ? <TrendingDown className="size-3" /> :
               <Minus className="size-3" />}
              {stat.change}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
