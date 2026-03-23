"use client";

import React, { useContext } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AppContext } from "@/components/providers/app-provider";
import { 
  Building2, 
  Users, 
  CheckCircle, 
  DollarSign, 
  Activity,
  ArrowUpRight
} from "lucide-react";
import { Loader2 } from "lucide-react";

export default function SuperAdminDashboard() {
  const { member } = useContext(AppContext);
  const metrics = useQuery(api.admin.getGlobalMetrics);

  if (metrics === undefined) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const stats = [
    {
      label: "Total Revenue",
      value: `$${metrics.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      label: "Active Companies",
      value: metrics.activeCompanies.toString(),
      icon: Building2,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      label: "Total Verifications",
      value: metrics.totalVerifications.toString(),
      icon: CheckCircle,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      label: "Verifications Today",
      value: metrics.verificationsToday.toString(),
      icon: Activity,
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
  ];

  return (
    <div className="p-4 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Super Admin Overview
        </h1>
        <p className="text-gray-500 mt-2">
          Welcome back, {member?.first_name || "Admin"}. Here&apos;s what&apos;s happening across TrustCert.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 rounded-full ${stat.bg} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="flex items-center text-green-600 text-sm font-medium">
                  <span className="flex items-center">
                    +12% <ArrowUpRight className="w-4 h-4 ml-1" />
                  </span>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
                <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-[400px] flex items-center justify-center">
             <div className="text-center">
                <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900">Revenue Analytics</h3>
                <p className="text-sm text-gray-500">Chart rendering coming soon...</p>
             </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-[400px] flex items-center justify-center">
             <div className="text-center">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900">User Growth</h3>
                <p className="text-sm text-gray-500">Chart rendering coming soon...</p>
             </div>
        </div>
      </div>
    </div>
  );
}
