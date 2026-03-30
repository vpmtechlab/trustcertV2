import { TrendingUp, CheckCircle, FileText, AlertTriangle } from "lucide-react";

interface MetricsGridProps {
  analytics: {
    metrics: {
      complianceScore: number;
      totalJobs: number;
      pendingReviews: number;
      failureRate: number;
    };
  } | undefined;
}

export function MetricsGrid({ analytics }: MetricsGridProps) {
  const isLoading = analytics === undefined;
  
  const stats = [
    {
      label: "Compliance Score",
      value: isLoading || !analytics ? "--" : `${analytics.metrics.complianceScore}%`,
      trend: "+4% from last period",
      icon: <CheckCircle className="text-green-500" size={20} />,
      color: "text-green-600",
      bgColor: "bg-green-50",
      isScore: true
    },
    {
      label: "Total Verifications",
      value: isLoading || !analytics ? "--" : analytics.metrics.totalJobs.toLocaleString(),
      trend: "Verification Volume",
      icon: <FileText className="text-blue-600" size={20} />,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      label: "Failure Rate",
      value: isLoading || !analytics ? "--" : `${analytics.metrics.failureRate}%`,
      trend: analytics?.metrics && analytics.metrics.failureRate > 15 ? "Requires Attention" : "Within Range",
      icon: analytics?.metrics && analytics.metrics.failureRate > 15 ? <AlertTriangle className="text-red-500" size={20} /> : <TrendingUp className="text-amber-500" size={20} />,
      color: analytics?.metrics && analytics.metrics.failureRate > 15 ? "text-red-600" : "text-amber-600",
      bgColor: analytics?.metrics && analytics.metrics.failureRate > 15 ? "bg-red-50" : "bg-amber-50"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, i) => (
        <div 
          key={i} 
          className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 flex items-center justify-between group"
        >
          <div className="space-y-3">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-4xl font-black text-gray-900 tracking-tighter tabular-nums">{stat.value}</h3>
            </div>
            <p className={`text-[10px] font-bold ${stat.color} flex items-center gap-1.5 uppercase tracking-wider`}>
               {stat.trend}
            </p>
          </div>
          
          {stat.isScore ? (
            <div className={`w-20 h-20 rounded-full border-8 border-green-500 border-t-gray-100 flex items-center justify-center rotate-45 group-hover:rotate-0 transition-transform duration-700`}>
              <div className="-rotate-45 group-hover:rotate-0 transition-transform duration-700">
                 {stat.icon}
              </div>
            </div>
          ) : (
            <div className={`w-14 h-14 ${stat.bgColor} ${stat.color} rounded-2xl flex items-center justify-center shadow-inner group-hover:rotate-12 transition-transform`}>
              {stat.icon}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
