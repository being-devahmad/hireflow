import { inngest } from "@/utils/inngest/client";
import { serve } from "inngest/next";
import { handleJobExpiration } from "../../../utils/inngest/functions";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [handleJobExpiration],
});
