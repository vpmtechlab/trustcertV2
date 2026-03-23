"use client";

import React from "react";
import { Download, FileText } from "lucide-react";
import { toast } from "sonner";
import { TrendChart } from "@/components/dashboard/analytics/trend-chart";
import { StatusChart } from "@/components/dashboard/analytics/status-chart";
import { StatsCards } from "@/components/dashboard/analytics/stats-cards";
import { WeeklyComparisonChart } from "@/components/dashboard/analytics/weekly-comparison-chart";
import { Button } from "@/components/ui/button";

export default function AnalyticsPage() {
  const handleExport = (type: string) => {
    toast.success(`Exporting Analytics as ${type}...`);
  };

  return (
    <div className="flex flex-col gap-6 p-5">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-500 mt-1">
            Insights into your verification performance and usage.
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => handleExport("CSV")}
            className="flex items-center gap-2 bg-white text-gray-700"
          >
            <FileText size={16} />
            Export CSV
          </Button>
          <Button
            onClick={() => handleExport("PDF")}
            className="flex items-center gap-2 bg-black text-white hover:bg-gray-800"
          >
            <Download size={16} />
            Download PDF
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Stats Cards */}
        <StatsCards />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            <TrendChart />
            <WeeklyComparisonChart />
          </div>

          {/* Side Column */}
          <div className="lg:col-span-1">
            <StatusChart />
          </div>
        </div>
      </div>
    </div>
  );
}
