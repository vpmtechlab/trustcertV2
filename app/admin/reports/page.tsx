"use client";

import React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Search, Loader2, Download, Filter } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export default function ReportsAdminPage() {
  const jobs = useQuery(api.admin.getAllJobs);

  if (jobs === undefined) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Global Reports
          </h1>
          <p className="text-gray-500 mt-2">
            View recent verification jobs from all clients across the platform.
          </p>
        </div>
        <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2 text-gray-700">
                <Filter size={16} /> Filter
            </Button>
            <Button className="gap-2 bg-primary">
                <Download size={16} /> Export CSV
            </Button>
        </div>
      </div>

      <div className="bg-white border text-gray-900 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
           <h2 className="font-semibold text-gray-700">Recent Verifications</h2>
           <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded border shadow-sm">Showing Last 100</span>
        </div>
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="font-semibold text-gray-700">Company</TableHead>
              <TableHead className="font-semibold text-gray-700">User</TableHead>
              <TableHead className="font-semibold text-gray-700">Service Type</TableHead>
              <TableHead className="font-semibold text-gray-700">Target Entity</TableHead>
              <TableHead className="font-semibold text-gray-700">Status</TableHead>
              <TableHead className="font-semibold text-gray-700 text-right">Fee</TableHead>
              <TableHead className="font-semibold text-gray-700 text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobs.map((job) => (
              <TableRow key={job._id} className="hover:bg-gray-50 transition-colors">
                <TableCell className="font-medium text-gray-900">
                  {job.companyName}
                </TableCell>
                <TableCell className="text-sm text-gray-600">
                  {job.userName}
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center px-2 py-1 rounded bg-slate-100 text-slate-700 text-xs font-mono uppercase tracking-wider">
                    {job.serviceType.replace("_", " ")}
                  </span>
                </TableCell>
                <TableCell className="text-sm text-gray-600 truncate max-w-[200px]">
                  {Object.values(job.entityData || {}).join(", ")}
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                    ${job.resultStatus === "approved" ? "bg-green-100 text-green-800" : 
                      job.resultStatus === "failed" ? "bg-red-100 text-red-800" : 
                      job.resultStatus === "not_found_on_list" ? "bg-orange-100 text-orange-800" : 
                      "bg-yellow-100 text-yellow-800"}`}
                  >
                    {job.resultStatus.replace(/_/g, " ")}
                  </span>
                </TableCell>
                <TableCell className="text-right font-medium text-gray-900">
                  ${job.feesCharged?.toFixed(2) || "0.00"}
                </TableCell>
                <TableCell className="text-right text-gray-500 text-sm">
                  {new Date(job.createdAt).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
            
            {jobs.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No verifications found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
