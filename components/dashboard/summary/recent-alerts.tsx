import React, { useContext } from "react";
import { Bell, AlertTriangle, CheckCircle, Info, Loader2 } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AppContext } from "@/components/providers/app-provider";
import { Id } from "@/convex/_generated/dataModel";

export function RecentAlerts() {
	const { member } = useContext(AppContext);
	const notifications = useQuery(
		api.notifications.getRecent,
		member?.id ? { userId: member.id as Id<"users"> } : "skip",
	);

	const getIcon = (type: string) => {
		switch (type) {
			case "error":
				return <AlertTriangle size={18} className="text-red-500" />;
			case "success":
				return <CheckCircle size={18} className="text-green-500" />;
			case "warning":
				return <AlertTriangle size={18} className="text-amber-500" />;
			default:
				return <Info size={18} className="text-blue-500" />;
		}
	};

	const getBgColor = (type: string) => {
		switch (type) {
			case "error":
				return "bg-red-50 border-red-100";
			case "success":
				return "bg-green-50 border-green-100";
			case "warning":
				return "bg-amber-50 border-amber-100";
			default:
				return "bg-blue-50 border-blue-100";
		}
	};

	const [now, setNow] = React.useState(0);

	React.useEffect(() => {
		setNow(Date.now());
	}, []);

	const formatTime = (timestamp: number) => {
		if (now === 0) return "...";
		const seconds = Math.floor((now - timestamp) / 1000);
		if (seconds < 60) return "just now";
		const minutes = Math.floor(seconds / 60);
		if (minutes < 60) return `${minutes}m ago`;
		const hours = Math.floor(minutes / 60);
		if (hours < 24) return `${hours}h ago`;
		return new Date(timestamp).toLocaleDateString();
	};

	return (
		<div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-full">
			<div className="flex items-center justify-between mb-4">
				<h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
					<Bell size={20} className="text-gray-400" />
					Recent Alerts
				</h2>
			</div>

			<div className="space-y-3">
				{!notifications ? (
					<div className="flex justify-center p-8">
						<Loader2 className="w-6 h-6 animate-spin text-gray-300" />
					</div>
				) : notifications.length === 0 ? (
					<div className="text-center p-8 text-gray-500 text-sm">
						No recent alerts.
					</div>
				) : (
					notifications.slice(0, 5).map((alert) => (
						<div
							key={alert.id}
							className={`p-3 rounded-xl border ${getBgColor(alert.type)} flex gap-3 items-start`}
						>
							<div className="mt-0.5 shrink-0">{getIcon(alert.type)}</div>
							<div>
								<h3 className="text-sm font-semibold text-gray-900">
									{alert.title}
								</h3>
								<p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
									{alert.message}
								</p>
								<p className="text-[10px] text-gray-400 mt-2 font-medium">
									{formatTime(alert.createdAt)}
								</p>
							</div>
						</div>
					))
				)}
			</div>
		</div>
	);
}
