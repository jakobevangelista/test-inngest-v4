import casual from "casual";
import { inngest } from "../inngest";
import type { EventUnion } from "../inngest/events";

// We re-use user ids to ensure that some users have multiple events
const USER_IDS = [
  "211bdb20-0708-4a65-b07e-9ceb73fd9f36",
  "25b06b25-9432-4213-ad58-701de2faa169",
  "c6d3ad5b-c38d-4823-a8c5-c014258a4a7b",
  "bdce1b1b-6e3a-43e6-84c2-2deb559cdde6",
  "cb1518b8-a4dd-4628-9cde-67625777cbe4",
  "5f8996f5-fec8-43f1-9919-ba56d1b75349",
  "17ca4ff6-45ea-4149-9b48-6fa935b8323a",
  "ec8e1911-a6fd-490b-af92-2d7659a680d8",
  "d258a90d-7d73-4eb8-909e-c2b210330e7c",
  "5d66e25b-6d71-41a2-9ba3-7e9290b5d0e8",
];

const BILLING_PLANS: Record<string, number> = {
  hobby: 0,
  pro: 20,
  enterprise: 1000,
};

type EventNames = Pick<EventUnion, "name">["name"];
const EVENTS: EventNames[] = [
  "app/account.created",
  "billing/payment.succeeded",
  "billing/payment.failed",
  "billing/subscription.started",
  "billing/subscription.cancelled",
  "test/experiment.checkout",
  "test/experiment.fractional",
  "test/experiment.failure",
  "test/experiment.sparse-metric",
];

function createRandomEventData(name: EventNames): EventUnion["data"] {
  const billingPlan: keyof typeof BILLING_PLANS = casual.random_element(
    Object.keys(BILLING_PLANS),
  );
  const userId = casual.random_element(USER_IDS);

  switch (name) {
    case "app/account.created":
      return {
        email: casual.email,
        userId,
      };
    case "billing/payment.succeeded":
      return {
        billingPlan,
        paymentId: casual.uuid,
        amount: BILLING_PLANS[billingPlan],
        userId,
      };
    case "billing/payment.failed":
      return {
        billingPlan,
        paymentId: casual.uuid,
        reason: casual.word,
        userId,
      };
    case "billing/subscription.started":
    case "billing/subscription.cancelled":
      return {
        billingPlan,
        amount: BILLING_PLANS[billingPlan],
        userId,
      };
    case "test/cancelable.start":
    case "test/cancelable.cancel":
      return {
        userId,
        randomId: casual.uuid,
      };
    case "test/experiment.sparse-metric":
      return {
        emitOptionalCost: false,
      };
    default:
      return {};
  }
}

function generateRandomTimestampWithinDays(days = 1): number {
  const start = new Date(new Date().valueOf() - 1000 * 60 * 60 * 24 * days);
  const end = new Date();
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  ).valueOf();
}

function createRandomEvent(eventName?: string) {
  const name = (eventName || casual.random_element(EVENTS)) as EventNames;
  const data = createRandomEventData(name);
  return {
    name,
    data,
    ts: generateRandomTimestampWithinDays(1),
  } as EventUnion;
}

function createSparseMetricEvents(n: number): EventUnion[] {
  return Array.from({ length: n }, (_, index) => ({
    name: "test/experiment.sparse-metric",
    data:
      index === 0
        ? {
            emitOptionalCost: true,
            optionalCost: 100,
          }
        : {
            emitOptionalCost: false,
          },
    ts: generateRandomTimestampWithinDays(1),
  }));
}

export function createEvents(n: number, eventName?: string) {
  if (eventName === "test/experiment.sparse-metric") {
    return createSparseMetricEvents(n);
  }

  const events: EventUnion[] = [];
  for (let i = 0; i < n; i++) {
    events.push(createRandomEvent(eventName));
  }
  return events;
}

export async function send(events: EventUnion[]) {
  try {
    await inngest.send(events);
  } catch (err) {
    console.log("ERROR!", err);
  }

  console.log("Events sent!");
}

export async function sendEvents(n: number, eventName?: string) {
  const events = createEvents(n, eventName);

  console.log(`Sending ${events.length} events`);

  return send(events);
}
