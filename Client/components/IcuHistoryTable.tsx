import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
    import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function IcuHistoryTable(icuHistories: any[]) {
    return <Card>
      <CardHeader>
        <CardTitle>ICU History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Total Beds</TableHead>
              <TableHead>ICU Beds</TableHead>
              <TableHead>Available ICU</TableHead>
              <TableHead>Non-functional</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {icuHistories.map((history) => (
              <TableRow key={history.id}>
                <TableCell>{new Date(history.date).toLocaleDateString()}</TableCell>
                <TableCell>{history.totalBeds}</TableCell>
                <TableCell>{history.icuBeds}</TableCell>
                <TableCell>{history.availableIcuBeds}</TableCell>
                <TableCell>{history.nonFunctionalBeds}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  }
  