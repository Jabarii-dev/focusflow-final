import { Button } from "@/components/ui/button"
import { Play, Coffee, Youtube, Instagram, Plus } from "lucide-react"
import { useMutation } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { toast } from "react-hot-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { cn } from "@/lib/utils"

export function ActivityControls({ blockerEnabled }: { blockerEnabled?: boolean }) {
  const logEvent = useMutation(api.activity.logEvent)
  const [isCustomOpen, setIsCustomOpen] = useState(false)
  const [customType, setCustomType] = useState<"focus" | "distraction">("distraction")
  const [customLabel, setCustomLabel] = useState("")
  const [customMinutes, setCustomMinutes] = useState("15")

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
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
  )
}
