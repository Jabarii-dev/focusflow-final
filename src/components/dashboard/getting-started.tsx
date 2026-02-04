import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CheckCircle2, Circle, Plus, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface Step {
  id: number
  title: string
  completed: boolean
}

const DEFAULT_STEPS: Step[] = [
  { id: 1, title: "Plan today’s focus block", completed: true },
  { id: 2, title: "Break down your main task", completed: true },
  { id: 3, title: "Start a 15‑minute session", completed: false },
  { id: 4, title: "Review distractions summary", completed: false },
]

export function GettingStarted() {
  const [steps, setSteps] = useState<Step[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("getting-started-steps")
      if (saved) {
        try {
          return JSON.parse(saved)
        } catch (e) {
          console.error("Failed to parse steps", e)
        }
      }
    }
    return DEFAULT_STEPS
  })
  
  const [newTask, setNewTask] = useState("")

  useEffect(() => {
    localStorage.setItem("getting-started-steps", JSON.stringify(steps))
  }, [steps])

  const toggleStep = (id: number) => {
    setSteps(steps.map(step => 
      step.id === id ? { ...step, completed: !step.completed } : step
    ))
  }

  const addStep = () => {
    if (!newTask.trim()) return
    const newId = steps.length > 0 ? Math.max(...steps.map(s => s.id)) + 1 : 1
    setSteps([...steps, { id: newId, title: newTask.trim(), completed: false }])
    setNewTask("")
  }

  const removeStep = (id: number) => {
    setSteps(steps.filter(step => step.id !== id))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addStep()
    }
  }

  return (
    <Card className="h-full border-none shadow-sm bg-card/50 flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Getting Started</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2 flex-1 overflow-auto">
        {steps.map((step) => (
          <div
            key={step.id}
            className={cn(
              "group flex items-center gap-3 rounded-lg border p-2.5 transition-colors",
              step.completed ? "bg-primary/5 border-primary/20" : "bg-muted/30 border-transparent hover:bg-muted/50"
            )}
          >
            <button onClick={() => toggleStep(step.id)} className="shrink-0 focus:outline-none">
              {step.completed ? (
                <CheckCircle2 className="h-4 w-4 text-primary" />
              ) : (
                <Circle className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
            <div className="flex-1 min-w-0">
              <p className={cn("text-sm font-medium leading-none truncate", step.completed && "text-muted-foreground line-through")}>
                {step.title}
              </p>
            </div>
            <button 
              onClick={() => removeStep(step.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive focus:opacity-100 focus:outline-none"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
        
        <div className="flex items-center gap-2 mt-2">
          <Input 
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a new task..."
            className="h-8 text-sm bg-background/50"
          />
          <Button size="icon" variant="ghost" className="h-8 w-8 shrink-0" onClick={addStep} disabled={!newTask.trim()}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
