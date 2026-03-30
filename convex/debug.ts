import { query } from "./_generated/server";

export const debugJobs = query({
  args: {},
  handler: async (ctx) => {
    const jobs = await ctx.db.query("jobs").collect();
    const companies = await ctx.db.query("companies").collect();
    return {
      jobCount: jobs.length,
      jobs: jobs.map(j => ({ id: j._id, companyId: j.companyId, status: j.resultStatus })),
      companies: companies.map(c => ({ id: c._id, name: c.name }))
    };
  }
});
