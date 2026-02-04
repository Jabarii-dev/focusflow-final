"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { AlertCircle, CheckCircle2, Plus, X, Check } from "lucide-react"
import { useMutation } from "convex/react"
import type { Id } from "../../../convex/_generated/dataModel"
import { api } from "../../../convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "react-hot-toast"

type TaskImpact = "low" | "medium" | "high" | "critical"

interface Task {
  id: Id<"tasks">
  title: string
  status: string
  category: string
  dueDate: number
  impact: TaskImpact
}

type NewTaskItem = {
  title: string
  category: string
  impact: TaskImpact
  dueDate: string
}

export function TaskList({ tasks = [] }: { tasks?: Task[] }) {
  const createTask = useMutation(api.tasks.createTask)
  const completeTask = useMutation(api.tasks.completeTask)
  const resolveTask = useMutation(api.tasks.resolveTask)
  const [isAdding, setIsAdding] = useState(false)

  const [newItem, setNewItem] = useState<NewTaskItem>({
    title: "",
    category: "admin",
    impact: "medium",
    dueDate: ""
  })

  const handleCreate = async () => {
    if (!newItem.title) {
      toast.error("Title is required")
      return
    }
    try {
      await createTask({ 
        title: newItem.title,
        category: newItem.category,
        impact: newItem.impact,
        dueDate: newItem.dueDate ? new Date(newItem.dueDate).getTime() : Date.now()
      })
      setNewItem({ title: "", category: "admin", impact: "medium", dueDate: "" })
      setIsAdding(false)
      toast.success("Task added")
    } catch (error) {
      console.error(error)
      toast.error("Failed to create task")
    }
  }

  const handleComplete = async (taskId: Id<"tasks">) => {
    try {
      await completeTask({ taskId })
      toast.success("Task completed")
    } catch (error) {
      console.error(error)
      toast.error("Failed to complete task")
    }
  }

  const handleResolve = async (id: Id<"tasks">, resolution: "completed" | "not_completed") => {
    try {
      await resolveTask({ id, resolution })
      toast.success(resolution === "completed" ? "Task completed" : "Task marked overdue")
    } catch (error) {
      toast.error("Failed to resolve task")
    }
  }

  const getDelay = (dueDate: number) => {
    const now = Date.now()
    if (dueDate >= now) return null
    const diff = now - dueDate
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    return days > 0 ? `${days} days` : "Overdue"
  }

  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl text-white tracking-tight mb-1">Active Tasks</h3>
          <p className="text-xs text-slate-500 font-medium tracking-wide">MONITORING PROCRASTINATION IMPACT</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-white/10 bg-white/5 text-[10px] font-medium text-slate-400 px-3 py-1">
            {tasks.length} Active
          </Badge>
          <Button 
            size="sm" 
            variant="outline" 
            className={cn(
              "h-7 px-2 border-white/10 bg-white/5 hover:bg-white/10 text-slate-300",
              isAdding && "bg-blue-500/10 text-blue-400 border-blue-500/20"
            )}
            onClick={() => setIsAdding(!isAdding)}
          >
            {isAdding ? <X className="size-4" /> : <Plus className="size-4" />}
          </Button>
        </div>
      </div>

      {isAdding && (
        <div className="mb-4 p-4 rounded-xl border border-white/10 bg-white/[0.03] space-y-3 animate-in slide-in-from-top-2 fade-in duration-200">
          <div className="flex flex-col gap-3">
            <Input 
              placeholder="Task title" 
              value={newItem.title}
              onChange={(e) => setNewItem({...newItem, title: e.target.value})}
              className="bg-black/20 border-white/10 text-white placeholder:text-slate-500"
            />
            <div className="grid grid-cols-2 gap-3">
              <Select 
                value={newItem.category} 
                onValueChange={(val) => setNewItem({...newItem, category: val})}
              >
                <SelectTrigger className="bg-black/20 border-white/10 text-white">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="creative">Creative</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="meetings">Meetings</SelectItem>
                </SelectContent>
              </Select>

              <Select 
                value={newItem.impact} 
                onValueChange={(val) => setNewItem({...newItem, impact: val as TaskImpact})}
              >
                <SelectTrigger className="bg-black/20 border-white/10 text-white">
                  <SelectValue placeholder="Impact" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-3">
              <Input 
                type="date"
                value={newItem.dueDate}
                onChange={(e) => setNewItem({...newItem, dueDate: e.target.value})}
                className="bg-black/20 border-white/10 text-white flex-1"
              />
              <Button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700 text-white">
                Add Task
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-sm">
            No active tasks
          </div>
        ) : (
          tasks.map((task) => {
            const delay = getDelay(task.dueDate)
            const isOverdue = task.dueDate < Date.now() && task.status === 'active'

            return (
              <div 
                key={task.id}
                className="group flex flex-col md:flex-row md:items-center justify-between gap-4 p-3 rounded-xl border border-white/5 bg-white/[0.01] hover:border-white/10 hover:bg-white/[0.03] transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border transition-colors duration-300 cursor-pointer hover:scale-110",
                    isOverdue ? "border-red-500/20 bg-red-500/5 text-red-400 group-hover:bg-red-500/10" :
                    task.status === "done" ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-400 group-hover:bg-emerald-500/10" :
                    "border-blue-500/20 bg-blue-500/5 text-blue-400 group-hover:bg-blue-500/10"
                  )}
                  onClick={() => !isOverdue && handleComplete(task.id)}
                  title={isOverdue ? "Task Overdue" : "Complete Task"}
                  >
                    {isOverdue ? <AlertCircle className="size-4" /> :
                     task.status === "done" ? <CheckCircle2 className="size-4" /> :
                     <CheckCircle2 className="size-4 opacity-50 hover:opacity-100" />}
                  </div>
                  <div>
                    <p className="font-medium text-slate-200 group-hover:text-white transition-colors text-base">{task.title}</p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium tracking-wide uppercase mt-0.5">
                      <span>Due {new Date(task.dueDate).toLocaleDateString()}</span>
                      <span className="text-slate-700">•</span>
                      <span className={cn(
                        task.impact === "critical" ? "text-red-400" : 
                        task.impact === "high" ? "text-orange-400" : "text-slate-500"
                      )}>{task.impact} Impact</span>
                    </div>
                  </div>
                </div>
                
                {isOverdue ? (
                  <div className="flex items-center gap-2 self-end md:self-auto pl-12 md:pl-0">
                    <span className="text-xs text-red-400 font-medium mr-2 hidden sm:inline">Did you complete this?</span>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleResolve(task.id, 'completed')}
                      className="h-8 w-8 p-0 border-emerald-500/20 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300"
                      title="Yes, completed"
                    >
                      <Check className="size-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleResolve(task.id, 'not_completed')}
                      className="h-8 w-8 p-0 border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300"
                      title="No, not completed"
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="text-right pl-12 md:pl-0 self-end md:self-auto">
                    <p className={cn(
                      "text-xs font-medium font-mono",
                      delay ? "text-red-400" : "text-slate-500"
                    )}>
                      {delay ? `+${delay}` : "On Track"}
                    </p>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
