import { Context } from "~/server/context";
import { TransactionCreateInput } from "./schema";
import { getAccountById } from "~/modules/finance/database/get-account-by-id";
import { createError, createSuccess, isError } from "~/shared/result";
import { applyTransaction } from "~/modules/finance/lib/apply-transaction";
import { saveAccount } from "~/modules/finance/database/save-account";
import { saveTransaction } from "~/modules/finance/database/save-transaction";
import {
  Transaction,
  TransactionBase,
  TransactionType,
} from "~/modules/finance/lib/model";
import { initConfig } from "~/server/config";
import { initializeDatabase } from "~/server/db";

type Request = {
  input: TransactionCreateInput;
  ctx: Context;
};

initConfig();
initializeDatabase();

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

  await saveAccount(applyTransactionResult.success);
  transaction = await saveTransaction(transaction);

  return createSuccess(transaction);
}

export type Request1 = {
  ctx: Context;
  input: {
    accountId: number;
  };
};

export async function transactionCreateQuery({ ctx, input }: Request1) {
  const account = await getAccountById(input.accountId);

  if (!account) {
    return createError({ type: "Account does not exist" });
  }

  if (account.userId !== ctx.user?.id) {
    return createError({ type: "Access denied" });
  }

  return createSuccess({
    account,
    user: ctx.user!,
  });
}

function transactionFromInput(input: TransactionCreateInput): Transaction {
  const base: TransactionBase = {
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