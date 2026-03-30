"use client";

import React, { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader2, Download, Filter, Calendar, Activity, ArrowUpRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AdminMetricsGrid } from "@/components/admin/reports/admin-metrics-grid";
import { AdminChartsSection } from "@/components/admin/reports/admin-charts-section";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function ReportsAdminPage() {
  const [dateRange, setDateRange] = useState("30");
  const [isExporting, setIsExporting] = useState(false);

  // 1. Fetch Global Jobs for the table
  const jobs = useQuery(api.admin.getAllJobs);
  
  // 2. Fetch Global Analytics for the charts
  const analytics = useQuery(api.admin.getAdminDashboardAnalytics, { 
    days: parseInt(dateRange) || undefined 
  });

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      toast.success("Platform-wide CSV export initiated.");
    }, 2000);
  };

  if (jobs === undefined) {
    return (
      <div className="flex flex-col justify-center items-center h-screen space-y-4">
        <div className="relative">
           <Loader2 className="w-12 h-12 animate-spin text-primary" />
           <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                 <Activity size={12} className="text-primary animate-pulse" />
              </div>
           </div>
        </div>
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest animate-pulse">
           Hydrating Global Data...
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-10 overflow-hidden">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
             <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full">Super Admin</span>
             <h1 className="text-4xl font-black text-gray-900 tracking-tighter">
               Global Analytics
             </h1>
          </div>
          <p className="text-gray-500 text-sm font-medium flex items-center gap-2">
            <Calendar size={14} className="text-primary" />
            Monitoring platform performance and client activity across all accounts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-2xl px-4 py-2 shadow-sm">
             <Filter size={14} className="text-gray-400" />
             <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Range:</span>
             <Select value={dateRange} onValueChange={(v) => setDateRange(v ?? "30")}>
               <SelectTrigger className="border-none bg-transparent h-7 font-black text-gray-900 focus:ring-0 min-w-[120px]">
                 <SelectValue placeholder="Period" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="7">Past 7 Days</SelectItem>
                 <SelectItem value="30">Past 30 Days</SelectItem>
                 <SelectItem value="90">Past 90 Days</SelectItem>
                 <SelectItem value="0">All Time</SelectItem>
               </SelectContent>
             </Select>
          </div>

          <Button 
             onClick={handleExport}
             disabled={isExporting}
             className="gap-2 bg-primary text-white hover:bg-[#146c11] px-6 rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95"
          >
             <Download size={18} /> 
             <span className="font-bold">{isExporting ? "Exporting..." : "Export CSV"}</span>
          </Button>
        </div>
      </div>

      {/* Analytics Components */}
      <AdminMetricsGrid analytics={analytics} />
      
      <AdminChartsSection analytics={analytics} />

      {/* Global Activity Table */}
      <div className="bg-white border text-gray-900 rounded-[2rem] overflow-hidden shadow-2xl border-gray-100">
        <div className="p-8 border-b bg-linear-to-r from-gray-50 to-white flex items-center justify-between">
           <div>
              <h2 className="font-black text-gray-900 text-xl tracking-tight flex items-center gap-2">
                 Recent Platform Activity
                 <ArrowUpRight size={16} className="text-gray-300" />
              </h2>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Live Feed • Last 100 Hits</p>
           </div>
           <Button variant="ghost" className="text-xs font-bold text-primary hover:bg-primary/5 uppercase tracking-widest px-4">
              View Audit Log
           </Button>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow>
                <TableHead className="font-bold text-[10px] text-gray-400 uppercase tracking-widest py-5">Company</TableHead>
                <TableHead className="font-bold text-[10px] text-gray-400 uppercase tracking-widest text-center">Service</TableHead>
                <TableHead className="font-bold text-[10px] text-gray-400 uppercase tracking-widest text-center">Outcome</TableHead>
                <TableHead className="font-bold text-[10px] text-gray-400 uppercase tracking-widest text-right">Fee</TableHead>
                <TableHead className="font-bold text-[10px] text-gray-400 uppercase tracking-widest text-right pr-8">Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-50">
              {jobs.map((job) => (
                <tr key={job._id} className="hover:bg-gray-50/80 transition-colors group">
                  <TableCell className="py-5 pl-8">
                     <div className="flex flex-col">
                        <span className="font-bold text-gray-900 text-sm group-hover:text-primary transition-colors">{job.companyName}</span>
                     </div>
                  </TableCell>
                  <TableCell className="text-center font-mono text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                     {job.serviceType.replace("_", " ")}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={`inline-flex items-center px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xs
                      ${job.resultStatus === "approved" ? "bg-emerald-100 text-emerald-800 border border-emerald-200" : 
                        job.resultStatus === "failed" ? "bg-rose-100 text-rose-800 border border-rose-200" : 
                        "bg-amber-100 text-amber-800 border border-amber-200"}`}
                    >
                      {job.resultStatus.replace(/_/g, " ")}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-black text-gray-900 tabular-nums">
                    ${job.feesCharged?.toFixed(2) || "0.00"}
                  </TableCell>
                  <TableCell className="text-right text-gray-500 font-bold text-[10px] tabular-nums pr-8">
                    {new Date(job.createdAt).toLocaleDateString('en-GB')} {new Date(job.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                  </TableCell>
                </tr>
              ))}
              
              {jobs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-20">
                    <div className="flex flex-col items-center gap-3 opacity-20">
                       <Activity size={40} />
                       <p className="font-black uppercase tracking-widest text-sm">No transaction frequency detected.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
