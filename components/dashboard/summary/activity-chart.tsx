"use client";

import React from "react";

export function ActivityChart() {
  // Mock data for the last 7 days
  const data = [
    { day: "Mon", value: 45 },
    { day: "Tue", value: 60 },
    { day: "Wed", value: 35 },
    { day: "Thu", value: 80 },
    { day: "Fri", value: 65 },
    { day: "Sat", value: 20 },
    { day: "Sun", value: 15 },
  ];

  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <div className="flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">
            Verification Activity
          </h3>
          <p className="text-sm text-gray-500">Last 7 Days Usage</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 rounded-full bg-[#188015]" />
            <span>Completed</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-end justify-between gap-2 md:gap-4 h-64 mt-4">
        {data.map((item, index) => {
          // Calculate height percentage relative to max value
          // Ensure a minimum height for visibility
          const heightPercent = Math.max((item.value / maxValue) * 100, 5);

          return (
            <div
              key={index}
              className="flex flex-col items-center flex-1 gap-2 group"
            >
              {/* Tooltip / Value */}
              <div className="mb-1 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold text-primary">
                {item.value}
              </div>

              {/* Bar */}
              <div
                className="w-full max-w-[40px] rounded-t-lg bg-[#e8f5e9] hover:bg-[#188015] transition-all duration-300 relative group-hover:shadow-lg"
                style={{ height: `${heightPercent}%` }}
              />

              {/* Label */}
              <span className="text-xs font-medium text-gray-400 group-hover:text-gray-900 transition-colors">
                {item.day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
