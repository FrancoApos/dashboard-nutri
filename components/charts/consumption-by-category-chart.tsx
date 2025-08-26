"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"

interface ConsumptionByCategory {
  categoria: string
  frecuencia: string
  total: number
}

interface ConsumptionByCategoryChartProps {
  data: ConsumptionByCategory[]
}

export function ConsumptionByCategoryChart({ data }: ConsumptionByCategoryChartProps) {
  // Aggregate data by category
  const categoryTotals = data.reduce(
    (acc, item) => {
      const existing = acc.find((cat) => cat.categoria === item.categoria)

      if (existing) {
        existing.total += item.total
      } else {
        acc.push({
          categoria: item.categoria,
          total: item.total,
        })
      }

      return acc
    },
    [] as { categoria: string; total: number }[],
  )

  // Sort by total and calculate percentages
  const sortedData = categoryTotals
    .sort((a, b) => b.total - a.total)
    .map((item) => ({
      name: item.categoria,
      value: item.total,
      percentage: ((item.total / categoryTotals.reduce((sum, cat) => sum + cat.total, 0)) * 100).toFixed(1),
    }))

  const colors = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
  ]

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percentage }: any) => {
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${percentage}%`}
      </text>
    )
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={sortedData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {sortedData.map((entry, index) => (
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
            formatter={(value, name) => [`${value} responses`, "Total"]}
          />
          <Legend verticalAlign="bottom" height={36} formatter={(value) => `${value}`} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
