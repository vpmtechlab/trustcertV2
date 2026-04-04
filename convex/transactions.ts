import { query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Fetch transaction history for a specific company.
 */
export const list = query({
  args: { 
    companyId: v.id("companies"),
    limit: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    const transactions = await ctx.db
      .query("transactions")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId))
      .order("desc")
      .take(args.limit || 50);

    return transactions;
  },
});
