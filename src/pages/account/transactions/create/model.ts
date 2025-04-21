import {
  action,
  atom,
  computed,
  sleep,
  withAsync,
  withAsyncData,
  withChangeHook,
  wrap,
} from "@reatom/core";
import { router } from "../../../../router";
import { getCurrencies } from "../../../../infra/currency/get-currencies";
import { applyTransaction, getAccount } from "../../../../lib/finance/account";
import { Transaction } from "../../../../lib/finance/transaction";

export type Step = "currency" | "amount" | "final" | "category" | "recepient";

const STEPS_BY_TYPE: Record<"income" | "expense" | "transfer", Step[]> = {
  income: ["currency", "amount", "final"],
  expense: ["currency", "amount", "category", "final"],
  transfer: ["currency", "amount", "recepient", "final"],
};

export const $type = atom<"income" | "expense" | "transfer">("income");

export const $accountId = atom<string>("");

export const $account = computed(async () => {
  const account = await wrap(getAccount($accountId()));
  return account;
}).extend(withAsyncData());

export const $step = atom<Step>("currency").extend(
  withChangeHook((value) => {
    router.navigate({
      replace: true,
      to: "/accounts/$id/transactions/create",
      params: { id: $accountId() },
      search: (params) => ({ ...params, step: value }),
    });
  })
);
export const $amount = atom<string>("0").extend(
  withChangeHook((value) => {
    router.navigate({
      replace: true,
      to: "/accounts/$id/transactions/create",
      params: { id: $accountId() },
      search: (params) => ({ ...params, amount: value }),
    });
  })
);

export const $currency = atom<string>("USD").extend(
  withChangeHook((value) => {
    router.navigate({
      replace: true,
      to: "/accounts/$id/transactions/create",
      params: { id: $accountId() },
      search: (params) => ({ ...params, currency: value }),
    });
  })
);

export const $currencySearch = atom<string>("");

export const $currencies = computed(async () => {
  const search = $currencySearch();
  await wrap(sleep(200));
  const currencies = await wrap(getCurrencies(search));
  return currencies;
}).extend(withAsyncData());

export const $description = atom<string>("").extend(
  withChangeHook((value) => {
    router.navigate({
      replace: true,
      to: "/accounts/$id/transactions/create",
      params: { id: $accountId() },
      search: (params) => ({ ...params, description: value }),
    });
  })
);

export const $category = atom<string>("").extend(
  withChangeHook((value) => {
    router.navigate({
      replace: true,
      to: "/accounts/$id/transactions/create",
      params: { id: $accountId() },
      search: (params) => ({ ...params, category: value }),
    });
  })
);

export const $recepientId = atom<string>("").extend(
  withChangeHook((value) => {
    router.navigate({
      replace: true,
      to: "/accounts/$id/transactions/create",
      params: { id: $accountId() },
      search: (params) => ({ ...params, recepient: value }),
    });
  })
);

export const pageOpened = action(
  ({
    type,
    id,
    currency,
    amount,
    category,
    recepient,
    step,
  }: {
    type: "income" | "expense" | "transfer";
    id: string;
    currency: string;
    amount: string;
    category: string;
    recepient: string;
    step: Step;
  }) => {
    $type(type);
    $accountId(id);
    $currency(currency);
    $amount(amount);
    $category(category);
    $recepientId(recepient);
    $step(step);
  }
);

export const nextStep = action(() => {
  const steps = STEPS_BY_TYPE[$type()];
  const currentStepIndex = steps.indexOf($step());

  if (currentStepIndex === steps.length - 1) {
    return;
  }

  $step(steps[currentStepIndex + 1]);
});

export const prevStep = action(() => {
  const steps = STEPS_BY_TYPE[$type()];
  const currentStepIndex = steps.indexOf($step());

  if (currentStepIndex === 0) {
    return;
  }

  $step(steps[currentStepIndex - 1]);
});

export const currencySelected = action((currency: string) => {
  $currency(currency);
  nextStep();
});

export const createTransaction = action(async () => {
  const transaction = {
    type: $type(),
    accountId: $accountId(),
    money: {
      amount: $amount(),
      currency: $currency(),
      accuracy: 2,
    },
    description: $description(),
    createdAt: new Date(),
    category: $category(),
    recepientId: $recepientId(),
  };
  await wrap(applyTransaction(transaction as Omit<Transaction, "id">));
}).extend(withAsync());
