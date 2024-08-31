import { z } from "zod";
import { createError, createSuccess, isError } from "~/shared/result";
import { applyTransaction } from "../../models/apply-transaction";
import {
  TransactionType,
  Transaction,
  TransactionBase as TransactionBaseModel,
} from "../../models/transaction";
import { getAccountById } from "../../repository/get-account-by-id";
import { saveAccount } from "../../repository/save-account";
import { saveTransaction } from "../../repository/save-transaction";
import { Context } from "~/server/context";
import { Currency } from "../../models/money";

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

export const transactionCreateInput = z.discriminatedUnion("type", [
  TransactionIncome,
  TransactionExpense,
  TransactionTransfer,
]);

export type TransactionCreateInput = z.infer<typeof transactionCreateInput>;

type Request = {
  input: TransactionCreateInput;
  ctx: Context;
};

export async function transactionCreateController({ input, ctx }: Request) {
  let transaction = transactionFromInput(input);

  let account = await getAccountById(transaction.accountId);

  if (!account) {
    return createError({ type: "Account does not exist" });
  }

  if (account.userId !== ctx.user?.id) {
    return createError({ type: "Permission denied" });
  }

  if (transaction.type === TransactionType.transfer) {
    const receiverAccount = await getAccountById(transaction.receiverId);

    if (!receiverAccount) {
      return createError({ type: "Receive account does not exist" });
    }

    const applyTransferResult = applyTransaction(receiverAccount, transaction);

    if (isError(applyTransferResult)) {
      return applyTransferResult;
    }

    await saveAccount(applyTransferResult.success);
  }

  const applyTransactionResult = applyTransaction(account, transaction);

  if (isError(applyTransactionResult)) {
    return applyTransactionResult;
  }
  console.log(1);
  await saveAccount(applyTransactionResult.success);
  console.log(2);
  transaction = await saveTransaction(transaction);
  console.log(3);
  return createSuccess(transaction);
}

function transactionFromInput(input: TransactionCreateInput): Transaction {
  const base: TransactionBaseModel = {
    money: {
      accuracy: input.accuracy,
      currency: input.currency,
      amount: input.amount,
    },
    createdAt: new Date(),
    description: input.description ?? null,
    accountId: input.accountId,
  };
  switch (input.type) {
    case TransactionType.income:
      return {
        ...base,
        type: input.type,
      };
    case TransactionType.transfer:
      return {
        ...base,
        type: input.type,
        receiverId: input.receiverId,
        receiveMoney: {
          amount: input.receiveAmount,
          currency: input.receiveCurrency,
          accuracy: input.receiveAccuracy,
        },
      };
    case TransactionType.expense:
      return {
        ...base,
        type: input.type,
        category: input.category,
      };
    default:
      throw new Error("Unexcepted transaction type");
  }
}
