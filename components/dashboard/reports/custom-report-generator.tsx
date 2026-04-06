"use client";

import React, { useState } from "react";
import { FileText, File, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useApp } from "@/components/providers/app-provider";
import { Id } from "@/convex/_generated/dataModel";
import { format as formatDate } from "date-fns";
import { downloadCSV, downloadPDF } from "@/lib/export-utils";

type ReportData = {
  Date: string;
  Type: string;
  Status: string;
  Entity: string;
  Reference: string;
  [key: string]: string | number | boolean | null | undefined;
};

export function CustomReportGenerator() {
  const { member } = useApp();
  const company = useQuery(api.companies.getDefaultCompany);
  const allVerifications = useQuery(api.verifications.getVerificationsByCompany, 
    company?._id ? { companyId: company._id } : "skip"
  );
  const createReport = useMutation(api.reports.createReport);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reportType, setReportType] = useState("compliance");
  const [status, setStatus] = useState("all");
  const [format, setFormat] = useState("pdf");
  const [generating, setGenerating] = useState(false);

  const handleGenerateCustomReport = async () => {
    if (!startDate || !endDate) {
      toast.error("Please select a date range.");
      return;
    }

    if (!company?._id || !member?.id) {
      toast.error("Organization context not found.");
      return;
    }

    setGenerating(true);
    try {
      const typeLabel = {
        compliance: "Compliance Summary",
        audit: "Audit Log",
        financial: "Financial Report",
        activity: "User Activity",
      }[reportType] || "Custom Report";

      const reportName = `${typeLabel} - ${formatDate(new Date(startDate), "MMM dd")} to ${formatDate(new Date(endDate), "MMM dd")}`;

      // --- REAL DATA FILTERING ---
      if (!allVerifications) {
        toast.error("Verification data is not yet loaded.");
        return;
      }

      const startMs = new Date(startDate).getTime();
      const endMs = new Date(endDate).getTime() + 86400000; // Include the end day

      const filteredLogs = allVerifications.filter(v => {
        const createdAt = v.createdAt;
        if (createdAt < startMs || createdAt > endMs) return false;
        if (status !== "all" && v.resultStatus !== status) return false;
        // Optionally filter by report type logic here if needed
        return true;
      });

      if (filteredLogs.length === 0) {
        toast.error("No records found for the selected criteria.");
        return;
      }

      await createReport({
        companyId: company._id,
        userId: member.id as Id<"users">,
        name: reportName,
        type: typeLabel,
        format: format.toUpperCase(),
        status: "completed",
        config: { startDate, endDate, reportType, status },
      });

      const isCSV = format.toLowerCase() === "csv";
      
      if (isCSV) {
        const exportData = filteredLogs.map(v => ({
          Date: formatDate(v.createdAt, "yyyy-MM-dd HH:mm"),
          Service: v.serviceName || v.serviceType,
          Status: v.resultStatus.toUpperCase(),
          Subject: v.entityData?.firstName ? `${v.entityData.firstName} ${v.entityData.lastName || ""}` : (v.entityData?.companyName || "N/A"),
          "Reference ID": v._id.slice(-8).toUpperCase(),
          "Fees (USD)": v.feesCharged || 0,
          Source: v.source
        }));

        downloadCSV(exportData, reportName.replace(/\s+/g, "_"));
      } else {
        const headers = ["Date", "Service", "Status", "Subject", "Ref ID", "Fee"];
        const rows = filteredLogs.map(v => [
          formatDate(v.createdAt, "MM/dd/yyyy"),
          v.serviceName || v.serviceType,
          v.resultStatus.toUpperCase(),
          v.entityData?.firstName ? `${v.entityData.firstName} ${v.entityData.lastName || ""}` : (v.entityData?.companyName || "N/A"),
          v._id.slice(-6).toUpperCase(),
          v.feesCharged ? `$${v.feesCharged.toFixed(2)}` : "$0.00"
        ]);

        downloadPDF(headers, rows, reportName.replace(/\s+/g, "_"), typeLabel);
      }

      toast.success(`${typeLabel} generated and downloaded successfully!`);
      
      // Reset dates after successful generation
      setStartDate("");
      setEndDate("");
    } catch (error) {
      toast.error("Failed to generate report.");
      console.error(error);
    } finally {
      setGenerating(false);
    }
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

        <div className="space-y-2 w-full">
          <Label htmlFor="report-type">Report Type</Label>
          <Select value={reportType} onValueChange={(value: string | null) => setReportType(value ?? "compliance")}>
            <SelectTrigger id="report-type" className="w-full">
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
          <Select value={status} onValueChange={(value: string | null) => setStatus(value ?? "all")}>
            <SelectTrigger id="status" className="w-full">
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
