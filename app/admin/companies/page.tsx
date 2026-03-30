"use client";

import React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Building2, User, ShieldAlert } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Eye } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CompaniesAdminPage() {
  const router = useRouter();
  const companies = useQuery(api.admin.getAllCompanies);

  const handleViewDetails = (companyId: string) => {
    router.push(`/admin/companies/${companyId}`);
  };

  if (companies === undefined) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Companies
          </h1>
          <p className="text-gray-500 mt-2">
            Manage all organizations using TrustCert.
          </p>
        </div>
      </div>

      <div className="bg-white border text-gray-900 rounded-xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="font-semibold text-gray-700">Company Name</TableHead>
              <TableHead className="font-semibold text-gray-700">Status</TableHead>
              <TableHead className="font-semibold text-gray-700 text-right">Users</TableHead>
              <TableHead className="font-semibold text-gray-700 text-right">Verifications</TableHead>
              <TableHead className="font-semibold text-gray-700 text-right">Wallet Balance</TableHead>
              <TableHead className="font-semibold text-gray-700 text-right">Joined</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companies.map((company) => (
              <TableRow key={company._id} className="hover:bg-gray-50 transition-colors">
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-md flex items-center justify-center text-white font-bold
                      ${company.isSuperAdmin ? "bg-purple-600" : "bg-blue-600"}`}
                    >
                      {company.isSuperAdmin ? <ShieldAlert size={16} /> : <Building2 size={16} />}
                    </div>
                    <div>
                      <div>{company.name}</div>
                      <div className="text-xs text-gray-500 font-normal">{company.domain}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                    ${company.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                  >
                    {company.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1 text-gray-600">
                    <User size={14} /> {company.userCount}
                  </div>
                </TableCell>
                <TableCell className="text-right text-gray-600">
                  {company.verificationCount}
                </TableCell>
                <TableCell className="text-right font-medium">
                  ${company.availableBalance.toFixed(2)}
                </TableCell>
                <TableCell className="text-right text-gray-500 text-sm">
                  {new Date(company.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <button 
                    onClick={() => handleViewDetails(company._id)}
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/5 rounded-lg transition-colors border border-transparent hover:border-primary/20"
                  >
                    <Eye size={14} /> View Details
                  </button>
                </TableCell>
              </TableRow>
            ))}
            
            {companies.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No companies found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
