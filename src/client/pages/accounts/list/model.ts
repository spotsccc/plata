import { createEvent, createStore, sample } from "effector";
import { debug, spread } from "patronum";
import { Account } from "~/server/db/schemas";
import { User } from "~/server/modules/user";

export const pageStarted = createEvent<{
  accounts: Array<Account>;
  user: User;
}>();

debug(pageStarted);

export const $accounts = createStore<Array<Account>>([]);
export const $user = createStore<User | null>(null);

debug($accounts);

sample({
  clock: pageStarted,
  target: spread({
    targets: {
      user: $user,
      accounts: $accounts,
    },
  }),
});
