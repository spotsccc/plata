import { createEvent, restore, sample } from "effector";
import { createAccountMutation } from "./api";
import type { AccountCreateInput } from "~/modules/finance/lib/inputs";
import type { Currency } from "~/modules/finance/lib/model";

export const submitted = createEvent();
export const nameChanged = createEvent<string>();
export const currencyChanged = createEvent<Currency>();

export const $name = restore(nameChanged, "");
export const $currency = restore(currencyChanged, null);

sample({
  clock: submitted,
  source: {
    name: $name,
    defaultCurrency: $currency,
  },
  filter: (input): input is AccountCreateInput =>
    Boolean(input.defaultCurrency),
  target: createAccountMutation.start,
});
