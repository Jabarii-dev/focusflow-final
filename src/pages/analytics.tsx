import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from "recharts"
import { 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  Clock, 
  Target, 
  AlertCircle,
  Download,
  Loader2,
  FileText
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useQuery, useConvex } from "convex/react"
import { api } from "../../convex/_generated/api"
import { useI18n } from "@/hooks/use-i18n"
import { toast } from "sonner"

const COLORS = ['#E01E5A', '#4285F4', '#C13584', '#FF9900', '#888888', '#00C49F', '#FFBB28', '#FF8042'];

export default function AnalyticsPage() {
  const { t } = useI18n()
  const convex = useConvex()
  const [reportDays, setReportDays] = useState(7)
  const [weeklyReport, setWeeklyReport] = useState<any>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const analytics = useQuery(api.analytics.getAnalyticsSummary);

  const handleGenerateReport = async () => {
    try {
      setIsGenerating(true)
      const report = await convex.query(api.analytics.getWeeklyReport, { days: reportDays })
      setWeeklyReport(report)
      toast.success("Report generated successfully")
    } catch (error) {
      console.error(error)
      toast.error("Failed to generate report")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownloadCsv = () => {
    if (!weeklyReport) return;
    
    try {
      const headers = ["Date", "Focus Minutes", "Distraction Minutes"];
      const rows = weeklyReport.csvRows.map((row: any) => [
        new Date(row.date).toLocaleDateString(),
        row.focusMinutes,
        row.distractionMinutes
      ]);
      
      const csvContent = [
        headers.join(","),
        ...rows.map((row: any) => row.join(","))
      ].join("\n");
      
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `productivity_report_${reportDays}days.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("CSV exported successfully")
    } catch (error) {
      console.error(error)
      toast.error("Failed to export CSV")
    }
  };

  if (!analytics) {
    return (
      <DashboardLayout>
        <div className="flex h-[calc(100vh-100px)] w-full items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p>Loading analytics...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const { weeklyFocusTrend, distractionSources, peakPerformanceHours, aiInsights } = analytics;

  // Derive KPIs
  const totalFocusMinutes = weeklyFocusTrend.reduce((acc, day) => acc + day.focusMinutes, 0);
  const totalFocusHours = totalFocusMinutes / 60;
  const avgFocusScore = Math.round(weeklyFocusTrend.reduce((acc, day) => acc + day.focusScore, 0) / (weeklyFocusTrend.length || 1));
  const totalDistractions = distractionSources.reduce((acc, src) => acc + src.minutes, 0);
  
  // Last day trend comparison (mock logic for trend since we only get 7 days)
  const lastDay = weeklyFocusTrend[weeklyFocusTrend.length - 1];
  const prevDay = weeklyFocusTrend[weeklyFocusTrend.length - 2];
  const scoreTrend = lastDay && prevDay ? lastDay.focusScore - prevDay.focusScore : 0;

  const hasData = totalFocusMinutes > 0 || totalDistractions > 0;

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8 p-8 max-w-[1600px] mx-auto animate-in fade-in duration-500">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              {t('analytics')}
            </h1>
            <p className="text-muted-foreground mt-1 text-lg">
              {t('deepDive')}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
            <Select value={reportDays.toString()} onValueChange={(v) => setReportDays(parseInt(v))}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder={t('selectPeriod')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">{t('last7Days')}</SelectItem>
                <SelectItem value="14">{t('last14Days')}</SelectItem>
                <SelectItem value="30">{t('last30Days')}</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleGenerateReport} variant="outline" className="w-full sm:w-auto gap-2" disabled={isGenerating}>
              {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
              {isGenerating ? "Generating..." : t('generateReport')}
            </Button>
          </div>
        </div>

        {!hasData ? (
           <div className="flex flex-col items-center justify-center py-20 bg-muted/20 rounded-xl border border-dashed">
             <Target className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
             <h3 className="text-xl font-semibold">{t('noActivity')}</h3>
             <p className="text-muted-foreground max-w-md text-center mt-2">
               {t('startTracking')}
             </p>
           </div>
        ) : (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <KpiCard 
                title={t('avgFocusScore')} 
                value={avgFocusScore.toString()} 
                unit="/ 100"
                trend={`${scoreTrend > 0 ? '+' : ''}${scoreTrend}%`} 
                trendUp={scoreTrend >= 0}
                icon={Target}
                description={t('last7Days')}
              />
              <KpiCard 
                title={t('deepWork')} 
                value={totalFocusHours.toFixed(1)} 
                unit="hrs"
                trend="Total" 
                trendUp={true}
                icon={Zap}
                description={t('focusTime')}
              />
              <KpiCard 
                title={t('distractionTime')} 
                value={Math.round(totalDistractions).toString()} 
                unit="min"
                trend={`${Math.round(totalDistractions / 60)}h`} 
                trendUp={false} // More distraction is bad usually
                icon={AlertCircle}
                description={t('totalTimeLost')}
              />
              <KpiCard 
                title={t('flowEfficiency')} 
                value={Math.round((totalFocusMinutes / (totalFocusMinutes + totalDistractions || 1)) * 100).toString()} 
                unit="%"
                trend="Ratio" 
                trendUp={true}
                icon={Clock}
                description="Focus / Total Time"
              />
            </div>

            {/* Main Charts Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Weekly Focus Trend */}
              <Card className="lg:col-span-2 border-none shadow-md bg-gradient-to-br from-card to-card/50">
                <CardHeader>
                  <CardTitle>{t('weeklyFocusTrend')}</CardTitle>
                  <CardDescription>{t('dailyFocusScore')}</CardDescription>
                </CardHeader>
                <CardContent className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={weeklyFocusTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.4} />
                      <XAxis 
                        dataKey="day" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: 'var(--muted-foreground)' }} 
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: 'var(--muted-foreground)' }} 
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'var(--popover)', 
                          borderColor: 'var(--border)', 
                          borderRadius: '8px',
                          boxShadow: 'var(--shadow-md)'
                        }}
                        itemStyle={{ color: 'var(--popover-foreground)' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="focusScore" 
                        name={t('focusScore')}
                        stroke="var(--primary)" 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#colorScore)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Distraction Sources */}
              <Card className="border-none shadow-md">
                <CardHeader>
                  <CardTitle>{t('distractionSources')}</CardTitle>
                  <CardDescription>{t('attentionGoes')}</CardDescription>
                </CardHeader>
                <CardContent className="h-[350px] flex flex-col justify-center items-center">
                  {distractionSources.length > 0 ? (
                    <>
                      <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                          <Pie
                            data={distractionSources}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="percentage"
                            nameKey="label"
                          >
                            {distractionSources.map((_, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                            ))}
                          </Pie>
                          <Tooltip 
                             contentStyle={{ 
                              backgroundColor: 'var(--popover)', 
                              borderColor: 'var(--border)', 
                              borderRadius: '8px'
                            }}
                            formatter={(value: number) => [`${value}%`, 'Percentage']}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-4 w-full px-4">
                        {distractionSources.slice(0, 6).map((item, index) => (
                          <div key={item.label} className="flex items-center gap-2 text-sm">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                            <span className="text-muted-foreground truncate max-w-[80px]" title={item.label}>{item.label}</span>
                            <span className="ml-auto font-medium">{item.percentage}%</span>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                      <p>{t('noDistractionData')}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Secondary Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Peak Performance Hours */}
              <Card className="border-none shadow-md">
                <CardHeader>
                  <CardTitle>{t('peakPerformanceHours')}</CardTitle>
                  <CardDescription>{t('focusMinutesByHour')}</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  {peakPerformanceHours.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={peakPerformanceHours}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.4} />
                        <XAxis 
                          dataKey="label" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: 'var(--muted-foreground)' }} 
                        />
                        <Tooltip 
                          cursor={{ fill: 'var(--muted)', opacity: 0.2 }}
                          contentStyle={{ 
                            backgroundColor: 'var(--popover)', 
                            borderColor: 'var(--border)', 
                            borderRadius: '8px'
                          }}
                        />
                        <Bar dataKey="focusMinutes" name={t('focusMin')} radius={[4, 4, 0, 0]}>
                          {peakPerformanceHours.map((_, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={index < 3 ? 'var(--primary)' : 'var(--muted-foreground)'} 
                              opacity={index < 3 ? 1 : 0.5}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                      <p>{t('noDataAvailable')}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Insights Panel */}
              <Card className="border-none shadow-md bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-blue-600" />
                    {t('aiInsights')}
                  </CardTitle>
                  <CardDescription>{t('personalizedRecs')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {aiInsights.map((insight, i) => (
                    <InsightItem 
                      key={i}
                      title={insight.title}
                      text={insight.text}
                    />
                  ))}
                  {aiInsights.length === 0 && (
                     <p className="text-muted-foreground text-sm">{t('noDataAvailable')}</p>
                  )}
                </CardContent>
              </Card>

            </div>

            {weeklyReport && (
              <Card className="animate-in fade-in slide-in-from-bottom-4 duration-500 border-none shadow-md">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>{t('weeklyReport')}</CardTitle>
                    <CardDescription>
                      {t('summaryLastDays').replace('{days}', weeklyReport.summary.days.toString())}
                    </CardDescription>
                  </div>
                  <Button onClick={handleDownloadCsv} variant="outline" size="sm" className="gap-2">
                    <Download className="h-4 w-4" />
                    {t('exportCsv')}
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <p className="text-sm text-muted-foreground">{t('focusTime')}</p>
                      <p className="text-2xl font-bold">{Math.round(weeklyReport.summary.focusMinutes / 60)}h</p>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <p className="text-sm text-muted-foreground">{t('distractions')}</p>
                      <p className="text-2xl font-bold">{Math.round(weeklyReport.summary.distractionMinutes / 60)}h</p>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <p className="text-sm text-muted-foreground">{t('focusScore')}</p>
                      <p className="text-2xl font-bold">{weeklyReport.summary.focusScore}%</p>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <p className="text-sm text-muted-foreground">{t('totalDays')}</p>
                      <p className="text-2xl font-bold">{weeklyReport.summary.days}</p>
                    </div>
                  </div>

                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{t('date')}</TableHead>
                          <TableHead>{t('focusMin')}</TableHead>
                          <TableHead>{t('distractionMin')}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {weeklyReport.csvRows.length > 0 ? (
                          weeklyReport.csvRows.slice(0, 7).map((row: any) => (
                            <TableRow key={row.date}>
                              <TableCell>{new Date(row.date).toLocaleDateString()}</TableCell>
                              <TableCell>{row.focusMinutes}</TableCell>
                              <TableCell>{row.distractionMinutes}</TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={3} className="h-24 text-center">
                              {t('noDataAvailable')}
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                  {weeklyReport.csvRows.length > 7 && (
                    <p className="text-xs text-muted-foreground mt-4 text-center">
                      {t('showingRecentDays')}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  )
}

function KpiCard({ title, value, unit, trend, trendUp, icon: Icon, description }: any) {
  return (
    <Card className="border-none shadow-sm hover:shadow-md transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <Icon className="h-5 w-5" />
          </div>
          <div className={cn(
            "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
            trendUp ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
          )}>
            {trendUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {trend}
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="flex items-baseline gap-1 mt-1">
            <h3 className="text-3xl font-bold tracking-tight">{value}</h3>
            <span className="text-sm text-muted-foreground">{unit}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">{description}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function InsightItem({ title, text }: { title: string, text: string }) {
  return (
    <div className="flex gap-3 items-start p-3 rounded-lg bg-background/60 hover:bg-background/80 transition-colors border border-border/50">
      <div className="mt-1 h-2 w-2 rounded-full bg-blue-500 shrink-0" />
      <div>
        <h4 className="text-sm font-medium">{title}</h4>
        <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
      </div>
    </div>
  )
}
