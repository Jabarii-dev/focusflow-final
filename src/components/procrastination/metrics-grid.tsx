import { Zap, Clock, Flame, ArrowUpRight, ArrowDownRight, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

type TrendDirection = "up" | "down" | "flat"

interface MetricCardProps {
  label: string
  value: string
  icon: React.ElementType
  trend?: string
  trendColor?: string
  trendDirection?: TrendDirection
  className?: string
}

const trendBadgeConfig = {
  up: {
    icon: ArrowUpRight,
    className: "text-rose-300 bg-rose-500/10 border-rose-500/20",
  },
  down: {
    icon: ArrowDownRight,
    className: "text-emerald-300 bg-emerald-500/10 border-emerald-500/20",
  },
  flat: {
    icon: Minus,
    className: "text-slate-300 bg-slate-500/10 border-slate-500/20",
  },
}

function MetricCard({ label, value, icon: Icon, trend, trendColor, trendDirection, className }: MetricCardProps) {
  const trendBadge = trendDirection ? trendBadgeConfig[trendDirection] : null
  const TrendIcon = trendBadge?.icon

  return (
    <div className={cn(
      "group relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-5 transition-all duration-500 hover:border-white/10 hover:bg-white/[0.04]",
      className
    )}>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center justify-center size-10 rounded-xl bg-white/5 border border-white/10 text-slate-300 group-hover:text-blue-400 group-hover:border-blue-500/20 group-hover:bg-blue-500/10 transition-all duration-300">
            <Icon className="size-5" />
          </div>
          {trend && (
            <span className={cn("text-[10px] uppercase tracking-widest font-medium px-2 py-1 rounded-full border", trendColor)}>
              {trend}
            </span>
          )}
          {!trend && trendBadge && TrendIcon && (
            <span className={cn(
              "text-[10px] uppercase tracking-widest font-medium px-2 py-1 rounded-full border inline-flex items-center gap-1",
              trendBadge.className
            )}>
              <TrendIcon className="size-3" />
              24H
            </span>
          )}
        </div>
        <div>
          <h3 className="text-2xl font-medium text-white mb-1 tracking-tight">{value}</h3>
          <p className="text-xs uppercase tracking-widest text-slate-500 font-medium">{label}</p>
        </div>
      </div>
    </div>
  )
}

type TopDistraction = {
  label: string
  minutes: number
}

interface MetricsGridProps {
  topDistractions?: TopDistraction[];
  topDistractionTrend?: TrendDirection;
  peakHours?: number[];
  peakHoursTrend?: TrendDirection;
  streakImpact?: string;
}

export function MetricsGrid({
  topDistractions,
  topDistractionTrend,
  peakHours,
  peakHoursTrend,
  streakImpact,
}: MetricsGridProps) {
  const formatPeakHours = (hours?: number[]) => {
    if (!hours || hours.length === 0) return "No Data";
    const start = hours[0];
    return `${start}:00 - ${start + 1}:00`;
  };

  const getStreakImpactConfig = (impact?: string) => {
    switch (impact) {
      case "strong focus momentum":
        return {
          value: "+15%",
          trend: "OPTIMAL",
          trendColor: "text-emerald-300 bg-emerald-500/10 border-emerald-500/20",
          className: "backdrop-blur-sm border-emerald-500/10 bg-emerald-500/[0.02] hover:bg-emerald-500/[0.05] hover:border-emerald-500/20"
        };
      case "mixed focus pattern":
        return {
          value: "-5%",
          trend: "WARNING",
          trendColor: "text-yellow-300 bg-yellow-500/10 border-yellow-500/20",
          className: "backdrop-blur-sm border-yellow-500/10 bg-yellow-500/[0.02] hover:bg-yellow-500/[0.05] hover:border-yellow-500/20"
        };
      case "high distraction drag":
        return {
          value: "-12%",
          trend: "CRITICAL",
          trendColor: "text-red-300 bg-red-500/10 border-red-500/20",
          className: "backdrop-blur-sm border-red-500/10 bg-red-500/[0.02] hover:bg-red-500/[0.05] hover:border-red-500/20"
        };
      default: // no activity or unknown
        return {
          value: "0%",
          trend: "NEUTRAL",
          trendColor: "text-slate-300 bg-slate-500/10 border-slate-500/20",
          className: "backdrop-blur-sm"
        };
    }
  };

  const streakConfig = getStreakImpactConfig(streakImpact);
  const topDistraction = topDistractions?.[0];
  const topDistractionLabel = topDistraction
    ? `${topDistraction.label} · ${Math.round(topDistraction.minutes)}m`
    : "None";
  const topDistractionDirection = topDistraction ? topDistractionTrend : undefined;
  const peakHoursDirection = peakHours && peakHours.length > 0 ? peakHoursTrend : undefined;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      <MetricCard 
        label="Top Distraction" 
        value={topDistractionLabel} 
        icon={Zap}
        trendDirection={topDistractionDirection}
        className="backdrop-blur-sm"
      />
      <MetricCard 
        label="Peak Hours" 
        value={formatPeakHours(peakHours)} 
        icon={Clock}
        trendDirection={peakHoursDirection}
        className="backdrop-blur-sm"
      />
      <MetricCard 
        label="Streak Impact" 
        value={streakConfig.value} 
        icon={Flame}
        trend={streakConfig.trend}
        trendColor={streakConfig.trendColor}
        className={streakConfig.className}
      />
    </div>
  )
}
