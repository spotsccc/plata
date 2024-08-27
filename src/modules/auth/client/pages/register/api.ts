import { createMutation } from "@farfetched/core";
import { trpc } from "~/client/api";
import type { RegisterInput } from "~/modules/auth/lib/inputs";

export const registerMutation = createMutation({
  handler(input: RegisterInput) {
    return trpc.auth.register.mutate(input);
  },
});
