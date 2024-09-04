import { createMutation } from "@farfetched/core";
import { trpc } from "~/client/shared/api";
import { RegisterInput } from "~/server/modules/auth/controllers/register";

export const registerMutation = createMutation({
  handler(input: RegisterInput) {
    return trpc.auth.register.mutate(input);
  },
});
