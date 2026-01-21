'use client'

import useColorStore from '@/hooks/use-color-store'
import { useTheme } from 'next-themes'
import React from 'react'
import { PieChart, Pie, ResponsiveContainer, Cell } from 'recharts'

export default function SalesCategoryPieChart({ data }: { data: any[] }) {
  const { theme } = useTheme()
  const { cssColors } = useColorStore(theme)

  console.log('Pie chart data:', data)
  console.log('Data length:', data?.length)
  console.log('Data sample:', data?.[0])

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[400px] text-muted-foreground">
        No category data available for the selected period
      </div>
    )
  }

  const RADIAN = Math.PI / 180
  
  // Calculate total for percentage calculation
  const total = data.reduce((sum, entry) => sum + (entry.totalSales || 0), 0)
  console.log('Total sales for percentage:', total)
  
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    index,
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)
    
    const percentage = ((data[index].totalSales / total) * 100).toFixed(1)

    return (
      <>
        <text
          x={x}
          y={y}
          textAnchor={x > cx ? 'start' : 'end'}
          dominantBaseline='central'
          className='text-xs'
        >
          {`${data[index]._id}: ${percentage}%`}
        </text>
      </>
    )
  }

  // Different colors for pie slices
  const COLORS = [
    `hsl(${cssColors['--primary']})`,
    `hsl(${cssColors['--chart-1'] || 'hsl(47.1, 95.8%, 53.1%)'})`,
    `hsl(${cssColors['--chart-2'] || 'hsl(142.1, 76.2%, 36.3%)'})`,
    `hsl(${cssColors['--chart-3'] || 'hsl(210, 100%, 57.8%)'})`,
    `hsl(${cssColors['--chart-4'] || 'hsl(342.9, 89.2%, 55.5%)'})`,
  ]

  console.log('Rendering pie chart with data:', data)

  return (
    <ResponsiveContainer width='100%' height={400}>
      <PieChart width={400} height={400}>
        <Pie
          data={data}
          dataKey='totalSales'
          cx='50%'
          cy='50%'
          labelLine={false}
          label={renderCustomizedLabel}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  )
}