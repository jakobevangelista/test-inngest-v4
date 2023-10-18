import casual from "casual";
import { inngest } from "./client";

export const handleFailedPayments = inngest.createFunction(
  { id: "handle-failed-payments", name: "Handle failed payments" },
  { event: "billing/payment.failed" },
  async ({ event, step }) => {
    await step.run("Fetch subscription from Stripe", async () => {
      return { customerId: "cus_1234567890" };
    });

    await step.run("Downgrade account billing plan", async () => {
      if (casual.random > 0.5) {
        throw new Error("Failed to downgrade user");
      }
      return {
        message: `downgraded user ${event.user.id}`,
      };
    });
  }
);

export const sendBillingReceipt = inngest.createFunction(
  { id: "send-billing-receipt", name: "Send billing receipt" },
  { event: "billing/payment.succeeded" },
  async ({ event }) => {
    return {
      success: true,
      message: `Invoice sent`,
    };
  }
);

export const sendSlackNotification = inngest.createFunction(
  { id: "send-slack-notifications", name: "Send Slack notification" },
  { event: "billing/subscription.started" },
  async ({ event }) => {
    return {
      success: true,
      message: `Slack notification sent`,
    };
  }
);

export const sendOfferDiscountForFeedback = inngest.createFunction(
  {
    id: "send-discount-offer-for-user-feedback",
    name: "Send discount offer for user feedback",
  },
  { event: "billing/subscription.cancelled" },
  async ({ event }) => {
    return {
      success: true,
      message: `discount offer sent`,
    };
  }
);
