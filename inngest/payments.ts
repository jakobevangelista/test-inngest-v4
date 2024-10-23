import { setTimeout } from 'node:timers/promises';
import casual from 'casual';
import { inngest } from './client';

// export const handleTransaction = inngest.createFunction(
//   { id: 'handle-withdrawal', name: 'Handle withdrawal' },
//   { event: 'transactions/withdraw.requested' },
//   async ({ event, step }) => {
//     const rowId = await step.run('update-database', async () => {
//       const row = await db.transactions.upsert(
//         event.data.accountId,
//         event.data.transaction.amount,
//         event.data.transaction.reason,
//         'pending'
//       );
//       return row.id;
//     });

//     const transactionId = await step.run('update-ledger', async () => {
//       const transactionId = await ledgerService.writeTransaction(
//         event.data.accountId,
//         event.transaction
//       );
//       return transactionId;
//     });

//     await step.run('update-account-balance', async () => {
//       // ...
//     });

//     const mtTransaction = await step.run('initiate-withdrawal', async () => {
//       return await modernTreasury.createLedgerTransaction(
//         event.data.accountId,
//         event.data.transaction.amount
//       );
//     });

//     // Wait up to 7 days for the ledger transaction to settle on Modern Treasury
//     // This waits for an event from the webhook matching the exact ledger transaction ID
//     const confirmationEvent = await step.waitForEvent('wait-for-settlement', {
//       event: 'modern.treasury/finish_processing',
//       timeout: '7d',
//       if: `async.event.data.ledger_transaction_id == ${mtTransaction.ledger_transaction_id}`,
//     });

//     // If it's been confirmed the confirmationEvent from the webhook will be returned
//     // If it's null, the timeout was reached
//     if (confirmationEvent) {
//       await step.run('update-status', async () => {
//         return await db.transactions.update(
//           rowId,
//           'completed'
//         );
//       });
//     } else {
//       await step.run('update-status', async () => {
//         return await db.transactions.update(
//           rowId,
//           'failed'
//         );
//       });
//       await step.run('notify-failure', async () => {
//         return await emailService.sendEmail('failed-withdrawal', {/* ... */})
//       });
//     }
//   }
// );

export const handleFailedPayments = inngest.createFunction(
  { id: 'handle-failed-payments', name: 'Handle failed payments' },
  { event: 'billing/payment.failed' },
  async ({ event, step }) => {
    await step.run('Fetch subscription from Stripe', async () => {
      return { customerId: 'cus_1234567890' };
    });

    await step.run('Downgrade account billing plan', async () => {
      if (casual.random > 0.5) {
        throw new Error('Failed to downgrade user');
      }
      return {
        message: `downgraded user ${event.user.id}`,
      };
    });
  }
);

export const sendBillingReceipt = inngest.createFunction(
  { id: 'send-billing-receipt', name: 'Send billing receipt' },
  { event: 'billing/payment.succeeded' },
  async ({ event, step }) => {
    await step.sleep('pause for 5s', '5s');

    return {
      success: true,
      message: `Invoice sent`,
    };
  }
);

export const forwardEvents = inngest.createFunction(
  { name: 'Events ETL', id: 'billing-etl' },
  [
    { event: 'billing/payment.succeeded' },
    { event: 'billing/payment.failed' },
    { event: 'billing/subscription.started' },
    { event: 'billing/subscription.cancelled' },
  ],
  async ({}) => {
    return {
      success: true,
    };
  }
);

export const sendSlackNotification = inngest.createFunction(
  {
    id: 'send-slack-notifications',
    name: 'Send Slack notification',
    concurrency: 2,
  },
  { event: 'billing/subscription.started' },
  async ({ event, step }) => {
    await step.run('sleep', async () => {
      await setTimeout(5000);
      return 'done!';
    });
    await step.run('sleep', async () => {
      await setTimeout(5000);
      return 'done!';
    });
    await step.run('sleep', async () => {
      await setTimeout(5000);
      return 'done!';
    });

    return {
      success: true,
      message: `Slack notification sent`,
    };
  }
);

export const sendOfferDiscountForFeedback = inngest.createFunction(
  {
    id: 'send-discount-offer-for-user-feedback',
    name: 'Send discount offer for user feedback',
    rateLimit: { limit: 3, period: '10s' },
  },
  { event: 'billing/subscription.cancelled' },
  async ({ event }) => {
    return {
      success: true,
      message: 'x',
      // message: "x".repeat(4 * 1024 * 1024),
      // message: `discount offer sent`,
    };
  }
);
