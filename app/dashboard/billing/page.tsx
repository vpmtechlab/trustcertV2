"use client";

import React, { useState } from "react";
import { Plus, ArrowUpRight, ArrowDownLeft, Clock, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useApp } from "@/components/providers/app-provider";
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
import { Id } from "@/convex/_generated/dataModel";
import { format } from "date-fns";

export default function BillingPage() {
  const { member, setShowTopUp } = useApp();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const balance = useQuery(api.balances.getAvailableBalance, 
    member?.companyId ? { companyId: member.companyId as Id<"companies"> } : "skip"
  );

  const transactions = useQuery(api.transactions.list,
    member?.companyId ? { companyId: member.companyId as Id<"companies"> } : "skip"
  );

  const handleTopUp = () => {
    setShowTopUp(true);
  };

  const filteredData = (transactions || []).filter((row) =>
    row._id.slice(-8).toUpperCase().includes(searchTerm.toUpperCase())
  );

  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const lastTopUp = (transactions || [])
    .filter(t => t.type === "top_up")
    .sort((a, b) => b.createdAt - a.createdAt)[0];

  return (
    <div className="flex flex-col gap-6 p-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Billing</h1>
        <p className="text-gray-500 mt-1">
          Manage your balance and view transaction history.
        </p>
      </div>

      {/* Balance Card */}
      <div className="relative overflow-hidden rounded-2xl bg-secondary p-6 text-white shadow-lg">
        <div className="absolute top-0 right-0 h-64 w-64 translate-x-1/3 -translate-y-1/3 rounded-full bg-primary opacity-20 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div>
            <p className="text-sm font-medium text-gray-300">Available Balance</p>
            <h2 className="mt-2 text-4xl font-bold tracking-tight">
              ${(balance ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </h2>
            <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
              <Clock size={12} />
              {lastTopUp 
                ? `Last topped up: ${format(lastTopUp.createdAt, "MMM dd, yyyy")}`
                : "No top-ups yet"}
            </div>
          </div>
          <Button
            onClick={handleTopUp}
            className="flex items-center gap-2 bg-primary hover:bg-[#146c11] text-white"
          >
            <Plus size={16} />
            Top Up Balance
          </Button>
        </div>
      </div>

      {/* Transaction History */}
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-bold text-gray-900">Transaction History</h2>
        
        <div className="bg-white border text-sm border-gray-200 rounded-xl overflow-hidden shadow-sm">
          {/* Toolbar */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search Transaction ID"
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
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions === undefined ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-gray-500">
                      Loading transactions...
                    </TableCell>
                  </TableRow>
                ) : currentData.length > 0 ? (
                  currentData.map((row) => (
                    <TableRow key={row._id} className="hover:bg-gray-50 transition-colors">
                      <TableCell className="font-medium">
                        {row._id.slice(-12).toUpperCase()}
                      </TableCell>
                      <TableCell>{format(row.createdAt, "MMM dd, yyyy")}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {row.type === "top_up" ? (
                            <ArrowDownLeft size={14} className="text-green-500" />
                          ) : (
                            <ArrowUpRight size={14} className="text-red-500" />
                          )}
                          <span className="capitalize">{row.type.replace("_", " ")}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`font-medium ${
                            row.type === "top_up" ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {row.type === "top_up" ? "+" : "-"}${row.amount.toFixed(2)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            row.status === "success"
                              ? "bg-green-100 text-green-700"
                              : row.status === "pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                          }`}
                        >
                          {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-gray-500">
                      No transactions found.
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
    </div>
  );
}
