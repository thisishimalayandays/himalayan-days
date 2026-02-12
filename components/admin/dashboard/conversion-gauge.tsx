"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Label } from "recharts"

export function ConversionGauge({
    value
}: {
    value: number
}) {
    // Value is percentage 0-100
    // Create data for "progress" and "remaining"
    const data = [
        { name: 'Converted', value: value },
        { name: 'Remaining', value: 100 - value }
    ];

    // Choose color based on conversion rate
    let color = '#ef4444'; // Red < 10%
    if (value >= 10) color = '#eab308'; // Yellow >= 10%
    if (value >= 20) color = '#22c55e'; // Green >= 20%

    const CX = "50%";
    const CY = "50%";
    const iR = 60;
    const oR = 80;

    return (
        <ResponsiveContainer width="100%" height={200}>
            <PieChart>
                <Pie
                    dataKey="value"
                    startAngle={180}
                    endAngle={0}
                    data={data}
                    cx={CX}
                    cy={CY}
                    innerRadius={iR}
                    outerRadius={oR}
                    fill="#8884d8"
                    stroke="none"
                >
                    <Cell fill={color} />
                    <Cell fill="#e5e7eb" />
                </Pie>
                <text
                    x={CX}
                    y={CY}
                    dy={-5}
                    textAnchor="middle"
                    fill="#333"
                    className="text-3xl font-bold fill-foreground"
                >
                    {value}%
                </text>
                <text
                    x={CX}
                    y={CY}
                    dy={20}
                    textAnchor="middle"
                    className="text-xs fill-muted-foreground uppercase"
                >
                    Conversion Rate
                </text>
            </PieChart>
        </ResponsiveContainer>
    )
}
