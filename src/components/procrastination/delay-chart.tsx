"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const chartConfig = {
  delay: {
    label: "Avg Delay (Days)",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function DelayChart({ data }: { data?: { category: string; avgDelayDays: number }[] }) {
  const chartData = data?.map((item, i) => ({
    type: item.category,
    delay: item.avgDelayDays,
    fill: [
      "#3b82f6", // Blue
      "#06b6d4", // Cyan
      "#a855f7", // Purple
      "#ec4899", // Pink
      "#f59e0b", // Amber
      "#10b981", // Emerald
    ][i % 6]
  })) || []

  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 backdrop-blur-sm h-full flex flex-col">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-medium text-white tracking-tight mb-1">Delay Patterns</h3>
          <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">Average delay by task type (days)</p>
        </div>
      </div>
      
      <div className="flex-1 min-h-[150px] w-full">
        {chartData.length > 0 ? (
          <ChartContainer config={chartConfig} className="h-full w-full">
            <BarChart accessibilityLayer data={chartData} layout="vertical" margin={{ left: 0, right: 20, top: 0, bottom: 0 }}>
              <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
              <YAxis
                dataKey="type"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                width={80}
                tick={{ fontSize: 12, fontFamily: 'var(--font-mono)', fill: 'rgba(255,255,255,0.5)' }}
              />
              <XAxis type="number" hide />
              <ChartTooltip
                cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                content={<ChartTooltipContent hideLabel className="bg-[#0a0a0a] border-white/10 text-white font-mono" />}
              />
              <Bar dataKey="delay" radius={[0, 4, 4, 0]} barSize={24}>
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.fill} 
                    className="stroke-black/20 stroke-1 hover:opacity-80 transition-opacity"
                  />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-slate-500 text-sm">
            No delay data available
          </div>
        )}
      </div>
    </div>
  )
}
