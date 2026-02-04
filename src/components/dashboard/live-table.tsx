import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const stoppages = [
  {
    id: "STP-001",
    source: "Slack Notification",
    duration: "15m",
    impact: "High",
    status: "Resolved",
  },
  {
    id: "STP-002",
    source: "Context Switch",
    duration: "45m",
    impact: "Medium",
    status: "Active",
  },
  {
    id: "STP-003",
    source: "Email Check",
    duration: "10m",
    impact: "Low",
    status: "Resolved",
  },
  {
    id: "STP-004",
    source: "Meeting Overrun",
    duration: "30m",
    impact: "High",
    status: "Pending",
  },
  {
    id: "STP-005",
    source: "System Update",
    duration: "5m",
    impact: "Low",
    status: "Resolved",
  },
]

export function LiveTable() {
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
              <TableHead className="text-right h-10">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stoppages.map((item) => (
              <TableRow key={item.id} className="hover:bg-muted/50 border-b-border/50">
                <TableCell className="font-medium py-2">{item.source}</TableCell>
                <TableCell className="py-2">{item.duration}</TableCell>
                <TableCell className="py-2">
                    <Badge variant={item.impact === 'High' ? 'destructive' : item.impact === 'Medium' ? 'secondary' : 'outline'} className="font-normal text-[10px] px-2 py-0">
                        {item.impact}
                    </Badge>
                </TableCell>
                <TableCell className="text-right py-2">
                    <span className={cn("text-xs", item.status === 'Active' ? 'text-green-500 font-medium' : 'text-muted-foreground')}>
                        {item.status}
                    </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
