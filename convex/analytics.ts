import { query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Aggregates high-level stats for the Analytics overview.
 */
export const getStatsOverview = query({
  args: { companyId: v.id("companies") },
  handler: async (ctx, args) => {
    const jobs = await ctx.db
      .query("jobs")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId))
      .collect();

    const totalVerifications = jobs.length;
    const successCount = jobs.filter((j) => j.resultStatus === "approved").length;
    const successRate = totalVerifications > 0 ? (successCount / totalVerifications) * 100 : 0;

    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const recentJobs = jobs.filter((j) => j.createdAt >= thirtyDaysAgo);
    const activeUsers = new Set(recentJobs.map((j) => j.userId.toString())).size;

    console.log(`[Analytics] Stats for ${args.companyId}: Total=${totalVerifications}, Success=${successCount}`);

    return {
      totalVerifications: {
        value: totalVerifications.toLocaleString(),
        change: totalVerifications > 0 ? `+${totalVerifications}` : "0",
        trend: "up" as const,
      },
      successRate: {
        value: `${successRate.toFixed(1)}%`,
        change: "0%",
        trend: "up" as const,
      },
      activeUsers: {
        value: activeUsers.toString(),
        change: "0",
        trend: "up" as const,
      },
      avgProcessingTime: {
        value: totalVerifications > 0 ? "1.2s" : "0s",
        change: "0s",
        trend: "up" as const,
      }
    };
  },
});

/**
 * Provides month-wise verification volume for the Trend Chart.
 */
export const getTrendData = query({
  args: { companyId: v.id("companies") },
  handler: async (ctx, args) => {
    const jobs = await ctx.db
      .query("jobs")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId))
      .collect();

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentYear = new Date().getFullYear();

    const volumeByMonth = months.map((month, index) => {
      const count = jobs.filter((j) => {
        const date = new Date(j.createdAt);
        return date.getMonth() === index && date.getFullYear() === currentYear;
      }).length;

      return { label: month, volume: count };
    });

    return volumeByMonth;
  },
});

/**
 * Breakdown of verification statuses for the Distribution Chart.
 */
export const getStatusBreakdown = query({
  args: { companyId: v.id("companies") },
  handler: async (ctx, args) => {
    const jobs = await ctx.db
      .query("jobs")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId))
      .collect();

    const statuses = [
      { name: "Approved", key: "approved", color: "#10b981" },
      { name: "Failed", key: "failed", color: "#ef4444" },
      { name: "Pending", key: "pending", color: "#f59e0b" },
      { name: "Not Found", key: "not_found_on_list", color: "#6b7280" },
    ];

    return statuses.map((s) => ({
      name: s.name,
      value: jobs.filter((j) => j.resultStatus === s.key).length,
      fill: s.color,
    }));
  },
});

/**
 * Weekly comparison (Current Week vs Last Week).
 */
export const getWeeklyComparison = query({
  args: { companyId: v.id("companies") },
  handler: async (ctx, args) => {
    const jobs = await ctx.db
      .query("jobs")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId))
      .collect();

    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const now = new Date();
    
    // Get current week boundaries
    const startOfCurrentWeek = new Date(now);
    startOfCurrentWeek.setDate(now.getDate() - (now.getDay() === 0 ? 6 : now.getDay() - 1));
    startOfCurrentWeek.setHours(0, 0, 0, 0);

    const startOfLastWeek = new Date(startOfCurrentWeek);
    startOfLastWeek.setDate(startOfCurrentWeek.getDate() - 7);

    return days.map((day, index) => {
      const currentDayStart = new Date(startOfCurrentWeek);
      currentDayStart.setDate(startOfCurrentWeek.getDate() + index);
      const currentDayEnd = new Date(currentDayStart);
      currentDayEnd.setDate(currentDayStart.getDate() + 1);

      const lastDayStart = new Date(startOfLastWeek);
      lastDayStart.setDate(startOfLastWeek.getDate() + index);
      const lastDayEnd = new Date(lastDayStart);
      lastDayEnd.setDate(lastDayStart.getDate() + 1);

      const currentCount = jobs.filter(j => j.createdAt >= currentDayStart.getTime() && j.createdAt < currentDayEnd.getTime()).length;
      const previousCount = jobs.filter(j => j.createdAt >= lastDayStart.getTime() && j.createdAt < lastDayEnd.getTime()).length;

      return { day, current: currentCount, previous: previousCount };
    });
  },
});

