import React from "react";
import { TrendingUp, TrendingDown, CheckCircle, Clock, Users, Activity } from "lucide-react";

export function StatsCards() {
  const stats = [
    {
      label: "Total Verifications",
      value: "15,847",
      change: "+12.5%",
      trend: "up" as const,
      icon: Activity,
      color: "blue" as const,
    },
    {
      label: "Success Rate",
      value: "94.2%",
      change: "+2.1%",
      trend: "up" as const,
      icon: CheckCircle,
      color: "green" as const,
    },
    {
      label: "Avg. Processing Time",
      value: "1.8s",
      change: "-0.3s",
      trend: "up" as const,
      icon: Clock,
      color: "purple" as const,
    },
    {
      label: "Active Users",
      value: "342",
      change: "+28",
      trend: "up" as const,
      icon: Users,
      color: "orange" as const,
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
    purple: {
      bg: "bg-purple-50",
      icon: "text-purple-600",
      accent: "bg-purple-500",
    },
    orange: {
      bg: "bg-orange-50",
      icon: "text-orange-600",
      accent: "bg-orange-500",
    },
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
                  {stat.trend === "up" ? (
                    <TrendingUp size={14} className="text-green-500" />
                  ) : (
                    <TrendingDown size={14} className="text-red-500" />
                  )}
                  <span
                    className={`text-xs font-medium ${
                      stat.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {stat.change}
                  </span>
                  <span className="text-xs text-gray-400">vs last month</span>
                </div>
              </div>

              {/* Icon */}
              <div className={`p-3 rounded-xl ${colors.bg}`}>
                <Icon size={22} className={colors.icon} />
              </div>
            </div>

            {/* Mini sparkline (decorative) */}
            <div className="absolute bottom-0 right-0 opacity-10 group-hover:opacity-20 transition-opacity">
              <svg width="80" height="40" viewBox="0 0 80 40">
                <path
                  d="M0 35 Q20 20, 40 25 T80 10"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  className={colors.icon}
                />
              </svg>
            </div>
          </div>
        );
      })}
    </div>
  );
}
