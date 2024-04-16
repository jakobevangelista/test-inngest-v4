import { type InngestFunction } from "inngest";
import * as emails from "./emails";
import * as examples from "./examples";
import * as payments from "./payments";
import * as test from "./test";

export const functions = [
  ...Object.values(emails),
  ...Object.values(payments),
  ...Object.values(test),
  ...Object.values(examples),
] as InngestFunction.Any[];

export { inngest } from "./client";
