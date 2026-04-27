import { inngest } from './client';
import { eventTypes } from './events';

export const invokeMe = inngest.createFunction(
  {
    id: 'invoke-me',
    triggers: { event: eventTypes.testInvoke },
  },
  async ({ step }) => {
    return Promise.all([
      step.run('first step in invoked fn', () => 'FIRST INVOKED!'),
      step.run('second step in invoked fn', () => 'SECOND INVOKED!'),
    ]);
  }
);

export const batch = inngest.createFunction(
  {
    id: 'batch',
    triggers: { event: eventTypes.testBatch },
    batchEvents: { maxSize: 5, timeout: '5s' },
  },
  async ({ events, step }) => {
    await step.run('count', () => events.length);

    return { events, success: true };
  }
);

export const debounce = inngest.createFunction(
  {
    id: 'debounce',
    triggers: { event: eventTypes.testDebounce },
    debounce: { period: '3s' },
  },
  async ({ events, step }) => {
    await step.run('count', () => events.length);

    return { events, success: true };
  }
);

export const throttle = inngest.createFunction(
  {
    id: 'throttle',
    triggers: { event: eventTypes.testThrottle },
    throttle: {
      period: '60s',
      limit: 1,
    },
  },
  async ({}) => {
    return {
      success: true,
    };
  }
);

