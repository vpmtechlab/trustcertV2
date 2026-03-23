"use client";

import React from "react";
import { Users, UserCheck, UserPlus, Shield } from "lucide-react";

export function UserStatsCards() {
  const stats = [
    {
      label: "Total Users",
      value: "2,543",
      change: "+125",
      trend: "up" as const,
      icon: Users,
      color: "blue" as const,
    },
    {
      label: "Active Users",
      value: "2,100",
      change: "+89",
      trend: "up" as const,
      icon: UserCheck,
      color: "green" as const,
    },
    {
      label: "Pending Invites",
      value: "45",
      change: "-5",
      trend: "down" as const,
      icon: UserPlus,
      color: "orange" as const,
    },
    {
      label: "Admin Users",
      value: "12",
      change: "0",
      trend: "neutral" as const,
      icon: Shield,
      color: "purple" as const,
    },
  ];

  const colorClasses = {
    blue: {
      bg: "bg-blue-50",
      icon: "text-blue-600",
      accent: "bg-blue-500",
    },
    green: {
      bg: "bg-green-50",
      icon: "text-green-600",
      accent: "bg-green-500",
    },
    orange: {
      bg: "bg-orange-50",
      icon: "text-orange-600",
      accent: "bg-orange-500",
    },
    purple: {
      bg: "bg-purple-50",
      icon: "text-purple-600",
      accent: "bg-purple-500",
    },
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
