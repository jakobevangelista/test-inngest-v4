import { Inngest, EventSchemas } from "inngest";

import { type EventUnion } from "./events";

export const inngest = new Inngest({
  name: "Local Dev",
  schemas: new EventSchemas().fromUnion<EventUnion>(),
  inngestBaseUrl: process.env.INNGEST_BASE_URL ?? "http://localhost:9999",
});
