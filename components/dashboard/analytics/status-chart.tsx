"use client";

import React, { useContext } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AppContext } from "@/components/providers/app-provider";
import { Id } from "@/convex/_generated/dataModel";

interface StatusData {
  name: string;
  value: number;
  fill: string;
}

export function StatusChart() {
  const { member } = useContext(AppContext);
  const chartData = useQuery(api.analytics.getStatusBreakdown, 
    member?.companyId ? { companyId: member.companyId as Id<"companies"> } : "skip"
  ) as StatusData[] | undefined;

  const total = chartData?.reduce((acc: number, curr: StatusData) => acc + curr.value, 0) || 0;

  let currentAngle = 0;
  const gradientSegments = chartData?.map((item: StatusData) => {
    const start = currentAngle;
    const degrees = total > 0 ? (item.value / total) * 360 : 0;
    currentAngle += degrees;
    return `${item.fill} ${start}deg ${currentAngle}deg`;
  }) || [];

  const backgroundStyle = total > 0 
    ? `conic-gradient(${gradientSegments.join(", ")})` 
    : "#f3f4f6";

  return (
    <div className="w-full bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col h-full">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Status Distribution</h3>

      <div className="flex-1 flex flex-col md:flex-row lg:flex-col items-center justify-center gap-8">
        {/* The Donut Chart */}
        <div
          className="relative w-48 h-48 rounded-full flex items-center justify-center shadow-inner transition-all duration-500"
          style={{ background: backgroundStyle }}
        >
          <div className="w-32 h-32 bg-white rounded-full flex flex-col items-center justify-center shadow-sm">
            <span className="text-3xl font-bold text-gray-800">
              {chartData ? total : "..."}
            </span>
            <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Total</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-3 w-full max-w-[200px]">
          {chartData ? (
            chartData.map((item: StatusData, index: number) => (
              <div key={index} className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: item.fill }}
                />
                <div className="flex items-center justify-between w-full">
                  <span className="text-sm font-medium text-gray-700">{item.name}</span>
                  <span className="text-sm font-bold text-gray-600">
                    {total > 0 ? ((item.value / total) * 100).toFixed(0) : 0}%
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-400 text-sm py-4">Loading stats...</div>
          )}
        </div>
      </div>
    </div>
  );
}


