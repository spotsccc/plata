import { createMutation } from "@farfetched/core";
import { trpc } from "~/client/api";
import { TransactionCreateInput } from "~/modules/finance/controllers/transaction/create/schema";

export const createTransactionMutation = createMutation({
  async handler(input: TransactionCreateInput) {
    return trpc.transactions.create.mutate(input);
  },
});
