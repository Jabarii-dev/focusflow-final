import { Button } from "@/components/ui/button"
import { Play, Coffee, Youtube, Instagram, Plus, Pencil, Trash2, History } from "lucide-react"
import { useMutation, useQuery } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { toast } from "react-hot-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { cn } from "@/lib/utils"
import type { Id } from "../../../convex/_generated/dataModel"

export function ActivityControls({ blockerEnabled }: { blockerEnabled?: boolean }) {
  const logEvent = useMutation(api.activity.logEvent)
  const updateActivity = useMutation(api.activity.updateActivity)
  const deleteActivity = useMutation(api.activity.deleteActivity)
  const recentEvents = useQuery(api.activity.listEvents, { limit: 10 })

  const [isCustomOpen, setIsCustomOpen] = useState(false)
  const [customType, setCustomType] = useState<"focus" | "distraction">("distraction")
  const [customLabel, setCustomLabel] = useState("")
  const [customMinutes, setCustomMinutes] = useState("15")

  // Edit state
  const [editingEvent, setEditingEvent] = useState<{ id: Id<"activityEvents">, label: string, minutes: number } | null>(null)
  
  // Delete state
  const [deletingEventId, setDeletingEventId] = useState<Id<"activityEvents"> | null>(null)

  const handleLog = async (type: "focus" | "distraction", label: string, minutes: number) => {
    if (blockerEnabled && type === "distraction") {
      toast.error("Focus Blocker Active: Distraction blocked!", {
        icon: "🚫",
        style: {
          background: "#1e293b",
          color: "#fff",
          border: "1px solid #ef4444",
        }
      })
      return
    }

    try {
      await logEvent({ type, label, minutes })
      toast.success(`Logged ${label} (${minutes}m)`)
    } catch (error) {
      toast.error("Failed to log activity")
      console.error(error)
    }
  }

  const handleCustomLog = async () => {
    if (!customLabel || !customMinutes) {
      toast.error("Please fill in all fields")
      return
    }
    await handleLog(customType, customLabel, parseInt(customMinutes))
    if (!blockerEnabled || customType === "focus") {
      setIsCustomOpen(false)
      setCustomLabel("")
      setCustomMinutes("15")
    }
  }

  const handleUpdate = async () => {
    if (!editingEvent) return
    try {
      await updateActivity({ 
        id: editingEvent.id, 
        label: editingEvent.label, 
        minutes: editingEvent.minutes 
      })
      toast.success("Activity updated")
      setEditingEvent(null)
    } catch (error) {
      toast.error("Failed to update activity")
    }
  }

  const handleDelete = async () => {
    if (!deletingEventId) return
    try {
      await deleteActivity({ id: deletingEventId })
      toast.success("Activity deleted")
      setDeletingEventId(null)
    } catch (error) {
      toast.error("Failed to delete activity")
    }
  }

  return (
    <div className="space-y-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Button 
          onClick={() => handleLog("focus", "Deep Work", 25)}
          className="h-auto py-4 flex flex-col gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20"
          variant="outline"
        >
          <Play className="size-5" />
          <span className="font-medium">Focus Session (25m)</span>
        </Button>
        
        <Button 
          onClick={() => handleLog("distraction", "YouTube", 15)}
          className={cn(
            "h-auto py-4 flex flex-col gap-2 border transition-all duration-300",
            blockerEnabled 
              ? "bg-slate-800/50 text-slate-600 border-slate-800 cursor-not-allowed hover:bg-slate-800/50" 
              : "bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/20"
          )}
          variant="outline"
        >
          <Youtube className="size-5" />
          <span className="font-medium">YouTube (15m)</span>
        </Button>

        <Button 
          onClick={() => handleLog("distraction", "Instagram", 10)}
          className={cn(
            "h-auto py-4 flex flex-col gap-2 border transition-all duration-300",
            blockerEnabled 
              ? "bg-slate-800/50 text-slate-600 border-slate-800 cursor-not-allowed hover:bg-slate-800/50" 
              : "bg-pink-500/10 hover:bg-pink-500/20 text-pink-400 border-pink-500/20"
          )}
          variant="outline"
        >
          <Instagram className="size-5" />
          <span className="font-medium">Instagram (10m)</span>
        </Button>

        <Button 
          onClick={() => handleLog("distraction", "Break", 5)}
          className={cn(
            "h-auto py-4 flex flex-col gap-2 border transition-all duration-300",
            blockerEnabled 
              ? "bg-slate-800/50 text-slate-600 border-slate-800 cursor-not-allowed hover:bg-slate-800/50" 
              : "bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border-blue-500/20"
          )}
          variant="outline"
        >
          <Coffee className="size-5" />
          <span className="font-medium">Short Break (5m)</span>
        </Button>

        <Dialog open={isCustomOpen} onOpenChange={setIsCustomOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="h-auto py-4 flex flex-col gap-2 border-white/10 bg-white/5 hover:bg-white/10 text-slate-400 border-dashed">
              <Plus className="size-5" />
              <span className="font-medium">Custom Entry</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#0a0a0a] border-white/10 text-white sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Log Activity</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  variant={customType === "focus" ? "default" : "outline"}
                  onClick={() => setCustomType("focus")}
                  className={cn(
                    "border-white/10 hover:bg-white/10 hover:text-white",
                    customType === "focus" && "bg-emerald-600 hover:bg-emerald-700 text-white border-transparent"
                  )}
                >
                  Focus
                </Button>
                <Button 
                  variant={customType === "distraction" ? "default" : "outline"}
                  onClick={() => setCustomType("distraction")}
                  className={cn(
                    "border-white/10 hover:bg-white/10 hover:text-white",
                    customType === "distraction" && "bg-red-600 hover:bg-red-700 text-white border-transparent"
                  )}
                >
                  Distraction
                </Button>
              </div>
              <div className="space-y-2">
                <Input 
                  placeholder="Activity Label (e.g. Coding, Reddit)" 
                  value={customLabel}
                  onChange={(e) => setCustomLabel(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                />
              </div>
              <div className="space-y-2">
                <Input 
                  type="number" 
                  placeholder="Duration (minutes)" 
                  value={customMinutes}
                  onChange={(e) => setCustomMinutes(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                />
              </div>
              <Button onClick={handleCustomLog} className="w-full bg-white text-black hover:bg-slate-200">
                Log Activity
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
        <div className="flex items-center gap-2 mb-4 text-slate-400 text-sm font-medium uppercase tracking-wider">
          <History className="size-4" />
          Recent Activity
        </div>
        
        <div className="space-y-2">
          {recentEvents === undefined ? (
            <div className="text-slate-500 text-sm">Loading history...</div>
          ) : recentEvents.length === 0 ? (
            <div className="text-slate-500 text-sm">No recent activity</div>
          ) : (
            recentEvents.map(event => (
              <div key={event._id} className="group flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    event.type === "focus" ? "bg-emerald-500" : "bg-red-500"
                  )} />
                  <div>
                    <div className="text-sm font-medium text-slate-200">{event.label}</div>
                    <div className="text-xs text-slate-500">{event.minutes} minutes • {new Date(event.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-slate-400 hover:text-white"
                    onClick={() => setEditingEvent({ id: event._id, label: event.label, minutes: event.minutes })}
                  >
                    <Pencil className="size-3.5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-slate-400 hover:text-red-400"
                    onClick={() => setDeletingEventId(event._id)}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Dialog open={!!editingEvent} onOpenChange={(open) => !open && setEditingEvent(null)}>
        <DialogContent className="bg-[#0a0a0a] border-white/10 text-white sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Activity</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-xs text-slate-500 uppercase tracking-wider font-medium">Label</label>
              <Input 
                value={editingEvent?.label || ""}
                onChange={(e) => setEditingEvent(prev => prev ? { ...prev, label: e.target.value } : null)}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-slate-500 uppercase tracking-wider font-medium">Minutes</label>
              <Input 
                type="number"
                value={editingEvent?.minutes || 0}
                onChange={(e) => setEditingEvent(prev => prev ? { ...prev, minutes: parseInt(e.target.value) || 0 } : null)}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingEvent(null)} className="border-white/10 hover:bg-white/5 text-slate-300">Cancel</Button>
              <Button onClick={handleUpdate} className="bg-white text-black hover:bg-slate-200">Save Changes</Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletingEventId} onOpenChange={(open) => !open && setDeletingEventId(null)}>
        <AlertDialogContent className="bg-[#0a0a0a] border-white/10 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Activity?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              This action cannot be undone. This will permanently remove this entry from your stats.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-white/10 hover:bg-white/5 text-slate-300 hover:text-white">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600 text-white border-transparent">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
