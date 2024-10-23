import { EventSchemas, Inngest } from 'inngest';

import { type EventUnion } from './events';

export const inngest = new Inngest({
  id: 'local-dev',
  schemas: new EventSchemas().fromUnion<EventUnion>(),
  isDev: true,
});
