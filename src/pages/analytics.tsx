import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
  Calendar as CalendarIcon,
  Download
} from "lucide-react"
import { cn } from "@/lib/utils"

const weeklyData = [
  { day: 'Mon', score: 65, hours: 4.2 },
  { day: 'Tue', score: 78, hours: 5.5 },
  { day: 'Wed', score: 82, hours: 6.1 },
  { day: 'Thu', score: 70, hours: 4.8 },
  { day: 'Fri', score: 85, hours: 6.5 },
  { day: 'Sat', score: 45, hours: 2.0 },
  { day: 'Sun', score: 50, hours: 2.5 },
]

const timeOfDayData = [
  { time: '6am', focus: 30 },
  { time: '8am', focus: 65 },
  { time: '10am', focus: 95 },
  { time: '12pm', focus: 45 },
  { time: '2pm', focus: 85 },
  { time: '4pm', focus: 60 },
  { time: '6pm', focus: 40 },
  { time: '8pm', focus: 25 },
]

const distractionData = [
  { name: 'Slack', value: 35, color: '#E01E5A' },
  { name: 'Email', value: 25, color: '#4285F4' },
  { name: 'Social', value: 20, color: '#C13584' },
  { name: 'News', value: 10, color: '#FF9900' },
  { name: 'Other', value: 10, color: '#888888' },
]

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8 p-8 max-w-[1600px] mx-auto animate-in fade-in duration-500">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Productivity Analytics
            </h1>
            <p className="text-muted-foreground mt-1 text-lg">
              Deep dive into your cognitive performance and focus trends.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2">
              <CalendarIcon className="h-4 w-4" />
              Last 7 Days
            </Button>
            <Button className="gap-2 bg-primary hover:bg-primary/90">
              <Download className="h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KpiCard 
            title="Focus Score" 
            value="78" 
            unit="/ 100"
            trend="+5%" 
            trendUp={true}
            icon={Target}
            description="Top 15% of users"
          />
          <KpiCard 
            title="Deep Work" 
            value="31.6" 
            unit="hrs"
            trend="+2.4h" 
            trendUp={true}
            icon={Zap}
            description="vs. 29.2h last week"
          />
          <KpiCard 
            title="Distractions" 
            value="142" 
            unit="blocked"
            trend="-12%" 
            trendUp={true} // Less distractions is good
            icon={AlertCircle}
            description="Saved ~4.5 hours"
          />
          <KpiCard 
            title="Flow Efficiency" 
            value="64" 
            unit="%"
            trend="-2%" 
            trendUp={false}
            icon={Clock}
            description="Time in flow / Total time"
          />
        </div>

        {/* Main Charts Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Weekly Focus Trend */}
          <Card className="lg:col-span-2 border-none shadow-md bg-gradient-to-br from-card to-card/50">
            <CardHeader>
              <CardTitle>Weekly Focus Trend</CardTitle>
              <CardDescription>Daily focus score vs. deep work hours</CardDescription>
            </CardHeader>
            <CardContent className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
                    dataKey="score" 
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
              <CardTitle>Distraction Sources</CardTitle>
              <CardDescription>Where your attention goes</CardDescription>
            </CardHeader>
            <CardContent className="h-[350px] flex flex-col justify-center items-center">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={distractionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {distractionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                    ))}
                  </Pie>
                  <Tooltip 
                     contentStyle={{ 
                      backgroundColor: 'var(--popover)', 
                      borderColor: 'var(--border)', 
                      borderRadius: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-4 w-full px-4">
                {distractionData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-muted-foreground">{item.name}</span>
                    <span className="ml-auto font-medium">{item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Secondary Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Peak Performance Hours */}
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle>Peak Performance Hours</CardTitle>
              <CardDescription>Average focus levels throughout the day</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={timeOfDayData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.4} />
                  <XAxis 
                    dataKey="time" 
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
                  <Bar dataKey="focus" radius={[4, 4, 0, 0]}>
                    {timeOfDayData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.focus > 80 ? 'var(--primary)' : 'var(--muted-foreground)'} 
                        opacity={entry.focus > 80 ? 1 : 0.3}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Insights Panel */}
          <Card className="border-none shadow-md bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-blue-600" />
                AI Insights
              </CardTitle>
              <CardDescription>Personalized recommendations based on your data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <InsightItem 
                title="Morning Peak"
                text="You are 45% more focused between 9am and 11am. Schedule your hardest tasks then."
              />
              <InsightItem 
                title="Meeting Fatigue"
                text="Focus drops by 30% after 2pm meetings. Try grouping meetings or adding 15m buffers."
              />
              <InsightItem 
                title="Slack Distraction"
                text="Slack interrupts you every 12 mins on average. Consider enabling 'Do Not Disturb' mode."
              />
            </CardContent>
          </Card>

        </div>
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
