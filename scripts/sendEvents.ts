import { sendEvents } from "../lib/testEvents";

// yarn send <n> <event name>
const n: number = parseInt(process.argv[2] || "100", 10);
const eventName: string | undefined = process.argv[3];

sendEvents(n, eventName);
