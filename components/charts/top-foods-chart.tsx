"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface TopFood {
  alimento: string
  total: number
}

interface TopFoodsChartProps {
  data: TopFood[]
}

export function TopFoodsChart({ data }: TopFoodsChartProps) {
  // Sort and take top 10 foods
  const sortedData = data
    .sort((a, b) => b.total - a.total)
    .slice(0, 10)
    .map((item) => ({
      ...item,
      name: item.alimento.length > 15 ? `${item.alimento.slice(0, 15)}...` : item.alimento,
    }))

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={sortedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="name"
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
            formatter={(value, name) => [value, "Total Responses"]}
            labelFormatter={(label) => {
              const originalItem = data.find((item) => item.alimento.startsWith(label.replace("...", "")))
              return originalItem?.alimento || label
            }}
          />
          <Bar dataKey="total" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
