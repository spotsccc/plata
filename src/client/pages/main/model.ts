import { createEvent, createStore, sample } from "effector";
import { Currency } from "~/shared/currencies";

export const pageStarted = createEvent();

export const $defaultCurrency = createStore<Currency | null>(null);

export const defaultCurrencySelected = createEvent<Currency>();

sample({
  clock: defaultCurrencySelected,
  target: $defaultCurrency,
});
