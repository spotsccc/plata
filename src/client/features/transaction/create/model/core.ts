import { createEvent, createStore, sample } from "effector";
import { persist } from "effector-storage/query";
import { navigate } from "~/client/shared/router";
import { Account } from "~/server/modules/finance/models/account";
import { Currency } from "~/server/modules/finance/models/money";
import { TransactionType } from "~/server/modules/finance/models/transaction";

export type Step =
  | "currency"
  | "amount"
  | "category"
  | "receiver"
  | "receiveCurrency"
  | "receiveAmount"
  | "final";

export const Scenarios: Record<TransactionType, Array<Step>> = {
  [TransactionType.income]: ["currency", "amount", "final"],
  [TransactionType.expense]: ["currency", "amount", "category", "final"],
  [TransactionType.transfer]: [
    "currency",
    "amount",
    "receiver",
    "receiveCurrency",
    "receiveAmount",
    "final",
  ],
};

export const init = createEvent<{
  account: Account;
  type?: TransactionType;
  currency?: Currency;
  amount?: string;
  step?: Step;
  backUrl?: string;
}>();

export const goToNextStep = createEvent();
export const goToPreviousStep = createEvent();

export const $backUrl = createStore<string | null>(null);

export const $step = createStore<Step>("currency");
export const $type = createStore<TransactionType>(TransactionType.income);
export const $account = createStore<Account | null>(null);

persist({
  store: $step,
  key: "step",
});

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
