import { createQuery } from "@farfetched/core";
import { trpc } from "~/client/api";
import { AccountCreateInput } from "~/modules/finance/lib/inputs";

export const createAccountMutation = createQuery({
  async handler(input: AccountCreateInput) {
    return trpc.accounts.create.mutate(input);
  },
});
