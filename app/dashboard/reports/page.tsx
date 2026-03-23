"use client";

import React, { useState } from "react";
import { Download, FileText } from "lucide-react";
import { toast } from "sonner";
import { MetricsGrid } from "@/components/dashboard/reports/metrics-grid";
import { ChartsSection } from "@/components/dashboard/reports/charts-section";
import { CustomReportGenerator } from "@/components/dashboard/reports/custom-report-generator";
import { Button } from "@/components/ui/button";

const reports = [
  {
    id: 1,
    name: "January 2025 Compliance Summary",
    date: "Jan 31, 2025",
    type: "Monthly",
    status: "Available",
  },
  {
    id: 2,
    name: "December 2024 Compliance Summary",
    date: "Dec 31, 2024",
    type: "Monthly",
    status: "Available",
  },
  {
    id: 3,
    name: "2024 Annual Verification Report",
    date: "Dec 31, 2024",
    type: "Annual",
    status: "Available",
  },
  {
    id: 4,
    name: "Q4 2024 Audit Log",
    date: "Jan 15, 2025",
    type: "Quarterly",
    status: "Available",
  },
];

export default function ReportsPage() {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = (reportName: string) => {
    setDownloading(true);
    // Simulate download
    setTimeout(() => {
      setDownloading(false);
      toast.success(`Downloading ${reportName}...`);
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-6 p-5">
      {/* Reports Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-500 text-sm mt-1">
            Track your compliance performance and download summary reports.
          </p>
        </div>
        <Button
          onClick={() => handleDownload("All Data export")}
          disabled={downloading}
          className="bg-primary space-x-2 text-white hover:bg-[#146c11]"
        >
          <Download size={18} />
          <span>{downloading ? "Exporting..." : "Export All Data"}</span>
        </Button>
      </div>

      <MetricsGrid />
      <ChartsSection />
      <CustomReportGenerator />

      {/* Available Reports Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">Available Reports</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium">
              <tr>
                <th className="px-6 py-3">Report Name</th>
                <th className="px-6 py-3">Date Generated</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-2">
                    <FileText size={16} className="text-gray-400" />
                    {report.name}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{report.date}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs border border-gray-200">
                      {report.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDownload(report.name)}
                      className="text-secondary font-medium hover:underline text-xs flex items-center gap-1 ml-auto"
                    >
                      <Download size={14} /> Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
