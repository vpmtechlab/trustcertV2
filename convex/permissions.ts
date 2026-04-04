import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const PERMISSIONS_LIST = [
  "view_users",
  "manage_users",
  "run_verifications",
  "view_history",
  "view_billing",
  "manage_billing",
  "manage_settings",
];

const DEFAULT_ADMIN_PERMISSIONS = PERMISSIONS_LIST;
const DEFAULT_COMPLIANCE_OFFICER_PERMISSIONS = [
  "view_users",
  "run_verifications",
  "view_history",
];

export const getRolePermissions = query({
  args: {
    companyId: v.id("companies"),
    role: v.string(),
  },
  handler: async (ctx, args) => {
    const roleRecord = await ctx.db
      .query("rolePermissions")
      .withIndex("by_company_and_role", (q) =>
        q.eq("companyId", args.companyId).eq("role", args.role)
      )
      .first();

    if (roleRecord) {
      return roleRecord.permissions;
    }

    // Return defaults if no custom overrides exist for this role at this company
    if (args.role === "Admin") {
      return DEFAULT_ADMIN_PERMISSIONS;
    } else {
      return DEFAULT_COMPLIANCE_OFFICER_PERMISSIONS;
    }
  },
});

export const updateRolePermissions = mutation({
  args: {
    companyId: v.id("companies"),
    role: v.string(),
    permissions: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("rolePermissions")
      .withIndex("by_company_and_role", (q) =>
        q.eq("companyId", args.companyId).eq("role", args.role)
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { permissions: args.permissions });
    } else {
      await ctx.db.insert("rolePermissions", {
        companyId: args.companyId,
        role: args.role,
        permissions: args.permissions,
      });
    }
    return true;
  },
});

export const getUserCustomPermissions = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("User not found");
    return user.customPermissions || null;
  },
});

export const updateUserCustomPermissions = mutation({
  args: {
    userId: v.id("users"),
    customPermissions: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      customPermissions: args.customPermissions,
    });
    return true;
  },
});
