import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts"

interface GaugeWidgetProps {
  score?: number
  loading?: boolean
}

export function GaugeWidget({ score = 0, loading }: GaugeWidgetProps) {
  const data = [
    { name: "Score", value: score },
    { name: "Remaining", value: 100 - score },
  ]

  if (loading) {
    return (
      <Card className="h-full border-none shadow-sm bg-card/50 flex flex-col min-h-[300px]">
        <CardHeader className="pb-2">
          <div className="h-6 w-32 bg-muted/50 rounded animate-pulse" />
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="h-40 w-40 rounded-full border-8 border-muted/20 animate-pulse" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full border-none shadow-sm bg-card/50 flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Productivity Score</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 min-h-[200px] flex items-center justify-center relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={100}
              startAngle={180}
              endAngle={0}
              dataKey="value"
              stroke="none"
              cornerRadius={10}
              paddingAngle={2}
            >
              <Cell key="cell-0" fill="var(--primary)" />
              <Cell key="cell-1" fill="var(--muted)" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-10 pointer-events-none">
          <span className="text-4xl font-bold tracking-tighter">{score}</span>
          <span className="text-sm text-muted-foreground font-medium mt-1">out of 100</span>
        </div>
      </CardContent>
    </Card>
  )
}
