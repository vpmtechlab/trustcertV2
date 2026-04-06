"use client";

import { useContext } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AuditFeed } from "@/components/shared/audit-feed";
import { ShieldCheck, ArrowUpRight, Search } from "lucide-react";
import { AppContext } from "@/components/providers/app-provider";
import { Id } from "@/convex/_generated/dataModel";

export default function AuditDashboardPage() {
	// 1. Get user context
	const { member } = useContext(AppContext);

	// 2. Fetch logs for the organization
	const rawLogs = useQuery(
		api.audit.getAuditLogsByCompany,
		member?.companyId
			? { companyId: member.companyId as Id<"companies"> }
			: "skip",
	);

	// 3. Filter for verification-only logs
	const logs = rawLogs?.filter(
		(log) => log.action.startsWith("VERIFICATION_") || log.entityType === "job",
	);

	return (
		<div className="p-2 space-y-10">
			{/* Header Section */}
			<div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-gray-100">
				<div className="space-y-1">
					<div className="flex items-center gap-2">
						<div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
							<ShieldCheck size={20} />
						</div>
						<h1 className="text-4xl font-black text-gray-900 tracking-tighter">
							Organization Audit
						</h1>
					</div>
					<p className="text-gray-500 text-sm font-medium">
						Comprehensive tracking of all team operations and system
						interactions.
					</p>
				</div>

				<div className="flex items-center gap-2">
					<div className="relative group">
						<Search
							className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors"
							size={14}
						/>
						<input
							type="text"
							placeholder="Search events..."
							className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-2xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all w-64"
						/>
					</div>
					<button className="p-2 border border-gray-200 rounded-2xl text-gray-400 hover:bg-gray-50 transition-colors shadow-sm">
						<ArrowUpRight size={18} />
					</button>
				</div>
			</div>

			{/* Audit Feed */}
			<div className="bg-linear-to-b from-gray-50/50 to-transparent p-0 lg:p-4 rounded-[3rem]">
				<AuditFeed logs={logs} title="Activity History" showCompany={false} />
			</div>

			{/* Legal Footer */}
			<div className="pt-10 border-t border-gray-100 flex items-center justify-center gap-4 text-[10px] font-black text-gray-300 uppercase tracking-widest leading-none">
				<span className="flex items-center gap-2 px-3 py-1.5 border border-gray-100 rounded-lg">
					Compliance Verified
				</span>
				<span className="flex items-center gap-2 px-3 py-1.5 border border-gray-100 rounded-lg">
					Tamper-Proof
				</span>
				<span className="flex items-center gap-2 px-3 py-1.5 border border-gray-100 rounded-lg">
					ISO-Compatible
				</span>
			</div>
		</div>
	);
}
