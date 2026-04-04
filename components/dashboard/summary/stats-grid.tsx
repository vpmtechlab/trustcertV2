"use client";

import React, { useContext } from "react";
import { CheckCircle2, Clock, XCircle, FileCheck } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AppContext } from "@/components/providers/app-provider";
import { Id } from "@/convex/_generated/dataModel";

export function StatsGrid() {
  const { member } = useContext(AppContext);
  const statsData = useQuery(api.verifications.getJobStats, 
    member?.companyId ? { companyId: member.companyId as Id<"companies"> } : "skip"
  );

  const stats = [
    {
      label: "Total Verifications",
      value: statsData?.total?.toLocaleString() ?? "...",
      icon: FileCheck,
      color: "text-blue-500",
      bg: "bg-blue-50",
      trend: "All initiated checks",
    },
    {
      label: "Pending Checks",
      value: statsData?.running?.toLocaleString() ?? "...",
      icon: Clock,
      color: "text-orange-500",
      bg: "bg-orange-50",
      trend: "Requests in progress",
    },
    {
      label: "Completed",
      value: statsData?.completed?.toLocaleString() ?? "...",
      icon: CheckCircle2,
      color: "text-green-600",
      bg: "bg-green-50",
      trend: "Successful verifications",
    },
    {
      label: "Failed",
      value: statsData?.failed?.toLocaleString() ?? "...",
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
