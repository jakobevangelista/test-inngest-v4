import { inngest } from "./client";
import { eventTypes } from "./events";

export const sendWelcomeEmail = inngest.createFunction(
  {
    id: "send-welcome-email",
    name: "Send Welcome Email",
    triggers: { event: eventTypes.appAccountCreated },
  },
  async ({ event, events, runId }) => {
    // console.log(event)
    console.log(runId)
    console.log(events)

    return {
      success: true,
      message: `welcome email sent to user: ${event.data.userId}`,
    };
  }
);

export const sendUpgradeEmail = inngest.createFunction(
  {
    id: "send-upgrade-email",
    name: "Send Upgrade Email",
    triggers: { event: eventTypes.billingSubscriptionStarted },
  },
  async ({ event }) => {
    return {
      success: true,
      message: `upgrade email sent to user: ${event.data.userId}`,
    };
  }
);
