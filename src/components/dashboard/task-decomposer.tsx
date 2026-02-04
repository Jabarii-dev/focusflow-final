import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Layers, Sparkles, Play, Plus } from "lucide-react"

interface Step {
  id: string
  text: string
  time: string
  effort: "Low" | "Medium" | "High"
}

export function TaskDecomposer() {
  const [taskName, setTaskName] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [steps, setSteps] = useState<Step[]>([
    { id: "1", text: "Draft project outline", time: "5 mins", effort: "Low" },
    { id: "2", text: "Gather research materials", time: "15 mins", effort: "Medium" },
    { id: "3", text: "Create first draft", time: "45 mins", effort: "High" },
  ])

  const handleGenerate = () => {
    if (!taskName) return
    setIsGenerating(true)
    setTimeout(() => {
      setSteps([
        { id: "new-1", text: `Define scope for ${taskName}`, time: "10 mins", effort: "Low" },
        { id: "new-2", text: "Identify key stakeholders", time: "15 mins", effort: "Low" },
        { id: "new-3", text: "Set up project board", time: "5 mins", effort: "Low" },
        { id: "new-4", text: "Schedule kickoff meeting", time: "10 mins", effort: "Medium" },
      ])
      setIsGenerating(false)
      setTaskName("")
    }, 1500)
  }

  return (
    <Card className="flex flex-col h-full border-l-4 border-l-purple-500 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Layers className="size-5 text-purple-500" />
          Task Decomposer
        </CardTitle>
        <CardDescription>Break overwhelming projects into micro-steps.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4">
        <div className="flex gap-2">
          <Input 
            placeholder="What's your big task?" 
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
          />
          <Button 
            size="icon" 
            onClick={handleGenerate} 
            disabled={!taskName || isGenerating}
            className="shrink-0 bg-purple-600 hover:bg-purple-700"
          >
            {isGenerating ? <Sparkles className="size-4 animate-spin" /> : <Plus className="size-4" />}
          </Button>
        </div>

        <div className="flex-1 min-h-[200px] border rounded-md bg-muted/30 relative overflow-hidden">
          {isGenerating && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-10">
              <div className="flex flex-col items-center gap-2">
                <Sparkles className="size-8 text-purple-500 animate-pulse" />
                <span className="text-sm font-medium text-purple-500">AI is thinking...</span>
              </div>
            </div>
          )}
          
          <ScrollArea className="h-full p-4">
            <div className="space-y-3">
              {steps.map((step) => (
                <div key={step.id} className="flex items-start gap-3 group">
                  <Checkbox id={step.id} className="mt-1 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600" />
                  <div className="grid gap-1.5 leading-none flex-1">
                    <label
                      htmlFor={step.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 group-hover:text-purple-400 transition-colors"
                    >
                      {step.text}
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{step.time}</span>
                      <Badge variant="outline" className="text-[10px] h-4 px-1 py-0 border-purple-500/30 text-purple-500">
                        {step.effort}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full bg-purple-600 hover:bg-purple-700">
          <Play className="mr-2 size-4" /> Start Focus Session
        </Button>
      </CardFooter>
    </Card>
  )
}
