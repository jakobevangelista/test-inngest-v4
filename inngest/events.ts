export type AppAccountCreated = {
  name: "app/account.created";
  data: {
    email: string;
  };
  user: {
    id: string;
  };
};

export type BillingPaymentFailed = {
  name: "billing/payment.failed";
  data: {
    billingPlan: string;
    paymentId: string;
    reason: string;
  };
  user: {
    id: string;
  };
};

export type BillingPaymentSucceeded = {
  name: "billing/payment.succeeded";
  data: {
    billingPlan: string;
    paymentId: string;
    amount: number;
  };
  user: {
    id: string;
  };
};

export type BillingSubscriptionStarted = {
  name: "billing/subscription.started";
  data: {
    billingPlan: string;
    amount: number;
  };
  user: {
    id: string;
  };
};

export type BillingSubscriptionCancelled = {
  name: "billing/subscription.cancelled";
  data: {
    billingPlan: string;
    amount: number;
  };
  user: {
    id: string;
  };
};

export type TestExamples = {
  name: "test/examples";
  data: {};
};

export type TestWait = {
  name: "test/wait";
  data: {};
};

export type TestFanout = {
  name: "test/fanout";
  data: {};
};

export type TestInvoke = {
  name: "test/invoke";
  data: {};
};

export type TestBatch = {
  name: "test/batch";
  data: {};
};

// Scripts use this type externally
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
  | TestBatch;
