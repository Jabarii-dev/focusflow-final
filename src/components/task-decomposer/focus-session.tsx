import { Play, Pause, CheckCircle2, X, Timer, Trophy, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface Step {
  id: string
  title: string
  minutes: number
}

interface FocusSessionProps {
  step: Step
  currentStepIndex: number
  totalSteps: number
  isActive: boolean
  timeLeft: number
  autoStartNext: boolean
  onToggleTimer: () => void
  onCompleteStep: () => void
  onExitSession: () => void
  onToggleAutoStart: (checked: boolean) => void
}

export function FocusSession({
  step,
  currentStepIndex,
  totalSteps,
  isActive,
  timeLeft,
  autoStartNext,
  onToggleTimer,
  onCompleteStep,
  onExitSession,
  onToggleAutoStart,
}: FocusSessionProps) {
  // Progress based on completed steps (current index)
  const progress = (currentStepIndex / totalSteps) * 100

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <Card className="border-white/10 shadow-2xl bg-background/40 backdrop-blur-xl relative overflow-hidden transition-all duration-300">
      <div className="absolute top-0 left-0 w-full h-1 bg-purple-500" />
      
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="bg-white/5 backdrop-blur-sm border-white/10">
            Step {currentStepIndex + 1} of {totalSteps}
          </Badge>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-muted-foreground hover:text-foreground" 
            onClick={onExitSession}
          >
            <X className="size-4" />
          </Button>
        </div>
        <CardTitle className="text-2xl font-bold mt-4 leading-tight">
            {step.title}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-8 py-8">
        <div className="flex flex-col items-center justify-center space-y-4">
            <div className={cn(
                "text-7xl font-mono font-bold tracking-tighter tabular-nums transition-colors duration-300",
                isActive ? "text-purple-400" : "text-muted-foreground"
            )}>
                {formatTime(timeLeft)}
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground bg-white/5 border border-white/5 px-3 py-1 rounded-full">
                <Timer className="size-3.5" />
                {isActive ? "Focus Session Active" : "Timer Paused"}
            </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-6">
        <div className="flex items-center gap-3 w-full">
            <Button 
                variant={isActive ? "secondary" : "default"}
                size="lg" 
                className={cn(
                  "flex-1 h-12 text-base font-medium transition-all",
                  !isActive && "bg-purple-600 hover:bg-purple-700"
                )}
                onClick={onToggleTimer}
            >
                {isActive ? (
                    <>
                        <Pause className="mr-2 size-5" /> Pause
                    </>
                ) : (
                    <>
                        <Play className="mr-2 size-5 fill-current" /> {timeLeft < step.minutes * 60 ? "Resume" : "Start Focus"}
                    </>
                )}
            </Button>
            <Button 
                variant="default" 
                size="lg" 
                className="flex-1 h-12 text-base font-medium bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow-md transition-all"
                onClick={onCompleteStep}
            >
                <CheckCircle2 className="mr-2 size-5" /> Complete Step
            </Button>
        </div>
        
        <div className="flex items-center justify-center space-x-2">
          <Checkbox 
            id="auto-start" 
            checked={autoStartNext}
            onCheckedChange={(checked) => onToggleAutoStart(checked as boolean)}
            className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
          />
          <Label 
            htmlFor="auto-start" 
            className="text-xs font-medium text-muted-foreground cursor-pointer select-none"
          >
            Auto-start next step
          </Label>
        </div>

        <div className="w-full space-y-2">
            <div className="flex justify-between text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
                <span>Task Progress</span>
                <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2 bg-secondary" />
        </div>
      </CardFooter>
    </Card>
  )
}

interface FocusSessionSummaryProps {
  totalSteps: number
  totalMinutes: number
  onClose: () => void
}

export function FocusSessionSummary({ totalSteps, totalMinutes, onClose }: FocusSessionSummaryProps) {
  return (
    <Card className="border-white/10 shadow-2xl bg-background/40 backdrop-blur-xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-green-500" />
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 mix-blend-soft-light pointer-events-none" />
      
      <CardHeader className="pb-2 text-center pt-8">
        <div className="mx-auto bg-green-500/10 w-16 h-16 rounded-full flex items-center justify-center mb-4 ring-4 ring-green-500/5">
          <Trophy className="size-8 text-green-400" />
        </div>
        <CardTitle className="text-2xl font-bold">Session Completed!</CardTitle>
        <p className="text-muted-foreground text-sm">You've crushed your goals for this session.</p>
      </CardHeader>

      <CardContent className="py-8">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 border border-white/5 rounded-xl p-4 text-center space-y-1">
            <div className="text-3xl font-bold text-foreground">{totalSteps}</div>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Steps Done</div>
          </div>
          <div className="bg-white/5 border border-white/5 rounded-xl p-4 text-center space-y-1">
            <div className="text-3xl font-bold text-foreground">{totalMinutes}</div>
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Minutes Focused</div>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button 
          size="lg" 
          className="w-full h-12 text-base font-medium bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow-md transition-all"
          onClick={onClose}
        >
          Return to Dashboard <ArrowRight className="ml-2 size-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
