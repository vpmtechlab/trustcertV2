"use client";

import React, { useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Printer,
  CheckCircle2,
  XCircle,
  Calendar,
  Hash,
  User,
  Shield,
  FileText,
  AlertTriangle,
} from "lucide-react";
import { mockData } from "@/components/dashboard/jobs/data";
import { Button } from "@/components/ui/button";

export default function JobViewPage() {
  const params = useParams();
  const router = useRouter();
  const printRef = useRef<HTMLDivElement>(null);
  
  const jobId = params.jobId as string;

  // Find the job from mock data (in real app, this would be an API call)
  const job = mockData.find((j) => j.jobId === jobId);

  if (!job) {
    return (
      <div className="p-8 gap-4">
        <div className="text-center py-16 bg-gradient-to-br flex flex-col items-center from-gray-50 to-gray-100 rounded-2xl border border-gray-200">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Job Not Found</h2>
          <p className="text-gray-500 mt-2 mb-6">
            The job with ID {jobId} could not be found.
          </p>
          <Button onClick={() => router.push("/dashboard/jobs")} variant="outline">
            <ArrowLeft size={16} className="mr-2" />
            Back to Job List
          </Button>
        </div>
      </div>
    );
  }

  // Get status badge styling
  const getStatusBadge = (result: string) => {
    if (result === "Approved" || result === "Clear" || result === "Not found on list") {
      return {
        bg: "bg-emerald-500",
        text: "text-white",
        icon: CheckCircle2,
        label: "Clear",
      };
    }
    return {
      bg: "bg-red-500",
      text: "text-white",
      icon: XCircle,
      label: "Failed",
    };
  };

  const statusInfo = getStatusBadge(job.result);
  const StatusIcon = statusInfo.icon;

  // AML Check results
  const amlChecks = [
    { name: "Sanctions List", status: "Not publicly reported", passed: true },
    { name: "Enforcement Action", status: "Not publicly reported", passed: true },
    { name: "Politically Exposed Persons", status: "Not publicly reported", passed: true },
    { name: "Known Associations", status: "Not publicly reported", passed: true },
    { name: "News Media", status: "Not publicly reported", passed: true },
  ];

  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow popups to print");
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Result Overview - ${job.product}</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          body { font-family: system-ui, -apple-system, sans-serif; padding: 20px; }
          @media print {
            body { padding: 0; }
            .no-print { display: none !important; }
          }
        </style>
      </head>
      <body>
        ${printContent.innerHTML}
      </body>
      </html>
    `);
    printWindow.document.close();

    // Wait for Tailwind to load, then print
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    };
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm">
        <Link
          href="/dashboard/jobs"
          className="text-primary hover:text-primary/80 font-medium flex items-center gap-1 transition-colors"
        >
          <ArrowLeft size={14} />
          Job List
        </Link>
        <span className="text-gray-300">/</span>
        <span className="text-gray-600">Result</span>
      </div>

      {/* Header Card */}
      <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-emerald-50 rounded-2xl p-6 border border-primary/20">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div
              className={`w-14 h-14 ${statusInfo.bg} rounded-xl flex items-center justify-center shadow-lg`}
            >
              <StatusIcon className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Result Overview</h1>
              <p className="text-gray-600 mt-1 flex items-center gap-2">
                <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-md text-sm font-medium">
                  {job.product}
                </span>
                <span className="text-gray-400">•</span>
                <span
                  className={`px-2 py-0.5 ${statusInfo.bg} ${statusInfo.text} rounded-md text-sm font-medium`}
                >
                  {statusInfo.label}
                </span>
              </p>
            </div>
          </div>
          <Button onClick={handlePrint} variant="default" className="shadow-md bg-primary hover:bg-[#146c11] text-white">
            <Printer size={16} className="mr-2" />
            Print PDF
          </Button>
        </div>
      </div>

      {/* Printable Content */}
      <div ref={printRef} className="space-y-6">
        {/* Job Meta Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Search Date</p>
                <p className="font-semibold text-gray-900">{job.date}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Hash className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Job ID</p>
                <p className="font-semibold text-gray-900">{job.jobId}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">User ID</p>
                <p className="font-semibold text-gray-900 truncate max-w-[150px]">
                  3FuzkVbTSTd...
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Results Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Search Results
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Full Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Year of Birth
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Nationalities
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Strict Match
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-semibold text-gray-900">
                      {job.name.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">1982</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {job.country}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                      Yes
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.bg} ${statusInfo.text}`}
                    >
                      <StatusIcon className="w-3.5 h-3.5" />
                      {statusInfo.label}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Results Summary Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              AML Checks Summary
            </h3>
          </div>
          <div className="divide-y divide-gray-100">
            {amlChecks.map((check, index) => (
              <div
                key={index}
                className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="text-gray-700 font-medium">{check.name}</span>
                <span className="flex items-center gap-2 text-emerald-600 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  {check.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Reports Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-gray-500" />
              Reports
            </h3>
          </div>
          <div className="px-6 py-8 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <FileText className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-gray-500">No Persons Found</p>
          </div>
        </div>
      </div>
    </div>
  );
}
