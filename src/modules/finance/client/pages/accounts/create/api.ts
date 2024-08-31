import { createQuery } from "@farfetched/core";
import { trpc } from "~/client/api";
import type { AccountCreateInput } from "~/modules/finance/controllers/accounts/create";

export const createAccountMutation = createQuery({
  async handler(input: AccountCreateInput) {
    return trpc.finance.accounts.create.mutate(input);
  },
});
