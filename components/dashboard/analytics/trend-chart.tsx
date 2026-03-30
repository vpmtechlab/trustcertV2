"use client";

import React, { useContext } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AppContext } from "@/components/providers/app-provider";
import { Id } from "@/convex/_generated/dataModel";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  volume: {
    label: "Volume",
    color: "hsl(var(--secondary))",
  },
} satisfies ChartConfig;

export function TrendChart() {
  const { member } = useContext(AppContext);
  const chartData = useQuery(api.analytics.getTrendData, 
    member?.companyId ? { companyId: member.companyId as Id<"companies"> } : "skip"
  );

  return (
    <div className="w-full bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Verification Trends</h3>
          <p className="text-sm text-gray-500">Monthly verification volume ({new Date().getFullYear()})</p>
        </div>

        <div className="flex gap-2">
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <span className="w-2 h-2 rounded-full bg-secondary"></span>
            Volume
          </span>
        </div>
      </div>

      <div className="h-[250px] w-full">
        {chartData ? (
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
        ) : (
          <div className="h-full w-full flex items-center justify-center text-gray-400 text-sm">
            Loading trend data...
          </div>
        )}
      </div>
    </div>
  );
}

