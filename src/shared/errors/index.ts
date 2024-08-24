import { TRPCClientError } from "@trpc/client";
import type { AppRouter } from "~/server/trpc-router";

export function isTRPCError(
  error: unknown,
): error is TRPCClientError<AppRouter> {
  return error instanceof TRPCClientError;
}
