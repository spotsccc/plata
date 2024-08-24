import { combine, createEvent, createStore, restore, sample } from "effector";
import { Account, Currency } from "~/modules/finance/lib/model";
import { User } from "~/server/modules/user";

export type Step = "currency" | "amount";

export const pageStarted = createEvent<{ account: Account; user: User }>();

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
  fn: ({ account }) => account,
  target: $account,
});
