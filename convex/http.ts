import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

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

export default http;
