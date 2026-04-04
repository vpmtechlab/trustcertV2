import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { generateSecret, verify, generateURI } from "otplib";
import { recordAuditLog } from "./audit";

/**
 * Generate a new TOTP secret for a user.
 * This is the first step of enabling 2FA.
 */
export const generate2FASecret = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("User not found");

    const secret = generateSecret();
    const otpauth = generateURI({
      issuer: "TrustCert",
      label: user.email,
      secret,
    });
    
    return { secret, otpauth };
  },
});

/**
 * Verify the first TOTP code and enable 2FA for the user.
 */
export const verifyAndEnable2FA = mutation({
  args: { 
    userId: v.id("users"), 
    secret: v.string(), 
    code: v.string() 
  },
  handler: async (ctx, args) => {
    const isValid = await verify({
      token: args.code,
      secret: args.secret,
    });

    if (!isValid) {
      throw new Error("Invalid verification code. Please try again.");
    }

    await ctx.db.patch(args.userId, {
      twoFactorEnabled: true,
      twoFactorSecret: args.secret,
    });

    return true;
  },
});

/**
 * Disable 2FA for a user.
 */
export const disable2FA = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      twoFactorEnabled: false,
      twoFactorSecret: undefined,
    });
    return true;
  },
});

/**
 * Verify a 2FA code during login.
 */
export const verify2FACode = mutation({
  args: { 
    userId: v.id("users"), 
    code: v.string() 
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user || !user.twoFactorSecret || !user.twoFactorEnabled) {
      throw new Error("2FA is not enabled for this user.");
    }

    const isValid = await verify({
      token: args.code,
      secret: user.twoFactorSecret,
    });

    if (!isValid) {
      throw new Error("Invalid 2FA code.");
    }

    // Record Login in Audit Logs after successful 2FA verification
    await recordAuditLog(ctx, {
      companyId: user.companyId,
      userId: user._id,
      action: "USER_LOGIN",
      details: `User logged in with 2FA`,
      metadata: {
        method: "2FA",
      },
    });

    return {
      userId: user._id,
      companyId: user.companyId,
      role: user.role,
      email: user.email,
      first_name: user.firstName,
      last_name: user.surname,
      needsPasswordChange: user.needsPasswordChange ?? false,
      has_completed_tour: user.has_completed_tour ?? false,
    };
  },
});
