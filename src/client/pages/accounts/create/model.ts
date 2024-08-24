import { createEvent, restore, sample } from "effector";
import { Currency } from "~/shared/currencies";
import { createAccountMutation } from "./api";
import { navigate } from "~/client/shared/router";

export const pageStarted = createEvent();

export const defaultCurrencySelected = createEvent<Currency>();
export const nameChanged = createEvent<string>();

export const submitted = createEvent();

export const $defaultCurrency = restore(defaultCurrencySelected, null);
export const $name = restore(nameChanged, "");

sample({
  //@ts-ignore
  clock: submitted,
  source: {
    defaultCurrency: $defaultCurrency,
    name: $name,
  },
  target: createAccountMutation.start,
});

sample({
  clock: createAccountMutation.finished.success,
  target: navigate.prepend(() => ({ path: "/accounts" })),
});
