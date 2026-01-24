"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"

export function AnalyticsChart({
    data
}: {
    data: { date: string; count: number }[]
}) {
    return (
        <ResponsiveContainer width="100%" height={350}>
            <LineChart data={data}>
                <CustomCartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis
                    dataKey="date"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    minTickGap={30}
                />
                <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                    allowDecimals={false}
                />
                <Tooltip
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#ea580c" // Orange-600
                    strokeWidth={2}
                    activeDot={{ r: 6, fill: "#ea580c" }}
                    dot={false}
                />
            </LineChart>
        </ResponsiveContainer>
    )
}

// Helper to avoid TS Reference error if grid is imported directly sometimes
const CustomCartesianGrid = (props: any) => <CartesianGrid {...props} />;
