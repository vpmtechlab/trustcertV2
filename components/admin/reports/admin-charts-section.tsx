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
	LabelList,
} from "recharts";
import { PieChart as PieIcon, Building2, DollarSign } from "lucide-react";

interface TrendPoint {
	date: string;
	count: number;
	revenue: number;
}

interface LeaderboardPoint {
	name: string;
	count: number;
	revenue: number;
}

interface DistributionPoint {
	name: string;
	value: number;
}

interface AdminChartsSectionProps {
	analytics:
		| {
				metrics: {
					totalVerifications: number;
					totalRevenue: number;
				};
				trendData: TrendPoint[];
				leaderboard: LeaderboardPoint[];
				serviceDistribution: DistributionPoint[];
		  }
		| undefined;
}

const COLORS = ["#10b981", "#3b82f6", "#6366f1", "#f59e0b", "#ef4444"];

export function AdminChartsSection({ analytics }: AdminChartsSectionProps) {
	const isLoading = analytics === undefined;

	if (isLoading) {
		return (
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[400px]">
				<div className="bg-white rounded-3xl border border-gray-100 shadow-xl animate-pulse" />
				<div className="bg-white rounded-3xl border border-gray-100 shadow-xl animate-pulse" />
			</div>
		);
	}

	return (
		<div className="space-y-8">
			{/* 1. Global Platform Revenue Trends */}
			<div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl space-y-8 group">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
							<DollarSign size={20} />
						</div>
						<div>
							<h3 className="font-bold text-gray-900">
								Platform Revenue Trends
							</h3>
							<p className="text-xs text-gray-400 font-medium tracking-tight">
								Global income performance over the selected period.
							</p>
						</div>
					</div>
					<div className="text-right">
						<span className="text-2xl font-black text-emerald-600 tracking-tighter">
							${analytics.metrics.totalRevenue.toLocaleString()}
						</span>
						<p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">
							Total Collected
						</p>
					</div>
				</div>

				<div className="h-72 w-full">
					<ResponsiveContainer width="100%" height="100%">
						<AreaChart data={analytics.trendData}>
							<defs>
								<linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
									<stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
									<stop offset="95%" stopColor="#10b981" stopOpacity={0} />
								</linearGradient>
							</defs>
							<CartesianGrid
								strokeDasharray="3 3"
								vertical={false}
								stroke="#f0f0f0"
							/>
							<XAxis
								dataKey="date"
								axisLine={false}
								tickLine={false}
								tick={{ fontSize: 10, fill: "#94a3b8", fontWeight: 600 }}
								dy={10}
							/>
							<YAxis
								axisLine={false}
								tickLine={false}
								tick={{ fontSize: 10, fill: "#94a3b8", fontWeight: 600 }}
								width={40}
								tickFormatter={(v) => `$${v}`}
							/>
							<Tooltip
								contentStyle={{
									borderRadius: "16px",
									border: "none",
									boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
								}}
							/>
							<Area
								type="monotone"
								dataKey="revenue"
								stroke="#10b981"
								strokeWidth={4}
								fill="url(#colorRevenue)"
								animationDuration={2000}
							/>
						</AreaChart>
					</ResponsiveContainer>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				{/* 2. Client Performance Leaderboard */}
				<div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl space-y-6">
					<div className="flex items-center gap-3">
						<div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
							<Building2 size={20} />
						</div>
						<div>
							<h3 className="font-bold text-gray-900">Client Leaderboard</h3>
							<p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
								Top 5 by Vol.
							</p>
						</div>
					</div>
					<div className="h-64">
						<ResponsiveContainer width="100%" height="100%">
							<BarChart
								data={analytics.leaderboard}
								layout="vertical"
								margin={{ left: 20 }}
							>
								<XAxis type="number" hide />
								<YAxis
									dataKey="name"
									type="category"
									axisLine={false}
									tickLine={false}
									tick={{ fontSize: 10, fill: "#64748b", fontWeight: 600 }}
									width={100}
								/>
								<Tooltip />
								<Bar
									dataKey="count"
									fill="#3b82f6"
									radius={[0, 10, 10, 0]}
									barSize={20}
								>
									<LabelList
										dataKey="count"
										position="right"
										style={{ fontSize: "10px", fontWeight: "bold" }}
									/>
								</Bar>
							</BarChart>
						</ResponsiveContainer>
					</div>
				</div>

				{/* 3. Global Service Distribution */}
				<div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl space-y-6">
					<div className="flex items-center gap-3">
						<div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
							<PieIcon size={20} />
						</div>
						<h3 className="font-bold text-gray-900">Product Popularity</h3>
					</div>
					<div className="h-64 relative">
						<ResponsiveContainer width="100%" height="100%">
							<PieChart>
								<Pie
									data={analytics.serviceDistribution}
									cx="50%"
									cy="50%"
									innerRadius={60}
									outerRadius={85}
									paddingAngle={5}
									dataKey="value"
								>
									{analytics.serviceDistribution.map((_entry, index) => (
										<Cell
											key={`cell-${index}`}
											fill={COLORS[index % COLORS.length]}
										/>
									))}
								</Pie>
								<Tooltip />
							</PieChart>
						</ResponsiveContainer>
						<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
							<p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">
								Global
							</p>
							<p className="text-xl font-black text-gray-900 leading-none">
								{analytics.metrics.totalVerifications}
							</p>
							<p className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">
								Total Hits
							</p>
						</div>
					</div>
					<div className="grid grid-cols-2 gap-y-2 pt-2 border-t border-gray-50">
						{analytics.serviceDistribution.map((s, i) => (
							<div key={i} className="flex items-center gap-2">
								<div
									className="w-2 h-2 rounded-full"
									style={{ backgroundColor: COLORS[i % COLORS.length] }}
								/>
								<span className="text-[10px] font-bold text-gray-600 uppercase tracking-tight truncate">
									{s.name}
								</span>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
