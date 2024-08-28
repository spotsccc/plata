import { createEvent, createStore, sample } from "effector";
import type { Account } from "~/modules/finance/lib/model";
import type { User } from "~/modules/users/lib/models";

export const pageStarted = createEvent<{
  accounts: Array<Account>;
  user: User;
}>();

export const $accounts = createStore<Array<Account>>([]);

sample({
  clock: pageStarted,
  fn: ({ accounts }) => accounts,
  target: $accounts,
});
