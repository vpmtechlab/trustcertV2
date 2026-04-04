"use client";

import React from "react";
import { Briefcase, Activity, CheckCircle, AlertTriangle } from "lucide-react";

export interface JobStats {
  total: number;
  running: number;
  completed: number;
  failed: number;
}

interface JobStatsCardsProps {
  stats?: JobStats;
}

export function JobStatsCards({ stats }: JobStatsCardsProps) {
  const displayStats = [
    {
      label: "Total Jobs",
      value: stats?.total?.toLocaleString() ?? "0",
      change: "+0",
      trend: "up" as const,
      icon: Briefcase,
      color: "blue" as const,
    },
    {
      label: "Running",
      value: stats?.running?.toLocaleString() ?? "0",
      change: "+0",
      trend: "up" as const,
      icon: Activity,
      color: "orange" as const,
    },
    {
      label: "Completed",
      value: stats?.completed?.toLocaleString() ?? "0",
      change: "+0",
      trend: "up" as const,
      icon: CheckCircle,
      color: "green" as const,
    },
    {
      label: "Failed",
      value: stats?.failed?.toLocaleString() ?? "0",
      change: "+0",
      trend: "down" as const,
      icon: AlertTriangle,
      color: "red" as const,
    },
  ];

  const colorClasses = {
    blue: {
      bg: "bg-blue-50",
      icon: "text-blue-600",
      accent: "bg-blue-500",
    },
    orange: {
      bg: "bg-orange-50",
      icon: "text-orange-600",
      accent: "bg-orange-500",
    },
    green: {
      bg: "bg-green-50",
      icon: "text-green-600",
      accent: "bg-green-500",
    },
    red: {
      bg: "bg-red-50",
      icon: "text-red-600",
      accent: "bg-red-500",
    },
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {displayStats.map((stat, index) => {
        const Icon = stat.icon;
        const colors = colorClasses[stat.color];

        return (
          <div
            key={index}
            className="relative overflow-hidden bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow group"
          >
            {/* Accent bar */}
            <div className={`absolute top-0 left-0 w-full h-1 ${colors.accent}`} />

            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>

              {/* Icon */}
              <div className={`p-3 rounded-xl ${colors.bg}`}>
                <Icon size={22} className={colors.icon} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
