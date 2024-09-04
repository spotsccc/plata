import { combine, createEvent, createStore, restore, sample } from "effector";
import { spread } from "patronum";
import { persist } from "effector-storage/query";
import { Currency } from "~/server/modules/finance/models/money";
import { TransactionType } from "~/server/modules/finance/models/transaction";
import { Account } from "~/server/modules/finance/models/account";
import { navigate, stepBack } from "~/client/shared/router";

export type CurrencyView = {
  isDefault: boolean;
  isUsed: boolean;
  value: Currency;
};

export type Step =
  | "type"
  | "currency"
  | "amount"
  | "category"
  | "receiver"
  | "receiveCurrency"
  | "receiveAmount"
  | "final";

export const Scenarios: Record<TransactionType, Array<Step>> = {
  [TransactionType.income]: ["type", "currency", "amount", "final"],
  [TransactionType.expense]: [
    "type",
    "currency",
    "amount",
    "category",
    "final",
  ],
  [TransactionType.transfer]: [
    "type",
    "currency",
    "amount",
    "receiver",
    "receiveCurrency",
    "receiveAmount",
    "final",
  ],
};

export const typeSelected = createEvent<TransactionType>();
export const currencySelected = createEvent<Currency>();
export const amountChanged = createEvent<string>();
export const amountSubmitted = createEvent();
export const searchCurrencyStringChanged = createEvent<string>();

export const backButtonPressed = createEvent();
export const crossButtonPressed = createEvent();

export const categoryChanged = createEvent<string>();

const goToNextStep = createEvent();
const goToPreviousStep = createEvent();

export const $account = createStore<Account | null>(null);
export const $type = restore(typeSelected, null);
export const $currency = restore(currencySelected, null);
export const $searchCurrencyString = restore(searchCurrencyStringChanged, "");
export const $backUrl = createStore<string | null>(null);

export const $amount = restore(amountChanged, "");

export const $category = restore(categoryChanged, "");

export const $step = createStore<Step>("type");

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

export const init = createEvent<{
  account: Account;
  type?: TransactionType;
  currency?: Currency;
  amount?: string;
  category?: string;
  receiveCurrency?: string;
  receiver?: number;
  step?: Step;
  backUrl?: string;
}>();

persist({
  store: $type,
  key: "type",
});

persist({
  store: $currency,
  key: "currency",
});

persist({
  store: $amount,
  key: "amount",
});

persist({
  store: $step,
  key: "step",
});

sample({
  clock: init,
  target: spread({
    targets: {
      account: $account,
      type: $type,
      category: $category,
      amount: $amount,
      currency: $currency,
      step: $step,
      backUrl: $backUrl,
    },
  }),
});

$backUrl.watch(console.log);

sample({
  clock: goToNextStep,
  source: { step: $step, type: $type },
  fn({ step, type }) {
    const currentScenario = Scenarios[type!];
    const indexOfCurrentStep = currentScenario.indexOf(step);

    if (indexOfCurrentStep + 1 > currentScenario.length - 1) {
      return step;
    }

    return currentScenario[indexOfCurrentStep + 1];
  },
  target: $step,
});

sample({
  clock: goToPreviousStep,
  source: { step: $step, type: $type },
  fn({ step, type }) {
    const currentScenario = Scenarios[type!];
    const indexOfCurrentStep = currentScenario.indexOf(step);

    if (indexOfCurrentStep + 1 < 0) {
      return step;
    }

    return currentScenario[indexOfCurrentStep - 1];
  },
  target: $step,
});

sample({
  clock: [currencySelected, amountSubmitted, typeSelected],
  target: goToNextStep,
});

sample({
  clock: backButtonPressed,
  target: goToPreviousStep,
});

sample({
  clock: crossButtonPressed,
  source: { backUrl: $backUrl, account: $account },
  fn: ({ backUrl, account }) => {
    if (backUrl) {
      return { path: backUrl };
    }

    return { path: `/accounts/${account?.id}` };
  },
  target: navigate,
});
