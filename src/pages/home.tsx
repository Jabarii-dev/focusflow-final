import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { MetricCard } from "@/components/dashboard/metric-card"
import { GettingStarted } from "@/components/dashboard/getting-started"
import { GaugeWidget } from "@/components/dashboard/gauge-widget"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { LiveTable } from "@/components/dashboard/live-table"
import { useProfile } from "@/hooks/use-profile"
import { useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"
import { useI18n } from "@/hooks/use-i18n"

function formatDuration(minutes: number) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m}m`
  return `${h}h ${m}m`
}

function calculateChange(data: number[] | undefined): number {
  if (!data || data.length < 2) return 0
  const current = data[data.length - 1]
  const previous = data[data.length - 2]
  
  if (previous === 0) return current > 0 ? 100 : 0
  return Math.round(((current - previous) / previous) * 100)
}

export default function HomePage() {
  const { name } = useProfile()
  const { t } = useI18n()
  const stats = useQuery(api.dashboard.getDashboardStats)
  const isLoading = stats === undefined

  return (
    <DashboardLayout>
      <div className="space-y-3">
        
        {/* Identity Header */}
        <div className="-mx-3 -mt-3 mb-3 flex h-auto min-h-14 items-center border-b px-3 py-2 md:-mx-4 md:-mt-4 md:px-4 md:py-0">
          <div className="w-full md:w-[70%] space-y-1">
            <h1 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-100">{t('welcomeBack')}, {name}</h1>
            <p className="text-xs font-normal text-muted-foreground">
              {t('trackProductivity')}
            </p>
          </div>
        </div>

        {/* Row 1: Metrics */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard 
            title={t('focusTime')} 
            value={stats ? formatDuration(stats.focusMinutes) : "--"} 
            change={calculateChange(stats?.focusMinutesSparkline)}
            data={stats?.focusMinutesSparkline || []}
            color="var(--chart-1)"
            loading={isLoading}
          />
          <MetricCard 
            title={t('distractions')} 
            value={stats ? stats.distractionCount.toString() : "--"} 
            change={calculateChange(stats?.distractionCountSparkline)} 
            data={stats?.distractionCountSparkline || []}
            color="var(--chart-2)"
            loading={isLoading}
          />
          <MetricCard 
            title={t('tasksCompleted')} 
            value={stats ? stats.tasksCompleted.toString() : "--"} 
            change={calculateChange(stats?.tasksCompletedSparkline)} 
            data={stats?.tasksCompletedSparkline || []}
            color="var(--chart-3)"
            loading={isLoading}
          />
          <MetricCard 
            title={t('productivity')} 
            value={stats ? `${stats.productivityScore}%` : "--"} 
            change={calculateChange(stats?.productivityScoreSparkline)} 
            data={stats?.productivityScoreSparkline || []}
            color="var(--chart-4)"
            loading={isLoading}
          />
        </div>

        {/* Row 2: Getting Started */}
        <div className="grid grid-cols-1">
          <GettingStarted />
        </div>

        {/* Row 3: Gauge & Revenue */}
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <GaugeWidget score={stats?.productivityScore} loading={isLoading} />
          </div>
          <div className="lg:col-span-6">
            <RevenueChart 
              focusData={stats?.focusMinutesSparkline} 
              distractionData={stats?.distractionCountSparkline}
              loading={isLoading}
            />
          </div>
        </div>

        {/* Row 4: Live Table */}
        <div className="grid grid-cols-1 gap-3">
          <LiveTable />
        </div>

      </div>
    </DashboardLayout>
  )
}
