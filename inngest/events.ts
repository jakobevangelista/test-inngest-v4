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

// Scripts use this type externally
export type EventUnion =
  | AppAccountCreated
  | BillingPaymentFailed
  | BillingPaymentSucceeded
  | BillingSubscriptionStarted
  | BillingSubscriptionCancelled;
