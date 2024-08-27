import { createMutation } from "@farfetched/core";
import { trpc } from "~/client/api";
import { LoginInput } from "~/modules/auth/lib/inputs";

export const loginMutation = createMutation({
  handler(input: LoginInput) {
    return trpc.auth.login.mutate(input);
  },
});
