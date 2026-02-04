import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface RevenueChartProps {
  focusData?: number[]
  distractionData?: number[]
  loading?: boolean
}

export function RevenueChart({ focusData = [], distractionData = [], loading }: RevenueChartProps) {
  // const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  
  // We need to map the last 7 days. Assuming the data arrays are 7 days long and end with today/yesterday.
  // Ideally, we'd get the actual dates from the backend, but we'll map to generic days or just indices for now.
  // Since the backend returns 7 days of sparklines, we'll just index them.
  
  const data = focusData.map((focus, i) => ({
    name: `Day ${i + 1}`,
    focus,
    distraction: distractionData[i] || 0
  }))

  if (loading) {
    return (
      <Card className="h-full border-none shadow-sm bg-card/50 min-h-[300px]">
        <CardHeader className="pb-2">
          <div className="h-6 w-48 bg-muted/50 rounded animate-pulse" />
        </CardHeader>
        <CardContent className="h-[200px] flex items-center justify-center">
          <div className="h-full w-full bg-muted/10 rounded animate-pulse" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full border-none shadow-sm bg-card/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Focus vs Distractions</CardTitle>
      </CardHeader>
      <CardContent className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorFocus" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorDistraction" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--destructive)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--destructive)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
            <XAxis 
              dataKey="name" 
              stroke="#888888" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
            />
            <YAxis 
              stroke="#888888" 
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
            />
            <Tooltip 
                contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px' }}
                itemStyle={{ color: 'var(--foreground)' }}
            />
            <Area 
              type="monotone" 
              dataKey="focus" 
              stroke="var(--primary)" 
              fillOpacity={1} 
              fill="url(#colorFocus)" 
              name="Focus (min)"
            />
            <Area 
              type="monotone" 
              dataKey="distraction" 
              stroke="var(--destructive)" 
              fillOpacity={1} 
              fill="url(#colorDistraction)" 
              name="Distractions"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
