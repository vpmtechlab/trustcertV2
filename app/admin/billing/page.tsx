"use client";

import React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { DollarSign, ArrowUpRight, ArrowDownRight, Building2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";

export default function GlobalBillingAdminPage() {
  const companies = useQuery(api.admin.getAllCompanies);
  const metrics = useQuery(api.admin.getGlobalMetrics);

  if (companies === undefined || metrics === undefined) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const totalPlatformBalance = companies.reduce((sum, c) => sum + (c.availableBalance || 0), 0);

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Global Billing
          </h1>
          <p className="text-gray-500 mt-2">
            Overview of all client wallets and platform revenue.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">Total Verified Revenue</p>
            <h3 className="text-3xl font-bold text-gray-900">${metrics.totalRevenue.toFixed(2)}</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1">Total Client Wallet Balances</p>
            <h3 className="text-3xl font-bold text-gray-900">${totalPlatformBalance.toFixed(2)}</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
            <Building2 className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      <h2 className="text-xl font-semibold text-gray-900 mb-4">Client Wallets</h2>
      <div className="bg-white border text-gray-900 rounded-xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="font-semibold text-gray-700">Company Name</TableHead>
              <TableHead className="font-semibold text-gray-700 text-right">Available Balance</TableHead>
              <TableHead className="font-semibold text-gray-700 text-right">Verifications Run</TableHead>
              <TableHead className="font-semibold text-gray-700">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companies.map((company) => (
              <TableRow key={company._id} className="hover:bg-gray-50 transition-colors">
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="text-gray-900 font-semibold">{company.name} {company.isSuperAdmin && "(Super Admin)"}</div>
                      <div className="text-xs text-gray-500 font-normal">{company.domain}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="font-mono font-medium text-lg">
                    ${company.availableBalance.toFixed(2)}
                  </div>
                </TableCell>
                <TableCell className="text-right text-gray-600">
                  {company.verificationCount}
                </TableCell>
                <TableCell>
                  {company.availableBalance < 10 && !company.isSuperAdmin ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                      Low Balance
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                      Healthy
                    </span>
                  )}
                </TableCell>
              </TableRow>
            ))}
            
            {companies.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                  No company wallets found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
