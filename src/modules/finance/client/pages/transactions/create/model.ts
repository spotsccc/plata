import { combine, createEvent, createStore, restore, sample } from "effector";
import type { Account } from "~/modules/finance/models/account";
import { Currency } from "~/modules/finance/models/money";
import { User } from "~/server/modules/user";
import { isSuccess, Result, Success } from "~/shared/result";
import { createTransactionMutation } from "./api";
import { TransactionType } from "~/modules/finance/models/transaction";
import { TransactionCreateInput } from "~/modules/finance/controllers/transactions/create";

export type Step = "currency" | "amount";

export const pageStarted =
  createEvent<Result<{ account: Account; user: User }, unknown>>();

export const amountChanged = createEvent<string>();
export const currencySelected = createEvent<Currency>();
export const amountSubmitted = createEvent();
export const searchStringChanged = createEvent<string>();

export const $step = createStore<Step>("currency");
const $availableCurrencies = createStore(Object.keys(Currency));
export const $currencySearchString = restore(searchStringChanged, "");
export const $account = createStore<Account | null>(null);

export const $amount = restore(amountChanged, "");
export const $currency = restore(currencySelected, null);

export const $filteredCurrencies = combine(
  {
    account: $account,
    availableCurrencies: $availableCurrencies,
    searchString: $currencySearchString,
  },
  ({ account, availableCurrencies, searchString }) => {
    return availableCurrencies
      .map((currency) => ({
        isDefault: currency === account?.defaultCurrency,
        isUsed: Object.keys(account?.balance ?? {}).includes(currency),
        value: currency as Currency,
      }))
      .filter((currency) => currency.value.includes(searchString))
      .toSorted((a, b) => {
        if (a.isDefault) {
          return -1;
        }
        if (b.isDefault) {
          return 1;
        }
        if (a.isUsed) {
          return -1;
        }
        if (b.isUsed) {
          return 1;
        }
        return 0;
      });
  },
);

sample({
  clock: currencySelected,
  fn: () => "amount" as const,
  target: $step,
});

sample({
  clock: pageStarted,
  filter: isSuccess,
  fn: (res: Success<{ account: Account; user: User }>) => res.success.account,
  target: $account,
});

sample({
  clock: amountSubmitted,
  source: {
    amount: $amount,
    currency: $currency,
    accountId: $account.map((account) => account?.id!),
  },
  fn({ amount, accountId, currency }) {
    return {
      type: TransactionType.income,
      amount,
      accuracy: 0,
      accountId,
      createdAt: new Date().toISOString(),
      currency: currency as Currency,
    } as TransactionCreateInput;
  },
  target: createTransactionMutation.start,
});
