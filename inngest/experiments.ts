import { experiment } from "inngest";

import { inngest } from "./client";
import { eventTypes } from "./events";

export const checkoutFlowExperiment = inngest.createFunction(
  {
    id: "experiment-checkout-flow",
    triggers: { event: eventTypes.testExperimentCheckout },
    retries: 0,
  },
  async ({ step, group }) => {
    return group.experiment("checkout-flow", {
      variants: {
        control: () =>
          step.run("control-checkout-path", () => ({
            experiment: "checkout-flow",
            variant: "control",
            metrics: {
              conversion: 0.94,
              latency_ms: 820,
              revenue: 120,
            },
            checkoutVersion: "control",
            message: "old checkout",
          })),
        new_flow: () =>
          step.run("new-checkout-path", () => ({
            experiment: "checkout-flow",
            variant: "new_flow",
            metrics: {
              conversion: 0.97,
              latency_ms: 690,
              revenue: 138,
            },
            checkoutVersion: "new_flow",
            message: "new checkout",
          })),
      },
      select: experiment.weighted({ control: 80, new_flow: 20 }),
    });
  },
);

export const fractionalWeightsExperiment = inngest.createFunction(
  {
    id: "experiment-fractional-weights",
    triggers: { event: eventTypes.testExperimentFractional },
    retries: 0,
  },
  async ({ step, group }) => {
    return group.experiment("fraction-weights", {
      variants: {
        control: () =>
          step.run("fraction-control-path", () => ({
            experiment: "fraction-weights",
            variant: "control",
            metrics: {
              conversion: 0.91,
              latency_ms: 910,
              revenue: 101,
            },
            checkoutVersion: "control",
            weights: "0.8/0.2",
          })),
        new_flow: () =>
          step.run("fraction-new-path", () => ({
            experiment: "fraction-weights",
            variant: "new_flow",
            metrics: {
              conversion: 0.96,
              latency_ms: 730,
              revenue: 126,
            },
            checkoutVersion: "new_flow",
            weights: "0.8/0.2",
          })),
      },
      select: experiment.weighted({ control: 0.8, new_flow: 0.2 }),
    });
  },
);

export const riskyCheckoutExperiment = inngest.createFunction(
  {
    id: "experiment-risky-checkout",
    triggers: { event: eventTypes.testExperimentFailure },
    retries: 0,
  },
  async ({ step, group }) => {
    return group.experiment("risky-checkout", {
      variants: {
        control: () =>
          step.run("stable-control-path", () => ({
            experiment: "risky-checkout",
            variant: "control",
            metrics: {
              conversion: 0.93,
              latency_ms: 840,
              revenue: 118,
            },
            checkoutVersion: "control",
            status: "stable",
          })),
        new_flow: () =>
          step.run("risky-new-path", () => {
            throw new Error("new checkout flow failed");
          }),
      },
      select: experiment.weighted({ control: 50, new_flow: 50 }),
    });
  },
);

// Repro for sparse metric aggregation bugs.
//
// Send a mix of events where `optional_cost` is present on only a subset of
// runs. The current monorepo experiment detail query uses JSONExtractFloat for
// aggregation; in ClickHouse, missing JSON float fields read as 0, so the
// dashboard can show avg/min/max values skewed toward zero instead of
// aggregating only over the rows that actually emitted the metric.
//
// Expected repro shape after sending 5 events:
// - 1 event with { emitOptionalCost: true, optionalCost: 100 }
// - 4 events with { emitOptionalCost: false }
//
// Correct aggregate for `optional_cost` over observed rows only would be:
// avg=100, min=100, max=100.
//
// Current buggy aggregate likely becomes:
// avg=20, min=0, max=100.
export const sparseMetricAggregationExperiment = inngest.createFunction(
  {
    id: "experiment-sparse-metric-aggregation",
    triggers: { event: eventTypes.testExperimentSparseMetric },
    retries: 0,
  },
  async ({ event, step, group }) => {
    return group.experiment("sparse-metric-aggregation", {
      variants: {
        control: () =>
          step.run("sparse-control-path", () => ({
            experiment: "sparse-metric-aggregation",
            variant: "control",
            metrics: {
              conversion: 0.95,
              latency_ms: 800,
              ...(event.data.emitOptionalCost
                ? { optional_cost: event.data.optionalCost ?? 100 }
                : {}),
            },
            emittedOptionalCost: event.data.emitOptionalCost,
            optionalCost: event.data.emitOptionalCost
              ? event.data.optionalCost ?? 100
              : null,
            note: event.data.emitOptionalCost
              ? "reported optional_cost"
              : "omitted optional_cost",
          })),
        holdout: () =>
          step.run("sparse-holdout-path", () => ({
            experiment: "sparse-metric-aggregation",
            variant: "holdout",
            metrics: {
              conversion: 0.9,
              latency_ms: 850,
            },
            note: "holdout variant should not be selected in this repro",
          })),
      },
      // Keep the repro deterministic: every run uses the same variant, so the
      // aggregate bug comes only from sparse metric presence, not variant mix.
      select: experiment.weighted({ control: 100, holdout: 0 }),
    });
  },
);
