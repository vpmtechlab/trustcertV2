import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import bcrypt from "bcryptjs";

// Mock to verify an API key
export const verifyApiKey = query({
  args: { apiKey: v.string() },
  handler: async (ctx, args) => {
    const keyRecord = await ctx.db
      .query("apiKeys")
      .filter((q) => q.eq(q.field("keyHash"), args.apiKey))
      .first();

    if (!keyRecord || !keyRecord.isActive) {
      return null;
    }

    const company = await ctx.db.get(keyRecord.companyId);
    return company;
  },
});

export const deductBalance = mutation({
  args: { companyId: v.id("companies"), amount: v.number() },
  handler: async (ctx, args) => {
    const balanceRecord = await ctx.db
      .query("balances")
      .withIndex("by_company", (q) => q.eq("companyId", args.companyId))
      .first();

    if (!balanceRecord) {
      throw new Error("Company balance not found");
    }

    if (balanceRecord.availableBalance < args.amount) {
      throw new Error("Insufficient balance");
    }

    // Deduct balance
    await ctx.db.patch(balanceRecord._id, {
      availableBalance: balanceRecord.availableBalance - args.amount,
      updatedAt: Date.now(),
    });

    // Record the transaction
    await ctx.db.insert("transactions", {
      companyId: args.companyId,
      type: "verification_fee",
      amount: args.amount,
      status: "success",
      createdAt: Date.now(),
    });

    return true;
  },
});

export const createCompanyAndUser = mutation({
  args: {
    companyName: v.string(),
    regNumber: v.string(),
    country: v.string(),
    location: v.string(),
    domain: v.string(),
    firstName: v.string(),
    surname: v.string(),
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if user email already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existingUser) {
      throw new Error("User with this email already exists.");
    }

    // 1. Create company
    const companyId = await ctx.db.insert("companies", {
      name: args.companyName,
      reg_number: args.regNumber,
      country: args.country,
      location: args.location,
      domain: args.domain,
      support_email: args.email,
      status: "active",
      createdAt: Date.now(),
    });

    // Hash the password before saving
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(args.password, salt);

    // 2. Create the user
    const userId = await ctx.db.insert("users", {
      companyId,
      firstName: args.firstName,
      surname: args.surname,
      email: args.email,
      password: hashedPassword,
      role: "admin",
      status: "active",
      createdAt: Date.now(),
    });

    // 3. Initialize company balance
    await ctx.db.insert("balances", {
      companyId,
      availableBalance: 0,
      updatedAt: Date.now(),
    });

    return { companyId, userId };
  },
});

export const login = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Compare passwords
    if (!user.password) {
      throw new Error("Invalid email or password");
    }
    const isMatch = bcrypt.compareSync(args.password, user.password);
    if (!isMatch) {
      throw new Error("Invalid email or password");
    }

    if (user.status !== "active") {
      throw new Error("Account is inactive. Please contact support.");
    }

    return {
      userId: user._id,
      companyId: user.companyId,
      role: user.role,
      email: user.email,
    };
  },
});
