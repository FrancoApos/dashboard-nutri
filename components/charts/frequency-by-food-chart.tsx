"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface FrequencyByFood {
  alimento: string
  frecuencia: string
  total: number
}

interface FrequencyByFoodChartProps {
  data: FrequencyByFood[]
}

export function FrequencyByFoodChart({ data }: FrequencyByFoodChartProps) {
  // Transform data for stacked bar chart
  const transformedData = data.reduce((acc, item) => {
    const existingFood = acc.find((food) => food.alimento === item.alimento)

    if (existingFood) {
      existingFood[item.frecuencia] = item.total
    } else {
      acc.push({
        alimento: item.alimento.length > 12 ? `${item.alimento.slice(0, 12)}...` : item.alimento,
        [item.frecuencia]: item.total,
        fullName: item.alimento,
      })
    }

    return acc
  }, [] as any[])

  // Take top 8 foods by total consumption
  const sortedData = transformedData
    .map((item) => ({
      ...item,
      total: (item.Never || 0) + (item.Monthly || 0) + (item.Weekly || 0) + (item.Daily || 0),
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 8)

  const frequencies = ["Never", "Monthly", "Weekly", "Daily"]
  const colors = ["hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-2))", "hsl(var(--chart-1))"]

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={sortedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="alimento"
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "6px",
              color: "hsl(var(--card-foreground))",
            }}
            labelFormatter={(label) => {
              const originalItem = sortedData.find((item) => item.alimento === label)
              return originalItem?.fullName || label
            }}
          />
          <Legend />
          {frequencies.map((freq, index) => (
            <Bar
              key={freq}
              dataKey={freq}
              stackId="frequency"
              fill={colors[index]}
              radius={index === frequencies.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
