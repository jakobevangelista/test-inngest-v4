import { sendEvents } from '../lib/testEvents';

// yarn send <n> <event name>
const n: number = parseInt(process.argv[2] || '100', 10);
const eventName: string | undefined = process.argv[3];

async function main() {
  console.log(`Sending start events`);
  await sendEvents(2000, 'test/cancelable.start');

  await new Promise((r) => setTimeout(r, 5000));

  console.log(`Sending cancel events`);
  await sendEvents(1000, 'test/cancelable.cancel');
}
main();
