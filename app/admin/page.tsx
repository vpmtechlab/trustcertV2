"use client";

import React, { useContext } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AppContext } from "@/components/providers/app-provider";
import { 
  Building2, 
  Users, 
  DollarSign, 
  Activity,
} from "lucide-react";
import { Loader2 } from "lucide-react";

import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from "recharts";

export default function SuperAdminDashboard() {
  const { member } = useContext(AppContext);
  const metrics = useQuery(api.admin.getGlobalMetrics);
  const analytics = useQuery(api.admin.getAdminDashboardAnalytics, { days: 30 });

  if (metrics === undefined || analytics === undefined) {
    return (
      <div className="flex flex-col justify-center items-center h-screen space-y-4">
        <div className="relative">
           <Loader2 className="w-12 h-12 animate-spin text-primary" />
           <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                 <Activity size={12} className="text-primary animate-pulse" />
              </div>
           </div>
        </div>
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest animate-pulse">
           Calculating Global Intelligence...
        </p>
      </div>
    );
  }

  const stats = [
    {
      label: "Total Revenue",
      value: `$${metrics.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: "text-green-600",
      bg: "bg-green-100",
      trend: "+12.5%",
    },
    {
      label: "Active Companies",
      value: metrics.activeCompanies.toString(),
      icon: Building2,
      color: "text-blue-600",
      bg: "bg-blue-100",
      trend: "+2",
    },
    {
      label: "Total Users",
      value: metrics.totalUsers.toString(),
      icon: Users,
      color: "text-indigo-600",
      bg: "bg-indigo-100",
      trend: `+${analytics.trendData[analytics.trendData.length - 1].userCount}`,
    },
    {
      label: "Verifications Today",
      value: metrics.verificationsToday.toString(),
      icon: Activity,
      color: "text-orange-600",
      bg: "bg-orange-100",
      trend: "Live",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
             <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full">Super Admin</span>
             <h1 className="text-4xl font-black text-gray-900 tracking-tighter">
               Command Center
             </h1>
          </div>
          <p className="text-gray-500 text-sm font-medium">
            Welcome back, {member?.first_name || "Admin"}. Monitoring global platform health.
          </p>
        </div>
        <div className="text-right hidden lg:block">
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Platform Status</p>
           <div className="flex items-center gap-2 text-emerald-500 font-bold text-sm">
             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
             Systems Operational
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white p-6 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="flex items-center justify-between font-mono">
                <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="flex items-center text-emerald-600 text-[10px] font-black uppercase tracking-widest">
                  {stat.trend}
                </div>
              </div>
              <div className="mt-6">
                <h3 className="text-3xl font-black text-gray-900 tracking-tighter tabular-nums">{stat.value}</h3>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-1">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Analytics */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-gray-200/50 space-y-8">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                    <DollarSign size={24} />
                 </div>
                 <div>
                    <h3 className="text-xl font-black text-gray-900 tracking-tight">Revenue Analytics</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Past 30 Days Trends</p>
                 </div>
              </div>
              <div className="px-4 py-2 bg-gray-50 rounded-xl">
                 <span className="text-xl font-black text-emerald-600 tracking-tighter">${metrics.totalRevenue.toLocaleString()}</span>
              </div>
           </div>
           
           <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={analytics.trendData}>
                    <defs>
                       <linearGradient id="colorRevDashboard" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                       </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis 
                       dataKey="date" 
                       axisLine={false} 
                       tickLine={false} 
                       tick={{ fontSize: 10, fill: "#94a3b8", fontWeight: 700 }}
                       dy={10}
                    />
                    <YAxis 
                       axisLine={false} 
                       tickLine={false} 
                       tick={{ fontSize: 10, fill: "#94a3b8", fontWeight: 700 }}
                       tickFormatter={(v) => `$${v}`}
                    />
                    <Tooltip 
                       contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', padding: '12px' }}
                       labelStyle={{ fontWeight: 'black', color: '#111827', fontSize: '12px', marginBottom: '4px' }}
                    />
                    <Area 
                       type="monotone" 
                       dataKey="revenue" 
                       stroke="#10b981" 
                       strokeWidth={4}
                       fillOpacity={1} 
                       fill="url(#colorRevDashboard)" 
                    />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* User Growth */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-gray-200/50 space-y-8">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                    <Users size={24} />
                 </div>
                 <div>
                    <h3 className="text-xl font-black text-gray-900 tracking-tight">User Acquisition</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">New Registrations</p>
                 </div>
              </div>
              <div className="px-4 py-2 bg-indigo-50 rounded-xl">
                 <span className="text-xl font-black text-indigo-600 tracking-tighter">+{metrics.totalUsers}</span>
              </div>
           </div>

           <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={analytics.trendData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis 
                       dataKey="date" 
                       axisLine={false} 
                       tickLine={false} 
                       tick={{ fontSize: 10, fill: "#94a3b8", fontWeight: 700 }}
                       dy={10}
                    />
                    <YAxis 
                       axisLine={false} 
                       tickLine={false} 
                       tick={{ fontSize: 10, fill: "#94a3b8", fontWeight: 700 }}
                    />
                    <Tooltip 
                       cursor={{ fill: '#f8fafc' }}
                       contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', padding: '12px' }}
                       labelStyle={{ fontWeight: 'black', color: '#111827', fontSize: '12px', marginBottom: '4px' }}
                    />
                    <Bar 
                       dataKey="userCount" 
                       fill="#6366f1" 
                       radius={[10, 10, 0, 0]}
                    />
                 </BarChart>
              </ResponsiveContainer>
           </div>
        </div>
      </div>
    </div>
  );
}
