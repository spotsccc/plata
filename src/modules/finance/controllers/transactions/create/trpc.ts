import { authProcedure } from "~/server/trpc";
import { TransactionCreateInputSchema } from "./schema";
import { transactionCreateController } from ".";

export const createTransactionProcuderu = authProcedure
  .input(TransactionCreateInputSchema)
  .mutation(transactionCreateController);
