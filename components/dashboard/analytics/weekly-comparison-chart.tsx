"use client";

import React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { day: "Mon", thisWeek: 320, lastWeek: 280 },
  { day: "Tue", thisWeek: 450, lastWeek: 390 },
  { day: "Wed", thisWeek: 380, lastWeek: 420 },
  { day: "Thu", thisWeek: 520, lastWeek: 350 },
  { day: "Fri", thisWeek: 610, lastWeek: 480 },
  { day: "Sat", thisWeek: 290, lastWeek: 310 },
  { day: "Sun", thisWeek: 180, lastWeek: 200 },
];

const chartConfig = {
  thisWeek: {
    label: "This Week",
    color: "hsl(var(--primary))",
  },
  lastWeek: {
    label: "Last Week",
    color: "hsl(var(--muted-foreground))",
  },
} satisfies ChartConfig;

export function WeeklyComparisonChart() {
  const thisWeekTotal = chartData.reduce((sum, d) => sum + d.thisWeek, 0);
  const lastWeekTotal = chartData.reduce((sum, d) => sum + d.lastWeek, 0);
  const percentChange = (((thisWeekTotal - lastWeekTotal) / lastWeekTotal) * 100).toFixed(1);

  const isPositive = parseFloat(percentChange) >= 0;

  return (
    <div className="w-full bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mt-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Weekly Comparison</h3>
          <p className="text-sm text-gray-500">This week vs last week performance</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
            <span className="text-xs font-medium text-gray-600">
              This Week: {thisWeekTotal.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-gray-300"></span>
            <span className="text-xs font-medium text-gray-600">
              Last Week: {lastWeekTotal.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
            isPositive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
          }`}
        >
          {isPositive ? "↑" : "↓"} {Math.abs(parseFloat(percentChange))}% vs last week
        </span>
      </div>

      <div className="h-[250px] w-full">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="fillThisWeek" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-thisWeek)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-thisWeek)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="fillLastWeek" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-lastWeek)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="var(--color-lastWeek)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis 
                dataKey="day" 
                tickLine={false} 
                axisLine={false} 
                tick={{ fill: '#9ca3af', fontSize: 10 }}
                dy={10} 
              />
              <YAxis hide />
              <ChartTooltip 
                cursor={{ stroke: '#e5e7eb', strokeWidth: 1 }} 
                content={<ChartTooltipContent />} 
              />
              <Area
                type="monotone"
                dataKey="lastWeek"
                stroke="var(--color-lastWeek)"
                fillOpacity={1}
                fill="url(#fillLastWeek)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="thisWeek"
                stroke="var(--color-thisWeek)"
                fillOpacity={1}
                fill="url(#fillThisWeek)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
}
