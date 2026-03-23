import { query, mutation, action } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { api } from "./_generated/api";

// Simulate external data engine payloads (BRS, iTax, DCI)
const generateMockPayload = (serviceType: string, requestData: any) => {
  const isKRA = serviceType.toLowerCase().includes("kra") || serviceType.toLowerCase().includes("pin");
  const isAML = serviceType.toLowerCase().includes("aml");

  if (isKRA) {
    return {
      pin: requestData.pin || "P000000000X",
      taxpayerName: requestData.firstName ? `${requestData.firstName} ${requestData.lastName || requestData.surname}`.trim() : "JOHN DOE",
      taxpayerType: "Individual",
      status: "Active",
      registrationDate: "2015-06-12",
      station: "Nairobi North",
    };
  }

  if (isAML) {
    return {
      watchlistsChecked: ["OFAC", "UN", "EU", "HMT"],
      hits: 0,
      riskLevel: "Low",
      pepStatus: false,
      sanctionStatus: "Clear"
    };
  }

  // Default BRS/Company
  return {
    registrationNumber: requestData.companyNumber || "PVT-XY12345",
    companyName: requestData.companyName || "VERIFIED COMPANY LTD",
    status: "Registered",
    dateOfIncorporation: "2020-01-15",
    directors: [
      { name: "Jane Doe", idNumber: "12345678", nationality: "Kenyan" },
      { name: "John Smith", idNumber: "87654321", nationality: "Kenyan" }
    ],
    address: {
      poBox: requestData.postalAddress || "123-00100",
      city: "Nairobi",
      building: "Trust Tower"
    }
  };
};

export const getVerificationsByCompany = query({
  args: { companyId: v.id("companies") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("jobs")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId))
      .order("desc")
      .collect();
  },
});

export const getVerificationById = query({
  args: { jobId: v.id("jobs") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.jobId);
  },
});

export const createVerification = mutation({
  args: {
    companyId: v.id("companies"),
    userId: v.id("users"),
    serviceType: v.string(),
    entityData: v.any(),
    source: v.string(),
    feesCharged: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const jobId = await ctx.db.insert("jobs", {
      companyId: args.companyId,
      userId: args.userId,
      serviceType: args.serviceType,
      entityData: args.entityData,
      resultStatus: "pending",
      source: args.source,
      feesCharged: args.feesCharged,
      createdAt: Date.now(),
    });
    return jobId;
  },
});

export const completeVerification = mutation({
  args: {
    jobId: v.id("jobs"),
    resultStatus: v.string(),
    message: v.optional(v.string()),
    resultPayload: v.any(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.jobId, {
      resultStatus: args.resultStatus,
      message: args.message,
      resultPayload: args.resultPayload,
    });
  },
});

export const runVerification = action({
  args: {
    companyId: v.id("companies"),
    userId: v.id("users"),
    serviceType: v.string(),
    entityData: v.any(),
    source: v.string(),
  },
  handler: async (ctx, args): Promise<{ jobId: Id<"jobs">; resultStatus: string; data: any }> => {
    // 1. Fetch dynamic price
    const pricing = await ctx.runQuery(api.pricing.getPriceByServiceId, { 
      serviceId: args.serviceType 
    });
    const verificationCost = pricing ? pricing.price : 15.00; // Fallback

    // 2. Deduct Balance
    await ctx.runMutation(api.users.deductBalance, { 
      companyId: args.companyId, 
      amount: verificationCost 
    });

    // 3. Create Pending Job
    const jobId = (await ctx.runMutation(api.verifications.createVerification, {
      companyId: args.companyId,
      userId: args.userId,
      serviceType: args.serviceType,
      entityData: args.entityData,
      source: args.source,
      feesCharged: verificationCost,
    })) as Id<"jobs">;

    // 4. Simulate Data Engine Processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // 5. Generate Mock Response and Complete Job
    const mockPayload = generateMockPayload(args.serviceType, args.entityData);
    
    await ctx.runMutation(api.verifications.completeVerification, {
      jobId,
      resultStatus: "approved",
      message: "Verification completed successfully",
      resultPayload: mockPayload
    });

    return { jobId, resultStatus: "approved", data: mockPayload };
  },
});
