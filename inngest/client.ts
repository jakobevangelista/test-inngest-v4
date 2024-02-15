import { Inngest, EventSchemas } from "inngest";

import { type EventUnion } from "./events";

export const inngest = new Inngest({
  id: "local-dev",
  schemas: new EventSchemas().fromUnion<EventUnion>(),
  baseUrl: process.env.INNGEST_EVENT_API_BASE_URL,
});
