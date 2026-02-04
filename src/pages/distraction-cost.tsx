import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { 
  DollarSign, 
  Clock, 
  TrendingUp, 
  Briefcase,
  AlertTriangle,
  Loader2
} from "lucide-react"
import { useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"
import { useI18n } from "@/hooks/use-i18n"

export default function DistractionCostPage() {
  const { t } = useI18n()
  const [hourlyRate, setHourlyRate] = useState(120)
  const [teamSize, setTeamSize] = useState(1)
  
  const costData = useQuery(api.analytics.getDistractionCost, { hourlyRate });

  if (!costData) {
    return (
      <DashboardLayout>
        <div className="flex h-[calc(100vh-100px)] w-full items-center justify-center">
          <div className="flex flex-col items-center gap-4 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p>Loading calculator...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const { 
    totalDistractionMinutes, 
    dailyCost, 
    annualProjection, 
    contextSwitches 
  } = costData;

  // Apply team size multiplier
  const totalDailyCost = dailyCost * teamSize;
  const totalAnnualProjection = annualProjection * teamSize;
  
  const hasData = totalDistractionMinutes > 0;

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8 p-8 max-w-[1600px] mx-auto animate-in fade-in duration-500">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              {t('distractionCost')}
            </h1>
            <p className="text-muted-foreground mt-1 text-lg">
              {t('visualizeImpact')}
            </p>
          </div>
        </div>

        {!hasData ? (
           <div className="flex flex-col items-center justify-center py-20 bg-muted/20 rounded-xl border border-dashed">
             <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
             <h3 className="text-xl font-semibold">{t('noDistractionData')}</h3>
             <p className="text-muted-foreground max-w-md text-center mt-2">
               {t('logDistractions')}
             </p>
           </div>
        ) : (
          <>
            {/* Main Ticker & Controls */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Cost Card */}
              <Card className="lg:col-span-2 border-none shadow-xl bg-gradient-to-br from-card to-card/50 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-32 bg-red-500/5 blur-[100px] rounded-full pointer-events-none" />
                
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-muted-foreground font-medium text-sm uppercase tracking-wider">
                    <DollarSign className="h-4 w-4" />
                    {t('estimatedDailyLoss')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <div className="text-7xl md:text-9xl font-bold tracking-tighter font-mono tabular-nums text-foreground">
                    ${totalDailyCost.toFixed(2)}
                  </div>
                  <p className="text-muted-foreground mt-4 flex items-center gap-2">
                    <span className="text-red-500 font-medium flex items-center">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      ${totalAnnualProjection.toLocaleString()}
                    </span>
                    {t('projectedAnnualLoss').replace('{count}', teamSize.toString())}
                  </p>
                </CardContent>
              </Card>

              {/* Settings Panel */}
              <Card className="border-none shadow-md">
                <CardHeader>
                  <CardTitle>{t('configuration')}</CardTitle>
                  <CardDescription>{t('adjustParams')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Label>{t('hourlyRate')}</Label>
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
                      <Label>{t('teamSize')}</Label>
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
                        {t('includeOverhead')}
                      </Label>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        {t('contextSwitchPenalty')}
                      </Label>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                   <p className="text-xs text-muted-foreground text-center w-full">
                     {t('calculationsBasedOn')}
                   </p>
                </CardFooter>
              </Card>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <Card className="border-none shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{t('contextSwitches')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{contextSwitches}</div>
                  <p className="text-xs text-muted-foreground mt-1">{t('detectedInterruptions')}</p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{t('distractionTime')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{Math.round(totalDistractionMinutes)}m</div>
                  <p className="text-xs text-muted-foreground mt-1">{t('totalTimeLost')}</p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md">
                 <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{t('avgDailyLoss')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-500">${totalDailyCost.toFixed(0)}</div>
                  <p className="text-xs text-muted-foreground mt-1">{t('perDayCost').replace('${rate}', hourlyRate.toString())}</p>
                </CardContent>
              </Card>

            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
