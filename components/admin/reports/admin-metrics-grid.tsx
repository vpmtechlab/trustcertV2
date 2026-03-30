"use client";

import React from "react";
import { TrendingUp, Users, FileText, DollarSign, Globe } from "lucide-react";

interface AdminMetricsGridProps {
  analytics: {
    metrics: {
      totalRevenue: number;
      totalVerifications: number;
      activeCompanies: number;
      successRate: number;
    };
  } | undefined;
}

export function AdminMetricsGrid({ analytics }: AdminMetricsGridProps) {
  const isLoading = analytics === undefined;
  
  const stats = [
    {
      label: "Platform Revenue",
      value: isLoading ? "--" : `$${analytics.metrics.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      trend: "Total Fees Collected",
      icon: <DollarSign className="text-emerald-600" size={24} />,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      label: "Total Verifications",
      value: isLoading ? "--" : analytics.metrics.totalVerifications.toLocaleString(),
      trend: "Global Transactions",
      icon: <FileText className="text-blue-600" size={24} />,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      label: "Active Clients",
      value: isLoading ? "--" : analytics.metrics.activeCompanies.toLocaleString(),
      trend: "Companies On-boarded",
      icon: <Users className="text-indigo-600" size={24} />,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50"
    },
    {
      label: "System Success",
      value: isLoading ? "--" : `${analytics.metrics.successRate}%`,
      trend: "Cross-Platform Avg",
      icon: <Globe className="text-sky-500" size={24} />,
      color: "text-sky-600",
      bgColor: "bg-sky-50"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, i) => (
        <div 
          key={i} 
          className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl hover:shadow-2xl hover:translate-y-[-4px] transition-all duration-300 flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between mb-4">
             <div className={`p-3 ${stat.bgColor} ${stat.color} rounded-2xl shadow-sm group-hover:scale-110 transition-transform`}>
                {stat.icon}
             </div>
             <div className="text-right">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Status</p>
                <div className="flex items-center gap-1 text-emerald-500 font-bold text-xs">
                   <TrendingUp size={12} /> Active
                </div>
             </div>
          </div>
          
          <div className="space-y-1">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">{stat.label}</p>
            <h3 className="text-3xl font-black text-gray-900 tracking-tighter tabular-nums truncate">
              {stat.value}
            </h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest py-1">
               {stat.trend}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
