"use client";

import React, { useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Printer,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  Hash,
  User,
  Shield,
  FileText,
  AlertTriangle,
  Loader2,
  CreditCard,
  Globe,
} from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";

// ── Helpers ───────────────────────────────────────────────────────────────────

function getStatusStyle(status: string) {
  switch (status) {
    case "approved":
      return { bg: "bg-emerald-500", ring: "ring-emerald-200", label: "Approved", icon: CheckCircle2, banner: "from-emerald-50 to-teal-50 border-emerald-200" };
    case "failed":
      return { bg: "bg-red-500", ring: "ring-red-200", label: "Failed", icon: XCircle, banner: "from-red-50 to-rose-50 border-red-200" };
    case "not_found_on_list":
      return { bg: "bg-emerald-500", ring: "ring-emerald-200", label: "Not Found on List", icon: CheckCircle2, banner: "from-emerald-50 to-teal-50 border-emerald-200" };
    case "pending":
    default:
      return { bg: "bg-amber-500", ring: "ring-amber-200", label: "Pending", icon: Clock, banner: "from-amber-50 to-yellow-50 border-amber-200" };
  }
}

function formatKey(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/^./, (c) => c.toUpperCase())
    .trim();
}

function formatDate(ts: number): string {
  return new Date(ts).toLocaleString("en-GB", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

// ── Payload Renderers ─────────────────────────────────────────────────────────

type Payload = Record<string, unknown>;

/**
 * Renders the AML checks array as a styled list if present,
 * otherwise falls back to generic key-value rendering.
 */
function AmlChecksCard({ checks }: { checks: Array<{ name: string; status: string; passed: boolean }> }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          AML Checks Summary
        </h3>
      </div>
      <div className="divide-y divide-gray-100">
        {checks.map((check, i) => (
          <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
            <span className="text-gray-700 font-medium">{check.name}</span>
            <span className={`flex items-center gap-2 font-medium ${check.passed ? "text-emerald-600" : "text-red-500"}`}>
              {check.passed
                ? <CheckCircle2 className="w-4 h-4" />
                : <XCircle className="w-4 h-4" />}
              {check.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Renders directors array as a styled table.
 */
function DirectorsTable({ directors }: { directors: Array<Record<string, string>> }) {
  return (
    <div className="mt-4">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Directors / Officers</p>
      <div className="overflow-x-auto rounded-lg border border-gray-100">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 text-left text-xs text-gray-500 font-semibold uppercase">Name</th>
              <th className="px-4 py-2 text-left text-xs text-gray-500 font-semibold uppercase">ID Number</th>
              <th className="px-4 py-2 text-left text-xs text-gray-500 font-semibold uppercase">Nationality</th>
              <th className="px-4 py-2 text-left text-xs text-gray-500 font-semibold uppercase">Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {directors.map((d, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-4 py-2 font-medium text-gray-900">{d.name}</td>
                <td className="px-4 py-2 text-gray-600">{d.idNumber}</td>
                <td className="px-4 py-2 text-gray-600">{d.nationality}</td>
                <td className="px-4 py-2 text-gray-600">{d.role ?? "Director"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/** Renders a single key-value row */
function DataRow({ label, value }: { label: string; value: unknown }) {
  const SKIP_KEYS = ["verificationStatus", "verificationMessage", "checks", "directors", "watchlistsChecked"];
  if (SKIP_KEYS.includes(label)) return null;

  let display: React.ReactNode;
  if (typeof value === "boolean") {
    display = (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${value ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
        {value ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
        {value ? "Yes" : "No"}
      </span>
    );
  } else if (typeof value === "object" && value !== null) {
    display = (
      <span className="text-gray-600 font-mono text-xs bg-gray-50 px-2 py-1 rounded">
        {JSON.stringify(value)}
      </span>
    );
  } else {
    display = <span className="font-semibold text-gray-900">{String(value ?? "—")}</span>;
  }

  return (
    <div className="flex items-start justify-between py-3 border-b border-gray-50 last:border-0">
      <span className="text-sm text-gray-500 w-1/2">{formatKey(label)}</span>
      <div className="w-1/2 text-right">{display}</div>
    </div>
  );
}

/** Main payload renderer — handles AML checks + directors sub-sections */
function PayloadCard({ payload, serviceType }: { payload: Payload; serviceType: string }) {
  const checks = payload.checks as Array<{ name: string; status: string; passed: boolean }> | undefined;
  const directors = payload.directors as Array<Record<string, string>> | undefined;
  const watchlists = payload.watchlistsChecked as string[] | undefined;

  const title = serviceType.includes("aml") || serviceType === "individual" || serviceType === "business"
    ? "AML / Screening Results"
    : serviceType === "kyb" || serviceType === "business_registration" || serviceType === "tax_information"
      ? "Business Registration Data"
      : "Identity Verification Data";

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            {title}
          </h3>
        </div>
        <div className="px-6 py-2 divide-y divide-gray-50">
          {Object.entries(payload).map(([k, v]) => (
            k !== "checks" && k !== "directors" && k !== "watchlistsChecked"
              ? <DataRow key={k} label={k} value={v} />
              : null
          ))}
        </div>
        {directors && directors.length > 0 && (
          <div className="px-6 pb-5">
            <DirectorsTable directors={directors} />
          </div>
        )}
        {watchlists && watchlists.length > 0 && (
          <div className="px-6 pb-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Watchlists Checked</p>
            <div className="flex flex-wrap gap-2">
              {watchlists.map((w) => (
                <span key={w} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">{w}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {checks && checks.length > 0 && <AmlChecksCard checks={checks} />}
    </>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function JobViewPage() {
  const params = useParams();
  const router = useRouter();
  const printRef = useRef<HTMLDivElement>(null);

  const jobId = params.jobId as string;
  const job = useQuery(api.verifications.getVerificationById, {
    jobId: jobId as Id<"jobs">,
  });

  // Loading state
  if (job === undefined) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3 text-gray-500">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm">Loading verification result…</p>
        </div>
      </div>
    );
  }

  // Not found
  if (job === null) {
    return (
      <div className="p-2">
        <div className="text-center py-16 bg-linear-to-br flex flex-col items-center from-gray-50 to-gray-100 rounded-2xl border border-gray-200">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Job Not Found</h2>
          <p className="text-gray-500 mt-2 mb-6">
            The job with ID <code className="bg-gray-100 px-1 rounded text-sm">{jobId}</code> could not be found.
          </p>
          <Button onClick={() => router.push("/dashboard/jobs")} variant="outline">
            <ArrowLeft size={16} className="mr-2" />
            Back to Job List
          </Button>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusStyle(job.resultStatus);
  const StatusIcon = statusInfo.icon;
  const payload = (job.resultPayload ?? {}) as Payload;
  const entityData = (job.entityData ?? {}) as Record<string, string>;

  const handlePrint = () => {
    const content = printRef.current;
    if (!content) return;
    const win = window.open("", "_blank");
    if (!win) { alert("Please allow popups to print"); return; }
    win.document.write(`<!DOCTYPE html><html><head>
      <title>Result — ${job.serviceType}</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <style>body{font-family:system-ui,sans-serif;padding:20px}@media print{.no-print{display:none!important}}</style>
      </head><body>${content.innerHTML}</body></html>`);
    win.document.close();
    win.onload = () => setTimeout(() => { win.print(); win.close(); }, 500);
  };

  return (
    <div className="p-2 space-y-6 max-w-6xl">
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
      <div className={`bg-linear-to-r ${statusInfo.banner} rounded-2xl p-2 border`}>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 ${statusInfo.bg} ${statusInfo.ring} ring-4 rounded-xl flex items-center justify-center shadow-lg`}>
              <StatusIcon className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Result Overview</h1>
              <p className="text-gray-600 mt-1 flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 bg-white/70 text-gray-700 border border-gray-200 rounded-md text-sm font-medium">
                  {job.serviceType?.replace(/_/g, " ").toUpperCase()}
                </span>
                <span className="text-gray-400">•</span>
                <span className={`px-2 py-0.5 ${statusInfo.bg} text-white rounded-md text-sm font-medium`}>
                  {statusInfo.label}
                </span>
              </p>
            </div>
          </div>
          <Button
            onClick={handlePrint}
            variant="default"
            className="shadow-md bg-primary hover:bg-[#146c11] text-white no-print"
          >
            <Printer size={16} className="mr-2" />
            Print PDF
          </Button>
        </div>
      </div>

      {/* Printable Content */}
      <div ref={printRef} className="space-y-6">
        {/* Meta Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-500 uppercase tracking-wide">Date</p>
                <p className="font-semibold text-gray-900 text-sm truncate">{formatDate(job.createdAt)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center shrink-0">
                <Hash className="w-5 h-5 text-purple-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-500 uppercase tracking-wide">Job ID</p>
                <p className="font-semibold text-gray-900 text-sm truncate">{job._id}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center shrink-0">
                <User className="w-5 h-5 text-amber-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-500 uppercase tracking-wide">Entity</p>
                <p className="font-semibold text-gray-900 text-sm truncate">
                  {entityData.firstName
                    ? `${entityData.firstName} ${entityData.lastName ?? ""}`
                    : entityData.companyNumber ?? "—"}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center shrink-0">
                <CreditCard className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-500 uppercase tracking-wide">Fee Charged</p>
                <p className="font-semibold text-gray-900 text-sm">
                  ${job.feesCharged?.toFixed(2) ?? "0.00"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Submitted Entity Data */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Globe className="w-5 h-5 text-gray-500" />
              Submitted Request Data
            </h3>
          </div>
          <div className="px-6 py-2 divide-y divide-gray-50">
            {Object.entries(entityData)
              .filter(([, v]) => v && String(v).trim() !== "")
              .map(([k, v]) => (
                <DataRow key={k} label={k} value={v} />
              ))}
          </div>
        </div>

        {/* AI-Generated Result Payload */}
        {Object.keys(payload).length > 0
          ? <PayloadCard payload={payload} serviceType={job.serviceType} />
          : (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-gray-500" />
                  Result Payload
                </h3>
              </div>
              <div className="px-6 py-8 text-center">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FileText className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-gray-500 text-sm">
                  {job.resultStatus === "pending" ? "Verification still processing…" : "No result data available"}
                </p>
              </div>
            </div>
          )}

        {/* Result Message Banner */}
        {job.message && (
          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${
            job.resultStatus === "approved" || job.resultStatus === "not_found_on_list"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : job.resultStatus === "failed"
                ? "bg-red-50 border-red-200 text-red-800"
                : "bg-amber-50 border-amber-200 text-amber-800"
          }`}>
            <StatusIcon className="w-5 h-5 shrink-0" />
            <p className="text-sm font-medium">{job.message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
