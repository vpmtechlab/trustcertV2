"use client";

import React from "react";
import { TrendingUp, CheckCircle, Clock, Activity, LucideIcon } from "lucide-react";

interface StatsCardsProps {
  data: {
    totalJobs: number;
    approvedJobs: number;
    passRate: string;
    avgTime: string;
  };
}

interface StatItem {
  label: string;
  value: string | number;
  change: string;
  trend: "up" | "down";
  icon: LucideIcon;
  color: "blue" | "green" | "purple" | "orange";
}

export function StatsCards({ data }: StatsCardsProps) {
  const stats: StatItem[] = [
    {
      label: "Total Verifications",
      value: data.totalJobs,
      change: "+12.5%",
      trend: "up",
      icon: Activity,
      color: "blue",
    },
    {
      label: "Success Rate",
      value: data.passRate,
      change: "+2.1%",
      trend: "up",
      icon: CheckCircle,
      color: "green",
    },
    {
      label: "Avg. Processing Time",
      value: data.avgTime,
      change: "-0.2s",
      trend: "up", // up meaning improvement here
      icon: Clock,
      color: "purple",
    },
    {
      label: "Approved Requests",
      value: data.approvedJobs,
      change: "+5.4%",
      trend: "up",
      icon: Activity,
      color: "orange",
    },
  ];

  const colorClasses = {
    blue: { bg: "bg-blue-50", icon: "text-blue-600", accent: "bg-blue-500" },
    green: { bg: "bg-green-50", icon: "text-green-600", accent: "bg-green-500" },
    purple: { bg: "bg-purple-50", icon: "text-purple-600", accent: "bg-purple-500" },
    orange: { bg: "bg-orange-50", icon: "text-orange-600", accent: "bg-orange-500" },
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
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

                {/* Change indicator */}
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp size={14} className="text-green-500" />
                  <span className="text-xs font-medium text-green-600">
                    {stat.change}
                  </span>
                  <span className="text-xs text-gray-400">vs last period</span>
                </div>
              </div>

              <div className={`p-3 rounded-xl ${colors.bg}`}>
                <Icon size={22} className={colors.icon} />
              </div>
            </div>

            <div className="absolute bottom-0 right-0 opacity-10 group-hover:opacity-20 transition-opacity">
              <svg width="80" height="40" viewBox="0 0 80 40">
                <path d="M0 35 Q20 20, 40 25 T80 10" stroke="currentColor" strokeWidth="2" fill="none" className={colors.icon} />
              </svg>
            </div>
          </div>
        );
      })}
    </div>
  );
}
