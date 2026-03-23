import React from "react";
import { CheckCircle2, Clock, XCircle, FileCheck } from "lucide-react";

export function StatsGrid() {
  const stats = [
    {
      label: "Total Verifications",
      value: "1,245",
      icon: FileCheck,
      color: "text-blue-500",
      bg: "bg-blue-50",
      trend: "+12% this month",
    },
    {
      label: "Pending Checks",
      value: "12",
      icon: Clock,
      color: "text-orange-500",
      bg: "bg-orange-50",
      trend: "Requests waiting",
    },
    {
      label: "Completed",
      value: "1,208",
      icon: CheckCircle2,
      color: "text-green-600",
      bg: "bg-green-50",
      trend: "98% Success rate",
    },
    {
      label: "Failed",
      value: "25",
      icon: XCircle,
      color: "text-red-500",
      bg: "bg-red-50",
      trend: "Action required",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:shadow-md"
        >
          <div className="flex items-start justify-between">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg} ${stat.color}`}
            >
              <stat.icon size={20} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
            <p className="mt-1 text-xs text-gray-400">{stat.trend}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
