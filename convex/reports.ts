import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { recordAuditLog } from "./audit";

/**
 * Record a new report generation entry.
 */
export const createReport = mutation({
  args: {
    companyId: v.id("companies"),
    userId: v.id("users"),
    name: v.string(),
    type: v.string(),
    format: v.string(),
    status: v.string(),
    config: v.any(),
  },
  handler: async (ctx, args) => {
    const reportId = await ctx.db.insert("generatedReports", {
      ...args,
      createdAt: Date.now(),
    });

    await recordAuditLog(ctx, {
      companyId: args.companyId,
      userId: args.userId,
      action: "REPORT_GENERATED",
      entityId: reportId,
      entityType: "report",
      details: `${args.name} (${args.type}) was generated in ${args.format} format.`,
    });

    return reportId;
  },
});

/**
 * Fetch the latest reports for a specific company or user.
 */
export const listReports = query({
  args: {
    companyId: v.id("companies"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("generatedReports")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId))
      .order("desc")
      .take(args.limit || 5);
  },
});

/**
 * Remove a report record from history.
 */
export const deleteReport = mutation({
  args: { reportId: v.id("generatedReports") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.reportId);
  },
});
