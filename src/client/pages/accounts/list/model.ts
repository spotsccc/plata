import { createEvent, createStore, sample } from "effector";
import { Router } from "next/router";
import { $currentUrl, navigate } from "~/client/shared/router";
import { Account } from "~/server/modules/finance/models/account";
import { User } from "~/server/modules/users/models/user";

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
  source: $currentUrl,
  fn: (currentUrl, { accountId }) => ({
    path: `/accounts/${accountId}/transactions/create?type=income&step=currency&backUrl=${currentUrl}`,
  }),
  target: navigate,
});
