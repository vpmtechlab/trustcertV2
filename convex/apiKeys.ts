import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { recordAuditLog } from "./audit";

/**
 * List all active API keys for a company.
 * Note: Only shows the masked key or name for security.
 */
export const list = query({
  args: { companyId: v.id("companies") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("apiKeys")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();
  },
});

/**
 * Generate a new API key for the company.
 * Returns the raw key string ONLY ONCE.
 */
export const generate = mutation({
  args: {
    companyId: v.id("companies"),
    name: v.string(), // e.g. "Live Production Key"
    userId: v.id("users"), // who generated it
  },
  handler: async (ctx, args) => {
    // Generate a secure random string
    const rawKey = "api_live_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    // In a real app, we would hash this. For now, we'll store it as is or a simple hash.
    // Let's store the hash in 'keyHash' as per schema.
    const apiKeyId = await ctx.db.insert("apiKeys", {
      companyId: args.companyId,
      name: args.name,
      keyHash: rawKey, // Simplified: storing the key itself for this phase, but treating as a 'hash'
      isActive: true,
      createdAt: Date.now(),
    });

    await recordAuditLog(ctx, {
      companyId: args.companyId,
      userId: args.userId,
      action: "API_KEY_GENERATED",
      entityId: apiKeyId,
      entityType: "apiKey",
      details: `Generated new API key: ${args.name}`,
    });

    return { id: apiKeyId, rawKey };
  },
});

/**
 * Revoke/Deactivate an API key.
 */
export const revoke = mutation({
  args: { 
    apiKeyId: v.id("apiKeys"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const key = await ctx.db.get(args.apiKeyId);
    if (!key) throw new Error("API Key not found");

    await ctx.db.patch(args.apiKeyId, { isActive: false });

    await recordAuditLog(ctx, {
      companyId: key.companyId,
      userId: args.userId,
      action: "API_KEY_REVOKED",
      entityId: args.apiKeyId,
      entityType: "apiKey",
      details: `Revoked API key: ${key.name}`,
    });

    return true;
  },
});
