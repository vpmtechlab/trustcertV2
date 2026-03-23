import { NextResponse } from "next/server";
import { fetchQuery, fetchMutation } from "convex/nextjs";
import { api } from "@/convex/_generated/api";

// Simulate external data engine payloads (BRS, iTax, DCI)
const generateMockPayload = (serviceType: string, requestData: any) => {
  const isKRA = serviceType.toLowerCase().includes("kra") || serviceType.toLowerCase().includes("pin");
  const isAML = serviceType.toLowerCase().includes("aml");

  if (isKRA) {
    return {
      pin: requestData.pin || "P000000000X",
      taxpayerName: requestData.firstName ? `${requestData.firstName} ${requestData.surname}` : "JOHN DOE",
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
    registrationNumber: requestData.regNo || "PVT-XY12345",
    companyName: requestData.companyName || "VERIFIED COMPANY LTD",
    status: "Registered",
    dateOfIncorporation: "2020-01-15",
    directors: [
      { name: "Jane Doe", idNumber: "12345678", nationality: "Kenyan" },
      { name: "John Smith", idNumber: "87654321", nationality: "Kenyan" }
    ],
    address: {
      poBox: "123-00100",
      city: "Nairobi",
      building: "Trust Tower"
    }
  };
};

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Missing or invalid API key" }, { status: 401 });
    }

    const apiKey = authHeader.replace("Bearer ", "");

    // 1. Verify API Key and get company
    const company = await fetchQuery(api.users.verifyApiKey, { apiKey });
    
    if (!company) {
      return NextResponse.json({ error: "Unauthorized. Invalid or inactive API key." }, { status: 401 });
    }

    const body = await req.json();
    const { userId, serviceType, entityData, source = "rest_api" } = body;

    if (!userId || !serviceType || !entityData) {
      return NextResponse.json({ error: "Missing required fields (userId, serviceType, entityData)" }, { status: 400 });
    }

    // 2. Deduct Balance ($15 fixed for MVP)
    const verificationCost = 15;
    try {
      await fetchMutation(api.users.deductBalance, { 
        companyId: company._id, 
        amount: verificationCost 
      });
    } catch (error: any) {
      return NextResponse.json({ error: error.message || "Balance deduction failed" }, { status: 402 }); // 402 Payment Required
    }

    // 3. Create Pending Job
    const jobId = await fetchMutation(api.verifications.createVerification, {
      companyId: company._id,
      userId,
      serviceType,
      entityData,
      source
    });

    // 4. Simulate Data Engine Processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // 5. Generate Mock Response and Complete Job
    const mockPayload = generateMockPayload(serviceType, entityData);
    
    await fetchMutation(api.verifications.completeVerification, {
      jobId,
      resultStatus: "approved",
      message: "Verification completed successfully",
      resultPayload: mockPayload
    });

    // 6. Return Data to client
    return NextResponse.json({
      success: true,
      jobId,
      status: "approved",
      data: mockPayload
    });

  } catch (error: any) {
    console.error("Verification API Error:", error);
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}
