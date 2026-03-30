import { query } from "./_generated/server";

/**
 * Returns the "VPMTechLab" super admin company for dev/poc purposes.
 * This is used to provide context in the current demonstration flow.
 */
export const getDefaultCompany = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("companies")
      .withIndex("by_name", (q) => q.eq("name", "VPMTechLab"))
      .first();
  },
});
