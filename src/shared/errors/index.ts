import { TRPCClientError } from "@trpc/client";
import { AppRouter } from "~/server/trpc";

export function isTRPCError(
  error: unknown,
): error is TRPCClientError<AppRouter> {
  return error instanceof TRPCClientError;
}
