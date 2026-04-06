"use client";

import React, { useContext } from "react";
import { AppContext } from "@/components/providers/app-provider";
import { BalanceCard } from "@/components/dashboard/summary/balance-card";
import { StatsGrid } from "@/components/dashboard/summary/stats-grid";
import { ActivityChart } from "@/components/dashboard/summary/activity-chart";
import { QuickActions } from "@/components/dashboard/summary/quick-actions";
import { RecentAlerts } from "@/components/dashboard/summary/recent-alerts";

export default function DashboardHome() {
  const { member } = useContext(AppContext);
  const date = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex flex-col gap-6 p-2">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {member?.first_name || "User"} 👋
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Here&apos;s what&apos;s happening with your compliance status today, {date}.
        </p>
      </div>

      <div id="user-stats" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatsGrid />
        <BalanceCard />
      </div>

      {/* Middle Row: Quick Actions */}
      <div id="service-selector">
        <QuickActions />
      </div>

      {/* Bottom Row: Charts & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ActivityChart />
        </div>
        <div className="lg:col-span-1">
          <RecentAlerts />
        </div>
      </div>
    </div>
  );
}
