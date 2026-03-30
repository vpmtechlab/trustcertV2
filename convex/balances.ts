import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { recordNotification } from "./audit";

/**
 * Fetch the available balance for a specific company.
 */
export const getAvailableBalance = query({
  args: { companyId: v.id("companies") },
  handler: async (ctx, args) => {
    const balance = await ctx.db
      .query("balances")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId))
      .first();

    return balance?.availableBalance ?? 0;
  },
});

/**
 * Add funds to a company balance (Simulated for Demo).
 */
export const addFunds = mutation({
  args: {
    companyId: v.id("companies"),
    userId: v.id("users"),
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    const balance = await ctx.db
      .query("balances")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId))
      .first();

    if (!balance) {
      await ctx.db.insert("balances", {
        companyId: args.companyId,
        availableBalance: args.amount,
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.patch(balance._id, {
        availableBalance: balance.availableBalance + args.amount,
        updatedAt: Date.now(),
      });
    }

    // Record the transaction
    await ctx.db.insert("transactions", {
      companyId: args.companyId,
      type: "top_up",
      amount: args.amount,
      status: "success",
      createdAt: Date.now(),
    });

    // Record notification instead of audit log
    await recordNotification(ctx, {
      companyId: args.companyId,
      userId: args.userId,
      title: "Funds Added",
      message: `Successfully added $${args.amount.toLocaleString()} to your available balance.`,
      type: "success",
    });

    return true;
  },
});
