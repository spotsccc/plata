import { createMutation } from "@farfetched/core";
import { inferProcedureInput } from "@trpc/server";
import { trpc } from "~/client/api";
import type { AppRouter } from "~/server/trpc-router";

type CreateAccountInput = inferProcedureInput<
  AppRouter["_def"]["procedures"]["accounts"]["create"]
>;

export const createAccountMutation = createMutation({
  handler(input: CreateAccountInput) {
    return trpc.accounts.create.mutate(input);
  },
});
