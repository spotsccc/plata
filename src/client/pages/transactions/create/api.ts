import { createMutation } from "@farfetched/core";
import { trpc } from "~/client/shared/api";
import { TransactionCreateInput } from "~/server/modules/finance/controllers/transactions/create";

export const createTransactionMutation = createMutation({
  async handler(input: TransactionCreateInput) {
    return trpc.finance.transactions.create.mutate(input);
  },
});
