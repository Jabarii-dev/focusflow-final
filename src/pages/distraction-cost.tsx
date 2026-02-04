import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from "recharts"
import { 
  DollarSign, 
  Clock, 
  TrendingUp, 
  PauseCircle, 
  PlayCircle, 
  RefreshCw,
  Briefcase
} from "lucide-react"

const burnData = [
  { time: '09:00', cost: 0 },
  { time: '10:00', cost: 150 },
  { time: '11:00', cost: 420 }, // Meeting spike
  { time: '12:00', cost: 570 },
  { time: '13:00', cost: 720 },
  { time: '14:00', cost: 950 }, // Another meeting
  { time: '15:00', cost: 1100 },
  { time: '16:00', cost: 1250 },
]

export default function DistractionCostPage() {
  const [isTracking, setIsTracking] = useState(true)
  const [hourlyRate, setHourlyRate] = useState(120)
  const [teamSize, setTeamSize] = useState(1)
  const [currentCost, setCurrentCost] = useState(142.50)

  // Simulate real-time cost ticker
  useEffect(() => {
    let interval: any;
    if (isTracking) {
      interval = setInterval(() => {
        // Cost per second = (Hourly Rate * Team Size) / 3600
        const costPerSecond = (hourlyRate * teamSize) / 3600
        setCurrentCost(prev => prev + (costPerSecond / 10)) // Update every 100ms
      }, 100)
    }
    return () => clearInterval(interval)
  }, [isTracking, hourlyRate, teamSize])

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8 p-8 max-w-[1600px] mx-auto animate-in fade-in duration-500">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              Distraction Cost Calculator
            </h1>
            <p className="text-muted-foreground mt-1 text-lg">
              Visualize the financial impact of interruptions in real-time.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-card border px-3 py-1.5 rounded-full shadow-sm">
              <div className={`h-2 w-2 rounded-full ${isTracking ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`} />
              <span className="text-sm font-medium">{isTracking ? 'Live Tracking' : 'Paused'}</span>
            </div>
            <Button 
              variant={isTracking ? "destructive" : "default"}
              onClick={() => setIsTracking(!isTracking)}
              className="gap-2"
            >
              {isTracking ? <PauseCircle className="h-4 w-4" /> : <PlayCircle className="h-4 w-4" />}
              {isTracking ? 'Stop Tracker' : 'Resume Tracker'}
            </Button>
          </div>
        </div>

        {/* Main Ticker & Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Real-time Ticker Card */}
          <Card className="lg:col-span-2 border-none shadow-xl bg-gradient-to-br from-card to-card/50 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-32 bg-red-500/5 blur-[100px] rounded-full pointer-events-none" />
            
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-muted-foreground font-medium text-sm uppercase tracking-wider">
                <DollarSign className="h-4 w-4" />
                Session Cost
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <div className="text-7xl md:text-9xl font-bold tracking-tighter font-mono tabular-nums text-foreground">
                ${currentCost.toFixed(2)}
              </div>
              <p className="text-muted-foreground mt-4 flex items-center gap-2">
                <span className="text-red-500 font-medium flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +${((hourlyRate * teamSize) / 60).toFixed(2)}/min
                </span>
                burn rate based on your settings
              </p>
            </CardContent>
          </Card>

          {/* Settings Panel */}
          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle>Configuration</CardTitle>
              <CardDescription>Adjust parameters to estimate costs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label>Hourly Rate (Avg)</Label>
                  <span className="text-sm font-medium text-muted-foreground">${hourlyRate}/hr</span>
                </div>
                <Slider 
                  value={[hourlyRate]} 
                  min={15} 
                  max={500} 
                  step={5} 
                  onValueChange={(val) => setHourlyRate(val[0])}
                  className="py-2"
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label>Team Size</Label>
                  <span className="text-sm font-medium text-muted-foreground">{teamSize} people</span>
                </div>
                <Slider 
                  value={[teamSize]} 
                  min={1} 
                  max={50} 
                  step={1} 
                  onValueChange={(val) => setTeamSize(val[0])}
                  className="py-2"
                />
              </div>

              <div className="pt-4 border-t space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    Include Overhead (20%)
                  </Label>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    Context Switch Penalty
                  </Label>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full gap-2" onClick={() => setCurrentCost(0)}>
                <RefreshCw className="h-4 w-4" />
                Reset Counter
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Visualization Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Daily Burn Chart */}
          <Card className="lg:col-span-2 border-none shadow-md">
            <CardHeader>
              <CardTitle>Daily Cost Burn</CardTitle>
              <CardDescription>Cumulative cost of time spent today</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={burnData}>
                  <defs>
                    <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--destructive)" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="var(--destructive)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.4} />
                  <XAxis 
                    dataKey="time" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'var(--muted-foreground)' }} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'var(--muted-foreground)' }}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--popover)', 
                      borderColor: 'var(--border)', 
                      borderRadius: '8px'
                    }}
                    formatter={(value) => [`$${value}`, 'Cost']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="cost" 
                    stroke="var(--destructive)" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorCost)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Impact Gauge */}
          <Card className="border-none shadow-md bg-muted/30">
            <CardHeader>
              <CardTitle>Annual Projection</CardTitle>
              <CardDescription>If current trends continue</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center h-[300px] text-center">
              <div className="relative h-40 w-40 flex items-center justify-center mb-6">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    className="text-muted stroke-current"
                    strokeWidth="10"
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                  />
                  <circle
                    className="text-red-500 progress-ring__circle stroke-current transition-all duration-1000 ease-out"
                    strokeWidth="10"
                    strokeLinecap="round"
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    strokeDasharray="251.2"
                    strokeDashoffset="60" // 75% filled
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold">$42k</span>
                  <span className="text-xs text-muted-foreground">Est. Loss</span>
                </div>
              </div>
              
              <div className="space-y-2 w-full">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Meeting Cost</span>
                  <span className="font-medium">$28,400</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-red-400 h-2 rounded-full" style={{ width: '65%' }} />
                </div>
                
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-muted-foreground">Context Switching</span>
                  <span className="font-medium">$13,600</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-orange-400 h-2 rounded-full" style={{ width: '35%' }} />
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </DashboardLayout>
  )
}
