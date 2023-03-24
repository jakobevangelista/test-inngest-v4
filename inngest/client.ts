import { Inngest } from "inngest";

import type { Events } from "./events";

export const inngest = new Inngest<Events>({
  name: "Local Dev",
  inngestBaseUrl: "http://localhost:9999",
});
