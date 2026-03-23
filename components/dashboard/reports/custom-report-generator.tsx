"use client";

import React, { useState } from "react";
import { FileText, File, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function CustomReportGenerator() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reportType, setReportType] = useState("compliance");
  const [status, setStatus] = useState("all");
  const [format, setFormat] = useState("pdf");
  const [generating, setGenerating] = useState(false);

  const handleGenerateCustomReport = () => {
    if (!startDate || !endDate) {
      toast.error("Please select a date range.");
      return;
    }

    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      toast.success(`Generated ${reportType} report (${format.toUpperCase()}) successfully!`);
    }, 2000);
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-secondary/5 rounded-lg text-secondary">
          <FileText size={20} />
        </div>
        <div>
          <h3 className="font-bold text-gray-900">Generate Custom Report</h3>
          <p className="text-sm text-gray-500">Filter data and export in your preferred format.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="space-y-2">
          <Label htmlFor="start-date">Start Date</Label>
          <Input
            id="start-date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="end-date">End Date</Label>
          <Input
            id="end-date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="report-type">Report Type</Label>
          <Select value={reportType} onValueChange={(val) => setReportType(val || "")}>
            <SelectTrigger id="report-type">
              <SelectValue placeholder="Select report type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="compliance">Compliance Summary</SelectItem>
              <SelectItem value="audit">Audit Log</SelectItem>
              <SelectItem value="financial">Financial Report</SelectItem>
              <SelectItem value="activity">User Activity</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={status} onValueChange={(val) => setStatus(val || "")}>
            <SelectTrigger id="status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="verified">Verified (Successful)</SelectItem>
              <SelectItem value="pending">Pending Review</SelectItem>
              <SelectItem value="failed">Failed / Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4 border-t border-gray-50">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <span className="text-sm font-medium text-gray-700">Export Format:</span>
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setFormat("pdf")}
              className={`flex items-center gap-2 cursor-pointer px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                format === "pdf" ? "bg-white text-red-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <File size={16} /> PDF
            </button>
            <button
              onClick={() => setFormat("csv")}
              className={`flex items-center gap-2 cursor-pointer px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                format === "csv" ? "bg-white text-green-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <FileSpreadsheet size={16} /> CSV
            </button>
          </div>
        </div>
        <Button
          onClick={handleGenerateCustomReport}
          disabled={generating}
          className="w-full md:w-auto min-w-[150px] bg-primary hover:bg-[#146c11] text-white"
        >
          {generating ? "Generating..." : "Generate Report"}
        </Button>
      </div>
    </div>
  );
}
