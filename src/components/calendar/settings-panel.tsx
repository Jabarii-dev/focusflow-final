import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

export interface CalendarSettings {
  workingHours: {
    start: number
    end: number
  }
  defaultDuration: number // in minutes
  showWeekends: boolean
  snapInterval: 15 | 30 | 60
  defaultColor: "blue" | "indigo" | "violet" | "emerald" | "rose"
}

interface SettingsPanelProps {
  settings: CalendarSettings
  onSettingsChange: (settings: CalendarSettings) => void
}

const colorPreviewMap: Record<string, string> = {
  blue: "bg-blue-500",
  indigo: "bg-indigo-500",
  violet: "bg-violet-500",
  emerald: "bg-emerald-500",
  rose: "bg-rose-500",
}

export function SettingsPanel({ settings, onSettingsChange }: SettingsPanelProps) {
  const hours = Array.from({ length: 24 }, (_, i) => i)

  const handleWorkingHoursChange = (type: 'start' | 'end', value: string) => {
    const numValue = parseInt(value, 10)
    const newSettings = { ...settings }
    
    if (type === 'start') {
      // Ensure start is before end
      if (numValue >= settings.workingHours.end) {
        return // Or show error
      }
      newSettings.workingHours.start = numValue
    } else {
      // Ensure end is after start
      if (numValue <= settings.workingHours.start) {
        return // Or show error
      }
      newSettings.workingHours.end = numValue
    }
    onSettingsChange(newSettings)
  }

  return (
    <div className="space-y-6 py-4">
      {/* Working Hours */}
      <div className="space-y-3">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Working Hours</Label>
        <div className="flex items-center gap-2">
          <div className="grid gap-1.5 flex-1">
            <Label className="text-xs text-muted-foreground/80">Start</Label>
            <Select 
              value={settings.workingHours.start.toString()} 
              onValueChange={(v) => handleWorkingHoursChange('start', v)}
            >
              <SelectTrigger className="bg-white/5 border-white/10 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#111] border-white/10 max-h-[200px]">
                {hours.map(h => (
                  <SelectItem key={`start-${h}`} value={h.toString()}>
                    {h === 0 ? '12 AM' : h < 12 ? `${h} AM` : h === 12 ? '12 PM' : `${h - 12} PM`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <span className="mt-6 text-muted-foreground">-</span>
          <div className="grid gap-1.5 flex-1">
            <Label className="text-xs text-muted-foreground/80">End</Label>
            <Select 
              value={settings.workingHours.end.toString()} 
              onValueChange={(v) => handleWorkingHoursChange('end', v)}
            >
              <SelectTrigger className="bg-white/5 border-white/10 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#111] border-white/10 max-h-[200px]">
                {hours.map(h => (
                  <SelectItem key={`end-${h}`} value={h.toString()}>
                    {h === 0 ? '12 AM' : h < 12 ? `${h} AM` : h === 12 ? '12 PM' : `${h - 12} PM`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Grid Settings */}
      <div className="space-y-3">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Grid & Snapping</Label>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-1.5">
            <Label className="text-xs text-muted-foreground/80">Snap Interval</Label>
            <Select 
              value={settings.snapInterval.toString()} 
              onValueChange={(v) => onSettingsChange({ ...settings, snapInterval: parseInt(v) as 15 | 30 | 60 })}
            >
              <SelectTrigger className="bg-white/5 border-white/10 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#111] border-white/10">
                <SelectItem value="15">15 Minutes</SelectItem>
                <SelectItem value="30">30 Minutes</SelectItem>
                <SelectItem value="60">60 Minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1.5">
            <Label className="text-xs text-muted-foreground/80">Weekends</Label>
            <div className="flex items-center justify-between h-9 px-3 rounded-md border border-white/10 bg-white/5">
              <span className="text-sm">Show Weekends</span>
              <Switch 
                checked={settings.showWeekends}
                onCheckedChange={(c) => onSettingsChange({ ...settings, showWeekends: c })}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Defaults */}
      <div className="space-y-3">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">New Block Defaults</Label>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-1.5">
            <Label className="text-xs text-muted-foreground/80">Default Duration</Label>
            <div className="relative">
              <Input 
                type="number" 
                min={15} 
                step={15}
                value={settings.defaultDuration}
                onChange={(e) => onSettingsChange({ ...settings, defaultDuration: parseInt(e.target.value) || 60 })}
                className="bg-white/5 border-white/10 text-sm pr-12"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">min</span>
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label className="text-xs text-muted-foreground/80">Default Color</Label>
            <Select 
              value={settings.defaultColor} 
              onValueChange={(v) => onSettingsChange({ ...settings, defaultColor: v as any })}
            >
              <SelectTrigger className="bg-white/5 border-white/10 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#111] border-white/10">
                {Object.keys(colorPreviewMap).map(c => (
                  <SelectItem key={c} value={c}>
                    <div className="flex items-center gap-2">
                       <div className={`w-3 h-3 rounded-full ${colorPreviewMap[c]}`} />
                       <span className="capitalize">{c}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  )
}
