import { Currency } from "~/shared/currencies";
import {
  Transaction,
  TransactionBase,
  TransactionExpense,
  TransactionTransfer,
  TransactionType,
} from "../models/transaction";
import { TransactionSchema } from "../schemas/transactions";

export function toDatabase(
  transaction: Transaction,
): Omit<TransactionSchema, "id"> {
  return {
    accountId: transaction.accountId,
    createdAt: transaction.createdAt,
    description: transaction.description,
    amount: transaction.money.amount,
    accuracy: transaction.money.accuracy,
    currency: transaction.money.currency,
    type: transaction.type,

    category: (transaction as TransactionExpense).category ?? null,

    receiverId: (transaction as TransactionTransfer).receiverId ?? null,
    receiveAccuracy:
      (transaction as TransactionTransfer).receiveMoney?.accuracy ?? null,
    receiveCurrency:
      (transaction as TransactionTransfer).receiveMoney?.currency ?? null,
    receiveAmount:
      (transaction as TransactionTransfer).receiveMoney?.amount ?? null,
  };
}

export function fromDatabase(transaction: TransactionSchema): Transaction {
  const base: TransactionBase = {
    id: transaction.id,
    accountId: transaction.accountId,
    createdAt: transaction.createdAt,
    description: transaction.description,
    money: {
      amount: transaction.amount,
      currency: transaction.currency as Currency,
      accuracy: transaction.accuracy,
    },
  };
  switch (transaction.type) {
    case TransactionType.income:
      return {
        ...base,
        type: transaction.type,
      };
    case TransactionType.transfer:
      return {
        ...base,
        type: transaction.type,
        receiverId: transaction.receiverId!,
        receiveMoney: {
          amount: transaction.receiveAmount!,
          accuracy: transaction.receiveAccuracy!,
          currency: transaction.receiveCurrency! as Currency,
        },
      };
    case TransactionType.expense:
      return {
        ...base,
        type: transaction.type,
        category: transaction.category!,
      };
    default:
      throw new Error("Unexcepted transaction type");
  }
}
