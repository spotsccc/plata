import { Account } from "./account";
import { Money } from "./money";

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
