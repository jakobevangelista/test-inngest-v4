import * as dotenv from "dotenv";

import express from "express";
import { serve } from "inngest/express";

dotenv.config();

import { functions, inngest } from "./inngest";

// Using a port that the dev server doesn't always scan for
const PORT = 3939;

const app = express();

app.use(express.json());
app.get("/", (req, res) => {
  res.json({ success: true });
});

const handler = serve(inngest, [...functions], {
  inngestRegisterUrl:
    process.env.INNGEST_REGISTER_URL ?? "http://localhost:8090/fn/register",
  logLevel: "debug",
});

app.use("/api/inngest", handler);

app.listen(PORT, () => {
  console.log(`✅ Server started on localhost:${PORT}
➡️ Inngest running at http://localhost:${PORT}/api/inngest`);
});
