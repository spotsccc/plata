import { Account, Money } from "./model";

export function updateBalance(
  account: Account,
  updatedSegment: Money,
): Account {
  return {
    ...account,
    balance: {
      ...account.balance,
      [updatedSegment.currency]: updatedSegment,
    },
  };
}
