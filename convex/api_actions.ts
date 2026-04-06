import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import { Id } from "./_generated/dataModel";

/**
 * Main entry point for REST API Verifications.
 * This action:
 * 1. Validates the API Key
 * 2. Checks company balance
 * 3. Deducts fees
 * 4. Initiates a verification job
 */
export const verifyAndRun = action({
  args: {
    apiKey: v.string(),
    serviceType: v.string(), // e.g. "BRS"
    entityData: v.record(v.string(), v.any()),     // JSON Payload
    webhookUrl: v.optional(v.string()), // Optional callback
  },
  handler: async (ctx, args): Promise<{
    success: boolean;
    status: number;
    message: string;
    jobId?: Id<"jobs">;
    metadata?: {
      feesCharged: number;
      balanceRemaining: string;
    };
  }> => {
    // 1. Authenticate API Key
    const company = await ctx.runQuery(api.users.verifyApiKey, { apiKey: args.apiKey });
    if (!company) {
      return { success: false, status: 401, message: "Invalid or inactive API Key." };
    }

    // 2. Resolve Service Pricing
    const pricing = await ctx.runQuery(api.pricing.getPriceByServiceId, { serviceId: args.serviceType });
    const fee = pricing?.price || 15.0; // Default fallback

    // 3. Check & Deduct Balance
    try {
      await ctx.runMutation(api.users.deductBalance, { 
        companyId: company._id, 
        amount: fee 
      });
    } catch (err: unknown) {
      const error = err as Error;
      if (error.message === "Insufficient balance") {
        return { success: false, status: 402, message: "Insufficient balance to perform this operation." };
      }
      return { success: false, status: 500, message: "Internal billing error." };
    }

    // 4. Find an admin user to attribute the job to (API jobs need an owner)
    const users = await ctx.runQuery(api.users.listUsers, { companyId: company._id, role: "admin" });
    const ownerId = users[0]?.id;

    if (!ownerId) {
        return { success: false, status: 500, message: "No active administrator found for this organization." };
    }

    // 5. Create the Verification Job
    const jobId = await ctx.runMutation(api.verifications.createVerification, {
      companyId: company._id,
      userId: ownerId,
      serviceType: args.serviceType,
      entityData: args.entityData,
      source: "rest_api",
      feesCharged: fee,
    });

    // 6. Trigger the "AI Engine" (Simulated async check)
    // Note: In this prototype, completeVerification is usually called by the AI agent logic.
    // We'll return the JOB ID so the client can poll, or we'd trigger a background action here.
    
    return { 
      success: true, 
      status: 201, 
      jobId, 
      message: "Verification job initiated successfully.",
      metadata: {
        feesCharged: fee,
        balanceRemaining: "Check dashboard for details"
      }
    };
  },
});
