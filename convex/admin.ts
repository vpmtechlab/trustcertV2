import { query } from "./_generated/server";
import { v } from "convex/values";

/**
 * Super Admin Queries
 * These should eventually include auth guards to ensure the caller is a VPMTechLab user.
 */

export const getAllCompanies = query({
  args: {},
  handler: async (ctx) => {
    const companies = await ctx.db.query("companies").collect();
    
    // Attach statistics to each company
    const enrichedCompanies = await Promise.all(
      companies.map(async (company) => {
        const users = await ctx.db
          .query("users")
          .withIndex("by_company", (q) => q.eq("companyId", company._id))
          .collect();
          
        const jobs = await ctx.db
          .query("jobs")
          .withIndex("by_company", (q) => q.eq("companyId", company._id))
          .collect();

        const balanceDoc = await ctx.db
          .query("balances")
          .withIndex("by_company", (q) => q.eq("companyId", company._id))
          .first();

        return {
          ...company,
          userCount: users.length,
          verificationCount: jobs.length,
          availableBalance: balanceDoc?.availableBalance || 0,
        };
      })
    );

    return enrichedCompanies;
  },
});

export const getGlobalMetrics = query({
  args: {},
  handler: async (ctx) => {
    const companies = await ctx.db.query("companies").collect();
    const jobs = await ctx.db.query("jobs").collect();
    const users = await ctx.db.query("users").collect();

    const totalRevenue = jobs.reduce((sum, job) => sum + (job.feesCharged || 0), 0);
    const activeCompanies = companies.filter(c => c.status === "active").length;

    // Daily verifications
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    const recentJobs = jobs.filter(j => j.createdAt > oneDayAgo);

    return {
      totalRevenue,
      totalCompanies: companies.length,
      activeCompanies,
      totalUsers: users.length,
      totalVerifications: jobs.length,
      verificationsToday: recentJobs.length,
    };
  },
});

export const getAllUsers = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    
    // Enrich with company names
    return await Promise.all(
      users.map(async (user) => {
        const company = await ctx.db.get(user.companyId);
        return {
          ...user,
          companyName: company?.name || "Unknown",
          isSuperAdmin: company?.isSuperAdmin || false,
        };
      })
    );
  },
});

export const getAllJobs = query({
  args: {},
  handler: async (ctx) => {
    const jobs = await ctx.db.query("jobs").order("desc").take(100); // Limit to recent 100 for now
    
    // Enrich with company and user names
    return await Promise.all(
      jobs.map(async (job) => {
        const company = await ctx.db.get(job.companyId);
        const user = await ctx.db.get(job.userId);
        return {
          ...job,
          companyName: company?.name || "Unknown",
          userName: `${user?.firstName} ${user?.surname}` || "Unknown",
        };
      })
    );
  },
});

