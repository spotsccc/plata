import { createMutation } from "@farfetched/core";
import { inferProcedureInput } from "@trpc/server";
import { trpc } from "~/client/api";
import type { AppRouter } from "~/server/trpc-router";

type LoginInput = inferProcedureInput<
  AppRouter["_def"]["procedures"]["auth"]["login"]
>;

export const loginMutation = createMutation({
  handler(input: LoginInput) {
    return trpc.auth.login.mutate(input);
  },
});
