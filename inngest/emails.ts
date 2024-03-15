import { inngest } from "./client";

export const sendWelcomeEmail = inngest.createFunction(
  { id: "send-welcome-email", name: "Send Welcome Email" },
  { event: "app/account.created" },
  async ({ event, events, runId }) => {
    // console.log(event)
    console.log(runId)
    console.log(events)

    return {
      success: true,
      message: `welcome email sent to user: ${event.user.id}`,
    };
  }
);

export const sendUpgradeEmail = inngest.createFunction(
  { id: "send-upgrade-email", name: "Send Upgrade Email" },
  { event: "billing/subscription.started" },
  async ({ event }) => {
    return {
      success: true,
      message: `upgrade email sent to user: ${event.user.id}`,
    };
  }
);
