import { createQuery } from "@farfetched/core";
import { trpc } from "~/client/shared/api";
import { AccountCreateInput } from "~/server/modules/finance/controllers/accounts/create";

export const createAccountMutation = createQuery({
  async handler(input: AccountCreateInput) {
    return trpc.finance.accounts.create.mutate(input);
  },
});
