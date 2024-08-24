import { createSuccess, createError, Result } from "~/shared/result";
import { updateBalance } from "./update-balance";
import {
  Account,
  createEmptyMoney,
  Transaction,
  TransactionExpense,
  TransactionIncome,
  TransactionTransfer,
  TransactionType,
} from "./model";
import { minus } from "./minus";
import { plus } from "./plus";

export type ApplyTransactionErrors = "Account has not enought funds";

export function applyTransaction(
  account: Account,
  transaction: Transaction,
): Result<Account, { type: ApplyTransactionErrors }> {
  switch (transaction.type) {
    case TransactionType.income:
      return createSuccess(applyTransactionIncome(account, transaction));
    case TransactionType.transfer:
      return applyTransactionTransfer(account, transaction);
    case TransactionType.expense:
      return applyTransactionExpense(account, transaction);
    default:
      throw new Error("Unexcepted transaction type");
  }
}

export function applyTransactionIncome(
  account: Account,
  transaction: TransactionIncome,
): Account {
  const current =
    account.balance[transaction.money.currency] ??
    createEmptyMoney(transaction.money.currency);

  const updatedCurrent = plus(current, transaction.money);

  return updateBalance(account, updatedCurrent);
}

export function applyTransactionExpense(
  account: Account,
  transaction: TransactionExpense,
): Result<Account, { type: ApplyTransactionErrors }> {
  const current = account.balance[transaction.money.currency];

  if (!current) {
    return createError({ type: "Account has not enought funds" });
  }

  const updatedCurrent = minus(current, transaction.money);

  return createSuccess(updateBalance(account, updatedCurrent));
}

export function applyTransactionTransfer(
  account: Account,
  transaction: TransactionTransfer,
): Result<Account, { type: ApplyTransactionErrors }> {
  if (account.id === transaction.accountId) {
    let current = account.balance[transaction.money.currency];

    current = minus(current, transaction.money);

    return createSuccess(updateBalance(account, current));
  }

  let current = account.balance[transaction.money.currency];

  current = plus(current, transaction.receiveMoney);

  return createSuccess(updateBalance(account, current));
}
