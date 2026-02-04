import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { BrainCircuit, AlertTriangle, Zap, Shield, Clock, Flame } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const chartData = [
  { type: "Admin", delay: 3.2, fill: "var(--color-admin)" },
  { type: "Creative", delay: 1.5, fill: "var(--color-creative)" },
  { type: "Email", delay: 2.8, fill: "var(--color-email)" },
  { type: "Meetings", delay: 0.5, fill: "var(--color-meetings)" },
]

const chartConfig = {
  delay: {
    label: "Avg Delay (Days)",
    color: "hsl(var(--chart-1))",
  },
  admin: {
    label: "Admin",
    color: "hsl(var(--chart-1))",
  },
  creative: {
    label: "Creative",
    color: "hsl(var(--chart-2))",
  },
  email: {
    label: "Email",
    color: "hsl(var(--chart-3))",
  },
  meetings: {
    label: "Meetings",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig

export function ProcrastinationAnalyzer() {
  return (
    <Card className="flex flex-col h-full border-l-4 border-l-primary shadow-lg dark:bg-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-xl">
              <BrainCircuit className="size-5 text-primary" />
              Procrastination Analyzer
            </CardTitle>
            <CardDescription>
              Pattern detection active • Last updated 2m ago
            </CardDescription>
          </div>
          <Badge variant="outline" className="h-6 border-primary/20 text-primary bg-primary/5">
            High Activity
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-6">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1 rounded-lg bg-muted/50 p-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Zap className="size-3" /> Top Distraction
            </div>
            <div className="font-medium text-sm">YouTube</div>
          </div>
          <div className="space-y-1 rounded-lg bg-muted/50 p-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="size-3" /> Peak Hours
            </div>
            <div className="font-medium text-sm">2PM - 4PM</div>
          </div>
          <div className="space-y-1 rounded-lg bg-muted/50 p-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Flame className="size-3" /> Streak Impact
            </div>
            <div className="font-medium text-sm text-destructive">-12%</div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <h4 className="font-medium text-muted-foreground">Delay Patterns by Task Type</h4>
          </div>
          <ChartContainer config={chartConfig} className="h-[140px] w-full">
            <BarChart accessibilityLayer data={chartData} layout="vertical" margin={{ left: 0, right: 0 }}>
              <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
              <YAxis
                dataKey="type"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                width={70}
                tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
              />
              <XAxis type="number" hide />
              <ChartTooltip
                cursor={{ fill: 'var(--muted)', opacity: 0.1 }}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="delay" radius={4} barSize={20} layout="vertical">
              </Bar>
            </BarChart>
          </ChartContainer>
        </div>

        {/* Trigger & Intervention */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Trigger Card */}
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 size-4 text-primary" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-primary">Top Trigger Detected</p>
                <p className="text-sm text-muted-foreground">
                  You frequently switch to <span className="font-medium text-foreground">YouTube</span> during <span className="font-medium text-foreground">Writing</span> tasks.
                </p>
              </div>
            </div>
          </div>

          {/* Intervention Card */}
          <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-4">
            <div className="flex items-start gap-3">
              <Shield className="mt-0.5 size-4 text-indigo-500" />
              <div className="space-y-3 w-full">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-indigo-500">Suggested Intervention</p>
                  <p className="text-xs text-muted-foreground">
                    Block distraction sites during focus sessions.
                  </p>
                </div>
                <Button size="sm" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-8 text-xs">
                  Enable Blocker
                </Button>
              </div>
            </div>
          </div>
        </div>

      </CardContent>
    </Card>
  )
}
