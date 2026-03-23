import React from "react";
import { Bell, AlertTriangle, CheckCircle, Info } from "lucide-react";
import Link from "next/link";

export function RecentAlerts() {
  const alerts = [
    {
      id: 1,
      title: "System Maintenance Scheduled",
      message: "We will be performing maintenance on Jan 28, 2025 at 2:00 AM.",
      type: "info",
      time: "2 hours ago",
    },
    {
      id: 2,
      title: "Verification Failed",
      message:
        "Verification for 'TechCorp Ltd' failed due to missing documents.",
      type: "error",
      time: "5 hours ago",
    },
    {
      id: 3,
      title: "New Feature Available",
      message: "You can now export reports in CSV format.",
      type: "success",
      time: "1 day ago",
    },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case "error":
        return <AlertTriangle size={18} className="text-red-500" />;
      case "success":
        return <CheckCircle size={18} className="text-green-500" />;
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
      default:
        return "bg-blue-50 border-blue-100";
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Bell size={20} className="text-gray-400" />
          Recent Alerts
        </h2>
        <Link href="/dashboard/notifications" className="text-xs text-primary font-medium hover:underline">
          View All
        </Link>
      </div>

      <div className="space-y-3">
        {alerts.map((alert) => (
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
                {alert.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
