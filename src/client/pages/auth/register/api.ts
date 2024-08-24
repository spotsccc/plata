import { createMutation } from "@farfetched/core";
import { inferProcedureInput } from "@trpc/server";
import { trpc } from "~/client/api";
import type { AppRouter } from "~/server/trpc-router";

type RegisterInput = inferProcedureInput<
  AppRouter["_def"]["procedures"]["auth"]["register"]
>;

export const registerMutation = createMutation({
  handler(input: RegisterInput) {
    return trpc.auth.register.mutate(input);
  },
});
