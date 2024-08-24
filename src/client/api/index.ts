import { httpBatchLink, createTRPCClient } from "@trpc/client";
import type { AppRouter } from "~/server/trpc-router";

export const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:3000/api/trpc",
    }),
  ],
});