export const mix = inngest.createFunction(
  { id: 'mix', triggers: { event: eventTypes.testExamples } },
  async ({ step, attempt }) => {
    const first = await step.run('first step', () => 'first!');
    const second = await step.run('second step', () => 'second!');

    const [third, fourth] = await Promise.all([
      step.run('third step', () => 'third!'),
      step.run('fourth step', () => {
        if (attempt === 0) {
          throw new Error('Fails at first attempt');
        }

        return 'fourth!';
      }),
    ]);

    const invokeResult = await step.invoke('invoke that other step', {
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
  }
);

export const simpleInvoke = inngest.createFunction(
  { id: 'simple-invoke', triggers: { event: eventTypes.testExamples } },
  async ({ step }) => {
    return step.invoke('invoke me', {
      function: invokeMe,
      data: {},
    });
  }
);

export const simpleStepErrorRecovery = inngest.createFunction(
  {
    id: 'simple-step-error-recovery',
    triggers: { event: eventTypes.testExamples },
  },
  async ({ step, event, attempt }) => {
    return step.run('my-single-step', () => {
      if (attempt < 3) {
        throw new Error(`Attempt ${attempt} failed!`);
      }

      return { message: 'I was triggered by an event!', event };
    });
  }
);

export const simpleStepFailRecovery = inngest.createFunction(
  {
    id: 'simple-step-fail-recovery',
    triggers: { event: eventTypes.testExamples },
  },
  async ({ step, event }) => {
    try {
      await step.run('my-single-step', () => {
        throw new Error('I was triggered by an event!');
      });
    } catch (err: any) {
      await step.run('my-recovery-step', () => {
        return `I recovered from the error: ${err.message}!`;
      });
    }
  }
);

export const updatingMidRun = inngest.createFunction(
  { id: 'updating-mid-run', triggers: { event: eventTypes.testExamples } },
  async ({ step, attempt }) => {
    if (!attempt) {
      await step.run('first???', () => {
        throw new Error('First threw hmmm');
      });
    } else {
      await step.run('second???', () => {
        return 'Second was fine lmao';
      });
    }
  }
);

export const noStepsSuccess = inngest.createFunction(
  { id: 'no-steps-success', triggers: { event: eventTypes.testExamples } },
  async () => {
    return 'No steps, but still successful!';
  }
);

export const noStepsRecovered = inngest.createFunction(
  { id: 'no-steps-recovered', triggers: { event: eventTypes.testExamples } },
  async ({ attempt }) => {
    if (attempt === 0) {
      throw new Error('No steps, but failed first attempt!');
    }

    return 'No steps, but recovered!';
  }
);

export const noStepsError = inngest.createFunction(
  { id: 'no-steps-error', triggers: { event: eventTypes.testExamples } },
  async () => {
    throw new Error('No steps, but failed permanently!');
  }
);

export const simpleSequentialSuccess = inngest.createFunction(
  {
    id: 'simple-sequential-success',
    triggers: { event: eventTypes.testExamples },
  },
  async ({ step }) => {
    const first = await step.run('STEP_ID_1', () => 'first!');
    const second = await step.run('STEP_ID_2', () => 'second!');

    return { first, second };
  }
);

export const simpleParallelSuccess = inngest.createFunction(
  {
    id: 'simple-parallel-success',
    triggers: { event: eventTypes.testExamples },
  },
  async ({ step }) => {
    const [first, second] = await Promise.all([
      step.run('STEP_ID_1', () => 'first!'),
      step.run('STEP_ID_2', () => 'second!'),
    ]);

    return { first, second };
  }
);

export const parallelRecovery = inngest.createFunction(
  { id: 'parallel-recovery', triggers: { event: eventTypes.testExamples } },
  async ({ step, attempt }) => {
    const run = (id: string) => {
      return step.run(id, async () => {
        if (attempt < 2) {
          throw new Error('Failed!');
        }

        return `${id} - done!`;
      });
    };

    const [first, second] = await Promise.all([
      run('STEP_ID_1'),
      run('STEP_ID_2'),
    ]);

    return { first, second };
  }
);

export const waitError = inngest.createFunction(
  {
    id: 'wait-error',
    triggers: { event: eventTypes.testExamples },
    cancelOn: [{ event: eventTypes.testCancel }],
  },
  async ({ step }) => {
    await step.waitForEvent('wait-step-id', {
      event: eventTypes.testWait,
      if: 'invalid(expression__sd-f+*here)',
      timeout: '5m',
    });
  }
);

export const cancelableExpression = inngest.createFunction(
  {
    id: 'cancelable-expression',
    triggers: { event: eventTypes.testCancelableStart },
    cancelOn: [
      {
        event: eventTypes.testCancelableCancel,
        if: `event.data.userId > async.data.userId`,
      },
    ],
  },
  async ({ step }) => {
    // Pause it so we can cancel it
    await step.sleep('wait', '5m');
    return {
      success: true,
    };
  }
);

export const waitSuccess = inngest.createFunction(
  { id: 'wait-success', triggers: { event: eventTypes.testExamples } },
  async ({ step }) => {
    // TODO Trigger the event
    await step.waitForEvent('wait-step-id', {
      event: eventTypes.testWait,
      timeout: '1s',
    });
  }
);

export const waitTimeout = inngest.createFunction(
  { id: 'wait-timeout', triggers: { event: eventTypes.testExamples } },
  async ({ step }) => {
    await step.waitForEvent('wait-step-id', {
      event: eventTypes.testWait,
      timeout: '1s',
    });
  }
);

export const sleepThenStep = inngest.createFunction(
  { id: 'sleep-then-step', triggers: { event: eventTypes.testExamples } },
  async ({ step }) => {
    await step.sleep('wait-a-sec', '1s');
    await step.run('my-step', () => 'I ran after 1 second!');
  }
);

export const sleepThenStepRecovery = inngest.createFunction(
  {
    id: 'sleep-then-step-recovery',
    triggers: { event: eventTypes.testExamples },
  },
  async ({ step, attempt }) => {
    await step.sleep('wait-a-sec', '1s');

    await step.run('my-step', () => {
      if (!attempt) {
        throw new Error('I failed the first time!');
      }

      return 'I ran after 1 second!';
    });
  }
);

export const fanoutTarget = inngest.createFunction(
  { id: 'fanout-target', triggers: { event: eventTypes.testFanout } },
  async (event) => {
    return { message: 'I was triggered by a fanout event!', event };
  }
);

export const fanout = inngest.createFunction(
  { id: 'fanout', triggers: { event: eventTypes.testExamples } },
  async ({ step }) => {
    await step.sendEvent('fanout-step', eventTypes.testFanout.create({}));
  }
);

export const singleton = inngest.createFunction(
  {
    id: 'singleton',
    triggers: { event: eventTypes.testExamples },
    singleton: {
      key: "event.data.user_id",
      mode: "skip",
    },
  },
  async ({ step }) => {
    await step.run('first step in singleton fn', () => 'There can only be one');
  }
);
