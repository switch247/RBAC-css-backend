

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function IcuHistoryGraph(icuHistories: any[]) {
    return <Card>
      <CardHeader>
        <CardTitle>ICU Bed Availability History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <LineChart
            width={800}
            height={300}
            data={icuHistories}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="availableIcuBeds"
              stroke="#8884d8"
              name="Available ICU Beds" />
          </LineChart>
        </div>
      </CardContent>
    </Card>
  }
  