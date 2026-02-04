import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { ArrowDown, ArrowUp } from "lucide-react"
import { Line, LineChart, ResponsiveContainer } from "recharts"

interface MetricCardProps {
  title: string
  value: string | number
  change?: number
  data: number[]
  color?: string
  loading?: boolean
}

export function MetricCard({ title, value, change, data, color = "var(--primary)", loading }: MetricCardProps) {
  const isPositive = (change || 0) >= 0
  const chartData = data.map((val, i) => ({ i, value: val }))

  if (loading) {
    return (
      <Card className="overflow-hidden border-none shadow-sm bg-card/50 h-[110px]">
        <CardContent className="p-4 h-full flex flex-col justify-between">
          <div className="h-4 w-24 bg-muted/50 rounded animate-pulse" />
          <div className="flex items-end justify-between">
            <div className="h-8 w-16 bg-muted/50 rounded animate-pulse" />
            <div className="h-[30px] w-[80px] bg-muted/50 rounded animate-pulse" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden border-none shadow-sm bg-card/50 hover:bg-card transition-colors">
      <CardContent className="p-4">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          {change !== undefined && (
            <div className={cn(
              "flex items-center text-xs font-medium rounded-full px-2 py-0.5",
              isPositive ? "text-emerald-500 bg-emerald-500/10" : "text-rose-500 bg-rose-500/10"
            )}>
              {isPositive ? <ArrowUp className="mr-1 h-3 w-3" /> : <ArrowDown className="mr-1 h-3 w-3" />}
              {Math.abs(change)}%
            </div>
          )}
        </div>
        <div className="flex items-end justify-between">
          <div className="text-xl font-bold">{value}</div>
          <div className="h-[30px] w-[80px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={color}
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
