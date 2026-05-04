import { eventType, staticSchema } from "inngest";

type EmptyData = Record<string, never>;

export type TestExperimentSparseMetricData = {
  emitOptionalCost: boolean;
  optionalCost?: number;
};

type AppEvent<TName extends string, TData extends Record<string, unknown>> = {
  name: TName;
  data: TData;
  id?: string;
  ts?: number;
};

export type AppAccountCreatedData = {
  email: string;
  userId: string;
};

export type BillingPaymentFailedData = {
  billingPlan: string;
  paymentId: string;
  reason: string;
  userId: string;
};

export type BillingPaymentSucceededData = {
  billingPlan: string;
  paymentId: string;
  amount: number;
  userId: string;
};

export type BillingSubscriptionStartedData = {
  billingPlan: string;
  amount: number;
  userId: string;
};

export type BillingSubscriptionCancelledData = {
  billingPlan: string;
  amount: number;
  userId: string;
};

export type TestCancelableData = {
  userId: string;
  randomId: string;
};

export const appAccountCreated = eventType("app/account.created", {
  schema: staticSchema<AppAccountCreatedData>(),
});

export const billingPaymentFailed = eventType("billing/payment.failed", {
  schema: staticSchema<BillingPaymentFailedData>(),
});

export const billingPaymentSucceeded = eventType("billing/payment.succeeded", {
  schema: staticSchema<BillingPaymentSucceededData>(),
});

export const billingSubscriptionStarted = eventType(
  "billing/subscription.started",
  { schema: staticSchema<BillingSubscriptionStartedData>() },
);

export const billingSubscriptionCancelled = eventType(
  "billing/subscription.cancelled",
  { schema: staticSchema<BillingSubscriptionCancelledData>() },
);

export const testExamples = eventType("test/examples", {
  schema: staticSchema<EmptyData>(),
});

export const testWait = eventType("test/wait", {
  schema: staticSchema<EmptyData>(),
});

export const testFanout = eventType("test/fanout", {
  schema: staticSchema<EmptyData>(),
});

export const testInvoke = eventType("test/invoke", {
  schema: staticSchema<EmptyData>(),
});

export const testBatch = eventType("test/batch", {
  schema: staticSchema<EmptyData>(),
});

export const testDebounce = eventType("test/debounce", {
  schema: staticSchema<EmptyData>(),
});

export const testCancel = eventType("test/cancel", {
  schema: staticSchema<EmptyData>(),
});

export const testThrottle = eventType("test/throttle", {
  schema: staticSchema<EmptyData>(),
});

export const testExperimentCheckout = eventType("test/experiment.checkout", {
  schema: staticSchema<EmptyData>(),
});

export const testExperimentFractional = eventType(
  "test/experiment.fractional",
  {
    schema: staticSchema<EmptyData>(),
  },
);

export const testExperimentFailure = eventType("test/experiment.failure", {
  schema: staticSchema<EmptyData>(),
});

export const testExperimentSparseMetric = eventType(
  "test/experiment.sparse-metric",
  {
    schema: staticSchema<TestExperimentSparseMetricData>(),
  },
);

export const testCancelableStart = eventType("test/cancelable.start", {
  schema: staticSchema<TestCancelableData>(),
});

export const testCancelableCancel = eventType("test/cancelable.cancel", {
  schema: staticSchema<TestCancelableData>(),
});

export const eventTypes = {
  appAccountCreated,
  billingPaymentFailed,
  billingPaymentSucceeded,
  billingSubscriptionStarted,
  billingSubscriptionCancelled,
  testExamples,
  testWait,
  testFanout,
  testInvoke,
  testBatch,
  testDebounce,
  testCancel,
  testThrottle,
  testExperimentCheckout,
  testExperimentFractional,
  testExperimentFailure,
  testExperimentSparseMetric,
  testCancelableStart,
  testCancelableCancel,
} as const;

export type AppAccountCreated = AppEvent<
  "app/account.created",
  AppAccountCreatedData
>;

export type BillingPaymentFailed = AppEvent<
  "billing/payment.failed",
  BillingPaymentFailedData
>;

export type BillingPaymentSucceeded = AppEvent<
  "billing/payment.succeeded",
  BillingPaymentSucceededData
>;

export type BillingSubscriptionStarted = AppEvent<
  "billing/subscription.started",
  BillingSubscriptionStartedData
>;

export type BillingSubscriptionCancelled = AppEvent<
  "billing/subscription.cancelled",
  BillingSubscriptionCancelledData
>;

export type TestExamples = AppEvent<"test/examples", EmptyData>;

export type TestWait = AppEvent<"test/wait", EmptyData>;

export type TestFanout = AppEvent<"test/fanout", EmptyData>;

export type TestInvoke = AppEvent<"test/invoke", EmptyData>;

export type TestBatch = AppEvent<"test/batch", EmptyData>;

export type TestDebounce = AppEvent<"test/debounce", EmptyData>;

export type TestCancel = AppEvent<"test/cancel", EmptyData>;

export type TestThrottle = AppEvent<"test/throttle", EmptyData>;

export type TestExperimentCheckout = AppEvent<
  "test/experiment.checkout",
  EmptyData
>;

export type TestExperimentFractional = AppEvent<
  "test/experiment.fractional",
  EmptyData
>;

export type TestExperimentFailure = AppEvent<
  "test/experiment.failure",
  EmptyData
>;

export type TestExperimentSparseMetric = AppEvent<
  "test/experiment.sparse-metric",
  TestExperimentSparseMetricData
>;

export type TestCancelable = AppEvent<
  "test/cancelable.start",
  TestCancelableData
>;

export type TestCancelableEvent = AppEvent<
  "test/cancelable.cancel",
  TestCancelableData
>;

// Scripts use this type externally.
export type EventUnion =
  | AppAccountCreated
  | BillingPaymentFailed
  | BillingPaymentSucceeded
  | BillingSubscriptionStarted
  | BillingSubscriptionCancelled
  | TestExamples
  | TestWait
  | TestFanout
  | TestInvoke
  | TestBatch
  | TestDebounce
  | TestCancel
  | TestThrottle
  | TestExperimentCheckout
  | TestExperimentFractional
  | TestExperimentFailure
  | TestExperimentSparseMetric
  | TestCancelable
  | TestCancelableEvent;
