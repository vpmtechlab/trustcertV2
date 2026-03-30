import { query, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { MutationCtx } from "./_generated/server";

/**
 * Internal helper to record an audit log.
 * Can be used within mutations.
 */
export async function recordAuditLog(ctx: MutationCtx, args: {
  companyId?: Id<"companies">;
  userId?: Id<"users">;
  action: string;
  entityId?: string;
  entityType?: string;
  details: string;
  metadata?: Record<string, unknown>;
}) {
  await ctx.db.insert("auditLogs", {
    ...args,
    createdAt: Date.now(),
  });
}

/**
 * Record an audit log entry via internal mutation.
 */
export const recordLog = internalMutation({
  args: {
    companyId: v.optional(v.id("companies")),
    userId: v.optional(v.id("users")),
    action: v.string(),
    entityId: v.optional(v.string()),
    entityType: v.optional(v.string()),
    details: v.string(),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    await recordAuditLog(ctx, args);
  },
});

/**
 * Fetch audit logs for a specific company.
 * Used by client-side dashboard audit view.
 */
export const getAuditLogsByCompany = query({
  args: { companyId: v.id("companies") },
  handler: async (ctx, args) => {
    const logs = await ctx.db
      .query("auditLogs")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId))
      .order("desc")
      .collect();

    // Enrich with user information
    return await Promise.all(
      logs.map(async (log) => {
        const user = log.userId ? await ctx.db.get(log.userId) : null;
        return {
          ...log,
          userName: user ? `${user.firstName} ${user.surname}` : "System",
        };
      })
    );
  },
});

/**
 * Fetch all audit logs across the platform.
 * Used by super-admin audit view.
 */
export const getGlobalAuditLogs = query({
  args: {},
  handler: async (ctx) => {
    const logs = await ctx.db
      .query("auditLogs")
      .order("desc")
      .take(100);

    // Enrich with company and user information
    return await Promise.all(
      logs.map(async (log) => {
        const user = log.userId ? await ctx.db.get(log.userId) : null;
        const company = log.companyId ? await ctx.db.get(log.companyId) : null;
        return {
          ...log,
          userName: user ? `${user.firstName} ${user.surname}` : "System",
          companyName: company?.name || "Global",
        };
      })
    );
  },
});

/**
 * Internal helper to record a notification.
 */
export async function recordNotification(ctx: MutationCtx, args: {
  companyId: Id<"companies">;
  userId?: Id<"users">;
  title: string;
  message: string;
  type?: "info" | "success" | "warning" | "error";
}) {
  await ctx.db.insert("notifications", {
    companyId: args.companyId,
    userId: args.userId,
    title: args.title,
    message: args.message,
    type: args.type || "info",
    isRead: false,
    createdAt: Date.now(),
  });
}

/**
 * Fetch notifications for a company.
 */
export const getActiveNotificationsByCompany = query({
  args: { companyId: v.id("companies") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("notifications")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId))
      .order("desc")
      .take(50);
  },
});

/**
 * Mark all notifications as read for a company.
 */
import { mutation } from "./_generated/server";
export const clearNotifications = mutation({
  args: { companyId: v.id("companies") },
  handler: async (ctx, args) => {
    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId))
      .filter((q) => q.eq(q.field("isRead"), false))
      .collect();

    for (const n of notifications) {
      await ctx.db.patch(n._id, { isRead: true });
    }
  },
});

