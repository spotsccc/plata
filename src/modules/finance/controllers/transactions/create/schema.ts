import { z } from "zod";
import { TransactionType } from "~/modules/finance/lib/model";
import { Currency } from "~/shared/currencies";

const TransactionBase = z.object({
  amount: z.string(),
  currency: z.nativeEnum(Currency),
  accuracy: z.number(),
  accountId: z.number(),
  description: z.string().optional(),
  createdAt: z.string().datetime(),
});

const TransactionIncome = TransactionBase.extend({
  type: z.literal(TransactionType.income),
});

const TransactionExpense = TransactionBase.extend({
  type: z.literal(TransactionType.expense),
  category: z.string(),
});

const TransactionTransfer = TransactionBase.extend({
  receiveAmount: z.string(),
  receiveCurrency: z.nativeEnum(Currency),
  receiveAccuracy: z.number(),
  receiverId: z.number(),
  type: z.literal(TransactionType.transfer),
});

export const TransactionCreateInputSchema = z.discriminatedUnion("type", [
  TransactionIncome,
  TransactionExpense,
  TransactionTransfer,
]);

export type TransactionCreateInput = z.infer<
  typeof TransactionCreateInputSchema
>;
