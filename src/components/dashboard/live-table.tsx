import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useQuery } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { formatDistanceToNow } from "date-fns"

export function LiveTable() {
  const data = useQuery(api.analytics.getLiveStoppages)
  const isLoading = data === undefined

  return (
    <Card className="h-full border-none shadow-sm bg-card/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Live Work Stoppages</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b-border/50">
              <TableHead className="h-10">Source</TableHead>
              <TableHead className="h-10">Duration</TableHead>
              <TableHead className="h-10">Impact</TableHead>
              <TableHead className="text-right h-10">Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                  Loading live data...
                </TableCell>
              </TableRow>
            ) : data?.stoppages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                  No stoppages detected recently.
                </TableCell>
              </TableRow>
            ) : (
              data?.stoppages.map((item, i) => {
                const impactLabel = item.impactScore > 70 ? 'High' : item.impactScore > 30 ? 'Medium' : 'Low'
                return (
                  <TableRow key={i} className="hover:bg-muted/50 border-b-border/50">
                    <TableCell className="font-medium py-2">{item.label}</TableCell>
                    <TableCell className="py-2">{item.minutes}m</TableCell>
                    <TableCell className="py-2">
                        <Badge variant={impactLabel === 'High' ? 'destructive' : impactLabel === 'Medium' ? 'secondary' : 'outline'} className="font-normal text-[10px] px-2 py-0">
                            {impactLabel}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-right py-2">
                        <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(item.createdAt, { addSuffix: true })}
                        </span>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
