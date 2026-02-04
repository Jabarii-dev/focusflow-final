import { useState, useEffect } from "react"
import { useAction } from "convex/react"
import { api } from "../../convex/_generated/api"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { FocusSession, FocusSessionSummary } from "@/components/task-decomposer/focus-session"
import {
  Layers,
  Sparkles,
  Play,
  Plus,
  Clock,
  BrainCircuit,
  CheckCircle2,
  ArrowRight,
  Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useI18n } from "@/hooks/use-i18n"

interface Step {
  id: string
  title: string
  minutes: number
}


const formatMinutes = (totalMinutes: number) => {
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  if (hours === 0) {
    return `${minutes}m`
  }

  if (minutes === 0) {
    return `${hours}h`
  }

  return `${hours}h ${minutes}m`
}

type DecomposeResponseStep = {
  title: string
  minutes: number
}

function TaskDecomposerContent() {
  const { t } = useI18n()
  const decomposeTask = useAction(api.taskDecomposer.decomposeTask)
  const [taskName, setTaskName] = useState("")
  const [chunkMinutes, setChunkMinutes] = useState("6")
  const [timeAvailable, setTimeAvailable] = useState("")
  const [context, setContext] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [steps, setSteps] = useState<Step[]>([])
  const [hasGenerated, setHasGenerated] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Session State
  const [sessionActive, setSessionActive] = useState(false)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [timerStatus, setTimerStatus] = useState<'idle' | 'running' | 'paused'>('idle')
  const [completedStepIds, setCompletedStepIds] = useState<string[]>([])
  const [autoStartNext, setAutoStartNext] = useState(false)
  const [sessionCompleted, setSessionCompleted] = useState(false)

  const parsedChunkMinutes = Number(chunkMinutes)
  const effectiveChunkMinutes =
    Number.isFinite(parsedChunkMinutes) && parsedChunkMinutes > 0 ? parsedChunkMinutes : 6
  const totalMinutes = steps.reduce((sum, step) => sum + step.minutes, 0)
  const totalTimeLabel = totalMinutes > 0 ? formatMinutes(totalMinutes) : null

  const playTimerSound = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext
      if (!AudioContext) return
      const ctx = new AudioContext()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = 'sine'
      osc.frequency.setValueAtTime(880, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.1)
      gain.gain.setValueAtTime(0.1, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5)
      osc.start()
      osc.stop(ctx.currentTime + 0.5)
    } catch (e) {
      console.error("Audio play failed", e)
    }
  }

  // Timer Effect
  useEffect(() => {
    let interval: any

    if (sessionActive && timerStatus === 'running' && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            playTimerSound()
            setTimerStatus('paused')
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [sessionActive, timerStatus, timeLeft])

  const handleStartSession = () => {
    if (steps.length === 0) return

    // Find first uncompleted step or default to 0
    const firstUncompletedIndex = steps.findIndex((step) => !completedStepIds.includes(step.id))
    const startIndex = firstUncompletedIndex !== -1 ? firstUncompletedIndex : 0

    setCurrentStepIndex(startIndex)
    setTimeLeft(steps[startIndex].minutes * 60)
    setSessionActive(true)
    setSessionCompleted(false)
    setTimerStatus('running')
  }

  const handleToggleTimer = () => {
    setTimerStatus((prev) => (prev === 'running' ? 'paused' : 'running'))
  }

  const handleCompleteStep = () => {
    const currentStep = steps[currentStepIndex]
    if (!completedStepIds.includes(currentStep.id)) {
      setCompletedStepIds((prev) => [...prev, currentStep.id])
    }

    const nextIndex = currentStepIndex + 1
    if (nextIndex < steps.length) {
      setCurrentStepIndex(nextIndex)
      setTimeLeft(steps[nextIndex].minutes * 60)
      setTimerStatus(autoStartNext ? 'running' : 'idle')
    } else {
      // All done
      setSessionCompleted(true)
      setTimerStatus('idle')
    }
  }

  const handleExitSession = () => {
    setSessionActive(false)
    setSessionCompleted(false)
    setTimerStatus('idle')
  }

  const handleGenerate = async () => {
    const trimmedTask = taskName.trim()
    if (!trimmedTask) return

    setIsGenerating(true)
    setErrorMessage(null)
    setHasGenerated(false)

    try {
      const response = (await decomposeTask({
        task: trimmedTask,
        chunkMinutes: effectiveChunkMinutes,
        timeAvailable: timeAvailable.trim() || undefined,
        context: context.trim() || undefined,
      })) as DecomposeResponseStep[]

      const nextSteps = response.map((step, index) => ({
        id: `${index + 1}`,
        title: step.title,
        minutes: step.minutes,
      }))

      setSteps(nextSteps)
      setHasGenerated(true)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to decompose the task.")
      setSteps([])
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-[95vw] mx-auto space-y-3 w-full">
        {/* Identity Header */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-purple-500/10 rounded-lg">
              <Layers className="size-5 text-purple-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-foreground">{t('taskDecomposer')}</h1>
              <p className="text-xs text-muted-foreground">
                {t('transformTasks')}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-3">
            {/* Input Section */}
            <Card className="bg-background/40 backdrop-blur-md border-white/10 shadow-lg">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-base">{t('whatNeedsDone')}</CardTitle>
                <CardDescription className="text-xs">
                  {t('enterTaskDetails')}
                </CardDescription>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      placeholder="e.g. Write Q3 Quarterly Report"
                      value={taskName}
                      onChange={(event) => setTaskName(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault()
                          void handleGenerate()
                        }
                      }}
                      className="text-sm h-9"
                    />
                    <Button
                      size="sm"
                      onClick={() => void handleGenerate()}
                      disabled={!taskName.trim() || isGenerating}
                      className="shrink-0 bg-purple-600 hover:bg-purple-700 h-9 px-3 text-xs"
                    >
                      {isGenerating ? (
                        <>
                          <Sparkles className="mr-2 size-3 animate-spin" />
                          {t('decomposing')}
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 size-3" />
                          {t('generateSteps')}
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <p className="text-[10px] text-muted-foreground">{t('chunkSize')}</p>
                      <Input
                        type="number"
                        min={1}
                        value={chunkMinutes}
                        onChange={(event) => setChunkMinutes(event.target.value)}
                        className="text-sm h-8"
                      />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] text-muted-foreground">{t('timeAvailable')}</p>
                      <Input
                        placeholder="e.g. 2 hours this afternoon"
                        value={timeAvailable}
                        onChange={(event) => setTimeAvailable(event.target.value)}
                        className="text-sm h-8"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[10px] text-muted-foreground">{t('extraContext')}</p>
                    <Textarea
                      placeholder="e.g. Focus on the executive summary and charts"
                      value={context}
                      onChange={(event) => setContext(event.target.value)}
                      className="text-sm min-h-[80px]"
                    />
                  </div>

                  {errorMessage && (
                    <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-[10px] text-rose-700">
                      {errorMessage}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Results Section */}
            {(hasGenerated || isGenerating) && (
              sessionActive ? (
                sessionCompleted ? (
                  <FocusSessionSummary
                    totalSteps={steps.length}
                    totalMinutes={steps.reduce((acc, s) => acc + s.minutes, 0)}
                    onClose={handleExitSession}
                  />
                ) : (
                  <FocusSession
                    step={steps[currentStepIndex]}
                    currentStepIndex={currentStepIndex}
                    totalSteps={steps.length}
                    isActive={timerStatus === 'running'}
                    timeLeft={timeLeft}
                    autoStartNext={autoStartNext}
                    onToggleAutoStart={setAutoStartNext}
                    onToggleTimer={handleToggleTimer}
                    onCompleteStep={handleCompleteStep}
                    onExitSession={handleExitSession}
                  />
                )
              ) : (
                <Card className="overflow-hidden bg-background/40 backdrop-blur-md border-white/10 shadow-lg">
                  <div className="h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500" />
                  <CardHeader className="pb-2 pt-4 px-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <BrainCircuit className="size-4 text-purple-500" />
                        {t('actionPlan')}
                      </CardTitle>
                      {hasGenerated && totalTimeLabel && (
                        <Badge
                          variant="secondary"
                          className="bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:bg-purple-500/20 text-[10px] px-2 py-0.5"
                        >
                          {t('totalTime')}: ~{totalTimeLabel}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="px-4 pb-4">
                    {isGenerating ? (
                      <div className="py-6 flex flex-col items-center justify-center text-center space-y-3">
                        <div className="relative">
                          <div className="absolute inset-0 bg-purple-500 blur-xl opacity-20 animate-pulse rounded-full" />
                          <Sparkles className="size-8 text-purple-500 animate-bounce relative z-10" />
                        </div>
                        <div className="space-y-0.5">
                          <h3 className="text-sm font-medium">{t('analyzingComplexity')}</h3>
                          <p className="text-muted-foreground text-[10px]">
                            {t('breakingDownTask')}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-0 relative">
                        {/* Vertical line for timeline */}
                        <div className="absolute left-[32px] top-3 bottom-3 w-px bg-border z-0" />

                        {steps.map((step, index) => (
                          <div key={step.id} className="relative z-10 group">
                            <div className="flex items-start gap-6 py-1.5">
                              <div className="mt-0.5 rounded-full border p-0.5 transition-colors bg-background/50 border-white/10 group-hover:border-purple-500/50">
                                <Checkbox
                                  id={step.id}
                                  checked={completedStepIds.includes(step.id)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setCompletedStepIds((prev) => [...prev, step.id])
                                    } else {
                                      setCompletedStepIds((prev) => prev.filter((id) => id !== step.id))
                                    }
                                  }}
                                  className="size-3.5 rounded-full data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                                />
                              </div>
                              <div className="flex-1 space-y-0.5">
                                <div className="flex items-center justify-between">
                                  <label
                                    htmlFor={step.id}
                                    className={cn(
                                      "font-medium text-sm leading-none cursor-pointer transition-colors",
                                      completedStepIds.includes(step.id)
                                        ? "text-muted-foreground line-through decoration-purple-500/30"
                                        : "text-foreground group-hover:text-purple-400"
                                    )}
                                  >
                                    {step.title}
                                  </label>
                                  <Badge
                                    variant="outline"
                                    className={cn(
                                      "text-[10px] font-normal px-1 py-0 flex items-center gap-1",
                                      completedStepIds.includes(step.id)
                                        ? "bg-white/5 text-muted-foreground border-transparent"
                                        : step.minutes <= effectiveChunkMinutes
                                          ? "bg-green-500/10 text-green-400 border-green-500/20"
                                          : step.minutes <= effectiveChunkMinutes * 2
                                            ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                                            : "bg-red-500/10 text-red-400 border-red-500/20",
                                    )}
                                  >
                                    <Clock className="size-3" />
                                    {step.minutes} min
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            {index < steps.length - 1 && <Separator className="ml-12 my-0.5 opacity-10" />}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                  {hasGenerated && (
                    <CardFooter className="bg-white/5 pt-3 pb-3 px-4">
                      <Button 
                        className="w-full bg-purple-600 hover:bg-purple-700 h-8 text-xs"
                        onClick={handleStartSession}
                      >
                        <Play className="mr-2 size-3" /> {t('startFirstSession')}
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              )
            )}

            {!hasGenerated && !isGenerating && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  "Prepare Q3 Financial Analysis",
                  "Plan Marketing Campaign",
                  "Debug Auth System",
                  "Write Blog Post",
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setTaskName(suggestion)}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-white/5 bg-background/40 hover:bg-white/5 hover:border-white/10 transition-all text-left group"
                  >
                    <span className="font-medium text-xs text-muted-foreground group-hover:text-foreground">
                      {suggestion}
                    </span>
                    <Plus className="size-3 opacity-0 group-hover:opacity-100 text-purple-500 transition-opacity" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar / Secondary Panel */}
          <div className="space-y-3">
            <Card className="bg-background/40 backdrop-blur-md border-white/10 shadow-lg">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Zap className="size-3.5 text-yellow-500 fill-yellow-500" />
                  {t('whyThisWorks')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 px-4 pb-4">
                <div className="space-y-0.5">
                  <h4 className="font-semibold text-[10px]">{t('cognitiveLoadTheory')}</h4>
                  <p className="text-[10px] text-muted-foreground">
                    {t('cognitiveLoadDesc')}
                  </p>
                </div>
                <Separator />
                <div className="space-y-0.5">
                  <h4 className="font-semibold text-[10px]">{t('dopamineLoop')}</h4>
                  <p className="text-[10px] text-muted-foreground">
                    {t('dopamineLoopDesc')}
                  </p>
                </div>
                <Separator />
                <div className="space-y-0.5">
                  <h4 className="font-semibold text-[10px]">{t('timeBoxing')}</h4>
                  <p className="text-[10px] text-muted-foreground">
                    {t('timeBoxingDesc')}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-background/40 backdrop-blur-md border-white/10 shadow-lg">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm">{t('proTips')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 px-4 pb-4">
                <div className="flex gap-2">
                  <div className="mt-0.5 bg-blue-500/10 text-blue-400 p-1 rounded-md h-fit">
                    <CheckCircle2 className="size-3" />
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    {t('tipMomentum')}
                  </p>
                </div>
                <div className="flex gap-2">
                  <div className="mt-0.5 bg-green-500/10 text-green-400 p-1 rounded-md h-fit">
                    <ArrowRight className="size-3" />
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    {t('tipBreakDown')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default function TaskDecomposerPage() {
  return <TaskDecomposerContent />
}
