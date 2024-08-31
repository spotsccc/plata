import { createEvent, createStore, sample } from "effector";
import { navigate } from "~/client/shared/router";
import type { Account } from "~/modules/finance/models/account";
import type { User } from "~/modules/users/lib/models";

export const pageStarted = createEvent<{
  accounts: Array<Account>;
  user: User;
}>();

export const createIncomeTransactionClicked = createEvent<{
  accountId: number;
}>();

export const $accounts = createStore<Array<Account>>([]);

sample({
  clock: pageStarted,
  fn: ({ accounts }) => accounts,
  target: $accounts,
});

sample({
  clock: createIncomeTransactionClicked,
  fn: ({ accountId }) => ({
    path: `/accounts/${accountId}/transactions/create`,
  }),
  target: navigate,
});
