import { combine, createEvent, restore, sample } from "effector";
import { Currency } from "~/server/modules/finance/models/money";
import { $account, goToNextStep, init } from "./core";
import { persist } from "effector-storage/query";

export type CurrencyView = {
  isDefault: boolean;
  isUsed: boolean;
  value: Currency;
};

export const currencySelected = createEvent<Currency>();
export const searchCurrencyStringChanged = createEvent<string>();

export const $currency = restore(currencySelected, null);

persist({
  store: $currency,
  key: "currency",
});

export const $searchCurrencyString = restore(searchCurrencyStringChanged, "");

export const reinit = createEvent();

export const $filteredCurrencies = combine(
  {
    account: $account,
    searchString: $searchCurrencyString,
  },
  ({ account, searchString }) => {
    return Object.keys(Currency)
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
  clock: init,
  fn: ({ currency }) => currency ?? null,
  target: $currency,
});

sample({
  clock: currencySelected,
  target: goToNextStep,
});

sample({
  clock: reinit,
  target: [$currency.reinit, $searchCurrencyString.reinit],
});
