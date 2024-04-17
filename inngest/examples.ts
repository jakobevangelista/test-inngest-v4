import { inngest } from "./client";

export const invokeMe = inngest.createFunction(
  {
    id: "invoke-me",
  },
  { event: "test/invoke" },
  async ({ step }) => {
    return Promise.all([
      step.run("first step in invoked fn", () => "FIRST INVOKED!"),
      step.run("second step in invoked fn", () => "SECOND INVOKED!"),
    ]);
  },
);

export const batch = inngest.createFunction(
  { id: "batch", batchEvents: { maxSize: 5, timeout: "5s" } },
  { event: "test/batch" },
  async ({ events, step }) => {
    await step.run("count", () => events.length);

    return { events, success: true };
  },
);

export const mix = inngest.createFunction(
  { id: "mix" },
  { event: "test/examples" },
  async ({ step, attempt }) => {
    const first = await step.run("first step", () => "first!");
    const second = await step.run("second step", () => "second!");

    const [third, fourth] = await Promise.all([
      step.run("third step", () => "third!"),
      step.run("fourth step", () => {
        if (attempt === 0) {
          throw new Error("Fails at first attempt");
        }

        return "fourth!";
      }),
    ]);

    const invokeResult = await step.invoke("invoke that other step", {
      function: invokeMe,
      data: {},
    });

    return {
      first,
      second,
      third,
      fourth,
      invokeResult,
    };
  },
);

export const simpleInvoke = inngest.createFunction(
  { id: "simple-invoke" },
  { event: "test/examples" },
  async ({ step }) => {
    return step.invoke("invoke me", {
      function: invokeMe,
      data: {},
    });
  },
);

export const simpleStepErrorRecovery = inngest.createFunction(
  { id: "simple-step-error-recovery" },
  { event: "test/examples" },
  async ({ step, event, attempt }) => {
    return step.run("my-single-step", () => {
      if (attempt < 3) {
        throw new Error(`Attempt ${attempt} failed!`);
      }

      return { message: "I was triggered by an event!", event };
    });
  },
);

export const simpleStepFailRecovery = inngest.createFunction(
  { id: "simple-step-fail-recovery" },
  { event: "test/examples" },
  async ({ step, event }) => {
    try {
      await step.run("my-single-step", () => {
        throw new Error("I was triggered by an event!");
      });
    } catch (err: any) {
      await step.run("my-recovery-step", () => {
        return `I recovered from the error: ${err.message}!`;
      });
    }
  },
);

export const updatingMidRun = inngest.createFunction(
  { id: "updating-mid-run" },
  { event: "test/examples" },
  async ({ step, attempt }) => {
    if (!attempt) {
      await step.run("first???", () => {
        throw new Error("First threw hmmm");
      });
    } else {
      await step.run("second???", () => {
        return "Second was fine lmao";
      });
    }
  },
);

export const noStepsSuccess = inngest.createFunction(
  { id: "no-steps-success" },
  { event: "test/examples" },
  async () => {
    return "No steps, but still successful!";
  },
);

export const noStepsRecovered = inngest.createFunction(
  { id: "no-steps-recovered" },
  { event: "test/examples" },
  async ({ attempt }) => {
    if (attempt === 0) {
      throw new Error("No steps, but failed first attempt!");
    }

    return "No steps, but recovered!";
  },
);

export const noStepsError = inngest.createFunction(
  { id: "no-steps-error" },
  { event: "test/examples" },
  async () => {
    throw new Error("No steps, but failed permanently!");
  },
);

export const simpleSequentialSuccess = inngest.createFunction(
  { id: "simple-sequential-success" },
  { event: "test/examples" },
  async ({ step }) => {
    const first = await step.run("STEP_ID_1", () => "first!");
    const second = await step.run("STEP_ID_2", () => "second!");

    return { first, second };
  },
);

export const simpleParallelSuccess = inngest.createFunction(
  { id: "simple-parallel-success" },
  { event: "test/examples" },
  async ({ step }) => {
    const [first, second] = await Promise.all([
      step.run("STEP_ID_1", () => "first!"),
      step.run("STEP_ID_2", () => "second!"),
    ]);

    return { first, second };
  },
);

export const parallelRecovery = inngest.createFunction(
  { id: "parallel-recovery" },
  { event: "test/examples" },
  async ({ step, attempt }) => {
    const run = (id: string) => {
      return step.run(id, async () => {
        if (attempt < 2) {
          throw new Error("Failed!");
        }

        return `${id} - done!`;
      });
    };

    const [first, second] = await Promise.all([
      run("STEP_ID_1"),
      run("STEP_ID_2"),
    ]);

    return { first, second };
  },
);

export const waitError = inngest.createFunction(
  { id: "wait-error" },
  { event: "test/examples" },
  async ({ step }) => {
    await step.waitForEvent("wait-step-id", {
      event: "test/wait",
      if: "invalid(expression__sd-f+*here)",
      timeout: "1h",
    });
  },
);

export const waitSuccess = inngest.createFunction(
  { id: "wait-success" },
  { event: "test/examples" },
  async ({ step }) => {
    // TODO Trigger the event
    await step.waitForEvent("wait-step-id", {
      event: "test/wait",
      timeout: "1s",
    });
  },
);

export const waitTimeout = inngest.createFunction(
  { id: "wait-timeout" },
  { event: "test/examples" },
  async ({ step }) => {
    await step.waitForEvent("wait-step-id", {
      event: "test/wait",
      timeout: "1s",
    });
  },
);

export const sleepThenStep = inngest.createFunction(
  { id: "sleep-then-step" },
  { event: "test/examples" },
  async ({ step }) => {
    await step.sleep("wait-a-sec", "1s");
    await step.run("my-step", () => "I ran after 1 second!");
  },
);

export const sleepThenStepRecovery = inngest.createFunction(
  { id: "sleep-then-step-recovery" },
  { event: "test/examples" },
  async ({ step, attempt }) => {
    await step.sleep("wait-a-sec", "1s");

    await step.run("my-step", () => {
      if (!attempt) {
        throw new Error("I failed the first time!");
      }

      return "I ran after 1 second!";
    });
  },
);

export const fanoutTarget = inngest.createFunction(
  { id: "fanout-target" },
  { event: "test/fanout" },
  async (event) => {
    return { message: "I was triggered by a fanout event!", event };
  },
);

export const fanout = inngest.createFunction(
  { id: "fanout" },
  { event: "test/examples" },
  async ({ step }) => {
    await step.sendEvent("fanout-step", {
      name: "test/fanout",
      data: {},
    });
  },
);
