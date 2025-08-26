"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

interface UserResponse {
  alimento: string
  categoria: string
  frecuencia: string
  observaciones: string
}

interface UserAnalysisTableProps {
  data: UserResponse[]
  dni: string
}

export function UserAnalysisTable({ data, dni }: UserAnalysisTableProps) {
  // Prepare data for mini chart
  const frequencyData = data.reduce(
    (acc, item) => {
      const existing = acc.find((freq) => freq.name === item.frecuencia)
      if (existing) {
        existing.value += 1
      } else {
        acc.push({ name: item.frecuencia, value: 1 })
      }
      return acc
    },
    [] as { name: string; value: number }[],
  )

  const colors = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))"]

  const getFrequencyColor = (frequency: string) => {
    switch (frequency.toLowerCase()) {
      case "daily":
        return "bg-chart-1 text-white"
      case "weekly":
        return "bg-chart-2 text-white"
      case "monthly":
        return "bg-chart-4 text-white"
      case "never":
        return "bg-chart-3 text-white"
      default:
        return "bg-secondary text-secondary-foreground"
    }
  }

  return (
    <div className="space-y-6">
      {/* User Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">User Summary</CardTitle>
            <CardDescription>DNI: {dni}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Responses:</span>
                <span className="font-semibold">{data.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Categories:</span>
                <span className="font-semibold">{[...new Set(data.map((item) => item.categoria))].length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Most Common Frequency:</span>
                <Badge
                  className={getFrequencyColor(frequencyData.sort((a, b) => b.value - a.value)[0]?.name || "Unknown")}
                >
                  {frequencyData.sort((a, b) => b.value - a.value)[0]?.name || "Unknown"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Frequency Distribution</CardTitle>
            <CardDescription>User's consumption patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={frequencyData}
                    cx="50%"
                    cy="50%"
                    innerRadius={20}
                    outerRadius={50}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {frequencyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px",
                      color: "hsl(var(--card-foreground))",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Detailed Responses</CardTitle>
          <CardDescription>Complete list of user's food consumption data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Food Item</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Observations</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.alimento}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.categoria}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getFrequencyColor(item.frecuencia)}>{item.frecuencia}</Badge>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate" title={item.observaciones}>
                        {item.observaciones || "No observations"}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
