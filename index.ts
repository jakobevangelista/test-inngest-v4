import * as dotenv from "dotenv";

import express from "express";
import { serve } from "inngest/express";

dotenv.config();

import { functions, inngest } from "./inngest";
import { sendEvents } from "./lib/testEvents";

// Using a port that the dev server doesn't always scan for
const PORT = 3939;

const app = express();

app.use(express.json());
app.get("/", (req, res) => {
  res.json({ success: true });
});

const handler = serve({
  client: inngest,
  functions,
});

app.use("/api/inngest", handler);

app.listen(PORT, () => {
  const url = `http://localhost:${PORT}/api/inngest`;

  console.log(`✅ Server started on localhost:${PORT}
➡️  Inngest running at ${url}
`);

  fetch(url, { method: "PUT" })
    .then(async (res) => {
      if (res.status === 200) {
        console.log("✅ App registered");
      } else {
        console.error(
          "❌ App registration failed",
          res.status,
          await res.text()
        );
      }

      if (process.argv.length > 2) {
        const n: number = parseInt(process.argv[2] || "100", 10);
        const eventName: string | undefined = process.argv[3];

        return sendEvents(n, eventName);
      }
    })
    .catch(console.error);
});
