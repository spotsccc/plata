import { action, wrap } from "@reatom/core";
import { $user } from "../auth/user";
import { createEmptyMoney, minus, Money, plus } from "./money";
import { getAccount as getAccountInner } from "../../infra/accounts/get-account";
import { updateAccount as updateAccountInner } from "../../infra/accounts/update-account";
import {
  Transaction,
  TransactionExpense,
  TransactionIncome,
  TransactionTransfer,
} from "./transaction";
import { getAccounts as getAccountsInner } from "../../infra/accounts/get-accounts";

export type Balance = Record<string, Money>;

export type Account = {
  id: string;
  name: string;
  defaultCurrency: string;
  balance: Balance;
};

export const getAccount = action(async (accountId: string) => {
  const user = $user();
  if (!user) {
    throw new Error("User not found");
  }

  try {
    const account = await wrap(getAccountInner(user.uid, accountId));
    return account;
  } catch (error) {
    console.log("getAccount error", error);
    throw error;
  }
});

export const updateAccount = action(async (account: Account) => {
  const user = $user();
  if (!user) {
    throw new Error("User not found");
  }
  await wrap(updateAccountInner(user.uid, account));
});

export const getAccounts = action(async () => {
  const user = $user();
  if (!user) {
    throw new Error("User not found");
  }
  return await wrap(getAccountsInner(user.uid));
});

export function updateBalance(
  account: Account,
  updatedSegment: Money
): Account {
  return {
    ...account,
    balance: {
      ...account.balance,
      [updatedSegment.currency]: updatedSegment,
    },
  };
}

export const applyTransaction = action(
  async (transaction: Omit<Transaction, "id">) => {
    switch (transaction.type) {
      case "income":
        return await wrap(
          applyTransactionIncome(transaction as Omit<TransactionIncome, "id">)
        );
      case "transfer":
        return await wrap(
          applyTransactionTransfer(
            transaction as Omit<TransactionTransfer, "id">
          )
        );
      case "expense":
        return await wrap(
          applyTransactionExpense(transaction as Omit<TransactionExpense, "id">)
        );
      default:
        throw new Error("Unexcepted transaction type");
    }
  }
);

const applyTransactionIncome = action(
  async (transaction: Omit<TransactionIncome, "id">) => {
    let account = await wrap(getAccount(transaction.accountId));
    const current =
      account.balance[transaction.money.currency] ??
      createEmptyMoney(transaction.money.currency);

    const updatedCurrent = plus(current, transaction.money);
    account = updateBalance(account, updatedCurrent);
    await wrap(updateAccount(account));
  }
);

const applyTransactionExpense = action(
  async (transaction: Omit<TransactionExpense, "id">) => {
    let account = await wrap(getAccount(transaction.accountId));
    const current = account.balance[transaction.money.currency];

    if (!current) {
      throw new Error("Account has not enought funds");
    }

    const updatedCurrent = minus(current, transaction.money);

    account = updateBalance(account, updatedCurrent);
    await wrap(updateAccount(account));
  }
);

const applyTransactionTransfer = action(
  async (transaction: Omit<TransactionTransfer, "id">) => {
    let account = await wrap(getAccount(transaction.accountId));
    account = updateBalance(
      account,
      minus(account.balance[transaction.money.currency], transaction.money)
    );
    await wrap(updateAccount(account));

    let recepient = await wrap(getAccount(transaction.recepientId));
    recepient = updateBalance(
      recepient,
      plus(recepient.balance[transaction.money.currency], transaction.money)
    );
    await wrap(updateAccount(recepient));
  }
);
