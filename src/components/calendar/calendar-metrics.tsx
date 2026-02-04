import { cn } from "@/lib/utils"

interface MetricProps {
  label: string
  value: string
  subValue?: string
  trend?: "up" | "down" | "neutral"
}

function Metric({ label, value, subValue, trend }: MetricProps) {
  return (
    <div className="flex flex-col gap-1 px-6 first:pl-0 last:pr-0 border-r last:border-r-0 border-white/5">
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
        {label}
      </span>
      <div className="flex items-baseline gap-2">
        <span className="text-xl font-light tracking-tight text-foreground">
          {value}
        </span>
        {subValue && (
          <span className={cn("text-xs", 
            trend === "up" ? "text-emerald-400" : 
            trend === "down" ? "text-rose-400" : "text-muted-foreground"
          )}>
            {subValue}
          </span>
        )}
      </div>
    </div>
  )
}

interface CalendarMetricsProps {
  totalFocus: string
  efficiency: string
  scheduleCount: string
}

export function CalendarMetrics({ totalFocus, efficiency, scheduleCount }: CalendarMetricsProps) {
  return (
    <div className="flex w-full items-center p-4 bg-white/[0.02] border border-white/5 rounded-2xl backdrop-blur-sm">
      <Metric label="Total Focus" value={totalFocus} subValue="+12%" trend="up" />
      <Metric label="Efficiency" value={efficiency} subValue="+2.4%" trend="up" />
      <Metric label="Schedule" value={scheduleCount} subValue="Tasks" />
      <div className="ml-auto flex gap-4">
        {/* Placeholder for potential actions or mini-chart */}
        <div className="h-6 w-20 bg-white/5 rounded-full animate-pulse opacity-20" />
      </div>
    </div>
  )
}
