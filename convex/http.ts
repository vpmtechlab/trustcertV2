import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal, api } from "./_generated/api";

const http = httpRouter();

/**
 * Public Webhook for Paystack Payment Notifications.
 * https://[your-deployment].convex.site/paystack/webhook
 */
http.route({
  path: "/paystack/webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const signature = request.headers.get("x-paystack-signature");
    if (!signature) {
      return new Response("No signature provided", { status: 400 });
    }

    const body = await request.text();

    try {
      // Delegate signature verification and event handling to internalAction
      const result = await ctx.runAction(internal.payments.handleWebhook, {
        body,
        signature,
      });

      if (result.success) {
        return new Response("OK", { status: 200 });
      } else {
        return new Response(result.message || "Webhook processing failed", { status: 400 });
      }
    } catch (error) {
      console.error("Webhook route error:", error);
      return new Response("Internal Server Error", { status: 500 });
    }
  }),
});

/**
 * Public REST API: Initiate Verification
 * POST /v1/verifications
 * Headers: X-API-KEY: [YOUR_KEY]
 */
http.route({
  path: "/v1/verifications",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const apiKey = request.headers.get("X-API-KEY") || request.headers.get("x-api-key");
    
    if (!apiKey) {
      return new Response(JSON.stringify({ 
        error: "Unauthorized", 
        message: "Missing X-API-KEY header." 
      }), { 
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    try {
      const payload = (await request.json()) as { 
        type?: string; 
        service_type?: string; 
        data?: Record<string, unknown>; 
        entity_data?: Record<string, unknown>; 
        webhook_url?: string; 
      };
      
      // Execute the verification action logic
      const result = await ctx.runAction(api.api_actions.verifyAndRun, {
        apiKey,
        serviceType: payload.type || payload.service_type || "enhanced_kyc",
        entityData: payload.data || payload.entity_data || {},
        webhookUrl: payload.webhook_url,
      });

      return new Response(JSON.stringify(result), {
        status: result.status || (result.success ? 201 : 400),
        headers: { "Content-Type": "application/json" }
      });

    } catch (err: unknown) {
      const error = err as Error;
      console.error("REST API Error:", error);
      return new Response(JSON.stringify({ 
        error: "Bad Request", 
        message: "Invalid JSON payload or internal error.",
        details: error.message
      }), { 
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
  }),
});

export default http;
