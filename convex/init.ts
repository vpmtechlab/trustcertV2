import { mutation } from "./_generated/server";

// ── Service Seed Data ─────────────────────────────────────────────────────────
// Mirrors the hardcoded SERVICES constant in choose-service.tsx and
// the serviceTypes map in fill-details.tsx.

const SERVICE_SEED = [
  {
    name: "KYC Services",
    slug: "kyc",
    icon: "UserCheck",
    color: "bg-blue-100 text-blue-600",
    order: 1,
    actions: [
      { label: "Enhanced KYC", slug: "enhanced_kyc", order: 1 },
      { label: "Biometric KYC", slug: "biometric_kyc", order: 2 },
      { label: "Document Verification", slug: "document_verification", order: 3 },
    ],
    checkTypes: [
      { label: "NATIONAL ID", slug: "national_id", order: 1, price: 5.0 },
      { label: "PASSPORT", slug: "passport", order: 2, price: 10.0 },
      { label: "DRIVER'S LICENSE", slug: "drivers_license", order: 3, price: 8.0 },
    ],
  },
  {
    name: "KYB Services",
    slug: "kyb",
    icon: "Building2",
    color: "bg-indigo-100 text-indigo-600",
    order: 2,
    actions: [
      { label: "Business Verification", slug: "business_verification", order: 1 },
    ],
    checkTypes: [
      { label: "BUSINESS REGISTRATION", slug: "business_registration", order: 1, price: 15.0 },
      { label: "TAX INFORMATION", slug: "tax_information", order: 2, price: 12.0 },
    ],
  },
  {
    name: "KRA PIN Checker",
    slug: "kra",
    icon: "FileText",
    color: "bg-orange-100 text-orange-600",
    order: 3,
    actions: [
      { label: "PIN Verification", slug: "pin_verification", order: 1 },
    ],
    checkTypes: [
      { label: "KRA PIN CHECK", slug: "kra_pin_check", order: 1, price: 12.0 },
    ],
  },
  {
    name: "User Registration",
    slug: "user_registration",
    icon: "UserPlus",
    color: "bg-green-100 text-green-600",
    order: 4,
    actions: [
      { label: "SmartSelfie™ Authentication (user registration)", slug: "smart_selfie_registration", order: 1 },
    ],
    checkTypes: [],
  },
  {
    name: "AML",
    slug: "aml",
    icon: "Shield",
    color: "bg-purple-100 text-purple-600",
    order: 5,
    actions: [
      { label: "AML Check", slug: "aml_check", order: 1 },
    ],
    checkTypes: [
      { label: "INDIVIDUAL CHECK", slug: "individual", order: 1, price: 25.0 },
      { label: "BUSINESS CHECK", slug: "business", order: 2, price: 50.0 },
    ],
  },
  {
    name: "Biometric 2nd Factor Authentication",
    slug: "biometric_2fa",
    icon: "Fingerprint",
    color: "bg-red-100 text-red-600",
    order: 6,
    actions: [
      { label: "SmartSelfie™ Authentication (authentication)", slug: "smart_selfie_auth", order: 1 },
    ],
    checkTypes: [],
  },
  {
    name: "Address Verification",
    slug: "address_verification",
    icon: "MapPin",
    color: "bg-teal-100 text-teal-600",
    order: 7,
    actions: [
      { label: "Address Verification", slug: "address_verify", order: 1 },
    ],
    checkTypes: [],
  },
];

// ── Mutations ─────────────────────────────────────────────────────────────────

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
      keyHash: "test_api_key_123",
      name: "Live Key",
      isActive: true,
      createdAt: Date.now()
    });

    return { companyId, userId };
  },
});

/**
 * Seeds the service category hierarchy and pricing. Idempotent — skips 
 * categories and price entries that already exist (matched by slug / serviceId).
 */
export const seedServices = mutation({
  args: {},
  handler: async (ctx) => {
    for (const service of SERVICE_SEED) {
      // Check if category already exists
      const existing = await ctx.db
        .query("serviceCategories")
        .withIndex("by_slug", (q) => q.eq("slug", service.slug))
        .first();

      let categoryId = existing?._id;

      if (!existing) {
        categoryId = await ctx.db.insert("serviceCategories", {
          name: service.name,
          slug: service.slug,
          icon: service.icon,
          color: service.color,
          order: service.order,
          isActive: true,
        });
      }

      if (!categoryId) continue;

      // Seed actions (idempotent by slug)
      for (const action of service.actions) {
        const existingAction = await ctx.db
          .query("serviceActions")
          .withIndex("by_category", (q) => q.eq("categoryId", categoryId!))
          .filter((q) => q.eq(q.field("slug"), action.slug))
          .first();

        if (!existingAction) {
          await ctx.db.insert("serviceActions", {
            categoryId: categoryId!,
            label: action.label,
            slug: action.slug,
            enabled: true,
            order: action.order,
          });
        }
      }

      // Seed check types and pricing (idempotent by slug)
      for (const checkType of service.checkTypes) {
        const existingCheckType = await ctx.db
          .query("serviceCheckTypes")
          .withIndex("by_category", (q) => q.eq("categoryId", categoryId!))
          .filter((q) => q.eq(q.field("slug"), checkType.slug))
          .first();

        if (!existingCheckType) {
          await ctx.db.insert("serviceCheckTypes", {
            categoryId: categoryId!,
            label: checkType.label,
            slug: checkType.slug,
            order: checkType.order,
          });
        }

        // Add/Update Pricing
        const existingPrice = await ctx.db
          .query("pricing")
          .withIndex("by_service", (q) => q.eq("serviceId", checkType.slug))
          .first();

        if (!existingPrice) {
          await ctx.db.insert("pricing", {
            serviceCategory: service.slug,
            serviceId: checkType.slug,
            serviceName: checkType.label,
            price: checkType.price,
            updatedAt: Date.now(),
          });
        } else if (existingPrice.price !== checkType.price) {
          // Update price if it changed in seed
          await ctx.db.patch(existingPrice._id, {
            price: checkType.price,
            updatedAt: Date.now(),
          });
        }
      }
    }

    return { seeded: true };
  },
});
