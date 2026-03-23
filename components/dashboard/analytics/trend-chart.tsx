"use client";

import React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { label: "Jan", volume: 650 },
  { label: "Feb", volume: 900 },
  { label: "Mar", volume: 850 },
  { label: "Apr", volume: 1200 },
  { label: "May", volume: 1100 },
  { label: "Jun", volume: 1400 },
  { label: "Jul", volume: 1600 },
  { label: "Aug", volume: 1350 },
  { label: "Sep", volume: 1700 },
  { label: "Oct", volume: 1850 },
  { label: "Nov", volume: 2100 },
  { label: "Dec", volume: 2400 },
];

const chartConfig = {
  volume: {
    label: "Volume",
    color: "hsl(var(--secondary))",
  },
} satisfies ChartConfig;

export function TrendChart() {
  return (
    <div className="w-full bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Verification Trends</h3>
          <p className="text-sm text-gray-500">Monthly verification volume (2025)</p>
        </div>
        <div className="flex gap-2">
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <span className="w-2 h-2 rounded-full bg-secondary"></span>
            Volume
          </span>
        </div>
      </div>

      <div className="h-[250px] w-full">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis 
                dataKey="label" 
                tickLine={false} 
                axisLine={false} 
                tick={{ fill: '#9ca3af', fontSize: 10 }} 
                dy={10} 
              />
              <YAxis 
                hide 
              />
              <ChartTooltip 
                cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                content={<ChartTooltipContent hideLabel />} 
              />
              <Bar 
                dataKey="volume" 
                fill="var(--color-volume)" 
                radius={[4, 4, 0, 0]} 
                barSize={30}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
}
