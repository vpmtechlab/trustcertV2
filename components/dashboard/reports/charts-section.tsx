"use client";

import React from "react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LabelList
} from "recharts";
import { PieChart as PieIcon, BarChart3, TrendingUp, HelpCircle } from "lucide-react";

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

interface ChartDataPoint {
  date: string;
  count: number;
}

interface DistributionPoint {
  name: string;
  value: number;
}

interface RejectionPoint {
  reason: string;
  count: number;
  percentage: number;
}

interface ChartsSectionProps {
  analytics: {
    metrics: {
      totalJobs: number;
    };
    volumeData: ChartDataPoint[];
    serviceDistribution: DistributionPoint[];
    topReasons: RejectionPoint[];
  } | undefined;
}

export function ChartsSection({ analytics }: ChartsSectionProps) {
  const isLoading = analytics === undefined;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-96">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl animate-pulse" />
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 1. Main Volume Chart (Full Width) */}
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl space-y-6 group">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 text-primary rounded-xl">
               <TrendingUp size={20} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Verification Volume Trends</h3>
              <p className="text-xs text-gray-400 font-medium">Daily transaction volume across all services.</p>
            </div>
          </div>
          <div className="text-right">
             <span className="text-2xl font-black text-primary">+{Math.round(analytics.metrics.totalJobs / 7)}+</span>
             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Avg / Day</p>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={analytics.volumeData}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14a800" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#14a800" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
                width={30}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                labelStyle={{ fontWeight: 'bold' }}
              />
              <Area 
                type="monotone" 
                dataKey="count" 
                stroke="#14a800" 
                strokeWidth={4}
                fillOpacity={1} 
                fill="url(#colorCount)" 
                animationDuration={2000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 2. Service Distribution (Doughnut) */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl space-y-6">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                <PieIcon size={20} />
             </div>
             <h3 className="font-bold text-gray-900">Product Distribution</h3>
          </div>
          <div className="h-64 relative">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                   <Pie
                      data={analytics.serviceDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      animationDuration={1500}
                   >
                      {analytics.serviceDistribution.map((_entry: DistributionPoint, index: number) => (
                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                   </Pie>
                   <Tooltip />
                </PieChart>
             </ResponsiveContainer>
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <p className="text-sm font-bold text-gray-400 uppercase">Usage</p>
                <p className="text-xl font-black text-gray-900 leading-none">{analytics.metrics.totalJobs}</p>
             </div>
          </div>
          <div className="grid grid-cols-2 gap-y-2">
             {analytics.serviceDistribution.map((s: DistributionPoint, i: number) => (
                <div key={i} className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                   <span className="text-[11px] font-bold text-gray-600 truncate">{s.name}</span>
                </div>
             ))}
          </div>
        </div>

        {/* 3. Rejection Reasons (Horizontal Bar) */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl space-y-6">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-red-50 text-red-600 rounded-xl">
                <BarChart3 size={20} />
             </div>
             <h3 className="font-bold text-gray-900">Compliance Rejections</h3>
          </div>
          <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.topReasons} layout="vertical" margin={{ left: 20 }}>
                   <XAxis type="number" hide />
                   <YAxis 
                      dataKey="reason" 
                      type="category" 
                      axisLine={false} 
                      tickLine={false}
                      tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }}
                      width={100}
                   />
                   <Tooltip />
                   <Bar 
                      dataKey="count" 
                      fill="#ef4444" 
                      radius={[0, 10, 10, 0]}
                      barSize={20}
                   >
                      <LabelList dataKey="percentage" position="right" formatter={(v: number) => `${v}%`} style={{ fontSize: '10px', fontWeight: 'bold' }} />
                   </Bar>
                </BarChart>
             </ResponsiveContainer>
          </div>
          <p className="text-[10px] text-gray-400 flex items-center gap-1.5 font-bold uppercase tracking-widest mt-auto">
             <HelpCircle size={12} />
             Based on failure logs from the past 30 days.
          </p>
        </div>
      </div>
    </div>
  );
}
