"use client";

import React, { useState } from "react";
import {
	Activity,
	User,
	Building2,
	Clock,
	ChevronRight,
	CheckCircle2,
	XCircle,
	Info,
	AlertCircle,
	Database,
	ArrowRight,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface AuditLog {
	_id: string;
	action: string;
	details: string;
	userName: string;
	companyName?: string;
	createdAt: number;
	metadata?: Record<string, unknown>;
}

interface AuditFeedProps {
	logs: AuditLog[] | undefined;
	title: string;
	showCompany?: boolean;
}

export function AuditFeed({
	logs,
	title,
	showCompany = false,
}: AuditFeedProps) {
	const [expandedId, setExpandedId] = useState<string | null>(null);

	if (logs === undefined) {
		return (
			<div className="space-y-4">
				{[1, 2, 3].map((i) => (
					<div
						key={i}
						className="h-24 bg-white rounded-3xl border border-gray-100 animate-pulse"
					/>
				))}
			</div>
		);
	}

	const getActionIcon = (action: string) => {
		if (action.includes("UPDATE") || action.includes("SET"))
			return <Info className="text-blue-500" size={18} />;
		if (action.includes("INIT") || action.includes("CREATE"))
			return <Activity className="text-emerald-500" size={18} />;
		if (action.includes("FAILED") || action.includes("ERROR"))
			return <XCircle className="text-rose-500" size={18} />;
		if (action.includes("COMPLETE") || action.includes("SUCCESS"))
			return <CheckCircle2 className="text-emerald-500" size={18} />;
		return <AlertCircle className="text-amber-500" size={18} />;
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between mb-8">
				<div>
					<h2 className="text-2xl font-black text-gray-900 tracking-tighter">
						{title}
					</h2>
					<p className="text-xs text-gray-400 font-bold uppercase tracking-[0.2em]">
						Immutable Record of System Events
					</p>
				</div>
				<div className="px-3 py-1 bg-gray-100 rounded-full text-[10px] font-black text-gray-500 uppercase tracking-widest">
					Live Feed
				</div>
			</div>

			<div className="space-y-4">
				{logs.map((log) => {
					const isExpanded = expandedId === log._id;

					return (
						<div
							key={log._id}
							onClick={() => setExpandedId(isExpanded ? null : log._id)}
							className={`group bg-white border border-gray-100 rounded-[2rem] p-6 transition-all duration-300 cursor-pointer hover:shadow-xl hover:translate-y-[-2px]
                ${isExpanded ? "ring-2 ring-primary/20 shadow-2xl" : "shadow-sm"}`}
						>
							<div className="flex items-start gap-4">
								<div
									className={`p-3 rounded-2xl bg-gray-50 group-hover:scale-110 transition-transform duration-500 shadow-sm`}
								>
									{getActionIcon(log.action)}
								</div>

								<div className="flex-1 min-w-0">
									<div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2 mb-1">
										<span className="text-[10px] font-black text-primary uppercase tracking-[0.15em] opacity-80">
											{log.action.replace(/_/g, " ")}
										</span>
										<div className="flex items-center gap-2 text-gray-400">
											<Clock size={12} />
											<span className="text-[10px] font-bold uppercase tracking-widest">
												{formatDistanceToNow(log.createdAt)} ago
											</span>
										</div>
									</div>

									<p className="text-sm font-bold text-gray-900 mb-2 leading-snug">
										{log.details}
									</p>

									<div className="flex flex-wrap items-center gap-4 pt-2 border-t border-gray-50 mt-3">
										<div className="flex items-center gap-1.5 overflow-hidden max-w-[150px]">
											<User size={12} className="text-gray-300" />
											<span className="text-[10px] font-bold text-gray-500 truncate">
												{log.userName}
											</span>
										</div>
										{showCompany && (
											<div className="flex items-center gap-1.5 overflow-hidden max-w-[150px]">
												<Building2 size={12} className="text-gray-300" />
												<span className="text-[10px] font-bold text-gray-500 truncate">
													{log.companyName}
												</span>
											</div>
										)}
										<div className="ml-auto inline-flex items-center gap-1 text-[10px] font-black text-gray-300 uppercase tracking-widest transition-colors group-hover:text-primary">
											Details{" "}
											<ChevronRight
												size={10}
												className={`transition-transform duration-300 ${isExpanded ? "rotate-90" : ""}`}
											/>
										</div>
									</div>

									{/* Metadata Inspector */}
									{isExpanded && log.metadata && (
										<div className="mt-6 pt-6 border-t border-gray-100 animate-in fade-in slide-in-from-top-2 duration-300">
											<div className="flex items-center gap-2 mb-4">
												<Database size={14} className="text-gray-300" />
												<h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
													Technical Metadata
												</h4>
											</div>
											<pre className="bg-gray-50 rounded-2xl p-6 text-[11px] font-mono text-gray-700 overflow-x-auto border border-gray-100 shadow-inner max-h-64 scrollbar-hide">
												{JSON.stringify(log.metadata, null, 2)}
											</pre>
											<div className="mt-4 flex justify-end">
												<div className="flex items-center gap-2 px-3 py-1.5 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary/10 transition-colors">
													Explore in Audit Log <ArrowRight size={12} />
												</div>
											</div>
										</div>
									)}
								</div>
							</div>
						</div>
					);
				})}

				{logs.length === 0 && (
					<div className="py-20 text-center space-y-4 opacity-30">
						<Activity size={48} className="mx-auto" />
						<p className="font-black uppercase tracking-widest text-sm">
							Quiet as a graveyard. No activity logged.
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
