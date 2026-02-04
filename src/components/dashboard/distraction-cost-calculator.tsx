import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DollarSign, AlertTriangle, ShieldAlert, PauseCircle, PlayCircle } from "lucide-react"

export function DistractionCostCalculator() {
  const HOURLY_RATE = 60 // $60/hr
  const [isDistracted, setIsDistracted] = useState(false)
  const [secondsDistracted, setSecondsDistracted] = useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isDistracted) {
      interval = setInterval(() => {
        setSecondsDistracted(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isDistracted])

  const cost = (secondsDistracted / 3600) * HOURLY_RATE

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(val)
  }

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600)
    const m = Math.floor((secs % 3600) / 60)
    const s = secs % 60
    return `${h}h ${m}m ${s}s`
  }

  return (
    <Card className="flex flex-col h-full border-l-4 border-l-destructive shadow-lg relative overflow-hidden">
      {isDistracted && (
        <div className="absolute top-0 right-0 p-4 opacity-20 pointer-events-none">
          <DollarSign className="size-48 text-destructive animate-pulse" />
        </div>
      )}
      
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <DollarSign className="size-5 text-destructive" />
          Distraction Cost
        </CardTitle>
        <CardDescription>Real-time cost of lost focus.</CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 space-y-6 z-10">
        <div className="flex flex-col items-center justify-center py-6 text-center space-y-2 bg-muted/20 rounded-lg border border-border/50">
          <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Money Burned</span>
          <span className={`text-5xl font-black tracking-tighter tabular-nums ${isDistracted ? 'text-destructive animate-pulse' : 'text-foreground'}`}>
            {formatCurrency(cost)}
          </span>
          <Badge variant={isDistracted ? "destructive" : "outline"} className="mt-2">
            {isDistracted ? "DISTRACTED" : "FOCUSED"}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-3 text-center text-sm">
          <div className="rounded-md bg-muted p-3 border border-border/50">
            <span className="block font-bold text-lg">{formatTime(secondsDistracted)}</span>
            <span className="text-xs text-muted-foreground">Time Lost</span>
          </div>
          <div className="rounded-md bg-muted p-3 border border-border/50">
            <span className="block font-bold text-lg text-destructive">$145.50</span>
            <span className="text-xs text-muted-foreground">Weekly Total</span>
          </div>
        </div>
        
        {isDistracted && (
           <div className="flex items-center gap-2 text-xs text-destructive bg-destructive/10 p-2 rounded border border-destructive/20">
             <AlertTriangle className="size-4" />
             <span>You could have bought 2 coffees with this.</span>
           </div>
        )}
      </CardContent>
      
      <CardFooter className="gap-2">
        <Button 
          variant={isDistracted ? "default" : "secondary"} 
          className={`flex-1 ${isDistracted ? "bg-green-600 hover:bg-green-700" : ""}`}
          onClick={() => setIsDistracted(!isDistracted)}
        >
          {isDistracted ? (
            <>
              <PlayCircle className="mr-2 size-4" /> I'm Back!
            </>
          ) : (
            <>
              <PauseCircle className="mr-2 size-4" /> I'm Distracted
            </>
          )}
        </Button>
        <Button variant="outline" size="icon" title="Enable Blocker">
          <ShieldAlert className="size-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
