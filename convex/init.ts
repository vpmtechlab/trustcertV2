import { mutation } from "./_generated/server";

export const seedMockData = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if VPMTechLab super admin exists
    const existing = await ctx.db
      .query("companies")
      .withIndex("by_name", (q) => q.eq("name", "VPMTechLab"))
      .first();

    if (existing) {
      const user = await ctx.db.query("users").withIndex("by_company", (q) => q.eq("companyId", existing._id)).first();
      return { companyId: existing._id, userId: user!._id };
    }

    // Insert Super Admin Company
    const companyId = await ctx.db.insert("companies", {
      name: "VPMTechLab",
      reg_number: "PVT-SUPERADMIN",
      country: "Kenya",
      location: "Nairobi",
      domain: "vpmtechlab.com",
      support_email: "superadmin@vpmtechlab.com",
      status: "active",
      isSuperAdmin: true,
      createdAt: Date.now(),
    });

    // Seed Pricing Configuration
    const pricingConfig = [
      { category: "kyc", id: "national_id", name: "National ID Verification", price: 5.0 },
      { category: "kyc", id: "passport", name: "Passport Verification", price: 10.0 },
      { category: "kyc", id: "drivers_license", name: "Driver's License", price: 8.0 },
      { category: "kyb", id: "business_registration", name: "Business Registration (BRS)", price: 15.0 },
      { category: "kyb", id: "tax_information", name: "KRA PIN & Tax Info", price: 12.0 },
      { category: "aml", id: "individual", name: "AML Individual Check", price: 25.0 },
      { category: "aml", id: "business", name: "AML Business Check", price: 50.0 },
    ];

    for (const p of pricingConfig) {
      await ctx.db.insert("pricing", {
        serviceCategory: p.category,
        serviceId: p.id,
        serviceName: p.name,
        price: p.price,
        updatedAt: Date.now(),
      });
    }

    // Insert Balance
    await ctx.db.insert("balances", {
      companyId,
      availableBalance: 2450.00,
      updatedAt: Date.now(),
    });

    // Insert Super Admin User
    const userId = await ctx.db.insert("users", {
      companyId,
      firstName: "Super",
      surname: "Admin",
      email: "admin@vpmtechlab.com",
      role: "admin",
      status: "active",
      createdAt: Date.now()
    });

    // Insert API Key
    await ctx.db.insert("apiKeys", {
      companyId,
      keyHash: "test_api_key_123", // Simulated hash
      name: "Live Key",
      isActive: true,
      createdAt: Date.now()
    });

    return { companyId, userId };
  },
});
