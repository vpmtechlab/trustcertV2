"use client";

import React, { useState } from "react";
import { Download, FileText, Calendar, Filter } from "lucide-react";
import { toast } from "sonner";
import { MetricsGrid } from "@/components/dashboard/reports/metrics-grid";
import { ChartsSection } from "@/components/dashboard/reports/charts-section";
import { CustomReportGenerator } from "@/components/dashboard/reports/custom-report-generator";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const reports = [
  { id: 1, name: "January 2025 Compliance Summary", date: "Jan 31, 2025", type: "Monthly" },
  { id: 2, name: "December 2024 Compliance Summary", date: "Dec 31, 2024", type: "Monthly" },
  { id: 3, name: "2024 Annual Verification Report", date: "Dec 31, 2024", type: "Annual" },
  { id: 4, name: "Q4 2024 Audit Log", date: "Jan 15, 2025", type: "Quarterly" },
];

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState("30");
  const [downloading, setDownloading] = useState(false);

  // 1. Get the company context
  const company = useQuery(api.companies.getDefaultCompany);
  
  // 2. Fetch analytics based on date range
  const analytics = useQuery(api.analytics.getDashboardAnalytics, 
    company?._id ? { companyId: company._id, days: parseInt(dateRange) || undefined } : "skip"
  );

  const handleDownload = (reportName: string) => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      toast.success(`Downloading ${reportName}...`);
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-8 p-6 max-w-[1600px] mx-auto">
      {/* Reports Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Reports & Analytics</h1>
          <p className="text-gray-500 text-sm mt-1.5 flex items-center gap-2">
            <Calendar size={14} className="text-primary" />
            Performance insights and compliance tracking for your organization.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-1.5 shadow-xs">
            <Filter size={14} className="text-gray-400" />
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Range:</span>
            <Select value={dateRange} onValueChange={(val) => setDateRange(val ?? "30")}>
              <SelectTrigger className="border-none bg-transparent h-7 font-bold text-gray-900 focus:ring-0">
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 Days</SelectItem>
                <SelectItem value="30">Last 30 Days</SelectItem>
                <SelectItem value="90">Last 90 Days</SelectItem>
                <SelectItem value="0">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={() => handleDownload("Full Data Export")}
            disabled={downloading}
            className="bg-primary space-x-2 text-white hover:bg-[#146c11] px-5 shadow-sm"
          >
            <Download size={18} />
            <span>{downloading ? "Exporting..." : "Export All"}</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Main Dashboard Content */}
        <div className="xl:col-span-3 space-y-8">
          <MetricsGrid analytics={analytics} />
          <ChartsSection analytics={analytics} />
          
          <div className="bg-linear-to-br from-white to-gray-50/50 p-1 rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
            <CustomReportGenerator />
          </div>
        </div>

        {/* Sidebar: Recent Exports */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <FileText size={18} className="text-primary" />
                Recent Exports
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 bg-gray-50 px-2 py-1 rounded">
                PDF / CSV
              </span>
            </div>
            
            <div className="space-y-4">
              {reports.map((report) => (
                <div 
                  key={report.id} 
                  className="group p-4 bg-gray-50/50 hover:bg-white hover:shadow-lg hover:border-primary/20 border border-transparent rounded-2xl transition-all duration-300 cursor-pointer"
                  onClick={() => handleDownload(report.name)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-sm font-bold text-gray-800 line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                      {report.name}
                    </p>
                    <Download size={14} className="text-gray-300 group-hover:text-primary shrink-0 transition-colors" />
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                    <span>{report.date}</span>
                    <span className="px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded">{report.type}</span>
                  </div>
                </div>
              ))}
            </div>

            <Button variant="ghost" className="w-full text-xs text-primary font-bold hover:bg-primary/5 rounded-xl">
              View All History →
            </Button>
          </div>

          <div className="bg-linear-to-br from-primary/10 to-secondary/10 p-6 rounded-3xl border border-primary/5 text-center space-y-3">
             <h4 className="font-bold text-gray-900">Need Custom Data?</h4>
             <p className="text-xs text-gray-600 leading-relaxed">Use our generator to create filtered reports for audits or internal reviews.</p>
             <Button variant="outline" className="w-full h-9 text-xs font-bold border-primary/20 hover:bg-white/50">Open Generator</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
