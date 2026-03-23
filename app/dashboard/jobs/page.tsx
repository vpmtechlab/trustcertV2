"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Download, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { JobStatsCards } from "@/components/dashboard/jobs/job-stats-cards";
import { mockData } from "@/components/dashboard/jobs/data";
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

export default function JobListPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [docs] = useState(mockData);
  const [filteredData, setFilteredData] = useState(mockData);
  const itemsPerPage = 10;

  const handleRowClick = (jobId: string) => {
    router.push(`/dashboard/jobs/view/${jobId}`);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    const filtered = docs.filter(
      (row) =>
        row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.jobId.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleExportCSV = () => {
    toast.success("Exporting Job List as CSV...");
  };

  const getResultBadgeColor = (result: string) => {
    if (result === "Approved") return "bg-green-100 text-green-700";
    if (result === "Not found on list") return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex flex-col gap-6 p-5">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Job List</h1>
          <p className="text-gray-500 mt-1">Keep track of jobs and their KYC results.</p>
        </div>
        <Button
          onClick={handleExportCSV}
          className="flex items-center gap-2 bg-secondary text-white hover:bg-gray-800"
        >
          <Download size={16} />
          Export CSV
        </Button>
      </div>

      <JobStatsCards />

      <div className="bg-white border text-sm border-gray-200 rounded-xl overflow-hidden shadow-sm">
        {/* Table Toolbar */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by Name or Job ID"
              className="pl-9 bg-gray-50 border-gray-200"
              onChange={handleSearch}
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow>
                <TableHead>Job ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Job Time</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>ID Type</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Result</TableHead>
                <TableHead>Message</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.length > 0 ? (
                currentData.map((row) => (
                  <TableRow
                    key={row.id}
                    onClick={() => handleRowClick(row.jobId)}
                    className="cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <TableCell className="font-medium">{row.jobId}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.source}</TableCell>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>{row.timestamp}</TableCell>
                    <TableCell>{row.jobTime}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-700">{row.product}</span>
                        {row.productSub && (
                          <span className="text-[10px] text-gray-400">{row.productSub}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{row.idType}</TableCell>
                    <TableCell>{row.country}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${getResultBadgeColor(
                          row.result
                        )}`}
                      >
                        {row.result}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-[150px] truncate" title={row.message}>
                      {row.message}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={11} className="h-24 text-center text-gray-500">
                    No results found.
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
