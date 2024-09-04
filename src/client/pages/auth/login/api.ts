import { createMutation } from "@farfetched/core";
import { trpc } from "~/client/shared/api";
import { LoginInput } from "~/server/modules/auth/controllers/login";

export const loginMutation = createMutation({
  handler(input: LoginInput) {
    return trpc.auth.login.mutate(input);
  },
});
