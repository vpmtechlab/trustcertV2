"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Download, Search, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { JobStatsCards } from "@/components/dashboard/jobs/job-stats-cards";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useApp } from "@/components/providers/app-provider";
import { Id } from "@/convex/_generated/dataModel";

export default function JobListPage() {
  const router = useRouter();
  const { member } = useApp();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 10;

  // 1. Fetch real data from Convex
  const jobs = useQuery(api.verifications.getVerificationsByCompany,
    member?.companyId ? { companyId: member.companyId as Id<"companies"> } : "skip"
  );

  const stats = useQuery(api.verifications.getJobStats,
    member?.companyId ? { companyId: member.companyId as Id<"companies"> } : "skip"
  );

  const handleRowClick = (jobId: string) => {
    router.push(`/dashboard/jobs/view/${jobId}`);
  };

  const handleExportCSV = () => {
    toast.success("Exporting Job List as CSV...");
  };

  const getResultBadgeColor = (result: string) => {
    if (result === "approved") return "bg-green-100 text-green-700";
    if (result === "not_found_on_list") return "bg-gray-100 text-gray-700";
    if (result === "pending") return "bg-amber-100 text-amber-700";
    return "bg-red-100 text-red-700";
  };

  const formatDate = (ts: number) => {
    return new Date(ts).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
  };

  const formatTime = (ts: number) => {
    return new Date(ts).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  // Filter logic over real database results
  const filteredData = (jobs ?? []).filter((row) => {
    return (
      (row.serviceName as string).toLowerCase().includes(searchTerm.toLowerCase()) ||
      row._id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (jobs === undefined || member === undefined) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-gray-500 text-sm font-medium">Loading job list...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-2">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Job List</h1>
          <p className="text-gray-500 mt-1">Keep track of real-time verification jobs and AI-generated results.</p>
        </div>
        <Button
          onClick={handleExportCSV}
          className="flex items-center gap-2 bg-secondary text-white hover:bg-gray-800"
        >
          <Download size={16} />
          Export CSV
        </Button>
      </div>

      <JobStatsCards stats={stats} />

      <div className="bg-white border text-sm border-gray-200 rounded-xl overflow-hidden shadow-sm">
        {/* Table Toolbar */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by Job ID"
              className="pl-9 bg-gray-50 border-gray-200"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead>Job ID</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Result</TableHead>
                <TableHead>Message</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.length > 0 ? (
                currentData.map((row) => {
                  const entity = (row.entityData as Record<string, unknown>) || {};

                  return (
                    <TableRow
                      key={row._id}
                      onClick={() => handleRowClick(row._id)}
                      className="cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <TableCell className="font-medium text-xs font-mono">{row._id.substring(0, 10)}...</TableCell>
                      <TableCell className="font-medium">{row.serviceName}</TableCell>
                      <TableCell>
                        <span className="capitalize">{row.source?.replace("_", " ") ?? "web"}</span>
                      </TableCell>
                      <TableCell>{formatDate(row.createdAt)}</TableCell>
                      <TableCell className="text-gray-400">{formatTime(row.createdAt)}</TableCell>
                      <TableCell>
                        <span className="font-medium text-gray-700 uppercase text-[11px] bg-gray-100 px-2 py-0.5 rounded">
                          {row.serviceType?.replace("_", " ")}
                        </span>
                      </TableCell>
                      <TableCell>{(entity.country as string) ?? "KE"}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getResultBadgeColor(
                            row.resultStatus
                          )}`}
                        >
                          {row.resultStatus ?? "Pending"}
                        </span>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate italic text-gray-500" title={row.message}>
                        {row.message}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="h-32 text-center text-gray-500">
                    {searchTerm ? "No results found matching your search." : "No verification jobs found."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Details */}
        <div className="p-4 border-t border-gray-200 flex items-center justify-between text-sm text-gray-500">
          <div>
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} entries
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="h-8 px-2"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="px-2 font-medium text-gray-700">
              Page {currentPage} of {Math.max(1, totalPages)}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages || totalPages === 0}
              className="h-8 px-2"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
