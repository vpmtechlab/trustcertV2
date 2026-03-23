import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getPrices = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("pricing").collect();
  },
});

export const getPriceByServiceId = query({
  args: { serviceId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("pricing")
      .withIndex("by_service", (q) => q.eq("serviceId", args.serviceId))
      .first();
  },
});

export const updatePrice = mutation({
  args: { pricingId: v.id("pricing"), newPrice: v.number() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.pricingId, {
      price: args.newPrice,
      updatedAt: Date.now()
    });
  },
});
